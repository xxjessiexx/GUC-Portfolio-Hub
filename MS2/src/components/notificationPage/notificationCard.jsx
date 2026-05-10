import { AppCard } from "../ui/AppCard";
import { Check, Trash2 } from "lucide-react";

import { motion } from "framer-motion";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";



export default function NotificationCard({
  id,
  icon,
  title,
  description,
  unread,
  time,
  onDelete,
  onMarkAsRead,
}){
  return (
<motion.button
  whileHover={{ y: -3 }}
  whileTap={tapScale}
  transition={{ duration: 0.22, ease: easeOutExpo }}
  className={`w-full rounded-[26px] border p-4 text-left transition
    ${unread
      ? "bg-blue-100 dark:bg-white/[0.08] border-[color:var(--primary)]/30 hover:bg-white/200 dark:hover:bg-white/[0.07]"
      : "bg-white/80  border-[color:var(--primary)]/30 hover:bg-white/80 dark:hover:bg-white/[0.07]"
    }
    
  `}
>
  <div className="flex gap-3">
    
    {/* ICON */}
    <div className="flex h-10 w-10 items-center justify-center text-[color:var(--primary)] shrink-0">
      {icon}
    </div>

    {/* CONTENT */}
    <div className="flex-1 space-y-1">
      
      {/* top row: title + actions */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-bold text-[color:var(--ink)]">
          {title}
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          {unread && (
            <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
          )}

          {unread && (
            <button
              onClick={() => onMarkAsRead(id)}
              className="text-green-500 hover:scale-110 transition"
            >
              <Check size={16} />
            </button>
          )}

          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:scale-110 transition"
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
</motion.button>
  );
}