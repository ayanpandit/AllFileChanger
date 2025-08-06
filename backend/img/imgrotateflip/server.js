const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('output'));

// Storage for uploads
const upload = multer({ dest: 'uploads/' });

// Global processed image buffer
let processedImageBuffer = null;
let lastImageFormat = 'jpeg';

// Upload Route
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const image = sharp(filePath);
    const metadata = await image.metadata();
    lastImageFormat = metadata.format;

    processedImageBuffer = await image.toBuffer();
    fs.unlinkSync(filePath); // remove temp upload

    // Add timestamp to force cache refresh
    const timestamp = Date.now();
    const outputPath = `output/processed.${lastImageFormat}`;
    fs.writeFileSync(outputPath, processedImageBuffer);

    res.json({ image: `http://localhost:5000/processed.${lastImageFormat}?t=${timestamp}` });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

// Rotate Route
app.post('/rotate', async (req, res) => {
  try {
    const { direction } = req.body;
    
    if (!processedImageBuffer) {
      return res.status(400).json({ error: 'No image uploaded. Please upload an image first.' });
    }
    
    const degrees = direction === 'left' ? -90 : 90;

    processedImageBuffer = await sharp(processedImageBuffer).rotate(degrees).toBuffer();
    
    // Add timestamp to force cache refresh
    const timestamp = Date.now();
    const outputPath = `output/processed.${lastImageFormat}`;
    fs.writeFileSync(outputPath, processedImageBuffer);

    res.json({ image: `http://localhost:5000/processed.${lastImageFormat}?t=${timestamp}` });
  } catch (err) {
    console.error('Rotation error:', err);
    res.status(500).json({ error: 'Rotation failed.' });
  }
});

// Flip Route
app.post('/flip', async (req, res) => {
  try {
    const { direction } = req.body;
    
    if (!processedImageBuffer) {
      return res.status(400).json({ error: 'No image uploaded. Please upload an image first.' });
    }

    let transformer = sharp(processedImageBuffer);
    if (direction === 'horizontal') transformer = transformer.flop();
    if (direction === 'vertical') transformer = transformer.flip();

    processedImageBuffer = await transformer.toBuffer();
    
    // Add timestamp to force cache refresh
    const timestamp = Date.now();
    const outputPath = `output/processed.${lastImageFormat}`;
    fs.writeFileSync(outputPath, processedImageBuffer);

    res.json({ image: `http://localhost:5000/processed.${lastImageFormat}?t=${timestamp}` });
  } catch (err) {
    console.error('Flip error:', err);
    res.status(500).json({ error: 'Flip failed.' });
  }
});

// Download Route
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, `output/processed.${lastImageFormat}`);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found.');
  }
});

// Ensure output folder exists
if (!fs.existsSync('output')) fs.mkdirSync('output');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Start server
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
