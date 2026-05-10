import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { notifications as initialNotifications } from "@/data/studentDashboardData";
import { getCurrentUser } from "@/data/demoStore";

const NotificationsContext = createContext();

function getNotificationPreferences() {
  const user = getCurrentUser();
  const stored = user?.preferences?.notifications || {};

  try {
    const local = JSON.parse(localStorage.getItem("guc-portfolio-notification-preferences") || "{}");
    return { ...stored, ...local, muteAll: Boolean(user?.notificationMuted || stored.muteAll || local.muteAll) };
  } catch {
    return { ...stored, muteAll: Boolean(user?.notificationMuted || stored.muteAll) };
  }
}

function notificationAllowed(notification, prefs) {
  if (!prefs) return true;
  if (prefs.muteAll || prefs.inApp === false) return false;

  const type = String(notification?.type || "").toLowerCase();
  const title = String(notification?.title || "").toLowerCase();
  const text = String(notification?.text || notification?.message || "").toLowerCase();
  const haystack = `${type} ${title} ${text}`;

  if (prefs.messages === false && (haystack.includes("message") || haystack.includes("chat"))) return false;
  if (prefs.projectUpdates === false && haystack.includes("project")) return false;
  if (prefs.internshipUpdates === false && haystack.includes("internship")) return false;
  if (prefs.courseUpdates === false && haystack.includes("course")) return false;
  if (prefs.adminAnnouncements === false && haystack.includes("admin")) return false;

  return true;
}

function filterNotifications(list, prefs) {
  if (!Array.isArray(list)) return [];
  return list.filter((notification) => notificationAllowed(notification, prefs));
}

export function NotificationsProvider({ children }) {
  const [preferences, setPreferences] = useState(getNotificationPreferences);
  const [notifications, setRawNotifications] = useState(() => filterNotifications(initialNotifications, getNotificationPreferences()));

  useEffect(() => {
    const refresh = () => {
      const nextPrefs = getNotificationPreferences();
      setPreferences(nextPrefs);
      setRawNotifications((current) => filterNotifications(current, nextPrefs));
    };

    window.addEventListener("demo-current-user-change", refresh);
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("guc-settings-updated", refresh);
    return () => {
      window.removeEventListener("demo-current-user-change", refresh);
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("guc-settings-updated", refresh);
    };
  }, []);

  const setNotifications = useCallback((updater) => {
    setRawNotifications((current) => {
      const nextValue = typeof updater === "function" ? updater(current) : updater;
      return filterNotifications(nextValue, getNotificationPreferences());
    });
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications, notificationPreferences: preferences }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
