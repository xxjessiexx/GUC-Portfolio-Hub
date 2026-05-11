import { SmallActionButton } from "@/components/projectPage/ProjectPageShared";

export default function ProjectInvitationBanner({
  invitation,
  onAccept,
  onReject,
}) {
  if (!invitation) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--primary)]/15 bg-[rgba(156,213,255,0.22)] p-4">
      <div>
        <p className="text-sm font-black text-[var(--ink)]">
          Project invitation pending
        </p>

        <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
          You were invited as {invitation.role || "collaborator"}. Accepting
          will add you to the project workspace.
        </p>
      </div>

      <div className="flex gap-2">
        <SmallActionButton
          onClick={onAccept}
          className="bg-[var(--primary)] text-white"
        >
          Accept
        </SmallActionButton>

        <SmallActionButton
          onClick={onReject}
          className="border border-[var(--border-soft)] bg-white text-[var(--ink)]"
        >
          Reject
        </SmallActionButton>
      </div>
    </div>
  );
}