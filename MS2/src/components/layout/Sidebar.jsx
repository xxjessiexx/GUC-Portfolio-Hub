import { motion } from "framer-motion";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  FolderKanban,
  Heart,
  Home,
  Link2,
  LogOut,
  MessageSquare,
  SearchIcon,
  Settings,
  ShieldCheck,
  User,
 
  ClipboardList,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { student } from "@/data/studentDashboardData";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const dashboardRoutes = {
  student: "/student-dashboard",
  instructor: "/instructor-dashboard",
  employer: "/employer-dashboard",
  admin: "/admin-dashboard",
};

const workspaceItems = {
  student: [
    { label: "Home", icon: Home, path: "/student-dashboard" },
    { label: "Explore", icon: SearchIcon, path: "/discover" },
    { label: "My Portfolio", icon: User, path: "/student-dashboard/portfolio" },
    { label: "My Projects", icon: FolderKanban, path: "/view-all-projects" },
    { label: "My Applications", icon: ClipboardList, path: "/my-applications" },
     { label: "Invitations", icon: ClipboardCheck, path: null },
    { label: "Internships", icon: Briefcase, path: "/internships" },
    { label: "Favorites", icon: Heart,  path: "/fav-list" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ],

  instructor: [
    { label: "Home", icon: Home, path: "/instructor-dashboard" },
    { label: "Explore", icon: SearchIcon, path: "/discover" },
    { label: "Projects", icon: FolderKanban, path: "/view-all-projects" },
    { label: "My Courses", icon: BookOpen, path: null },
    { label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { label: "Invitations", icon: ClipboardCheck, path: null },
    { label: "Feedback", icon: MessageSquare, path: null },
    { label: "Settings", icon: Settings, path: "/settings" },
  ],

  employer: [
    { label: "Home", icon: Home, path: "/employer-dashboard" },
    { label: "Explore", icon: SearchIcon, path: "/discover" },
    { label: "Internships", icon: Briefcase, path: "/manage-internships" },
    { label: "Applicants", icon: Users, path: "/manage-applicants/emp-int-1" },
    { label: "Favorites", icon: Heart, path:"/fav-list" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ],

  admin: [
    { label: "Home", icon: Home, path: "/admin-dashboard" },
    { label: "Explore", icon: SearchIcon, path: "/discover" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Companies", icon: ShieldCheck, path: "/admin/employers" },
    { label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { label: "Link Requests", icon: Link2, path: "/admin/link-requests" },
    { label: "Flagged", icon: FileWarning, path: "/admin/flagged-projects" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ],
};

const workspaceDefaults = {
  student: { label: "Portfolio completion", value: student.profileCompletion },
  instructor: { label: "Urgent actions", value: 78 },
  employer: { label: "Hiring readiness", value: 76 },
  admin: { label: "Review readiness", value: 96 },
};

function isItemActive(item, location, workspace) {
  const { label, path } = item;

  if (!path) return false;

  const workspaceHome = dashboardRoutes[workspace] || dashboardRoutes.student;

  if (label === "Home") {
    return location.pathname === workspaceHome;
  }

  return location.pathname === path || location.pathname.startsWith(`${path}/`);
}

export default function Sidebar({
  open,
  setOpen,
  workspace = "student",
  
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeWorkspace = workspaceItems[workspace] ? workspace : "student";
  const items = workspaceItems[activeWorkspace];

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] border-r border-white/10 bg-[image:var(--dashboard-sidebar-gradient)] text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out dark:[background:var(--dashboard-sidebar-gradient)] dark:shadow-[18px_0_70px_rgba(0,0,0,0.24)] ${
        open ? "w-[280px]" : "w-[92px]"
      }`}
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[color:var(--accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4 overflow-y-auto p-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const { label, icon: Icon, path } = item;
            const active = isItemActive(item, location, activeWorkspace);
            const disabled = !path;

            return (
              <motion.button
                key={label}
                type="button"
                title={!open ? label : undefined}
                disabled={disabled}
                onClick={() => handleNavigate(path)}
                whileHover={
                  disabled ? undefined : { x: open ? 3 : 0, scale: 1.015 }
                }
                whileTap={disabled ? undefined : tapScale}
                transition={{ duration: 0.22, ease: easeOutExpo }}
                className={`group relative flex h-12 w-full items-center rounded-2xl text-sm font-bold transition-all duration-300 ${
                  open ? "justify-start gap-3 px-4" : "justify-center px-0"
                } ${
                  active
                    ? "bg-white text-[color:var(--primary)] shadow-[0_16px_38px_rgba(0,0,0,0.18)]"
                    : disabled
                    ? "cursor-not-allowed text-white/30"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {open && <span className="whitespace-nowrap">{label}</span>}

                {!open && (
                  <span className="pointer-events-none absolute left-[76px] z-50 rounded-xl bg-[color:var(--ink)] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                    {label}
                  </span>
                )}

                {active && (
                  <span className="absolute right-3 h-2 w-2 rounded-full bg-[color:var(--gold)]" />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="space-y-4">
          
            
          

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={tapScale}
                className={`group relative flex w-full items-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300 transition-all duration-300 hover:bg-red-500/20 ${
                  open
                    ? "justify-start gap-3 px-4 py-3"
                    : "justify-center py-3"
                }`}
              >
                <LogOut className="h-5 w-5" />

                {open && <span className="font-bold">Logout</span>}

                {!open && (
                  <span className="pointer-events-none absolute left-[76px] z-50 rounded-xl bg-[color:var(--ink)] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                    Logout
                  </span>
                )}
              </motion.button>
            </AlertDialogTrigger>

            <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] dark:border-white/10 dark:bg-[color:var(--surface-elevated)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
                  Log out?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
                  You will be signed out of your account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-2xl">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleLogout}
                  className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)] dark:text-[color:var(--background)]"
                >
                  Yes, log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}