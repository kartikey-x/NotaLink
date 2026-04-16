import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, FilePlus2, X, Settings2 } from 'lucide-react';
import type { Note } from '../utils/noteStorage';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewNote: () => void;
  onSelectNote: (noteId: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  savedNotes: Note[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNewNote,
  onToggleTheme,
  isDarkMode,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            // Closes the menu if the user clicks the backdrop (outside the panel)
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          />

          {/* Menu Panel */}
          <motion.div
            className="relative w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(160deg, #1c1917 0%, #292524 100%)'
                : 'linear-gradient(160deg, #fdfbf7 0%, #fef9f0 100%)',
              borderColor: isDarkMode
                ? 'rgba(168,162,158,0.15)'
                : 'rgba(217,119,6,0.2)',
              boxShadow: isDarkMode
                ? '0 25px 80px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)'
                : '0 25px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(217,119,6,0.1)',
              fontFamily: "'DM Sans', sans-serif",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{
                borderColor: isDarkMode ? 'rgba(168,162,158,0.08)' : 'rgba(217,119,6,0.12)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center border border-amber-200/60 dark:from-stone-800 dark:to-stone-700 dark:border-stone-600">
                  <Settings2
                    className="w-4 h-4 text-amber-700 dark:text-amber-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h2
                  className="text-base font-bold text-stone-800 dark:text-stone-100 leading-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Menu
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                style={{
                  background: isDarkMode ? 'rgba(41,37,36,0.6)' : 'rgba(255,255,255,0.6)',
                  borderColor: isDarkMode ? 'rgba(168,162,158,0.1)' : 'rgba(168,162,158,0.2)',
                  color: isDarkMode ? '#78716c' : '#a8a29e',
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                whileTap={{ scale: 0.95 }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Menu Options */}
            <div className="p-3 space-y-1.5">
              <motion.button
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}
                whileHover={{ scale: 1.01, backgroundColor: isDarkMode ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.08)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400">
                  {isDarkMode ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Toggle app appearance
                  </p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => {
                  onNewNote();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
                }}
                whileHover={{ scale: 1.01, backgroundColor: isDarkMode ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.08)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400">
                  <FilePlus2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                    New Note
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Create a blank canvas
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(CommandPalette);