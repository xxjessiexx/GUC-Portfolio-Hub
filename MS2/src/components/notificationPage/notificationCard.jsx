import { AppCard } from "../ui/AppCard";

export default function NotificationCard({ icon, title, description, unread }) {
  return (
    <AppCard className="p-4 flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-xl">
      
      {/* Optional Icon */}
<div className="flex h-10 w-10 items-center justify-center text-[color:var(--primary)]">
  {icon}
</div>
      

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[color:var(--ink)">
            {title}
          </h2>

          {/* Unread dot */}
          {unread && (
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
          )}
        </div>

        <p className="text-sm text-[color:var(--muted)">
          {description}
        </p>
      </div>
    </AppCard>
  );
}