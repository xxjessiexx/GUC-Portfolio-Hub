import {
  Bell,
  Briefcase,
  CheckCircle2,
  FolderKanban,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { student } from "@/data/studentDashboardData";

export default function Sidebar({ open, setOpen }) {
  const items = [
    ["Overview", LayoutDashboard],
    ["My Portfolio", User],
    ["My Projects", FolderKanban],
    ["Notifications", Bell],
    ["Feedback", MessageSquare],
    ["Internships", Briefcase],
    ["Favorites", Heart],
    ["Settings", Settings],
  ];

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] border-r border-white/70 bg-white/75 shadow-[18px_0_60px_rgba(53,88,114,0.08)] backdrop-blur-2xl transition-all duration-300 ease-out ${
        open ? "w-[280px]" : "w-[92px]"
      }`}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <nav className="space-y-2">
          {items.map(([label, Icon], index) => {
            const active = index === 0;

            return (
              <button
                key={label}
                title={!open ? label : undefined}
                className={`relative flex h-12 w-full items-center rounded-2xl text-sm font-bold transition-all duration-300 ${
                  open ? "justify-start gap-3 px-4" : "justify-center px-0"
                } ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-[0_14px_35px_rgba(53,88,114,0.25)]"
                    : "text-[var(--dark)] hover:bg-[rgba(156,213,255,0.22)]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span className="whitespace-nowrap">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div
          className={`rounded-3xl border border-white/70 bg-white/70 shadow-sm transition-all duration-300 ${
            open ? "p-4" : "p-3"
          }`}
        >
          {open ? (
            <>
              <p className="text-sm font-black text-[var(--ink)]">
                Portfolio completion
              </p>

              <div className="mt-3 h-3 rounded-full bg-[rgba(156,213,255,0.22)]">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
                  style={{ width: `${student.profileCompletion}%` }}
                />
              </div>

              <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
                {student.profileCompletion}% completed
              </p>
            </>
          ) : (
            <div className="grid h-10 place-items-center">
              <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}