import DashboardLayout from "@/components/layout/DashboardLayout";

export function AdminPageShell({ children, notifications, sidebarProgress }) {
  return (
    <DashboardLayout
      workspace="admin"
      workspaceLabel="Admin Workspace"
      notifications={notifications}
      sidebarProgress={sidebarProgress || { label: "Review readiness", value: 96 }}
    >
      <div className="space-y-6">{children}</div>
    </DashboardLayout>
  );
}
