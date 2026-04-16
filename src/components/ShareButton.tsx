import React, { useState } from 'react';
import { Link2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => Promise<string | null>;
  disabled?: boolean;
  isLoading?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  disabled = false,
  isLoading = false,
}) => {
  const [isShared, setIsShared] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const btnClass = disabled || isLoading
    ? 'share-btn share-btn-disabled'
    : isShared
      ? 'share-btn share-btn-success'
      : 'share-btn share-btn-active';

  return (
    <div className="space-y-3 animate-fade-up delay-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Main share button */}
      <button
        onClick={handleShare}
        disabled={disabled || isLoading}
        className={btnClass}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating link…</span>
          </>
        ) : isShared ? (
          <>
            <Check
              className="w-4 h-4"
              strokeWidth={2.5}
              style={{ animation: 'checkmark-pop 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
            />
            <span>Link copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" strokeWidth={1.5} />
            <span>{disabled ? 'Write something first' : 'Share Note'}</span>
          </>
        )}
      </button>

      {/* URL display box */}
      {shareUrl && (
        <div className="share-url-box">
          <p className="text-[11px] text-amber-700/60 font-semibold tracking-widest uppercase mb-1.5">
            Share link
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-amber-900 truncate font-mono flex-1 leading-relaxed">
              {shareUrl}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={copyUrl}
                className="copy-btn"
                title="Copy link"
              >
                {isCopied
                  ? <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                  : <Copy className="w-3.5 h-3.5" />
                }
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="copy-btn"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-[11px] text-stone-400 text-center tracking-wide">
        Anyone with the link can view this note
      </p>
    </div>
  );
};

export default ShareButton;