import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationsContext";
import { useUserProfile } from "@/context/UserProfileContext";
import Toast from "@/components/ui/toast";

import { EmployerHero } from "@/components/EmployerDashboard/EmployerDashboardShell";
import EmployerDashboardAnalytics from "@/components/EmployerDashboard/EmployerDashboardAnalytics";
import { getCurrentUser, getEmployerDashboardSnapshot } from "@/data/demoStore";

function normalizeLocation(value) {
  if (!value) return "Cairo, Egypt";
  if (typeof value === "string") return value;
  return value.label || value.address || value.city || "Cairo, Egypt";
}

export default function EmployerDashboard() {
  const { profile } = useUserProfile();
  const { notifications } = useNotifications();
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  useEffect(() => {
    const refresh = () => setCurrentUserState(getCurrentUser());
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);
    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, []);

  const snapshot = useMemo(() => {
    return getEmployerDashboardSnapshot(currentUser?.id || profile?.id);
  }, [currentUser?.id, profile?.id]);

  const employerFromStore = snapshot.employer || {};

  const dashboardEmployer = {
    ...employerFromStore,
    ...profile,
    companyName:
      profile?.companyName ||
      profile?.name ||
      employerFromStore.companyName ||
      employerFromStore.name ||
      "Employer",
    companyEmail: profile?.email || employerFromStore.email || employerFromStore.companyEmail,
    companyLogo: profile?.image || profile?.companyLogo || employerFromStore.image || employerFromStore.companyLogo,
    bio:
      profile?.bio ||
      profile?.companyBio ||
      employerFromStore.bio ||
      employerFromStore.companyBio ||
      "Looking for strong student portfolios, clean documentation, and internship-ready candidates.",
    industry: profile?.industry || employerFromStore.industry || "Software & AI Solutions",
    verificationStatus:
      profile?.verificationStatus ||
      employerFromStore.verificationStatus ||
      employerFromStore.status ||
      "Pending admin review",
    location: normalizeLocation(profile?.location || employerFromStore.location),
    profileCompletion: profile?.profileCompletion || employerFromStore.profileCompletion || 82,
  };

  return (
    <DashboardLayout
      notifications={notifications}
      workspace="employer"
      workspaceLabel="Employer Workspace"
      sidebarProgress={{ label: "Company profile", value: dashboardEmployer.profileCompletion }}
    >
      <Toast notification={toast} onClose={() => setToast(null)} />

      <EmployerHero employer={dashboardEmployer} />
      <EmployerDashboardAnalytics snapshot={snapshot} notifications={notifications} />
    </DashboardLayout>
  );
}
