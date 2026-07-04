"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Edit3,
} from "lucide-react";

export default function ProfileHeroBanner({ user, onEditProfile }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shareRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close share menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target))
        setShowShareMenu(false);
    };
    if (showShareMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showShareMenu]);

  // Inject Open Graph meta tags for social sharing
  useEffect(() => {
    if (!user) return;

    const playerName = user?.fullName || user?.username || 'Player';
    const playerTag = user?.username || 'player';
    const primaryGame = user?.primaryGame || user?.game || 'Gaming';
    const rank = user?.rank || 'Player';
    const avatar = user?.avatar || '';

    // Build OG image URL with player data
    const ogImageParams = new URLSearchParams({
      name: playerName,
      tag: playerTag,
      game: primaryGame,
      rank: rank,
      ...(avatar && { avatar }),
    });
    const ogImageUrl = `/api/og/profile?${ogImageParams.toString()}`;

    // Update meta tags
    const updateMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMetaTag('og:title', `${playerName} - Inception Games Profile`);
    updateMetaTag('og:description', `Check out ${playerName}'s esports profile on Inception Games. ${primaryGame} player with ${rank} rank.`);
    updateMetaTag('og:image', ogImageUrl);
    updateMetaTag('og:type', 'profile');
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${playerName} - Inception Games`);
    updateMetaTag('twitter:description', `${playerName}'s esports profile on Inception Games`);
    updateMetaTag('twitter:image', ogImageUrl);

  }, [user]);

  const initials = (user?.fullName || user?.username || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Share button component (reused in both layouts)
  const ShareButton = ({ size, buttonClass, iconSize }) => (
    <div className="relative" ref={shareRef}>
      <motion.button
        className={buttonClass}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShareMenu(!showShareMenu)}
        aria-label="Share profile"
      >
        <Share2 size={size} className={iconSize} />
      </motion.button>

      <AnimatePresence>
        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className={isMobile ? "absolute right-8 sm:right-10 bottom-1 z-50 w-40 sm:w-44 rounded-xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden" : "absolute right-10 sm:right-12 bottom-1 z-50 w-44 sm:w-48 rounded-xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"}
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                setShowShareMenu(false);
              }}
              className={isMobile ? "w-full px-3 py-2 text-left flex items-center gap-2 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05] text-xs sm:text-sm" : "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05] text-sm"}
            >
              <svg className={isMobile ? "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" : "w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="font-medium">Copy Link</span>
            </button>

            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.href : '';
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(facebookUrl, 'facebook-share', 'width=600,height=400');
                setShowShareMenu(false);
              }}
              className={isMobile ? "w-full px-3 py-2 text-left flex items-center gap-2 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05] text-xs sm:text-sm" : "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05] text-sm"}
            >
              <svg className={isMobile ? "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" : "w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-medium">Facebook</span>
            </button>

            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.href : '';
                const text = `Check out my profile on Inception Games!`;
                const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                window.open(twitterUrl, 'twitter-share', 'width=600,height=400');
                setShowShareMenu(false);
              }}
              className={isMobile ? "w-full px-3 py-2 text-left flex items-center gap-2 text-gray-300 hover:bg-white/[0.05] transition text-xs sm:text-sm" : "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 text-gray-300 hover:bg-white/[0.05] transition text-sm"}
            >
              <svg className={isMobile ? "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" : "w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>
              </svg>
              <span className="font-medium">Twitter / X</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden border border-white/[0.06] min-h-[320px] sm:min-h-[280px] md:min-h-[240px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background: custom banner or mesh gradient */}
      {user?.banner || user?.banner_url ? (
        <div className="absolute inset-0">
          <img
            src={user.banner || user.banner_url}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/60 to-transparent" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-[#0c0c14] to-pink-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.12),transparent_50%)]" />
        </>
      )}

      {/* Subtle animated shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
        animate={{ x: [-800, 800] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* CONDITIONAL RENDERING: Desktop vs Mobile Layout */}
      {!isMobile ? (
        // DESKTOP LAYOUT
        <div className="relative z-10 flex flex-col justify-end px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8 pt-auto min-h-[320px] sm:min-h-[280px] md:min-h-[240px]">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-6 w-full">
            {/* Left: Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 md:gap-8 flex-1 min-w-0 w-full sm:w-auto">
              {/* Avatar */}
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-md opacity-60 animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full p-[2px] bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="w-full h-full rounded-full bg-[#0c0c14] overflow-hidden flex items-center justify-center">
                    {user?.avatar || user?.avatar_url ? (
                      <img
                        src={user.avatar || user.avatar_url}
                        className="w-full h-full object-cover"
                        alt="Profile avatar"
                      />
                    ) : (
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
                <span className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 bg-emerald-500 rounded-full border-2 border-[#0c0c14] animate-pulse" />
              </motion.div>

              {/* Player Info */}
              <motion.div
                className="flex-1 min-w-0 text-center sm:text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline flex-wrap gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {user?.fullName || user?.full_name || user?.username || "Player"}
                    </h1>
                    {user?.username && (
                      <span className="text-gray-400 text-xs sm:text-sm leading-tight">
                        @{user.username}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm mt-2">
                    {(user?.primaryGame || user?.primary_game || user?.game) && (
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[11px] sm:text-xs">
                        {user?.primaryGame || user?.primary_game || user?.game}
                      </div>
                    )}
                    {(user?.gameRole || user?.game_role || user?.role) && (
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[11px] sm:text-xs">
                        {user?.gameRole || user?.game_role || user?.role}
                      </div>
                    )}
                    {user?.rank && (
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[11px] sm:text-xs">
                        {user.rank}
                      </div>
                    )}
                    {user?.email && (
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap truncate max-w-[150px] sm:max-w-[200px] text-[11px] sm:text-xs">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Action Buttons */}
            <motion.div
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ShareButton
                size={16}
                buttonClass="p-2 sm:p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                iconSize="sm:w-5 sm:h-5"
              />
              {onEditProfile && (
                <motion.button
                  className="p-2 sm:p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditProfile}
                  aria-label="Edit Profile"
                >
                  <Edit3 size={16} className="sm:w-5 sm:h-5" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      ) : (
        // MOBILE LAYOUT
        <div className="relative z-10 flex flex-col justify-end px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8 pt-auto min-h-[320px] sm:min-h-[280px] md:min-h-[240px]">
          <div className="flex flex-row items-start justify-between gap-3 w-full">
            {/* Left: Avatar + Info */}
            <div className="flex flex-row items-start gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <motion.div
                className="relative flex-shrink-0 mt-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-md opacity-60 animate-pulse" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full p-[2px] bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="w-full h-full rounded-full bg-[#0c0c14] overflow-hidden flex items-center justify-center">
                    {user?.avatar || user?.avatar_url ? (
                      <img
                        src={user.avatar || user.avatar_url}
                        className="w-full h-full object-cover"
                        alt="Profile avatar"
                      />
                    ) : (
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-emerald-500 rounded-full border-2 border-[#0c0c14] animate-pulse" />
              </motion.div>

              {/* Player Info */}
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-baseline flex-wrap gap-1.5">
                  <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight truncate">
                    {user?.fullName || user?.full_name || user?.username || "Player"}
                  </h1>
                  {user?.username && (
                    <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-tight">
                      @{user.username}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {(user?.primaryGame || user?.primary_game || user?.game) && (
                    <div className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[10px] sm:text-xs">
                      {user?.primaryGame || user?.primary_game || user?.game}
                    </div>
                  )}
                  {(user?.gameRole || user?.game_role || user?.role) && (
                    <div className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[10px] sm:text-xs">
                      {user?.gameRole || user?.game_role || user?.role}
                    </div>
                  )}
                  {user?.rank && (
                    <div className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap text-[10px] sm:text-xs">
                      {user.rank}
                    </div>
                  )}
                </div>
                {user?.email && (
                  <div className="mt-1">
                    <div className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium whitespace-nowrap truncate max-w-[150px] text-[10px] sm:text-xs inline-block">
                      {user.email}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Action Buttons */}
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 mt-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ShareButton
                size={14}
                buttonClass="p-1.5 sm:p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                iconSize="sm:w-4 sm:h-4 md:w-5 md:h-5"
              />
              {onEditProfile && (
                <motion.button
                  className="p-1.5 sm:p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditProfile}
                  aria-label="Edit Profile"
                >
                  <Edit3 size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </motion.div>
  );
}
