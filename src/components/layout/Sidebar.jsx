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
      className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] border-r border-white/10 bg-[linear-gradient(180deg,#2C3947,#355872)] text-white shadow-[18px_0_70px_rgba(44,57,71,0.24)] backdrop-blur-2xl transition-all duration-300 ease-out ${
        open ? "w-[280px]" : "w-[92px]"
      }`}
    >
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#9CD5FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#E6C77B]/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        <nav className="space-y-2">
          {items.map(([label, Icon], index) => {
            const active = index === 0;

            return (
              <button
                key={label}
                title={!open ? label : undefined}
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
              </button>
            );
          })}
        </nav>

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
      </div>
    </aside>
  );
}