const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://allfilechanger.onrender.com', 'http://localhost:3000'],
  exposedHeaders: ['Original-Size', 'Compressed-Size', 'Content-Disposition']
}));

const upload = multer({ storage: multer.memoryStorage() });

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function compressToTarget(buffer, targetKB) {
  let quality = 80;
  let width;
  let compressed = buffer;

  while (quality >= 10) {
    const temp = await sharp(buffer).resize({ width }).jpeg({ quality }).toBuffer();
    if (temp.length / 1024 <= targetKB) return temp;
    compressed = temp;
    quality -= 5;
  }

  const metadata = await sharp(buffer).metadata();
  width = metadata.width;
  while (width > 100) {
    width = Math.floor(width * 0.9);
    const temp = await sharp(buffer).resize({ width }).jpeg({ quality: 10 }).toBuffer();
    if (temp.length / 1024 <= targetKB) return temp;
    compressed = temp;
  }

  return compressed;
}

app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).send('No image uploaded');
    }

    const buffer = req.file.buffer;
    const originalSize = buffer.length;
    const targetKB = parseInt(req.body.targetSize);
    const quality = parseInt(req.body.quality);

    let compressed;
    if (!isNaN(targetKB) && targetKB > 0) {
      compressed = await compressToTarget(buffer, targetKB);
    } else if (!isNaN(quality) && quality >= 10 && quality <= 100) {
      compressed = await sharp(buffer).jpeg({ quality }).toBuffer();
    } else {
      return res.status(400).send('Invalid compression parameters');
    }

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename=compressed.jpg',
      'Original-Size': formatKB(originalSize),
      'Compressed-Size': formatKB(compressed.length),
    });

    res.send(compressed);
  } catch (err) {
    console.error('❌ Compression Error:', err);
    res.status(500).send('Compression failed');
  }
});

app.get('/', (req, res) => {
  res.send('✅ Image Compression Server is Running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});