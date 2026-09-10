import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./notificationCard";
import Pagination from "@/components/common/Pagination";
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

const PAGE_SIZE = 6;

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

function getNotificationDate(notification) {
  const raw = notification.createdAt || notification.time;
  if (!raw) return null;

  const normalized =
    typeof raw === "string" ? raw.replace(" at ", " ") : raw;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getDateGroup(notification) {
  const date = getNotificationDate(notification);
  if (!date) return "Earlier";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfNotificationDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.round(
    (startOfToday.getTime() - startOfNotificationDay.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return "This week";
  return "Earlier";
}

function formatGroupDate(notification, group) {
  const date = getNotificationDate(notification);
  if (!date) return "";

  if (group === "Today" || group === "Yesterday") {
    return date
      .toLocaleDateString([], {
        day: "numeric",
        month: "long",
      })
      .toUpperCase();
  }

  return "";
}


function getEmptyStateMessage(activeTab) {
  const messages = {
    all: "You're all caught up — nothing needs your attention right now.",
    unread: "Everything is read — nice work.",
    feedback: "No feedback notifications yet.",
    messages: "No message notifications yet.",
    invites: "No invitations waiting right now.",
  };

  return messages[activeTab] || "You do not have any notifications here yet.";
}

export default function NotificationsTabs({ notifications }) {
  const { markAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const listTopRef = useRef(null);

  const currentUser = getCurrentUser();
  const role = normalizeRole(
    currentUser?.role ||
      currentUser?.accountRole ||
      currentUser?.systemRole ||
      currentUser?.userType
  );

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


  const getNotificationDestination = (notification) => {
    const projectId = notification.projectId || notification.relatedProjectId;
    const internshipId =
      notification.internshipId || notification.relatedInternshipId;
    const chatId = notification.chatId;
    const relatedUserId =
      notification.fromUserId || notification.relatedUserId;

    if (notification.type === "message") {
      if (chatId) return `/chat?chatId=${encodeURIComponent(chatId)}`;
      if (relatedUserId) {
        return `/chat?targetUserId=${encodeURIComponent(relatedUserId)}`;
      }
      return "/chat";
    }

    if (notification.type === "invite" || notification.type === "project-invite") {
      const status = getInvitationStatus(notification, currentUser);
      if (status === "pending") return "/invitations";
      if (projectId) return `/project?projectId=${encodeURIComponent(projectId)}`;
      return "/invitations";
    }

    if (
      notification.type === "feedback" ||
      notification.type === "flag" ||
      notification.type === "project"
    ) {
      if (projectId) return `/project?projectId=${encodeURIComponent(projectId)}`;
      return role === "student" ? "/view-all-projects" : null;
    }

    if (
      notification.type === "internship" ||
      notification.type === "application"
    ) {
      if (role === "student") return "/my-applications";

      if (role === "employer" && internshipId) {
        return `/manage-applicants/${encodeURIComponent(internshipId)}`;
      }

      if (internshipId) {
        return `/internships/${encodeURIComponent(internshipId)}`;
      }
    }

    if (notification.type === "link-request" && role === "admin") {
      return "/admin/link-requests";
    }

    if (projectId) return `/project?projectId=${encodeURIComponent(projectId)}`;
    if (internshipId) return `/internships/${encodeURIComponent(internshipId)}`;

    return null;
  };

  const filteredNotifications = useMemo(() => {
    const filtered = notifications.filter((n) => {
      if (activeTab === "unread") return n.unread;
      if (activeTab === "feedback") return n.type === "feedback";
      if (activeTab === "messages") return n.type === "message";
      if (activeTab === "invites") {
        return n.type === "invite" || n.type === "project-invite";
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      const aDate = getNotificationDate(a)?.getTime() ?? 0;
      const bDate = getNotificationDate(b)?.getTime() ?? 0;
      return bDate - aDate;
    });
  }, [notifications, activeTab]);

  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => n.unread).length,
    feedback: notifications.filter((n) => n.type === "feedback").length,
    messages: notifications.filter((n) => n.type === "message").length,
    invites: notifications.filter(
      (n) => n.type === "invite" || n.type === "project-invite"
    ).length,
  };

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * PAGE_SIZE;
  const visibleNotifications = filteredNotifications.slice(
    pageStartIndex,
    pageStartIndex + PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
    requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 border-y border-[color:var(--border-soft)] py-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const count = counts[tab.key];
          const isUnreadTab = tab.key === "unread";

          return (
            <motion.button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20",
                isActive
                  ? "border-[color:var(--gold)]/70 bg-[linear-gradient(135deg,rgba(230,199,123,0.34),rgba(255,249,229,0.96))] text-[color:var(--ink)] shadow-[0_8px_22px_rgba(124,96,35,0.13)]"
                  : isUnreadTab && count > 0
                    ? "border-[color:var(--gold)]/35 bg-[color:var(--gold)]/10 text-[color:var(--primary)] hover:border-[color:var(--gold)]/55 hover:bg-[color:var(--gold)]/16"
                    : "border-transparent bg-transparent text-[color:var(--muted)] hover:border-white/70 hover:bg-white/55 hover:text-[color:var(--ink)]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-[color:var(--gold)]"
                    : isUnreadTab && count > 0
                      ? "text-[color:var(--gold)]"
                      : "text-current"
                )}
              />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-black",
                    isActive
                      ? "bg-[color:var(--primary)] text-white"
                      : isUnreadTab
                        ? "bg-[color:var(--gold)] text-[color:var(--ink)]"
                        : "bg-white/70 text-[color:var(--primary)]"
                  )}
                >
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div ref={listTopRef} className="scroll-mt-28">
        {filteredNotifications.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[28px] border border-[color:var(--border-soft)] bg-white/35 px-6 py-12 text-center shadow-[var(--shadow-soft)] backdrop-blur-sm dark:bg-white/[0.025]">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-[color:var(--ink)]">
              No notifications here
            </h3>
            <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-[color:var(--muted)]">
              {getEmptyStateMessage(activeTab)}
            </p>
          </div>
        ) : (
          <div className="space-y-8" data-notifications-list>
            {(() => {
              const groupOrder = ["Today", "Yesterday", "This week", "Earlier"];

              const grouped = groupOrder
                .map((label) => ({
                  label,
                  items: visibleNotifications.filter(
                    (notification) => getDateGroup(notification) === label
                  ),
                }))
                .filter((group) => group.items.length > 0);

              return grouped.map((group) => {
                const dateLabel = formatGroupDate(group.items[0], group.label);

                return (
                  <section
                    key={group.label}
                    className="space-y-3"
                    aria-labelledby={`notification-group-${group.label
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    <div className="flex items-center gap-3 px-1">
                      <h3
                        id={`notification-group-${group.label
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        className="text-[11px] font-black uppercase tracking-[0.16em] text-[color:var(--primary)]"
                      >
                        {group.label}
                      </h3>

                      {dateLabel && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                          · {dateLabel}
                        </span>
                      )}

                      <div className="h-px flex-1 bg-[color:var(--border-soft)]" />
                    </div>

                    <div className="space-y-3">
                      {group.items.map((n) => {
                        const destination = getNotificationDestination(n);

                        return (
                          <NotificationCard
                            key={n.id}
                            id={n.id}
                            title={n.title}
                            description={
                              n.text || n.message || n.body || n.description
                            }
                            unread={n.unread}
                            icon={iconMap[n.type] || iconMap.default}
                            time={n.createdAt || n.time}
                            type={n.type}
                            invitationStatus={getInvitationStatus(
                              n,
                              currentUser
                            )}
                            onOpen={
                              destination
                                ? () => navigate(destination)
                                : undefined
                            }
                            onDelete={deleteNotification}
                            onMarkAsRead={markAsRead}
                            onAcceptInvite={(id) =>
                              respondToProjectInvite(id, "accepted")
                            }
                            onRejectInvite={(id) =>
                              respondToProjectInvite(id, "rejected")
                            }
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              });
            })()}
          </div>
        )}

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filteredNotifications.length}
          pageStartIndex={pageStartIndex}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          ariaLabel="Notifications pagination"
        />
      </div>
    </div>
  );
}
