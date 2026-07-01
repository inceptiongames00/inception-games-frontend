'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTokens } from '@/lib/api';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/message/SNS-7422`;

// Format date to short format like "MAY 23"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
};

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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
        setNotifications(data.messages);
        setUnreadCount(data.unread_count || 0);
        setError(null);
      }
    } catch (err) {
      console.log('[v0] Error fetching notifications:', err);
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

  // Show only the first event
  const displayEvent = notifications[0];

  return (
    <motion.div
      className="rounded-2xl overflow-hidden flex flex-col border border-purple-500/30 bg-gradient-to-br from-white/[0.02] to-white/[0.01] relative mb-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <h3 className="text-[1.375rem] font-bold text-white">Live Events</h3>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 shadow-lg shadow-pink-600/50">
              <span className="text-white font-bold text-sm">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 animate-pulse" />
              <div className="relative w-10 h-10 bg-[#0a0a0f] rounded-full border border-purple-500/50 border-t-purple-300 animate-spin" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Loading events...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Unable to load events</p>
          </div>
        )}

        {!loading && !error && !displayEvent && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No live events at the moment</p>
          </div>
        )}

        {!loading && !error && displayEvent && (
          <motion.div
            className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition duration-300 overflow-hidden group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500" />

            {/* Content layout */}
            <div className="flex items-start gap-3">
              {/* Event icon/image */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-white/[0.1] bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center text-white text-xl font-bold">
                  {displayEvent.game_name?.[0] || 'E'}
                </div>
              </div>

              {/* Event info */}
              <div className="flex-1 min-w-0">
                {/* Game category tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {displayEvent.game_name || 'General'}
                  </span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </div>

                {/* Event title */}
                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {displayEvent.message || 'New Event'}
                </h4>

                {/* Date */}
                <p className="text-sm text-gray-500">
                  {formatDate(displayEvent.created_at)}
                </p>
              </div>

              {/* NEW badge */}
              {!displayEvent.is_read && (
                <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-600/50">
                  New
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
