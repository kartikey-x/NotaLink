import { useState, useEffect } from 'react';
import type { Note } from './utils/noteStorage';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ShareButton from './components/ShareButton';
import SavedNotesModal from './components/SavedNotesModal';
import { loadNote, saveNote, generateNoteId, getAllNotes, deleteNote } from './utils/noteStorage';
import { FilePlus2 } from 'lucide-react';

function App() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>(getAllNotes());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedNoteId = urlParams.get('note');
    
    if (sharedNoteId) {
      const sharedNote = loadNote(sharedNoteId);
      if (sharedNote) {
        setCurrentNote({ id: sharedNoteId, content: sharedNote.content, createdAt: sharedNote.createdAt, updatedAt: sharedNote.updatedAt });
      }
    }
    
    setIsLoading(false);
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
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to create a new note?")) {
      return;
    }
    setCurrentNote({ id: generateNoteId(), content: '', createdAt: new Date(), updatedAt: new Date() });
    setHasUnsavedChanges(false);
    setShowSavedNotes(false);
  };

  const handleShare = () => {
    if (currentNote && currentNote.content.trim()) {
      saveNote(currentNote.id, currentNote.content);
      setHasUnsavedChanges(false);
      setSavedNotes(getAllNotes());
      const shareUrl = `${window.location.origin}${window.location.pathname}?note=${currentNote.id}`;
      navigator.clipboard.writeText(shareUrl);
      return shareUrl;
    }
    return null;
  };

  const handleSelectNote = (selectedNoteId: string) => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to switch notes?")) {
      return;
    }
    const note = loadNote(selectedNoteId);
    if (note) {
      setCurrentNote({ id: selectedNoteId, content: note.content, createdAt: note.createdAt, updatedAt: note.updatedAt });
      setHasUnsavedChanges(false);
      setShowSavedNotes(false);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-purple-400 text-xl font-semibold">Loading NotaLink...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          onViewSavedNotes={() => setShowSavedNotes(true)}
          onNewNote={handleNewNote} 
        />
        
        <main className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {currentNote ? (
                <NoteEditor
                  key={currentNote.id}
                  content={currentNote.content}
                  onChange={handleNoteChange}
                  onSave={handleSaveNote}
                  readOnly={false}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : (
                // --- THIS SECTION HAS BEEN REVERTED TO ITS ORIGINAL STATE ---
                <div className="text-center h-96 flex flex-col justify-center items-center bg-white/5 rounded-xl border-2 border-dashed border-white/10">
                  <FilePlus2 className="w-16 h-16 text-gray-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-300">No note selected</h2>
                  <p className="text-gray-400">Select a note from your saved list or create a new one.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <ShareButton onShare={handleShare} disabled={!currentNote || !currentNote.content.trim()} />
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-gray-300 mb-2">Quick Tips</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Click "New Note" in the header</li>
                  <li>• Click save to store your notes</li>
                  <li>• Click share to generate a link</li>
                  <li>• View saved notes anytime</li>
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
  );
}

export default App;