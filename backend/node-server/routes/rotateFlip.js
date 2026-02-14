const express = require('express');
const sharp = require('sharp');
const { singleUpload } = require('../middleware/upload');
const { createSession, getSession, deleteSession, bufferToBase64, MIME_MAP } = require('../utils/sessions');

const router = express.Router();

function applyFormat(pipeline, format, quality = 95) {
  if (format === 'jpeg' || format === 'jpg') return pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
  if (format === 'png')  return pipeline.png({ quality, compressionLevel: 6 });
  if (format === 'webp') return pipeline.webp({ quality });
  if (format === 'avif') return pipeline.avif({ quality });
  return pipeline.png({ quality });
}

// ── POST /rotate-flip ─────────────────────────────────────────────────────
router.post('/rotate-flip', singleUpload.single('image'), async (req, res) => {
  const t0 = Date.now();
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const rotation = parseInt(req.body.rotate) || 0;
    const flipH = req.body.flipX === 'true';
    const flipV = req.body.flipY === 'true';
    const quality = parseInt(req.body.quality) || 95;

    const meta = await sharp(req.file.buffer).metadata();
    let pipeline = sharp(req.file.buffer, { failOnError: false });

    if (flipH) pipeline = pipeline.flop();
    if (flipV) pipeline = pipeline.flip();
    if (rotation && rotation !== 0) {
      pipeline = pipeline.rotate(rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
    }

    pipeline = applyFormat(pipeline, meta.format, quality);
    const buf = await pipeline.toBuffer();
    const outMeta = await sharp(buf).metadata();

    const sessionId = createSession({
      buffer: buf, format: outMeta.format, originalName: req.file.originalname
    });

    res.json({
      success: true,
      image: bufferToBase64(buf, outMeta.format),
      sessionId,
      originalSize: req.file.size,
      currentSize: buf.length,
      dimensions: { width: outMeta.width, height: outMeta.height },
      format: outMeta.format,
      processingTime: `${Date.now() - t0}ms`
    });
  } catch (err) {
    console.error('Rotate/flip error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /rotate-flip/download/:id ─────────────────────────────────────────
router.get('/rotate-flip/download/:sessionId', (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session expired' });

  const ext = session.format === 'jpeg' ? 'jpg' : session.format;
  const filename = session.originalName ? session.originalName.replace(/\.[^.]+$/, `.${ext}`) : `processed.${ext}`;

  res.set({
    'Content-Type': MIME_MAP[session.format] || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': session.buffer.length
  });
  res.send(session.buffer);
  deleteSession(req.params.sessionId);
});

module.exports = router;
