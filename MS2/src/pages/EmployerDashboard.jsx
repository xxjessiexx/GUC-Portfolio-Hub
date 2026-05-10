import {  useState } from "react";
import { Bell, BriefcaseBusiness, CheckCircle2, UsersRound } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationsContext";
import { useUserProfile } from "@/context/UserProfileContext";
import Toast from "@/components/ui/toast";

import {
  employerProfile,
  employerStats,
  internshipStats,
  employerInternships,
  topApplicants,
  favoritePortfolios,
  recommendedProjects,
  messageThreads,
} from "@/data/employerDashboardData";

import {
  EmployerHero,
  EmployerStatsGrid,
} from "@/components/EmployerDashboard/EmployerDashboardShell";
import EmployerInternshipsPanel from "@/components/EmployerDashboard/EmployerInternshipsPanel";
import EmployerInternshipPreview from "@/components/EmployerDashboard/EmployerInternshipPreview";
import EmployerApplicantsPanel from "@/components/EmployerDashboard/EmployerApplicantsPanel";
import EmployerSecondaryPanels from "@/components/EmployerDashboard/EmployerSecondaryPanels";

export default function EmployerDashboard() {
  const { profile } = useUserProfile();
  const { notifications } = useNotifications();
  const [toast, setToast] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(employerInternships[0]);

  const dashboardEmployer = {
    ...employerProfile,
    companyName:
      profile?.companyName ||
      profile?.name ||
      employerProfile.companyName,
    companyEmail: profile?.email || employerProfile.companyEmail,
    companyLogo: profile?.image || employerProfile.companyLogo,
    bio: profile?.bio || employerProfile.bio,
  };



  const stats = [
    {
      title: "Active Internships",
      value: employerStats.activeInternships,
      icon: BriefcaseBusiness,
    },
    {
      title: "Total Applicants",
      value: employerStats.totalApplicants,
      icon: UsersRound,
    },
    {
      title: "Accepted Students",
      value: employerStats.acceptedStudents,
      icon: CheckCircle2,
    },
    {
      title: "Unread Alerts",
      value: notifications.filter((note) => note.unread).length,
      icon: Bell,
    },
  ];

  return (
    <DashboardLayout
      workspace="employer"
      workspaceLabel="Employer Workspace"
      sidebarProgress={{ label: "Company profile", value: dashboardEmployer.profileCompletion }}
      
    >
      <Toast notification={toast} onClose={() => setToast(null)} />

      <EmployerHero employer={dashboardEmployer} />
      <EmployerStatsGrid stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <EmployerInternshipsPanel
          internships={employerInternships}
          selectedInternship={selectedInternship}
          onSelect={setSelectedInternship}
        />

        <EmployerInternshipPreview internship={selectedInternship} />
      </section>

      <section className="mt-6">
        <EmployerApplicantsPanel applicants={topApplicants} />
      </section>

      <EmployerSecondaryPanels
        employer={dashboardEmployer}
        internshipStats={internshipStats}
        favoritePortfolios={favoritePortfolios}
        recommendedProjects={recommendedProjects}
        notifications={notifications}
        messageThreads={messageThreads}
      />
    </DashboardLayout>
  );
}
