import React from 'react';
import { FilePlus2, BookOpen, Feather } from 'lucide-react';

interface HeaderProps {
  onViewSavedNotes: () => void;
  onNewNote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewSavedNotes, onNewNote }) => {
  return (
    <header className="relative animate-slide-down">
      <div className="flex items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-3 animate-fade-up delay-100">
          <div className="header-logo-wrap">
            <Feather
              className="header-logo-icon relative w-5 h-5 text-amber-700"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight text-stone-800 leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              NotaLink
            </h1>
            <p
              className="text-[10px] text-stone-400 tracking-[0.18em] uppercase mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Instant note sharing
            </p>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2 animate-fade-up delay-200">
          <button
            onClick={onNewNote}
            className="header-btn header-btn-primary"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <FilePlus2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">New Note</span>
          </button>

          <button
            onClick={onViewSavedNotes}
            className="header-btn header-btn-secondary"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">Saved Notes</span>
          </button>
        </div>
      </div>

      {/* Animated divider */}
      <div className="header-divider animate-fade-in delay-300" />
    </header>
  );
};

export default Header;