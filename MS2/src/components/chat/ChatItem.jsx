import { Pin } from "lucide-react";

import {
  getChatDisplayMeta,
  getCurrentUser,
} from "@/data/demoStore";
import { cn } from "@/lib/utils";

function formatChatTime(time) {
  if (!time) return "";

  const date = new Date(String(time).replace(" at ", " "));

  if (Number.isNaN(date.getTime())) {
    return time;
  }

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
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

export default function ChatItem({
  chat,
  isActive,
  onClick,
  pinned = false,
  onTogglePin,
}) {
  const currentUser = getCurrentUser();
  const displayChat = getChatDisplayMeta(chat, currentUser?.id);

  const lastMessage =
    chat.messages?.[chat.messages.length - 1];

  const isUnread = (chat.unreadBy || []).includes(
    currentUser?.id
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-[24px] border p-3 text-left transition-all duration-300",
        isActive
          ? "border-[color:var(--gold)]/40 bg-[linear-gradient(135deg,rgba(230,199,123,0.22),var(--surface))] shadow-[0_16px_36px_rgba(230,199,123,0.12)]"
          : "border-transparent bg-transparent hover:border-[color:var(--border-soft)] hover:bg-[var(--surface)]"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-[color:var(--gold)]" />
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-sm font-black text-white shadow-[var(--shadow-soft)]">
          {displayChat.image ? (
            <img
              src={displayChat.image}
              alt={displayChat.name}
              className="h-full w-full object-cover"
            />
          ) : (
            displayChat.avatar
          )}
        </div>

        {displayChat.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
        )}

        {isUnread && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--gold)] px-1 text-[10px] font-black text-[color:var(--ink)] shadow-[0_8px_18px_rgba(230,199,123,0.35)]">
            1
          </span>
        )}
      </div>

      {/* Chat content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "min-w-0 flex-1 truncate text-sm text-[color:var(--ink)]",
              isUnread ? "font-black" : "font-bold"
            )}
          >
            {displayChat.name}
          </h3>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[11px] font-bold text-[color:var(--muted)]">
              {formatChatTime(lastMessage?.time)}
            </span>

            <span
              role="button"
              tabIndex={0}
              aria-label={
                pinned
                  ? `Unpin conversation with ${displayChat.name}`
                  : `Pin conversation with ${displayChat.name}`
              }
              title={
                pinned
                  ? "Unpin conversation"
                  : "Pin conversation"
              }
              onClick={(event) => {
                event.stopPropagation();
                onTogglePin?.(chat);
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  onTogglePin?.(chat);
                }
              }}
              className={cn(
                "grid h-7 w-7 cursor-pointer place-items-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/45",
                pinned
                  ? "bg-[color:var(--gold)]/14 text-[color:var(--gold)] opacity-100"
                  : "text-[color:var(--muted)] opacity-0 hover:bg-[color:var(--primary)]/7 hover:text-[color:var(--primary)] group-hover:opacity-60"
              )}
            >
              <Pin
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  pinned && "rotate-[-10deg]"
                )}
              />
            </span>
          </div>
        </div>

        <p
          className={cn(
            "mt-1 truncate text-xs leading-5",
            isUnread
              ? "font-black text-[color:var(--primary)]"
              : "font-semibold text-[color:var(--muted)]"
          )}
        >
          {lastMessage?.text?.trim()
            ? lastMessage.text
            : lastMessage?.attachments?.length > 0
              ? `📎 ${lastMessage.attachments[0].name}`
              : "No messages yet."}
        </p>
      </div>
    </button>
  );
}