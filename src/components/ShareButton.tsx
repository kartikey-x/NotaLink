import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => string | null;
  disabled?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onShare, disabled = false }) => {
  const [isShared, setIsShared] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = () => {
    const url = onShare();
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
    <div className="space-y-4">
      {/* Main Share Button */}
      <button
        onClick={handleShare}
        disabled={disabled}
        className={`
          w-full p-4 rounded-xl font-medium transition-all duration-200
          ${disabled 
            ? 'bg-gray-600/20 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 active:scale-95'
          }
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          {isShared ? (
            <>
              <Check className="w-5 h-5" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>{disabled ? 'Add content to share' : 'Share Note'}</span>
            </>
          )}
        </div>
      </button>
      
      {/* Share URL Display */}
      {shareUrl && (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400 mb-1">Share URL:</p>
              <p className="text-xs text-purple-300 truncate font-mono">
                {shareUrl}
              </p>
            </div>
            <button
              onClick={copyUrl}
              className="ml-3 p-2 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              title="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Share Instructions */}
      <div className="text-xs text-gray-500 text-center">
        Share this link with anyone to let them view your note
      </div>
    </div>
  );
};

export default ShareButton;