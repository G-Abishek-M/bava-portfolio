import { ArrowUp } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export function Footer() {
  const scrollToTop = () => {
    window.dispatchEvent(
      new CustomEvent('rocket-ignite-burst', {
        detail: {
          x: window.innerWidth * 0.5,
          y: window.innerHeight - 60,
          count: 20,
        },
      })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-room-elevated)]/65 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="h-11 w-[92px] shrink-0 overflow-hidden rounded-lg border border-amber-300/30 bg-[#050817] shadow-sm">
            <img
              src={PORTFOLIO_DATA.profile.logoUrl}
              alt={`${PORTFOLIO_DATA.profile.name} portfolio logo`}
              className="h-full w-full scale-[1.45] object-cover object-center"
            />
          </div>
          <div>
            <p className="font-display text-lg font-semibold italic text-[var(--text-primary)]">
              {PORTFOLIO_DATA.footer.closingLine}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {PORTFOLIO_DATA.footer.subLine}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-room)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] shadow-sm transition-transform hover:-translate-y-0.5 hover:border-[var(--accent-amber)] whitespace-nowrap shrink-0"
        >
          <ArrowUp className="h-3.5 w-3.5 text-[var(--accent-amber)]" aria-hidden="true" />
          <span>Back to Top Rocket</span>
        </button>
      </div>
    </footer>
  );
}
