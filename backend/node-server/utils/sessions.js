const crypto = require('crypto');

// ── MEMORY MANAGEMENT: Aggressive session cleanup for Railway free tier ────
const sessions = new Map();
const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes (reduced from 10 min to save RAM)
const MAX_SESSIONS = 5; // Max concurrent sessions to prevent OOM

// ── Cleanup interval — every 30 seconds (was every 2 min) ──────────────────
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [id, s] of sessions.entries()) {
    if (now - s.createdAt > SESSION_TIMEOUT) {
      // Explicitly null out buffers before deleting
      if (s.buffer) s.buffer = null;
      if (s.data) s.data = null;
      sessions.delete(id);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} expired sessions (${sessions.size} active)`);
    // Force garbage collection if available (node --expose-gc)
    if (global.gc) global.gc();
  }
}, 30 * 1000); // check every 30 seconds

function createSession(data) {
  // Evict oldest session if at capacity
  if (sessions.size >= MAX_SESSIONS) {
    let oldestId = null, oldestTime = Infinity;
    for (const [id, s] of sessions.entries()) {
      if (s.createdAt < oldestTime) { oldestTime = s.createdAt; oldestId = id; }
    }
    if (oldestId) {
      const old = sessions.get(oldestId);
      if (old && old.buffer) old.buffer = null;
      sessions.delete(oldestId);
      console.log(`🧹 Evicted oldest session (${sessions.size} active, max ${MAX_SESSIONS})`);
    }
  }

  const id = crypto.randomBytes(16).toString('hex');
  sessions.set(id, { ...data, createdAt: Date.now() });
  return id;
}

function getSession(id) {
  return sessions.get(id) || null;
}

function deleteSession(id) {
  const session = sessions.get(id);
  if (session) {
    // Explicitly null out large data to help GC
    if (session.buffer) session.buffer = null;
    if (session.data) session.data = null;
  }
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
