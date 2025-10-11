import React from 'react';
import { Sparkles, Archive, FilePlus2 } from 'lucide-react';

interface HeaderProps {
  onViewSavedNotes: () => void;
  onNewNote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewSavedNotes, onNewNote }) => {
  return (
    <header className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 rounded-full"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
                <path
                  fill="currentColor"
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                />
                <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              NotaLink
            </h1>
            <p className="text-gray-400 text-sm">Instant note sharing</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* --- "NEW NOTE" BUTTON RE-ADDED HERE --- */}
          <button
            onClick={onNewNote}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            title="Create a new note"
          >
            <FilePlus2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 hidden sm:inline">New Note</span>
          </button>
          
          <button
            onClick={onViewSavedNotes}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            title="View saved notes"
          >
            <Archive className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 hidden sm:inline">Saved Notes</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI-powered writing assistant</span>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient line */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;