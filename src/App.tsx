import { useState, useEffect } from 'react';
import type { Note } from './utils/noteStorage';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ShareButton from './components/ShareButton';
import SavedNotesModal from './components/SavedNotesModal';
import { loadNote, saveNote, generateNoteId, getAllNotes, deleteNote } from './utils/noteStorage';
import { saveNoteToCloud, loadNoteFromCloud } from './utils/supabase';
import { Feather, Sparkles } from 'lucide-react';

function App() {
  const [currentNote, setCurrentNote]         = useState<Note | null>(null);
  const [savedNotes, setSavedNotes]           = useState<Note[]>(getAllNotes());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedNotes, setShowSavedNotes]   = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [isSharedView, setIsSharedView]       = useState(false);
  const [isSharing, setIsSharing]             = useState(false);

  useEffect(() => {
    const hash   = window.location.hash;
    const match  = hash.match(/^#note=(.+)$/);
    const sharedId = match ? match[1] : null;

    if (sharedId) {
      loadNoteFromCloud(sharedId).then((content) => {
        if (content !== null) {
          setCurrentNote({
            id: generateNoteId(), content,
            createdAt: new Date(), updatedAt: new Date(),
          });
          setIsSharedView(true);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleNoteChange = (content: string) => {
    setHasUnsavedChanges(true);
    if (currentNote) {
      setCurrentNote({ ...currentNote, content, updatedAt: new Date() });
    } else {
      setCurrentNote({ id: generateNoteId(), content, createdAt: new Date(), updatedAt: new Date() });
    }
  };

  const handleSaveNote = () => {
    if (currentNote && currentNote.content.trim()) {
      saveNote(currentNote.id, currentNote.content);
      setHasUnsavedChanges(false);
      setSavedNotes(getAllNotes());
    }
  };

  const handleNewNote = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Create a new note anyway?')) return;
    setCurrentNote({ id: generateNoteId(), content: '', createdAt: new Date(), updatedAt: new Date() });
    setHasUnsavedChanges(false);
    setShowSavedNotes(false);
    setIsSharedView(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleShare = async (): Promise<string | null> => {
    if (!currentNote || !currentNote.content.trim()) return null;

    setIsSharing(true);
    saveNote(currentNote.id, currentNote.content);
    setHasUnsavedChanges(false);
    setSavedNotes(getAllNotes());

    const cloudId = await saveNoteToCloud(currentNote.content);
    setIsSharing(false);

    if (!cloudId) {
      alert('Failed to generate share link. Please try again.');
      return null;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}#note=${cloudId}`;
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    return shareUrl;
  };

  const handleSelectNote = (selectedNoteId: string) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Switch notes anyway?')) return;
    const note = loadNote(selectedNoteId);
    if (note) {
      setCurrentNote({ id: selectedNoteId, content: note.content, createdAt: note.createdAt, updatedAt: note.updatedAt });
      setHasUnsavedChanges(false);
      setShowSavedNotes(false);
      setIsSharedView(false);
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleDeleteNote = (noteIdToDelete: string) => {
    deleteNote(noteIdToDelete);
    setSavedNotes(getAllNotes());
    if (currentNote && currentNote.id === noteIdToDelete) {
      setCurrentNote(null);
      setHasUnsavedChanges(false);
    }
  };

  /* ─── Loading screen ──────────────────────────────────── */
  if (isLoading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />
        <div className="loading-screen">
          <div className="loading-inner">
            <div className="loading-feather">
              <Feather className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
            </div>
            <p
              className="text-sm text-stone-500 tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Loading NotaLink…
            </p>
            <div className="loading-dots">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ─── Main App ────────────────────────────────────────── */
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />

      <div className="app-bg text-stone-800">
        {/* Paper texture */}
        <div className="paper-texture" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">

          <Header
            onViewSavedNotes={() => setShowSavedNotes(true)}
            onNewNote={handleNewNote}
          />

          <main className="mt-6 sm:mt-8">
            {/* Mobile: stacked; Desktop: side by side */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">

              {/* ── Editor column ─────────────────────── */}
              <div className="lg:col-span-2">
                {currentNote ? (
                  <NoteEditor
                    key={currentNote.id}
                    content={currentNote.content}
                    onChange={handleNoteChange}
                    onSave={handleSaveNote}
                    readOnly={isSharedView}
                    hasUnsavedChanges={hasUnsavedChanges}
                  />
                ) : (
                  <div className="empty-state" onClick={handleNewNote} style={{ cursor: 'pointer' }}>
                    <div className="empty-state-icon">
                      <Feather className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
                    </div>
                    <h2
                      className="text-lg font-semibold text-stone-600 mb-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      No note open
                    </h2>
                    <p className="text-sm text-stone-400 mb-4">
                      Select a saved note or start writing
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNewNote(); }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        bg-gradient-to-br from-amber-500 to-amber-600 text-white
                        shadow-md shadow-amber-200 hover:shadow-amber-300 hover:scale-105 active:scale-95"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      + New Note
                    </button>
                  </div>
                )}
              </div>

              {/* ── Sidebar ───────────────────────────── */}
              <div className="space-y-4 animate-fade-up delay-300">

                {/* Share */}
                <ShareButton
                  onShare={handleShare}
                  disabled={!currentNote || !currentNote.content.trim()}
                  isLoading={isSharing}
                />

                {/* Quick tips */}
                <div className="tips-card animate-fade-up delay-400">
                  <div className="tips-card-title" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" strokeWidth={1.5} />
                    Quick Tips
                  </div>
                  {[
                    'Click "New Note" to start writing',
                    'Save before sharing your note',
                    'Sharing generates a unique link',
                    'View all saved notes anytime',
                    'Press Esc to close any modal',
                  ].map((tip, i) => (
                    <div key={i} className="tips-item" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <div className="tips-item-dot" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Saved notes count chip */}
                {savedNotes.length > 0 && (
                  <button
                    onClick={() => setShowSavedNotes(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-14px
                      border border-amber-200/50 bg-white/50 hover:bg-amber-50/80
                      transition-all duration-200 hover:border-amber-300/60
                      hover:shadow-sm text-left animate-fade-up delay-400"
                    style={{ borderRadius: '14px', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span className="text-sm text-stone-600 font-medium">
                      {savedNotes.length} saved {savedNotes.length === 1 ? 'note' : 'notes'}
                    </span>
                    <span className="text-xs text-amber-600 font-semibold tracking-wide">
                      View all →
                    </span>
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <SavedNotesModal
        notes={savedNotes}
        isOpen={showSavedNotes}
        onClose={() => setShowSavedNotes(false)}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
      />
    </>
  );
}

export default App;