import { createContext, useContext, useState } from "react";
import { notifications as initialNotifications } from "@/data/studentDashboardData";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
const [notifications, setNotifications] = useState(initialNotifications);



return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
    {children}
    </NotificationsContext.Provider>
);
}

export function useNotifications() {
return useContext(NotificationsContext);
}