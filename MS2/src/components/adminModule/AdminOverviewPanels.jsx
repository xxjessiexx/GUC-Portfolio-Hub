import { AlertTriangle, Building2, CheckCircle2, FileWarning, Link2 } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";

export function AdminReviewQueue({ employers, linkRequests, flaggedProjects }) {
  const cards = [
    { title: "Employer approvals", icon: Building2, count: employers.filter((item) => item.status !== "approved").length, to: "/admin/employers" },
    { title: "Course link requests", icon: Link2, count: linkRequests.filter((item) => item.status === "pending").length, to: "/admin/link-requests" },
    { title: "Flagged projects", icon: FileWarning, count: flaggedProjects.filter((item) => item.status !== "resolved").length, to: "/admin/flagged-projects" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map(({ title, icon: Icon, count, to }) => (
        <AppCard key={title} variant="glass" radius="lg" padding="lg" hover>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[color:var(--ink)]">{title}</p>
              <p className="mt-2 text-3xl font-black text-[color:var(--primary)]">{count}</p>
              <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">Items waiting for admin action</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)]"><Icon className="h-5 w-5" /></div>
          </div>
          <AppButton as="a" href={to} variant="glass" size="sm" className="mt-5">Open queue</AppButton>
        </AppCard>
      ))}
    </div>
  );
}

export function AdminActivityPanel({ activity }) {
  return (
    <AppCard variant="glass" radius="lg" padding="lg">
      <SectionHeader eyebrow="Live activity" title="Recent platform events" subtitle="A quick admin audit trail for approvals, flags and requests." />
      <div className="mt-5 space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-4">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)]">
              {item.tone === "danger" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-[color:var(--ink)]">{item.title}</p>
                <span className="text-xs font-bold text-[color:var(--muted)]">{item.time}</span>
              </div>
              <p className="mt-1 text-sm font-semibold leading-6 text-[color:var(--muted)]">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

export function EmployerDocuments({ documents = [] }) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] px-3 py-2">
          <div>
            <p className="text-sm font-black text-[color:var(--ink)]">{doc.name}</p>
            <p className="text-xs font-semibold text-[color:var(--muted)]">{doc.type}</p>
          </div>
          <AdminStatusBadge status={doc.status} />
        </div>
      ))}
    </div>
  );
}
