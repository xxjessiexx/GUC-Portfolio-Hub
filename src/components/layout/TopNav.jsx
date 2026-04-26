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
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(135deg,#2C3947,#355872)] text-white shadow-[0_18px_55px_rgba(44,57,71,0.22)] backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 shadow-[0_0_0_6px_rgba(156,213,255,0.08)] ring-1 ring-white/15">
            <GraduationCap className="h-6 w-6 text-[#9CD5FF]" />
          </div>

          <div>
            <h1 className="text-lg font-black text-white">
              GUC Portfolio Hub
            </h1>
            <p className="text-xs font-semibold text-white/55">
              Student Workspace
            </p>
          </div>
        </div>

        <div className="hidden w-[390px] items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition focus-within:border-[#9CD5FF]/40 focus-within:bg-white/15 md:flex">
          <Search className="h-4 w-4 text-white/55" />
          <input
            placeholder="Search projects, internships, feedback..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-white/15">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#E6C77B] text-xs font-black text-[#355872] shadow-[0_8px_18px_rgba(230,199,123,0.35)]">
                {unread}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#9CD5FF]/20 text-sm font-black text-white ring-1 ring-white/15">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-black text-white">{student.name}</p>
              <p className="text-xs font-semibold text-white/55">
                Semester {student.semester}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}