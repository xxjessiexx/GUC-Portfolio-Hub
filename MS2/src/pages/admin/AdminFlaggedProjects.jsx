import { useMemo, useState } from "react";
import { FileWarning } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AppButton } from "@/components/ui/AppButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppCard } from "@/components/ui/AppCard";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminFlaggedProjects() {
  const { flaggedProjects, appeals, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => flaggedProjects.filter((project) => {
    const haystack = `${project.title} ${project.student} ${project.course} ${project.reason}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || project.status === status);
  }), [flaggedProjects, search, status]);

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Safety & moderation" title="Flagged projects and appeals" description="Review flagged projects, inspect appeal messages, and activate or deactivate projects." icon={FileWarning} />
      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["flagged", "under-review", "resolved"]} />
      <AdminTable
        rows={filtered}
        columns={[
          { key: "title", label: "Project", render: (row) => <div><p className="font-black">{row.title}</p><p className="text-xs text-[color:var(--muted)]">{row.student} • {row.course}</p></div> },
          { key: "reason", label: "Reason", render: (row) => <p className="max-w-md leading-6 text-[color:var(--muted)]">{row.reason}</p> },
          { key: "flaggedBy", label: "Flagged by" },
          { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
          { key: "active", label: "Project", render: (row) => <AdminStatusBadge status={row.active ? "active" : "inactive"} /> },
          { key: "actions", label: "Actions", render: (row) => (
            <div className="flex flex-wrap gap-2">
              <AppButton variant="brand" size="sm" onClick={() => actions.setProjectActive(row.id, true)}>Activate</AppButton>
              <AppButton variant="danger" size="sm" onClick={() => actions.setProjectActive(row.id, false)}>Deactivate</AppButton>
            </div>
          )},
        ]}
      />

      <AppCard variant="glass" radius="lg" padding="lg">
        <SectionHeader eyebrow="Student appeals" title="Appeal inbox" subtitle="Appeals submitted by students for deactivated or flagged projects." />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {appeals.map((appeal) => (
            <div key={appeal.id} className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-black text-[color:var(--ink)]">{appeal.student}</p><p className="text-xs font-semibold text-[color:var(--muted)]">{appeal.submittedAt}</p></div>
                <AdminStatusBadge status={appeal.status} />
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-[color:var(--muted)]">{appeal.message}</p>
              <div className="mt-4 flex gap-2">
                <AppButton variant="brand" size="sm" onClick={() => actions.setAppealStatus(appeal.id, "accepted")}>Accept appeal</AppButton>
                <AppButton variant="danger" size="sm" onClick={() => actions.setAppealStatus(appeal.id, "rejected")}>Reject</AppButton>
              </div>
            </div>
          ))}
        </div>
      </AppCard>
    </AdminPageShell>
  );
}
