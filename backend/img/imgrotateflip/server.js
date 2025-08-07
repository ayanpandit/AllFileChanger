const express = require('express');
const cors = require('cors'); // ✅ ADD THIS
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ENABLE CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST /process
app.post('/process', upload.single('image'), async (req, res) => {
  const { rotate, flipX, flipY } = req.body;
  const imagePath = req.file.path;
  const outputPath = 'uploads/processed-' + Date.now() + path.extname(req.file.originalname);

  try {
    let image = sharp(imagePath);

    const rotateAngle = parseInt(rotate);
    if (rotateAngle) image = image.rotate(rotateAngle);

    if (flipX === 'true') image = image.flop();
    if (flipY === 'true') image = image.flip();

    await image.toFile(outputPath);

    fs.unlinkSync(imagePath);

    res.sendFile(path.resolve(outputPath));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Keep alive mechanism to prevent server from sleeping
setInterval(() => {
  console.log('🔄 Keep alive ping at', new Date().toISOString());
}, 13 * 60 * 1000); // Ping every 13 minutes
