const express = require('express');
const sharp = require('sharp');
const { singleUpload, autoLoadBuffer } = require('../middleware/upload');
const { createSession, getSession, deleteSession, bufferToBase64, MIME_MAP } = require('../utils/sessions');

const router = express.Router();

// Preserve format pipeline helper
function applyFormat(pipeline, format, quality = 90) {
  if (format === 'jpeg' || format === 'jpg') return pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
  if (format === 'png')  return pipeline.png({ quality, compressionLevel: 6 });
  if (format === 'webp') return pipeline.webp({ quality });
  if (format === 'avif') return pipeline.avif({ quality });
  return pipeline.png({ quality });
}

// ── POST /resize ───────────────────────────────────────────────────────────
router.post('/resize', singleUpload.single('image'), autoLoadBuffer, async (req, res) => {
  const t0 = Date.now();
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const width = req.body.width ? parseInt(req.body.width) : null;
    const height = req.body.height ? parseInt(req.body.height) : null;
    const fit = req.body.fit || 'inside';
    const quality = parseInt(req.body.quality) || 90;

    if (!width && !height) return res.status(400).json({ error: 'Width or height required' });
    if ((width && width > 10000) || (height && height > 10000)) return res.status(400).json({ error: 'Max 10000px' });

    const meta = await sharp(req.file.buffer).metadata();
    let pipeline = sharp(req.file.buffer, { failOnError: false });

    const opts = { fit, kernel: sharp.kernel.lanczos3, withoutEnlargement: false };
    if (width && height) pipeline = pipeline.resize(width, height, opts);
    else if (width) pipeline = pipeline.resize(width, null, opts);
    else pipeline = pipeline.resize(null, height, opts);

    pipeline = applyFormat(pipeline, meta.format, quality);
    const buf = await pipeline.toBuffer();
    const outMeta = await sharp(buf).metadata();

    const sessionId = createSession({
      buffer: buf, format: outMeta.format, originalName: req.file.originalname
    });

    // MEMORY MANAGEMENT: free input buffer, keep only session copy
    req.file.buffer = null;

    res.json({
      success: true,
      image: bufferToBase64(buf, outMeta.format),
      sessionId,
      originalSize: req.file.size,
      currentSize: buf.length,
      dimensions: { width: outMeta.width, height: outMeta.height },
      processingTime: `${Date.now() - t0}ms`
    });
  } catch (err) {
    console.error('Resize error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /resize/rotate ────────────────────────────────────────────────────
router.post('/resize/rotate', async (req, res) => {
  const t0 = Date.now();
  try {
    const { sessionId, direction, angle } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

    const session = getSession(sessionId);
    if (!session) return res.status(404).json({ error: 'Session expired' });

    let deg = 0;
    if (direction === 'left') deg = -90;
    else if (direction === 'right') deg = 90;
    else if (angle) deg = parseInt(angle);
    else return res.status(400).json({ error: 'Direction or angle required' });

    let pipeline = sharp(session.buffer).rotate(deg, { background: { r: 255, g: 255, b: 255, alpha: 0 } });
    pipeline = applyFormat(pipeline, session.format);

    const buf = await pipeline.toBuffer();
    const outMeta = await sharp(buf).metadata();

    // Update session in place
    session.buffer = buf;
    session.createdAt = Date.now();

    res.json({
      success: true,
      image: bufferToBase64(buf, session.format),
      sessionId,
      currentSize: buf.length,
      dimensions: { width: outMeta.width, height: outMeta.height },
      processingTime: `${Date.now() - t0}ms`
    });
  } catch (err) {
    console.error('Resize rotate error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /resize/download/:id ───────────────────────────────────────────────
router.get('/resize/download/:sessionId', (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session expired' });

  const ext = session.format === 'jpeg' ? 'jpg' : session.format;
  const filename = session.originalName ? session.originalName.replace(/\.[^.]+$/, `.${ext}`) : `resized.${ext}`;

  res.set({
    'Content-Type': MIME_MAP[session.format] || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': session.buffer.length
  });
  res.send(session.buffer);

  // Clean up after sending
  deleteSession(req.params.sessionId);
});

module.exports = router;
