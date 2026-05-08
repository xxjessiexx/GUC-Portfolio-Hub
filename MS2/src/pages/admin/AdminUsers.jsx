import { useMemo, useState } from "react";
import { UserPlus, Users } from "lucide-react";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { CreateAdminForm } from "@/components/adminModule/AdminForms";
import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminUsers() {
  const { users, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = status === "all" || user.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, status]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="User management"
        title="Manage platform users"
        description="View users, search accounts, activate or deactivate access, and create admin accounts."
        icon={Users}
      />

      <CreateAdminForm onCreate={actions.createAdminUser} />

      <AdminToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={["active", "inactive", "pending"]}
      />

      <AdminTable
        rows={filteredUsers}
        columns={[
          {
            key: "user",
            label: "User",
            render: (row) => (
              <div className="max-w-xs">
                <p className="font-black">{row.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{row.email}</p>
              </div>
            ),
          },
          {
            key: "role",
            label: "Role",
            render: (row) => (
              <span className="font-bold text-[color:var(--primary)]">
                {row.role}
              </span>
            ),
          },
          {
            key: "joined",
            label: "Joined",
            render: (row) => row.joined,
          },
          {
            key: "projects",
            label: "Projects",
            render: (row) => row.projects,
          },
          {
            key: "lastSeen",
            label: "Last seen",
            render: (row) => row.lastSeen,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <AdminStatusBadge status={row.status} />,
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <AppButton
                  variant="glass"
                  size="sm"
                  onClick={() => actions.setUserStatus(row.id, "active")}
                >
                  Activate
                </AppButton>

                <AppButton
                  variant="danger"
                  size="sm"
                  onClick={() => actions.setUserStatus(row.id, "inactive")}
                >
                  Deactivate
                </AppButton>
              </div>
            ),
          },
        ]}
      />
    </AdminPageShell>
  );
}