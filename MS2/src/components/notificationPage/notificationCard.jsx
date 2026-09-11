import { Bell, Check, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AppCard } from "../ui/AppCard";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { cn } from "@/lib/utils";

function formatNotificationTime(time) {
  if (!time) return "";

  const normalizedTime =
    typeof time === "string" ? time.replace(" at ", " ") : time;

  const date = new Date(normalizedTime);

  if (Number.isNaN(date.getTime())) {
    return time;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const isSameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const isSameYear = date.getFullYear() === now.getFullYear();

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24 && isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return date.toLocaleDateString([], {
      weekday: "long",
    });
  }

  if (isSameYear) {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotificationCard({
  id,
  icon,
  title,
  description,
  unread,
  attention = false,
  time,
  type,
  invitationStatus,
  onOpen,
  onDelete,
  onMarkAsRead,
  onAcceptInvite,
  onRejectInvite,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);

  const menuRef = useRef(null);

  const isProjectInvite = type === "project-invite" || type === "invite";
  const displayTime = formatNotificationTime(time);

  const cardSurfaceClass = attention
    ? "border-[color:var(--gold)]/80 bg-[linear-gradient(105deg,rgba(230,199,123,0.40)_0%,rgba(248,235,194,0.90)_22%,rgba(255,251,235,0.99)_54%,rgba(255,255,255,0.97)_100%)] shadow-[0_18px_42px_rgba(124,96,35,0.19)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(124,96,35,0.24)]"
    : unread
      ? "border-[color:var(--gold)]/60 bg-[linear-gradient(105deg,rgba(230,199,123,0.30)_0%,rgba(247,235,198,0.82)_18%,rgba(255,252,242,0.98)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_16px_38px_rgba(124,96,35,0.15)] hover:-translate-y-0.5 hover:border-[color:var(--gold)]/75 hover:shadow-[0_20px_44px_rgba(124,96,35,0.20)] dark:bg-[linear-gradient(105deg,rgba(230,199,123,0.16),rgba(255,255,255,0.055))]"
      : "border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.88)] shadow-[0_8px_24px_rgba(53,88,114,0.06)] hover:-translate-y-0.5 hover:border-[color:var(--accent)]/30 hover:bg-[rgba(255,255,255,0.96)] hover:shadow-[0_14px_32px_rgba(53,88,114,0.09)] dark:bg-white/[0.035] dark:hover:bg-white/[0.055]";

  const handleCardClick = () => {
    if (unread) {
      onMarkAsRead?.(id);
    }
    onOpen?.();
  };

  const handleCardKeyDown = (event) => {
    if (!onOpen || event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleMarkAsRead = (event) => {
    event.stopPropagation();
    onMarkAsRead(id);
    setMenuOpen(false);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setMenuOpen(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleMenuToggle = (event) => {
    event.stopPropagation();

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const dropdownHeight = 135;

    const notificationsList = event.currentTarget.closest(
      "[data-notifications-list]"
    );

    const listBottom =
      notificationsList?.getBoundingClientRect().bottom ?? window.innerHeight;

    const spaceBelowInList = listBottom - buttonRect.bottom;
    const spaceBelowInViewport = window.innerHeight - buttonRect.bottom;

    setOpenUpward(
      spaceBelowInList < dropdownHeight || spaceBelowInViewport < dropdownHeight
    );

    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn("relative", menuOpen ? "z-50" : "z-0")}
      >
        <AppCard
          onClick={handleCardClick}
          onKeyDown={handleCardKeyDown}
          role={onOpen ? "button" : undefined}
          tabIndex={onOpen ? 0 : undefined}
          className={cn(
            "relative group w-full overflow-visible rounded-[24px] border px-5 py-4 text-left transition-all duration-200",
            onOpen &&
              "cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20",
            cardSurfaceClass
          )}
        >
          {(unread || attention) && (
            <span
              className={cn(
                "absolute left-0 rounded-r-full bg-[color:var(--gold)]",
                attention
                  ? "top-3 h-12 w-[5px] shadow-[0_0_20px_rgba(230,199,123,0.58)]"
                  : "top-4 h-10 w-[4px] shadow-[0_0_16px_rgba(230,199,123,0.45)]"
              )}
            />
          )}

          <div className="flex gap-4">
            <div className="relative shrink-0 self-start">
              <div
                className={cn(
                  "grid place-items-center bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white transition-all",
                  attention
                    ? "h-12 w-12 rounded-2xl shadow-[0_10px_24px_rgba(24,50,71,0.20)]"
                    : "h-11 w-11 rounded-[14px] shadow-[0_7px_18px_rgba(24,50,71,0.14)]"
                )}
              >
                {icon || <Bell className="h-5 w-5" />}
              </div>

              {unread && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[color:var(--gold)] shadow-[0_0_12px_rgba(230,199,123,0.55)]" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-[color:var(--ink)]">
                    {title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-[color:var(--muted)]">
                    {description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-[color:var(--muted)]">
                  <span className="hidden text-xs font-bold sm:inline">
                    {displayTime}
                  </span>

                  <div ref={menuRef} className="relative">
                    <button
                      type="button"
                      onClick={handleMenuToggle}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20",
                        menuOpen
                          ? "bg-[var(--surface-strong)] text-[color:var(--primary)] shadow-sm"
                          : "text-[color:var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[color:var(--primary)]"
                      )}
                      aria-label="Notification options"
                      aria-expanded={menuOpen}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuOpen && (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        className={cn(
                          "absolute right-0 z-[999] w-48 overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[#F3F8FB] p-2 shadow-[0_22px_60px_rgba(16,38,48,0.28)] ring-1 ring-black/5 dark:bg-[var(--surface)]",
                          openUpward ? "bottom-11" : "top-11"
                        )}
                      >
                        {unread && (
                          <button
                            type="button"
                            onClick={handleMarkAsRead}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-black text-[color:var(--primary)] transition-colors duration-200 hover:bg-[rgba(230,199,123,0.28)] hover:text-[color:var(--ink)] dark:text-white dark:hover:bg-white/10"
                          >
                            <Check className="h-4 w-4" />
                            Mark as read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleDeleteClick}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-black text-rose-600 transition-colors duration-200 hover:bg-[rgba(244,63,94,0.14)] hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isProjectInvite && invitationStatus === "pending" && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAcceptInvite?.(id);
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-[12px] bg-[color:var(--primary)] px-4 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(53,88,114,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRejectInvite?.(id);
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-[12px] border border-[color:var(--border-soft)] bg-white/55 px-4 text-xs font-black text-[color:var(--primary)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                  >
                    Decline
                  </button>
                </div>
              )}

              {isProjectInvite &&
                invitationStatus &&
                invitationStatus !== "pending" && (
                  <p className="text-xs font-black capitalize text-[color:var(--primary)] dark:text-[color:var(--gold)]">
                    Invitation {invitationStatus}
                  </p>
                )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 sm:hidden">
                <p className="text-xs font-bold text-[color:var(--muted)]">
                  {displayTime}
                </p>
              </div>
            </div>
          </div>
        </AppCard>
      </motion.div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Delete notification?"
        description="This notification will be removed from your notification center. This action cannot be undone."
        confirmText="Delete"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}