import { CheckCheck, Trash2 } from "lucide-react";

import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsTabs from "@/components/notificationPage/notificationTabs";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

export default function Notifications() {
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications();

  const subtitle = unreadCount
    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
    : "You're all caught up.";

  const headerActions = notifications.length > 0 ? (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {unreadCount > 0 && (
        <button
          type="button"
          onClick={markAllAsRead}
          className="group inline-flex items-center gap-2 px-1 py-2 text-sm font-black text-[color:var(--primary)] transition hover:text-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20 dark:text-[color:var(--gold)]"
          aria-label="Mark all notifications as read"
        >
          <CheckCheck className="h-4 w-4 transition-transform group-hover:scale-105" />
          Mark all as read
        </button>
      )}

      <button
        type="button"
        onClick={() => setDeleteAllModalOpen(true)}
        className="group inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-sm font-black text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200/60 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
        aria-label="Delete all notifications"
      >
        <Trash2 className="h-4 w-4 transition-transform group-hover:scale-105" />
        Delete all
      </button>
    </div>
  ) : null;

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-[1480px] space-y-7">
        <PageHeader
          eyebrow="Activity Center"
          title="Notifications"
          description={subtitle}
          action={headerActions}
        />

        <NotificationsTabs notifications={notifications} />
      </section>

      <DeleteConfirmationModal
        open={deleteAllModalOpen}
        title="Delete all notifications?"
        description="All notifications in your notification center will be permanently removed. This action cannot be undone."
        confirmText="Delete all"
        onCancel={() => setDeleteAllModalOpen(false)}
        onConfirm={() => {
          deleteAllNotifications();
          setDeleteAllModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
}