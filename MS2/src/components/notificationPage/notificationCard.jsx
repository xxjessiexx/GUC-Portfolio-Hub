import { Check, ExternalLink, Trash2, X } from "lucide-react";

import { AppCard } from "../ui/AppCard";

export default function NotificationCard({
  id,
  icon,
  title,
  description,
  unread,
  time,
  type,
  projectId,
  invitationStatus,
  onDelete,
  onMarkAsRead,
  onAcceptInvite,
  onRejectInvite,
}) {
  const isProjectInvite = type === "project-invite" || type === "invite";
  const canRespondToInvite =
    isProjectInvite && (!invitationStatus || invitationStatus === "pending");

  return (
    <AppCard
      className={`w-full rounded-[26px] border p-4 text-left shadow-sm transition
        ${
          unread
            ? "!border-[color:var(--primary)]/30 !bg-blue-100"
            : "!border-[color:var(--primary)]/20 !bg-white"
        }
      `}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[color:var(--primary)]">
          {icon}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
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
                  aria-label="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(id)}
                className="text-red-500 transition hover:scale-110"
                aria-label="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-sm text-[color:var(--muted)]">{description}</p>

          {isProjectInvite && invitationStatus && invitationStatus !== "pending" && (
            <p className="text-xs font-black capitalize text-[color:var(--primary)]">
              Invitation {invitationStatus}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-[color:var(--muted)]">{time}</p>

            <div className="flex flex-wrap items-center gap-2">
              {projectId && (
                <a
                  href={`/project?projectId=${projectId}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--primary)]/15 bg-white px-3 py-1.5 text-xs font-black text-[color:var(--primary)] transition hover:bg-[rgba(156,213,255,0.16)]"
                >
                  View project
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {canRespondToInvite && (
                <>
                  <button
                    type="button"
                    onClick={() => onAcceptInvite(id)}
                    className="rounded-xl bg-[color:var(--primary)] px-3 py-1.5 text-xs font-black text-white transition hover:opacity-90"
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => onRejectInvite(id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
