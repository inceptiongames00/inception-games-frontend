'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { IoClose } from 'react-icons/io5';
import { BiDownload } from 'react-icons/bi';
import { MdContentCopy } from 'react-icons/md';
import Swal from 'sweetalert2';

export default function SharePreview({ event }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef(null);

  // Safely extract values from event object, handling nested objects
  const getEventTitle = () => event?.title || 'Event';
  const getEventGame = () => {
    if (typeof event?.game === 'string') return event.game;
    if (event?.game?.name) return event.game.name;
    if (event?.gameName) return event.gameName;
    return 'Gaming';
  };
  const getEventRegion = () => event?.region || event?.location || 'Online';
  const getEventType = () => event?.eventType || 'Event';

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#0c0c12',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${event?.title || 'event'}-share.png`;
      link.click();

      Swal.fire({
        icon: 'success',
        title: 'Downloaded!',
        text: 'Share image saved successfully',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#d946ef',
      });
    } catch (error) {
      console.error('[v0] Failed to generate image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Could not generate share image',
        background: '#0c0c12',
        color: '#fff',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('[v0] Copy link failed:', error);
    }
  };

  const handleFacebookShare = () => {
    if (typeof window !== 'undefined') {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleTwitterShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(event?.title || 'Check out this event!');
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${text}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`${getEventTitle()}\n${window.location.href}`);
      const url = `https://wa.me/?text=${text}`;
      window.open(url, '_blank');
    }
  };

  const handleDiscordShare = () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
      navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: 'success',
        title: 'Copied for Discord!',
        text: 'Link copied. Paste it in your Discord server!',
        background: '#0c0c12',
        color: '#fff',
        confirmButtonColor: '#d946ef',
      });
    } catch (error) {
      console.error('[v0] Discord share failed:', error);
    }
  };

  const eventDate = event?.start_at
    ? new Date(event.start_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD';

  const eventTime = event?.start_at
    ? new Date(event.start_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'TBD';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:border-purple-400 hover:bg-purple-500/5 transition-all flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C9.589 12.43 10.647 11.717 11.829 11.25m0 0a6.002 6.002 0 01-7.752 7.752m7.752-7.752a6.002 6.002 0 018.217 8.217M5.072 9.864a9 9 0 1012.728 12.728m-12.728-12.728a9 9 0 0112.728 12.728"
          />
        </svg>
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-gray-900 to-[#0c0c12] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative z-50">
                <h3 className="text-2xl font-bold text-white">Share Event</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Share Preview Card */}
              <div className="mb-6 rounded-xl overflow-hidden pointer-events-none">
                <div
                  ref={previewRef}
                  className="w-full bg-gradient-to-br from-purple-900/30 via-[#0c0c12] to-pink-900/30 p-8"
                  style={{ aspectRatio: '1.2 / 1' }}
                >
                  {/* Banner Image Background */}
                  {event?.banner_image && (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url(${event.banner_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}

                  <div className="relative h-full flex flex-col justify-between z-10">
                    {/* Top Section - Logo & Game */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-1">
                          Inception Games
                        </p>
                        <h2 className="text-3xl font-black text-white max-w-xs leading-tight">
                          {getEventTitle()}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          {getEventGame()}
                        </p>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">⚡</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section - Event Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <svg
                          className="w-5 h-5 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {eventDate} at {eventTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-300">
                        <svg
                          className="w-5 h-5 text-pink-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">
                          {getEventRegion()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-300">
                        <svg
                          className="w-5 h-5 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8.16 5.314l4.897-1.596A1 1 0 0115 4.757v6.115a4.5 4.5 0 01-1.577 3.39l-5.126 4.073a1 1 0 01-1.297-.13l-.654-.81a1 1 0 01.25-1.558l5.07-3.652a2.5 2.5 0 00.875-1.884V5.414a1 1 0 00-1.25-.988l-1.52.496A1 1 0 008 6.25v3.5a1 1 0 11-2 0v-3.5a3 3 0 013.16-2.936z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {getEventType()}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Section - CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 text-center">
                      <p className="text-white font-bold text-lg">
                        Register Now
                      </p>
                      <p className="text-purple-100 text-xs mt-1">
                        inception-games.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4 relative z-50 pointer-events-auto">
                <button
                  onClick={handleDownloadImage}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all cursor-pointer"
                >
                  <BiDownload size={20} />
                  {isGenerating ? 'Generating...' : 'Download Image'}
                </button>

                <button
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg transition-all cursor-pointer ${
                    copySuccess
                      ? 'bg-green-600/50 text-green-300'
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                  }`}
                >
                  <MdContentCopy size={20} />
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Social Share Options */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 relative z-50 pointer-events-auto">
                <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                  Or share to
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFacebookShare}
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>f</span>
                    Facebook
                  </button>

                  <button
                    onClick={handleTwitterShare}
                    type="button"
                    className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>𝗫</span>
                    Twitter
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>💬</span>
                    WhatsApp
                  </button>

                  <button
                    onClick={handleDiscordShare}
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <span>🎮</span>
                    Discord
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
