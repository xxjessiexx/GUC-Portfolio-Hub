import { useMemo, useState } from "react";
import { Bell, Check, Eye, Link2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { AdminReviewDrawer, DrawerSection } from "@/components/adminModule/AdminReviewDrawer";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import AdminTableActions from "@/components/adminModule/AdminTableActions";

export default function AdminLinkRequests() {
  const { linkRequests, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(() => linkRequests.filter((request) => {
    const haystack = `${request.instructor} ${request.email} ${request.course} ${request.action}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || request.status === status);
  }), [linkRequests, search, status]);

  const pendingRequests = linkRequests.filter((request) => request.status === "pending");
  const openDecision = (request, nextStatus) => { setDecision({ request, nextStatus }); setNote(""); };
  const confirmDecision = () => {
    if (decision.nextStatus === "rejected" && !note.trim()) return;
    actions.setLinkRequestStatus(decision.request.id, decision.nextStatus, note.trim());
    toast.success(`Request ${decision.nextStatus}`, { description: `${decision.request.instructor}'s request was ${decision.nextStatus}.` });
    setDecision(null);
    setSelectedRequest((prev) => prev?.id === decision.request.id ? { ...prev, status: decision.nextStatus, decisionNote: note.trim() } : prev);
  };

  return (
    <AdminPageShell notifications={pendingRequests.map((request) => ({ id: request.id, title: "Course link request", body: `${request.instructor} requested to ${request.action} ${request.course}.` }))}>
      <AdminPageHeader eyebrow="Instructor course access" title="Link requests" description="Accept or reject course link/unlink requests from instructors. Every decision can store a note for audit clarity." icon={Link2} />

      <AppCard variant="strong" radius="lg" padding="lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3"><div className="rounded-2xl bg-[color:var(--accent)]/15 p-3 text-[color:var(--primary)]"><Bell className="size-5" /></div><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">Admin notifications</p><h2 className="mt-1 text-2xl font-black text-[color:var(--ink)]">{pendingRequests.length} pending link notification{pendingRequests.length === 1 ? "" : "s"}</h2><p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">New link/unlink requests appear here before admins approve or reject them.</p></div></div>
          <AdminStatusBadge status={pendingRequests.length ? "pending" : "resolved"} />
        </div>
      </AppCard>

      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["pending", "approved", "rejected"]} />
      <AdminGridTable
          rows={filtered}
          gridTemplate="lg:grid-cols-[1.3fr_1fr_0.8fr_1.6fr_0.8fr_0.7fr]"
          columns={[
            {
              key: "instructor",
              label: "Instructor",
              render: (row) => (
                <div>
                  <p className="font-black text-[color:var(--ink)]">
                    {row.instructor}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
                    {row.email}
                  </p>
                </div>
              ),
            },

            {
              key: "course",
              label: "Course",
              render: (row) => (
                <p className="font-bold text-[color:var(--ink)]">
                  {row.course}
                </p>
              ),
            },

            {
              key: "action",
              label: "Request",
              render: (row) => (
                <span className="capitalize font-semibold text-[color:var(--muted)]">
                  {row.action}
                </span>
              ),
            },

            {
              key: "reason",
              label: "Reason",
              render: (row) => (
                <p className="line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                  {row.reason}
                </p>
              ),
            },

            {
              key: "status",
              label: "Status",
              render: (row) => (
                <AdminStatusBadge status={row.status} />
              ),
            },

            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <AdminTableActions
                  rowId={row.id}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  actions={[
                    {
                      label: "Review request",
                      icon: Eye,
                      onClick: () => setSelectedRequest(row),
                    },

                    {
                      label: "Approve request",
                      icon: Check,
                      onClick: () => openDecision(row, "approved"),
                    },

                    {
                      label: "Reject request",
                      icon: X,
                      danger: true,
                      onClick: () => openDecision(row, "rejected"),
                    },
                  ]}
                />
              ),
            },
          ]}
        />

      <AdminReviewDrawer open={Boolean(selectedRequest)} onClose={() => setSelectedRequest(null)} eyebrow="Instructor access" title={selectedRequest?.course} subtitle={selectedRequest ? `${selectedRequest.instructor} • ${selectedRequest.email}` : ""} status={selectedRequest?.status} footer={selectedRequest ? <div className="flex flex-wrap justify-end gap-2"><AppButton variant="brand" onClick={() => openDecision(selectedRequest, "approved")}>Approve</AppButton><AppButton variant="danger" onClick={() => openDecision(selectedRequest, "rejected")}>Reject</AppButton></div> : null}>
        {selectedRequest ? <div className="space-y-4"><DrawerSection title="Request type"><p className="capitalize">{selectedRequest.action}</p></DrawerSection><DrawerSection title="Instructor reason">{selectedRequest.reason}</DrawerSection><DrawerSection title="Decision note">{selectedRequest.decisionNote || "No decision note yet."}</DrawerSection></div> : null}
      </AdminReviewDrawer>

      <AdminActionDialog open={Boolean(decision)} tone={decision?.nextStatus === "rejected" ? "danger" : "brand"} title={decision?.nextStatus === "rejected" ? "Reject link request?" : "Approve link request?"} description={decision ? `${decision.request.instructor} requested to ${decision.request.action} ${decision.request.course}.` : ""} confirmLabel={decision?.nextStatus === "rejected" ? "Reject request" : "Approve request"} noteRequired={decision?.nextStatus === "rejected"} noteValue={note} onNoteChange={setNote} onCancel={() => setDecision(null)} onConfirm={confirmDecision} />
    </AdminPageShell>
  );
}
