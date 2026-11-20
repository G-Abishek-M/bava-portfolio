import { useEffect, useRef, useState } from 'react';
import { subscribeFrameLoop } from '../utils/frameLoop';

export function PaperRocketCursor() {
  const canvasRef = useRef(null);
  const rocketRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [isTouchMode, setIsTouchMode] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isCirclingBook, setIsCirclingBook] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setEnabled(false);
      return;
    }

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchMode(coarsePointer);
    setEnabled(true);

    if (!coarsePointer) {
      document.documentElement.classList.add('paper-rocket-cursor-active');
    }

    return () => {
      document.documentElement.classList.remove('paper-rocket-cursor-active');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const rocketEl = rocketRef.current;
    if (!canvas || !rocketEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const state = {
      targetX: vw * 0.65,
      targetY: vh * 0.35,
      x: vw * 0.65,
      y: vh * 0.35,
      angle: -0.5,
      hoverInteractive: false,
      hoverBook: false,
      orbitPhase: 0,
      lastInputAt: performance.now(),
    };

    const particles = [];

    const spawnBurst = (bx, by, count = 16) => {
      for (let i = 0; i < count; i += 1) {
        const theta = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 1.6 + Math.random() * 3.8;
        particles.push({
          x: bx,
          y: by,
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed,
          life: 0,
          maxLife: 22 + Math.random() * 16,
          size: 2.2 + Math.random() * 3,
          kind: i % 3 === 0 ? 'flame' : 'ember',
        });
      }
    };

    const onPointerMove = (e) => {
      const coalesced = e.getCoalescedEvents?.();
      const latest = coalesced && coalesced.length > 0 ? coalesced[coalesced.length - 1] : e;
      state.targetX = latest.clientX;
      state.targetY = latest.clientY;
      state.lastInputAt = performance.now();

      if (!isTouchMode && e.target instanceof Element) {
        const bookEl = e.target.closest('[data-book-spine="true"]');
        const interactiveEl = e.target.closest(
          'a, button, input, textarea, [role="button"], [data-rocket-target="true"]'
        );

        const nextBook = Boolean(bookEl);
        const nextInteractive = Boolean(interactiveEl || bookEl);

        if (nextBook !== state.hoverBook) {
          state.hoverBook = nextBook;
          setIsCirclingBook(nextBook);
        }
        if (nextInteractive !== state.hoverInteractive) {
          state.hoverInteractive = nextInteractive;
          setIsHoveringInteractive(nextInteractive);
        }
      }
    };

    const onPointerDown = (e) => {
      state.targetX = e.clientX;
      state.targetY = e.clientY;
      state.lastInputAt = performance.now();
      spawnBurst(state.x, state.y, 18);
    };

    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      state.targetX = t.clientX;
      state.targetY = t.clientY;
      state.lastInputAt = performance.now();
    };

    const onCustomBurst = (e) => {
      const bx = e.detail?.x ?? state.x;
      const by = e.detail?.y ?? state.y;
      spawnBurst(bx, by, e.detail?.count ?? 26);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('rocket-ignite-burst', onCustomBurst);

    const unsubscribe = subscribeFrameLoop((now, dt) => {
      if (isTouchMode && now - state.lastInputAt > 3500) {
        const t = now * 0.0008;
        state.targetX = vw * 0.72 + Math.cos(t) * 65;
        state.targetY = vh * 0.34 + Math.sin(t * 1.4) * 42;
      }

      let destX = state.targetX;
      let destY = state.targetY;

      if (state.hoverBook && !isTouchMode) {
        state.orbitPhase += dt * 5.2;
        destX += Math.cos(state.orbitPhase) * 20;
        destY += Math.sin(state.orbitPhase) * 14;
      }

      const prevX = state.x;
      const prevY = state.y;
      const followRate = isTouchMode ? 8 : 16;
      const lerpAlpha = 1 - Math.exp(-dt * followRate);
      state.x += (destX - state.x) * lerpAlpha;
      state.y += (destY - state.y) * lerpAlpha;

      const dx = state.x - prevX;
      const dy = state.y - prevY;
      const speed = Math.hypot(dx, dy);

      let targetAngle = state.angle;
      if (speed > 0.45) {
        targetAngle = Math.atan2(dy, dx);
      } else if (state.hoverInteractive) {
        targetAngle = -0.65;
      }

      let deltaAngle = targetAngle - state.angle;
      while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
      state.angle += deltaAngle * (1 - Math.exp(-dt * 14));

      const tailX = state.x - Math.cos(state.angle) * 14;
      const tailY = state.y - Math.sin(state.angle) * 14;

      const flameIntensity = state.hoverInteractive
        ? Math.max(speed * 0.32, 1.5)
        : speed * 0.28;

      if (flameIntensity > 0.25 || state.hoverInteractive) {
        const count = state.hoverInteractive ? 2 : Math.min(3, Math.ceil(flameIntensity));
        for (let i = 0; i < count; i += 1) {
          const spread = (Math.random() - 0.5) * 0.65;
          const backAngle = state.angle + Math.PI + spread;
          const ejectSpeed = 0.8 + Math.min(speed * 0.14, 2.8) + Math.random() * 0.9;
          particles.push({
            x: tailX + (Math.random() - 0.5) * 3,
            y: tailY + (Math.random() - 0.5) * 3,
            vx: Math.cos(backAngle) * ejectSpeed,
            vy: Math.sin(backAngle) * ejectSpeed,
            life: 0,
            maxLife: 12 + Math.random() * 11,
            size: Math.min(6.5, 2.2 + flameIntensity * 0.85),
            kind: 'flame',
          });
        }
      }

      if (speed > 1.2 && Math.random() < 0.65) {
        particles.push({
          x: tailX,
          y: tailY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.2,
          life: 0,
          maxLife: 24 + Math.random() * 14,
          size: 1.5 + Math.random() * 1.4,
          kind: Math.random() < 0.45 ? 'ember' : 'dust',
        });
      }

      ctx.clearRect(0, 0, vw, vh);

      const stepScale = dt * 60;
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += stepScale;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * stepScale;
        p.y += p.vy * stepScale;
        p.vx *= 0.95;
        p.vy *= 0.95;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        if (p.kind === 'flame') {
          let color = `rgba(255, 115, 36, ${alpha * 0.88})`;
          if (progress < 0.24) {
            color = `rgba(255, 250, 224, ${alpha})`;
          } else if (progress < 0.55) {
            color = `rgba(255, 204, 77, ${alpha * 0.95})`;
          }
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * (1 - progress * 0.7)), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 'ember') {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 179, 71, ${alpha * 0.9})`;
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.fillStyle = `rgba(243, 230, 200, ${alpha * 0.42})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const deg = (state.angle * 180) / Math.PI;
      const scale = state.hoverInteractive ? 1.12 : 1;
      rocketEl.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%) rotate(${deg}deg) scale(${scale})`;
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('rocket-ignite-burst', onCustomBurst);
    };
  }, [enabled, isTouchMode]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9998]"
      />
      <div
        ref={rocketRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <svg
          width="36"
          height="28"
          viewBox="0 0 36 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_3px_8px_rgba(255,179,71,0.45)]"
        >
          <path
            d={
              isHoveringInteractive || isCirclingBook
                ? 'M0 14C3 10 8 10 11 14C8 18 3 18 0 14Z'
                : 'M4 14C6 11.5 9 11.5 11 14C9 16.5 6 16.5 4 14Z'
            }
            fill="#ffb347"
            opacity="0.9"
          />
          <circle cx="9.5" cy="14" r="2.2" fill="#fff7dc" />
          <path
            d="M34 14L10 4L14.5 14L10 24L34 14Z"
            fill="#f7ebd2"
            stroke="#3b2416"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M34 14L14.5 14L10 24L34 14Z"
            fill="#dfcaa0"
            stroke="#3b2416"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M14.5 14L33 14" stroke="#9e6d3b" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}
