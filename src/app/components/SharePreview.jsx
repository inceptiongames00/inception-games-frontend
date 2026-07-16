'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaDiscord } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function SharePreview({ event }) {
  const [isOpen, setIsOpen] = useState(false);

  // Safely extract values from event object, handling nested objects
  const getEventTitle = () => event?.title || 'Event';
  const getEventGame = () => {
    if (typeof event?.game === 'string') return event.game;
    if (event?.game?.name) return event.game.name;
    if (event?.gameName) return event.gameName;
    return 'Gaming';
  };

  const handleFacebookShare = () => {
    if (typeof window !== 'undefined') {
      const title = event?.title || 'Check out this event!';
      const description = `Join ${title} on Inception Games. Register now for this amazing esports event!`;
      
      const updateOGTag = (property, content) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.content = content;
      };
      
      updateOGTag('og:title', title);
      updateOGTag('og:description', description);
      updateOGTag('og:url', window.location.href);
      
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(title)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleTwitterShare = () => {
    if (typeof window !== 'undefined') {
      const title = event?.title || 'Check out this event!';
      const hashtags = 'InceptionGames,Esports,Gaming';
      const text = encodeURIComponent(`🎮 ${title}\n\nJoin us for an amazing esports experience!\n\n#${hashtags}`);
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
      console.error('[SharePreview] Discord share failed:', error);
    }
  };

  const shareOptions = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-500 hover:to-blue-600',
      bgColor: 'bg-blue-500/10',
      onClick: handleFacebookShare,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: FaTwitter,
      color: 'from-black to-gray-900',
      hoverColor: 'hover:from-gray-800 hover:to-gray-950',
      bgColor: 'bg-gray-500/10',
      onClick: handleTwitterShare,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-400 hover:to-green-500',
      bgColor: 'bg-green-500/10',
      onClick: handleWhatsAppShare,
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: FaDiscord,
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-400 hover:to-purple-500',
      bgColor: 'bg-purple-500/10',
      onClick: handleDiscordShare,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg border border-purple-500/30 text-purple-400 hover:border-purple-400 hover:bg-purple-500/5 transition-all flex items-center gap-2 cursor-pointer font-medium"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900/80 via-[#0a0e27] to-slate-950/90 rounded-3xl p-8 max-w-md w-full border border-purple-500/20 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Share Event
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Spread the word about this amazing event</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer p-2 rounded-lg"
                >
                  <IoClose size={24} />
                </motion.button>
              </div>

              {/* Event Title */}
              <div className="mb-7 pb-7 border-b border-purple-500/10">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Event</p>
                <p className="text-lg font-semibold text-white truncate">{getEventTitle()}</p>
              </div>

              {/* Social Share Options */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold px-1 mb-4">
                  Share to social media
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option, idx) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={option.onClick}
                        type="button"
                        className={`bg-gradient-to-br ${option.color} ${option.hoverColor} text-white font-semibold py-3 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl relative overflow-hidden group`}
                      >
                        {/* Animated background glow */}
                        <div className={`absolute inset-0 ${option.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <Icon size={24} />
                          <span className="text-xs sm:text-sm font-semibold">{option.name}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Tip */}
              <div className="mt-7 pt-6 border-t border-purple-500/10">
                <div className="flex items-start gap-3 bg-purple-500/5 rounded-lg p-3 border border-purple-500/10">
                  <span className="text-lg mt-0.5">💡</span>
                  <p className="text-xs text-gray-400">
                    <span className="text-purple-300 font-semibold">Pro Tip:</span> Each platform will show your friends an attractive preview of this event!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
