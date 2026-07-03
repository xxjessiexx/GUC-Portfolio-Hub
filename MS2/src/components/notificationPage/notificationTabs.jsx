import { useState } from "react";
import { motion } from "framer-motion";
import NotificationCard from "./notificationCard";
import {
  Bell,
  Grid2X2,
  Mail,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import {
  addNotification,
  getCurrentUser,
  getProjectById,
  normalizeRole,
  updateProject,
} from "@/data/demoStore";
import { cn } from "@/lib/utils";

function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Date.now()}`;
}

function getDisplayName(user) {
  return user?.name || user?.fullName || user?.email || "User";
}

function getInvitationStatus(notification, currentUser) {
  const projectId = notification.projectId || notification.relatedProjectId;
  const project = projectId ? getProjectById(projectId) : null;

  const invitation = (project?.invitationStatuses || []).find(
    (item) => String(item.userId) === String(currentUser?.id)
  );

  return invitation?.status || notification.invitationStatus || "pending";
}

export default function NotificationsTabs({ notifications }) {
  const { markAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

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

  const respondToProjectInvite = (notificationId, status) => {
    const notification = notifications.find((item) => item.id === notificationId);
    const projectId = notification?.projectId || notification?.relatedProjectId;
    const project = projectId ? getProjectById(projectId) : null;

    if (!project || !currentUser?.id) return;

    const invitationStatuses = project.invitationStatuses || [];
    const ownInvitation = invitationStatuses.find(
      (item) => String(item.userId) === String(currentUser.id)
    );

    if (!ownInvitation || ownInvitation.status !== "pending") return;

    const nextStatuses = invitationStatuses.map((item) =>
      String(item.userId) === String(currentUser.id)
        ? {
            ...item,
            status,
            respondedAt: new Date().toISOString(),
          }
        : item
    );

    const updates = { invitationStatuses: nextStatuses };

    if (status === "accepted") {
      if (ownInvitation.role === "instructor") {
        updates.instructorIds = Array.from(
          new Set([...(project.instructorIds || []), currentUser.id])
        );
      } else {
        updates.collaboratorIds = Array.from(
          new Set([...(project.collaboratorIds || []), currentUser.id])
        );
      }
    }

    updateProject(project.id, updates);

    addNotification({
      id: makeId("notification"),
      userId: project.ownerId,
      type: "project",
      title: `Project invitation ${status}`,
      text: `${getDisplayName(currentUser)} ${status} the invitation to ${project.title}.`,
      body: `${getDisplayName(currentUser)} ${status} the invitation to ${project.title}.`,
      message: `${getDisplayName(currentUser)} ${status} the invitation to ${project.title}.`,
      projectId: project.id,
      unread: true,
      createdAt: new Date().toISOString(),
      time: new Date().toLocaleString(),
    });

    markAsRead(notificationId);
    window.dispatchEvent(new Event("demo-db-change"));
  };

  const iconMap = {
    feedback: <MessageCircle className="h-5 w-5" />,
    message: <Mail className="h-5 w-5" />,
    invite: <UserPlus className="h-5 w-5" />,
    "project-invite": <UserPlus className="h-5 w-5" />,
    default: <Bell className="h-5 w-5" />,
  };

  const allTabs = [
    { key: "all", label: "All", icon: Grid2X2 },
    { key: "unread", label: "Unread", icon: Bell },
    { key: "feedback", label: "Feedback", icon: MessageCircle },
    { key: "messages", label: "Messages", icon: Mail },
    { key: "invites", label: "Invites", icon: UserPlus },
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
    if (activeTab === "invites") return n.type === "invite" || n.type === "project-invite";

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
    <div className="space-y-5">
      <div className="rounded-[28px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-2 shadow-[var(--shadow-soft)] backdrop-blur-2xl dark:bg-white/[0.035]">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            const count = counts[tab.key];

            return (
              <motion.button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20",
                  isActive
                    ? "border border-[color:var(--gold)]/45 bg-[linear-gradient(135deg,rgba(230,199,123,0.34),rgba(230,199,123,0.16))] text-[color:var(--ink)] shadow-[0_16px_35px_rgba(230,199,123,0.16)] dark:text-white"
                    : "border border-transparent text-[color:var(--muted)] hover:border-[color:var(--border-soft)] hover:bg-[var(--surface-strong)] hover:text-[color:var(--ink)] dark:hover:bg-white/[0.06]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-[color:var(--gold)]" : "text-current"
                  )}
                />

                <span>{tab.label}</span>

                {count > 0 && (
                  <span
                    className={cn(
                      "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-black",
                      isActive
                        ? "bg-[color:var(--gold)] text-[color:var(--ink)]"
                        : "bg-[color:var(--gold)]/20 text-[color:var(--primary)] dark:text-[color:var(--gold)]"
                    )}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-8 text-center text-sm font-bold text-[color:var(--muted)]">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationCard
              key={n.id}
              id={n.id}
              title={n.title}
              description={n.text || n.message || n.body || n.description}
              unread={n.unread}
              icon={iconMap[n.type] || iconMap.default}
              time={n.time}
              type={n.type}
              projectId={n.projectId || n.relatedProjectId}
              invitationStatus={getInvitationStatus(n, currentUser)}
              onDelete={handleDelete}
              onMarkAsRead={handleMarkAsRead}
              onAcceptInvite={(id) => respondToProjectInvite(id, "accepted")}
              onRejectInvite={(id) => respondToProjectInvite(id, "rejected")}
            />
          ))
        )}
      </div>
    </div>
  );
}
