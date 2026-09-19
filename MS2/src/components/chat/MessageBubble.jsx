import {
  Check,
  Download,
  Paperclip,
} from "lucide-react";

import { cn } from "@/lib/utils";

function formatMessageTime(time) {
  if (!time) return "";

  const date = new Date(String(time).replace(" at ", " "));

  if (Number.isNaN(date.getTime())) {
    return time;
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFileSize(size) {
  if (!size) return "";

  if (size < 1024) return `${size} B`;

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MessageBubble({
  message,
  currentUserId,
}) {
  const isMe =
    String(message.senderId) === String(currentUserId);

  const attachments = message.attachments || [];

  /*
    A message is considered read when someone other than
    the sender exists inside readBy.
  */
  const isRead =
    isMe &&
    Array.isArray(message.readBy) &&
    message.readBy.some(
      (readerId) =>
        String(readerId) !== String(currentUserId)
    );

  return (
    <div
      className={cn(
        "flex min-w-0",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] min-w-0 rounded-[26px] px-5 py-3.5 shadow-sm",

          isMe
            ? "rounded-br-md bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white shadow-[0_16px_32px_rgba(53,88,114,0.22)]"
            : "rounded-bl-md border border-[color:var(--border-soft)] bg-[var(--surface)] text-[color:var(--ink)]"
        )}
      >
        {/* Message text */}
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere]">
            {message.text}
          </p>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div
            className={cn(
              "space-y-2",
              message.text ? "mt-3" : ""
            )}
          >
            {attachments.map((file) => (
              <a
                key={file.id || file.name}
                href={file.dataUrl}
                download={file.name}
                className={cn(
                  "flex max-w-full items-center gap-3 rounded-2xl border px-3 py-2 transition",

                  isMe
                    ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
                    : "border-[color:var(--border-soft)] bg-[var(--surface-soft)] text-[color:var(--primary)] hover:bg-[var(--surface-strong)]"
                )}
              >
                <Paperclip className="h-4 w-4 shrink-0" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-black">
                    {file.name}
                  </span>

                  <span
                    className={cn(
                      "block text-[11px] font-bold",

                      isMe
                        ? "text-white/65"
                        : "text-[color:var(--muted)]"
                    )}
                  >
                    {formatFileSize(file.size)}
                  </span>
                </span>

                <Download className="h-4 w-4 shrink-0" />
              </a>
            ))}
          </div>
        )}

        {/* Time + delivered/read state */}
        <div
          className={cn(
            "mt-1 flex items-center gap-1.5",

            isMe
              ? "justify-end"
              : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-[11px] font-bold",

              isMe
                ? "text-white/65"
                : "text-[color:var(--muted)]"
            )}
          >
            {formatMessageTime(message.time)}
          </span>

          {/* Only outgoing messages get delivery/read checks */}
          {isMe && (
            <span
              className={cn(
                "relative ml-0.5 inline-flex h-4 w-[20px] shrink-0 items-center",

                isRead
                  ? "text-[color:var(--gold)]"
                  : "text-white/55"
              )}
              title={isRead ? "Read" : "Delivered"}
            >
              <Check className="absolute left-0 h-3.5 w-3.5 stroke-[2.2]" />

              <Check className="absolute left-[6px] h-3.5 w-3.5 stroke-[2.2]" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}