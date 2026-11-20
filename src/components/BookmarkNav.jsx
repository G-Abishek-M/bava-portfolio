import { Sun, Moon } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', accent: '#c97316' },
  { id: 'about', label: 'About', accent: '#245854' },
  { id: 'skills', label: 'Skills', accent: '#583353' },
  { id: 'work', label: 'Work', accent: '#b58020' },
  { id: 'conclusion', label: 'Conclusion', accent: '#45634d' },
  { id: 'contact', label: 'Contact', accent: '#8c3f2b' },
];

export function BookmarkNav({
  activeSection,
  isNightMode,
  onToggleTheme,
  onNavigate,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-room)]/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:gap-8">
        {/* Zone 1: Portfolio brand logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          aria-label={`${PORTFOLIO_DATA.profile.name} — Back to top`}
          className="group relative flex h-10 w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-amber-300/35 bg-[#050817] shadow-sm transition-transform duration-150 hover:scale-[1.03] sm:h-11 sm:w-[96px]"
        >
          <img
            src={PORTFOLIO_DATA.profile.logoUrl}
            alt={`${PORTFOLIO_DATA.profile.name} portfolio logo`}
            className="h-full w-full scale-[1.45] object-cover object-center"
          />
        </a>

        {/* Zone 2: Bookmark-shaped navigation links */}
        <nav
          aria-label="Library sections"
          className="hidden items-center gap-1.5 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`group relative flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {/* Bookmark ribbon notch under active tab */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-1.5 bottom-0 h-[2.5px] rounded-full transition-transform duration-200 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75'
                  }`}
                  style={{ backgroundColor: item.accent }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action — Day / Night reading lamp toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isNightMode ? 'Switch to sunlit day reading mode' : 'Switch to night library mode'}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-room-elevated)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-amber)] whitespace-nowrap shrink-0"
          >
            {isNightMode ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>Day Lamp</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                <span>Night Lamp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Compact mobile bookmark scroll strip */}
      <nav
        aria-label="Mobile library sections"
        className="flex items-center gap-1 overflow-x-auto border-t border-[var(--border-subtle)] px-3 py-1.5 md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'text-[var(--accent-amber)] underline decoration-2 underline-offset-4'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
