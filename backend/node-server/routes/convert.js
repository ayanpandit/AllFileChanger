const express = require('express');
const sharp = require('sharp');
const archiver = require('archiver');
const { largeUpload, batchUpload } = require('../middleware/upload');

const router = express.Router();

// Format config factory
function getFormatConfig(format, quality) {
  const configs = {
    jpg:  { type: 'jpeg', mime: 'image/jpeg',  ext: 'jpg',  options: { quality, mozjpeg: true, progressive: true } },
    jpeg: { type: 'jpeg', mime: 'image/jpeg',  ext: 'jpg',  options: { quality, mozjpeg: true, progressive: true } },
    png:  { type: 'png',  mime: 'image/png',   ext: 'png',  options: { compressionLevel: 9, quality } },
    webp: { type: 'webp', mime: 'image/webp',  ext: 'webp', options: { quality, effort: 6, smartSubsample: true } },
    avif: { type: 'avif', mime: 'image/avif',  ext: 'avif', options: { quality, effort: 9 } },
    heif: { type: 'heif', mime: 'image/heif',  ext: 'heif', options: { quality, compression: 'av1' } },
    gif:  { type: 'gif',  mime: 'image/gif',   ext: 'gif',  options: {} },
    tiff: { type: 'tiff', mime: 'image/tiff',  ext: 'tiff', options: { quality, compression: 'lzw' } },
    bmp:  { type: 'png',  mime: 'image/bmp',   ext: 'bmp',  options: {} },
    ico:  { type: 'png',  mime: 'image/x-icon', ext: 'ico', options: { quality }, resize: { width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } } }
  };
  return configs[format] || null;
}

// Convert single image pipeline
async function convertImage(buffer, format, quality) {
  const config = getFormatConfig(format, quality);
  if (!config) return null;

  let pipeline = sharp(buffer, { failOn: 'none' }).rotate();
  const meta = await sharp(buffer).metadata();

  // Flatten alpha for formats that don't support it
  if (!['png', 'webp', 'avif', 'gif'].includes(format) && meta.hasAlpha) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }
  if (meta.space === 'cmyk') pipeline = pipeline.toColorspace('srgb');
  if (config.resize) pipeline = pipeline.resize(config.resize);

  return { buffer: await pipeline[config.type](config.options).toBuffer(), config, meta };
}

// ── Single convert ─────────────────────────────────────────────────────────
router.post('/convert', largeUpload.single('image'), async (req, res) => {
  const t0 = Date.now();
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const format = (req.body.format || 'png').toLowerCase();
    const quality = Math.min(100, Math.max(1, parseInt(req.body.quality) || 90));

    // SVG special handling
    if (format === 'svg') {
      const meta = await sharp(req.file.buffer).metadata();
      const w = Math.min(meta.width, 2000);
      const scale = w / meta.width;
      const h = Math.floor(meta.height * scale);
      const png = await sharp(req.file.buffer).resize(w, h, { kernel: 'lanczos3', fit: 'inside' }).png({ quality: 100 }).toBuffer();
      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><image width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${png.toString('base64')}"/></svg>`;
      res.set({ 'Content-Type': 'image/svg+xml', 'Content-Disposition': 'attachment; filename="converted.svg"' });
      return res.send(svg);
    }

    const result = await convertImage(req.file.buffer, format, quality);
    if (!result) return res.status(400).json({ error: 'Unsupported format', supported: Object.keys(getFormatConfig('jpg', 90) ? {} : {}) });

    res.set({
      'Content-Type': result.config.mime,
      'Content-Disposition': `attachment; filename="converted.${result.config.ext}"`,
      'X-Original-Size': req.file.size,
      'X-Converted-Size': result.buffer.length,
      'X-Conversion-Time': `${Date.now() - t0}ms`
    });
    res.send(result.buffer);
  } catch (err) {
    console.error('Convert error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Batch convert → ZIP ────────────────────────────────────────────────────
router.post('/convert-batch', batchUpload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

    const format = (req.body.format || 'png').toLowerCase();
    const quality = Math.min(100, Math.max(1, parseInt(req.body.quality) || 90));
    const config = getFormatConfig(format, quality);
    if (!config) return res.status(400).json({ error: 'Unsupported format' });

    const archive = archiver('zip', { zlib: { level: 6 } });
    res.set({ 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="converted_images.zip"` });
    archive.pipe(res);

    for (let i = 0; i < req.files.length; i++) {
      try {
        const result = await convertImage(req.files[i].buffer, format, quality);
        if (result) {
          const name = req.files[i].originalname.replace(/\.[^/.]+$/, '') + `_${i + 1}.${config.ext}`;
          archive.append(result.buffer, { name });
        }
      } catch (e) { console.error(`Batch item ${i + 1} failed:`, e.message); }
    }
    await archive.finalize();
  } catch (err) {
    console.error('Batch convert error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
