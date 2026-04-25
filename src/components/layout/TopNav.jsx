import { Bell, GraduationCap, Search } from "lucide-react";
import { student } from "@/data/studentDashboardData";

export default function TopNav({ notifications = [] }) {
  const unread = notifications.filter((n) => n.unread).length;

  const initials = student.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(156,213,255,0.35)] shadow-[0_0_0_6px_rgba(156,213,255,0.14)]">
            <GraduationCap className="h-6 w-6 text-[var(--primary)]" />
          </div>

          <div>
            <h1 className="text-lg font-black text-[var(--dark)]">
              GUC Portfolio Hub
            </h1>
            <p className="text-xs font-semibold text-[var(--muted)]">
              Student Workspace
            </p>
          </div>
        </div>

        <div className="hidden w-[380px] items-center gap-3 rounded-2xl border border-[rgba(53,88,114,0.1)] bg-white/70 px-4 py-3 shadow-sm md:flex">
          <Search className="h-4 w-4 text-[var(--muted)]" />
          <input
            placeholder="Search projects, internships, feedback..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[rgba(123,135,148,0.75)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(53,88,114,0.1)] bg-white/70 text-[var(--primary)] shadow-sm transition hover:bg-[rgba(156,213,255,0.22)]">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-xs font-black text-[var(--primary)]">
                {unread}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-sm font-black text-white">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black text-[var(--ink)]">
                {student.name}
              </p>
              <p className="text-xs font-semibold text-[var(--muted)]">
                Semester {student.semester}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}