import { AppCard } from "@/components/ui/AppCard";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <AppCard className="p-5">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(156,213,255,0.3)]">
        <Icon className="h-5 w-5 text-[var(--primary)]" />
      </div>

      <p className="text-3xl font-black text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{title}</p>
    </AppCard>
  );
}