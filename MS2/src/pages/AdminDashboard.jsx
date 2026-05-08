import { useNotifications } from "@/context/NotificationsContext";
import { useUserProfile } from "@/context/UserProfileContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminHero from "@/components/adminDashboard/AdminHero";
import AdminStatsGrid from "@/components/adminDashboard/AdminStatsGrid";
import EmployerApprovalsPanel from "@/components/adminDashboard/EmployerApprovalsPanel";
import { CourseRequestsPanel, FlaggedProjectsPanel } from "@/components/adminDashboard/AdminRequestsPanel";
import { CourseManagementPanel, UserManagementPanel } from "@/components/adminDashboard/AdminManagementPanel";
import PlatformUsagePanel from "@/components/adminDashboard/PlatformUsagePanel";
import {
  adminCourses,
  adminProfile,
  adminStats,
  courseRequests,
  employerApplications,
  flaggedProjects,
  platformUsage,
  userModeration,
} from "@/data/adminDashboardData";

export default function AdminDashboard() {
  const { notifications } = useNotifications();
  const { profile } = useUserProfile();

  const dashboardAdmin = {
    ...adminProfile,
    name: profile?.name || adminProfile.name,
    email: profile?.email || adminProfile.email,
  };

  return (
    <DashboardLayout
      notifications={notifications}
      workspace="admin"
      workspaceLabel="Admin Workspace"
      sidebarProgress={{ label: "Review readiness", value: adminProfile.profileCompletion }}
    >
      <AdminHero admin={dashboardAdmin} />
      <AdminStatsGrid stats={adminStats} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <EmployerApprovalsPanel applications={employerApplications} />
        <PlatformUsagePanel usage={platformUsage} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <UserManagementPanel users={userModeration} />
        <CourseManagementPanel courses={adminCourses} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <CourseRequestsPanel requests={courseRequests} />
        <FlaggedProjectsPanel projects={flaggedProjects} />
      </section>
    </DashboardLayout>
  );
}
