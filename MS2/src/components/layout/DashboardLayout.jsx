import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import DashboardFooter from "@/components/footer/DashboardFooter";
import { useUserProfile } from "@/context/UserProfileContext";

const workspaceLabels = {
  student: "Student Workspace",
  instructor: "Instructor Workspace",
  employer: "Employer Workspace",
  admin: "Admin Workspace",
};

function normalizeWorkspace(value) {
  const role = String(value || "").trim().toLowerCase();

  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer")) return "employer";
  if (role.includes("company")) return "employer";
  if (role.includes("student")) return "student";

  return "";
}

function inferWorkspace({ explicitWorkspace, pathname, profile }) {
  const explicit = normalizeWorkspace(explicitWorkspace);
  if (explicit) return explicit;

  if (pathname.startsWith("/admin-dashboard")) return "admin";
  if (pathname.startsWith("/employer-dashboard")) return "employer";
  if (pathname.startsWith("/instructor-dashboard")) return "instructor";
  if (pathname.startsWith("/student-dashboard")) return "student";

  return (
    normalizeWorkspace(profile?.accountRole) ||
    normalizeWorkspace(profile?.systemRole) ||
    normalizeWorkspace(profile?.role) ||
    "student"
  );
}

export default function DashboardLayout({
  children,
  notifications,
  workspace,
  workspaceLabel,
  sidebarProgress,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { profile } = useUserProfile();

  const blobOneX = useSpring(0, { stiffness: 45, damping: 18 });
  const blobOneY = useSpring(0, { stiffness: 45, damping: 18 });
  const blobTwoX = useSpring(0, { stiffness: 35, damping: 20 });
  const blobTwoY = useSpring(0, { stiffness: 35, damping: 20 });

  const activeWorkspace = inferWorkspace({
    explicitWorkspace: workspace,
    pathname: location.pathname,
    profile,
  });

  const activeWorkspaceLabel =
    workspaceLabel ||
    workspaceLabels[activeWorkspace] ||
    workspaceLabels.student;

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 90;
      const y = (event.clientY / window.innerHeight - 0.5) * 90;

      blobOneX.set(x);
      blobOneY.set(y);
      blobTwoX.set(-x);
      blobTwoY.set(-y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [blobOneX, blobOneY, blobTwoX, blobTwoY]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[image:var(--page-gradient)] text-[var(--ink)]">
      <motion.div
        style={{ x: blobOneX, y: blobOneY }}
        className="pointer-events-none fixed -left-28 -top-36 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,rgba(122,170,206,0.32)_55%,transparent_72%)] blur-3xl"
      />

      <motion.div
        style={{ x: blobTwoX, y: blobTwoY }}
        className="pointer-events-none fixed -bottom-52 -right-44 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(122,170,206,0.62)_0%,rgba(230,199,123,0.16)_52%,transparent_72%)] blur-3xl"
      />

      <TopNav
        notifications={notifications}
        workspace={activeWorkspace}
        workspaceLabel={activeWorkspaceLabel}
      />

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        workspace={activeWorkspace}
        sidebarProgress={sidebarProgress}
      />

      <div className="relative z-10 min-h-screen pt-20">
        <div className="ml-[92px] w-[calc(100vw-92px)] overflow-x-hidden px-6 py-8">
          <div className="w-full max-w-none space-y-6">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </main>
  );
}