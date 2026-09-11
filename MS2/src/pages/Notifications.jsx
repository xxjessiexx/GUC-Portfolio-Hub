import { CheckCheck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsTabs from "@/components/notificationPage/notificationTabs";

export default function Notifications() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const subtitle = unreadCount
    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
    : "You're all caught up.";

  const markAllAction = unreadCount > 0 ? (
    <button
      type="button"
      onClick={markAllAsRead}
      className="group inline-flex items-center gap-2 px-1 py-2 text-sm font-black text-[color:var(--primary)] transition hover:text-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20 dark:text-[color:var(--gold)]"
      aria-label="Mark all notifications as read"
    >
      <CheckCheck className="h-4 w-4 transition-transform group-hover:scale-105" />
      Mark all as read
    </button>
  ) : null;

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-[1480px] space-y-7">
        <PageHeader
          eyebrow="Activity Center"
          title="Notifications"
          description={subtitle}
          action={markAllAction}
        />

        <NotificationsTabs notifications={notifications} />
      </section>
    </DashboardLayout>
  );
}
