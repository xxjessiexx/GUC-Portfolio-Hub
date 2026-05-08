import { Link2, ShieldAlert } from "lucide-react";
import { AdminActionPair, AdminBadge, AdminSection, AdminMiniButton } from "./AdminDashboardPrimitives";

export function CourseRequestsPanel({ requests }) {
  return (
    <AdminSection
      title="Course link requests"
      subtitle="Accept or reject course instructor link/unlink requests."
      action={<AdminMiniButton variant="outline" icon={Link2}>Courses</AdminMiniButton>}
    >
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
          >
            <div className="min-w-0">
              <h3 className="font-black text-[color:var(--ink)]">{request.instructor}</h3>
              <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">{request.request}</p>
              <p className="mt-1 truncate text-xs font-bold text-[color:var(--primary)]">{request.course}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs font-black text-[color:var(--muted)] sm:block">{request.time}</span>
              <AdminActionPair />
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}

export function FlaggedProjectsPanel({ projects }) {
  return (
    <AdminSection
      title="Flagged projects & appeals"
      subtitle="Review projects that violate university rules, view appeals, and activate or deactivate projects."
      action={<AdminMiniButton variant="outline" icon={ShieldAlert}>Review all</AdminMiniButton>}
    >
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-[22px] border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-[color:var(--ink)]">{project.title}</h3>
                  <AdminBadge tone={project.severity === "High" ? "danger" : "gold"}>{project.severity}</AdminBadge>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">{project.reason}</p>
                <p className="mt-1 text-xs font-bold text-[color:var(--primary)]">Reported by {project.reporter}</p>
              </div>
              <AdminBadge tone={project.status === "Auto-deactivated" ? "danger" : "blue"}>{project.status}</AdminBadge>
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
