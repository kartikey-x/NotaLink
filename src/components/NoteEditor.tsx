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
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'list':
        formattedText = `• ${selectedText}`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
  };

  return (
    <div className="space-y-4">
      {/* Formatting Toolbar */}
      {!readOnly && (
        <div className="flex items-center space-x-2 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="flex items-center space-x-1 flex-1">
            <button
              onClick={() => formatText('bold')}
              className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('quote')}
              className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('list')}
              className="p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-4 w-px bg-white/20"></div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onSave}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200
                ${hasUnsavedChanges 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-400'
                }
              `}
              title="Save note"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">
                {hasUnsavedChanges ? 'Save' : 'Saved'}
              </span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Type className="w-4 h-4" />
            <span>{content.length} characters</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Editor */}
      <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
        <textarea
          id="note-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          placeholder={readOnly ? "This note is read-only" : "Start writing your note here...\n\nUse **bold** or *italic* text\nCreate lists with •\nAdd quotes with >"}
          className={`
            w-full h-96 p-6 rounded-xl resize-none
            bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm
            border-2 transition-all duration-200
            ${isFocused 
              ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' 
              : 'border-white/10 hover:border-white/20'
            }
            placeholder-gray-500
            focus:outline-none
            ${readOnly ? 'cursor-default' : 'cursor-text'}
            ${readOnly ? 'text-white' : 'text-black'}
          `}
        />
        
        {isFocused && !readOnly && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-purple-500 h-1 w-16 rounded-full opacity-60"></div>
          </div>
        )}
      </div>
      
      {content.trim() === '' && !readOnly && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Start typing to create your first note</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;