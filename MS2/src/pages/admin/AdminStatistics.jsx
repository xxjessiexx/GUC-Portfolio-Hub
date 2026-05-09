import { motion } from "framer-motion";
import { BarChart3, BriefcaseBusiness, BookOpen, FolderKanban, Users } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

function Bar({ label, value, max }) {
  const width = Math.max(8, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-[color:var(--ink)]"><span>{label}</span><span>{value}</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-[color:var(--accent)]/15"><motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-[var(--gradient-brand)]" /></div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
      <AppCard variant="glass" radius="lg" padding="lg" className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p><p className="mt-3 text-3xl font-black text-[color:var(--primary)]">{value}</p>{detail ? <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">{detail}</p> : null}</div>
          <div className="rounded-2xl bg-[color:var(--accent)]/15 p-3 text-[color:var(--primary)]"><Icon className="size-5" /></div>
        </div>
      </AppCard>
    </motion.div>
  );
}

export default function AdminStatistics() {
  const { statistics } = useAdminModuleData();
  const maxMonthly = Math.max(...statistics.monthlyProjects);
  const maxRoles = Math.max(...statistics.roleDistribution.map((item) => item.value));
  const maxEmployer = Math.max(...(statistics.employerStatus || []).map((item) => item.value), 1);
  const maxModeration = Math.max(...(statistics.projectModeration || []).map((item) => item.value), 1);
  const instructors = statistics.roleDistribution.find((item) => item.label === "Instructors")?.value || 0;

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Platform analytics" title="Usage statistics" description="A more visual admin analytics page for total users, projects, courses, instructors, employer approvals, and moderation state." icon={BarChart3} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Active users" value={statistics.activeUsers} detail="All stakeholder roles" />
        <StatCard icon={FolderKanban} label="Total projects" value={statistics.totalProjects} detail="Visible project records" />
        <StatCard icon={BookOpen} label="Total courses" value={statistics.totalCourses || 0} detail="Catalog records" />
        <StatCard icon={BriefcaseBusiness} label="Course instructors" value={instructors} detail="Teaching accounts" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard variant="glass" radius="lg" padding="lg">
          <SectionHeader eyebrow="Projects" title="Project creation over time" subtitle="Monthly project submissions in the platform prototype." />
          <div className="mt-6 space-y-4">{statistics.monthlyProjects.map((value, index) => <Bar key={index} label={`Month ${index + 1}`} value={value} max={maxMonthly} />)}</div>
        </AppCard>
        <AppCard variant="strong" radius="lg" padding="lg" className="overflow-hidden">
          <SectionHeader eyebrow="Requirement 73" title="Platform usage snapshot" subtitle="Covers users, instructors, projects and courses in one view." />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[['Users', statistics.activeUsers], ['Projects', statistics.totalProjects], ['Courses', statistics.totalCourses || 0], ['Employers', statistics.approvedEmployers]].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/70 bg-white/60 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</p><p className="mt-2 text-2xl font-black text-[color:var(--ink)]">{value}</p></div>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppCard variant="glass" radius="lg" padding="lg">
          <SectionHeader eyebrow="Users" title="Role distribution" subtitle="Active platform accounts grouped by stakeholder role." />
          <div className="mt-6 space-y-4">{statistics.roleDistribution.map((item) => <Bar key={item.label} label={item.label} value={item.value} max={maxRoles} />)}</div>
        </AppCard>
        <AppCard variant="glass" radius="lg" padding="lg">
          <SectionHeader eyebrow="Employers" title="Application status" subtitle="Employer approval pipeline by state." />
          <div className="mt-6 space-y-4">{(statistics.employerStatus || []).map((item) => <Bar key={item.label} label={item.label} value={item.value} max={maxEmployer} />)}</div>
        </AppCard>
      </div>

      <AppCard variant="glass" radius="lg" padding="lg">
        <SectionHeader eyebrow="Moderation" title="Project safety state" subtitle="Active, deactivated and resolved flagged-project outcomes." />
        <div className="mt-6 grid gap-4 md:grid-cols-3">{(statistics.projectModeration || []).map((item) => <div key={item.label} className="rounded-3xl border border-[color:var(--border-blue)] bg-white/60 p-5"><p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{item.label}</p><p className="mt-2 text-3xl font-black text-[color:var(--primary)]">{item.value}</p><div className="mt-4"><Bar label="Share" value={item.value} max={maxModeration} /></div></div>)}</div>
      </AppCard>
    </AdminPageShell>
  );
}
