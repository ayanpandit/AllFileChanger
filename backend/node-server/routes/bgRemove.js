const express = require('express');
const sharp = require('sharp');
const { singleUpload } = require('../middleware/upload');

const router = express.Router();

// NOTE: This is a basic implementation using color-distance thresholding.
// For AI-powered removal, integrate remove.bg API or Python rembg.
router.post('/remove-background', singleUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const { threshold = 30, color = 'white' } = req.body;
    const th = parseInt(threshold);

    const image = sharp(req.file.buffer).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Determine background reference colour (sample corners)
    const samplePixel = (x, y) => {
      const idx = (y * width + x) * channels;
      return [data[idx], data[idx + 1], data[idx + 2]];
    };

    // Average the four corner pixels as the background reference
    const corners = [
      samplePixel(0, 0),
      samplePixel(width - 1, 0),
      samplePixel(0, height - 1),
      samplePixel(width - 1, height - 1),
    ];
    const bg = corners[0].map((_, i) => Math.round(corners.reduce((s, c) => s + c[i], 0) / 4));

    // Make pixels matching the background transparent
    for (let i = 0; i < data.length; i += channels) {
      const dist = Math.sqrt(
        (data[i] - bg[0]) ** 2 +
        (data[i + 1] - bg[1]) ** 2 +
        (data[i + 2] - bg[2]) ** 2
      );
      if (dist < th) {
        data[i + 3] = 0; // set alpha to 0
      }
    }

    const buf = await sharp(data, { raw: { width, height, channels } })
      .png()
      .toBuffer();

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="no-bg_${req.file.originalname.replace(/\.[^/.]+$/, '')}.png"`
    });
    res.send(buf);
  } catch (err) {
    console.error('BG remove error:', err.message);
    res.status(500).json({ error: 'Failed to remove background', details: err.message });
  }
});

module.exports = router;
