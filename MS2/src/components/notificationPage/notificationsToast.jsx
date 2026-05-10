import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationToast({ toast, onClose }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -14, x: 18 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -14, x: 18 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="alert"
          className="fixed right-6 top-24 z-[9999] w-[380px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.16)]"
        >
          <div className="relative py-4 pl-5 pr-3">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-[color:var(--primary)]" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {toast.title && (
                  <h3 className="text-sm font-semibold leading-5 text-slate-900">
                    {toast.title}
                  </h3>
                )}

                <p
                  className={`line-clamp-2 text-sm leading-5 text-slate-600 ${
                    toast.title ? "mt-0.5" : ""
                  }`}
                >
                  {toast.text}
                </p>

                {toast.time && (
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {toast.time}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}