import { useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminLinkRequests() {
  const { linkRequests, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => linkRequests.filter((request) => {
    const haystack = `${request.instructor} ${request.email} ${request.course} ${request.action}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || request.status === status);
  }), [linkRequests, search, status]);

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Instructor course access" title="Link requests" description="Accept or reject course link/unlink requests from instructors." icon={Link2} />
      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["pending", "approved", "rejected"]} />
      <AdminTable
        rows={filtered}
        columns={[
          { key: "instructor", label: "Instructor", render: (row) => <div><p className="font-black">{row.instructor}</p><p className="text-xs text-[color:var(--muted)]">{row.email}</p></div> },
          { key: "course", label: "Course" },
          { key: "action", label: "Request" },
          { key: "reason", label: "Reason", render: (row) => <p className="max-w-xs text-sm leading-6 text-[color:var(--muted)]">{row.reason}</p> },
          { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
          { key: "actions", label: "Actions", render: (row) => (
            <div className="flex gap-2">
              <AppButton variant="brand" size="sm" onClick={() => actions.setLinkRequestStatus(row.id, "approved")}>Approve</AppButton>
              <AppButton variant="danger" size="sm" onClick={() => actions.setLinkRequestStatus(row.id, "rejected")}>Reject</AppButton>
            </div>
          )},
        ]}
      />
    </AdminPageShell>
  );
}
