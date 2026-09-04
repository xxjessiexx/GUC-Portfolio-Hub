import { Eye, EyeOff, Star, Users } from "lucide-react";

export default function ProjectPageHeader({
  project,
  isPublic,
  canManageProject,
  onToggleVisibility,
  variant = "default",
}) {
  const identity = variant === "identity";

  if (identity) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
          <p className="text-[11px] font-black uppercase tracking-[0.17em] text-[#5F849B]">
            {project.course || "GUC Project"}
          </p>
        </div>

        <h2 className="mt-4 max-w-[500px] text-[34px] font-black leading-[1.01] tracking-[-0.045em] text-[#102536] sm:text-[36px]">
          {project.title}
        </h2>

        <p className="mt-2.5 text-[13px] font-bold text-[#708493]">
          {project.type}
        </p>
      </div>
    );
  }

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
          } ${
            canManageProject
              ? "transition hover:-translate-y-0.5"
              : "cursor-default"
          }`}
        >
          {isPublic ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
          {project.visibility}
        </button>
      </div>
    </>
  );
}
