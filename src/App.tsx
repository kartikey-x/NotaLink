import { useState, useEffect } from 'react';
import type { Note } from './utils/noteStorage';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ShareButton from './components/ShareButton';
import SavedNotesModal from './components/SavedNotesModal';
import { loadNote, saveNote, generateNoteId, getAllNotes, deleteNote } from './utils/noteStorage';
import { saveNoteToCloud, loadNoteFromCloud } from './utils/supabase';
import { Feather } from 'lucide-react';

function App() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>(getAllNotes());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#note=(.+)$/);
    const sharedId = match ? match[1] : null;

    if (sharedId) {
      loadNoteFromCloud(sharedId).then((content) => {
        if (content !== null) {
          setCurrentNote({ id: generateNoteId(), content, createdAt: new Date(), updatedAt: new Date() });
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
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to create a new note?")) return;
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
    navigator.clipboard.writeText(shareUrl);
    return shareUrl;
  };

  const handleSelectNote = (selectedNoteId: string) => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to switch notes?")) return;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f2] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-amber-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Feather className="w-5 h-5 animate-pulse" strokeWidth={1.5} />
          <span className="text-sm">Loading NotaLink…</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div
        className="min-h-screen text-stone-800"
        style={{
          background: 'linear-gradient(160deg, #fdf8f2 0%, #fef3e2 40%, #fdf6ee 100%)',
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23000'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23fff'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23fff'/%3E%3C/svg%3E\")" }}
        ></div>

        <div className="relative container mx-auto px-4 py-8 max-w-4xl">
          <Header onViewSavedNotes={() => setShowSavedNotes(true)} onNewNote={handleNewNote} />

          <main className="mt-8">
            <div className="grid gap-6 lg:grid-cols-3">
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
                  <div className="h-96 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <Feather className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-lg font-semibold text-stone-600 mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      No note open
                    </h2>
                    <p className="text-sm text-stone-400">Select a saved note or create a new one</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <ShareButton
                  onShare={handleShare}
                  disabled={!currentNote || !currentNote.content.trim()}
                  isLoading={isSharing}
                />

                <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
                  <h3 className="text-sm font-semibold text-stone-600 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Quick Tips
                  </h3>
                  <ul className="space-y-1.5 text-xs text-stone-400">
                    <li>→ Click "New Note" to start writing</li>
                    <li>→ Save your note before sharing</li>
                    <li>→ Share generates a link anyone can open</li>
                    <li>→ View all saved notes anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>

        <SavedNotesModal
          notes={savedNotes}
          isOpen={showSavedNotes}
          onClose={() => setShowSavedNotes(false)}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </>
  );
}

export default App;
