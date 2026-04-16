import React, { useState } from 'react';
import { Link2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  onShare: () => Promise<string | null>;
  disabled?: boolean;
  isLoading?: boolean;
  onShareSuccess?: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  disabled = false,
  isLoading = false,
  onShareSuccess,
}) => {
  const [isShared, setIsShared] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = async () => {
    const url = await onShare();
    if (url) {
      setShareUrl(url);
      setIsShared(true);
      if (onShareSuccess) {
        onShareSuccess();
      }
      setTimeout(() => setIsShared(false), 3000);
    }
  };

  const copyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const btnClass =
    disabled || isLoading
      ? 'share-btn share-btn-disabled'
      : isShared
      ? 'share-btn share-btn-success'
      : 'share-btn share-btn-active';

  return (
    <motion.div
      className="space-y-3"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.25 }}
    >
      {/* Main share button */}
      <motion.button
        onClick={handleShare}
        disabled={disabled || isLoading}
        className={btnClass}
        whileHover={
          !disabled && !isLoading
            ? { scale: 1.02, y: -2 }
            : {}
        }
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating link…</span>
            </motion.span>
          ) : isShared ? (
            <motion.span
              key="shared"
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </motion.span>
              <span>Link copied!</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link2 className="w-4 h-4" strokeWidth={1.5} />
              <span>
                {disabled ? 'Write something first' : 'Share Note'}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* URL display box */}
      <AnimatePresence>
        {shareUrl && (
          <motion.div
            className="share-url-box"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <p className="text-[11px] text-amber-700/60 font-semibold tracking-widest uppercase mb-1.5">
              Share link
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-amber-900 truncate font-mono flex-1 leading-relaxed">
                {shareUrl}
              </p>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={copyUrl}
                  className="copy-btn"
                  title="Copy link"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.span
                        key="copied"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 15,
                        }}
                      >
                        <Check
                          className="w-3.5 h-3.5 text-emerald-500"
                          strokeWidth={2.5}
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="copy-btn"
                  title="Open in new tab"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer note */}
      <p className="text-[11px] text-stone-400 text-center tracking-wide">
        Anyone with the link can view this note
      </p>
    </motion.div>
  );
};

export default ShareButton;