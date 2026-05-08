import { Archive, CalendarDays, Code2, Edit3, ToggleLeft, UsersRound } from "lucide-react";
import AppBadge from "@/components/ui/AppBadge";
import { AppButton } from "@/components/ui/AppButton";
import { DashboardPanel } from "./EmployerDashboardShell";
import { useNavigate } from "react-router-dom";

export default function EmployerInternshipPreview({ internship }) {
  const navigate = useNavigate();
  return (
    <DashboardPanel
      title="Internship Preview"
      subtitle="Selected role details, status, and employer actions."
    >
      <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-5 text-white dark:[background:var(--dashboard-preview-gradient)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">{internship.title}</h3>
            <p className="mt-1 text-sm text-white/70">Posted {internship.postedAt}</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black">
            {internship.status}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/72">{internship.details}</p>

        <div className="mt-5 grid gap-3 text-sm">
          <Info icon={CalendarDays} label="Deadline" value={internship.deadline} />
          <Info icon={UsersRound} label="Applicants" value={`${internship.applicants} students`} />
          <Info icon={Code2} label="Languages" value={internship.languages.join(", ")} />
          <Info icon={Archive} label="Archive state" value={internship.archived ? "Archived" : "Active listing"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <AppButton
          variant="outline"
          onClick={() => navigate("/manage-internships")}
        >
          <Edit3 className="h-4 w-4" />
          Edit Role
        </AppButton>

        <AppButton
          variant="outline"
          onClick={() => navigate("/manage-internships")}
        >
          <ToggleLeft className="h-4 w-4" />
          Hiring / Filled
        </AppButton>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {internship.skills.map((skill) => (
          <AppBadge key={skill} tone="blue">{skill}</AppBadge>
        ))}
      </div>
    </DashboardPanel>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-2 last:border-b-0">
      <span className="inline-flex items-center gap-2 text-white/60">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="max-w-[220px] truncate font-bold">{value}</span>
    </div>
  );
}
