import { Eye, EyeOff, Star, Users } from "lucide-react";

export default function ProjectPageHeader({
  project,
  isPublic,
  canManageProject,
  onToggleVisibility,
}) {
  return (
    <>
      <div>
        <h2 className="text-2xl font-black text-[var(--ink)]">
          {project.title}
        </h2>

        <p className="text-sm font-semibold text-[var(--muted)]">
          {project.course} • {project.type}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--muted)]">
        <span>Updated {project.updatedAt}</span>

        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {project.collaborators} collaborators
        </span>

        <span className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {project.rating || 0} / 5
        </span>

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={!canManageProject}
          className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
            isPublic
              ? "bg-[rgba(156,213,255,0.35)] text-[var(--primary)]"
              : "bg-[rgba(230,199,123,0.25)] text-[var(--primary)]"
          } ${canManageProject ? "transition hover:-translate-y-0.5" : "cursor-default"}`}
        >
          {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          {project.visibility}
        </button>
      </div>
    </>
  );
}