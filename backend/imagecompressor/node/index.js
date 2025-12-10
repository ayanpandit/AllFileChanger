const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
app.use(cors({
    origin: ['https://allfilechanger.onrender.com', 'http://localhost:5173', 'http://localhost:3000']
}));

// Multer
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Compress endpoint
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const quality = parseInt(req.body.quality) || 80;
        const targetSizeKB = parseInt(req.body.targetSizeKB);
        
        let compressed;
        if (targetSizeKB) {
            // Target size compression
            let currentQuality = 90;
            do {
                compressed = await sharp(req.file.buffer)
                    .jpeg({ quality: currentQuality })
                    .toBuffer();
                currentQuality -= 5;
            } while (compressed.length > targetSizeKB * 1024 && currentQuality > 10);
        } else {
            // Quality-based compression
            compressed = await sharp(req.file.buffer)
                .jpeg({ quality })
                .toBuffer();
        }
        
        res.set('Content-Type', 'image/jpeg');
        res.send(compressed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => {
    console.log(`✅ Image Compressor Backend running on port ${PORT}`);
});
