const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'image-editor' });
});

app.post('/edit', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const {
      brightness = 1,
      contrast = 1,
      saturation = 1,
      blur = 0,
      sharpen = 0,
      grayscale = false,
      tint = null
    } = req.body;

    let processor = sharp(req.file.buffer);

    // Apply modulate (brightness, saturation)
    if (brightness != 1 || saturation != 1) {
      processor = processor.modulate({
        brightness: parseFloat(brightness),
        saturation: parseFloat(saturation)
      });
    }

    // Apply linear for contrast
    if (contrast != 1) {
      const a = parseFloat(contrast);
      const b = 128 * (1 - a);
      processor = processor.linear(a, b);
    }

    // Apply blur
    if (blur > 0) {
      processor = processor.blur(parseFloat(blur));
    }

    // Apply sharpen
    if (sharpen > 0) {
      processor = processor.sharpen(parseFloat(sharpen));
    }

    // Apply grayscale
    if (grayscale === 'true' || grayscale === true) {
      processor = processor.grayscale();
    }

    // Apply tint
    if (tint) {
      processor = processor.tint(tint);
    }

    const editedBuffer = await processor.toBuffer();

    res.set({
      'Content-Type': req.file.mimetype,
      'Content-Disposition': `attachment; filename="edited_${req.file.originalname}"`
    });
    res.send(editedBuffer);
  } catch (error) {
    console.error('Image edit error:', error);
    res.status(500).json({ error: 'Failed to edit image', details: error.message });
  }
});

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Image Editor service running on port ${PORT}`);
});
