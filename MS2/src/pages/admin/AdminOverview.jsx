import { BarChart3, Building2, FileWarning, Users } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminMetricCard } from "@/components/adminModule/AdminMetricCard";
import { AdminActivityPanel, AdminReviewQueue } from "@/components/adminModule/AdminOverviewPanels";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const icons = [Users, FileWarning, BarChart3, Building2];

export default function AdminOverview() {
  const data = useAdminModuleData();

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="Platform command center"
        title="Admin Dashboard"
        description="Review applications, manage users and courses, handle flags, and monitor platform usage from one workspace."
        actionLabel="Reset demo data"
        onAction={data.actions.resetDemoData}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => <AdminMetricCard key={metric.label} {...metric} icon={icons[index]} />)}
      </div>

      <AdminReviewQueue employers={data.employers} linkRequests={data.linkRequests} flaggedProjects={data.flaggedProjects} />
      <AdminActivityPanel activity={data.activity} />
    </AdminPageShell>
  );
}
