import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  getDemoDb,
  getNotificationsForUser,
  setCollection,
  updateUser,
  addNotification as addNotificationToStore,
} from "@/data/demoStore";

import NotificationToast from "@/components/notificationPage/notificationsToast";

const NotificationsContext = createContext();

const TOAST_DURATION = 4000;

const DEFAULT_NOTIFICATION_PREFERENCES = {
  muteAll: false,
  inApp: true,
  email: false,
  projectInvitations: true,
  commentsFeedback: true,
  privateMessages: true,
  internshipUpdates: true,
  courseLinking: true,
  adminAnnouncements: true,
};

const STORAGE_KEY = "guc-notification-preferences";

function safeParse(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredNotificationPreferences(userId) {
  if (typeof window === "undefined") return {};

  const allStored = safeParse(localStorage.getItem(STORAGE_KEY), {});
  return allStored?.[userId] || {};
}

function saveStoredNotificationPreferences(userId, preferences) {
  if (typeof window === "undefined" || !userId) return;

  const allStored = safeParse(localStorage.getItem(STORAGE_KEY), {});
  const nextStored = {
    ...allStored,
    [userId]: preferences,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStored));
}

function getUserNotificationPreferences(user) {
  if (!user?.id) return DEFAULT_NOTIFICATION_PREFERENCES;

  const userPreferences =
    user.notificationPreferences ||
    user.settings?.notifications ||
    user.preferences?.notifications ||
    {};

  const localPreferences = getStoredNotificationPreferences(user.id);

  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...userPreferences,
    ...localPreferences,
  };
}

function getNotificationCategory(notification) {
  const type = String(notification?.type || "").toLowerCase();
  const title = String(notification?.title || "").toLowerCase();
  const body = String(
    notification?.message ||
      notification?.body ||
      notification?.description ||
      notification?.content ||
      ""
  ).toLowerCase();

  const combined = `${type} ${title} ${body}`;

  if (
    combined.includes("message") ||
    combined.includes("chat") ||
    combined.includes("private")
  ) {
    return "privateMessages";
  }

  if (
    combined.includes("internship") ||
    combined.includes("application") ||
    combined.includes("applicant") ||
    combined.includes("accepted") ||
    combined.includes("rejected")
  ) {
    return "internshipUpdates";
  }

  if (
    combined.includes("comment") ||
    combined.includes("feedback") ||
    combined.includes("review")
  ) {
    return "commentsFeedback";
  }

  if (
    combined.includes("invite") ||
    combined.includes("collaborator") ||
    combined.includes("project invitation")
  ) {
    return "projectInvitations";
  }

  if (
    combined.includes("course") ||
    combined.includes("linking") ||
    combined.includes("class")
  ) {
    return "courseLinking";
  }

  if (
    combined.includes("admin") ||
    combined.includes("announcement") ||
    combined.includes("report") ||
    combined.includes("verify") ||
    combined.includes("verification")
  ) {
    return "adminAnnouncements";
  }

  return "inApp";
}

function shouldShowInAppNotification(notification, preferences) {
  if (!notification) return false;
  if (preferences?.muteAll) return false;
  if (preferences?.inApp === false) return false;

  const category = getNotificationCategory(notification);

  if (category && preferences?.[category] === false) {
    return false;
  }

  return true;
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);
  const [notificationPreferences, setNotificationPreferencesState] = useState(
    DEFAULT_NOTIFICATION_PREFERENCES
  );

  const activeToastRef = useRef(null);
  const toastQueueRef = useRef([]);
  const toastTimerRef = useRef(null);
  const shownToastIdsRef = useRef(new Set());
  const currentUserIdRef = useRef(null);
  const preferencesRef = useRef(DEFAULT_NOTIFICATION_PREFERENCES);

  useEffect(() => {
    activeToastRef.current = activeToast;
  }, [activeToast]);

  useEffect(() => {
    preferencesRef.current = notificationPreferences;
  }, [notificationPreferences]);

  const showNextToast = useCallback(() => {
    if (activeToastRef.current) return;

    const nextToast = toastQueueRef.current.shift();

    if (!nextToast) return;

    if (!shouldShowInAppNotification(nextToast, preferencesRef.current)) {
      window.setTimeout(() => {
        showNextToast();
      }, 0);
      return;
    }

    shownToastIdsRef.current.add(nextToast.id);
    setActiveToast(nextToast);
    activeToastRef.current = nextToast;

    toastTimerRef.current = window.setTimeout(() => {
      setActiveToast(null);
      activeToastRef.current = null;
      toastTimerRef.current = null;

      window.setTimeout(() => {
        showNextToast();
      }, 250);
    }, TOAST_DURATION);
  }, []);

  const closeToast = useCallback(() => {
    setActiveToast(null);
    activeToastRef.current = null;

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    window.setTimeout(() => {
      showNextToast();
    }, 250);
  }, [showNextToast]);

  const queueToast = useCallback(
    (notification) => {
      if (!notification?.id) return;

      if (!shouldShowInAppNotification(notification, preferencesRef.current)) {
        shownToastIdsRef.current.add(notification.id);
        return;
      }

      if (shownToastIdsRef.current.has(notification.id)) return;

      const alreadyQueued = toastQueueRef.current.some(
        (toast) => toast.id === notification.id
      );

      if (alreadyQueued) return;

      toastQueueRef.current.push(notification);

      window.setTimeout(() => {
        showNextToast();
      }, 0);
    },
    [showNextToast]
  );

  const loadNotifications = useCallback(() => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      currentUserIdRef.current = null;
      shownToastIdsRef.current = new Set();
      toastQueueRef.current = [];
      setNotifications([]);
      setActiveToast(null);
      activeToastRef.current = null;
      setNotificationPreferencesState(DEFAULT_NOTIFICATION_PREFERENCES);
      preferencesRef.current = DEFAULT_NOTIFICATION_PREFERENCES;
      return;
    }

    const preferences = getUserNotificationPreferences(currentUser);

    setNotificationPreferencesState(preferences);
    preferencesRef.current = preferences;

    const previousUserId = currentUserIdRef.current;
    const userChanged = previousUserId !== currentUser.id;

    if (userChanged) {
      shownToastIdsRef.current = new Set();
      toastQueueRef.current = [];
      setActiveToast(null);
      activeToastRef.current = null;
    }

    currentUserIdRef.current = currentUser.id;

    const userNotifications = getNotificationsForUser(currentUser.id);

    setNotifications(userNotifications);

    const unreadMessageNotifications = userNotifications
      .filter((notification) => {
        return notification.unread && notification.type === "message";
      })
      .sort((a, b) => {
        return new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time);
      });

    if (userChanged) {
      const latestUnreadMessage = unreadMessageNotifications[0];

      unreadMessageNotifications.forEach((notification) => {
        if (notification.id !== latestUnreadMessage?.id) {
          shownToastIdsRef.current.add(notification.id);
        }
      });

      if (latestUnreadMessage) {
        queueToast(latestUnreadMessage);
      }

      return;
    }

    unreadMessageNotifications.forEach((notification) => {
      queueToast(notification);
    });
  }, [queueToast]);

  useEffect(() => {
    loadNotifications();

    const handleDbChange = () => {
      loadNotifications();
    };

    window.addEventListener("demo-db-change", handleDbChange);
    window.addEventListener("demo-current-user-change", handleDbChange);
    window.addEventListener("guc-notification-preferences-change", handleDbChange);

    return () => {
      window.removeEventListener("demo-db-change", handleDbChange);
      window.removeEventListener("demo-current-user-change", handleDbChange);
      window.removeEventListener(
        "guc-notification-preferences-change",
        handleDbChange
      );

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, [loadNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((notification) =>
      shouldShowInAppNotification(notification, notificationPreferences)
    );
  }, [notifications, notificationPreferences]);

  const visibleUnreadCount = useMemo(() => {
    return visibleNotifications.filter((n) => n.unread).length;
  }, [visibleNotifications]);

  const markAsRead = useCallback((notificationId) => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) return;

    const db = getDemoDb();

    const updated = (db.notifications || []).map((item) =>
      item.id === notificationId ? { ...item, unread: false } : item
    );

    setCollection("notifications", updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) return;

    const db = getDemoDb();

    const updated = (db.notifications || []).map((item) =>
      item.userId === currentUser.id ||
      item.recipientId === currentUser.id ||
      item.toUserId === currentUser.id
        ? { ...item, unread: false }
        : item
    );

    setCollection("notifications", updated);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    const db = getDemoDb();

    const updated = (db.notifications || []).filter(
      (item) => item.id !== notificationId
    );

    setCollection("notifications", updated);
  }, []);

  const addNotification = useCallback((notification) => {
    addNotificationToStore(notification);
  }, []);

  const updateNotificationPreferences = useCallback((partialPreferences) => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) return;

    const currentPreferences = getUserNotificationPreferences(currentUser);

    const nextPreferences = {
      ...currentPreferences,
      ...partialPreferences,
    };

    setNotificationPreferencesState(nextPreferences);
    preferencesRef.current = nextPreferences;
    saveStoredNotificationPreferences(currentUser.id, nextPreferences);

    updateUser(currentUser.id, {
      notificationPreferences: nextPreferences,
      settings: {
        ...(currentUser.settings || {}),
        notifications: nextPreferences,
      },
      preferences: {
        ...(currentUser.preferences || {}),
        notifications: nextPreferences,
      },
    });

    window.dispatchEvent(
      new CustomEvent("guc-notification-preferences-change", {
        detail: {
          userId: currentUser.id,
          preferences: nextPreferences,
        },
      })
    );
  }, []);

  const setNotificationPreference = useCallback(
    (key, value) => {
      updateNotificationPreferences({
        [key]: value,
      });
    },
    [updateNotificationPreferences]
  );

  const toggleMuteAll = useCallback(() => {
    updateNotificationPreferences({
      muteAll: !preferencesRef.current.muteAll,
    });
  }, [updateNotificationPreferences]);

  const isNotificationAllowed = useCallback(
    (notification) => {
      return shouldShowInAppNotification(notification, notificationPreferences);
    },
    [notificationPreferences]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        visibleNotifications,

        unreadCount,
        visibleUnreadCount,

        notificationPreferences,
        setNotificationPreference,
        updateNotificationPreferences,
        toggleMuteAll,
        isNotificationAllowed,

        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        reloadNotifications: loadNotifications,
      }}
    >
      {children}

      <NotificationToast toast={activeToast} onClose={closeToast} />
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}