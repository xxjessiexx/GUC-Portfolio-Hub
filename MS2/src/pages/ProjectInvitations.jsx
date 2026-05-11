import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import {
  getCurrentUser,
  getProjectInvitationsForUser,
  respondToProjectInvitation,
} from "@/data/demoStore";

const statusStyles = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
  accepted:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
  rejected:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200",
};

const statusIcons = {
  pending: Clock3,
  accepted: CheckCircle2,
  rejected: XCircle,
};

function formatDate(value) {
  if (!value) return "Recently";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Recently";
  }
}

function normalizeStatus(value) {
  return String(value || "pending").toLowerCase();
}

export default function ProjectInvitations() {
  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [invitations, setInvitations] = useState(() =>
    getProjectInvitationsForUser(currentUser?.id)
  );

  const filteredInvitations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const status = normalizeStatus(invitation.status);

      const matchesFilter =
        activeFilter === "all" || status === activeFilter;

      const matchesSearch =
        !query ||
        invitation.projectTitle.toLowerCase().includes(query) ||
        invitation.ownerName.toLowerCase().includes(query) ||
        invitation.courseName.toLowerCase().includes(query) ||
        invitation.role.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, invitations, searchTerm]);

  const counts = useMemo(() => {
    return invitations.reduce(
      (acc, invitation) => {
        const status = normalizeStatus(invitation.status);
        acc.all += 1;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { all: 0, pending: 0, accepted: 0, rejected: 0 }
    );
  }, [invitations]);

  const handleDecision = (invitation, decision) => {
    respondToProjectInvitation(
      invitation.projectId,
      currentUser?.id,
      decision
    );

    setInvitations(getProjectInvitationsForUser(currentUser?.id));
  };

  const filters = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Project workspace"
          title="Project Invitations"
          subtitle="Review invitations sent to you from different projects. Accepting adds you to the project; rejecting keeps you out of the team."
        />

        <div className="grid gap-4 md:grid-cols-4">
          {filters.map((filter) => {
            const active = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-3xl border px-5 py-4 text-left transition ${
                  active
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white shadow-[0_18px_48px_rgba(53,88,114,0.22)]"
                    : "border-white/70 bg-white/75 text-[color:var(--ink)] shadow-[0_14px_36px_rgba(53,88,114,0.10)] hover:-translate-y-0.5 hover:border-[color:var(--secondary)]/50 dark:border-white/10 dark:bg-white/[0.06]"
                }`}
              >
                <p
                  className={`text-xs font-black uppercase tracking-[0.22em] ${
                    active ? "text-white/70" : "text-[color:var(--muted)]"
                  }`}
                >
                  {filter.label}
                </p>

                <p className="mt-2 text-3xl font-black">{filter.count}</p>
              </button>
            );
          })}
        </div>

        <AppCard className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_18px_48px_rgba(53,88,114,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by project, owner, course, or role..."
                className="h-12 w-full rounded-2xl border border-white/70 bg-white/80 pl-11 pr-4 text-sm font-semibold text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--secondary)] dark:border-white/10 dark:bg-white/[0.07]"
              />
            </div>

            <p className="text-sm font-bold text-[color:var(--muted)]">
              {filteredInvitations.length} invitation
              {filteredInvitations.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </AppCard>

        {filteredInvitations.length === 0 ? (
          <AppCard className="rounded-[2rem] border border-white/70 bg-white/75 p-10 text-center shadow-[0_18px_48px_rgba(53,88,114,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[color:var(--primary)]/10 text-[color:var(--primary)] dark:bg-[#9CD5FF]/10 dark:text-[#9CD5FF]">
              <FolderKanban className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-black text-[color:var(--ink)]">
              No invitations found
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-[color:var(--muted)]">
              Invitations will appear here when a project creator invites you as
              a collaborator or course instructor.
            </p>
          </AppCard>
        ) : (
          <div className="grid gap-4">
            {filteredInvitations.map((invitation) => {
              const status = normalizeStatus(invitation.status);
              const StatusIcon = statusIcons[status] || Clock3;
              const isPending = status === "pending";
              const isInstructorInvite =
  String(invitation.role || "").toLowerCase() === "instructor";

              return (
                <AppCard
                  key={invitation.id}
                  className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-0 shadow-[0_18px_48px_rgba(53,88,114,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                    <div className="relative min-h-[180px] overflow-hidden bg-[color:var(--primary)]/10">
                      {invitation.projectImage ? (
                        <img
                          src={invitation.projectImage}
                          alt={invitation.projectTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full min-h-[180px] place-items-center bg-[linear-gradient(135deg,rgba(53,88,114,0.95),rgba(122,170,206,0.72))] text-white">
                          <FolderKanban className="h-12 w-12" />
                        </div>
                      )}

                      <div className="absolute left-4 top-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-black capitalize backdrop-blur-xl ${
                            statusStyles[status] || statusStyles.pending
                          }`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 p-6">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="min-w-0">
                          <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                            {isInstructorInvite ? (
                              <GraduationCap className="h-4 w-4" />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                            Invited as {isInstructorInvite ? "Instructor" : "Collaborator"}
                          </p>

                          <h3 className="text-2xl font-black tracking-tight text-[color:var(--ink)]">
                            {invitation.projectTitle}
                          </h3>

                          <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[color:var(--muted)]">
                            {invitation.projectDescription}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">

                          {isPending && (
                            <>
                              <AppButton
                                type="button"
                                size="sm"
                                onClick={() =>
                                  handleDecision(invitation, "accepted")
                                }
                              >
                                Accept
                              </AppButton>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDecision(invitation, "rejected")
                                }
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-[color:var(--border-soft)] bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            Sent by
                          </p>
                          <p className="mt-1 text-sm font-black text-[color:var(--ink)]">
                            {invitation.ownerName}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[color:var(--border-soft)] bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            Course
                          </p>
                          <p className="mt-1 text-sm font-black text-[color:var(--ink)]">
                            {invitation.courseCode
                              ? `${invitation.courseCode} · ${invitation.courseName}`
                              : invitation.courseName}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[color:var(--border-soft)] bg-white/65 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            Sent
                          </p>
                          <p className="mt-1 text-sm font-black text-[color:var(--ink)]">
                            {formatDate(invitation.sentAt)}
                          </p>
                        </div>
                      </div>

                      {invitation.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {invitation.tags.slice(0, 8).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-2xl border border-[color:var(--secondary)]/20 bg-[color:var(--secondary)]/10 px-3 py-1 text-xs font-black text-[color:var(--primary)] dark:text-[#9CD5FF]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}