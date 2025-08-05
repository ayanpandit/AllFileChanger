const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MEMORY OPTIMIZATION START ====================
// Configure Sharp for memory efficiency
sharp.cache(false); // Disable cache to prevent memory buildup
sharp.simd(false);  // Disable SIMD for lower memory usage on free tier

// Memory limits for file uploads (max 10MB to prevent memory issues)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Force garbage collection periodically if available
if (global.gc) {
  setInterval(() => {
    global.gc();
    console.log('🗑️ Garbage collection triggered');
  }, 60000); // Every minute
} else {
  console.log('⚠️ Garbage collection not available. Run with --expose-gc for better memory management');
}

// Memory monitoring
let requestCount = 0;
const monitorMemory = () => {
  const used = process.memoryUsage();
  const mb = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  if (used.heapUsed > 400 * 1024 * 1024) { // Alert if using more than 400MB
    console.log('⚠️ High memory usage detected:', {
      heap: `${mb(used.heapUsed)} MB`,
      external: `${mb(used.external)} MB`,
      requests: requestCount
    });
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🗑️ Emergency garbage collection triggered');
    }
  }
};

// Monitor memory every 30 seconds
setInterval(monitorMemory, 30000);
// ==================== MEMORY OPTIMIZATION END ====================

app.use(cors({
  origin: ['https://allfilechanger.onrender.com', 'http://localhost:3000'],
  exposedHeaders: ['Original-Size', 'Compressed-Size', 'Content-Disposition']
}));

// Configure multer with memory limits
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: MAX_FILE_SIZE,
    fieldSize: MAX_FILE_SIZE 
  }
});

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

// ==================== MEMORY-OPTIMIZED COMPRESSION START ====================
async function compressToTarget(buffer, targetKB) {
  let quality = 80;
  let width;
  let compressed = buffer;
  let sharpInstance;

  try {
    // Get metadata once and reuse
    sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    width = metadata.width;
    
    // Clean up the sharp instance
    sharpInstance.destroy();
    sharpInstance = null;

    // Quality-based compression first
    while (quality >= 10) {
      sharpInstance = sharp(buffer)
        .jpeg({ 
          quality, 
          progressive: true, // Better compression
          mozjpeg: true     // Use mozjpeg encoder for better compression
        });
      
      const temp = await sharpInstance.toBuffer();
      sharpInstance.destroy();
      sharpInstance = null;
      
      if (temp.length / 1024 <= targetKB) {
        return temp;
      }
      compressed = temp;
      quality -= 10; // Larger steps for faster processing
      
      // Force garbage collection between iterations
      if (global.gc) global.gc();
    }

    // Resize-based compression if quality reduction isn't enough
    while (width > 100) {
      width = Math.floor(width * 0.8); // Larger reduction steps
      
      sharpInstance = sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ 
          quality: 10, 
          progressive: true,
          mozjpeg: true 
        });
      
      const temp = await sharpInstance.toBuffer();
      sharpInstance.destroy();
      sharpInstance = null;
      
      if (temp.length / 1024 <= targetKB) {
        return temp;
      }
      compressed = temp;
      
      // Force garbage collection between iterations
      if (global.gc) global.gc();
    }

    return compressed;
  } catch (error) {
    // Clean up sharp instance on error
    if (sharpInstance) {
      sharpInstance.destroy();
    }
    throw error;
  }
}

async function simpleCompress(buffer, quality) {
  let sharpInstance;
  try {
    sharpInstance = sharp(buffer)
      .jpeg({ 
        quality, 
        progressive: true,
        mozjpeg: true 
      });
    
    const result = await sharpInstance.toBuffer();
    sharpInstance.destroy();
    return result;
  } catch (error) {
    if (sharpInstance) {
      sharpInstance.destroy();
    }
    throw error;
  }
}
// ==================== MEMORY-OPTIMIZED COMPRESSION END ====================

// ==================== ERROR HANDLING MIDDLEWARE START ====================
// Handle multer file size errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      console.log('❌ File too large:', error.message);
      return res.status(413).json({ 
        error: 'File too large. Maximum size is 10MB',
        maxSize: '10MB'
      });
    }
  }
  next(error);
});
// ==================== ERROR HANDLING MIDDLEWARE END ====================

app.post('/compress', upload.single('image'), async (req, res) => {
  // ==================== MEMORY-OPTIMIZED REQUEST HANDLING START ====================
  requestCount++;
  const requestId = requestCount;
  console.log(`📸 Processing request #${requestId}`);
  
  try {
    // Validate request
    if (!req.file || !req.file.buffer) {
      console.log(`❌ Request #${requestId}: No image uploaded`);
      return res.status(400).send('No image uploaded');
    }

    const buffer = req.file.buffer;
    const originalSize = buffer.length;
    
    // Check file size limits
    if (originalSize > MAX_FILE_SIZE) {
      console.log(`❌ Request #${requestId}: File too large (${formatKB(originalSize)})`);
      return res.status(413).send('File too large. Maximum size is 10MB');
    }
    
    const targetKB = parseInt(req.body.targetSize);
    const quality = parseInt(req.body.quality);

    console.log(`🔄 Request #${requestId}: Compressing ${formatKB(originalSize)} image`);

    let compressed;
    if (!isNaN(targetKB) && targetKB > 0) {
      compressed = await compressToTarget(buffer, targetKB);
    } else if (!isNaN(quality) && quality >= 10 && quality <= 100) {
      compressed = await simpleCompress(buffer, quality);
    } else {
      console.log(`❌ Request #${requestId}: Invalid compression parameters`);
      return res.status(400).send('Invalid compression parameters');
    }

    console.log(`✅ Request #${requestId}: Compressed from ${formatKB(originalSize)} to ${formatKB(compressed.length)}`);

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename=compressed.jpg',
      'Original-Size': formatKB(originalSize),
      'Compressed-Size': formatKB(compressed.length),
    });

    res.send(compressed);
    
    // Clean up after response
    compressed = null;
    
    // Force garbage collection after each request if available
    if (global.gc) {
      setImmediate(() => {
        global.gc();
        console.log(`🗑️ Request #${requestId}: Memory cleaned`);
      });
    }

  } catch (err) {
    console.error(`❌ Request #${requestId}: Compression Error:`, err.message);
    
    // Force garbage collection on error
    if (global.gc) {
      global.gc();
    }
    
    res.status(500).send('Compression failed');
  }
  // ==================== MEMORY-OPTIMIZED REQUEST HANDLING END ====================
});

app.get('/', (req, res) => {
  res.send('✅ Image Compression Server is Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ==================== KEEP-ALIVE FUNCTION START ====================
// This function prevents Render free tier from sleeping by sending a request every 13 minutes
function keepAlive() {
  /**
   * Sends a keep-alive request to the server every 13 minutes to prevent 
   * Render free tier from going to sleep (15-minute timeout)
   */
  setInterval(async () => {
    try {
      // Get the current server URL from environment or use default
      const serverUrl = process.env.RENDER_EXTERNAL_URL || 'https://imagecompressor-fryf.onrender.com';
      
      // Send a simple GET request to the health endpoint
      const response = await axios.get(`${serverUrl}/health`, { timeout: 30000 });
      
      if (response.status === 200) {
        console.log('✅ Keep-alive ping successful');
      } else {
        console.warn(`⚠️ Keep-alive ping returned status: ${response.status}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.warn('⚠️ Keep-alive ping timeout');
      } else {
        console.warn(`⚠️ Keep-alive ping failed: ${error.message}`);
      }
    }
  }, 13 * 60 * 1000); // 13 minutes in milliseconds
  
  console.log('🔄 Keep-alive service started - pinging every 13 minutes');
}

// Start keep-alive service
keepAlive();
// ==================== KEEP-ALIVE FUNCTION END ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});