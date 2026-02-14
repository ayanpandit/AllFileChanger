const express = require('express');
const sharp = require('sharp');
const { singleUpload } = require('../middleware/upload');

const router = express.Router();

router.post('/crop', singleUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const { x, y, width, height } = req.body;
    if (!x || !y || !width || !height) {
      return res.status(400).json({ error: 'Missing crop params (x, y, width, height)' });
    }

    const buf = await sharp(req.file.buffer)
      .extract({ left: parseInt(x), top: parseInt(y), width: parseInt(width), height: parseInt(height) })
      .toBuffer();

    res.set({
      'Content-Type': req.file.mimetype,
      'Content-Disposition': `attachment; filename="cropped_${req.file.originalname}"`
    });
    res.send(buf);
  } catch (err) {
    console.error('Crop error:', err.message);
    res.status(500).json({ error: 'Failed to crop image', details: err.message });
  }
});

module.exports = router;
