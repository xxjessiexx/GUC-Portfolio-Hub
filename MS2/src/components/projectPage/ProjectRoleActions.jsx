import { AlertTriangle, CheckCircle2, Edit3, Flag, ShieldCheck, UserCheck } from "lucide-react";

function ActionButton({ children, tone = "primary", className = "", ...props }) {
  const tones = {
    primary:
      "border-[color:var(--primary)]/20 bg-[rgba(156,213,255,0.18)] text-[var(--primary)] hover:bg-[rgba(156,213,255,0.28)]",
    danger:
      "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
    neutral:
      "border-[color:var(--primary)]/10 bg-white/75 text-[var(--ink)] hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function RoleBadge({ children }) {
  return (
    <span className="rounded-full border border-[color:var(--primary)]/15 bg-white/70 px-3 py-1 text-xs font-black text-[var(--primary)] dark:border-white/10 dark:bg-white/5 dark:text-[color:var(--accent)]">
      {children}
    </span>
  );
}

export default function ProjectRoleActions({
  permissions,
  project,
  onEditProject,
  onFlagProject,
  onAppealFlag,
  onToggleProjectActive,
}) {
  const {
    isOwner,
    isAcceptedCollaborator,
    isRelatedInstructor,
    isOtherInstructor,
    isAdmin,
    canManageProject,
    canFlagProject,
    canAppealFlag,
    canModerateProject,
  } = permissions;

  const roleLabel = isAdmin
    ? "Admin moderation view"
    : isOwner
      ? "Project owner"
      : isAcceptedCollaborator
        ? "Accepted collaborator"
        : isRelatedInstructor
          ? "Assigned / course instructor"
          : isOtherInstructor
            ? "Other instructor"
            : "Viewer";

  const isFlagged = String(project.status || "").toLowerCase().includes("flag") || Boolean(project.flagReason);
  const isInactive = project.active === false;

  return (
    <div className="rounded-3xl border border-[color:var(--primary)]/10 bg-white/65 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge>{roleLabel}</RoleBadge>

            {isFlagged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Flagged
              </span>
            )}

            {isInactive && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">
                Inactive
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-[var(--muted)]">
            Actions below change depending on your relation to this project.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {canManageProject && (
            <ActionButton onClick={onEditProject}>
              <Edit3 className="h-4 w-4" />
              Edit project
            </ActionButton>
          )}

          {canFlagProject && !isOwner && (
            <ActionButton tone="danger" onClick={onFlagProject}>
              <Flag className="h-4 w-4" />
              Flag project
            </ActionButton>
          )}

          {canAppealFlag && isFlagged && (
            <ActionButton tone="neutral" onClick={onAppealFlag}>
              <UserCheck className="h-4 w-4" />
              Appeal flag
            </ActionButton>
          )}

          {canModerateProject && (
            <ActionButton
              tone={isInactive ? "success" : "danger"}
              onClick={() => onToggleProjectActive(isInactive)}
            >
              {isInactive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isInactive ? "Activate" : "Deactivate"}
            </ActionButton>
          )}
        </div>
      </div>

      {project.flagReason && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
          <span className="font-black">Flag reason:</span> {project.flagReason}
        </div>
      )}

      {project.appealMessage && (
        <div className="mt-3 rounded-2xl border border-[color:var(--primary)]/10 bg-[rgba(156,213,255,0.14)] px-4 py-3 text-sm font-semibold text-[var(--primary)] dark:border-white/10 dark:bg-white/5 dark:text-[color:var(--accent)]">
          <span className="font-black">Latest appeal:</span> {project.appealMessage}
        </div>
      )}
    </div>
  );
}
