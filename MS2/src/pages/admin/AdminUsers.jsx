import { useMemo, useState } from "react";
import { CheckCircle2, UserPlus, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const usersGrid =
  "lg:grid-cols-[1.6fr_0.8fr_0.75fr_0.65fr_0.9fr_0.8fr_0.7fr]";

export default function AdminUsers() {
  const { users, actions } = useAdminModuleData();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const haystack =
          `${user.name} ${user.email} ${user.username || ""} ${user.role} ${user.status}`.toLowerCase();

        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "all" || user.status === status)
        );
      }),
    [users, search, status]
  );

  const openDecision = (user, nextStatus) => {
    setDecision({ user, nextStatus });
    setNote("");
  };

  const confirmDecision = () => {
    if (decision.nextStatus === "inactive" && !note.trim()) return;

    actions.setUserStatus(decision.user.id, decision.nextStatus, note.trim());

    toast.success(`Account ${decision.nextStatus}`, {
      description: `${decision.user.name} was marked ${decision.nextStatus}.`,
    });

    setDecision(null);
  };

  const userColumns = [
    {
      key: "user",
      label: "User",
      render: (user) => (
        <div>
          <p className="font-black text-[color:var(--ink)]">{user.name}</p>

          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {user.email}
          </p>

          {user.username ? (
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-[color:var(--primary)]">
              @{user.username}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span className="font-black text-[color:var(--primary)]">
          {user.role}
        </span>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (user) => (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {user.joined}
        </p>
      ),
    },
    {
      key: "projects",
      label: "Projects",
      render: (user) => (
        <p className="text-sm font-black text-[color:var(--ink)]">
          {user.projects}
        </p>
      ),
    },
    {
      key: "lastSeen",
      label: "Last seen",
      render: (user) => (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {user.lastSeen}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => <AdminStatusBadge status={user.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <AdminTableActions
          rowId={user.id}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          actions={[
            {
              label: "Activate account",
              icon: CheckCircle2,
              disabled: user.status === "active",
              onClick: () => openDecision(user, "active"),
            },
            {
              label: "Deactivate account",
              icon: XCircle,
              danger: true,
              disabled: user.status === "inactive",
              onClick: () => openDecision(user, "inactive"),
            },
          ].filter((action) => !action.disabled)}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="User Management"
        title="Manage Platform Users"
        description="View all users with their full name, email and role. Activation changes use confirmation notes for safer admin workflows."
        actionLabel="Create Admin"
        actionTo="/admin/users/create-admin"
        icon={UserPlus}
      />

      <SearchFilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        showFilters
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((current) => !current)}
        filterTitle="Filter users"
        onClearFilters={() => setStatus("all")}
      >
        <FilterSelect
          value={`Status: ${status === "all" ? "All statuses" : status}`}
          onChange={(value) =>
            setStatus(
              value.replace("Status: ", "") === "All statuses"
                ? "all"
                : value.replace("Status: ", "")
            )
          }
          options={[
            "Status: All statuses",
            "Status: active",
            "Status: inactive",
            "Status: pending",
          ]}
        />
      </SearchFilterToolbar>

      <AdminGridTable
        rows={filteredUsers}
        columns={userColumns}
        gridTemplate={usersGrid}
        emptyMessage="No users found"
      />

      <AdminActionDialog
        open={Boolean(decision)}
        tone={decision?.nextStatus === "inactive" ? "danger" : "brand"}
        title={
          decision?.nextStatus === "inactive"
            ? "Deactivate this account?"
            : "Activate this account?"
        }
        description={
          decision ? `${decision.user.name} will be marked ${decision.nextStatus}.` : ""
        }
        confirmLabel={
          decision?.nextStatus === "inactive"
            ? "Deactivate account"
            : "Activate account"
        }
        noteRequired={decision?.nextStatus === "inactive"}
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </AdminPageShell>
  );
}