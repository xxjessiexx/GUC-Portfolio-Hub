import { Archive, BriefcaseBusiness, CalendarDays, UsersRound } from "lucide-react";
import AppBadge from "@/components/ui/AppBadge";
import { DashboardPanel, SoftItem } from "./EmployerDashboardShell";

export default function EmployerInternshipsPanel({ internships, selectedInternship, onSelect }) {
  return (
    <DashboardPanel
      title="My Internships"
      subtitle="View, manage, archive, and track offered roles."
      action="Manage All"
    >
      <div className="space-y-4">
        {internships.map((internship) => (
          <SoftItem
            key={internship.id}
            selected={selectedInternship.id === internship.id}
            onClick={() => onSelect(internship)}
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-[var(--ink)]">
                    {internship.title}
                  </h3>
                  {internship.archived && (
                    <AppBadge tone="muted" className="py-1">
                      <Archive className="h-3 w-3" /> Archived
                    </AppBadge>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {internship.details}
                </p>
              </div>

              <AppBadge tone={internship.status === "Currently hiring" ? "blue" : "gold"}>
                {internship.status}
              </AppBadge>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
              <Meta icon={CalendarDays} label="Deadline" value={internship.deadline} />
              <Meta icon={BriefcaseBusiness} label="Duration" value={internship.duration} />
              <Meta icon={UsersRound} label="Applicants" value={internship.applicants} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {internship.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex h-9 items-center rounded-full border border-[#7AAACE]/55 bg-[#5F86A3] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)] dark:shadow-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SoftItem>
        ))}
      </div>
    </DashboardPanel>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/50 px-3 py-2 dark:bg-white/[0.04]">
      <Icon className="h-4 w-4 text-[var(--primary)] dark:text-[var(--accent)]" />
      <span className="font-semibold">{label}:</span>
      <span className="font-black text-[var(--ink)]">{value}</span>
    </div>
  );
}
