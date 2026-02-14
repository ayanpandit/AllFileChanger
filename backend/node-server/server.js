const express = require('express');
const cors = require('cors');

// ── Route modules ──────────────────────────────────────────────────────────
const compressRoute   = require('./routes/compress');
const convertRoute    = require('./routes/convert');
const resizeRoute     = require('./routes/resize');
const rotateFlipRoute = require('./routes/rotateFlip');
const cropRoute       = require('./routes/crop');
const watermarkRoute  = require('./routes/watermark');
const bgRemoveRoute   = require('./routes/bgRemove');
const editorRoute     = require('./routes/editor');

// ── App Setup ──────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
  res.json({
    status: 'healthy',
    service: 'allfilechanger-node-backend',
    environment: NODE_ENV,
    activeSessions: sessions.size,
    uptime: Math.floor(process.uptime()),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
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

// ── Graceful shutdown ──────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n🛑 ${signal} received – shutting down gracefully`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000); // force-quit after 10s
}

// ── Start ──────────────────────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ AllFileChanger Node Backend running on port ${PORT} [${NODE_ENV}]`);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
