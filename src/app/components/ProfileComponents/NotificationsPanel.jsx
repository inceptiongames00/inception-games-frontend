'use client';

import { useState, useEffect } from 'react';
import { getTokens } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';
const NOTIFICATIONS_ENDPOINT = `${API_BASE_URL}/message/SNS-7422`;

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) {
        console.log('[v0] No auth tokens available');
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
      console.log('[v0] Notifications fetched:', data);

      if (data.success && data.messages) {
        setNotifications(data.messages);
        setUnreadCount(data.unread_count || 0);
        setError(null);
      }
    } catch (err) {
      console.error('[v0] Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling setup
  useEffect(() => {
    fetchNotifications();

    // Set up polling for real-time updates (every 10 seconds)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: 1 } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Call API to mark as read (if endpoint exists)
      // await fetch(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${tokens.accessToken}`,
      //   },
      // });
    } catch (err) {
      console.error('[v0] Error marking notification as read:', err);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden h-full flex flex-col min-h-[200px] md:min-h-[280px]">
      <div className="bg-[#111018] border-b border-[#2d1b4e] px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-200">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#08070f]">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading notifications...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <svg className="w-11 h-11 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <p className="text-sm text-gray-400">No notifications yet</p>
            <p className="text-sm text-purple-500">Stay sharp, action's coming.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="divide-y divide-[#2d1b4e]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  notif.is_read
                    ? 'bg-[#08070f] hover:bg-[#0f0d18]'
                    : 'bg-[#1a1220] hover:bg-[#211828]'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notif.is_read && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-300 truncate">
                      {notif.game_name}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(notif.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
