import { useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProjectsPanel from "@/components/dashboard/ProjectsPanel";
import ProjectPreview from "@/components/dashboard/ProjectPreview";
import SecondaryPanels from "@/components/dashboard/SecondaryPanels";

import { useUserProfile } from "@/context/UserProfileContext";

import {
  student,
  projects,
  notifications,
  recommendedProjects,
  internships,
} from "@/data/studentDashboardData";

export default function StudentDashboard() {
  const { profile } = useUserProfile();
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const dashboardStudent = {
    ...student,
    name: profile.name,
    semester: profile.semester,
    faculty: profile.faculty,
    major: profile.major,
    role: profile.role,
    bio: profile.bio,
    image: profile.image,
    profileCompletion: student.profileCompletion,
  };

  const stats = {
    total: projects.length,
    public: projects.filter((p) => p.visibility === "Public").length,
    unread: notifications.filter((n) => n.unread).length,
    completion: dashboardStudent.profileCompletion,
  };

  const languageCounts = useMemo(() => {
    return projects
      .flatMap((p) => p.languages)
      .reduce((acc, lang) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});
  }, []);

  return (
    <DashboardLayout notifications={notifications}>
      <DashboardHero student={dashboardStudent} />

      <DashboardStats stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ProjectsPanel
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <ProjectPreview project={selectedProject} />
      </section>

      <SecondaryPanels
        project={selectedProject}
        notifications={notifications}
        languageCounts={languageCounts}
        recommendedProjects={recommendedProjects}
        internships={internships}
      />
    </DashboardLayout>
  );
}