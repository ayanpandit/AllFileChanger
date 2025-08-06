const cluster = require('cluster');
const os = require('os');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const EventEmitter = require('events');

// ============================================================================
// RENDER DEPLOYMENT CONFIGURATION - START
// ============================================================================
const https = require('https');
const http = require('http');

// Production environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// Render.com specific configurations
const RENDER_CONFIG = {
    // Render automatically assigns PORT, but fallback to 3000 for local dev
    PORT: process.env.PORT || 3000,
    
    // Frontend URLs for CORS (your AllFileChanger frontend)
    FRONTEND_URLS: [
        'https://allfilechanger.netlify.app',     // Your main frontend URL
        'https://allfilechanger.com',              // Your custom domain (if any)
        'http://localhost:5173',                   // Local Vite dev server
        'http://localhost:3000',                   // Local dev server
        'http://127.0.0.1:5173',                  // Alternative local
        'http://127.0.0.1:3000'                   // Alternative local
    ],
    
    // Keep-alive settings for Render
    KEEP_ALIVE: {
        enabled: isProduction,
        interval: 14 * 60 * 1000,  // 14 minutes (Render sleeps after 15min)
        selfUrl: process.env.RENDER_EXTERNAL_URL || 'https://your-image-converter.onrender.com'
    },
    
    // Production optimizations
    CLUSTER_WORKERS: isProduction ? Math.max(2, Math.min(os.cpus().length, 4)) : 1,
    MEMORY_LIMIT: isProduction ? 0.8 : 0.85,  // More conservative in production
    MAX_FILE_SIZE: 50 * 1024 * 1024,          // 50MB limit for Render
    
    // Health check configuration
    HEALTH_CHECK: {
        path: '/health',
        interval: 30000  // 30 seconds
    }
};

// Keep-alive service for Render (prevents sleeping)
class RenderKeepAlive {
    constructor() {
        this.enabled = RENDER_CONFIG.KEEP_ALIVE.enabled;
        this.interval = RENDER_CONFIG.KEEP_ALIVE.interval;
        this.selfUrl = RENDER_CONFIG.KEEP_ALIVE.selfUrl;
        this.timer = null;
    }
    
    start() {
        if (!this.enabled) {
            console.log('🔄 Keep-alive disabled (development mode)');
            return;
        }
        
        console.log(`🔄 Keep-alive started: pinging every ${this.interval / 1000 / 60} minutes`);
        
        this.timer = setInterval(() => {
            this.ping();
        }, this.interval);
        
        // Initial ping after 1 minute
        setTimeout(() => this.ping(), 60000);
    }
    
    ping() {
        if (!this.selfUrl || this.selfUrl.includes('your-image-converter')) {
            console.log('⚠️ Keep-alive: URL not configured, skipping ping');
            return;
        }
        
        const url = `${this.selfUrl}/health`;
        const client = this.selfUrl.startsWith('https') ? https : http;
        
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
        
        req.on('timeout', () => {
            console.log('⏰ Keep-alive ping timeout');
            req.destroy();
        });
    }
    
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('🛑 Keep-alive stopped');
        }
    }
}

const keepAlive = new RenderKeepAlive();
// ============================================================================
// RENDER DEPLOYMENT CONFIGURATION - END
// ============================================================================

// Performance and memory optimization constants
const MEMORY_THRESHOLD = RENDER_CONFIG.MEMORY_LIMIT; // Dynamic based on environment
const MAX_CONCURRENT_CONVERSIONS = isProduction ? os.cpus().length * 2 : os.cpus().length;
const CLEANUP_INTERVAL = 30000; // 30 seconds
const REQUEST_TIMEOUT = isProduction ? 180000 : 120000; // 3min prod, 2min dev
const MAX_FILE_SIZE = RENDER_CONFIG.MAX_FILE_SIZE; // 50MB for Render
const BUFFER_POOL_SIZE = isProduction ? 5 : 10; // Smaller pool in production

// Worker process implementation
if (cluster.isMaster) {
    const numWorkers = RENDER_CONFIG.CLUSTER_WORKERS;
    
    console.log(`🚀 Master ${process.pid} starting ${numWorkers} workers (${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'})`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Frontend URLs: ${RENDER_CONFIG.FRONTEND_URLS.slice(0, 2).join(', ')}`);
    
    // Start keep-alive service
    keepAlive.start();
    
    // Fork workers
    for (let i = 0; i < numWorkers; i++) {
        const worker = cluster.fork();
        worker.on('message', (msg) => {
            if (msg.type === 'memoryAlert') {
                console.warn(`⚠️ Worker ${worker.process.pid} memory alert: ${msg.usage}%`);
            }
        });
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`💀 Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
        
        // Restart worker immediately in production
        if (isProduction) {
            setTimeout(() => {
                cluster.fork();
            }, 1000);
        } else {
            cluster.fork();
        }
    });
    
    // Production-specific master process monitoring
    if (isProduction) {
        setInterval(() => {
            const usage = process.memoryUsage();
            const usagePercent = (usage.heapUsed / usage.heapTotal) * 100;
            
            if (usagePercent > 85) {
                console.warn(`🔥 Master memory usage high: ${usagePercent.toFixed(1)}% (${Math.round(usage.heapUsed / 1024 / 1024)}MB)`);
            }
        }, 30000); // Check every 30 seconds in production
    } else {
        // Development monitoring (more frequent)
        setInterval(() => {
            const usage = process.memoryUsage();
            const usagePercent = (usage.heapUsed / usage.heapTotal) * 100;
            
            if (usagePercent > 80) {
                console.warn(`🔥 Master memory usage high: ${usagePercent.toFixed(1)}%`);
            }
        }, 10000);
    }
    
    // Graceful shutdown for master
    process.on('SIGTERM', () => {
        console.log('🛑 Master received SIGTERM, shutting down workers...');
        keepAlive.stop();
        
        for (const worker of Object.values(cluster.workers)) {
            worker.process.kill('SIGTERM');
        }
        
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    });
    
} else {
    // Worker process
    startWorker();
}

async function startWorker() {
    const app = express();
    const PORT = RENDER_CONFIG.PORT;
    
    // ============================================================================
    // PRODUCTION CORS CONFIGURATION - START
    // ============================================================================
    
    // Production-grade CORS with security headers
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        
        // Check if origin is in allowed list
        if (RENDER_CONFIG.FRONTEND_URLS.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else if (isDevelopment) {
            // Allow all origins in development
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        
        // Production security headers
        res.set({
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Credentials': 'false',
            
            // Security headers for production
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': isProduction ? 'max-age=31536000; includeSubDomains' : '',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            
            // Cache headers
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            
            // Server identification
            'X-Powered-By': 'AllFileChanger Image Converter',
            'X-Environment': isProduction ? 'production' : 'development'
        });
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        
        next();
    });
    
    // ============================================================================
    // PRODUCTION CORS CONFIGURATION - END
    // ============================================================================
    
    // Advanced Sharp configuration for production
    sharp.cache({
        memory: Math.floor(os.totalmem() * (isProduction ? 0.05 : 0.1) / os.cpus().length),
        files: isProduction ? 10 : 20,
        items: isProduction ? 50 : 100
    });
    
    sharp.concurrency(Math.max(1, Math.floor(os.cpus().length / (isProduction ? 2 : 1))));
    sharp.simd(true);
    
    // Memory and performance monitoring
    class MemoryManager extends EventEmitter {
        constructor() {
            super();
            this.activeConversions = new Map();
            this.bufferPool = [];
            this.stats = {
                conversions: 0,
                errors: 0,
                avgProcessingTime: 0,
                memoryPeaks: []
            };
            
            this.startMonitoring();
        }
        
        startMonitoring() {
            setInterval(() => {
                this.checkMemoryUsage();
                this.cleanup();
            }, 5000);
            
            // Cleanup interval
            setInterval(() => {
                this.forceCleanup();
            }, CLEANUP_INTERVAL);
        }
        
        checkMemoryUsage() {
            const usage = process.memoryUsage();
            const usagePercent = usage.heapUsed / usage.heapTotal;
            
            if (usagePercent > MEMORY_THRESHOLD) {
                this.emit('memoryPressure', usagePercent);
                process.send?.({ type: 'memoryAlert', usage: Math.round(usagePercent * 100) });
                
                // Force garbage collection
                if (global.gc) {
                    global.gc();
                }
            }
            
            this.stats.memoryPeaks.push({
                timestamp: Date.now(),
                heapUsed: usage.heapUsed,
                heapTotal: usage.heapTotal
            });
            
            // Keep only last 100 entries
            if (this.stats.memoryPeaks.length > 100) {
                this.stats.memoryPeaks.shift();
            }
        }
        
        cleanup() {
            // Clean up expired conversions
            const now = Date.now();
            for (const [id, conversion] of this.activeConversions) {
                if (now - conversion.startTime > REQUEST_TIMEOUT) {
                    this.activeConversions.delete(id);
                }
            }
        }
        
        forceCleanup() {
            // Aggressive cleanup
            this.bufferPool = [];
            if (global.gc) {
                global.gc();
            }
        }
        
        trackConversion(id, data) {
            this.activeConversions.set(id, {
                ...data,
                startTime: Date.now()
            });
        }
        
        finishConversion(id, processingTime, success = true) {
            this.activeConversions.delete(id);
            this.stats.conversions++;
            if (!success) this.stats.errors++;
            
            // Update average processing time
            this.stats.avgProcessingTime = 
                (this.stats.avgProcessingTime * (this.stats.conversions - 1) + processingTime) / 
                this.stats.conversions;
        }
        
        canAcceptRequest() {
            return this.activeConversions.size < MAX_CONCURRENT_CONVERSIONS;
        }
        
        getBuffer(size) {
            // Simple buffer pooling
            const pooled = this.bufferPool.find(buf => buf.length >= size);
            if (pooled) {
                this.bufferPool = this.bufferPool.filter(buf => buf !== pooled);
                return pooled.slice(0, size);
            }
            return Buffer.allocUnsafe(size);
        }
        
        returnBuffer(buffer) {
            if (this.bufferPool.length < BUFFER_POOL_SIZE && buffer.length > 1024) {
                this.bufferPool.push(buffer);
            }
        }
    }
    
    const memoryManager = new MemoryManager();
    
    // Request queue for load balancing
    class RequestQueue {
        constructor(maxConcurrent) {
            this.queue = [];
            this.processing = 0;
            this.maxConcurrent = maxConcurrent;
        }
        
        async add(task) {
            return new Promise((resolve, reject) => {
                this.queue.push({ task, resolve, reject });
                this.process();
            });
        }
        
        async process() {
            if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
                return;
            }
            
            const { task, resolve, reject } = this.queue.shift();
            this.processing++;
            
            try {
                const result = await task();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.processing--;
                setImmediate(() => this.process());
            }
        }
    }
    
    const requestQueue = new RequestQueue(MAX_CONCURRENT_CONVERSIONS);
    
    // Optimized multer configuration
    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: MAX_FILE_SIZE,
            files: 1,
            fieldSize: 1024
        },
        fileFilter: (req, file, cb) => {
            // Enhanced MIME type validation for production
            const allowedMimes = [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'image/heic', 'image/heif', 'image/avif', 'image/bmp',
                'image/tiff', 'image/x-icon', 'image/svg+xml'
            ];
            
            const isValidMime = allowedMimes.includes(file.mimetype) || 
                               file.mimetype.startsWith('image/');
            
            if (isValidMime) {
                cb(null, true);
            } else {
                cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
            }
        }
    });
    
    // Production request timeout middleware
    app.use((req, res, next) => {
        req.setTimeout(REQUEST_TIMEOUT);
        res.setTimeout(REQUEST_TIMEOUT);
        next();
    });
    
    // ============================================================================
    // PRODUCTION RATE LIMITING - START
    // ============================================================================
    
    // Enhanced rate limiting for production
    const rateLimiter = new Map();
    const RATE_LIMIT_CONFIG = {
        windowMs: isProduction ? 60000 : 60000,        // 1 minute window
        maxRequests: isProduction ? 20 : 50,           // Stricter in production
        cleanupInterval: 300000                         // Clean old entries every 5 minutes
    };
    
    // Cleanup old rate limit entries
    setInterval(() => {
        const now = Date.now();
        for (const [ip, requests] of rateLimiter.entries()) {
            const validRequests = requests.filter(time => now - time < RATE_LIMIT_CONFIG.windowMs * 2);
            if (validRequests.length === 0) {
                rateLimiter.delete(ip);
            } else {
                rateLimiter.set(ip, validRequests);
            }
        }
    }, RATE_LIMIT_CONFIG.cleanupInterval);
    
    app.use((req, res, next) => {
        // Get client IP (handle proxies in production)
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
                        req.headers['x-real-ip'] ||
                        req.connection.remoteAddress ||
                        req.ip;
        
        const now = Date.now();
        const windowMs = RATE_LIMIT_CONFIG.windowMs;
        const maxRequests = RATE_LIMIT_CONFIG.maxRequests;
        
        if (!rateLimiter.has(clientIp)) {
            rateLimiter.set(clientIp, []);
        }
        
        const requests = rateLimiter.get(clientIp).filter(time => now - time < windowMs);
        requests.push(now);
        rateLimiter.set(clientIp, requests);
        
        if (requests.length > maxRequests) {
            console.warn(`🚫 Rate limit exceeded for IP: ${clientIp} (${requests.length}/${maxRequests})`);
            return res.status(429).json({ 
                error: 'Too many requests',
                retryAfter: Math.ceil(windowMs / 1000),
                limit: maxRequests,
                window: windowMs / 1000
            });
        }
        
        // Add rate limit headers
        res.set({
            'X-RateLimit-Limit': maxRequests,
            'X-RateLimit-Remaining': Math.max(0, maxRequests - requests.length),
            'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
        });
        
        next();
    });
    
    // ============================================================================
    // PRODUCTION RATE LIMITING - END
    // ============================================================================
    
    // ============================================================================
    // PRODUCTION FORMAT CONFIGURATION - START
    // ============================================================================
    
    // Enhanced format configuration for production
    const formatConfig = {
        jpeg: { 
            mime: 'image/jpeg', 
            ext: 'jpg',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                progressive: true,
                mozjpeg: true,
                trellisQuantisation: true,
                overshootDeringing: true,
                optimiseScans: true
            })
        },
        jpg: { 
            mime: 'image/jpeg', 
            ext: 'jpg',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                progressive: true,
                mozjpeg: true,
                trellisQuantisation: true,
                overshootDeringing: true,
                optimiseScans: true
            })
        },
        png: { 
            mime: 'image/png', 
            ext: 'png',
            options: () => ({
                compressionLevel: 9,
                progressive: true,
                palette: true,
                adaptiveFiltering: true
            })
        },
        webp: { 
            mime: 'image/webp', 
            ext: 'webp',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                effort: 6,
                smartSubsample: true,
                reductionEffort: 4
            })
        },
        avif: { 
            mime: 'image/avif', 
            ext: 'avif',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                effort: 4,
                chromaSubsampling: '4:2:0'
            })
        },
        heif: { 
            mime: 'image/heif', 
            ext: 'heif',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                compression: 'av1'
            })
        },
        heic: { 
            mime: 'image/heic', 
            ext: 'heic',
            options: (quality) => ({
                quality: Math.max(10, Math.min(100, parseInt(quality) || 85)),
                compression: 'av1'
            })
        },
        gif: { 
            mime: 'image/gif', 
            ext: 'gif',
            options: () => ({
                // GIF converted to PNG due to Sharp limitations
                compressionLevel: 9,
                progressive: true
            })
        },
        ico: { 
            mime: 'image/x-icon', 
            ext: 'ico',
            options: () => ({
                compressionLevel: 9
            })
        },
        svg: { 
            mime: 'image/svg+xml', 
            ext: 'svg',
            options: () => ({})
        }
    };
    
    // ============================================================================
    // PRODUCTION FORMAT CONFIGURATION - END
    // ============================================================================
    
    // ============================================================================
    // PRODUCTION CONVERSION FUNCTION - START
    // ============================================================================
    
    // Ultra-optimized conversion function with all format support
    async function convertImage(inputBuffer, outputFormat, quality = 85, conversionId) {
        let transformer;
        let metadata;
        
        try {
            // Create transformer with optimized settings
            transformer = sharp(inputBuffer, {
                failOnError: false,
                density: isProduction ? 150 : 300,
                limitInputPixels: 268402689,
                sequentialRead: true,
                pages: 1
            });
            
            // Get metadata efficiently
            metadata = await transformer.metadata();
            
            // Validate dimensions
            if (!metadata.width || !metadata.height || metadata.width > 15000 || metadata.height > 15000) {
                throw new Error('Invalid or excessive image dimensions');
            }
            
            // Auto-resize large images for performance in production
            if (isProduction && metadata.width * metadata.height > 25000000) { // 25MP in production
                const scale = Math.sqrt(25000000 / (metadata.width * metadata.height));
                transformer = transformer.resize(
                    Math.floor(metadata.width * scale),
                    Math.floor(metadata.height * scale),
                    { kernel: 'lanczos2', fastShrinkOnLoad: true }
                );
            } else if (!isProduction && metadata.width * metadata.height > 50000000) { // 50MP in development
                const scale = Math.sqrt(50000000 / (metadata.width * metadata.height));
                transformer = transformer.resize(
                    Math.floor(metadata.width * scale),
                    Math.floor(metadata.height * scale),
                    { kernel: 'lanczos2', fastShrinkOnLoad: true }
                );
            }
            
            // Apply format conversion
            const format = formatConfig[outputFormat.toLowerCase()];
            if (!format) {
                throw new Error(`Unsupported format: ${outputFormat}`);
            }
            
            let outputBuffer;
            const formatMethod = outputFormat.toLowerCase();
            
            switch (formatMethod) {
                case 'jpeg':
                case 'jpg':
                    outputBuffer = await transformer.jpeg(format.options(quality)).toBuffer();
                    break;
                    
                case 'png':
                    outputBuffer = await transformer.png(format.options()).toBuffer();
                    break;
                    
                case 'webp':
                    outputBuffer = await transformer.webp(format.options(quality)).toBuffer();
                    break;
                    
                case 'avif':
                    try {
                        outputBuffer = await transformer.avif(format.options(quality)).toBuffer();
                    } catch (error) {
                        console.warn(`AVIF conversion failed, falling back to WebP: ${error.message}`);
                        outputBuffer = await transformer.webp(formatConfig.webp.options(quality)).toBuffer();
                    }
                    break;
                    
                case 'heif':
                case 'heic':
                    try {
                        outputBuffer = await transformer.heif(format.options(quality)).toBuffer();
                    } catch (error) {
                        console.warn(`HEIF/HEIC conversion failed, falling back to JPEG: ${error.message}`);
                        outputBuffer = await transformer.jpeg(formatConfig.jpeg.options(quality)).toBuffer();
                    }
                    break;
                    
                case 'gif':
                    // Convert to PNG (Sharp limitation with GIF output)
                    outputBuffer = await transformer.png(format.options()).toBuffer();
                    break;
                    
                case 'ico':
                    // ICO format - resize to icon size
                    outputBuffer = await transformer
                        .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                        .png(format.options())
                        .toBuffer();
                    break;
                    
                case 'svg':
                    // For SVG, convert to PNG first then embed in SVG
                    const svgPngBuffer = await transformer.png().toBuffer();
                    const base64 = svgPngBuffer.toString('base64');
                    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${metadata.width}" height="${metadata.height}" viewBox="0 0 ${metadata.width} ${metadata.height}">
  <image width="${metadata.width}" height="${metadata.height}" 
         xlink:href="data:image/png;base64,${base64}"/>
</svg>`;
                    outputBuffer = Buffer.from(svgContent, 'utf8');
                    break;
                    
                default:
                    throw new Error(`Unsupported format: ${outputFormat}`);
            }
            
            return {
                buffer: outputBuffer,
                metadata: {
                    originalFormat: metadata.format,
                    originalSize: inputBuffer.length,
                    newSize: outputBuffer.length,
                    dimensions: `${metadata.width}x${metadata.height}`,
                    compressionRatio: ((1 - (outputBuffer.length / inputBuffer.length)) * 100).toFixed(1)
                }
            };
            
        } catch (error) {
            console.error(`Conversion error for ${conversionId}:`, error.message);
            throw error;
        } finally {
            // Cleanup transformer
            if (transformer) {
                try {
                    transformer.destroy();
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        }
    }
    
    // ============================================================================
    // PRODUCTION CONVERSION FUNCTION - END
    // ============================================================================
    
    // Main conversion endpoint
    app.post('/convert', upload.single('image'), async (req, res) => {
        const conversionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const startTime = Date.now();
        
        try {
            // Check server capacity
            if (!memoryManager.canAcceptRequest()) {
                return res.status(503).json({ 
                    error: 'Server busy, please try again later',
                    retryAfter: 30 
                });
            }
            
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }
            
            const { format, quality = 85 } = req.body;
            
            if (!format || !formatConfig[format.toLowerCase()]) {
                return res.status(400).json({
                    error: 'Invalid format',
                    supported: Object.keys(formatConfig)
                });
            }
            
            // Track conversion
            memoryManager.trackConversion(conversionId, {
                filename: req.file.originalname,
                format,
                size: req.file.size
            });
            
            // Queue the conversion
            const result = await requestQueue.add(async () => {
                return await convertImage(req.file.buffer, format, quality, conversionId);
            });
            
            const processingTime = Date.now() - startTime;
            const formatInfo = formatConfig[format.toLowerCase()];
            
            // Set response headers
            res.set({
                'Content-Type': formatInfo.mime,
                'Content-Disposition': `attachment; filename="converted_${conversionId}.${formatInfo.ext}"`,
                'Content-Length': result.buffer.length,
                'Cache-Control': 'no-cache, no-store',
                'X-Processing-Time': processingTime + 'ms',
                'X-Conversion-Id': conversionId,
                'X-Worker-Process': process.pid,
                'X-Compression-Ratio': result.metadata.compressionRatio + '%'
            });
            
            res.send(result.buffer);
            
            // Track completion
            memoryManager.finishConversion(conversionId, processingTime, true);
            
            console.log(`✅ ${conversionId}: ${req.file.originalname} → ${format} (${processingTime}ms)`);
            
        } catch (error) {
            const processingTime = Date.now() - startTime;
            
            console.error(`❌ ${conversionId}: ${error.message} (${processingTime}ms)`);
            
            memoryManager.finishConversion(conversionId, processingTime, false);
            
            const statusCode = error.message.includes('Unsupported') ? 400 : 
                              error.message.includes('busy') ? 503 : 500;
            
            res.status(statusCode).json({
                error: error.message || 'Conversion failed',
                conversionId,
                processingTime: processingTime + 'ms'
            });
        }
    });
    
    // Health check with detailed metrics
    app.get('/health', (req, res) => {
        const usage = process.memoryUsage();
        const loadavg = os.loadavg();
        
        res.json({
            status: 'healthy',
            worker: process.pid,
            uptime: Math.round(process.uptime()) + 's',
            memory: {
                used: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
                total: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
                usage: Math.round((usage.heapUsed / usage.heapTotal) * 100) + '%'
            },
            cpu: {
                load: loadavg.map(avg => Math.round(avg * 100) / 100),
                usage: Math.round(process.cpuUsage().user / 1000) + 'ms'
            },
            conversions: {
                active: memoryManager.activeConversions.size,
                total: memoryManager.stats.conversions,
                errors: memoryManager.stats.errors,
                avgTime: Math.round(memoryManager.stats.avgProcessingTime) + 'ms'
            },
            sharp: sharp.versions
        });
    });
    
    // Metrics endpoint
    app.get('/metrics', (req, res) => {
        res.json({
            worker: process.pid,
            stats: memoryManager.stats,
            activeConversions: Array.from(memoryManager.activeConversions.values()),
            memoryPeaks: memoryManager.stats.memoryPeaks.slice(-10)
        });
    });
    
    // Supported formats
    app.get('/formats', (req, res) => {
        res.json({
            supported: Object.keys(formatConfig),
            limits: {
                maxFileSize: MAX_FILE_SIZE,
                maxConcurrent: MAX_CONCURRENT_CONVERSIONS,
                timeout: REQUEST_TIMEOUT
            }
        });
    });
    
    // ============================================================================
    // ADDITIONAL PRODUCTION ROUTES - START
    // ============================================================================
    
    // Status endpoint for basic monitoring
    app.get('/status', (req, res) => {
        res.json({ 
            status: 'Image Converter API is running',
            version: '2.0.0',
            formats: Object.keys(formatConfig),
            environment: isProduction ? 'production' : 'development',
            worker: process.pid,
            timestamp: new Date().toISOString()
        });
    });
    
    // Root endpoint with API documentation
    app.get('/', (req, res) => {
        res.json({
            service: 'Image Converter API',
            version: '2.0.0',
            endpoints: {
                'GET /': 'API Documentation',
                'GET /status': 'Service status',
                'GET /health': 'Health check with metrics',
                'GET /metrics': 'Detailed metrics',
                'GET /formats': 'Supported formats',
                'POST /convert': 'Convert image (multipart/form-data)'
            },
            conversion: {
                supportedFormats: Object.keys(formatConfig),
                maxFileSize: `${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
                maxConcurrent: MAX_CONCURRENT_CONVERSIONS
            },
            usage: {
                example: 'POST /convert with form-data: image (file), format (string), quality (1-100, optional)'
            }
        });
    });
    
    // ============================================================================
    // ADDITIONAL PRODUCTION ROUTES - END
    // ============================================================================
    app.use((error, req, res, next) => {
        console.error('Express error:', error.message);
        
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: 'File too large' });
            }
        }
        
        res.status(500).json({ error: 'Internal server error' });
    });
    
    // Memory pressure handling
    memoryManager.on('memoryPressure', (usage) => {
        console.warn(`🔥 Memory pressure detected: ${Math.round(usage * 100)}%`);
        
        // Aggressive cleanup
        memoryManager.forceCleanup();
        
        // Clear Sharp cache
        sharp.cache(false);
        sharp.cache({
            memory: Math.floor(os.totalmem() * 0.05 / os.cpus().length),
            files: 10,
            items: 50
        });
    });
    
    // Start server
    const server = app.listen(PORT, () => {
        console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
        console.log(`💾 Memory limit: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
        console.log(`🔧 Sharp version: ${sharp.versions.sharp}`);
    });
    
    // Graceful shutdown
    const shutdown = () => {
        console.log(`🛑 Worker ${process.pid} shutting down...`);
        server.close(() => {
            memoryManager.removeAllListeners();
            process.exit(0);
        });
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled Rejection:', reason);
    process.exit(1);
});