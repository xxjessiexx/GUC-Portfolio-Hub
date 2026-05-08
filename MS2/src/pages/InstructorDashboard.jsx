import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InstructorHero from "@/components/instructorDashboard/InstructorHero";
import InstructorStatGrid from "@/components/instructorDashboard/InstructorStatGrid";
import InstructorCoursesPanel from "@/components/instructorDashboard/InstructorCoursesPanel";
import InstructorReviewQueue from "@/components/instructorDashboard/InstructorReviewQueue";
import InstructorProjectsPanel from "@/components/instructorDashboard/InstructorProjectsPanel";
import InstructorSidePanels from "@/components/instructorDashboard/InstructorSidePanels";
import { useNotifications } from "@/context/NotificationsContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { instructorDashboard } from "@/data/instructorDashboardData";

export default function InstructorDashboard() {
  const { profile } = useUserProfile();
  const { notifications: sharedNotifications = [] } = useNotifications();

  const notifications = useMemo(() => {
    return [...instructorDashboard.notifications, ...sharedNotifications].slice(0, 6);
  }, [sharedNotifications]);

  return (
    <DashboardLayout
      workspace="instructor"
      workspaceLabel="Instructor Workspace"
      notifications={notifications}
      sidebarProgress={{
        title: "Review capacity",
        value: instructorDashboard.reviewCapacity,
        label: `${instructorDashboard.reviewQueue.length} urgent actions`,
      }}
    >
      <InstructorHero profile={profile} dashboard={instructorDashboard} />
      <InstructorStatGrid stats={instructorDashboard.stats} />

      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <InstructorCoursesPanel courses={instructorDashboard.courses} />
        <InstructorReviewQueue items={instructorDashboard.reviewQueue} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <InstructorProjectsPanel projects={instructorDashboard.supervisedProjects} />
        <InstructorSidePanels
          notifications={notifications}
          recommendedProjects={instructorDashboard.recommendedProjects}
        />
      </section>
    </DashboardLayout>
  );
}
