import { Bell, CheckCheck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsTabs from "@/components/notificationPage/notificationTabs";
import { AppCard } from "@/components/ui/AppCard";

export default function Notifications() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const subtitle = unreadCount
    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
    : "You are all caught up.";

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-6xl">
        <AppCard className="relative overflow-hidden rounded-[32px] border-[color:var(--border-soft)] bg-[var(--surface)]/100 px-4 py-6 shadow-[var(--shadow-soft)] sm:px-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(230,199,123,0.12),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.08),transparent_72%)] blur-2xl" />

          <div className="relative mx-auto max-w-5xl">
            <header className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[color:var(--gold)]/30 bg-[linear-gradient(135deg,rgba(230,199,123,0.16),rgba(255,255,255,0.18))] text-[color:var(--gold)] shadow-[0_16px_38px_rgba(230,199,123,0.14)] sm:h-16 sm:w-16">
  <Bell className="h-7 w-7" />
</div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--primary)] dark:text-[color:var(--gold)]">
                    Activity Center
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--ink)] sm:text-4xl">
                    Notifications
                  </h1>

                  <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                    {subtitle}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
  <button
    type="button"
    onClick={markAllAsRead}
    className="inline-flex w-fit items-center gap-2 bg-transparent p-0 text-sm font-black text-[color:var(--primary)] transition-colors duration-300 hover:text-[color:var(--gold)] focus-visible:outline-none dark:text-[color:var(--gold)] dark:hover:text-white"
    aria-label="Mark all notifications as read"
  >
    <CheckCheck className="h-4 w-4" />
    Mark all as read
  </button>
)}
            </header>

            <NotificationsTabs notifications={notifications} />
          </div>
        </AppCard>
      </section>
    </DashboardLayout>
  );
}
