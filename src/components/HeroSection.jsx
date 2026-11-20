import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowDown } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { LookaroundPortrait } from './LookaroundPortrait';

export function HeroSection({
  isBookOpen = false,
  onExploreBookshelf,
  onPortraitReady,
}) {
  const fullHeadline = `${PORTFOLIO_DATA.hero.greetingPrefix}${PORTFOLIO_DATA.hero.greetingName}`;
  const [typedCount, setTypedCount] = useState(fullHeadline.length);
  const [typingStarted, setTypingStarted] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTypedCount(fullHeadline.length);
      return;
    }

    setTypedCount(0);
    setTypingStarted(true);
    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setTypedCount(current);
      if (current >= fullHeadline.length) {
        window.clearInterval(interval);
      }
    }, 68);

    return () => window.clearInterval(interval);
  }, [fullHeadline]);

  const displayedHeadline = typingStarted ? fullHeadline.slice(0, typedCount) : fullHeadline;

  return (
    <section
      id="home"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-16"
    >
      {/* Subtle warm radial lamplight behind hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-10 h-96 w-96 rounded-full bg-[var(--lamp-glow)] blur-[90px]"
      />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Editorial Typographic Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <p className="text-sm font-medium tracking-[0.14em] uppercase text-[var(--accent-amber)]">
            {PORTFOLIO_DATA.hero.kicker}
          </p>

          <h1
            aria-label={fullHeadline}
            className="mt-3 font-display text-4xl font-bold leading-[1.1] text-[var(--text-primary)] sm:text-5xl lg:text-[3.65rem]"
          >
            <span>{displayedHeadline}</span>
            {typedCount < fullHeadline.length && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] bg-[var(--accent-amber)]"
              />
            )}
          </h1>

          <p className="mt-4 font-display text-xl font-medium text-[var(--text-secondary)] sm:text-2xl">
            {PORTFOLIO_DATA.hero.subtitle}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-base text-[var(--text-muted)]">
            <span>{PORTFOLIO_DATA.profile.degree}</span>
            <span aria-hidden="true">·</span>
            <span>{PORTFOLIO_DATA.profile.degreeStatus}</span>
          </div>

          <p className="mt-5 max-w-xl text-[1.15rem] leading-[1.7] text-[var(--text-secondary)]">
            {PORTFOLIO_DATA.hero.tagline}
          </p>

          <p className="font-hand mt-5 text-2xl sm:text-[1.75rem] text-[var(--accent-amber)]">
            {PORTFOLIO_DATA.hero.handwrittenNote}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onExploreBookshelf}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg bg-[var(--accent-amber)] px-6 py-3 text-base font-medium text-[#1c1a2e] shadow-md transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>{PORTFOLIO_DATA.hero.ctaLabel}</span>
            </button>

            <a
              href="#contact"
              className="inline-flex min-h-[44px] items-center px-3 py-2 text-base font-medium text-[var(--text-primary)] underline decoration-[var(--accent-amber)]/60 decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent-amber)] whitespace-nowrap shrink-0"
            >
              Write a Letter
            </a>
          </div>
        </motion.div>

        {/* Right Column: Interactive Reading Desk Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <LookaroundPortrait isPaused={isBookOpen} onFramesReady={onPortraitReady} />
        </motion.div>
      </div>

      {/* Bobbing Bookmark-Ribbon Scroll Hint */}
      <div className="mt-12 flex justify-center lg:mt-16">
        <button
          type="button"
          onClick={onExploreBookshelf}
          aria-label="Scroll down to the interactive bookshelf"
          className="animate-bookmark-bob group flex flex-col items-center focus-visible:rounded-md"
        >
          <span className="relative flex h-12 w-8 flex-col items-center justify-center rounded-t-sm bg-[#8c3f2b] text-[#f7ead0] shadow-md transition-colors group-hover:bg-[#a34a33]">
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -bottom-2.5 left-0 right-0 h-3 bg-[#8c3f2b] transition-colors group-hover:bg-[#a34a33]"
              style={{ clipPath: 'polygon(0 0, 50% 65%, 100% 0)' }}
            />
          </span>
          <span className="mt-4 text-xs tracking-widest uppercase text-[var(--text-muted)]">
            Browse Shelf
          </span>
        </button>
      </div>
    </section>
  );
}
