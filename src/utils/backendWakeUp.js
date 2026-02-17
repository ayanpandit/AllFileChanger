/*  ╔══════════════════════════════════════════════════════════════════════╗
 *  ║  RAILWAY FREE-TIER COLD-START WORKAROUND                           ║
 *  ║  ──────────────────────────────────────────────────────────────────  ║
 *  ║  Railway free/hobby plans put services to sleep after inactivity.   ║
 *  ║  The first request after sleep fails because the server is booting. ║
 *  ║                                                                     ║
 *  ║  This module:                                                       ║
 *  ║    1. Pings both backends on app load to wake them up early.        ║
 *  ║    2. Exports a `fetchWithWakeUp()` wrapper that auto-retries       ║
 *  ║       failed requests (with a delay) so users never see failures.   ║
 *  ║                                                                     ║
 *  ║  HOW TO REMOVE WHEN YOU BUY A PAID PLAN:                           ║
 *  ║    1. Delete this file  (src/utils/backendWakeUp.js)                ║
 *  ║    2. In src/App.jsx  → remove the useEffect that calls            ║
 *  ║       wakeUpBackends()  (look for "RAILWAY COLD-START" comments)   ║
 *  ║    3. In every page that uses fetchWithWakeUp() → replace it       ║
 *  ║       with a normal  fetch()  call.  (Search the codebase for      ║
 *  ║       "fetchWithWakeUp" — each usage has a comment telling you.)   ║
 *  ╚══════════════════════════════════════════════════════════════════════╝
 */

const NODE_BACKEND   = import.meta.env.VITE_NODE_API_URL;
const PYTHON_BACKEND = import.meta.env.VITE_PYTHON_API_URL;

/* ── Track which backends are already awake ─────────────────────────────── */
let nodeAwake   = false;
let pythonAwake = false;

/**
 * Ping a backend's /health endpoint until it responds (max ~30 s).
 * Called once on app mount so backends are warm before the user clicks anything.
 */
async function pingUntilAwake(url, label) {
  const MAX_ATTEMPTS = 6;       // 6 × 5 s = 30 s max wait
  const DELAY_MS     = 5000;    // 5 seconds between pings

  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {
      const res = await fetch(`${url}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(8000),   // 8 s timeout per attempt
      });
      if (res.ok) {
        console.log(`✅ ${label} backend is awake`);
        return true;
      }
    } catch {
      console.log(`⏳ ${label} backend waking up… (attempt ${i}/${MAX_ATTEMPTS})`);
    }
    if (i < MAX_ATTEMPTS) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
  console.warn(`⚠️ ${label} backend did not respond after ${MAX_ATTEMPTS} attempts`);
  return false;
}

/**
 * Call this once on App mount to wake both backends in parallel.
 */
export async function wakeUpBackends() {
  const [nodeOk, pythonOk] = await Promise.all([
    pingUntilAwake(NODE_BACKEND,   'Node'),
    pingUntilAwake(PYTHON_BACKEND, 'Python'),
  ]);
  nodeAwake   = nodeOk;
  pythonAwake = pythonOk;
}

/**
 * Drop-in replacement for  fetch()  that auto-retries on failure.
 *
 * Usage:  const res = await fetchWithWakeUp(url, options);
 *         // identical API to native fetch()
 *
 * It will:
 *   1. Try the request normally.
 *   2. If it fails (network error / 502 / 503), wait 3 s and retry up to 3 times.
 *   3. Return the first successful Response, or throw the last error.
 *
 * ➜  REMOVE THIS when you switch to a paid Railway plan and replace every
 *    fetchWithWakeUp(url, opts) with fetch(url, opts).
 */
export async function fetchWithWakeUp(url, options = {}) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 3000;     // 3 seconds

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);

      // 502/503 = backend still booting behind Railway's proxy
      if (response.status === 502 || response.status === 503) {
        throw new Error(`Backend returned ${response.status} (still waking up)`);
      }

      return response;          // ← success
    } catch (err) {
      lastError = err;
      console.warn(
        `⏳ Request failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
      );
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      }
    }
  }

  throw lastError;              // all retries exhausted
}
