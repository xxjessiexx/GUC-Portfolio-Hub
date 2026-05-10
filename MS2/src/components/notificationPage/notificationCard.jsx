import { Check, Trash2 } from "lucide-react";

import { AppCard } from "../ui/AppCard";

export default function NotificationCard({
  id,
  icon,
  title,
  description,
  unread,
  time,
  onDelete,
  onMarkAsRead,
}) {
  return (
    <AppCard
      className={`w-full rounded-[26px] border p-4 text-left transition shadow-sm
        ${
          unread
            ? "!border-[color:var(--primary)]/30 !bg-blue-100"
            : "!border-[color:var(--primary)]/20 !bg-white"
        }
      `}
    >
      <div className="flex gap-3">
        {/* ICON */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[color:var(--primary)]">
          {icon}
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-1">
          {/* top row: title + actions */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-sm font-bold text-[color:var(--ink)]">
              {title}
            </h2>

            <div className="flex shrink-0 items-center gap-2">
              {unread && (
                <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
              )}

              {unread && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(id)}
                  className="text-green-500 transition hover:scale-110"
                >
                  <Check size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(id)}
                className="text-red-500 transition hover:scale-110"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* description */}
          <p className="text-sm text-[color:var(--muted)]">
            {description}
          </p>

          {/* time */}
          <p className="text-xs text-[color:var(--muted)]">
            {time}
          </p>
        </div>
      </div>
    </AppCard>
  );
}