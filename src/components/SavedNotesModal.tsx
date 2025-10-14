import React from 'react';
import { X, Clock, Trash2, FileText } from 'lucide-react';
import type { Note } from '../utils/noteStorage';


interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onSelectNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectNote,
  onDeleteNote
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Saved Notes</h2>
            <span className="text-sm text-gray-400">({notes.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No saved notes yet</h3>
              <p className="text-gray-500">Start writing and save your first note!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    onSelectNote(note.id);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-400">
                          {formatDate(note.updatedAt)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {note.content.length} chars
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {getPreview(note.content) || 'Empty note'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-400 ml-2"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Click any note to open it</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedNotesModal;