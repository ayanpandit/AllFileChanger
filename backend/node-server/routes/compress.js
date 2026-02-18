const express = require('express');
const sharp = require('sharp');
const { singleUpload, autoLoadBuffer } = require('../middleware/upload');

const router = express.Router();

router.post('/compress', singleUpload.single('image'), autoLoadBuffer, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const quality = parseInt(req.body.quality) || 80;
    const targetSizeKB = parseInt(req.body.targetSizeKB);

    const metadata = await sharp(req.file.buffer).metadata();
    let outputFormat = 'jpeg';
    if (metadata.format === 'png') outputFormat = 'png';
    else if (metadata.format === 'webp') outputFormat = 'webp';

    let compressed;

    if (targetSizeKB) {
      // Binary-search target size compression
      const targetBytes = Math.floor(targetSizeKB * 1024 * 0.98);
      let workingBuffer = req.file.buffer;

      // Estimate if resize needed
      const pixelCount = metadata.width * metadata.height;
      const estimatedMinSize = pixelCount * 0.1;
      if (estimatedMinSize > targetBytes) {
        const scale = Math.sqrt(targetBytes / estimatedMinSize);
        workingBuffer = await sharp(req.file.buffer)
          .resize(Math.floor(metadata.width * scale), Math.floor(metadata.height * scale), { fit: 'inside' })
          .toBuffer();
      }

      let lo = 1, hi = 95, best = null;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const buf = await compressToFormat(workingBuffer, outputFormat, mid);
        if (buf.length <= targetBytes) { best = buf; lo = mid + 1; }
        else hi = mid - 1;
      }

      // Fallback: aggressive resize
      if (!best || best.length > targetBytes) {
        for (let scale = 0.9; scale >= 0.1; scale -= 0.1) {
          const resized = await sharp(req.file.buffer)
            .resize(Math.floor(metadata.width * scale), Math.floor(metadata.height * scale), { fit: 'inside' })
            .toBuffer();
          const buf = await compressToFormat(resized, outputFormat, 40);
          if (buf.length <= targetBytes) { best = buf; break; }
        }
      }
      // MEMORY MANAGEMENT: free working buffer
      workingBuffer = null;
      compressed = best || (await compressToFormat(req.file.buffer, outputFormat, 20));
    } else {
      compressed = await compressToFormat(req.file.buffer, outputFormat, quality);
    }

    // MEMORY MANAGEMENT: free input buffer before sending
    req.file.buffer = null;

    const mime = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
    res.set({ 'Content-Type': mime, 'Original-Size': req.file.size, 'Compressed-Size': compressed.length });
    res.send(compressed);
    compressed = null; // free after send
  } catch (err) {
    console.error('Compress error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function compressToFormat(buffer, fmt, quality) {
  if (fmt === 'png') return sharp(buffer).png({ quality, compressionLevel: 9 }).toBuffer();
  if (fmt === 'webp') return sharp(buffer).webp({ quality, effort: 6 }).toBuffer();
  return sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
}

module.exports = router;
