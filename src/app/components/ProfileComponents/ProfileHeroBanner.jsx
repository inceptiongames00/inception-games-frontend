"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Edit3,
} from "lucide-react";
import MinimalNotification from "./MinimalNotification";

export default function ProfileHeroBanner({ user, onEditProfile }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef(null);

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

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#0a0a0f] to-[#0a0a0f]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background gradient - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-[#0a0a0f]" />
      
      {/* Left side glow - purple */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl opacity-40" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 py-14 sm:py-24">
        
        {/* Main content row - avatar, info, and buttons */}
        <div className="flex items-center justify-between gap-6 w-full">
          
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            
            {/* Avatar */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
            >
              {/* Glow circle */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 opacity-70 blur-md" />
              
              {/* Avatar circle */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-br from-purple-500 to-purple-600">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
                  {user?.avatar || user?.avatar_url ? (
                    <img
                      src={user.avatar || user.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Online indicator */}
              <span className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0c0c14] animate-ping" />
              <span className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0c0c14]" />
            </motion.div>

            {/* Player Info */}
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Name and tag on same line */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {user?.fullName || user?.full_name || user?.username || "Player"}
                </h1>
                {user?.username && (
                  <span className="text-gray-500 text-sm sm:text-base">
                    @{user.username}
                  </span>
                )}
              </div>

              {/* Info tags - horizontal row below name */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-3">
                {(user?.primaryGame || user?.primary_game || user?.game) && (
                  <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium">
                    {user?.primaryGame || user?.primary_game || user?.game}
                  </div>
                )}
                {(user?.gameRole || user?.game_role || user?.role) && (
                  <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium">
                    {user?.gameRole || user?.game_role || user?.role}
                  </div>
                )}
                {user?.rank && (
                  <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium">
                    {user.rank}
                  </div>
                )}
                {user?.email && (
                  <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-gray-300 font-medium">
                    {user.email}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Action Buttons */}
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Share button */}
            <div className="relative" ref={shareRef}>
              <motion.button
                className="p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label="Share profile"
              >
                <Share2 size={16} />
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-12 bottom-1 z-50 w-48 rounded-xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    {/* Share menu items */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                        setShowShareMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-300 hover:bg-white/[0.05] transition border-b border-white/[0.05]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-gray-300 hover:bg-white/[0.05] transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>
                      </svg>
                      <span className="font-medium">Twitter / X</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Minimal Notification */}
            <MinimalNotification />

            {/* Edit Profile button */}
            {onEditProfile && (
              <motion.button
                className="p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditProfile}
                aria-label="Edit Profile"
              >
                <Edit3 size={16} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </motion.div>
  );
}
