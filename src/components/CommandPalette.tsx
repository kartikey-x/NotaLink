import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FilePlus2,
  Moon,
  Sun,
  FileText,
  Command,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { Note } from '../utils/noteStorage';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewNote: () => void;
  onSelectNote: (noteId: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  savedNotes: Note[];
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'action' | 'note';
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNewNote,
  onSelectNote,
  onToggleTheme,
  isDarkMode,
  savedNotes,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getTitle = (content: string) => {
    const firstLine = content.trim().split('\n')[0] || 'Untitled Note';
    return firstLine.length > 60 ? firstLine.substring(0, 60) + '…' : firstLine;
  };

  const getPreview = (content: string) => {
    const lines = content.trim().split('\n');
    const preview = lines.slice(1).join(' ').trim();
    if (!preview) return 'No additional content';
    return preview.length > 80 ? preview.substring(0, 80) + '…' : preview;
  };

  const buildCommands = useCallback((): CommandItem[] => {
    const actions: CommandItem[] = [
      {
        id: 'new-note',
        label: 'New Note',
        description: 'Create a blank note',
        icon: <FilePlus2 className="w-4 h-4" strokeWidth={1.5} />,
        action: () => {
          onNewNote();
          onClose();
        },
        category: 'action',
      },
      {
        id: 'toggle-theme',
        label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        description: 'Toggle appearance',
        icon: isDarkMode ? (
          <Sun className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Moon className="w-4 h-4" strokeWidth={1.5} />
        ),
        action: () => {
          onToggleTheme();
          onClose();
        },
        category: 'action',
      },
    ];

    const noteItems: CommandItem[] = savedNotes.map((note) => ({
      id: `note-${note.id}`,
      label: getTitle(note.content),
      description: getPreview(note.content),
      icon: <FileText className="w-4 h-4" strokeWidth={1.5} />,
      action: () => {
        onSelectNote(note.id);
        onClose();
      },
      category: 'note' as const,
    }));

    return [...actions, ...noteItems];
  }, [isDarkMode, savedNotes, onNewNote, onSelectNote, onToggleTheme, onClose]);

  const allCommands = buildCommands();

  const filtered = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          (cmd.description && cmd.description.toLowerCase().includes(query.toLowerCase()))
      )
    : allCommands;

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-command-item]');
    const selected = items[selectedIndex];
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filtered, selectedIndex, onClose]);

  const actionItems = filtered.filter((c) => c.category === 'action');
  const noteItems = filtered.filter((c) => c.category === 'note');

  // Compute global index for a given category item
  const getGlobalIndex = (category: 'action' | 'note', localIndex: number) => {
    if (category === 'action') return localIndex;
    return actionItems.length + localIndex;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(160deg, #1c1917 0%, #292524 100%)'
                : 'linear-gradient(160deg, #fdfbf7 0%, #fef9f0 100%)',
              borderColor: isDarkMode
                ? 'rgba(168,162,158,0.15)'
                : 'rgba(217,119,6,0.2)',
              boxShadow: isDarkMode
                ? '0 25px 80px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)'
                : '0 25px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(217,119,6,0.1)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.8,
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 border-b"
              style={{
                borderColor: isDarkMode
                  ? 'rgba(168,162,158,0.1)'
                  : 'rgba(217,119,6,0.12)',
              }}
            >
              <Search
                className="w-5 h-5 flex-shrink-0"
                strokeWidth={1.5}
                style={{ color: isDarkMode ? '#a8a29e' : '#92400e' }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search notes…"
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:font-normal"
                style={{
                  color: isDarkMode ? '#fafaf9' : '#292524',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd
                className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase"
                style={{
                  background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? '#78716c' : '#a8a29e',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[50vh] overflow-y-auto py-2 px-2"
              style={{ scrollbarWidth: 'thin' }}
            >
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: isDarkMode ? '#78716c' : '#a8a29e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    No results found for "{query}"
                  </p>
                </div>
              )}

              {/* Action commands */}
              {actionItems.length > 0 && (
                <div className="mb-1">
                  <p
                    className="px-2.5 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{
                      color: isDarkMode ? '#57534e' : '#a8a29e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Actions
                  </p>
                  {actionItems.map((cmd, i) => {
                    const globalIdx = getGlobalIndex('action', i);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <motion.button
                        key={cmd.id}
                        data-command-item
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-75"
                        style={{
                          background: isSelected
                            ? isDarkMode
                              ? 'rgba(217,119,6,0.12)'
                              : 'rgba(217,119,6,0.08)'
                            : 'transparent',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected
                              ? isDarkMode
                                ? 'rgba(217,119,6,0.2)'
                                : 'rgba(217,119,6,0.12)'
                              : isDarkMode
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.04)',
                            color: isSelected
                              ? isDarkMode
                                ? '#fbbf24'
                                : '#d97706'
                              : isDarkMode
                              ? '#a8a29e'
                              : '#78716c',
                          }}
                        >
                          {cmd.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            style={{
                              color: isSelected
                                ? isDarkMode
                                  ? '#fafaf9'
                                  : '#292524'
                                : isDarkMode
                                ? '#d6d3d1'
                                : '#57534e',
                            }}
                          >
                            {cmd.label}
                          </p>
                          {cmd.description && (
                            <p
                              className="text-xs truncate mt-0.5"
                              style={{
                                color: isDarkMode ? '#78716c' : '#a8a29e',
                              }}
                            >
                              {cmd.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <CornerDownLeft
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{
                              color: isDarkMode ? '#78716c' : '#a8a29e',
                            }}
                            strokeWidth={1.5}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Note results */}
              {noteItems.length > 0 && (
                <div className="mb-1">
                  <p
                    className="px-2.5 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase"
                    style={{
                      color: isDarkMode ? '#57534e' : '#a8a29e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Notes ({noteItems.length})
                  </p>
                  {noteItems.map((cmd, i) => {
                    const globalIdx = getGlobalIndex('note', i);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <motion.button
                        key={cmd.id}
                        data-command-item
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-75"
                        style={{
                          background: isSelected
                            ? isDarkMode
                              ? 'rgba(217,119,6,0.12)'
                              : 'rgba(217,119,6,0.08)'
                            : 'transparent',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected
                              ? isDarkMode
                                ? 'rgba(217,119,6,0.2)'
                                : 'rgba(217,119,6,0.12)'
                              : isDarkMode
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.04)',
                            color: isSelected
                              ? isDarkMode
                                ? '#fbbf24'
                                : '#d97706'
                              : isDarkMode
                              ? '#a8a29e'
                              : '#78716c',
                          }}
                        >
                          {cmd.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            style={{
                              color: isSelected
                                ? isDarkMode
                                  ? '#fafaf9'
                                  : '#292524'
                                : isDarkMode
                                ? '#d6d3d1'
                                : '#57534e',
                            }}
                          >
                            {cmd.label}
                          </p>
                          {cmd.description && (
                            <p
                              className="text-xs truncate mt-0.5"
                              style={{
                                color: isDarkMode ? '#78716c' : '#a8a29e',
                              }}
                            >
                              {cmd.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <CornerDownLeft
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{
                              color: isDarkMode ? '#78716c' : '#a8a29e',
                            }}
                            strokeWidth={1.5}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-t"
              style={{
                borderColor: isDarkMode
                  ? 'rgba(168,162,158,0.1)'
                  : 'rgba(217,119,6,0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd
                    className="flex items-center justify-center w-5 h-5 rounded"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      color: isDarkMode ? '#78716c' : '#a8a29e',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </kbd>
                  <kbd
                    className="flex items-center justify-center w-5 h-5 rounded"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      color: isDarkMode ? '#78716c' : '#a8a29e',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </kbd>
                  <span
                    className="text-[10px] ml-1"
                    style={{
                      color: isDarkMode ? '#57534e' : '#a8a29e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Navigate
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd
                    className="flex items-center justify-center px-1.5 h-5 rounded text-[10px] font-semibold"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      color: isDarkMode ? '#78716c' : '#a8a29e',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    ↵
                  </kbd>
                  <span
                    className="text-[10px] ml-1"
                    style={{
                      color: isDarkMode ? '#57534e' : '#a8a29e',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Select
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Command
                  className="w-3 h-3"
                  style={{ color: isDarkMode ? '#57534e' : '#c4b5a5' }}
                  strokeWidth={1.5}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: isDarkMode ? '#57534e' : '#c4b5a5',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  NotaLink
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(CommandPalette);