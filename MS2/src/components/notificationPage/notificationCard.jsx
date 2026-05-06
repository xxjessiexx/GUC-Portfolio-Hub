import { AppCard } from "../ui/AppCard";
import { Check, Trash2 } from "lucide-react";

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
    <AppCard className="p-4 flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-xl">
      
      {/* Optional Icon */}
<div className="flex h-10 w-10 items-center justify-center text-[color:var(--primary)]">
  {icon}
</div>
      

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[color:var(--ink)]">
            {title}
          </h2>

          {/* Unread dot */}
          <div className="flex items-center gap-2">
  {/* unread dot */}
  {unread && (
    <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
  )}

  {/* mark as read */}
  {unread && (
    <button
      onClick={() => onMarkAsRead(id)}
      className="text-green-500 hover:scale-110 transition"
    >
      <Check size={16} />
    </button>
  )}

  {/* delete */}
  <button
    onClick={() => onDelete(id)}
    className="text-red-500 hover:scale-110 transition"
  >
    <Trash2 size={16} />
  </button>
</div>
        </div>

        <p className="text-sm text-[color:var(--muted)]">
          {description}
        </p>

        <p className="text-xs text-[color:var(--muted)]">
  {time}
</p>
      </div>
    </AppCard>
  );
}