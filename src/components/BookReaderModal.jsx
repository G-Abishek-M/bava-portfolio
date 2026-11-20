import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { playPageRustle } from '../utils/pageSound';

const SKILL_BAR_COLORS = ['#583353', '#7a5230', '#245854', '#45634d'];

export function BookReaderModal({ bookId, onClose, onGoToContact }) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [flipDir, setFlipDir] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [portraitError, setPortraitError] = useState(false);
  const touchStartX = useRef(null);
  const closeBtnRef = useRef(null);
  const flipTimerRef = useRef(null);

  const bookMeta = PORTFOLIO_DATA.bookshelfMeta.find((b) => b.id === bookId) ?? null;

  useEffect(() => {
    if (flipTimerRef.current) {
      window.clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
    setSpreadIndex(0);
    setFlipDir(null);
    setPortraitError(false);
    if (bookId) {
      window.setTimeout(() => closeBtnRef.current?.focus(), 120);
    }
    return () => {
      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
    };
  }, [bookId]);

  const buildSpreads = useCallback(() => {
    if (!bookId) return [];

    if (bookId === 'about') {
      const { profile, aboutBook, hero } = PORTFOLIO_DATA;

      return [
        {
          left: (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#6e4626]">
                  Volume I · About Me
                </p>
                <h3 className="book-title mt-1">
                  {profile.name}
                </h3>
                <p className="book-subtitle text-[#4f331c]">
                  {profile.headline}
                </p>

                <div className="relative mt-3 overflow-hidden rounded-lg border-2 border-[#bfa47a] bg-[#241721] shadow-md aspect-[4/3] max-h-[230px]">
                  {!portraitError ? (
                    <img
                      src={profile.portraitImageUrl}
                      alt={profile.portraitAlt}
                      referrerPolicy="no-referrer"
                      onError={() => setPortraitError(true)}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#281b22] p-4 text-center text-[#f3e6c8]">
                      <span className="book-subtitle text-[#f3e6c8]">{profile.name}</span>
                      <span className="mt-1 text-sm text-amber-200/80">{profile.headline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="book-body space-y-1 border-t border-[#1c1a2e]/15 pt-2.5">
                <p>
                  <span className="font-semibold text-[#1c1a2e]">Degree:</span> {profile.degree} ({profile.degreeStatus})
                </p>
                <p>
                  <span className="font-semibold text-[#1c1a2e]">Location:</span> {profile.location}
                </p>
                <p>
                  <span className="font-semibold text-[#1c1a2e]">Interests:</span> {profile.interests.join(', ')}
                </p>
              </div>
            </div>
          ),
          right: (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#6e4626]">
                  Chapter 1.1 · Prologue
                </p>
                <h4 className="book-subtitle mt-1">
                  {aboutBook.chapterTitle}
                </h4>
                <div className="book-body mt-3 space-y-2.5">
                  {aboutBook.storyParagraphs.map((para, idx) => (
                    <p key={idx} className={idx === 0 ? 'book-dropcap' : undefined}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <p className="book-note text-right text-[#6e4626]">
                Turn the page to continue reading →
              </p>
            </div>
          ),
        },
        {
          left: (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#6e4626]">
                  Chapter 1.2 · Margin Notes
                </p>
                <h4 className="book-subtitle mt-1">
                  {aboutBook.funFactsTitle}
                </h4>
                <dl className="mt-4 space-y-3.5">
                  {aboutBook.funFacts.map((fact, idx) => (
                    <div key={idx} className="border-b border-[#1c1a2e]/12 pb-2">
                      <dt className="book-note text-[#6e4626]">
                        {fact.label}
                      </dt>
                      <dd className="book-body mt-0.5 text-[#1c1a2e]">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="book-note text-[#6e4626]">
                Academic summary opposite →
              </p>
            </div>
          ),
          right: (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#6e4626]">
                  Chapter 1.3 · At a Glance
                </p>
                <h4 className="book-subtitle mt-1">
                  Academic &amp; Desk Summary
                </h4>
                <div className="book-body mt-3 space-y-2.5">
                  <p>
                    <span className="font-semibold text-[#1c1a2e]">Field of Study:</span>{' '}
                    {profile.degree} ({profile.degreeStatus}).
                  </p>
                  <p>
                    <span className="font-semibold text-[#1c1a2e]">Primary Focus:</span>{' '}
                    Data cleaning, exploratory data analysis, visual storytelling, and full-stack Python web tooling.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1c1a2e]">Practical Experience:</span>{' '}
                    Data Analyst Intern at Mahindra &amp; Mahindra, building automated CSV analytics and report workflows.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1c1a2e]">Contact Email:</span>{' '}
                    <span className="whitespace-nowrap">{profile.email}</span>
                  </p>
                </div>

                <div className="mt-4 rounded-lg border border-[#1c1a2e]/15 bg-[#e8d7b2]/65 p-3.5">
                  <p className="book-note text-[#6e4626]">Guiding Idea</p>
                  <p className="book-body mt-1 italic">{hero.tagline}</p>
                </div>
              </div>

              <p className="book-note text-right text-[#6e4626]">
                — End of Volume I —
              </p>
            </div>
          ),
        },
      ];
    }

    if (bookId === 'skills') {
      const { skillsBook } = PORTFOLIO_DATA;

      const renderSkillGroupPage = (group, groupIndex, isLastGroup) => (
        <div className="flex min-h-full flex-col justify-between gap-4">
          <div>
            <p className="book-note text-[#63365b]">
              Section 0{groupIndex + 1}
            </p>
            <h4 className="book-subtitle mt-1">
              {group.category}
            </h4>
            <div className="mt-4 space-y-3.5">
              {group.items.map((skill, idx) => (
                <div key={skill.name}>
                  <div className="book-body flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-[#1c1a2e]">{skill.name}</span>
                    <span className="book-note shrink-0 tabular-nums text-[#5c3e21]">
                      {skill.level}%
                    </span>
                  </div>
                  <p className="book-note leading-snug text-[#4e3e4d]">{skill.note}</p>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1c1a2e]/12">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: skill.level / 100 }}
                      transition={{ duration: 0.65, delay: 0.08 * idx, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        transformOrigin: 'left center',
                        backgroundColor: SKILL_BAR_COLORS[groupIndex % SKILL_BAR_COLORS.length],
                      }}
                      className="h-full w-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="book-note text-right text-[#63365b]">
            {isLastGroup ? '— End of Volume II —' : `Continue to Section 0${groupIndex + 2} →`}
          </p>
        </div>
      );

      const remainingGroups = skillsBook.groups.slice(1);
      const pairedSpreads = [];

      for (let i = 0; i < remainingGroups.length; i += 2) {
        const leftGroup = remainingGroups[i];
        const leftIndex = i + 1;
        const rightGroup = remainingGroups[i + 1];
        const rightIndex = i + 2;

        pairedSpreads.push({
          left: renderSkillGroupPage(
            leftGroup,
            leftIndex,
            !rightGroup && leftIndex === skillsBook.groups.length - 1
          ),
          right: rightGroup ? (
            renderSkillGroupPage(
              rightGroup,
              rightIndex,
              rightIndex === skillsBook.groups.length - 1
            )
          ) : (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#63365b]">
                  Volume II · Colophon
                </p>
                <h4 className="book-subtitle mt-1">
                  Bringing Analysis &amp; Web Together
                </h4>
                <p className="book-body book-dropcap mt-3">
                  From preparing raw CSV files with Pandas and NumPy to rendering visual insights in Matplotlib and serving them over clean HTML, CSS, JavaScript, and Python interfaces, every tool on this shelf supports clarity and speed.
                </p>
                <div className="mt-5 rounded-lg border border-[#1c1a2e]/15 bg-[#e6d3ad]/75 p-4">
                  <p className="book-note text-[#63365b]">Core Workflow</p>
                  <p className="book-body mt-1 font-medium text-[#1c1a2e]">
                    Ingest CSV &amp; Excel · Clean with Pandas &amp; NumPy · Visualize via Matplotlib · Deliver on the Web
                  </p>
                </div>
              </div>
              <p className="book-note text-right text-[#63365b]">
                — End of Volume II —
              </p>
            </div>
          ),
        });
      }

      return [
        {
          left: (
            <div className="flex min-h-full flex-col justify-between gap-4">
              <div>
                <p className="book-note text-[#63365b]">
                  Volume II · Index
                </p>
                <h3 className="book-title mt-1">
                  {skillsBook.tocTitle}
                </h3>
                <p className="book-subtitle text-[#4e3d4c]">{skillsBook.tocSubtitle}</p>

                <p className="book-body book-dropcap mt-3">
                  Every instrument cataloged in this volume bridges structured tabular analysis with clean, accessible web delivery.
                </p>

                <ol className="book-body mt-4 space-y-2">
                  {skillsBook.groups.map((grp, i) => (
                    <li
                      key={grp.category}
                      className="flex items-baseline justify-between gap-2 border-b border-dotted border-[#1c1a2e]/25 pb-1.5"
                    >
                      <span className="font-medium text-[#1c1a2e]">
                        0{i + 1}. {grp.category}
                      </span>
                      <span className="book-note shrink-0 tabular-nums text-[#6e4b2a]">
                        {grp.items.length} tools
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="book-note text-[#63365b]">
                Turn the page to explore each section in detail →
              </p>
            </div>
          ),
          right: renderSkillGroupPage(
            skillsBook.groups[0],
            0,
            skillsBook.groups.length === 1
          ),
        },
        ...pairedSpreads,
      ];
    }

    if (bookId === 'work') {
      return PORTFOLIO_DATA.workBook.chapters.map((chapter, idx) => ({
        left: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#7a4f0f]">
                {chapter.chapterLabel}
              </p>
              <h3 className="book-title mt-1">
                {chapter.title}
              </h3>
              <div className="book-body mt-2 flex flex-wrap items-center gap-2 font-medium text-[#523815]">
                <span>{chapter.organization}</span>
                <span aria-hidden="true">·</span>
                <span>{chapter.timeframe}</span>
              </div>

              <p className={`book-body mt-4 ${idx === 0 ? 'book-dropcap' : ''}`}>
                {chapter.summary}
              </p>
            </div>

            <div className="border-t border-[#1c1a2e]/15 pt-3">
              <p className="book-note text-[#5c3e21]">
                Technologies &amp; Craft
              </p>
              <p className="book-body mt-1">
                {chapter.stack.join(' · ')}
              </p>
            </div>
          </div>
        ),
        right: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <h4 className="book-subtitle">
                Key Contributions &amp; Features
              </h4>
              <ul className="book-body mt-3 space-y-2.5">
                {chapter.highlights.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex gap-2.5">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9e6616]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {(chapter.linkUrl || chapter.linkLabel) && (
                <div className="mt-5 rounded-md border border-[#1c1a2e]/15 bg-[#e6d3ad]/70 p-3.5">
                  {chapter.linkUrl ? (
                    <a
                      href={chapter.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="book-body inline-flex items-center gap-1.5 font-medium text-[#6e4207] underline underline-offset-4 hover:text-[#1c1a2e]"
                    >
                      <span>{chapter.linkLabel || 'View Project'}</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="book-note leading-snug text-[#4d351c]">
                      {chapter.linkLabel}: Add your repository, live demo, or certificate URL in the data config.
                    </p>
                  )}
                </div>
              )}
            </div>

            <p className="book-note text-right text-[#7a4f0f]">
              {idx < PORTFOLIO_DATA.workBook.chapters.length - 1
                ? 'Next chapter awaits →'
                : '— End of Volume III —'}
            </p>
          </div>
        ),
      }));
    }

    const { conclusionBook } = PORTFOLIO_DATA;
    return [
      {
        left: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#304d37]">
                Volume IV · Academic Timeline
              </p>
              <h3 className="book-title mt-1">
                {conclusionBook.epilogueTitle}
              </h3>

              <p className="book-body book-dropcap mt-3">
                Through formal training in artificial intelligence and practical data projects, each milestone adds another chapter to the shelf.
              </p>

              <div className="mt-4 rounded-lg border border-[#1c1a2e]/15 bg-[#e6d4ad]/65 p-4">
                <p className="book-note text-[#304d37]">
                  {conclusionBook.education.status}
                </p>
                <h4 className="book-subtitle mt-0.5">
                  {conclusionBook.education.degree}
                </h4>
                <p className="book-body mt-1.5">
                  {conclusionBook.education.institution}
                </p>
                <div className="book-note mt-1.5 flex flex-wrap items-center gap-2 text-[#443742] tabular-nums">
                  <span>{conclusionBook.education.years}</span>
                  <span aria-hidden="true">·</span>
                  <span>{conclusionBook.education.cgpa}</span>
                </div>
              </div>
            </div>

            <p className="book-note text-[#304d37]">
              Building strong foundations in AI, data &amp; code.
            </p>
          </div>
        ),
        right: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#304d37]">
                Credentials &amp; Courses
              </p>
              <h4 className="book-subtitle mt-1">
                Certifications
              </h4>
              <ul className="book-body mt-3 space-y-3">
                {conclusionBook.certifications.map((cert, i) => (
                  <li key={i} className="border-b border-[#1c1a2e]/12 pb-2">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <p className="book-note text-right text-[#304d37]">
              Turn the page for achievements →
            </p>
          </div>
        ),
      },
      {
        left: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#304d37]">
                Milestones &amp; Recognition
              </p>
              <h4 className="book-subtitle mt-1">
                Achievements
              </h4>
              <ul className="book-body mt-3 space-y-3">
                {conclusionBook.achievements.map((ach, i) => (
                  <li key={i} className="border-b border-[#1c1a2e]/12 pb-2">
                    {ach}
                  </li>
                ))}
              </ul>
            </div>

            <p className="book-note text-[#304d37]">
              Personal notes opposite →
            </p>
          </div>
        ),
        right: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div className="space-y-5">
              <div>
                <p className="book-note text-[#304d37]">
                  Personal Shelf
                </p>
                <h4 className="book-subtitle mt-1">
                  Languages
                </h4>
                <ul className="book-body mt-2 space-y-1.5">
                  {conclusionBook.languages.map((lang, i) => (
                    <li key={i}>{lang}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="book-subtitle">
                  Hobbies &amp; Reading
                </h4>
                <p className="book-body mt-2">
                  {conclusionBook.hobbies.join(', ')} — reading remains my quiet source of curiosity, patience, and perspective.
                </p>
              </div>
            </div>

            <p className="book-note text-right text-[#304d37]">
              Turn to the final page →
            </p>
          </div>
        ),
      },
      {
        left: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#304d37]">
                Looking Ahead
              </p>
              <h4 className="book-subtitle mt-1">
                Ready for the Next Chapter
              </h4>
              <p className="book-body book-dropcap mt-3">
                Combining academic grounding in Artificial Intelligence &amp; Data Science with hands-on analytics internship experience at Mahindra &amp; Mahindra, I enjoy turning messy tables into reliable workflows and intuitive web tools.
              </p>
              <p className="book-body mt-3">
                Whether exploring new datasets, automating reports in Python, or crafting responsive interfaces, I bring curiosity and steady attention to detail.
              </p>
            </div>
            <p className="book-note text-[#304d37]">
              Closing note &amp; invitation →
            </p>
          </div>
        ),
        right: (
          <div className="flex min-h-full flex-col justify-between gap-4">
            <div>
              <p className="book-note text-[#304d37]">
                Closing Note
              </p>
              <blockquote className="book-subtitle mt-3 italic leading-relaxed text-[#1c1a2e]">
                &ldquo;{conclusionBook.closingQuote}&rdquo;
              </blockquote>
              <p className="book-note mt-2 text-[#4e3f4b]">
                {conclusionBook.closingQuoteIsPlaceholder
                  ? '(Editable closing quote placeholder)'
                  : ''}
              </p>
            </div>

            <div className="border-t border-[#1c1a2e]/15 pt-4">
              <button
                type="button"
                onClick={onGoToContact}
                className="book-body inline-flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg bg-[#45634d] px-4 py-3 text-left font-medium text-[#f7ead0] shadow transition-colors hover:bg-[#37503e]"
              >
                <span>{conclusionBook.ctaText}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
              <p className="book-note mt-3 text-right text-[#304d37]">
                — End of Volume IV —
              </p>
            </div>
          </div>
        ),
      },
    ];
  }, [bookId, onGoToContact, portraitError]);

  const spreads = buildSpreads();
  const totalSpreads = spreads.length;

  const goNext = useCallback(() => {
    if (spreadIndex >= totalSpreads - 1 || flipDir) return;
    playPageRustle(soundEnabled);
    setFlipDir('next');
    flipTimerRef.current = window.setTimeout(() => {
      flipTimerRef.current = null;
      setSpreadIndex((s) => Math.min(totalSpreads - 1, s + 1));
      setFlipDir(null);
    }, 340);
  }, [spreadIndex, totalSpreads, flipDir, soundEnabled]);

  const goPrev = useCallback(() => {
    if (spreadIndex <= 0 || flipDir) return;
    playPageRustle(soundEnabled);
    setFlipDir('prev');
    flipTimerRef.current = window.setTimeout(() => {
      flipTimerRef.current = null;
      setSpreadIndex((s) => Math.max(0, s - 1));
      setFlipDir(null);
    }, 340);
  }, [spreadIndex, flipDir, soundEnabled]);

  useEffect(() => {
    if (!bookId) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bookId, onClose, goNext, goPrev]);

  const currentSpread = spreads[spreadIndex];

  return (
    <AnimatePresence>
      {bookId && bookMeta && currentSpread && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${bookMeta.spineTitle} book reader`}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/78 p-2.5 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 36, rotateX: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              if (deltaX < -48) goNext();
              if (deltaX > 48) goPrev();
              touchStartX.current = null;
            }}
            style={{ width: 'min(95vw, 1220px)' }}
            className="book-stage relative mx-auto my-auto flex flex-col"
          >
            {/* Top Reader Controls Bar */}
            <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2 text-[#f3e6c8] sm:mb-3">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <span className="font-foil truncate text-xs text-amber-100 sm:text-sm">
                  {bookMeta.spineTitle}
                </span>
                <span aria-hidden="true" className="text-amber-200/50">
                  ·
                </span>
                <span className="shrink-0 tabular-nums text-amber-200/85">
                  {spreadIndex + 1} / {totalSpreads}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((s) => !s)}
                  aria-label={soundEnabled ? 'Mute page turn sound' : 'Enable subtle page turn sound'}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-amber-200/20 bg-black/40 px-3 py-1.5 text-sm text-amber-100/85 transition-colors hover:border-amber-300/60 whitespace-nowrap shrink-0"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-amber-200/60" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {soundEnabled ? 'Page Sound On' : 'Muted'}
                  </span>
                </button>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close book and return to shelf"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-amber-200/25 bg-[#2a1911] px-3.5 py-1.5 text-sm font-medium text-amber-100 transition-colors hover:bg-[#3d251a] whitespace-nowrap shrink-0"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span>Close book</span>
                </button>
              </div>
            </div>

            {/* Bound Hardcover + Two-Page Parchment Spread */}
            <div
              className="book-3d-shell relative rounded-xl p-2 shadow-[0_32px_90px_rgba(0,0,0,0.75)] sm:p-4"
              style={{
                backgroundColor: bookMeta.spineColor,
                border: '1px solid rgba(255, 224, 166, 0.25)',
              }}
            >
              {/* Hanging Crimson Silk Bookmark Ribbon */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 z-30 hidden h-14 w-4 -translate-x-1/2 bg-[#8c2f27] shadow-md md:block"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
              />

              {/* Parchment Two-Page Grid */}
              <div
                className="relative grid grid-cols-1 rounded-lg shadow-inner md:grid-cols-2"
                style={{
                  minHeight: 'min(70vh, 640px)',
                }}
              >
                {/* Left Page */}
                <div className="parchment-surface book-page-content select-text relative flex flex-col justify-between border-b border-[#1c1a2e]/15 p-[clamp(1.1rem,2.3vw,2.15rem)] md:border-b-0 md:border-r md:shadow-[inset_-18px_0_28px_rgba(59,36,22,0.12)]">
                  <div className="flex-1 pb-4">{currentSpread.left}</div>
                  <div className="book-note mt-2 flex shrink-0 items-center justify-between border-t border-[#1c1a2e]/10 pt-2 tabular-nums text-[#5c3e21]">
                    <span>p. {spreadIndex * 2 + 1}</span>
                    <span>
                      {bookMeta.volumeRoman} · {spreadIndex + 1} / {totalSpreads}
                    </span>
                  </div>
                </div>

                {/* Right Page */}
                <div className="parchment-surface book-page-content select-text relative flex flex-col justify-between p-[clamp(1.1rem,2.3vw,2.15rem)] md:shadow-[inset_18px_0_28px_rgba(59,36,22,0.12)]">
                  <div className="flex-1 pb-4">{currentSpread.right}</div>
                  <div className="book-note mt-2 flex shrink-0 items-center justify-between border-t border-[#1c1a2e]/10 pt-2 tabular-nums text-[#5c3e21]">
                    <span>{bookMeta.spineTitle}</span>
                    <span>
                      {spreadIndex + 1} / {totalSpreads} · p. {spreadIndex * 2 + 2}
                    </span>
                  </div>
                </div>

                {/* CSS 3D Page-Turn Leaf Overlay during transition */}
                {flipDir && (
                  <motion.div
                    initial={{ rotateY: flipDir === 'next' ? 0 : -180 }}
                    animate={{ rotateY: flipDir === 'next' ? -180 : 0 }}
                    transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'left center' }}
                    aria-hidden="true"
                    className="parchment-surface book-flip-leaf pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-1/2 border-l border-[#1c1a2e]/20 shadow-2xl md:block"
                  />
                )}
              </div>
            </div>

            {/* Bottom Page Turn Bar */}
            <div className="mt-2.5 flex shrink-0 items-center justify-between gap-2 text-sm text-amber-100/85 sm:mt-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={spreadIndex === 0}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-amber-200/20 bg-black/35 px-3.5 py-2 font-medium transition-colors hover:border-amber-300/60 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0 sm:px-4"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Previous Page</span>
              </button>

              <span className="tabular-nums text-amber-200/80 sm:hidden">
                {spreadIndex + 1} / {totalSpreads}
              </span>
              <span className="hidden text-amber-200/75 sm:inline">
                Use Arrow keys or swipe · {spreadIndex + 1} / {totalSpreads} · Esc to close
              </span>

              <button
                type="button"
                onClick={goNext}
                disabled={spreadIndex >= totalSpreads - 1}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-amber-200/20 bg-black/35 px-3.5 py-2 font-medium transition-colors hover:border-amber-300/60 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap shrink-0 sm:px-4"
              >
                <span>Next Page</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
