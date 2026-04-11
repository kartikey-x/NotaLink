import React from 'react';
import { X, Clock, Trash2, BookOpen } from 'lucide-react';
import type { Note } from '../utils/noteStorage';

interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen, onClose, notes, onSelectNote, onDeleteNote
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  const getPreview = (content: string) =>
    content.length > 120 ? content.substring(0, 120) + '…' : content;

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#fdf8f2] rounded-2xl border border-amber-200 shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
            <h2
              className="text-lg font-semibold text-stone-800"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Saved Notes
            </h2>
            <span className="text-sm text-stone-400">({notes.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-stone-500 mb-1">Nothing here yet</h3>
              <p className="text-sm text-stone-400">Start writing and save your first note</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="group relative bg-white hover:bg-amber-50/60 rounded-xl px-4 py-3.5 border border-stone-100 hover:border-amber-200 transition-all duration-150 cursor-pointer"
                  onClick={() => { onSelectNote(note.id); onClose(); }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Clock className="w-3 h-3 text-stone-300 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs text-stone-400">{formatDate(note.updatedAt)}</span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-stone-300">{note.content.length} chars</span>
                      </div>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {getPreview(note.content) || <span className="italic text-stone-300">Empty note</span>}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 transition-all text-stone-300 hover:text-red-400 flex-shrink-0"
                      title="Delete"
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
        <div className="px-6 py-4 border-t border-amber-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">Click any note to open it</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedNotesModal;
