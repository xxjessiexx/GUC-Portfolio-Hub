import { BarChart3 } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

function Bar({ label, value, max }) {
  const width = Math.max(8, Math.round((value / max) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-[color:var(--ink)]"><span>{label}</span><span>{value}</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-[color:var(--accent)]/15"><div className="h-full rounded-full bg-[var(--gradient-brand)]" style={{ width: `${width}%` }} /></div>
    </div>
  );
}

export default function AdminStatistics() {
  const { statistics } = useAdminModuleData();
  const maxMonthly = Math.max(...statistics.monthlyProjects);
  const maxRoles = Math.max(...statistics.roleDistribution.map((item) => item.value));

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Platform analytics" title="Usage statistics" description="Prototype statistics for platform usage, project creation, employer activity and internship growth." icon={BarChart3} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active users", statistics.activeUsers],
          ["Total projects", statistics.totalProjects],
          ["Internships offered", statistics.internshipsOffered],
          ["Completed internships", statistics.completedInternships],
        ].map(([label, value]) => (
          <AppCard key={label} variant="glass" radius="lg" padding="lg"><p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p><p className="mt-3 text-3xl font-black text-[color:var(--primary)]">{value}</p></AppCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppCard variant="glass" radius="lg" padding="lg">
          <SectionHeader eyebrow="Projects" title="Project creation over time" subtitle="Monthly project submissions in the platform prototype." />
          <div className="mt-6 space-y-4">{statistics.monthlyProjects.map((value, index) => <Bar key={index} label={`Month ${index + 1}`} value={value} max={maxMonthly} />)}</div>
        </AppCard>
        <AppCard variant="glass" radius="lg" padding="lg">
          <SectionHeader eyebrow="Users" title="Role distribution" subtitle="Active platform accounts grouped by stakeholder role." />
          <div className="mt-6 space-y-4">{statistics.roleDistribution.map((item) => <Bar key={item.label} label={item.label} value={item.value} max={maxRoles} />)}</div>
        </AppCard>
      </div>
    </AdminPageShell>
  );
}
