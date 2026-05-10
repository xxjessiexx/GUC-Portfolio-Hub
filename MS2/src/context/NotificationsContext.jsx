import {
  createContext,
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
  addNotification as addNotificationToStore,
} from "@/data/demoStore";

import NotificationToast from "@/components/notificationPage/notificationsToast";

const NotificationsContext = createContext();

const TOAST_DURATION = 4000;

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  const toastQueueRef = useRef([]);
  const toastTimerRef = useRef(null);
  const shownToastIdsRef = useRef(new Set());
  const currentUserIdRef = useRef(null);

  const closeToast = () => {
    setActiveToast(null);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    window.setTimeout(() => {
      showNextToast();
    }, 250);
  };

  const showNextToast = () => {
    if (activeToast) return;

    const nextToast = toastQueueRef.current.shift();

    if (!nextToast) return;

    shownToastIdsRef.current.add(nextToast.id);
    setActiveToast(nextToast);

    toastTimerRef.current = window.setTimeout(() => {
      setActiveToast(null);
      toastTimerRef.current = null;

      window.setTimeout(() => {
        showNextToast();
      }, 250);
    }, TOAST_DURATION);
  };

  const queueToast = (notification) => {
    if (!notification?.id) return;

    if (shownToastIdsRef.current.has(notification.id)) return;

    const alreadyQueued = toastQueueRef.current.some(
      (toast) => toast.id === notification.id
    );

    if (alreadyQueued) return;

    toastQueueRef.current.push(notification);

    window.setTimeout(() => {
      showNextToast();
    }, 0);
  };

  const loadNotifications = () => {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) {
    currentUserIdRef.current = null;
    shownToastIdsRef.current = new Set();
    toastQueueRef.current = [];
    setNotifications([]);
    setActiveToast(null);
    return;
  }

  const previousUserId = currentUserIdRef.current;
  const userChanged = previousUserId !== currentUser.id;

  if (userChanged) {
    shownToastIdsRef.current = new Set();
    toastQueueRef.current = [];
    setActiveToast(null);
  }

  currentUserIdRef.current = currentUser.id;

  const userNotifications = getNotificationsForUser(currentUser.id);

  setNotifications(userNotifications);

  const unreadMessageNotifications = userNotifications
    .filter((notification) => {
      return notification.unread && notification.type === "message";
    })
    .sort((a, b) => {
      return (
        new Date(b.createdAt || b.time) -
        new Date(a.createdAt || a.time)
      );
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
};

  useEffect(() => {
    loadNotifications();

    const handleDbChange = () => {
      loadNotifications();
    };

    window.addEventListener("demo-db-change", handleDbChange);
    window.addEventListener("demo-current-user-change", handleDbChange);

    return () => {
      window.removeEventListener("demo-db-change", handleDbChange);
      window.removeEventListener("demo-current-user-change", handleDbChange);

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const markAsRead = (notificationId) => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) return;

    const db = getDemoDb();

    const updated = (db.notifications || []).map((item) =>
      item.id === notificationId
        ? { ...item, unread: false }
        : item
    );

    setCollection("notifications", updated);
  };

  const deleteNotification = (notificationId) => {
    const db = getDemoDb();

    const updated = (db.notifications || []).filter(
      (item) => item.id !== notificationId
    );

    setCollection("notifications", updated);
  };

  const addNotification = (notification) => {
    addNotificationToStore(notification);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        addNotification,
        reloadNotifications: loadNotifications,
      }}
    >
      {children}

      <NotificationToast
        toast={activeToast}
        onClose={closeToast}
      />
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}