import { Star } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function InstructorProjectsPanel({ projects = [] }) {
  return (
    <AppCard padding="lg" className="h-full">
      <SectionHeader
        eyebrow="Supervision"
        title="Supervised projects"
        subtitle="Quick access to teams where you are invited or linked as course instructor."
      />

      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black text-[color:var(--ink)]">{project.title}</h3>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--secondary)]">
                  {project.course}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--gold)]/20 px-3 py-1 text-xs font-black text-[color:var(--primary)]">
                <Star className="h-3.5 w-3.5 fill-current" />
                {project.rating}
              </span>
            </div>

            <p className="mt-3 line-clamp-1 text-sm font-semibold text-[color:var(--muted)]">
              {project.students.join(", ")}
            </p>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[color:var(--border-blue)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--accent))]"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--border-blue)] bg-white/45 px-3 py-1 text-xs font-black text-[color:var(--primary)] dark:bg-white/[0.05]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs font-bold text-[color:var(--muted)]">
              Last update {project.lastUpdate}
            </p>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
