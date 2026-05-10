import { useState } from "react";
import { motion } from "framer-motion";
import NotificationCard from "./notificationCard";
import { MessageCircle, Bell, Mail, UserPlus } from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import { getCurrentUser, normalizeRole } from "@/data/demoStore";

export default function NotificationsTabs({ notifications }) {
  const { markAsRead, deleteNotification } = useNotifications();

  const currentUser = getCurrentUser();
  const role = normalizeRole(
    currentUser?.role ||
      currentUser?.accountRole ||
      currentUser?.systemRole ||
      currentUser?.userType
  );

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const [activeTab, setActiveTab] = useState("all");

  const iconMap = {
    feedback: <MessageCircle className="h-5 w-5" />,
    message: <Mail className="h-5 w-5" />,
    invite: <UserPlus className="h-5 w-5" />,
    "project-invite": <UserPlus className="h-5 w-5" />,
    default: <Bell className="h-5 w-5" />,
  };

  const allTabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "feedback", label: "Feedback" },
    { key: "messages", label: "Messages" },
    { key: "invites", label: "Invites" },
  ];

  const tabsByRole = {
    student: ["all", "unread", "feedback", "messages", "invites"],
    instructor: ["all", "unread", "invites", "messages"],
    employer: ["all", "unread"],
    admin: ["all", "unread"],
  };

  const allowedTabKeys = tabsByRole[role] || tabsByRole.student;

  const tabs = allTabs.filter((tab) => allowedTabKeys.includes(tab.key));

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "feedback") return n.type === "feedback";
    if (activeTab === "messages") return n.type === "message";
    if (activeTab === "invites") {
      return n.type === "invite" || n.type === "project-invite";
    }

    return true;
  });

  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => n.unread).length,
    feedback: notifications.filter((n) => n.type === "feedback").length,
    messages: notifications.filter((n) => n.type === "message").length,
    invites: notifications.filter(
      (n) => n.type === "invite" || n.type === "project-invite"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 border
              ${
                isActive
                  ? "border-[var(--dark)] bg-white/10 text-[var(--dark)]/70"
                  : "border-white/10 bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.label}</span>

              {/* Count badge */}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold
                ${
                  isActive
                    ? "border border-[var(--dark)] bg-white/10 text-[var(--dark)]/70"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {counts[tab.key]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No notifications</p>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationCard
              key={n.id}
              id={n.id}
              title={n.title}
              description={n.text}
              unread={n.unread}
              icon={iconMap[n.type] || iconMap.default}
              time={n.time}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}