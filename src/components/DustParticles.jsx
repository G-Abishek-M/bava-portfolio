import { useEffect, useRef } from 'react';
import { subscribeFrameLoop } from '../utils/frameLoop';

const MOTES = Array.from({ length: 12 }, (_, idx) => ({
  xFrac: ((idx * 37 + 11) % 94) / 100,
  yFrac: ((idx * 53 + 7) % 90) / 100,
  size: 1.4 + (idx % 3) * 0.7,
  speedY: 0.006 + (idx % 4) * 0.003,
  phase: idx * 1.15,
  baseAlpha: 0.16 + (idx % 4) * 0.08,
}));

export function DustParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();

    const drawMotes = (tSec) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < MOTES.length; i += 1) {
        const m = MOTES[i];
        const y = ((m.yFrac - tSec * m.speedY) % 1 + 1) % 1;
        const x = m.xFrac + Math.sin(tSec * 0.45 + m.phase) * 0.012;
        const alpha = m.baseAlpha * (0.65 + 0.35 * Math.sin(tSec * 0.9 + m.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 222, 158, ${alpha.toFixed(3)})`;
        ctx.arc(x * width, y * height, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (prefersReduced) {
      drawMotes(0);
      window.addEventListener('resize', syncSize, { passive: true });
      return () => window.removeEventListener('resize', syncSize);
    }

    window.addEventListener('resize', syncSize, { passive: true });

    let elapsed = 0;
    const unsubscribe = subscribeFrameLoop((_now, dt) => {
      if (document.hidden) return;
      elapsed += dt;
      drawMotes(elapsed);
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10"
    />
  );
}
