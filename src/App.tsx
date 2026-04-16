import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Note } from './utils/noteStorage';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ShareButton from './components/ShareButton';
import SavedNotesModal from './components/SavedNotesModal';
import CommandPalette from './components/CommandPalette';
import SuccessToast from './components/SuccessToast';
import AnimatedBackground from './components/AnimatedBackground';
import {
  loadNote,
  saveNote,
  generateNoteId,
  getAllNotes,
  deleteNote,
} from './utils/noteStorage';
import { saveNoteToCloud, loadNoteFromCloud } from './utils/supabase';
import { Feather, Sparkles } from 'lucide-react';

function App() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>(getAllNotes());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('notalink_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: '' });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 4000);
  }, []);

  // Dark mode: persist + toggle class on <html>
  useEffect(() => {
    localStorage.setItem('notalink_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Load shared note from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#note=(.+)$/);
    const sharedId = match ? match[1] : null;

    if (sharedId) {
      loadNoteFromCloud(sharedId).then((content) => {
        if (content !== null) {
          setCurrentNote({
            id: generateNoteId(),
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setIsSharedView(true);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleNoteChange = useCallback((content: string) => {
    setHasUnsavedChanges(true);
    setCurrentNote((prevNote) => {
      if (prevNote) {
        return { ...prevNote, content, updatedAt: new Date() };
      }
      return {
        id: generateNoteId(),
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }, []);

  const handleSaveNote = useCallback(() => {
    if (currentNote && currentNote.content.trim()) {
      saveNote(currentNote.id, currentNote.content);
      setHasUnsavedChanges(false);
      setSavedNotes(getAllNotes());
    }
  }, [currentNote]);

  const handleNewNote = useCallback(() => {
    if (
      hasUnsavedChanges &&
      !window.confirm('You have unsaved changes. Create a new note anyway?')
    )
      return;
    setCurrentNote({
      id: generateNoteId(),
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setHasUnsavedChanges(false);
    setShowSavedNotes(false);
    setIsSharedView(false);
    window.history.pushState({}, '', window.location.pathname);
  }, [hasUnsavedChanges]);

  const handleShare = useCallback(async (): Promise<string | null> => {
    if (!currentNote || !currentNote.content.trim()) return null;

    setIsSharing(true);
    saveNote(currentNote.id, currentNote.content);
    setHasUnsavedChanges(false);
    setSavedNotes(getAllNotes());

    const cloudId = await saveNoteToCloud(currentNote.content);
    setIsSharing(false);

    if (!cloudId) {
      showToast('Failed to generate share link. Please try again.');
      return null;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}#note=${cloudId}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    return shareUrl;
  }, [currentNote, showToast]);

  const handleShareSuccess = useCallback(() => {
    showToast('🔗 Share link copied to clipboard!');
  }, [showToast]);

  const handleSelectNote = useCallback((selectedNoteId: string) => {
    if (
      hasUnsavedChanges &&
      !window.confirm('You have unsaved changes. Switch notes anyway?')
    )
      return;
    const note = loadNote(selectedNoteId);
    if (note) {
      setCurrentNote({
        id: selectedNoteId,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
      setHasUnsavedChanges(false);
      setShowSavedNotes(false);
      setIsSharedView(false);
      window.history.pushState({}, '', window.location.pathname);
    }
  }, [hasUnsavedChanges]);

  const handleDeleteNote = useCallback((noteIdToDelete: string) => {
    deleteNote(noteIdToDelete);
    setSavedNotes(getAllNotes());
    setCurrentNote((prevNote) => {
      if (prevNote && prevNote.id === noteIdToDelete) {
        setHasUnsavedChanges(false);
        return null;
      }
      return prevNote;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  /* ─── Loading screen ──────────────────────────────────── */
  if (isLoading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <div
          className="loading-screen"
          style={
            isDarkMode
              ? {
                  background:
                    'linear-gradient(160deg, #0c0a09 0%, #1c1917 40%, #0c0a09 100%)',
                }
              : {}
          }
        >
          <motion.div
            className="loading-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="loading-feather"
              animate={{
                y: [0, -6, 0],
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Feather className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
            </motion.div>
            <p
              className="text-sm tracking-wider"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: isDarkMode ? '#a8a29e' : '#78716c',
              }}
            >
              Loading NotaLink…
            </p>
            <div className="loading-dots">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  /* ─── Main App ────────────────────────────────────────── */
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen transition-colors duration-500"
        style={{
          background: isDarkMode
            ? 'linear-gradient(160deg, #0c0a09 0%, #1c1917 40%, #0c0a09 100%)'
            : 'linear-gradient(160deg, #fdf8f2 0%, #fef3e2 40%, #fdf6ee 100%)',
          color: isDarkMode ? '#e7e5e4' : '#292524',
        }}
      >
        {/* Animated Background */}
        <AnimatedBackground isDarkMode={isDarkMode} />

        {/* Paper texture */}
        <div
          className="paper-texture"
          style={{ opacity: isDarkMode ? 0.015 : 0.04 }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <Header
            onViewSavedNotes={() => setShowSavedNotes(true)}
            onNewNote={handleNewNote}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
          />

          <main className="mt-6 sm:mt-8">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* ── Editor column ─────────────────────── */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentNote ? (
                    <motion.div
                      key={currentNote.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <NoteEditor
                        content={currentNote.content}
                        onChange={handleNoteChange}
                        onSave={handleSaveNote}
                        readOnly={isSharedView}
                        hasUnsavedChanges={hasUnsavedChanges}
                        isDarkMode={isDarkMode}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="min-h-[24rem] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center relative overflow-hidden"
                      style={{
                        cursor: 'pointer',
                        borderColor: isDarkMode
                          ? 'rgba(217,119,6,0.15)'
                          : 'rgba(217,119,6,0.25)',
                        background: isDarkMode
                          ? 'linear-gradient(135deg, rgba(28,25,23,0.4) 0%, rgba(41,37,36,0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(255,251,235,0.4) 0%, rgba(254,243,199,0.2) 100%)',
                      }}
                      onClick={handleNewNote}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <motion.div
                        className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-5"
                        style={{
                          background: isDarkMode
                            ? 'linear-gradient(135deg, #292524 0%, #44403c 100%)'
                            : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          boxShadow: isDarkMode
                            ? '0 4px 16px rgba(0,0,0,0.4)'
                            : '0 4px 16px rgba(217,119,6,0.2)',
                        }}
                        animate={{
                          y: [0, -4, 0],
                          rotate: [-3, 3, -3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Feather
                          className="w-6 h-6"
                          strokeWidth={1.5}
                          style={{ color: isDarkMode ? '#fbbf24' : '#b45309' }}
                        />
                      </motion.div>
                      <h2
                        className="text-lg font-semibold mb-1"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: isDarkMode ? '#d6d3d1' : '#57534e',
                        }}
                      >
                        No note open
                      </h2>
                      <p
                        className="text-sm mb-4"
                        style={{ color: isDarkMode ? '#78716c' : '#a8a29e' }}
                      >
                        Select a saved note or start writing
                      </p>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewNote();
                        }}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                          bg-gradient-to-br from-amber-500 to-amber-600 shadow-md"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          boxShadow: isDarkMode
                            ? '0 4px 14px rgba(217,119,6,0.3)'
                            : '0 4px 14px rgba(217,119,6,0.25)',
                        }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        + New Note
                      </motion.button>
                      <p
                        className="text-xs mt-4"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: isDarkMode ? '#57534e' : '#a8a29e',
                        }}
                      >
                        or press{' '}
                        <kbd
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            background: isDarkMode ? '#292524' : '#f5f5f4',
                            border: `1px solid ${isDarkMode ? '#44403c' : '#e7e5e4'}`,
                            color: isDarkMode ? '#a8a29e' : '#78716c',
                          }}
                        >
                          ⌘K
                        </kbd>{' '}
                        to search
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Sidebar ───────────────────────────── */}
              <div className="space-y-4">
                {/* Share */}
                <ShareButton
                  onShare={handleShare}
                  disabled={!currentNote || !currentNote.content.trim()}
                  isLoading={isSharing}
                  onShareSuccess={handleShareSuccess}
                />

                {/* Quick tips */}
                <motion.div
                  className="rounded-2xl p-5"
                  style={{
                    border: `1px solid ${isDarkMode ? 'rgba(217,119,6,0.12)' : 'rgba(217,119,6,0.2)'}`,
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(28,25,23,0.8) 0%, rgba(41,37,36,0.5) 100%)'
                      : 'linear-gradient(135deg, rgba(255,251,235,0.8) 0%, rgba(254,243,199,0.5) 100%)',
                    backdropFilter: 'blur(4px)',
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: 0.35,
                  }}
                >
                  <div
                    className="text-xs font-bold tracking-[0.04em] uppercase mb-3 flex items-center gap-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: isDarkMode ? '#fbbf24' : '#78350f',
                    }}
                  >
                    <Sparkles
                      className="w-3.5 h-3.5"
                      strokeWidth={1.5}
                      style={{ color: isDarkMode ? '#fbbf24' : '#d97706' }}
                    />
                    Quick Tips
                  </div>
                  {[
                    'Press ⌘K for the command palette',
                    'Select text to use AI tools ✨',
                    'Save before sharing your note',
                    'Sharing generates a unique link',
                    'Press Esc to close any modal',
                  ].map((tip, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2 py-0.5 text-xs leading-relaxed"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: isDarkMode ? '#78716c' : '#a8a29e',
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + i * 0.05,
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                      whileHover={{
                        color: isDarkMode ? '#a8a29e' : '#78716c',
                        x: 2,
                      }}
                    >
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                        style={{
                          background: isDarkMode
                            ? 'rgba(251,191,36,0.4)'
                            : 'rgba(217,119,6,0.5)',
                        }}
                      />
                      <span>{tip}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Saved notes count chip */}
                <AnimatePresence>
                  {savedNotes.length > 0 && (
                    <motion.button
                      onClick={() => setShowSavedNotes(true)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                      style={{
                        borderRadius: '14px',
                        fontFamily: "'DM Sans', sans-serif",
                        border: `1px solid ${isDarkMode ? 'rgba(217,119,6,0.12)' : 'rgba(217,119,6,0.2)'}`,
                        background: isDarkMode
                          ? 'rgba(28,25,23,0.5)'
                          : 'rgba(255,255,255,0.5)',
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        delay: 0.4,
                      }}
                      whileHover={{
                        scale: 1.01,
                        y: -1,
                        backgroundColor: isDarkMode
                          ? 'rgba(41,37,36,0.7)'
                          : 'rgba(255,251,235,0.8)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: isDarkMode ? '#d6d3d1' : '#57534e' }}
                      >
                        {savedNotes.length} saved{' '}
                        {savedNotes.length === 1 ? 'note' : 'notes'}
                      </span>
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{ color: isDarkMode ? '#fbbf24' : '#d97706' }}
                      >
                        View all →
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNewNote={handleNewNote}
        onSelectNote={handleSelectNote}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
        savedNotes={savedNotes}
      />

      {/* Saved Notes Modal */}
      <SavedNotesModal
        notes={savedNotes}
        isOpen={showSavedNotes}
        onClose={() => setShowSavedNotes(false)}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* Success Toast */}
      <div className="fixed bottom-6 right-6 z-[200]">
        <AnimatePresence>
          {toast.visible && (
            <SuccessToast
              message={toast.message}
              visible={toast.visible}
              onDismiss={() => setToast({ visible: false, message: '' })}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;