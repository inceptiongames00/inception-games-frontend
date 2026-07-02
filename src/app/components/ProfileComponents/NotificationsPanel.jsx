'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTokens } from '@/lib/api';
import { Bell, X } from 'lucide-react';

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
  const [showList, setShowList] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show only the first 2 events
  const displayEvents = notifications.slice(0, 1);

  return (
    <>
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
            
            {/* Bell Button */}
            <motion.button
              onClick={() => setShowList(true)}
              className="relative p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={16} />
              
              {/* Badge */}
              {unreadCount > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-pink-600/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-3 py-3">
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

          {!loading && !error && displayEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No live events at the moment</p>
            </div>
          )}

          {!loading && !error && displayEvents.length > 0 && (
            <div className="space-y-3">
              {displayEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition duration-300 overflow-hidden group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500" />

                  {/* Content layout */}
                  <div className="flex items-start gap-3">
                    {/* Event icon/image */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/[0.1] bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center text-white text-xl font-bold">
                        {event.game_name?.[0] || 'E'}
                      </div>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      {/* Game category tag */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {event.game_name || 'General'}
                        </span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      </div>

                      {/* Event title */}
                      <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">
                        {event.message || 'New Event'}
                      </h4>

                      {/* Date */}
   <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2d1b4e]/50">
                          <p className="text-xs text-gray-500">
                            {getRelativeTime(event.created_at)}
                          </p>
                          <div className="flex items-center gap-2">
                            {/* {isUnread && ( */}
                              <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                                New
                              </span>
                            {/* )} */}
                          </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Notifications List Modal */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowList(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-2xl max-w-2xl w-full shadow-2xl shadow-black/50 overflow-hidden max-h-150 flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Notifications {notifications.length > 0 && `(${notifications.length})`}
                </h3>
                <button
                  onClick={() => setShowList(false)}
                  className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                )}

                {!loading && notifications.length > 0 && (
                  <div className="divide-y divide-white/[0.05]">
                    {notifications.map((notif, idx) => (
                      <motion.button
                        key={notif.id}
                        onClick={() => {
                          setSelectedNotif(notif);
                          setShowList(false);
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="w-full px-6 py-4 text-left hover:bg-white/[0.04] transition flex items-start gap-4 group"
                      >
                        {/* Game icon */}
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2" />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            {notif.game_name || 'General'}
                          </p>
                          <p className="text-sm text-white group-hover:text-gray-100 transition">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            {new Date(notif.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notif.is_read && (
                          <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-500 mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Details Modal */}
      <AnimatePresence>
        {selectedNotif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotif(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[150] p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-2xl max-w-md w-full shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedNotif(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition z-10"
              >
                <X size={18} />
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {selectedNotif.game_name || 'General'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedNotif.message || 'New Notification'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(selectedNotif.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-white/[0.08] to-transparent mb-6" />

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Game</p>
                    <p className="text-sm text-white font-medium">
                      {selectedNotif.game_name || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Details</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedNotif.message}
                    </p>
                  </div>

                  {selectedNotif.notification_type && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Type</p>
                      <p className="text-sm text-white font-medium">
                        {selectedNotif.notification_type}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setSelectedNotif(null)}
                  className="w-full mt-6 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.08] transition"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
