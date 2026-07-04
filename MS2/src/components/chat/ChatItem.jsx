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
}) {
  const currentUser = getCurrentUser();
  const displayChat = getChatDisplayMeta(chat, currentUser?.id);
  const lastMessage = chat.messages?.[chat.messages.length - 1];
  const isUnread = (chat.unreadBy || []).includes(currentUser?.id);

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

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3
            className={cn(
              "truncate text-sm text-[color:var(--ink)]",
              isUnread ? "font-black" : "font-bold"
            )}
          >
            {displayChat.name}
          </h3>

          <span className="shrink-0 text-[11px] font-bold text-[color:var(--muted)]">
            {formatChatTime(lastMessage?.time)}
          </span>
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