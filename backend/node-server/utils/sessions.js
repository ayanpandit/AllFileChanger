const crypto = require('crypto');

// ── Shared session store ──────────────────────────────────────────────────
const sessions = new Map();
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes (shorter = less memory)

// ── Cleanup interval ──────────────────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [id, s] of sessions.entries()) {
    if (now - s.createdAt > SESSION_TIMEOUT) {
      sessions.delete(id);
      cleaned++;
    }
  }
  if (cleaned > 0) console.log(`🧹 Cleaned ${cleaned} expired sessions (${sessions.size} active)`);
}, 2 * 60 * 1000); // check every 2 min

function createSession(data) {
  const id = crypto.randomBytes(16).toString('hex');
  sessions.set(id, { ...data, createdAt: Date.now() });
  return id;
}

function getSession(id) {
  return sessions.get(id) || null;
}

function deleteSession(id) {
  return sessions.delete(id);
}

// Mime helpers
const MIME_MAP = {
  jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', tiff: 'image/tiff',
  avif: 'image/avif', heif: 'image/heif', heic: 'image/heic'
};

function bufferToBase64(buffer, format) {
  const mime = MIME_MAP[format] || 'image/png';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

module.exports = { sessions, createSession, getSession, deleteSession, bufferToBase64, MIME_MAP };
