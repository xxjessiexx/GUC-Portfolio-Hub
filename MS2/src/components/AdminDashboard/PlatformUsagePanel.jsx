import { BarChart3 } from "lucide-react";
import { AdminSection, AdminMiniButton } from "./AdminDashboardPrimitives";

export default function PlatformUsagePanel({ usage }) {
  return (
    <AdminSection
      title="Platform usage"
      subtitle="Track total users, projects, courses, and role distribution across the platform."
      action={<AdminMiniButton variant="outline" icon={BarChart3}>Statistics</AdminMiniButton>}
    >
      <div className="space-y-4">
        {usage.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-[color:var(--ink)]">{item.label}</span>
              <span className="text-sm font-black text-[color:var(--primary)]">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#D8ECF8]/80 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#355872,#7AAACE,#9CD5FF)] shadow-[0_8px_20px_rgba(53,88,114,0.22)]"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
