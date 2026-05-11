import { useEffect, useMemo, useState } from "react";
import { useNotifications } from "@/context/NotificationsContext";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHero from "@/components/dashboard/DashboardHero";
import StudentDashboardAnalytics from "@/components/dashboard/StudentDashboardAnalytics";
import Toast from "@/components/ui/toast";

import { useUserProfile } from "@/context/UserProfileContext";
import {
  getCurrentUser,
  getStudentDashboardSnapshot,
} from "@/data/demoStore";

export default function StudentDashboard() {
  const { notifications } = useNotifications();
  const [toast, setToast] = useState(null);
  const { profile } = useUserProfile();
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
    return getStudentDashboardSnapshot(currentUser?.id || profile?.id);
  }, [currentUser?.id, profile?.id]);

  const dashboardStudent = {
    ...(snapshot.student || {}),
    ...profile,
    name: profile.name || snapshot.student?.name || "Student",
    semester: profile.semester || snapshot.student?.semester,
    faculty: profile.faculty || snapshot.student?.faculty,
    major: profile.major || snapshot.student?.major,
    role: profile.role || snapshot.student?.role,
    bio: profile.bio || snapshot.student?.bio,
    image: profile.image || snapshot.student?.image,
    skills: snapshot.student?.skills?.length ? snapshot.student.skills : profile.skills || [],
    profileCompletion: snapshot.student?.profileCompletion || profile.profileCompletion || 0,
  };

  return (
    <DashboardLayout
      notifications={notifications}
      workspace="student"
      workspaceLabel="Student Workspace"
    >
      <Toast notification={toast} onClose={() => setToast(null)} />
      <DashboardHero student={dashboardStudent} />
      <StudentDashboardAnalytics snapshot={snapshot} notifications={notifications} />
    </DashboardLayout>
  );
}
