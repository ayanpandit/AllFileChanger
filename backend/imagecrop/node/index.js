const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'image-crop' });
});

app.post('/crop', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { x, y, width, height } = req.body;
    
    if (!x || !y || !width || !height) {
      return res.status(400).json({ error: 'Missing crop parameters (x, y, width, height)' });
    }

    const croppedBuffer = await sharp(req.file.buffer)
      .extract({
        left: parseInt(x),
        top: parseInt(y),
        width: parseInt(width),
        height: parseInt(height)
      })
      .toBuffer();

    res.set({
      'Content-Type': req.file.mimetype,
      'Content-Disposition': `attachment; filename="cropped_${req.file.originalname}"`
    });
    res.send(croppedBuffer);
  } catch (error) {
    console.error('Crop error:', error);
    res.status(500).json({ error: 'Failed to crop image', details: error.message });
  }
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Image Crop service running on port ${PORT}`);
});
