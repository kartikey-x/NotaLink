// Utility functions for handling note storage and management

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_PREFIX = 'notalink_note_';

export const generateNoteId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const saveNote = (noteId: string, content: string): void => {
  const note: Note = {
    id: noteId,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Check if note already exists to preserve creation date
  const existingNote = loadNote(noteId);
  if (existingNote) {
    note.createdAt = existingNote.createdAt;
  }
  
  localStorage.setItem(STORAGE_PREFIX + noteId, JSON.stringify(note));
};

export const loadNote = (noteId: string): Note | null => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + noteId);
    if (!stored) return null;
    
    const note = JSON.parse(stored);
    // Convert date strings back to Date objects
    note.createdAt = new Date(note.createdAt);
    note.updatedAt = new Date(note.updatedAt);
    
    return note;
  } catch (error) {
    console.error('Error loading note:', error);
    return null;
  }
};

export const deleteNote = (noteId: string): boolean => {
  try {
    localStorage.removeItem(STORAGE_PREFIX + noteId);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};

export const getAllNotes = (): Note[] => {
  const notes: Note[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const note = loadNote(key.replace(STORAGE_PREFIX, ''));
      if (note) {
        notes.push(note);
      }
    }
  }
  
  // Sort by most recently updated
  return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};