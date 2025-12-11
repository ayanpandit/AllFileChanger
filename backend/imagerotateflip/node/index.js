const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5004;

// Session storage with auto-cleanup
const sessions = new Map();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.createdAt > SESSION_TIMEOUT) {
            sessions.delete(sessionId);
        }
    }
}, 5 * 60 * 1000);

// CORS - allow all origins for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Session-ID, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(cors());
app.use(express.json());

const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files allowed'));
    }
});

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

async function getImageFormat(buffer) {
    const metadata = await sharp(buffer).metadata();
    return metadata.format;
}

async function bufferToBase64(buffer, format) {
    const mimeTypes = {
        jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png',
        webp: 'image/webp', gif: 'image/gif', tiff: 'image/tiff',
        avif: 'image/avif', heif: 'image/heif', heic: 'image/heic'
    };
    const mimeType = mimeTypes[format] || 'image/png';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

// POST /process - Rotate and flip image
app.post('/process', upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const rotation = parseInt(req.body.rotate) || 0;
        const flipH = req.body.flipX === 'true';
        const flipV = req.body.flipY === 'true';
        const quality = parseInt(req.body.quality) || 95;

        // Get original format
        const originalFormat = await getImageFormat(req.file.buffer);
        const originalMetadata = await sharp(req.file.buffer).metadata();

        // Create pipeline with optimizations
        let pipeline = sharp(req.file.buffer, {
            failOnError: false,
            unlimited: true
        });

        // Apply transformations (order matters: flip then rotate)
        if (flipH) pipeline = pipeline.flop();
        if (flipV) pipeline = pipeline.flip();
        if (rotation && rotation !== 0) {
            pipeline = pipeline.rotate(rotation, {
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            });
        }

        // Preserve format with optimizations
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
                adaptiveFiltering: true
            });
        } else if (originalFormat === 'webp') {
            pipeline = pipeline.webp({ 
                quality: quality,
                lossless: false,
                smartSubsample: true
            });
        } else if (originalFormat === 'avif') {
            pipeline = pipeline.avif({ quality: quality });
        } else {
            pipeline = pipeline.png({ quality: quality });
        }

        const outputBuffer = await pipeline.toBuffer();
        const outputMetadata = await sharp(outputBuffer).metadata();

        // Create session
        const sessionId = req.headers['x-session-id'] || generateSessionId();
        sessions.set(sessionId, {
            buffer: outputBuffer,
            format: outputMetadata.format,
            metadata: outputMetadata,
            originalName: req.file.originalname,
            createdAt: Date.now()
        });

        // Return base64 for preview
        const base64Image = await bufferToBase64(outputBuffer, outputMetadata.format);

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
            processingTime: `${Date.now() - startTime}ms`
        });

    } catch (error) {
        console.error('Process error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to process image',
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

        const ext = session.format === 'jpeg' ? 'jpg' : session.format;
        const filename = session.originalName 
            ? session.originalName.replace(/\.[^.]+$/, `.${ext}`)
            : `processed-image.${ext}`;

        const mimeTypes = {
            jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png',
            webp: 'image/webp', gif: 'image/gif', tiff: 'image/tiff',
            avif: 'image/avif', heif: 'image/heif'
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

// Legacy endpoint for backward compatibility
app.post('/rotate-flip', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const rotation = parseInt(req.body.rotation) || 0;
        const flipH = req.body.flipHorizontal === 'true';
        const flipV = req.body.flipVertical === 'true';
        
        const originalFormat = await getImageFormat(req.file.buffer);
        let pipeline = sharp(req.file.buffer);
        
        if (flipH) pipeline = pipeline.flop();
        if (flipV) pipeline = pipeline.flip();
        if (rotation) pipeline = pipeline.rotate(rotation);

        // Format-specific optimization
        if (originalFormat === 'jpeg' || originalFormat === 'jpg') {
            pipeline = pipeline.jpeg({ quality: 95, progressive: true, mozjpeg: true });
        } else if (originalFormat === 'png') {
            pipeline = pipeline.png({ quality: 95, compressionLevel: 6 });
        } else if (originalFormat === 'webp') {
            pipeline = pipeline.webp({ quality: 95 });
        }
        
        const output = await pipeline.toBuffer();
        
        const mimeTypes = {
            jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png',
            webp: 'image/webp', gif: 'image/gif'
        };
        res.set('Content-Type', mimeTypes[originalFormat] || 'image/png');
        res.send(output);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /session/:sessionId
app.delete('/session/:sessionId', (req, res) => {
    const deleted = sessions.delete(req.params.sessionId);
    res.json({ success: deleted, message: deleted ? 'Session deleted' : 'Session not found' });
});

// GET /health
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        activeSessions: sessions.size,
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`✅ Image Rotate/Flip Backend running on port ${PORT}`);
    console.log(`📊 Session timeout: ${SESSION_TIMEOUT / 1000 / 60} minutes`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
