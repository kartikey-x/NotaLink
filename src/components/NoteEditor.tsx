import React, { useState } from 'react';
import { Bold, Italic, List, Quote, Type, Save } from 'lucide-react';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  readOnly?: boolean;
  hasUnsavedChanges?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  onSave,
  readOnly = false,
  hasUnsavedChanges = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatText = (format: string) => {
    const textarea = document.getElementById('note-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = selectedText;
    switch (format) {
      case 'bold': formattedText = `**${selectedText}**`; break;
      case 'italic': formattedText = `*${selectedText}*`; break;
      case 'quote': formattedText = `> ${selectedText}`; break;
      case 'list': formattedText = `• ${selectedText}`; break;
    }
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {!readOnly && (
        <div
          className="flex items-center space-x-1 p-2 rounded-lg border border-amber-200/60 bg-amber-50/80"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex items-center space-x-1 flex-1">
            {[
              { icon: <Bold className="w-4 h-4" strokeWidth={1.5} />, action: 'bold', title: 'Bold' },
              { icon: <Italic className="w-4 h-4" strokeWidth={1.5} />, action: 'italic', title: 'Italic' },
              { icon: <Quote className="w-4 h-4" strokeWidth={1.5} />, action: 'quote', title: 'Quote' },
              { icon: <List className="w-4 h-4" strokeWidth={1.5} />, action: 'list', title: 'List' },
            ].map(({ icon, action, title }) => (
              <button
                key={action}
                onClick={() => formatText(action)}
                className="p-2 rounded-md hover:bg-amber-200/60 transition-colors text-stone-500 hover:text-stone-700"
                title={title}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-amber-200"></div>

          <div className="flex items-center space-x-3 px-1">
            <button
              onClick={onSave}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 font-medium
                ${hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
            >
              <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{hasUnsavedChanges ? 'Save' : 'Saved'}</span>
            </button>

            <div className="flex items-center space-x-1 text-xs text-stone-400">
              <Type className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{content.length} chars</span>
            </div>
          </div>
        </div>
      )}

      {/* Read-only badge */}
      {readOnly && (
        <div
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span>👁</span>
          <span>Viewing shared note — read only</span>
        </div>
      )}

      {/* Textarea */}
      <div className={`relative transition-all duration-200 ${isFocused && !readOnly ? 'scale-[1.005]' : ''}`}>
        <textarea
          id="note-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={"Start writing your note here...\n\nUse **bold** or *italic* text\nCreate lists with •\nAdd quotes with >"}
          className={`
            w-full h-96 p-6 rounded-xl resize-none text-sm leading-relaxed
            border-2 transition-all duration-200 focus:outline-none
            ${readOnly
              ? 'bg-stone-50 text-stone-700 border-stone-200 cursor-default'
              : isFocused
                ? 'bg-white text-stone-800 border-amber-300 shadow-md shadow-amber-100'
                : 'bg-amber-50/40 text-stone-800 border-amber-200/60 hover:border-amber-300 cursor-text'
            }
            placeholder-stone-300
          `}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {isFocused && !readOnly && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full bg-amber-400 opacity-70"></div>
        )}
      </div>

      {content.trim() === '' && !readOnly && (
        <div className="text-center py-4">
          <span className="text-xs text-stone-400 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ✦ begin your note above
          </span>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
