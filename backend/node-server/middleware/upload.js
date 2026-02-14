const multer = require('multer');

// Shared memory-based multer for single file (50MB)
const singleUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// Higher limit for converter (100MB)
const largeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Batch upload (up to 50 files, 100MB each)
const batchUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 50 }
});

// Watermark needs two fields
const watermarkUpload = multer({ storage: multer.memoryStorage() });

module.exports = { singleUpload, largeUpload, batchUpload, watermarkUpload };
