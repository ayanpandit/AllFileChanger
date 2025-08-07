const express = require('express');
const cors = require('cors'); // ✅ ADD THIS
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ENABLE CORS with specific origins for production
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Local development
    'http://localhost:5173',           // Vite dev server
    'https://allfilechanger.onrender.com', // Production frontend
    'https://imgrotateflip.onrender.com'   // Backend URL (for testing)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Image Rotate & Flip API is running!', 
    version: '1.0.0',
    endpoints: ['/process'],
    timestamp: new Date().toISOString()
  });
});

// GET /health - Health check for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// POST /process
app.post('/process', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const { rotate, flipX, flipY } = req.body;
  const imagePath = req.file.path;
  const outputPath = 'uploads/processed-' + Date.now() + path.extname(req.file.originalname);

  console.log(`🔄 Processing image: ${req.file.originalname}, rotate: ${rotate}°, flipX: ${flipX}, flipY: ${flipY}`);

  try {
    let image = sharp(imagePath);

    const rotateAngle = parseInt(rotate);
    if (rotateAngle && rotateAngle !== 0) {
      image = image.rotate(rotateAngle);
      console.log(`↻ Rotating by ${rotateAngle}°`);
    }

    if (flipX === 'true') {
      image = image.flop();
      console.log('↔️ Flipping horizontally');
    }
    
    if (flipY === 'true') {
      image = image.flip();
      console.log('↕️ Flipping vertically');
    }

    await image.toFile(outputPath);

    // Clean up original file
    fs.unlinkSync(imagePath);

    console.log(`✅ Image processed successfully: ${outputPath}`);
    
    // Send the processed file
    res.sendFile(path.resolve(outputPath), (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
      } else {
        // Clean up processed file after sending
        setTimeout(() => {
          try {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
              console.log(`🗑️ Cleaned up processed file: ${outputPath}`);
            }
          } catch (cleanupErr) {
            console.error('❌ Error cleaning up processed file:', cleanupErr);
          }
        }, 5000); // Delete after 5 seconds
      }
    });

  } catch (err) {
    console.error('❌ Error processing image:', err);
    
    // Clean up files on error
    try {
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (cleanupErr) {
      console.error('❌ Error cleaning up files:', cleanupErr);
    }
    
    res.status(500).json({ 
      error: 'Error processing image', 
      message: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Image Rotate & Flip Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🔄 Keep-alive enabled: pinging every 13 minutes`);
});

// Keep alive mechanism to prevent server from sleeping
setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`🔄 Keep alive ping at ${timestamp}`);
  console.log(`📊 Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log(`⏱️ Uptime: ${Math.round(process.uptime())}s`);
}, 13 * 60 * 1000); // Ping every 13 minutes
