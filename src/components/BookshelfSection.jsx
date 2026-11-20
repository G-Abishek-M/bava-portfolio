import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const LEFT_FILLERS = [
  { height: 158, width: 28, color: '#6b3b2e', band: true },
  { height: 142, width: 24, color: '#394856' },
  { height: 166, width: 32, color: '#785a3a', tilt: -3, band: true },
];

const MID_FILLER_A = [
  { height: 146, width: 26, color: '#5b4b3e' },
  { height: 158, width: 22, color: '#7c3a2d', band: true },
];

const MID_FILLER_B = [
  { height: 150, width: 26, color: '#35544d', band: true },
  { height: 138, width: 24, color: '#634154' },
];

const RIGHT_FILLERS = [
  { height: 154, width: 26, color: '#465466', band: true },
  { height: 144, width: 28, color: '#784830', tilt: 3 },
];

export function BookshelfSection({ activeBookId, onOpenBook }) {
  const shelfRef = useRef(null);
  const [lampPos, setLampPos] = useState({ x: 50, y: 24 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [hoveredBook, setHoveredBook] = useState(null);

  const handleMouseMove = (e) => {
    const el = shelfRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setLampPos({
      x: Math.max(12, Math.min(88, px)),
      y: Math.max(10, Math.min(72, py)),
    });
    setParallax({
      x: ((px - 50) / 50) * 6,
      y: ((py - 50) / 50) * 4,
    });
  };

  const renderFiller = (book, idx) => (
    <div
      key={idx}
      aria-hidden="true"
      className="spine-lighting relative hidden shrink-0 rounded-t-xs border-t border-white/10 shadow-md sm:block"
      style={{
        height: `${book.height}px`,
        width: `${book.width}px`,
        backgroundColor: book.color,
        transform: book.tilt ? `rotate(${book.tilt}deg)` : undefined,
      }}
    >
      {book.band && (
        <>
          <div className="absolute inset-x-0 top-4 h-[2px] bg-amber-200/40" />
          <div className="absolute inset-x-0 bottom-5 h-[2px] bg-amber-200/40" />
        </>
      )}
    </div>
  );

  const renderHeroBook = (book, idx) => {
    const isHovered = hoveredBook === book.id;
    const isOpen = activeBookId === book.id;

    return (
      <motion.button
        key={book.id}
        type="button"
        data-book-spine="true"
        data-rocket-target="true"
        onClick={() => onOpenBook(book.id)}
        onMouseEnter={() => setHoveredBook(book.id)}
        onMouseLeave={() => setHoveredBook(null)}
        onFocus={() => setHoveredBook(book.id)}
        onBlur={() => setHoveredBook(null)}
        whileHover={{ y: -18, scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`Open ${book.spineTitle} book: ${book.subtitle}`}
        className="spine-lighting group relative flex h-[232px] w-[62px] shrink-0 flex-col items-center justify-between rounded-t-sm border-x border-t border-amber-200/40 px-1.5 py-4 text-center shadow-[0_12px_24px_rgba(0,0,0,0.55)] transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-amber-300 sm:h-[256px] sm:w-[76px]"
        style={{
          backgroundColor: book.spineColor,
          boxShadow: isHovered || isOpen
            ? '0 18px 34px rgba(0,0,0,0.65), 0 0 22px rgba(255,179,71,0.45)'
            : undefined,
        }}
      >
        {/* Top gold foil rules & volume numeral */}
        <div className="w-full space-y-1">
          <div className="h-[2px] w-full opacity-85" style={{ backgroundColor: book.spineAccent }} />
          <span
            className="font-foil block text-[10px] uppercase"
            style={{ color: book.spineAccent }}
          >
            {book.volumeRoman}
          </span>
        </div>

        {/* Vertical Gold-Foil Spine Title */}
        <span
          className="font-foil text-xs leading-none uppercase sm:text-[13px]"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: book.coverTextColor,
            textShadow:
              book.id === 'work'
                ? '0 1px 0 rgba(255,240,199,0.45)'
                : '0 1px 2px rgba(0,0,0,0.65)',
          }}
        >
          {book.spineTitle}
        </span>

        {/* Bottom gold ornament */}
        <div className="w-full space-y-1">
          <span
            className="mx-auto block h-2.5 w-2.5 rotate-45 border opacity-90"
            style={{ borderColor: book.spineAccent }}
          />
          <div className="h-[2px] w-full opacity-85" style={{ backgroundColor: book.spineAccent }} />
          <span className="sr-only">Book {idx + 1}</span>
        </div>

        {/* Floating warm hover prompt above spine */}
        <span
          aria-hidden="true"
          className={`font-display pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded bg-[#1c131d] px-2.5 py-0.5 text-xs font-bold text-amber-200 shadow-lg transition-opacity duration-150 whitespace-nowrap ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Open {book.spineTitle}
        </span>
      </motion.button>
    );
  };

  const books = PORTFOLIO_DATA.bookshelfMeta;

  return (
    <section
      id="library-shelf"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 lg:py-20"
    >
      {/* Section Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium tracking-[0.14em] uppercase text-[var(--accent-amber)]">
          The Reading Room Collection
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)] sm:text-4xl lg:text-[2.65rem]">
          Choose a Volume from the Shelf
        </h2>
        <p className="mt-3 text-[1.15rem] leading-[1.7] text-[var(--text-secondary)]">
          Each spine opens into an illustrated two-page spread. Hover to pull a book forward, then click to read.
        </p>
      </div>

      {/* 3D Wooden Bookshelf Cabinet */}
      <div
        ref={shelfRef}
        onMouseMove={handleMouseMove}
        className="wood-grain relative mt-10 overflow-hidden rounded-2xl border-4 border-[#27160c] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.55)] sm:p-8"
      >
        {/* Dynamic Warm Brass Lamp Glow following pointer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(460px circle at ${lampPos.x}% ${lampPos.y}%, rgba(255, 196, 98, 0.34), rgba(255, 165, 65, 0.1) 42%, transparent 72%)`,
          }}
        />

        {/* Top Shelf Header & Hanging Brass Library Lamp */}
        <div
          className="relative z-10 flex items-start justify-between pb-3"
          style={{
            transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`,
          }}
        >
          {/* Decorative Upper Mini Props */}
          <div className="flex items-end gap-4 pl-2" aria-hidden="true">
            <svg width="28" height="44" viewBox="0 0 28 44" fill="none">
              <rect x="4" y="2" width="20" height="3" rx="1" fill="#b98636" />
              <rect x="4" y="39" width="20" height="3" rx="1" fill="#b98636" />
              <path d="M7 5H21L15 21H13L7 5Z" fill="#d9e7ec" fillOpacity="0.28" stroke="#c89d54" strokeWidth="1.2" />
              <path d="M13 23H15L21 39H7L13 23Z" fill="#d9e7ec" fillOpacity="0.28" stroke="#c89d54" strokeWidth="1.2" />
              <path d="M10 38H18L14 31L10 38Z" fill="#e6be7a" />
            </svg>

            <svg width="46" height="54" viewBox="0 0 46 54" fill="none">
              <circle cx="23" cy="22" r="15" fill="#2c5956" stroke="#c99a49" strokeWidth="1.5" />
              <path d="M14 17C18 14 23 19 28 15C31 19 28 28 22 29C17 29 12 22 14 17Z" fill="#5e8767" opacity="0.85" />
              <path d="M23 5A17 17 0 0 1 23 39" stroke="#d5a34a" strokeWidth="2" />
              <path d="M23 39V48M15 49H31" stroke="#b98636" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Brass Library Lamp */}
          <div className="flex flex-col items-center pr-4" aria-hidden="true">
            <div className="h-3 w-1 bg-amber-700" />
            <svg width="86" height="42" viewBox="0 0 86 42" fill="none">
              <path
                d="M16 28C22 10 64 10 70 28H16Z"
                fill="#c78d2e"
                stroke="#5d3b10"
                strokeWidth="1.6"
              />
              <ellipse cx="43" cy="29" rx="22" ry="4" fill="#ffe5a3" />
            </svg>
          </div>

          {/* Flickering Candle + Potted Plant */}
          <div className="flex items-end gap-4 pr-2" aria-hidden="true">
            <svg width="26" height="48" viewBox="0 0 26 48" fill="none">
              <ellipse cx="13" cy="10" rx="4" ry="7" fill="#ffb347" className="animate-candle" />
              <ellipse cx="13" cy="11.5" rx="2" ry="3.8" fill="#fff5d6" className="animate-candle" />
              <rect x="7" y="18" width="12" height="24" rx="2" fill="#efe0c2" />
              <rect x="4" y="42" width="18" height="4" rx="1.5" fill="#9a6e2d" />
            </svg>

            <svg width="48" height="52" viewBox="0 0 48 52" fill="none" className="hidden sm:block">
              <path d="M24 31C18 22 12 21 9 26C14 27 19 30 24 31Z" fill="#4f7c58" />
              <path d="M24 31C23 19 20 12 24 8C28 13 27 22 24 31Z" fill="#5e9168" />
              <path d="M24 31C31 21 37 21 40 26C35 28 29 30 24 31Z" fill="#46704e" />
              <path d="M13 31H35L32 49H16L13 31Z" fill="#8f4a32" stroke="#5a2c1b" strokeWidth="1.4" />
              <rect x="11" y="29" width="26" height="4" rx="1" fill="#a2573c" />
            </svg>
          </div>
        </div>

        {/* Main Bookcase Recessed Interior */}
        <div
          className="relative rounded-lg border border-black/40 bg-[#1c100a]/85 px-3 pt-8 shadow-[inset_0_16px_32px_rgba(0,0,0,0.75)] sm:px-6"
          style={{
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          }}
        >
          <div className="flex flex-wrap items-end justify-center gap-2 sm:flex-nowrap sm:gap-2.5">
            {LEFT_FILLERS.map((b, i) => renderFiller(b, i))}

            {renderHeroBook(books[0], 0)}

            {MID_FILLER_A.map((b, i) => renderFiller(b, i + 10))}

            {renderHeroBook(books[1], 1)}

            {MID_FILLER_B.map((b, i) => renderFiller(b, i + 20))}

            {renderHeroBook(books[2], 2)}

            {renderHeroBook(books[3], 3)}

            {RIGHT_FILLERS.map((b, i) => renderFiller(b, i + 30))}
          </div>

          {/* Thick Walnut Shelf Ledge */}
          <div className="wood-grain relative z-20 -mx-3 mt-0 h-6 border-t-2 border-amber-200/20 shadow-[0_12px_24px_rgba(0,0,0,0.65)] sm:-mx-6" />
        </div>

        {/* Accessible Quick-Select Volume Index beneath the ledge */}
        <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => onOpenBook(book.id)}
              className="group flex flex-col items-start rounded-lg border border-amber-200/15 bg-black/30 px-3.5 py-2.5 text-left transition-colors hover:border-amber-300/55 hover:bg-black/45"
            >
              <span className="text-[11px] font-medium tracking-wider uppercase text-amber-300/85">
                {book.volumeRoman}
              </span>
              <span className="font-foil mt-0.5 text-xs text-[#f7ead0] group-hover:text-amber-200 sm:text-[13px]">
                {book.spineTitle}
              </span>
              <span className="mt-0.5 text-sm text-amber-100/75">{book.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
