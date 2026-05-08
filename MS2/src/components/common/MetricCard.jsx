import { AppCard } from "@/components/ui/AppCard";

export default function MetricCard({ title, value, icon: Icon, helper }) {
  return (
    <AppCard className="p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--accent)]/25 text-[color:var(--primary)]">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-black text-[color:var(--muted)]">
            {title}
          </p>

          <p className="mt-1 text-4xl font-black text-[color:var(--ink)]">
            {value}
          </p>

          {helper && (
            <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
              {helper}
            </p>
          )}
        </div>
      </div>
    </AppCard>
  );
}