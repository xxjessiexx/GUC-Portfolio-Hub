import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminUsers() {
  const { users, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  const filteredUsers = useMemo(() => users.filter((user) => {
    const haystack = `${user.name} ${user.email} ${user.username || ""} ${user.role} ${user.status}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || user.status === status);
  }), [users, search, status]);

  const openDecision = (user, nextStatus) => { setDecision({ user, nextStatus }); setNote(""); };
  const confirmDecision = () => {
    if (decision.nextStatus === "inactive" && !note.trim()) return;
    actions.setUserStatus(decision.user.id, decision.nextStatus, note.trim());
    toast.success(`Account ${decision.nextStatus}`, { description: `${decision.user.name} was marked ${decision.nextStatus}.` });
    setDecision(null);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="User management"
        title="Manage platform users"
        description="View all users with their full name, email and role. Activation changes now use confirmation notes for safer admin workflows."
        actionLabel="Create admin"
        onAction={() => { window.location.href = "/admin/users/create-admin"; }}
        icon={UserPlus}
      />

      <div className="flex justify-end">
        <AppButton as={Link} to="/admin/users/create-admin" variant="brand" size="lg"><UserPlus className="size-4" />Create admin</AppButton>
      </div>

      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["active", "inactive", "pending"]} />
      <AdminTable
        rows={filteredUsers}
        columns={[
          { key: "user", label: "User", render: (row) => <div className="max-w-xs"><p className="font-black">{row.name}</p><p className="text-xs text-[color:var(--muted)]">{row.email}</p>{row.username ? <p className="mt-1 text-[11px] font-bold text-[color:var(--secondary)]">@{row.username}</p> : null}</div> },
          { key: "role", label: "Role", render: (row) => <span className="font-bold text-[color:var(--primary)]">{row.role}</span> },
          { key: "joined", label: "Joined" },
          { key: "projects", label: "Projects" },
          { key: "lastSeen", label: "Last seen" },
          { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
          { key: "actions", label: "Actions", render: (row) => (
            <div className="flex flex-wrap gap-2">
              <AppButton variant="glass" size="sm" onClick={() => openDecision(row, "active")} disabled={row.status === "active"} className="disabled:cursor-not-allowed disabled:opacity-45">Activate</AppButton>
              <AppButton variant="danger" size="sm" onClick={() => openDecision(row, "inactive")} disabled={row.status === "inactive"} className="disabled:cursor-not-allowed disabled:opacity-45">Deactivate</AppButton>
            </div>
          )},
        ]}
      />

      <AdminActionDialog
        open={Boolean(decision)}
        tone={decision?.nextStatus === "inactive" ? "danger" : "brand"}
        title={decision?.nextStatus === "inactive" ? "Deactivate this account?" : "Activate this account?"}
        description={decision ? `${decision.user.name} will be marked ${decision.nextStatus}.` : ""}
        confirmLabel={decision?.nextStatus === "inactive" ? "Deactivate account" : "Activate account"}
        noteRequired={decision?.nextStatus === "inactive"}
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </AdminPageShell>
  );
}
