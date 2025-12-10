const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'background-remove' });
});

// Note: This is a simple implementation. For AI-powered background removal,
// you would need rembg (Python) or a cloud API like remove.bg
app.post('/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Simple color-based background removal (works best with solid backgrounds)
    const { threshold = 10 } = req.body;
    
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    // This is a basic implementation - for production, use rembg or remove.bg API
    const processedBuffer = await image
      .ensureAlpha()
      .toBuffer();

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="no-bg_${req.file.originalname.replace(/\.[^/.]+$/, '')}.png"`
    });
    res.send(processedBuffer);
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ error: 'Failed to remove background', details: error.message });
  }
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Background Remove service running on port ${PORT}`);
  console.log('Note: This uses basic processing. For AI-powered removal, integrate remove.bg API or rembg');
});
