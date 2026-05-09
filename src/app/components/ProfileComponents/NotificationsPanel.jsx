'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTokens } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/message/SNS-7422`;

// Parse prize amount from message
const extractPrize = (message) => {
  const match = message.match(/Win\s+([\d,৳₹$]+)/);
  return match ? match[1] : null;
};

// Get game icon based on game name
const getGameIcon = (gameName) => {
  const icons = {
    'BGMI': '🎮',
    'FREE FIRE': '🔥',
    'VALORANT': '⚔️',
    'DOTA 2': '🌀',
    'PUBG': '💥',
  };
  return icons[gameName] || '🎯';
};

// Format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [localReadStates, setLocalReadStates] = useState({}); // Track locally marked as read

  const markNotificationAsRead = async (notificationId) => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) return false;

      // Try to call the API to mark as read
      const response = await fetch(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      if (response.ok) {
        console.log('[v0] Notification marked as read on backend');
        return true;
      }
    } catch (err) {
      console.log('[v0] Could not mark as read on backend, using local state');
    }
    return false;
  };

  const fetchNotifications = async () => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(NOTIFICATIONS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.messages) {
        // Merge API data with local read states to preserve read status
        const updatedMessages = data.messages.map((msg) => {
          if (localReadStates[msg.id]) {
            return { ...msg, is_read: 1 };
          }
          return msg;
        });

        setNotifications(updatedMessages);
        setUnreadCount(data.unread_count || 0);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notif) => {
    setSelectedNotif(notif.id === selectedNotif?.id ? null : notif);
    
    if (!notif.is_read) {
      // Mark as read locally immediately for instant feedback
      setLocalReadStates((prev) => ({
        ...prev,
        [notif.id]: true,
      }));

      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notif.id ? { ...n, is_read: 1 } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Try to persist to backend
      await markNotificationAsRead(notif.id);
    }
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden flex flex-col border border-white/[0.06] bg-[#0c0c12] relative h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Live Events</h3>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-600/50">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content - Scrollable notifications list */}
      <div className="flex-1 overflow-y-auto bg-[#08070f]/50 space-y-0">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse" />
              <div className="relative w-10 h-10 bg-[#08070f] rounded-full border border-purple-500/50 border-t-purple-300 animate-spin" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Loading events...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4v.01" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">Unable to load</p>
              <p className="text-xs text-gray-500 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">No events yet</p>
              <p className="text-xs text-gray-500 mt-1">New tournaments coming soon</p>
            </div>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="divide-y divide-[#1a1628]">
            {notifications.map((notif) => {
              const prize = extractPrize(notif.message);
              const isUnread = !notif.is_read;
              const isSelected = selectedNotif?.id === notif.id;

              return (
                <div key={notif.id} className={`transition-all duration-300`}>
                  {/* Notification Item */}
                  <div
                    onClick={() => handleNotificationClick(notif)}
                    className={`relative p-4 cursor-pointer transition-all duration-300 border-l-4 group ${
                      isUnread
                        ? 'bg-gradient-to-r from-[#2d1b4e]/60 to-[#1a0f2e]/40 border-l-purple-500/70 hover:from-[#3d2b5e]/70 hover:to-[#2a1f3e]/50'
                        : 'bg-[#0f0d18]/40 border-l-purple-500/20 hover:border-l-purple-500/40 hover:bg-[#151320]/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Game Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                        isUnread
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/60'
                          : 'bg-gradient-to-br from-purple-700/50 to-pink-700/50'
                      }`}>
                        {getGameIcon(notif.game_name)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                              {notif.game_name}
                              {isUnread && <span className="ml-2 inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                            </p>
                          </div>
                          {prize && (
                            <div className="flex-shrink-0 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-lg shadow-amber-600/40">
                              {prize}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-200 font-medium line-clamp-2">
                          {notif.message}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2d1b4e]/50">
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(notif.created_at)}
                          </p>
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                                New
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-xs text-gray-500">
                                Details below
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="bg-gradient-to-r from-[#1a1220]/80 to-[#0f0d18]/80 border-t border-purple-500/30 px-4 py-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1a0f2e]/60 rounded-lg p-3 border border-purple-500/20">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Game</p>
                          <p className="text-sm font-bold text-purple-300 mt-1">{notif.game_name}</p>
                        </div>
                        {prize && (
                          <div className="bg-[#2d1b2d]/60 rounded-lg p-3 border border-amber-500/20">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Prize Pool</p>
                            <p className="text-sm font-bold text-amber-300 mt-1">{prize}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#1a0f2e]/60 rounded-lg p-3 border border-purple-500/20">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Details</p>
                        <p className="text-sm text-gray-200">{notif.message}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
                        <span>Notified {getRelativeTime(notif.created_at)}</span>
                        <span>{new Date(notif.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
