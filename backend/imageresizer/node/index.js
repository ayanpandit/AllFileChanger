const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({
    origin: ['https://allfilechanger.onrender.com', 'http://localhost:5173', 'http://localhost:3000']
}));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.post('/resize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        
        const width = parseInt(req.body.width);
        const height = parseInt(req.body.height);
        const fit = req.body.fit || 'cover';
        
        let resized = sharp(req.file.buffer);
        
        if (height) {
            resized = resized.resize(width, height, { fit });
        } else {
            resized = resized.resize(width);
        }
        
        const output = await resized.toBuffer();
        
        res.set('Content-Type', 'image/png');
        res.send(output);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.listen(PORT, () => {
    console.log(`✅ Image Resizer Backend running on port ${PORT}`);
});
