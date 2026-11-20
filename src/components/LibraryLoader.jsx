import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LibraryLoader({ isReady, onComplete }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const minTimer = window.setTimeout(
      () => setMinElapsed(true),
      prefersReduced ? 80 : 1450
    );

    const fallbackTimer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onComplete, 250);
    }, 6500);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (!isReady || !minElapsed || !visible) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setVisible(false);
    const doneTimer = window.setTimeout(onComplete, prefersReduced ? 50 : 420);
    return () => window.clearTimeout(doneTimer);
  }, [isReady, minElapsed, visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#140e1a] px-4 text-[#f3e6c8]"
          role="status"
          aria-live="polite"
        >
          {/* Ambient warm reading lamp glow behind the book */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-80 w-80 rounded-full bg-amber-400/15 blur-3xl"
          />

          {/* 3D Opening Hardcover Book */}
          <motion.div
            initial={{ x: 0, scale: 0.96 }}
            animate={{ x: 56, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 h-56 w-44 sm:h-64 sm:w-52 [perspective:1400px]"
          >
            {/* Crimson silk bookmark ribbon peeking from bottom edge */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 right-8 h-9 w-3.5 bg-[#8c2f27] shadow-md"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)' }}
            />

            {/* Back Hardcover Board */}
            <div className="spine-lighting absolute inset-0 rounded-r-xl rounded-l-sm border border-amber-300/40 bg-[#1a433f] shadow-[0_24px_55px_rgba(0,0,0,0.75)]" />

            {/* Stacked Paper Page Block (Right Side Revealed Inside Book) */}
            <div className="parchment-surface absolute inset-y-2 left-1.5 right-2 flex flex-col justify-between overflow-hidden rounded-r-lg border-r-4 border-[#d6c297] p-4 shadow-inner">
              <div className="border-b border-[#1c1a2e]/15 pb-2">
                <p className="font-hand text-sm text-[#7a4b21]">
                  Ex Libris
                </p>
                <p className="font-display mt-0.5 text-lg font-bold leading-tight text-[#1c1a2e] sm:text-xl">
                  BavaDharani BS
                </p>
              </div>

              {/* Subtle decorative ink lines simulating a title page */}
              <div className="space-y-2 py-2 opacity-60" aria-hidden="true">
                <div className="h-1.5 w-4/5 rounded-full bg-[#4a3520]/30" />
                <div className="h-1.5 w-full rounded-full bg-[#4a3520]/25" />
                <div className="h-1.5 w-3/4 rounded-full bg-[#4a3520]/25" />
                <div className="h-1.5 w-5/6 rounded-full bg-[#4a3520]/20" />
              </div>

              <p className="font-hand text-right text-xs text-[#6e4626]">
                Portfolio Collection
              </p>
            </div>

            {/* Inner Turning Parchment Leaf */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -150 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="parchment-surface pointer-events-none absolute inset-y-2 left-1.5 right-2.5 rounded-r-lg border border-[#1c1a2e]/15 shadow-md"
            />

            {/* Spine Edge Shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 rounded-l-sm bg-gradient-to-r from-[#0e2926] via-[#2b635e] to-transparent"
            />

            {/* Hinged 3D Front Cover with "BavaDharani BS" Gold Foil Title */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -162 }}
              transition={{ duration: 1.05, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="absolute inset-0 z-30"
            >
              {/* Front Cover Outer Face (Gold-Embossed Title) */}
              <div
                className="spine-lighting absolute inset-0 flex flex-col items-center justify-between rounded-r-xl rounded-l-sm border border-amber-300/55 bg-[#245854] p-3.5 shadow-2xl"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                {/* Gold Foil Double Frame */}
                <div className="flex h-full w-full flex-col items-center justify-between rounded-r-lg rounded-l-xs border border-amber-300/60 p-3 text-center">
                  <div className="flex w-full items-center justify-between text-amber-300/70" aria-hidden="true">
                    <span className="h-2 w-2 border-l border-t border-amber-300/75" />
                    <span className="font-foil text-[9px] tracking-[0.22em] text-amber-200/80">
                      VOL. I
                    </span>
                    <span className="h-2 w-2 border-r border-t border-amber-300/75" />
                  </div>

                  {/* Embossed Book Title: BavaDharani BS */}
                  <div className="my-auto px-1">
                    <div className="mx-auto mb-2.5 h-[1px] w-10 bg-amber-300/65" />
                    <span className="font-foil block text-base leading-snug text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] sm:text-lg">
                      BavaDharani BS
                    </span>
                    <div className="mx-auto mt-2.5 h-[1px] w-10 bg-amber-300/65" />
                    <span className="font-hand mt-2 block text-sm text-amber-100/80">
                      The Reading Room
                    </span>
                  </div>

                  <div className="flex w-full items-center justify-between text-amber-300/70" aria-hidden="true">
                    <span className="h-2 w-2 border-b border-l border-amber-300/75" />
                    <span className="h-2 w-2 rotate-45 border border-amber-300/75" />
                    <span className="h-2 w-2 border-b border-r border-amber-300/75" />
                  </div>
                </div>
              </div>

              {/* Inner Marbled Endpaper Face (visible after cover opens past 90deg) */}
              <div
                className="parchment-surface absolute inset-0 rounded-l-xl rounded-r-sm border border-[#bfa47a] p-4 shadow-inner"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded border border-[#1c1a2e]/15 p-3 text-center">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-[#5c3e21]/75">
                    Reading Room
                  </span>
                  <span className="font-hand mt-1 text-base text-[#5c3e21]">
                    Welcome inside
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <p className="font-display text-xl font-bold tracking-wide text-amber-200/95">
            Opening the library of BavaDharani BS...
          </p>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onComplete();
            }}
            className="mt-4 text-sm tracking-wider text-amber-200/65 underline underline-offset-4 transition-colors hover:text-amber-200"
          >
            Enter now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
