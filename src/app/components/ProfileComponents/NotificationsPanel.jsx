"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTokens } from "@/lib/api";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://inception-games.an.r.appspot.com/api/v1";

// Format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function NotificationsPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showList, setShowList] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [localReadStates, setLocalReadStates] = useState({}); // Track locally marked as read
  const [isMobile, setIsMobile] = useState(false);

  const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/message/${user?.id}`;

  const markNotificationAsRead = async (notificationId) => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) return false;

      // Try to call the API to mark as read
      const response = await fetch(
        `${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );

      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.error("[v0] Could not mark as read on backend, using local state");
    }
    return false;
  };

  const fetchNotifications = async () => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch(NOTIFICATIONS_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
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
      console.error("[v0] Error fetching notifications:", err);
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

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile, show only discord button. On desktop, show live events header + discord button
  if (isMobile) {
    return (
      <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] mb-5">
        <a
          href="https://discord.com/invite/9AtUGVqKs3"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.036.055a19.926 19.926 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
          Join Discord
        </a>
      </div>
    );
  }

  // Display events - Show only the first 2 events
  const displayEvents = notifications.slice(0, 1);

  return (
    <>
      <motion.div
        className="rounded-2xl overflow-hidden flex flex-col border-l border-b border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-white/[0.01] relative mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <h3 className="text-[1.375rem] font-bold text-white">
                Live Events
              </h3>
            </div>

            {/* Bell Button */}
            <motion.button
              onClick={() => setShowList(true)}
              className="relative p-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
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
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {!loading && !error && displayEvents.length > 0 && (
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <a
            href="https://discord.com/invite/9AtUGVqKs3"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.036.055a19.926 19.926 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Join Discord
          </a>
        </div>
      )}

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
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black via-[#0a0a0f] to-black border border-white/[0.08] rounded-2xl max-w-2xl w-full shadow-2xl shadow-black/50 overflow-hidden max-h-150 flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Notifications{" "}
                  {notifications.length > 0 && `(${notifications.length})`}
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
                    {notifications.map((notif, idx) => {
                      const isUnread = !notif.is_read;

                      return (
                        <motion.button
                          key={notif.id}
                          onClick={() => {
                            // Mark as read locally immediately for instant feedback
                            if (isUnread) {
                              setLocalReadStates((prev) => ({
                                ...prev,
                                [notif.id]: true,
                              }));

                              // Update local state immediately
                              setNotifications((prev) =>
                                prev.map((n) =>
                                  n.id === notif.id ? { ...n, is_read: 1 } : n,
                                ),
                              );
                              setUnreadCount((prev) => Math.max(0, prev - 1));

                              // Try to persist to backend
                              markNotificationAsRead(notif.id);
                            }

                            setSelectedNotif(notif);
                            setShowList(false);
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`w-full px-6 py-4 text-left hover:bg-white/[0.04] transition flex items-start gap-4 group border-l-4 ${
                            isUnread
                              ? "border-l-purple-500/70"
                              : "border-l-purple-500/20"
                          }`}
                        >
                          {/* Game icon with avatar styling from old component */}
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                              isUnread
                                ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/60"
                                : "bg-gradient-to-br from-purple-700/50 to-pink-700/50"
                            }`}
                          >
                            🎯
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                              {notif.game_name || "General"}
                            </p>
                            <p className="text-sm text-white group-hover:text-gray-100 transition">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              {new Date(notif.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>

                          {/* Unread indicator - dot instead of side indicator */}
                          {isUnread && (
                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 mt-2 animate-pulse" />
                          )}
                        </motion.button>
                      );
                    })}
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
              transition={{ type: "spring", duration: 0.3 }}
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
                      {selectedNotif.game_name || "General"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedNotif.message || "New Notification"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(selectedNotif.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
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
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Game
                    </p>
                    <p className="text-sm text-white font-medium">
                      {selectedNotif.game_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Details
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedNotif.message}
                    </p>
                  </div>

                  {selectedNotif.notification_type && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Type
                      </p>
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
