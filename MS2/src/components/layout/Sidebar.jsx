import { motion } from "framer-motion";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import {
  Home,
  SearchIcon,
  Briefcase,
  CheckCircle2,
  FolderKanban,
  Heart,
  LogOut,
  MessageSquare,
  Settings,
  User,
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

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "Home", icon: Home, path: "/student-dashboard" },
    { label: "Explore", icon: SearchIcon, path: null },
    { label: "My Portfolio", icon: User, path: "/student-dashboard/portfolio" },
    { label: "My Projects", icon: FolderKanban, path: null },
    { label: "Feedback", icon: MessageSquare, path: null },
    { label: "Internships", icon: Briefcase, path: null },
    { label: "Favorites", icon: Heart, path: null },
    { label: "Settings", icon: Settings, path: null },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] border-r border-white/10 bg-[linear-gradient(180deg,#2C3947,#355872)] text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out dark:[background:var(--dashboard-sidebar-gradient)] dark:shadow-[18px_0_70px_rgba(0,0,0,0.24)] ${
        open ? "w-[280px]" : "w-[92px]"
      }`}
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#9CD5FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#E6C77B]/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4 overflow-y-auto p-4">
        <nav className="space-y-2">
          {items.map(({ label, icon: Icon, path }) => {
            const active =
              path &&
              (location.pathname === path ||
                (path === "/student-dashboard" && location.pathname === "/"));

            return (
              <motion.button
                key={label}
                type="button"
                title={!open ? label : undefined}
                onClick={() => {
                  if (path) navigate(path);
                }}
                whileHover={{ x: open ? 3 : 0, scale: 1.015 }}
                whileTap={tapScale}
                transition={{ duration: 0.22, ease: easeOutExpo }}
                className={`group relative flex h-12 w-full items-center rounded-2xl text-sm font-bold transition-all duration-300 ${
                  open ? "justify-start gap-3 px-4" : "justify-center px-0"
                } ${
                  active
                    ? "bg-white text-[#355872] shadow-[0_16px_38px_rgba(0,0,0,0.18)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                {open && <span className="whitespace-nowrap">{label}</span>}

                {!open && (
                  <span className="pointer-events-none absolute left-[76px] z-50 rounded-xl bg-[#102630] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                    {label}
                  </span>
                )}

                {active && (
                  <span className="absolute right-3 h-2 w-2 rounded-full bg-[#E6C77B]" />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="space-y-4">
          <div
            className={`overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 ${
              open ? "p-4" : "p-3"
            }`}
          >
            {open ? (
              <>
                <p className="text-sm font-black text-white">
                  Portfolio completion
                </p>

                <div className="mt-3 h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#E6C77B,#9CD5FF)]"
                    style={{ width: `${student.profileCompletion}%` }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-white/60">
                  {student.profileCompletion}% completed
                </p>
              </>
            ) : (
              <div className="grid h-10 place-items-center">
                <CheckCircle2 className="h-5 w-5 text-[#9CD5FF]" />
              </div>
            )}
          </div>

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
                  <span className="pointer-events-none absolute left-[76px] z-50 rounded-xl bg-[#102630] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100">
                    Logout
                  </span>
                )}
              </motion.button>
            </AlertDialogTrigger>

            <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] dark:border-white/10 dark:bg-[#101f2d]">
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
                  className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)] dark:text-[#102630]"
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