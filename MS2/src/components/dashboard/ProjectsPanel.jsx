import { Eye, EyeOff } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ProjectsPanel({
  projects,
  selectedProject,
  setSelectedProject,
}) {
  return (
    <AppCard className="p-6">
      <SectionHeader
        title="My Projects"
        subtitle="Track visibility, progress, collaborators, and links."
        action="View All"
      />

      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`w-full rounded-[26px] border p-5 text-left transition hover:-translate-y-0.5 ${
              selectedProject.id === project.id
                ? "border-[var(--gold)] bg-[rgba(156,213,255,0.2)] shadow-[0_18px_45px_rgba(53,88,114,0.12)]"
                : "border-white/70 bg-white/55 hover:bg-white/75"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="text-lg font-black text-[var(--ink)]">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
                  {project.course}
                </p>
              </div>

              <VisibilityBadge visibility={project.visibility} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-white/75 px-3 py-1 text-xs font-black text-[var(--primary)]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </AppCard>
  );
}

function VisibilityBadge({ visibility }) {
  const isPublic = visibility === "Public";

  return (
    <span
      className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
        isPublic
          ? "bg-[rgba(156,213,255,0.35)] text-[var(--primary)]"
          : "bg-[rgba(230,199,123,0.25)] text-[var(--primary)]"
      }`}
    >
      {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {visibility}
    </span>
  );
}