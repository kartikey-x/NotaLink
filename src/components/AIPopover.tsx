import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { AIAction } from '../utils/aiActions';
import { AI_ACTIONS } from '../constants/aiActions';

interface AIPopoverProps {
  isVisible: boolean;
  position: { top: number; left: number };
  onAction: (action: AIAction) => void;
  isProcessing: boolean;
  processingActionId: string | null;
  isDarkMode: boolean;
}

const AIPopover: React.FC<AIPopoverProps> = ({
  isVisible,
  position,
  onAction,
  isProcessing,
  processingActionId,
  isDarkMode,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-[90] flex items-center"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 600,
            damping: 28,
            mass: 0.6,
          }}
        >
          <div
            className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl border shadow-xl"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #292524 0%, #1c1917 100%)'
                : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              borderColor: isDarkMode
                ? 'rgba(168,162,158,0.2)'
                : 'rgba(217,119,6,0.25)',
              boxShadow: isDarkMode
                ? '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)'
                : '0 8px 32px rgba(217,119,6,0.15), 0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            {AI_ACTIONS.map((action) => {
              const isThisProcessing = isProcessing && processingActionId === action.id;
              return (
                <motion.button
                  key={action.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isProcessing) onAction(action);
                  }}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-100 whitespace-nowrap"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: isThisProcessing
                      ? isDarkMode
                        ? 'rgba(217,119,6,0.2)'
                        : 'rgba(217,119,6,0.12)'
                      : 'transparent',
                    color: isProcessing && !isThisProcessing
                      ? isDarkMode
                        ? '#57534e'
                        : '#c4b5a5'
                      : isDarkMode
                      ? '#fbbf24'
                      : '#92400e',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    opacity: isProcessing && !isThisProcessing ? 0.5 : 1,
                  }}
                  whileHover={
                    !isProcessing
                      ? {
                          backgroundColor: isDarkMode
                            ? 'rgba(217,119,6,0.15)'
                            : 'rgba(217,119,6,0.1)',
                        }
                      : {}
                  }
                  whileTap={!isProcessing ? { scale: 0.95 } : {}}
                >
                  {isThisProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    action.icon
                  )}
                  <span>{isThisProcessing ? 'Working…' : action.label}</span>
                </motion.button>
              );
            })}

            {/* Arrow pointing down */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-3 h-3 rotate-45 border-r border-b"
              style={{
                background: isDarkMode ? '#1c1917' : '#fef3c7',
                borderColor: isDarkMode
                  ? 'rgba(168,162,158,0.2)'
                  : 'rgba(217,119,6,0.25)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIPopover;