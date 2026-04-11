import React, { useState } from 'react';
import { Link2, Copy, Check, Loader2 } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => Promise<string | null>;
  disabled?: boolean;
  isLoading?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onShare, disabled = false, isLoading = false }) => {
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = async () => {
    const url = await onShare();
    if (url) {
      setShareUrl(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 3000);
    }
  };

  const copyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="space-y-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <button
        onClick={handleShare}
        disabled={disabled || isLoading}
        className={`
          w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
          ${disabled || isLoading
            ? 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed'
            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg active:scale-95 border border-amber-700'
          }
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating link…</span>
            </>
          ) : isShared ? (
            <>
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>Link copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" strokeWidth={1.5} />
              <span>{disabled ? 'Write something first' : 'Share Note'}</span>
            </>
          )}
        </div>
      </button>

      {shareUrl && (
        <div className="rounded-lg p-3 border border-amber-200 bg-amber-50">
          <p className="text-xs text-stone-400 mb-1">Share link</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-amber-800 truncate font-mono flex-1">{shareUrl}</p>
            <button
              onClick={copyUrl}
              className="p-1.5 rounded-md hover:bg-amber-200/60 transition-colors text-stone-400 hover:text-stone-700 flex-shrink-0"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-stone-400 text-center">Anyone with the link can view this note</p>
    </div>
  );
};

export default ShareButton;
