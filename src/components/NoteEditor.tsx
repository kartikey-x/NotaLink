import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bold, Italic, List, Quote, Type, Save, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIPopover from './AIPopover';
import type { AIAction } from '../utils/aiActions';
import { transformText } from '../utils/aiService';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  readOnly?: boolean;
  hasUnsavedChanges?: boolean;
  isDarkMode?: boolean;
}

interface SelectionInfo {
  text: string;
  start: number;
  end: number;
  rect: { top: number; left: number };
}

/**
 * Get pixel coordinates for a caret position inside a textarea.
 * We create a hidden mirror div that replicates the textarea's text and styling,
 * insert a marker span at the selection point, and read its position.
 */
function getCaretCoordinates(
  textarea: HTMLTextAreaElement,
  selectionStart: number,
  selectionEnd: number
): { top: number; left: number } | null {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(textarea);

  // Copy all relevant styles using cssText-compatible properties
  const propertiesToCopy = [
    'font-family', 'font-size', 'font-weight', 'font-style',
    'letter-spacing', 'line-height', 'text-transform', 'word-spacing',
    'text-indent', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'box-sizing', 'width', 'overflow-wrap',
  ];

  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.overflow = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';

  propertiesToCopy.forEach((prop) => {
    mirror.style.setProperty(prop, computed.getPropertyValue(prop));
  });

 document.body.appendChild(mirror);

  const textContent = textarea.value;
  const beforeSelection = textContent.substring(0, selectionStart);
  const selectedText = textContent.substring(selectionStart, selectionEnd);

  // Create text nodes and marker
  const beforeNode = document.createTextNode(beforeSelection);
  const marker = document.createElement('span');
  marker.textContent = selectedText || '\u200b';
  marker.style.backgroundColor = 'transparent';

  mirror.appendChild(beforeNode);
  mirror.appendChild(marker);

  // Account for scroll
  mirror.scrollTop = textarea.scrollTop;
  mirror.scrollLeft = textarea.scrollLeft;

  const textareaRect = textarea.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();

  // Calculate position relative to viewport
  const top = textareaRect.top + (markerRect.top - mirrorRect.top) - textarea.scrollTop;
  const left = textareaRect.left + (markerRect.left - mirrorRect.left) - textarea.scrollLeft + (markerRect.width / 2);

  document.body.removeChild(mirror);

  // Sanity check: ensure popover appears near the textarea
  if (
    top < textareaRect.top - 60 ||
    top > textareaRect.bottom + 10 ||
    left < textareaRect.left - 20 ||
    left > textareaRect.right + 20
  ) {
    return {
      top: textareaRect.top - 10,
      left: textareaRect.left + textareaRect.width / 2,
    };
  }

  return { top: top - 10, left };
}

// Moved static definition out of render lifecycle
const TOOLBAR_ITEMS = [
  {
    icon: <Bold className="w-4 h-4" strokeWidth={1.5} />,
    action: 'bold',
    title: 'Bold (select text first)',
  },
  {
    icon: <Italic className="w-4 h-4" strokeWidth={1.5} />,
    action: 'italic',
    title: 'Italic (select text first)',
  },
  {
    icon: <Quote className="w-4 h-4" strokeWidth={1.5} />,
    action: 'quote',
    title: 'Quote',
  },
  {
    icon: <List className="w-4 h-4" strokeWidth={1.5} />,
    action: 'list',
    title: 'Bullet list',
  },
];

const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  onSave,
  readOnly = false,
  hasUnsavedChanges = false,
  isDarkMode = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo | null>(null);
  const [showAIPopover, setShowAIPopover] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiProcessingActionId, setAIProcessingActionId] = useState<string | null>(null);
  const [aiHighlightRange, setAIHighlightRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatText = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
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
    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPos = start + formattedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }, [content, onChange]);

  const handleSelect = useCallback(() => {
    if (readOnly || isAIProcessing) return;

    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current);
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end).trim();

    if (selectedText.length < 3 || start === end) {
      setShowAIPopover(false);
      setSelectionInfo(null);
      return;
    }

    popoverTimeoutRef.current = setTimeout(() => {
      const pos = getCaretCoordinates(textarea, start, end);
      if (pos) {
        setSelectionInfo({
          text: selectedText,
          start,
          end,
          rect: pos,
        });
        setShowAIPopover(true);
      }
    }, 250);
  }, [content, readOnly, isAIProcessing]);

  const handleAIAction = useCallback(
    async (action: AIAction) => {
      if (!selectionInfo || isAIProcessing) return;

      setIsAIProcessing(true);
      setAIProcessingActionId(action.id);
      setAIHighlightRange({ start: selectionInfo.start, end: selectionInfo.end });
      setShowAIPopover(false);

      try {
        const result = await transformText(selectionInfo.text, action);

        const before = content.substring(0, selectionInfo.start);
        const after = content.substring(selectionInfo.end);
        const newContent = before + result + after;
        onChange(newContent);

        setTimeout(() => {
          const textarea = textareaRef.current;
          if (textarea) {
            const newEnd = selectionInfo.start + result.length;
            textarea.focus();
            textarea.setSelectionRange(selectionInfo.start, newEnd);
          }
        }, 50);
      } catch (err) {
        console.error('AI transformation failed:', err);
      } finally {
        setIsAIProcessing(false);
        setAIProcessingActionId(null);
        setAIHighlightRange(null);
        setSelectionInfo(null);
      }
    },
    [selectionInfo, isAIProcessing, content, onChange]
  );

  // Hide popover on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isAIProcessing) {
        setShowAIPopover(false);
        setSelectionInfo(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isAIProcessing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (popoverTimeoutRef.current) {
        clearTimeout(popoverTimeoutRef.current);
      }
    };
  }, []);

  // Hide popover when content changes externally (e.g. from AI action)
  useEffect(() => {
    if (!isAIProcessing) {
      setShowAIPopover(false);
    }
  }, [content, isAIProcessing]);

  return (
    <div className="editor-wrap space-y-3">
      {/* AI Popover */}
      <AIPopover
        isVisible={showAIPopover && !!selectionInfo && !isAIProcessing}
        position={selectionInfo?.rect || { top: 0, left: 0 }}
        onAction={handleAIAction}
        isProcessing={isAIProcessing}
        processingActionId={aiProcessingActionId}
        isDarkMode={isDarkMode}
      />

      {/* Toolbar */}
      {!readOnly && (
        <motion.div
          className="toolbar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
        >
          <div className="flex items-center gap-0.5 flex-1 flex-wrap">
            {TOOLBAR_ITEMS.map(({ icon, action, title }) => (
              <motion.button
                key={action}
                onClick={() => formatText(action)}
                className="toolbar-btn"
                title={title}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {icon}
              </motion.button>
            ))}
          </div>

          <div className="toolbar-divider" />

          <div className="flex items-center gap-2 px-1">
            <motion.button
              onClick={onSave}
              className={`save-btn ${
                hasUnsavedChanges ? 'save-btn-active' : 'save-btn-inactive'
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              title={hasUnsavedChanges ? 'Save note' : 'Up to date'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden xs:inline">
                {hasUnsavedChanges ? 'Save' : 'Saved'}
              </span>
            </motion.button>

            <div
              className="char-count"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Type className="w-3 h-3" strokeWidth={1.5} />
              <span>{content.length.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Read-only badge */}
      {readOnly && (
        <motion.div
          className="readonly-badge"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Eye
            className="w-3.5 h-3.5 text-amber-600 flex-shrink-0"
            strokeWidth={1.5}
          />
          <span>Viewing shared note — read only</span>
        </motion.div>
      )}

      {/* Textarea wrapper */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          delay: 0.15,
        }}
      >
        <div
          className="relative"
          style={{
            transform: isFocused && !readOnly ? 'scale(1.003)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* AI processing overlay pulse */}
          <AnimatePresence>
            {isAIProcessing && aiHighlightRange && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: isDarkMode
                      ? 'rgba(217,119,6,0.04)'
                      : 'rgba(217,119,6,0.03)',
                    border: `2px solid ${
                      isDarkMode
                        ? 'rgba(217,119,6,0.3)'
                        : 'rgba(217,119,6,0.2)'
                    }`,
                  }}
                  animate={{
                    borderColor: isDarkMode
                      ? [
                          'rgba(217,119,6,0.3)',
                          'rgba(251,191,36,0.5)',
                          'rgba(217,119,6,0.3)',
                        ]
                      : [
                          'rgba(217,119,6,0.2)',
                          'rgba(251,191,36,0.4)',
                          'rgba(217,119,6,0.2)',
                        ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: isDarkMode
                      ? 'rgba(217,119,6,0.15)'
                      : 'rgba(217,119,6,0.1)',
                    border: `1px solid ${
                      isDarkMode
                        ? 'rgba(217,119,6,0.25)'
                        : 'rgba(217,119,6,0.2)'
                    }`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: isDarkMode ? '#fbbf24' : '#d97706',
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: isDarkMode ? '#fbbf24' : '#92400e',
                    }}
                  >
                    AI is working…
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            id="note-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              // Don't immediately hide popover on blur — user might be clicking it
            }}
            onSelect={handleSelect}
            onMouseUp={() => {
              // Small extra delay on mouseUp to let selection finalize
              setTimeout(() => handleSelect(), 50);
            }}
            onKeyUp={(e) => {
              // Also detect shift+arrow key selections
              if (e.shiftKey) {
                setTimeout(() => handleSelect(), 50);
              }
            }}
            readOnly={readOnly || isAIProcessing}
            placeholder={
              "Start writing your note here…\n\nSelect any text to use AI tools ✨\nUse **bold** or *italic* formatting\nCreate bullet points with •\nAdd block quotes with >"
            }
            className={`note-textarea ${readOnly ? 'note-textarea-readonly' : ''} ${
              isAIProcessing ? 'note-textarea-readonly' : ''
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            spellCheck={!readOnly}
            autoCapitalize="sentences"
          />

          {/* Focus indicator bar */}
          <AnimatePresence>
            {isFocused && !readOnly && !isAIProcessing && (
              <motion.div
                className="absolute bottom-0 left-1/2 h-[3px] rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #fbbf24, #d97706, #fbbf24)',
                  transform: 'translateX(-50%)',
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 48, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Corner word count watermark */}
          {!readOnly && content.length > 0 && (
            <div
              className="absolute bottom-3 right-4 text-[11px] select-none pointer-events-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: isDarkMode ? '#57534e' : '#c4b5a5',
              }}
            >
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          )}
        </div>
      </motion.div>

      {/* Empty hint */}
      <AnimatePresence>
        {content.trim() === '' && !readOnly && (
          <motion.div
            className="empty-hint"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            ✦ begin your note above · select text for AI magic ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(NoteEditor);