const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: ['https://allfilechanger.onrender.com', 'http://localhost:5173', 'http://localhost:3000']
}));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const format = (req.body.format || 'png').toLowerCase();
        const formatMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp', avif: 'avif', heif: 'heif', gif: 'gif', tiff: 'tiff' };
        
        if (!formatMap[format]) return res.status(400).json({ error: 'Unsupported format' });
        
        const converted = await sharp(req.file.buffer)[formatMap[format]]().toBuffer();
        
        res.set('Content-Type', `image/${format}`);
        res.send(converted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => {
    console.log(`✅ Image Converter Backend running on port ${PORT}`);
});
