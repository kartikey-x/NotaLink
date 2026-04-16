import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  onDismiss?: () => void;
  visible: boolean;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message, onDismiss, visible }) => {
  if (!visible) return null;

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl"
      style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        borderColor: 'rgba(5,150,105,0.25)',
        boxShadow: '0 8px 32px rgba(5,150,105,0.15), 0 2px 8px rgba(0,0,0,0.06)',
        fontFamily: "'DM Sans', sans-serif",
        minWidth: '280px',
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.div
        className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.15 }}
      >
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      </motion.div>
      <p className="text-sm font-semibold text-emerald-800 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-md hover:bg-emerald-100 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
        </button>
      )}
    </motion.div>
  );
};

export default SuccessToast;