import { useState, useEffect } from 'react';
import Header from './components/Header';
import NoteEditor from './components/NoteEditor';
import ShareButton from './components/ShareButton';
import ChatBot from './components/ChatBot';
import SavedNotesModal from './components/SavedNotesModal';
import { loadNote, saveNote, generateNoteId, getAllNotes, deleteNote } from './utils/noteStorage';

function App() {
  const [noteContent, setNoteContent] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(getAllNotes());

  useEffect(() => {
    // Check if we're loading a shared note from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedNoteId = urlParams.get('note');
    
    if (sharedNoteId) {
      const sharedNote = loadNote(sharedNoteId);
      if (sharedNote) {
        setNoteContent(sharedNote.content);
        setNoteId(sharedNoteId);
        setIsShared(true);
      }
    } else {
      // Load or create a new note
      const currentNoteId = generateNoteId();
      setNoteId(currentNoteId);
      const existingNote = loadNote(currentNoteId);
      if (existingNote) {
        setNoteContent(existingNote.content);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleNoteChange = (content: string) => {
    setNoteContent(content);
    setHasUnsavedChanges(true);
  };

  const handleSaveNote = () => {
    if (noteId && noteContent.trim()) {
      saveNote(noteId, noteContent);
      setHasUnsavedChanges(false);
      setSavedNotes(getAllNotes());
    }
  };

  const handleShare = () => {
    if (noteId && noteContent.trim()) {
      saveNote(noteId, noteContent);
      setHasUnsavedChanges(false);
      setSavedNotes(getAllNotes());
      const shareUrl = `${window.location.origin}${window.location.pathname}?note=${noteId}`;
      navigator.clipboard.writeText(shareUrl);
      return shareUrl;
    }
    return null;
  };

  const handleSelectNote = (selectedNoteId: string) => {
    const note = loadNote(selectedNoteId);
    if (note) {
      setNoteContent(note.content);
      setNoteId(selectedNoteId);
      setIsShared(false);
      setHasUnsavedChanges(false);
      // Update URL without the shared note parameter
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleDeleteNote = (noteIdToDelete: string) => {
    deleteNote(noteIdToDelete);
    setSavedNotes(getAllNotes());
    
    // If we're currently viewing the deleted note, create a new one
    if (noteId === noteIdToDelete) {
      const newNoteId = generateNoteId();
      setNoteId(newNoteId);
      setNoteContent('');
      setIsShared(false);
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
        <Header onViewSavedNotes={() => setShowSavedNotes(true)} />
        
        <main className="mt-8 space-y-6">
          {isShared && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 font-medium">Viewing shared note</span>
              </div>
            </div>
          )}
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <NoteEditor
                content={noteContent}
                onChange={handleNoteChange}
                onSave={handleSaveNote}
                readOnly={isShared}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
            
            <div className="space-y-4">
              <ShareButton onShare={handleShare} disabled={!noteContent.trim()} />
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-gray-300 mb-2">Quick Tips</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Click save to store your notes</li>
                  <li>• Click share to generate a link</li>
                  <li>• Use the AI bot for writing help</li>
                  <li>• View saved notes anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <ChatBot />
      
      <SavedNotesModal
        isOpen={showSavedNotes}
        onClose={() => setShowSavedNotes(false)}
        notes={savedNotes}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;