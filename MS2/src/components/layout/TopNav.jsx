import { Bell, BriefcaseBusiness, GraduationCap, ShieldCheck, UserCog ,MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import { useUserProfile } from "@/context/UserProfileContext";

const workspaceMeta = {
  student: { label: "Student Workspace", icon: GraduationCap },
  instructor: { label: "Instructor Workspace", icon: ShieldCheck },
  employer: { label: "Employer Workspace", icon: BriefcaseBusiness },
  admin: { label: "Admin Workspace", icon: UserCog },
};

const profilePaths = {
  student: "/edit-student-profile",
  instructor: "/edit-instructor-profile",
  employer: "/edit-employer-profile",
  admin: "/admin-dashboard",
};

const roleLabels = {
  student: "Student",
  instructor: "Course Instructor",
  employer: "Employer",
  admin: "Administrator",
};

export default function TopNav({
  notifications = [],
  workspace = "student",
  workspaceLabel,
}) {
  const unread = notifications.filter((n) => n.unread).length;
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const normalizedRole = profile?.accountRole || profile?.systemRole || profile?.role || workspace || "student";
  const activeWorkspace = workspace || normalizedRole || "student";
  const meta = workspaceMeta[activeWorkspace] || workspaceMeta[normalizedRole] || workspaceMeta.student;
  const WorkspaceIcon = meta.icon;

  const displayName = profile?.companyName || profile?.name || "User";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2) || "??";

  const profilePath = profilePaths[normalizedRole] || profilePaths[activeWorkspace] || profilePaths.student;

  const roleLabel =
    normalizedRole === "student" && profile?.semester
      ? `Semester ${profile.semester}`
      : profile?.displayRole || roleLabels[normalizedRole] || "Guest";
    const handleChatsClick = () => {
    navigate("/chat"); // Keep this lowercase to match your App.jsx route
  };
  const handleNotificationsClick = () => {
    navigate("/notifications"); // Keep this lowercase to match your App.jsx route
  };
  

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[image:var(--nav-gradient)] text-white shadow-[0_18px_55px_rgba(44,57,71,0.22)] backdrop-blur-2xl dark:[background:var(--nav-gradient)] dark:shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 shadow-[0_0_0_6px_rgba(156,213,255,0.08)] ring-1 ring-white/15">
            <WorkspaceIcon className="h-6 w-6 text-[color:var(--accent)]" />
          </div>

          <div>
            <h1 className="text-lg font-black text-white">GUC Portfolio Hub</h1>
            <p className="text-xs font-semibold text-white/55">
              {workspaceLabel || meta.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="dark" />

            <motion.button
            type="button"
            onClick={handleChatsClick}
            whileHover={{ y: -3 }}
            whileTap={tapScale}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-sm transition hover:bg-white/15"
          >
            <MessageCircle className="h-5 w-5" />

          </motion.button>

          {/* FIXED: onClick is now a prop of motion.button */}
          <motion.button
            type="button"
            onClick={() => navigate("/notifications")}
            whileHover={{ y: -3 }}
            whileTap={tapScale}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-sm transition hover:bg-white/15"
          >
            <Bell className="h-5 w-5" />

            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--gold)] text-xs font-black text-[color:var(--primary)] shadow-[0_8px_18px_rgba(230,199,123,0.35)]">
                {unread}
              </span>
            )}
          </motion.button>

          <Link
            to={profilePath}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <div className="grid h-9 w-9 overflow-hidden place-items-center rounded-xl bg-[color:var(--accent)]/20 text-sm font-black text-white ring-1 ring-white/15">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black text-white">{displayName}</p>
              <p className="text-xs font-semibold text-white/55">{roleLabel}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
