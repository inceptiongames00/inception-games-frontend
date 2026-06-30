"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Edit3,
  Gamepad2,
  Award,
  Check,
  Link2,
  Facebook,
  Twitter,
  Mail,
  AtSign,
} from "lucide-react";

export default function ProfileHeroBanner({ user, onEditProfile }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
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
  className="relative w-full rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-r from-purple-900/30 via-[#0a0a0f] to-pink-900/20 min-h-[280px] sm:min-h-[320px]"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a0f] to-pink-900/30" />
  
  {/* Animated glow elements */}
  <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl" />

  {/* Content - positioned at bottom */}
  <div className="relative z-10 h-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8 flex flex-col justify-end">
    
    {/* Main content row - avatar, info, and buttons all on same line */}
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
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 opacity-60 blur-lg animate-pulse" />
          
          {/* Avatar circle */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600">
            <div className="w-full h-full rounded-full bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
              {user?.avatar || user?.avatar_url ? (
                <img
                  src={user.avatar || user.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {initials}
                </span>
              )}
            </div>
          </div>

          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
        </motion.div>

        {/* Player Info - compact */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Name and tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {user?.fullName || user?.full_name || user?.username || "Player"}
            </h1>
            {user?.username && (
              <span className="text-gray-400 text-xs sm:text-sm">
                @{user.username}
              </span>
            )}
          </div>

          {/* Info tags - compact inline */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mt-1.5">
            {(user?.primaryGame || user?.primary_game || user?.game) && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Gamepad2 size={13} className="text-purple-400" />
                <span className="text-gray-300">{user?.primaryGame || user?.primary_game || user?.game}</span>
              </div>
            )}
            {user?.rank && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Award size={13} className="text-pink-400" />
                <span className="text-gray-300">{user.rank}</span>
              </div>
            )}
            {(user?.gameRole || user?.game_role || user?.role) && (
              <div className="px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300">
                {user?.gameRole || user?.game_role || user?.role}
              </div>
            )}
            {user?.email && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Mail size={13} className="text-gray-500" />
                <span className="text-gray-300 text-[10px] sm:text-xs">{user.email}</span>
              </div>
            )}
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
        {/* Share button */}
        <div className="relative" ref={shareRef}>
          <motion.button
            className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            aria-label="Share profile"
          >
            {copied ? (
              <Check size={15} className="text-emerald-400" />
            ) : (
              <Share2 size={15} />
            )}
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute right-0 bottom-12 z-50 w-48 rounded-xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
              >
                {/* ... share menu items ... */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Profile button */}
        {onEditProfile && (
          <motion.button
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold transition border border-purple-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEditProfile}
            aria-label="Edit Profile"
          >
            <Edit3 size={14} />
            <span>EDIT PROFILE</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  </div>

  {/* Top accent line */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-pink-500/40" />
</motion.div>
  );
}
