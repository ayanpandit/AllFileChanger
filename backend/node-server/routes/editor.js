const express = require('express');
const sharp = require('sharp');
const { singleUpload } = require('../middleware/upload');

const router = express.Router();

router.post('/edit', singleUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const {
      brightness = 1,
      contrast = 1,
      saturation = 1,
      blur = 0,
      sharpen = 0,
      grayscale = false,
      tint = null
    } = req.body;

    let proc = sharp(req.file.buffer);

    // Brightness & saturation
    if (parseFloat(brightness) !== 1 || parseFloat(saturation) !== 1) {
      proc = proc.modulate({
        brightness: parseFloat(brightness),
        saturation: parseFloat(saturation)
      });
    }

    // Contrast (linear transform)
    if (parseFloat(contrast) !== 1) {
      const a = parseFloat(contrast);
      proc = proc.linear(a, 128 * (1 - a));
    }

    // Blur
    if (parseFloat(blur) > 0) proc = proc.blur(parseFloat(blur));

    // Sharpen
    if (parseFloat(sharpen) > 0) proc = proc.sharpen(parseFloat(sharpen));

    // Grayscale
    if (grayscale === 'true' || grayscale === true) proc = proc.grayscale();

    // Tint
    if (tint) proc = proc.tint(tint);

    const buf = await proc.toBuffer();

    res.set({
      'Content-Type': req.file.mimetype,
      'Content-Disposition': `attachment; filename="edited_${req.file.originalname}"`
    });
    res.send(buf);
  } catch (err) {
    console.error('Editor error:', err.message);
    res.status(500).json({ error: 'Failed to edit image', details: err.message });
  }
});

module.exports = router;
