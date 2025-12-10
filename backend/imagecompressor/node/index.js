const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
app.use(cors());

// Multer
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Compress endpoint
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const quality = parseInt(req.body.quality) || 80;
        const targetSizeKB = parseInt(req.body.targetSizeKB);
        
        let compressed;
        let outputFormat = 'jpeg';
        
        // Detect input format
        const metadata = await sharp(req.file.buffer).metadata();
        if (metadata.format === 'png') outputFormat = 'png';
        else if (metadata.format === 'webp') outputFormat = 'webp';
        
        if (targetSizeKB) {
            // Professional-grade target size compression with binary search algorithm
            const targetBytes = targetSizeKB * 1024;
            const safetyMargin = 0.98; // Stay 2% under target for safety
            const targetBytesWithMargin = Math.floor(targetBytes * safetyMargin);
            
            // Step 1: Pre-calculate optimal dimensions if needed
            let workingBuffer = req.file.buffer;
            let currentWidth = metadata.width;
            let currentHeight = metadata.height;
            
            // Estimate if we need to resize based on pixel count vs target
            const pixelCount = currentWidth * currentHeight;
            const bytesPerPixel = req.file.size / pixelCount;
            const estimatedMinSize = pixelCount * 0.1; // Minimum achievable size estimate
            
            if (estimatedMinSize > targetBytesWithMargin) {
                // Need to resize - calculate optimal dimensions
                const scaleFactor = Math.sqrt(targetBytesWithMargin / estimatedMinSize);
                currentWidth = Math.floor(currentWidth * scaleFactor);
                currentHeight = Math.floor(currentHeight * scaleFactor);
                workingBuffer = await sharp(req.file.buffer)
                    .resize(currentWidth, currentHeight, { fit: 'inside' })
                    .toBuffer();
            }
            
            // Step 2: Binary search for optimal quality (professional algorithm)
            let minQuality = 1;
            let maxQuality = 95;
            let bestQuality = 50;
            let bestCompressed = null;
            
            while (minQuality <= maxQuality) {
                const midQuality = Math.floor((minQuality + maxQuality) / 2);
                
                // Compress with current quality
                if (outputFormat === 'png') {
                    compressed = await sharp(workingBuffer)
                        .png({ quality: midQuality, compressionLevel: 9, effort: 10 })
                        .toBuffer();
                } else if (outputFormat === 'webp') {
                    compressed = await sharp(workingBuffer)
                        .webp({ quality: midQuality, effort: 6 })
                        .toBuffer();
                } else {
                    compressed = await sharp(workingBuffer)
                        .jpeg({ quality: midQuality, mozjpeg: true })
                        .toBuffer();
                }
                
                if (compressed.length <= targetBytesWithMargin) {
                    // This quality works, save it and try higher
                    bestCompressed = compressed;
                    bestQuality = midQuality;
                    minQuality = midQuality + 1;
                } else {
                    // Too large, try lower quality
                    maxQuality = midQuality - 1;
                }
            }
            
            // Step 3: If binary search didn't find solution, do aggressive resize + compression
            if (!bestCompressed || bestCompressed.length > targetBytesWithMargin) {
                let resizeScale = 0.9;
                let iteration = 0;
                const maxIterations = 10;
                
                while (iteration < maxIterations) {
                    const newWidth = Math.floor(metadata.width * resizeScale);
                    const newHeight = Math.floor(metadata.height * resizeScale);
                    
                    workingBuffer = await sharp(req.file.buffer)
                        .resize(newWidth, newHeight, { fit: 'inside' })
                        .toBuffer();
                    
                    // Try with low quality
                    if (outputFormat === 'png') {
                        compressed = await sharp(workingBuffer)
                            .png({ quality: 40, compressionLevel: 9, effort: 10 })
                            .toBuffer();
                    } else if (outputFormat === 'webp') {
                        compressed = await sharp(workingBuffer)
                            .webp({ quality: 40, effort: 6 })
                            .toBuffer();
                    } else {
                        compressed = await sharp(workingBuffer)
                            .jpeg({ quality: 40, mozjpeg: true })
                            .toBuffer();
                    }
                    
                    if (compressed.length <= targetBytesWithMargin) {
                        bestCompressed = compressed;
                        break;
                    }
                    
                    resizeScale -= 0.1;
                    iteration++;
                }
            }
            
            compressed = bestCompressed || compressed;
        } else {
            // Quality-based compression
            if (outputFormat === 'png') {
                compressed = await sharp(req.file.buffer)
                    .png({ quality, compressionLevel: 9 })
                    .toBuffer();
            } else if (outputFormat === 'webp') {
                compressed = await sharp(req.file.buffer)
                    .webp({ quality })
                    .toBuffer();
            } else {
                compressed = await sharp(req.file.buffer)
                    .jpeg({ quality, mozjpeg: true })
                    .toBuffer();
            }
        }
        
        const contentType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
        res.set('Content-Type', contentType);
        res.set('Original-Size', req.file.size);
        res.set('Compressed-Size', compressed.length);
        res.send(compressed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => {
    console.log(`✅ Image Compressor Backend running on port ${PORT}`);
});
