import React, { useEffect, useRef } from 'react';
import { X, Clock, Trash2, BookOpen, FileText } from 'lucide-react';
import type { Note } from '../utils/noteStorage';

interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen, onClose, notes, onSelectNote, onDeleteNote,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date);

  const getPreview = (content: string) =>
    content.length > 130 ? content.substring(0, 130) + '…' : content;

  const getTitle = (content: string) => {
    const firstLine = content.trim().split('\n')[0] || '';
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '…' : firstLine;
  };

  return (
    <div
      className="modal-backdrop animate-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Saved Notes"
    >
      <div
        ref={panelRef}
        className="modal-panel"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center border border-amber-200/60">
              <BookOpen className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
            </div>
            <div>
              <h2
                className="text-base font-bold text-stone-800 leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Saved Notes
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {notes.length === 0
                  ? 'No notes yet'
                  : `${notes.length} note${notes.length !== 1 ? 's' : ''} saved locally`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close (Esc)"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notes list */}
        <div className="modal-notes-list">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-4 border border-amber-200/50">
                <FileText className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              </div>
              <h3
                className="text-base font-semibold text-stone-500 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Nothing here yet
              </h3>
              <p className="text-sm text-stone-400">Start writing and save your first note</p>
            </div>
          ) : (
            <div>
              {notes.map((note, i) => (
                <div
                  key={note.id}
                  className="note-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => { onSelectNote(note.id); onClose(); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onSelectNote(note.id); onClose(); } }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title line */}
                      {getTitle(note.content) && (
                        <p
                          className="text-sm font-semibold text-stone-700 mb-1 truncate"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {getTitle(note.content)}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="w-3 h-3 text-stone-300 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs text-stone-400">{formatDate(note.updatedAt)}</span>
                        <span className="text-stone-200">·</span>
                        <span className="text-xs text-stone-300">
                          {note.content.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>

                      {/* Preview */}
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {getPreview(note.content) || (
                          <span className="italic text-stone-300">Empty note</span>
                        )}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                      className="note-card-delete"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <span className="text-xs text-stone-400">
            {notes.length > 0 ? 'Click any note to open · Hover to delete' : ''}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-10px bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors rounded-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedNotesModal;