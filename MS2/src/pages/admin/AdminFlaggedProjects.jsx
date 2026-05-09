import { useMemo, useState } from "react";
import { Eye, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { AdminReviewDrawer, DrawerSection } from "@/components/adminModule/AdminReviewDrawer";
import { AppButton } from "@/components/ui/AppButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppCard } from "@/components/ui/AppCard";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminFlaggedProjects() {
  const { flaggedProjects, appeals, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(() => flaggedProjects.filter((project) => {
    const haystack = `${project.title} ${project.student} ${project.course} ${project.reason}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || project.status === status);
  }), [flaggedProjects, search, status]);

  const openProjectDecision = (project, active) => { setDecision({ type: "project", project, active }); setNote(""); };
  const openAppealDecision = (appeal, nextStatus) => { setDecision({ type: "appeal", appeal, nextStatus }); setNote(""); };
  const confirmDecision = () => {
    if ((decision.type === "project" && !decision.active && !note.trim()) || (decision.type === "appeal" && decision.nextStatus === "rejected" && !note.trim())) return;
    if (decision.type === "project") {
      actions.setProjectActive(decision.project.id, decision.active, note.trim());
      toast.success(decision.active ? "Project activated" : "Project deactivated");
      setSelectedProject((prev) => prev?.id === decision.project.id ? { ...prev, active: decision.active, adminNote: note.trim(), status: decision.active ? "resolved" : "flagged" } : prev);
    } else {
      actions.setAppealStatus(decision.appeal.id, decision.nextStatus, note.trim());
      toast.success(`Appeal ${decision.nextStatus}`);
    }
    setDecision(null);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Safety & moderation" title="Flagged projects and appeals" description="Review flagged projects, inspect appeal messages, record decisions, and activate or deactivate projects with confirmation notes." icon={FileWarning} />
      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["flagged", "under-review", "resolved"]} />
      <AdminTable rows={filtered} columns={[
        { key: "title", label: "Project", render: (row) => <div><p className="font-black">{row.title}</p><p className="text-xs text-[color:var(--muted)]">{row.student} • {row.course}</p></div> },
        { key: "reason", label: "Reason", render: (row) => <p className="max-w-md leading-6 text-[color:var(--muted)]">{row.reason}</p> },
        { key: "flaggedBy", label: "Flagged by" },
        { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
        { key: "active", label: "Project", render: (row) => <AdminStatusBadge status={row.active ? "active" : "inactive"} /> },
        { key: "actions", label: "Actions", render: (row) => <div className="flex flex-wrap gap-2"><AppButton variant="glass" size="sm" onClick={() => setSelectedProject(row)}><Eye className="size-4" />Review</AppButton><AppButton variant="brand" size="sm" onClick={() => openProjectDecision(row, true)}>Activate</AppButton><AppButton variant="danger" size="sm" onClick={() => openProjectDecision(row, false)}>Deactivate</AppButton></div> },
      ]} />

      <AppCard variant="glass" radius="lg" padding="lg">
        <SectionHeader eyebrow="Student appeals" title="Appeal inbox" subtitle="Appeals submitted by students for deactivated or flagged projects." />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {appeals.map((appeal) => (
            <div key={appeal.id} className="rounded-3xl border border-[color:var(--border-blue)] bg-[var(--surface-soft)] p-5">
              <div className="flex items-start justify-between gap-3"><div><p className="font-black text-[color:var(--ink)]">{appeal.student}</p><p className="text-xs font-semibold text-[color:var(--muted)]">{appeal.submittedAt}</p></div><AdminStatusBadge status={appeal.status} /></div>
              <p className="mt-4 text-sm font-semibold leading-7 text-[color:var(--muted)]">{appeal.message}</p>
              {appeal.decisionNote ? <p className="mt-3 rounded-2xl bg-white/65 p-3 text-xs font-bold leading-5 text-[color:var(--muted)]">Admin note: {appeal.decisionNote}</p> : null}
              <div className="mt-4 flex gap-2"><AppButton variant="brand" size="sm" onClick={() => openAppealDecision(appeal, "accepted")}>Accept appeal</AppButton><AppButton variant="danger" size="sm" onClick={() => openAppealDecision(appeal, "rejected")}>Reject</AppButton></div>
            </div>
          ))}
        </div>
      </AppCard>

      <AdminReviewDrawer open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} eyebrow="Project moderation" title={selectedProject?.title} subtitle={selectedProject ? `${selectedProject.student} • ${selectedProject.course}` : ""} status={selectedProject?.status} footer={selectedProject ? <div className="flex flex-wrap justify-end gap-2"><AppButton variant="brand" onClick={() => openProjectDecision(selectedProject, true)}>Activate project</AppButton><AppButton variant="danger" onClick={() => openProjectDecision(selectedProject, false)}>Deactivate project</AppButton></div> : null}>
        {selectedProject ? <div className="space-y-4"><DrawerSection title="Flag reason">{selectedProject.reason}</DrawerSection><DrawerSection title="Flag source">{selectedProject.flaggedBy}</DrawerSection><DrawerSection title="Project state"><div className="flex gap-2"><AdminStatusBadge status={selectedProject.active ? "active" : "inactive"} /><AdminStatusBadge status={selectedProject.appealStatus || "none"} /></div></DrawerSection><DrawerSection title="Latest admin note">{selectedProject.adminNote || "No admin note yet."}</DrawerSection></div> : null}
      </AdminReviewDrawer>

      <AdminActionDialog open={Boolean(decision)} tone={(decision?.type === "project" && !decision?.active) || decision?.nextStatus === "rejected" ? "danger" : "brand"} title={decision?.type === "appeal" ? `${decision?.nextStatus === "accepted" ? "Accept" : "Reject"} this appeal?` : `${decision?.active ? "Activate" : "Deactivate"} this project?`} description={decision?.type === "appeal" ? decision?.appeal?.message : decision?.project?.reason} confirmLabel={decision?.type === "appeal" ? `${decision?.nextStatus === "accepted" ? "Accept" : "Reject"} appeal` : `${decision?.active ? "Activate" : "Deactivate"} project`} noteRequired={(decision?.type === "project" && !decision?.active) || decision?.nextStatus === "rejected"} noteValue={note} onNoteChange={setNote} onCancel={() => setDecision(null)} onConfirm={confirmDecision} />
    </AdminPageShell>
  );
}
