import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  getNotificationsForUser,
  setCollection,
  addNotification as addNotificationToStore,
} from "@/data/demoStore";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // LOAD notifications for current logged in user
  const loadNotifications = () => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      setNotifications([]);
      return;
    }
    console.log(currentUser);

    const userNotifications = getNotificationsForUser(currentUser.id);

    console.log(userNotifications);

    setNotifications(userNotifications);
  };

  // first load
  useEffect(() => {
    loadNotifications();

    // refresh when db changes
    const handleDbChange = () => {
      loadNotifications();
    };

    window.addEventListener("demo-db-change", handleDbChange);
    window.addEventListener(
      "demo-current-user-change",
      handleDbChange
    );

    return () => {
      window.removeEventListener(
        "demo-db-change",
        handleDbChange
      );

      window.removeEventListener(
        "demo-current-user-change",
        handleDbChange
      );
    };
  }, []);

  // unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);
//mark as read 
const markAsRead = (notificationId) => {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) return;

  const allNotifications =
    JSON.parse(localStorage.getItem("guc_demo_database_v8"))?.notifications ||
    [];

  const updated = allNotifications.map((item) =>
    item.id === notificationId
      ? { ...item, unread: false }
      : item
  );

  setCollection("notifications", updated);
};
//delete
const deleteNotification = (notificationId) => {
  const allNotifications =
    JSON.parse(localStorage.getItem("guc_demo_database_v8"))?.notifications ||
    [];

  const updated = allNotifications.filter(
    (item) => item.id !== notificationId
  );

  setCollection("notifications", updated);
};

  // ADD NEW
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
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}