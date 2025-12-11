const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5003;

// Session storage - in production, use Redis or similar
const sessions = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Cleanup old sessions periodically
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.createdAt > SESSION_TIMEOUT) {
            sessions.delete(sessionId);
        }
    }
}, 5 * 60 * 1000); // Check every 5 minutes

// CORS configuration - allow all origins for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Session-ID, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors());
app.use(express.json());

const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Helper to generate session ID
function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

// Helper to get image format from buffer
async function getImageFormat(buffer) {
    const metadata = await sharp(buffer).metadata();
    return metadata.format;
}

// Helper to convert buffer to base64 data URL
async function bufferToBase64(buffer, format) {
    const mimeTypes = {
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
        tiff: 'image/tiff',
        avif: 'image/avif',
        heif: 'image/heif',
        heic: 'image/heic'
    };
    const mimeType = mimeTypes[format] || 'image/png';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// POST /resize - Resize image with professional quality
app.post('/resize', upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Parse dimensions
        const width = req.body.width ? parseInt(req.body.width) : null;
        const height = req.body.height ? parseInt(req.body.height) : null;
        const fit = req.body.fit || 'inside'; // inside, cover, contain, fill
        const quality = req.body.quality ? parseInt(req.body.quality) : 90;

        if (!width && !height) {
            return res.status(400).json({ error: 'At least width or height must be specified' });
        }

        // Validate dimensions
        if ((width && width > 10000) || (height && height > 10000)) {
            return res.status(400).json({ error: 'Dimensions too large (max 10000px)' });
        }

        // Get original format and metadata
        const originalFormat = await getImageFormat(req.file.buffer);
        const originalMetadata = await sharp(req.file.buffer).metadata();

        // Process image with high quality settings
        let pipeline = sharp(req.file.buffer, {
            failOnError: false,
            unlimited: true
        });

        // Resize with advanced options
        const resizeOptions = {
            fit: fit,
            withoutEnlargement: false,
            kernel: sharp.kernel.lanczos3, // Best quality interpolation
            fastShrinkOnLoad: false // Better quality for large images
        };

        if (width && height) {
            pipeline = pipeline.resize(width, height, resizeOptions);
        } else if (width) {
            pipeline = pipeline.resize(width, null, resizeOptions);
        } else {
            pipeline = pipeline.resize(null, height, resizeOptions);
        }

        // Preserve format and apply quality settings
        if (originalFormat === 'jpeg' || originalFormat === 'jpg') {
            pipeline = pipeline.jpeg({ 
                quality: quality, 
                progressive: true,
                chromaSubsampling: '4:4:4',
                mozjpeg: true
            });
        } else if (originalFormat === 'png') {
            pipeline = pipeline.png({ 
                quality: quality,
                compressionLevel: 6,
                adaptiveFiltering: true,
                palette: false
            });
        } else if (originalFormat === 'webp') {
            pipeline = pipeline.webp({ 
                quality: quality,
                lossless: false,
                nearLossless: false,
                smartSubsample: true
            });
        } else if (originalFormat === 'avif') {
            pipeline = pipeline.avif({ quality: quality });
        } else if (originalFormat === 'tiff') {
            pipeline = pipeline.tiff({ quality: quality });
        } else {
            // Default to PNG for unknown formats
            pipeline = pipeline.png({ quality: quality });
        }

        // Process the image
        const outputBuffer = await pipeline.toBuffer();
        const outputMetadata = await sharp(outputBuffer).metadata();

        // Create or get session
        const sessionId = req.headers['x-session-id'] || generateSessionId();
        
        // Store in session
        sessions.set(sessionId, {
            buffer: outputBuffer,
            format: outputMetadata.format,
            metadata: outputMetadata,
            originalName: req.file.originalname,
            createdAt: Date.now()
        });

        // Convert to base64 for preview
        const base64Image = await bufferToBase64(outputBuffer, outputMetadata.format);

        const processingTime = `${Date.now() - startTime}ms`;

        res.json({
            success: true,
            image: base64Image,
            sessionId: sessionId,
            originalSize: req.file.size,
            currentSize: outputBuffer.length,
            dimensions: {
                width: outputMetadata.width,
                height: outputMetadata.height
            },
            format: outputMetadata.format,
            processingTime: processingTime
        });

    } catch (error) {
        console.error('Resize error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to resize image',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// POST /rotate - Rotate image by direction or angle
app.post('/rotate', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { sessionId, direction, angle } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID required' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found or expired' });
        }

        // Determine rotation angle
        let rotationAngle = 0;
        if (direction === 'left') {
            rotationAngle = -90;
        } else if (direction === 'right') {
            rotationAngle = 90;
        } else if (angle) {
            rotationAngle = parseInt(angle);
        } else {
            return res.status(400).json({ error: 'Direction (left/right) or angle required' });
        }

        // Rotate the image
        let pipeline = sharp(session.buffer).rotate(rotationAngle, {
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        });

        // Preserve format
        if (session.format === 'jpeg' || session.format === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 90, progressive: true, mozjpeg: true });
        } else if (session.format === 'png') {
            pipeline = pipeline.png({ quality: 90, compressionLevel: 6 });
        } else if (session.format === 'webp') {
            pipeline = pipeline.webp({ quality: 90 });
        }

        const outputBuffer = await pipeline.toBuffer();
        const outputMetadata = await sharp(outputBuffer).metadata();

        // Update session
        session.buffer = outputBuffer;
        session.metadata = outputMetadata;
        session.createdAt = Date.now();

        // Convert to base64
        const base64Image = await bufferToBase64(outputBuffer, session.format);

        const processingTime = `${Date.now() - startTime}ms`;

        res.json({
            success: true,
            image: base64Image,
            sessionId: sessionId,
            currentSize: outputBuffer.length,
            dimensions: {
                width: outputMetadata.width,
                height: outputMetadata.height
            },
            processingTime: processingTime
        });

    } catch (error) {
        console.error('Rotate error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to rotate image',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /download/:sessionId - Download processed image
app.get('/download/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found or expired' });
        }

        // Set appropriate headers
        const ext = session.format === 'jpeg' ? 'jpg' : session.format;
        const filename = session.originalName 
            ? session.originalName.replace(/\.[^.]+$/, `.${ext}`)
            : `resized-image.${ext}`;

        const mimeTypes = {
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
            tiff: 'image/tiff',
            avif: 'image/avif',
            heif: 'image/heif'
        };

        res.set({
            'Content-Type': mimeTypes[session.format] || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': session.buffer.length,
            'Cache-Control': 'no-cache'
        });

        res.send(session.buffer);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download image' });
    }
});

// DELETE /session/:sessionId - Clean up session manually
app.delete('/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const deleted = sessions.delete(sessionId);
    res.json({ 
        success: deleted,
        message: deleted ? 'Session deleted' : 'Session not found'
    });
});

// GET /health - Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        activeSessions: sessions.size,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`✅ Image Resizer Backend running on port ${PORT}`);
    console.log(`📊 Session timeout: ${SESSION_TIMEOUT / 1000 / 60} minutes`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});