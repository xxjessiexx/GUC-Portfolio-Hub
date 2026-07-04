import {
  Bell,
  Mail,
  MessageCircle,
  UserPlus,
  Briefcase,
  Megaphone,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getToastText(toast) {
  return (
    toast?.text ||
    toast?.message ||
    toast?.body ||
    toast?.description ||
    toast?.content ||
    ""
  );
}

function getToastIcon(type) {
  const normalizedType = String(type || "").toLowerCase();

  if (normalizedType.includes("message") || normalizedType.includes("chat")) {
    return <Mail className="h-5 w-5" />;
  }

  if (normalizedType.includes("feedback") || normalizedType.includes("comment")) {
    return <MessageCircle className="h-5 w-5" />;
  }

  if (normalizedType.includes("invite")) {
    return <UserPlus className="h-5 w-5" />;
  }

  if (
    normalizedType.includes("internship") ||
    normalizedType.includes("application") ||
    normalizedType.includes("job")
  ) {
    return <Briefcase className="h-5 w-5" />;
  }

  if (
    normalizedType.includes("admin") ||
    normalizedType.includes("announcement")
  ) {
    return <Megaphone className="h-5 w-5" />;
  }

  return <Bell className="h-5 w-5" />;
}

function formatToastTime(time) {
  if (!time) return "Just now";

  const date = new Date(String(time).replace(" at ", " "));

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationToast({ toast, onClose }) {
  const text = getToastText(toast);
  const icon = getToastIcon(toast?.type);
  const time = formatToastTime(toast?.createdAt || toast?.time);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -18, x: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, x: 18, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          role="alert"
          className="fixed right-6 top-24 z-[9999] w-[390px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[26px] border border-[color:var(--border-soft)] bg-[#F3F8FB] shadow-[0_24px_70px_rgba(16,38,48,0.24)] ring-1 ring-black/5 dark:bg-[var(--surface)]"
        >
          <div className="relative p-4">
            <span className="absolute left-0 top-5 h-12 w-1 rounded-r-full bg-[color:var(--gold)]" />

            <div className="flex gap-3">
              <div className="relative shrink-0 self-start">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-white shadow-[var(--shadow-soft)]">
                  {icon}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#F3F8FB] bg-[color:var(--gold)] dark:border-[color:var(--surface)]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {toast?.title && (
                      <h3 className="truncate text-sm font-black text-[color:var(--ink)]">
                        {toast.title}
                      </h3>
                    )}

                    {text && (
                      <p
                        className={`line-clamp-2 text-sm font-semibold leading-5 text-[color:var(--muted)] ${
                          toast?.title ? "mt-1" : ""
                        }`}
                      >
                        {text}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-black text-[color:var(--primary)]">
                      {time}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close notification"
                    className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--muted)] transition hover:bg-[var(--surface-strong)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--gold)]/20"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}