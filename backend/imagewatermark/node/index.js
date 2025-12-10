const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'image-watermark' });
});

app.post('/watermark', upload.fields([{ name: 'image' }, { name: 'watermark' }]), async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { text, position = 'bottom-right', opacity = 0.5 } = req.body;
    
    let watermarkedBuffer;
    const baseImage = sharp(req.files.image[0].buffer);
    const metadata = await baseImage.metadata();

    if (text) {
      // Text watermark
      const svgText = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <style>
            .watermark { fill: rgba(255, 255, 255, ${opacity}); font-size: 48px; font-weight: bold; }
          </style>
          <text x="${metadata.width - 20}" y="${metadata.height - 20}" text-anchor="end" class="watermark">${text}</text>
        </svg>`;
      
      watermarkedBuffer = await baseImage
        .composite([{ input: Buffer.from(svgText), gravity: position }])
        .toBuffer();
    } else if (req.files.watermark) {
      // Image watermark
      const watermarkBuffer = await sharp(req.files.watermark[0].buffer)
        .resize({ width: Math.floor(metadata.width * 0.3) })
        .toBuffer();

      watermarkedBuffer = await baseImage
        .composite([{ input: watermarkBuffer, gravity: position }])
        .toBuffer();
    } else {
      return res.status(400).json({ error: 'Provide either text or watermark image' });
    }

    res.set({
      'Content-Type': req.files.image[0].mimetype,
      'Content-Disposition': `attachment; filename="watermarked_${req.files.image[0].originalname}"`
    });
    res.send(watermarkedBuffer);
  } catch (error) {
    console.error('Watermark error:', error);
    res.status(500).json({ error: 'Failed to add watermark', details: error.message });
  }
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Image Watermark service running on port ${PORT}`);
});
