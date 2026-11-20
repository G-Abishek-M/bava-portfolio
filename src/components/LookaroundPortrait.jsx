import { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { subscribeFrameLoop } from '../utils/frameLoop';

const POSE_KEYS = ['center', 'up', 'upLeft', 'left', 'right', 'down', 'smile'];

// Torso alignment offsets (in 720x638 reference coords relative to center)
// Keeps shoulders and collar locked in place across every gaze frame.
const POSE_ALIGNMENT = {
  center: { dx: 0, dy: 0 },
  up: { dx: -6, dy: -4 },
  upLeft: { dx: -9, dy: -6 },
  left: { dx: 3, dy: -2 },
  right: { dx: -14, dy: 0 },
  down: { dx: -10, dy: 1 },
  smile: { dx: -13, dy: -2 },
};

// Video timestamps (seconds) in character_lookaround_6s_new_background_cf58a6b0.mp4
// Used only as an automatic fallback if a pre-extracted JPG fails to load.
const VIDEO_FALLBACK_TIMES = {
  center: 0.05,
  up: 1.0,
  upLeft: 1.6,
  left: 2.2,
  right: 3.05,
  down: 4.05,
  smile: 5.6,
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function pickDirectionalKey(x, y) {
  const dist = Math.hypot(x, y);
  if (dist < 0.16) return 'center';

  if (y < -0.24 && x < -0.22) return 'upLeft';
  if (y < -0.26 && Math.abs(x) <= 0.42) return 'up';
  if (y > 0.30 && Math.abs(x) <= 0.55) return 'down';

  return x < 0 ? 'left' : 'right';
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (img.naturalWidth > 0) {
        resolve(img);
      } else {
        reject(new Error(`Empty image: ${src}`));
      }
    };
    img.onerror = () => reject(new Error(`Failed image: ${src}`));
    img.src = src;
  });
}

async function extractVideoFallbackFrames(videoUrl, missingKeys) {
  const result = {};
  if (!videoUrl || missingKeys.length === 0) return result;

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = videoUrl;

  await new Promise((resolve, reject) => {
    const onLoaded = () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
      reject(new Error('Failed loading video fallback'));
    };
    video.addEventListener('loadeddata', onLoaded, { once: true });
    video.addEventListener('error', onError, { once: true });
  });

  const vw = video.videoWidth || 720;
  const vh = video.videoHeight || 638;

  for (const key of missingKeys) {
    await new Promise((resolve) => {
      const onSeeked = () => {
        const off = document.createElement('canvas');
        off.width = vw;
        off.height = vh;
        const offCtx = off.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(video, 0, 0, vw, vh);
          result[key] = off;
        }
        resolve();
      };
      video.addEventListener('seeked', onSeeked, { once: true });
      video.currentTime = VIDEO_FALLBACK_TIMES[key] ?? 0.05;
    });
  }

  video.removeAttribute('src');
  video.load();
  return result;
}

async function bakeSingleAlignedBitmap(source, key, targetW, targetH) {
  const sw = source.naturalWidth || source.width || 720;
  const sh = source.naturalHeight || source.height || 638;

  const targetAspect = targetW / targetH;
  const srcAspect = sw / sh;

  let cropW = sw;
  let cropH = sh;
  if (srcAspect > targetAspect) {
    cropW = Math.round(sh * targetAspect);
  } else {
    cropH = Math.round(sw / targetAspect);
  }

  // Anchor crop at bottom-center so torso stays fixed across frames
  const cropX = Math.round((sw - cropW) * 0.5);
  const cropY = Math.round(sh - cropH);

  const align = POSE_ALIGNMENT[key] || { dx: 0, dy: 0 };
  const shiftX = Math.round((align.dx / 720) * (targetW / (cropW / sw)));
  const shiftY = Math.round((align.dy / 638) * (targetH / (cropH / sh)));

  const composer = document.createElement('canvas');
  composer.width = targetW;
  composer.height = targetH;
  const cCtx = composer.getContext('2d', { alpha: false });
  if (!cCtx) return null;

  // Solid neutral studio backdrop so zero underlying pose can bleed through
  cCtx.fillStyle = '#d5d1ca';
  cCtx.fillRect(0, 0, targetW, targetH);

  // Draw the aligned frame strictly once at 100% opacity (zero overlay)
  cCtx.globalAlpha = 1;
  cCtx.drawImage(source, cropX, cropY, cropW, cropH, shiftX, shiftY, targetW, targetH);

  // Edge-clamp outer 1px strips if torso alignment shifted by a few pixels
  if (shiftX > 0) {
    cCtx.drawImage(source, cropX, cropY, 1, cropH, 0, shiftY, shiftX + 1, targetH);
  } else if (shiftX < 0) {
    cCtx.drawImage(
      source,
      cropX + cropW - 1,
      cropY,
      1,
      cropH,
      targetW + shiftX - 1,
      shiftY,
      -shiftX + 1,
      targetH
    );
  }

  if (shiftY > 0) {
    cCtx.drawImage(source, cropX, cropY, cropW, 1, shiftX, 0, targetW, shiftY + 1);
  } else if (shiftY < 0) {
    cCtx.drawImage(
      source,
      cropX,
      cropY + cropH - 1,
      cropW,
      1,
      shiftX,
      targetH + shiftY - 1,
      targetW,
      -shiftY + 1
    );
  }

  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(composer, {
        resizeWidth: targetW,
        resizeHeight: targetH,
        resizeQuality: 'high',
      });
    } catch {
      try {
        return await createImageBitmap(composer);
      } catch {
        return composer;
      }
    }
  }

  return composer;
}

export function LookaroundPortrait({ onFramesReady, isPaused = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const readyFiredRef = useRef(false);
  const isPausedRef = useRef(isPaused);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const notifyReady = () => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onFramesReady?.();
  };

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      notifyReady();
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) {
      setLoadFailed(true);
      notifyReady();
      return;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rawSources = {};
    const bakedBitmaps = {};
    let pixelW = 0;
    let pixelH = 0;
    let inView = true;
    let lastDrawnKey = null;

    const pointerState = {
      targetX: 0,
      targetY: 0,
      smoothX: 0,
      smoothY: 0,
      lastInputAt: performance.now(),
    };

    const layoutCache = {
      headX: window.innerWidth * 0.65,
      headY: window.innerHeight * 0.42,
      radiusX: 420,
      radiusY: 320,
    };

    const drawKeyImmediate = (key) => {
      const bmp = bakedBitmaps[key] || bakedBitmaps.center;
      if (!bmp) return;
      ctx.globalAlpha = 1;
      ctx.drawImage(bmp, 0, 0, pixelW, pixelH);
      lastDrawnKey = key;
    };

    const bakeAllFrames = async () => {
      const rect = container.getBoundingClientRect();
      const displayW = Math.max(240, Math.round(rect.width));
      const displayH = Math.max(216, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.round(displayW * dpr);
      const nextH = Math.round(displayH * dpr);

      if (nextW === pixelW && nextH === pixelH && bakedBitmaps.center) return;

      pixelW = nextW;
      pixelH = nextH;
      canvas.width = nextW;
      canvas.height = nextH;

      const entries = await Promise.all(
        POSE_KEYS.map(async (key) => {
          const src = rawSources[key] || rawSources.center;
          if (!src) return [key, null];
          const bmp = await bakeSingleAlignedBitmap(src, key, nextW, nextH);
          return [key, bmp];
        })
      );

      if (cancelled) {
        entries.forEach(([, bmp]) => {
          if (bmp && typeof bmp.close === 'function') bmp.close();
        });
        return;
      }

      entries.forEach(([key, bmp]) => {
        const prev = bakedBitmaps[key];
        if (prev && typeof prev.close === 'function') prev.close();
        if (bmp) bakedBitmaps[key] = bmp;
      });

      const activeKey = lastDrawnKey || 'center';
      drawKeyImmediate(activeKey);
    };

    const refreshLayout = () => {
      const rect = container.getBoundingClientRect();
      layoutCache.headX = rect.left + rect.width * 0.5;
      layoutCache.headY = rect.top + rect.height * 0.36;
      layoutCache.radiusX = Math.max(280, window.innerWidth * 0.36);
      layoutCache.radiusY = Math.max(240, window.innerHeight * 0.36);
    };

    const updateTargetFromClient = (clientX, clientY) => {
      const nx = clamp((clientX - layoutCache.headX) / layoutCache.radiusX, -1, 1);
      const ny = clamp((clientY - layoutCache.headY) / layoutCache.radiusY, -1, 1);
      pointerState.targetX = nx;
      pointerState.targetY = ny;
      pointerState.lastInputAt = performance.now();
    };

    const onPointerMove = (e) => {
      if (prefersReduced || isPausedRef.current) return;
      const coalesced = e.getCoalescedEvents?.();
      const latest =
        coalesced && coalesced.length > 0 ? coalesced[coalesced.length - 1] : e;
      updateTargetFromClient(latest.clientX, latest.clientY);
    };

    const onTouchMove = (e) => {
      if (prefersReduced || isPausedRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      updateTargetFromClient(touch.clientX, touch.clientY);
    };

    const onResize = () => {
      refreshLayout();
      void bakeAllFrames();
    };

    const onScroll = () => {
      refreshLayout();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView) {
          refreshLayout();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!prefersReduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    let unsubscribeLoop = null;

    const init = async () => {
      try {
        const frameMap = PORTFOLIO_DATA.profile.portraitFrames;
        const missingKeys = [];

        await Promise.all(
          POSE_KEYS.map(async (key) => {
            const url = frameMap[key];
            if (!url) {
              missingKeys.push(key);
              return;
            }
            try {
              rawSources[key] = await loadImageElement(url);
            } catch {
              missingKeys.push(key);
            }
          })
        );

        if (missingKeys.length > 0 && PORTFOLIO_DATA.profile.portraitVideoUrl) {
          try {
            const extracted = await extractVideoFallbackFrames(
              PORTFOLIO_DATA.profile.portraitVideoUrl,
              missingKeys
            );
            Object.assign(rawSources, extracted);
          } catch {
            // Fallback below handles completely missing frames
          }
        }

        if (!rawSources.center) {
          const fallbackImg = await loadImageElement(PORTFOLIO_DATA.profile.portraitImageUrl);
          rawSources.center = fallbackImg;
        }

        if (cancelled) return;

        refreshLayout();
        await bakeAllFrames();
        notifyReady();

        if (!prefersReduced) {
          unsubscribeLoop = subscribeFrameLoop((now, dt) => {
            if (!inView || isPausedRef.current || document.hidden) return;
            if (!bakedBitmaps.center) return;

            const idleMs = now - pointerState.lastInputAt;
            if (idleMs > 3000) {
              pointerState.targetX = 0;
              pointerState.targetY = 0;
              const alpha = 1 - Math.exp(-dt * 14);
              pointerState.smoothX += (0 - pointerState.smoothX) * alpha;
              pointerState.smoothY += (0 - pointerState.smoothY) * alpha;

              const idleKey = bakedBitmaps.smile ? 'smile' : 'center';
              if (lastDrawnKey !== idleKey) {
                drawKeyImmediate(idleKey);
              }
              return;
            }

            // Ultra-responsive directional smoothing (~18ms settle, deadzone filters micro-jitter)
            const dx = pointerState.targetX - pointerState.smoothX;
            const dy = pointerState.targetY - pointerState.smoothY;
            if (Math.abs(dx) > 0.004 || Math.abs(dy) > 0.004) {
              const alpha = 1 - Math.exp(-dt * 55);
              pointerState.smoothX += dx * alpha;
              pointerState.smoothY += dy * alpha;
            } else {
              pointerState.smoothX = pointerState.targetX;
              pointerState.smoothY = pointerState.targetY;
            }

            const nextKey = pickDirectionalKey(
              pointerState.smoothX,
              pointerState.smoothY
            );
            if (nextKey !== lastDrawnKey) {
              drawKeyImmediate(nextKey);
            }
          });
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
          notifyReady();
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      unsubscribeLoop?.();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      Object.values(bakedBitmaps).forEach((bmp) => {
        if (bmp && typeof bmp.close === 'function') bmp.close();
      });
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[460px] select-none">
      <div className="relative overflow-hidden rounded-2xl border border-amber-900/25 bg-[#241721] p-4 shadow-2xl dark:border-amber-200/15">
        {/* Separate blurred bookshelf backdrop layer behind the portrait */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-75 blur-[2px]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#251829] via-[#1c121e] to-[#2e1b10]" />
          <div className="absolute inset-x-0 top-6 flex h-24 items-end gap-1.5 px-4 opacity-50">
            {[48, 62, 54, 70, 52, 66, 58, 72, 46, 60, 64, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-xs"
                style={{
                  height: `${h}%`,
                  backgroundColor: ['#245854', '#583353', '#b58020', '#45634d', '#7c3a29'][
                    i % 5
                  ],
                }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-[118px] h-2 bg-[#3b2416]" />
        </div>

        {/* Separate warm brass reading lamp glow layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-60 w-60 rounded-full bg-amber-400/25 blur-3xl"
        />

        {/* Illustrated Reading Desk Lamp SVG */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-3 z-20 hidden sm:block"
        >
          <svg width="72" height="84" viewBox="0 0 72 84" fill="none">
            <path d="M52 12L58 62H46" stroke="#b98636" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="52" cy="64" rx="14" ry="4" fill="#8b6220" />
            <path
              d="M20 22C24 10 46 8 54 18L44 28L18 26Z"
              fill="#d59a3a"
              stroke="#5b3b12"
              strokeWidth="1.5"
            />
            <ellipse cx="32" cy="26" rx="10" ry="3.5" fill="#ffe194" />
            <path d="M21 26L4 68H50L43 27Z" fill="url(#heroLampCone)" opacity="0.32" />
            <defs>
              <linearGradient
                id="heroLampCone"
                x1="32"
                y1="26"
                x2="28"
                y2="68"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ffd166" />
                <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Interactive Cursor-Tracking Portrait Canvas */}
        <div
          ref={containerRef}
          className="relative z-10 overflow-hidden rounded-xl border border-amber-300/25 bg-[#1e1518] aspect-[4/3.6]"
        >
          {!loadFailed ? (
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={PORTFOLIO_DATA.profile.portraitAlt}
              className="block h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#281b22] p-6 text-center text-[#f3e6c8]">
              <span className="font-display text-2xl font-bold">
                {PORTFOLIO_DATA.profile.name}
              </span>
              <span className="mt-1 text-base text-amber-200/80">
                {PORTFOLIO_DATA.profile.headline}
              </span>
            </div>
          )}

          {/* Separate bottom desk shadow overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#190e09]/70 via-[#190e09]/20 to-transparent"
          />
        </div>

        {/* Wooden Reading Desk foreground edge */}
        <div className="wood-grain relative z-20 -mx-4 -mb-4 mt-3 flex items-center justify-between border-t border-amber-200/20 px-5 py-3 text-amber-100/85">
          <span className="font-hand text-xl text-amber-200">At her reading desk</span>
          <span className="text-xs tracking-wide text-amber-100/70">
            {PORTFOLIO_DATA.profile.degreeStatus} B.Tech AI &amp; DS
          </span>
        </div>
      </div>
    </div>
  );
}
