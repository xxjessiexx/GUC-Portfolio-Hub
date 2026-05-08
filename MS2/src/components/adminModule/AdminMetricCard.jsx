import { AppCard } from "@/components/ui/AppCard";

const toneClass = {
  info: "bg-[color:var(--accent)]/20 text-[color:var(--primary)]",
  warning: "bg-[color:var(--gold)]/20 text-[color:var(--primary)]",
  success: "bg-emerald-500/10 text-emerald-700",
  danger: "bg-red-500/10 text-red-700",
  gold: "bg-[color:var(--gold)]/20 text-[color:var(--primary)]",
};

export function AdminMetricCard({ label, value, detail, tone = "info", icon: Icon }) {
  return (
    <AppCard variant="glass" radius="lg" padding="lg" hover>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
          <p className="mt-3 text-3xl font-black text-[color:var(--ink)]">{value}</p>
          <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">{detail}</p>
        </div>
        {Icon && <div className={`grid h-12 w-12 place-items-center rounded-2xl ${toneClass[tone] || toneClass.info}`}><Icon className="h-5 w-5" /></div>}
      </div>
    </AppCard>
  );
}
