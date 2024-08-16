import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import { ShareModalProps } from '@/types/posts';

export function ShareModal({ postId, onClose }: ShareModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const shareUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg dark:text-white">Share Post</h4>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-around mb-4">
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCopyLink}
            className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
              linkCopied
                ? 'bg-green-600 dark:bg-green-400 text-white'
                : 'bg-blue-600 dark:bg-blue-400 text-white hover:bg-blue-500 dark:hover:bg-blue-300'
            }`}
          >
            {linkCopied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
