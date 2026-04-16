import React from 'react';
import { FilePlus2, BookOpen, Feather, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

interface HeaderProps {
  onViewSavedNotes: () => void;
  onNewNote: () => void;
  onOpenCommandPalette: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewSavedNotes, onNewNote, onOpenCommandPalette }) => {
  return (
    <motion.header
      className="relative"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
        >
          <div className="header-logo-wrap">
            <Feather
              className="header-logo-icon relative w-5 h-5 text-amber-700 dark:text-amber-400"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight leading-none text-stone-800 dark:text-stone-100"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              NotaLink
            </h1>
            <p
              className="text-[10px] tracking-[0.18em] uppercase mt-0.5 text-stone-400 dark:text-stone-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Instant note sharing
            </p>
          </div>
        </motion.div>

        {/* Nav buttons */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        >
          <MagneticButton strength={0.25}>
            <button
              onClick={onOpenCommandPalette}
              className="header-btn header-btn-secondary"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              title="Open Menu"
            >
              <Menu className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden sm:inline text-xs">Menu</span>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.3}>
            <button
              onClick={onNewNote}
              className="header-btn header-btn-primary"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <FilePlus2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden sm:inline">New Note</span>
            </button>
          </MagneticButton>

          <MagneticButton strength={0.25}>
            <button
              onClick={onViewSavedNotes}
              className="header-btn header-btn-secondary"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden sm:inline">Saved Notes</span>
            </button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Animated divider */}
      <motion.div
        className="header-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.header>
  );
};

export default Header;