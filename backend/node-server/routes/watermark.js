const express = require('express');
const sharp = require('sharp');
const { watermarkUpload, autoLoadBatchBuffers } = require('../middleware/upload');

const router = express.Router();

router.post('/watermark', watermarkUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'watermark', maxCount: 1 }]), autoLoadBatchBuffers, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { text, position = 'bottom-right', opacity = 0.5 } = req.body;
    const baseImage = sharp(req.files.image[0].buffer);
    const metadata = await baseImage.metadata();
    let result;

    if (text) {
      // Text watermark via SVG overlay
      const svgText = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <style>
            .watermark { fill: rgba(255, 255, 255, ${opacity}); font-size: 48px; font-weight: bold; }
          </style>
          <text x="${metadata.width - 20}" y="${metadata.height - 20}" text-anchor="end" class="watermark">${text}</text>
        </svg>`;

      result = await baseImage
        .composite([{ input: Buffer.from(svgText), gravity: position }])
        .toBuffer();
    } else if (req.files.watermark) {
      // Image watermark — resize to 30% of base width
      const wmBuffer = await sharp(req.files.watermark[0].buffer)
        .resize({ width: Math.floor(metadata.width * 0.3) })
        .toBuffer();

      result = await baseImage
        .composite([{ input: wmBuffer, gravity: position }])
        .toBuffer();
    } else {
      return res.status(400).json({ error: 'Provide either text or watermark image' });
    }

    // MEMORY MANAGEMENT: free input buffers
    if (req.files.image) req.files.image[0].buffer = null;
    if (req.files.watermark) req.files.watermark[0].buffer = null;

    res.set({
      'Content-Type': req.files.image[0].mimetype,
      'Content-Disposition': `attachment; filename="watermarked_${req.files.image[0].originalname}"`
    });
    res.send(result);
  } catch (err) {
    console.error('Watermark error:', err.message);
    res.status(500).json({ error: 'Failed to add watermark', details: err.message });
  }
});

module.exports = router;
