const multer = require('multer');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ── MEMORY MANAGEMENT: Use disk storage to keep RAM free on Railway free tier ──
const UPLOAD_DIR = path.join(os.tmpdir(), 'afc-uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)
});

// Helper: read file from disk into buffer, then delete temp file immediately
function loadAndCleanup(file) {
  if (!file || !file.path) return null;
  try {
    const buffer = fs.readFileSync(file.path);
    fs.unlinkSync(file.path); // delete temp file immediately after reading
    return buffer;
  } catch (err) {
    try { fs.unlinkSync(file.path); } catch (_) {}
    throw err;
  }
}

// Middleware: auto-load file buffer and clean temp file for single uploads
function autoLoadBuffer(req, res, next) {
  if (req.file) {
    req.file.buffer = loadAndCleanup(req.file);
  }
  next();
}

// Middleware: auto-load file buffers and clean temp files for batch uploads
function autoLoadBatchBuffers(req, res, next) {
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      file.buffer = loadAndCleanup(file);
    }
  }
  // Handle fields-style uploads (watermark)
  if (req.files && !Array.isArray(req.files)) {
    for (const fieldName of Object.keys(req.files)) {
      for (const file of req.files[fieldName]) {
        file.buffer = loadAndCleanup(file);
      }
    }
  }
  next();
}

// ── MEMORY MANAGEMENT: Reduced limits for Railway free tier ──
// Single image upload (25MB max — reduced from 50MB)
const singleUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// Converter (50MB max — reduced from 100MB)
const largeUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Batch upload (10 files × 25MB — reduced from 50 × 100MB)
const batchUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024, files: 10 }
});

// Watermark (25MB max — was unlimited!)
const watermarkUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

// Periodic cleanup of stale temp files (older than 5 min)
setInterval(() => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) return;
    const files = fs.readdirSync(UPLOAD_DIR);
    const now = Date.now();
    let cleaned = 0;
    for (const f of files) {
      const fp = path.join(UPLOAD_DIR, f);
      try {
        const stat = fs.statSync(fp);
        if (now - stat.mtimeMs > 5 * 60 * 1000) {
          fs.unlinkSync(fp);
          cleaned++;
        }
      } catch (_) {}
    }
    if (cleaned > 0) console.log(`🧹 Upload cleanup: removed ${cleaned} stale temp files`);
  } catch (_) {}
}, 60 * 1000); // every 1 min

module.exports = { singleUpload, largeUpload, batchUpload, watermarkUpload, autoLoadBuffer, autoLoadBatchBuffers, UPLOAD_DIR };
