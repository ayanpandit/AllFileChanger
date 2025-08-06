const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const cluster = require("cluster");
const os = require("os");
const path = require("path");
const http = require("http");
const https = require("https");
const { promisify } = require("util");
const LRU = require("lru-cache");

// Environment configuration
const isProduction = process.env.NODE_ENV === "production";

// Performance optimizations
process.env.UV_THREADPOOL_SIZE = Math.min(os.cpus().length * 2, 16);

// ============================================================================
// RENDER DEPLOYMENT CONFIGURATION - START
// ============================================================================

const RENDER_CONFIG = {
    // Render automatically assigns PORT, fallback to 5000 for local dev
    PORT: process.env.PORT || 5000,
    
    // Frontend URLs for CORS (your AllFileChanger frontend)
    FRONTEND_URLS: [
        'https://allfilechanger.onrender.com',    // Your main frontend URL (Render)
        'https://allfilechanger.netlify.app',     // Your secondary frontend URL
        'https://allfilechanger.com',             // Your custom domain (if any)
        'http://localhost:3000',                  // Local development
        'http://localhost:5173',                  // Vite dev server
        'http://localhost:8080',                  // Local test server
        'http://127.0.0.1:3000',                 // Alternative localhost
        'http://127.0.0.1:5173',                 // Alternative Vite
        'http://127.0.0.1:8080'                  // Alternative test
    ],
    
    // Keep-alive settings for Render
    KEEP_ALIVE: {
        enabled: isProduction,
        interval: 13 * 60 * 1000,  // 13 minutes (Render sleeps after 15min)
        selfUrl: process.env.RENDER_EXTERNAL_URL || 'https://imgresizer-qkp0.onrender.com'
    }
};

// Memory management configuration
const MEMORY_LIMITS = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_DIMENSION: 15000,
    CACHE_SIZE: 100, // Number of sessions to cache
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_CONCURRENT: 10,
    REQUEST_TIMEOUT: 300000 // 5 minutes
};

// ============================================================================
// RENDER DEPLOYMENT CONFIGURATION - END
// ============================================================================

// Sharp optimization settings
sharp.cache({ memory: 50 });
sharp.concurrency(Math.max(1, Math.floor(os.cpus().length / 2)));
sharp.simd(true);

// Keep-alive service for Render
class RenderKeepAlive {
    constructor(url, interval) {
        this.url = url;
        this.interval = interval;
        this.timer = null;
    }

    start() {
        if (!RENDER_CONFIG.KEEP_ALIVE.enabled) {
            console.log('🔄 Keep-alive disabled (development mode)');
            return;
        }

        console.log(`💓 Keep-alive service starting (${this.interval / 60000} min intervals)`);
        this.timer = setInterval(() => this.ping(), this.interval);
        
        // Initial ping after 1 minute
        setTimeout(() => this.ping(), 60000);
    }

    ping() {
        if (!this.url || this.url.includes('your-imageresizer')) {
            console.log('⚠️ Keep-alive: URL not configured, skipping ping');
            return;
        }
        
        const url = `${this.url}/health`;
        const client = this.url.startsWith('https') ? https : http;
        
        const req = client.get(url, { timeout: 10000 }, (res) => {
            if (res.statusCode === 200) {
                console.log(`💓 Keep-alive ping successful (${res.statusCode})`);
            } else {
                console.log(`⚠️ Keep-alive ping warning (${res.statusCode})`);
            }
        });
        
        req.on('error', (error) => {
            console.log(`❌ Keep-alive ping failed: ${error.message}`);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            console.log('⏰ Keep-alive ping timeout');
        });
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            console.log('🛑 Keep-alive service stopped');
        }
    }
}

// Multi-core clustering for production
const USE_CLUSTERING = isProduction && process.env.ENABLE_CLUSTERING !== "false";

if (USE_CLUSTERING && cluster.isMaster) {
    const numCPUs = Math.min(os.cpus().length, 3); // Limit workers for resource efficiency
    
    console.log(`🚀 Master ${process.pid} starting ${numCPUs} workers (PRODUCTION)`);
    console.log(`💾 Available memory: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
    
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`💥 Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
        cluster.fork();
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('🛑 Master received SIGTERM, shutting down workers...');
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }
    });
} else {
    // Worker process
    const app = express();
    const PORT = RENDER_CONFIG.PORT;
    
    console.log(`🔧 Starting Image Resizer Worker ${process.pid}`);
    console.log(`🌐 Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(`📱 Frontend URLs: ${RENDER_CONFIG.FRONTEND_URLS.slice(0, 2).join(', ')}`);
    console.log(`🔄 Keep-alive ${RENDER_CONFIG.KEEP_ALIVE.enabled ? 'enabled' : 'disabled'}`);

    // Initialize keep-alive service
    const keepAlive = new RenderKeepAlive(
        RENDER_CONFIG.KEEP_ALIVE.selfUrl,
        RENDER_CONFIG.KEEP_ALIVE.interval
    );
    keepAlive.start();

    // Enhanced CORS configuration
    const corsOptions = {
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, Postman)
            if (!origin) return callback(null, true);
            
            // Allow file:// protocol for local testing
            if (origin.startsWith('file://')) return callback(null, true);
            
            if (RENDER_CONFIG.FRONTEND_URLS.includes(origin)) {
                callback(null, true);
            } else {
                console.log('🚫 CORS blocked origin:', origin);
                callback(null, isProduction ? false : true); // Allow all in development
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID'],
        optionsSuccessStatus: 200,
        maxAge: 86400, // Cache preflight for 24 hours
    };

    app.use(cors(corsOptions));

    // Security and performance middleware
    app.disable("x-powered-by");
    app.set("trust proxy", 1);
    
    // Request parsing with size limits
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: false, limit: "10mb" }));

    // Session management with LRU cache
    const userSessions = new LRU({
        max: MEMORY_LIMITS.CACHE_SIZE,
        ttl: MEMORY_LIMITS.SESSION_TIMEOUT,
        dispose: (key, session) => {
            // Clean up session data
            if (session.buffer) {
                session.buffer = null;
            }
            console.log(`🗑️ Session ${key} expired and cleaned up`);
        }
    });

    // Optimized multer configuration
    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: MEMORY_LIMITS.MAX_FILE_SIZE,
            files: 1,
            fields: 10,
        },
        fileFilter: (req, file, cb) => {
            try {
                const allowedTypes = /jpeg|jpg|png|webp|gif|bmp|tiff|avif|heif|heic/;
                const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = allowedTypes.test(file.mimetype);
                
                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    cb(new Error("Invalid file type. Supported: JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIF, HEIC"));
                }
            } catch (error) {
                cb(new Error("File validation error"));
            }
        }
    });

    // Utility functions
    const generateSessionId = () => `resize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const validateDimensions = (width, height) => {
        const w = width ? parseInt(width) : null;
        const h = height ? parseInt(height) : null;
        
        if (w && (w < 1 || w > MEMORY_LIMITS.MAX_DIMENSION)) return false;
        if (h && (h < 1 || h > MEMORY_LIMITS.MAX_DIMENSION)) return false;
        
        return { width: w, height: h };
    };

    const optimizeImage = async (buffer, options = {}) => {
        let pipeline = sharp(buffer, {
            failOnError: false,
            density: isProduction ? 150 : 300,
            limitInputPixels: 268402689 // ~16k x 16k limit
        });

        // Apply resizing if dimensions provided
        if (options.width || options.height) {
            pipeline = pipeline.resize({
                width: options.width,
                height: options.height,
                fit: "inside",
                withoutEnlargement: true,
                kernel: sharp.kernel.lanczos3
            });
        }

        // Apply rotation if specified
        if (options.rotate) {
            pipeline = pipeline.rotate(options.rotate);
        }

        // Auto-resize large images for performance in production
        if (isProduction) {
            const metadata = await sharp(buffer).metadata();
            if (metadata.width * metadata.height > 25000000) { // 25MP
                const scale = Math.sqrt(25000000 / (metadata.width * metadata.height));
                pipeline = pipeline.resize(
                    Math.floor(metadata.width * scale),
                    Math.floor(metadata.height * scale),
                    { kernel: 'lanczos2', fastShrinkOnLoad: true }
                );
            }
        }

        return pipeline
            .jpeg({ quality: 85, progressive: true, mozjpeg: true })
            .toBuffer({ resolveWithObject: true });
    };

    // ============================================================================
    // API ROUTES - START
    // ============================================================================

    // Root endpoint with API documentation
    app.get("/", (req, res) => {
        res.json({
            service: "AllFileChanger Image Resizer API",
            version: "2.0.0",
            status: "running",
            endpoints: {
                'GET /': 'API Documentation',
                'GET /health': 'Health check with metrics',
                'GET /status': 'Service status',
                'POST /resize': 'Resize image (multipart/form-data)',
                'POST /rotate': 'Rotate image (JSON)',
                'GET /download/:sessionId': 'Download processed image'
            },
            limits: {
                maxFileSize: `${MEMORY_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB`,
                maxDimension: `${MEMORY_LIMITS.MAX_DIMENSION}px`,
                sessionTimeout: `${MEMORY_LIMITS.SESSION_TIMEOUT / 60000} minutes`
            },
            formats: ['JPEG', 'PNG', 'WebP', 'GIF', 'BMP', 'TIFF', 'AVIF', 'HEIF', 'HEIC']
        });
    });

    // Resize endpoint
    app.post("/resize", upload.single("image"), async (req, res) => {
        const sessionId = req.headers['x-session-id'] || generateSessionId();
        const startTime = Date.now();
        
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No image file provided" });
            }

            const { width, height } = req.body;
            const dimensions = validateDimensions(width, height);
            
            if (dimensions === false) {
                return res.status(400).json({ 
                    error: `Invalid dimensions. Max: ${MEMORY_LIMITS.MAX_DIMENSION}px` 
                });
            }

            console.log(`🔄 [${sessionId}] Resizing: ${req.file.originalname} (${req.file.size} bytes)`);

            // Process image with memory optimization
            const result = await optimizeImage(req.file.buffer, dimensions);
            
            // Store in session cache
            const session = {
                buffer: result.data,
                filename: `resized_${Date.now()}.jpg`,
                mimeType: "image/jpeg",
                originalSize: req.file.size,
                currentSize: result.info.size,
                timestamp: Date.now(),
                originalFilename: req.file.originalname
            };
            
            userSessions.set(sessionId, session);

            const processingTime = Date.now() - startTime;
            console.log(`✅ [${sessionId}] Completed in ${processingTime}ms`);

            res.json({
                status: "success",
                sessionId,
                image: `data:image/jpeg;base64,${result.data.toString("base64")}`,
                originalSize: req.file.size,
                currentSize: result.info.size,
                compression: ((req.file.size - result.info.size) / req.file.size * 100).toFixed(1),
                processingTime: processingTime + 'ms'
            });

        } catch (error) {
            const processingTime = Date.now() - startTime;
            console.error(`❌ [${sessionId}] Resize error:`, error.message);
            
            res.status(500).json({ 
                error: isProduction ? "Image processing failed" : error.message,
                sessionId,
                processingTime: processingTime + 'ms'
            });
        }
    });

    // Rotate endpoint
    app.post("/rotate", async (req, res) => {
        const startTime = Date.now();
        
        try {
            const { direction, sessionId } = req.body;
            
            if (!sessionId || !userSessions.has(sessionId)) {
                return res.status(400).json({ 
                    error: "No active session or image found. Please resize an image first." 
                });
            }

            const session = userSessions.get(sessionId);
            const angle = direction === "left" ? -90 : 90;

            console.log(`🔄 [${sessionId}] Rotating ${direction} (${angle}°)`);

            const result = await optimizeImage(session.buffer, { rotate: angle });
            
            // Update session
            session.buffer = result.data;
            session.currentSize = result.info.size;
            session.timestamp = Date.now();
            userSessions.set(sessionId, session);

            const processingTime = Date.now() - startTime;
            console.log(`✅ [${sessionId}] Rotation completed in ${processingTime}ms`);

            res.json({
                status: "success",
                image: `data:image/jpeg;base64,${result.data.toString("base64")}`,
                currentSize: result.info.size,
                processingTime: processingTime + 'ms'
            });

        } catch (error) {
            const processingTime = Date.now() - startTime;
            console.error("❌ Rotate error:", error.message);
            
            res.status(500).json({ 
                error: isProduction ? "Image rotation failed" : error.message,
                processingTime: processingTime + 'ms'
            });
        }
    });

    // Download endpoint
    app.get("/download/:sessionId", (req, res) => {
        try {
            const { sessionId } = req.params;
            
            if (!sessionId || !userSessions.has(sessionId)) {
                return res.status(404).json({ 
                    error: "Image not found or session expired" 
                });
            }

            const session = userSessions.get(sessionId);
            
            console.log(`⬇️ [${sessionId}] Downloading: ${session.filename}`);
            
            res.setHeader("Content-Disposition", `attachment; filename="${session.filename}"`);
            res.setHeader("Content-Type", session.mimeType);
            res.setHeader("Content-Length", session.buffer.length);
            res.setHeader("Cache-Control", "no-cache");
            
            res.end(session.buffer);

        } catch (error) {
            console.error("❌ Download error:", error.message);
            res.status(500).json({ error: "Download failed" });
        }
    });

    // Health check endpoint
    app.get("/health", (req, res) => {
        const memUsage = process.memoryUsage();
        const loadavg = os.loadavg();
        
        res.json({
            status: "healthy",
            worker: process.pid,
            uptime: Math.round(process.uptime()) + 's',
            memory: {
                used: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
                total: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
                usage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + '%'
            },
            cpu: {
                load: loadavg.map(avg => Math.round(avg * 100) / 100),
                usage: Math.round(process.cpuUsage().user / 1000) + 'ms'
            },
            sessions: {
                active: userSessions.size,
                maxSize: MEMORY_LIMITS.CACHE_SIZE
            },
            limits: MEMORY_LIMITS,
            sharp: sharp.versions
        });
    });

    // Status endpoint
    app.get("/status", (req, res) => {
        res.json({
            service: "AllFileChanger Image Resizer API",
            version: "2.0.0",
            status: "running",
            environment: isProduction ? 'production' : 'development',
            worker: process.pid,
            activeSessions: userSessions.size,
            timestamp: new Date().toISOString()
        });
    });

    // ============================================================================
    // API ROUTES - END
    // ============================================================================

    // Error handling middleware
    app.use((error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ 
                    error: `File too large. Maximum size: ${MEMORY_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB` 
                });
            }
        }
        console.error("❌ Server error:", error.message);
        res.status(500).json({ 
            error: isProduction ? "Internal server error" : error.message 
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ 
            error: "Endpoint not found",
            availableEndpoints: [
                'GET / - API documentation',
                'GET /health - Health check',
                'GET /status - Service status',
                'POST /resize - Resize image',
                'POST /rotate - Rotate image',
                'GET /download/:sessionId - Download image'
            ]
        });
    });

    // Graceful shutdown handlers
    const shutdown = (signal) => {
        console.log(`🛑 Worker ${process.pid} received ${signal}, shutting down gracefully...`);
        
        keepAlive.stop();
        userSessions.clear();
        
        server.close(() => {
            console.log(`✅ Worker ${process.pid} shutdown complete`);
            process.exit(0);
        });
        
        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.log(`🔥 Worker ${process.pid} force shutdown`);
            process.exit(1);
        }, 10000);
    };

    process.on("SIGTERM", () => shutdown('SIGTERM'));
    process.on("SIGINT", () => shutdown('SIGINT'));

    // Memory management - periodic garbage collection
    if (global.gc && isProduction) {
        setInterval(() => {
            global.gc();
        }, 30000); // Every 30 seconds
    }

    // Server startup
    const server = app.listen(PORT, () => {
        console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
        console.log(`💾 Memory limit: ${MEMORY_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB per file`);
        console.log(`🔧 Sharp version: ${sharp.versions.sharp}`);
    });

    // Server timeout configuration
    server.timeout = MEMORY_LIMITS.REQUEST_TIMEOUT;
    server.keepAliveTimeout = 5000;
    server.headersTimeout = 6000;
}

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error.message);
    if (isProduction) {
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled Rejection:', reason);
    if (isProduction) {
        process.exit(1);
    }
});
