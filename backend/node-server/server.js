const express = require('express');
const cors = require('cors');
const fs = require('fs');

// ── Route modules ──────────────────────────────────────────────────────────
const compressRoute   = require('./routes/compress');
const convertRoute    = require('./routes/convert');
const resizeRoute     = require('./routes/resize');
const rotateFlipRoute = require('./routes/rotateFlip');
const cropRoute       = require('./routes/crop');
const watermarkRoute  = require('./routes/watermark');
const bgRemoveRoute   = require('./routes/bgRemove');
const editorRoute     = require('./routes/editor');
const { UPLOAD_DIR }  = require('./middleware/upload');

// ── App Setup ──────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── MEMORY MANAGEMENT: Railway free-tier memory limit (~512MB) ─────────────
const MEMORY_WARN_MB = 400;   // warn at 400 MB
const MEMORY_CRITICAL_MB = 480; // force-clean at 480 MB

// ── CORS – restrict in production ──────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['*'];

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use(express.json({ limit: '1mb' }));

// Trust proxy (Render, Railway, etc.)
app.set('trust proxy', 1);

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── MEMORY MANAGEMENT: Request cleanup middleware ──────────────────────────
// Nullify req.file/req.files buffers after response to free RAM immediately
app.use((req, res, next) => {
  const originalEnd = res.end.bind(res);
  res.end = function (...args) {
    // Clean up multer file buffers after response is sent
    if (req.file && req.file.buffer) {
      req.file.buffer = null;
    }
    if (req.files) {
      if (Array.isArray(req.files)) {
        for (const f of req.files) { if (f.buffer) f.buffer = null; }
      } else {
        for (const field of Object.values(req.files)) {
          for (const f of field) { if (f.buffer) f.buffer = null; }
        }
      }
    }
    return originalEnd(...args);
  };
  next();
});

// ── Mount Routes ───────────────────────────────────────────────────────────
app.use('/api/image', compressRoute);
app.use('/api/image', convertRoute);
app.use('/api/image', resizeRoute);
app.use('/api/image', rotateFlipRoute);
app.use('/api/image', cropRoute);
app.use('/api/image', watermarkRoute);
app.use('/api/image', bgRemoveRoute);
app.use('/api/image', editorRoute);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const { sessions } = require('./utils/sessions');
  const mem = process.memoryUsage();
  res.json({
    status: 'healthy',
    service: 'allfilechanger-node-backend',
    environment: NODE_ENV,
    activeSessions: sessions.size,
    uptime: Math.floor(process.uptime()),
    memoryMB: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      external: Math.round(mem.external / 1024 / 1024)
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'AllFileChanger Unified Image API',
    version: '1.0.0',
    endpoints: {
      compress:    'POST /api/image/compress',
      convert:     'POST /api/image/convert',
      convertBatch:'POST /api/image/convert-batch',
      resize:      'POST /api/image/resize',
      resizeRotate:'POST /api/image/resize/rotate',
      rotateFlip:  'POST /api/image/rotate-flip',
      crop:        'POST /api/image/crop',
      watermark:   'POST /api/image/watermark',
      bgRemove:    'POST /api/image/remove-background',
      edit:        'POST /api/image/edit',
      health:      'GET  /health'
    }
  });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Multer file-size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    ...(NODE_ENV !== 'production' && { message: err.message })
  });
});

// ── MEMORY MANAGEMENT: Periodic memory monitoring & emergency cleanup ──────
setInterval(() => {
  const mem = process.memoryUsage();
  const rssMB = Math.round(mem.rss / 1024 / 1024);

  if (rssMB > MEMORY_CRITICAL_MB) {
    console.warn(`🚨 CRITICAL MEMORY: ${rssMB}MB — force-clearing all sessions & temp files`);
    const { sessions } = require('./utils/sessions');
    // Clear all session data
    for (const [id, s] of sessions.entries()) {
      if (s.buffer) s.buffer = null;
      if (s.data) s.data = null;
    }
    sessions.clear();
    // Clear temp upload dir
    try {
      if (fs.existsSync(UPLOAD_DIR)) {
        const files = fs.readdirSync(UPLOAD_DIR);
        for (const f of files) {
          try { fs.unlinkSync(require('path').join(UPLOAD_DIR, f)); } catch (_) {}
        }
      }
    } catch (_) {}
    // Force GC if available
    if (global.gc) global.gc();
  } else if (rssMB > MEMORY_WARN_MB) {
    console.warn(`⚠️ HIGH MEMORY: ${rssMB}MB — consider upgrading Railway plan`);
    if (global.gc) global.gc();
  }
}, 15 * 1000); // check every 15 seconds

// ── Graceful shutdown ──────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n🛑 ${signal} received – shutting down gracefully`);
  // Clean up all sessions
  const { sessions } = require('./utils/sessions');
  for (const [id, s] of sessions.entries()) {
    if (s.buffer) s.buffer = null;
  }
  sessions.clear();
  // Clean up temp files
  try {
    if (fs.existsSync(UPLOAD_DIR)) {
      const { execSync } = require('child_process');
      execSync(`rm -rf ${UPLOAD_DIR}/*`, { stdio: 'ignore' });
    }
  } catch (_) {}
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000); // force-quit after 10s
}

// ── Start ──────────────────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ AllFileChanger Node Backend running on port ${PORT} [${NODE_ENV}]`);
  console.log(`📦 Memory limit: warn=${MEMORY_WARN_MB}MB, critical=${MEMORY_CRITICAL_MB}MB`);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
