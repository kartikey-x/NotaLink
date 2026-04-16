export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_PREFIX = 'notalink_note_';

export const generateNoteId = (): string => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const saveNote = (noteId: string, content: string): void => {
  const existingNote = loadNote(noteId);
  const note: Note = {
    id: noteId,
    content,
    createdAt: existingNote ? existingNote.createdAt : new Date(),
    updatedAt: new Date()
  };
  localStorage.setItem(STORAGE_PREFIX + noteId, JSON.stringify(note));
};

export const loadNote = (noteId: string): Note | null => {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + noteId);
    if (!stored) return null;
    const note = JSON.parse(stored);
    return { ...note, createdAt: new Date(note.createdAt), updatedAt: new Date(note.updatedAt) };
  } catch { return null; }
};

export const deleteNote = (noteId: string): boolean => {
  localStorage.removeItem(STORAGE_PREFIX + noteId);
  return true;
};

export const getAllNotes = (): Note[] => {
  const notes: Note[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const note = loadNote(key.replace(STORAGE_PREFIX, ''));
      if (note) notes.push(note);
    }
  }
  return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};