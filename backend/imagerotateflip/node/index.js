const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors({
    origin: ['https://allfilechanger.onrender.com', 'http://localhost:5173', 'http://localhost:3000']
}));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/rotate-flip', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const rotation = parseInt(req.body.rotation) || 0;
        const flipH = req.body.flipHorizontal === 'true';
        const flipV = req.body.flipVertical === 'true';
        
        let image = sharp(req.file.buffer);
        
        if (rotation) image = image.rotate(rotation);
        if (flipH) image = image.flop();
        if (flipV) image = image.flip();
        
        const output = await image.toBuffer();
        
        res.set('Content-Type', 'image/png');
        res.send(output);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => {
    console.log(`✅ Image Rotate/Flip Backend running on port ${PORT}`);
});
