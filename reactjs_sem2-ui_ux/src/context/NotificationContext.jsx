// NotificationContext manages the global notification list.
// Notifications are stored in localStorage and can be read across the app.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { KEYS, getList, setItem, addToList } from '../utils/storage';
import { isTomorrow } from '../utils/dateHelpers';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load notifications that belong to the current user.
  function loadNotifications() {
    const all = getList(KEYS.NOTIFICATIONS);
    const mine = user ? all.filter((n) => n.userId === user.id || n.userId === 'all') : [];
    setNotifications(mine);
  }

  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Adds a notification to localStorage and refreshes local state.
  const addNotification = useCallback((message, type = 'info', targetUserId = 'all') => {
    const notification = {
      id: uuidv4(),
      userId: targetUserId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    addToList(KEYS.NOTIFICATIONS, notification);
    loadNotifications();
  }, [user]);

  // Called on app load to check if any registered event is tomorrow.
  function checkTomorrowReminders() {
    if (!user) return;
    const registrations = getList(KEYS.REGISTRATIONS);
    const events = getList(KEYS.EVENTS);
    const myRegistrations = registrations.filter((r) => r.userId === user.id);
    const existingNotifs = getList(KEYS.NOTIFICATIONS);

    myRegistrations.forEach((registration) => {
      const event = events.find((ev) => ev.id === registration.eventId);
      if (!event) return;
      if (!isTomorrow(event.date)) return;

      // Avoid duplicate reminders for the same event on the same day.
      const alreadyNotified = existingNotifs.some(
        (n) => n.message.includes(event.title) && n.message.includes('tomorrow')
      );
      if (!alreadyNotified) {
        addNotification(
          `Reminder: "${event.title}" is happening tomorrow at ${event.time}!`,
          'reminder',
          user.id
        );
      }
    });
  }

  useEffect(() => {
    if (user) checkTomorrowReminders();
  }, [user]);

  function markAsRead(notificationId) {
    const all = getList(KEYS.NOTIFICATIONS);
    const updated = all.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    setItem(KEYS.NOTIFICATIONS, updated);
    loadNotifications();
  }

  function markAllRead() {
    const all = getList(KEYS.NOTIFICATIONS);
    const updated = all.map((n) =>
      n.userId === user?.id || n.userId === 'all' ? { ...n, read: true } : n
    );
    setItem(KEYS.NOTIFICATIONS, updated);
    loadNotifications();
  }

  function clearAll() {
    const all = getList(KEYS.NOTIFICATIONS);
    const remaining = all.filter(
      (n) => n.userId !== user?.id && n.userId !== 'all'
    );
    setItem(KEYS.NOTIFICATIONS, remaining);
    loadNotifications();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllRead, clearAll, unreadCount, loadNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
