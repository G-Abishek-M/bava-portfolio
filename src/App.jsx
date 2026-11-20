import { useCallback, useEffect, useState } from 'react';
import { LibraryLoader } from './components/LibraryLoader';
import { DustParticles } from './components/DustParticles';
import { PaperRocketCursor } from './components/PaperRocketCursor';
import { BookmarkNav } from './components/BookmarkNav';
import { HeroSection } from './components/HeroSection';
import { BookshelfSection } from './components/BookshelfSection';
import { BookReaderModal } from './components/BookReaderModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [isNightMode, setIsNightMode] = useState(true);
  const [portraitReady, setPortraitReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [openBookId, setOpenBookId] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isNightMode);
  }, [isNightMode]);

  useEffect(() => {
    const homeEl = document.getElementById('home');
    const shelfEl = document.getElementById('library-shelf');
    const contactEl = document.getElementById('contact');
    if (!homeEl || !shelfEl || !contactEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (openBookId) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target.id === 'home') setActiveSection('home');
          if (entry.target.id === 'library-shelf') setActiveSection('about');
          if (entry.target.id === 'contact') setActiveSection('contact');
        }
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: 0.05 }
    );

    observer.observe(homeEl);
    observer.observe(shelfEl);
    observer.observe(contactEl);

    return () => observer.disconnect();
  }, [openBookId]);

  const scrollToElement = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleNavigate = useCallback(
    (section) => {
      setActiveSection(section);
      if (section === 'home') {
        setOpenBookId(null);
        scrollToElement('home');
        return;
      }
      if (section === 'contact') {
        setOpenBookId(null);
        scrollToElement('contact');
        return;
      }

      scrollToElement('library-shelf');
      window.setTimeout(() => {
        setOpenBookId(section);
      }, 220);
    },
    [scrollToElement]
  );

  const handleOpenBook = useCallback((bookId) => {
    setActiveSection(bookId);
    setOpenBookId(bookId);
  }, []);

  const handleCloseBook = useCallback(() => {
    setOpenBookId(null);
  }, []);

  const handleGoToContact = useCallback(() => {
    setOpenBookId(null);
    setActiveSection('contact');
    window.setTimeout(() => {
      scrollToElement('contact');
    }, 180);
  }, [scrollToElement]);

  const handlePortraitReady = useCallback(() => {
    setPortraitReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-room)] text-[var(--text-primary)] transition-colors duration-300">
      {!loaderDone && (
        <LibraryLoader isReady={portraitReady} onComplete={handleLoaderComplete} />
      )}

      {/* Custom Folded Paper-Rocket Cursor + Canvas Particle Trail */}
      <PaperRocketCursor />

      {/* Atmospheric Lamplight Dust Motes & Room Vignette */}
      <DustParticles />
      <div
        aria-hidden="true"
        className="library-vignette pointer-events-none fixed inset-0 z-20"
      />

      {/* Sticky Bookmark Navigation & Lamp Toggle */}
      <BookmarkNav
        activeSection={activeSection}
        isNightMode={isNightMode}
        onToggleTheme={() => setIsNightMode((n) => !n)}
        onNavigate={handleNavigate}
      />

      <main className="relative z-30">
        <HeroSection
          isBookOpen={openBookId !== null}
          onExploreBookshelf={() => scrollToElement('library-shelf')}
          onPortraitReady={handlePortraitReady}
        />
        <BookshelfSection activeBookId={openBookId} onOpenBook={handleOpenBook} />
        <ContactSection />
      </main>

      <div className="relative z-30">
        <Footer />
      </div>

      {/* Interactive 3D Two-Page Spread Book Reader */}
      <BookReaderModal
        bookId={openBookId}
        onClose={handleCloseBook}
        onGoToContact={handleGoToContact}
      />
    </div>
  );
}
