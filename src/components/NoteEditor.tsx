import React, { useState } from 'react';
import { Bold, Italic, List, Quote, Type, Save, Eye } from 'lucide-react';

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
  hasUnsavedChanges = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatText = (format: string) => {
    const textarea = document.getElementById('note-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = selectedText;
    switch (format) {
      case 'bold':   formattedText = `**${selectedText}**`; break;
      case 'italic': formattedText = `*${selectedText}*`;   break;
      case 'quote':  formattedText = `> ${selectedText}`;   break;
      case 'list':   formattedText = `• ${selectedText}`;   break;
    }
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
    // Restore focus + cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + formattedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const toolbarItems = [
    { icon: <Bold   className="w-4 h-4" strokeWidth={1.5} />, action: 'bold',   title: 'Bold (select text first)'   },
    { icon: <Italic className="w-4 h-4" strokeWidth={1.5} />, action: 'italic', title: 'Italic (select text first)' },
    { icon: <Quote  className="w-4 h-4" strokeWidth={1.5} />, action: 'quote',  title: 'Quote'                      },
    { icon: <List   className="w-4 h-4" strokeWidth={1.5} />, action: 'list',   title: 'Bullet list'                },
  ];

  return (
    <div className="editor-wrap space-y-3 animate-fade-up delay-200">

      {/* Toolbar */}
      {!readOnly && (
        <div className="toolbar animate-slide-down delay-150">
          {/* Format buttons */}
          <div className="flex items-center gap-0.5 flex-1 flex-wrap">
            {toolbarItems.map(({ icon, action, title }) => (
              <button
                key={action}
                onClick={() => formatText(action)}
                className="toolbar-btn"
                title={title}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="toolbar-divider" />

          {/* Save + char count */}
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={onSave}
              className={`save-btn ${hasUnsavedChanges ? 'save-btn-active' : 'save-btn-inactive'}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              title={hasUnsavedChanges ? 'Save note' : 'Up to date'}
            >
              <Save className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden xs:inline">{hasUnsavedChanges ? 'Save' : 'Saved'}</span>
            </button>

            <div className="char-count" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Type className="w-3 h-3" strokeWidth={1.5} />
              <span>{content.length.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Read-only badge */}
      {readOnly && (
        <div
          className="readonly-badge animate-slide-down"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Eye className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" strokeWidth={1.5} />
          <span>Viewing shared note — read only</span>
        </div>
      )}

      {/* Textarea wrapper */}
      <div
        className="relative transition-transform duration-200"
        style={{ transform: isFocused && !readOnly ? 'scale(1.003)' : 'scale(1)' }}
      >
        <textarea
          id="note-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={"Start writing your note here…\n\nUse **bold** or *italic* formatting\nCreate bullet points with •\nAdd block quotes with >"}
          className={`note-textarea ${readOnly ? 'note-textarea-readonly' : ''}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          spellCheck={!readOnly}
          autoCapitalize="sentences"
        />

        {/* Focus indicator bar */}
        {isFocused && !readOnly && (
          <div className="focus-bar" />
        )}

        {/* Corner word count watermark */}
        {!readOnly && content.length > 0 && (
          <div
            className="absolute bottom-3 right-4 text-[11px] text-stone-300 select-none pointer-events-none"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </div>

      {/* Empty hint */}
      {content.trim() === '' && !readOnly && (
        <div className="empty-hint" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          ✦ begin your note above ✦
        </div>
      )}
    </div>
  );
};

export default NoteEditor;