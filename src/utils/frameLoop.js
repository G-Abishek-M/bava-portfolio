/**
 * Single shared 60Hz/120Hz requestAnimationFrame loop with delta time (dt in seconds)
 * and automatic pause when the browser tab is hidden.
 */

const subscribers = new Set();
let rafId = null;
let lastTimestamp = null;
let visibilityBound = false;

function handleVisibilityChange() {
  if (typeof document === 'undefined') return;
  if (document.hidden) {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastTimestamp = null;
  } else if (subscribers.size > 0 && rafId === null) {
    lastTimestamp = null;
    rafId = window.requestAnimationFrame(tick);
  }
}

function tick(now) {
  if (typeof document !== 'undefined' && document.hidden) {
    rafId = null;
    lastTimestamp = null;
    return;
  }

  const dt =
    lastTimestamp === null
      ? 1 / 60
      : Math.min(0.05, Math.max(0.001, (now - lastTimestamp) / 1000));
  lastTimestamp = now;

  subscribers.forEach((cb) => {
    cb(now, dt);
  });

  if (subscribers.size > 0) {
    rafId = window.requestAnimationFrame(tick);
  } else {
    rafId = null;
    lastTimestamp = null;
  }
}

export function subscribeFrameLoop(cb) {
  if (typeof window !== 'undefined' && !visibilityBound) {
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    visibilityBound = true;
  }

  subscribers.add(cb);
  if (rafId === null && typeof window !== 'undefined' && !document.hidden) {
    lastTimestamp = null;
    rafId = window.requestAnimationFrame(tick);
  }

  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
      lastTimestamp = null;
    }
  };
}
