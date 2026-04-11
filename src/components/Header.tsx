import React from 'react';
import { FilePlus2, BookOpen, Feather } from 'lucide-react';

interface HeaderProps {
  onViewSavedNotes: () => void;
  onNewNote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewSavedNotes, onNewNote }) => {
  return (
    <header className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-amber-100 border border-amber-200/80 shadow-sm"></div>
            <Feather className="relative w-5 h-5 text-amber-700" strokeWidth={1.5} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight text-stone-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              NotaLink
            </h1>
            <p
              className="text-xs text-stone-400 tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Instant note sharing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNewNote}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all duration-200 text-stone-600 hover:text-stone-800 shadow-sm"
          >
            <FilePlus2 className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm hidden sm:inline" style={{ fontFamily: "'DM Sans', sans-serif" }}>New Note</span>
          </button>

          <button
            onClick={onViewSavedNotes}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-all duration-200 text-stone-600 hover:text-stone-800 shadow-sm"
          >
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm hidden sm:inline" style={{ fontFamily: "'DM Sans', sans-serif" }}>Saved Notes</span>
          </button>
        </div>
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"></div>
    </header>
  );
};

export default Header;
