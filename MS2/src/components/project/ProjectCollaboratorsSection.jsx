import { useCallback, useMemo, useState } from "react";
import { Award, GraduationCap, Search, UserPlus, Users } from "lucide-react";

import AppModal from "@/components/common/AppModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { addNotification, updateProject } from "@/data/demoStore";

function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Date.now()}`;
}

function getDisplayName(user) {
  return (
    user?.name ||
    user?.fullName ||
    user?.companyName ||
    user?.email ||
    "Unknown User"
  );
}

function getImageForUser(user) {
  return user?.avatar || user?.image || user?.profileImage || "";
}

function normalizeRole(value) {
  const role = String(value || "").toLowerCase();

  if (role.includes("instructor")) return "instructor";
  if (role.includes("teacher")) return "instructor";
  if (role.includes("admin")) return "admin";
  if (role.includes("employer")) return "employer";

  return "student";
}

function getUserKey(user) {
  return String(user?.id || user?.email || getDisplayName(user)).toLowerCase();
}

function normalizeStatus(value) {
  const status = String(value || "accepted").toLowerCase();

  if (status === "pending") return "no reply";
  if (status === "no_reply") return "no reply";
  if (status === "no-reply") return "no reply";
  if (status === "accepted") return "accepted";
  if (status === "rejected") return "rejected";
  if (status === "cancelled") return "cancelled";
  if (status === "canceled") return "cancelled";
  if (status === "removed") return "removed";

  return status || "accepted";
}

function statusClassName(status) {
  const clean = normalizeStatus(status);

  if (clean === "accepted") return "bg-emerald-100 text-emerald-700";
  if (clean === "rejected") return "bg-rose-100 text-rose-600";
  if (clean === "cancelled" || clean === "removed") {
    return "bg-slate-100 text-slate-500";
  }

  return "bg-amber-100 text-amber-700";
}

function roleBadgeClassName(type) {
  if (type === "instructor") return "bg-sky-100 text-[var(--primary)]";

  return "bg-[rgba(156,213,255,0.28)] text-[var(--primary)]";
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-white/50 p-5 text-sm font-semibold text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
      <p className="font-black text-[var(--ink)]">{title}</p>
      <p className="mt-1">{description}</p>
    </div>
  );
}

function Avatar({ user, size = "h-11 w-11" }) {
  const src = getImageForUser(user);
  const name = getDisplayName(user);
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(156,213,255,0.35)] text-sm font-black text-[var(--primary)] ring-2 ring-white`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

function makeNotification(userId, title, body, projectId, invitationRole) {
  if (!userId) return;

  addNotification({
    id: makeId("notification"),
    userId,
    title,
    text: body,
    body,
    message: body,
    type: "project-invite",
    projectId,
    invitationRole,
    unread: true,
    createdAt: new Date().toISOString(),
    time: new Date().toLocaleString(),
  });
}

function userMatchesSearch(user, query) {
  const text = String(query || "").trim().toLowerCase();

  if (!text) return true;

  return [
    user.email,
    user.name,
    user.fullName,
    user.firstName,
    user.lastName,
    `${user.firstName || ""} ${user.lastName || ""}`,
  ].some((value) => String(value || "").toLowerCase().includes(text));
}

function uniqueRows(rows) {
  const seen = new Set();

  return rows.filter((row) => {
    const key = getUserKey(row.user);

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function SectionHeader({ icon: Icon, title, subtitle, count }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h4 className="flex items-center gap-2 text-lg font-black text-[var(--ink)]">
          {Icon && <Icon className="h-5 w-5 text-[var(--primary)]" />}
          {title}
        </h4>
        <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
          {subtitle}
        </p>
      </div>

      <span className="rounded-full bg-[rgba(156,213,255,0.28)] px-3 py-1 text-xs font-black text-[var(--primary)]">
        {count}
      </span>
    </div>
  );
}

function PersonCard({
  row,
  canCancelInvitations,
  canRemoveCollaborators,
  onCancel,
  onRemove,
}) {
  const status = normalizeStatus(row.status);
  const isPending = status === "no reply";
  const isAcceptedCollaborator = row.type === "collaborator" && status === "accepted";

  return (
    <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/75 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--primary)]/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar user={row.user} />

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[var(--ink)]">
              {getDisplayName(row.user)}
            </p>
            <p className="truncate text-xs font-semibold text-[var(--muted)]">
              {row.user.email || "No email available"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${roleBadgeClassName(row.type)}`}
        >
          {row.type === "instructor" ? "Instructor" : "Collaborator"}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClassName(status)}`}
        >
          {status}
        </span>

        {canCancelInvitations && isPending && (
          <button
            type="button"
            onClick={() => onCancel(row)}
            className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 transition hover:bg-amber-100"
          >
            Cancel invite
          </button>
        )}

        {canRemoveCollaborators && isAcceptedCollaborator && (
          <button
            type="button"
            onClick={() => onRemove(row)}
            className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600 transition hover:bg-rose-100"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function InviteModeButton({ active, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-[color:var(--primary)] bg-[rgba(156,213,255,0.2)] shadow-sm"
          : "border-[color:var(--primary)]/10 bg-white hover:bg-slate-50"
      }`}
    >
      <p className="text-sm font-black text-[var(--ink)]">{title}</p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
        {description}
      </p>
    </button>
  );
}

function InviteModal({
  open,
  mode,
  query,
  message,
  candidates,
  onClose,
  onModeChange,
  onQueryChange,
  onSendInvitation,
}) {
  if (!open) return null;

  const isInstructorMode = mode === "instructor";

  return (
    <AppModal
      title={isInstructorMode ? "Invite course instructor" : "Invite collaborator"}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <InviteModeButton
            active={!isInstructorMode}
            title="Student collaborator"
            description="Search students by name or email and invite them to the team."
            onClick={() => onModeChange("student")}
          />

          <InviteModeButton
            active={isInstructorMode}
            title="Course instructor"
            description="Only instructors linked to this project course are listed."
            onClick={() => onModeChange("instructor")}
          />
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, email, first name, or last name"
            className="h-12 w-full rounded-2xl border border-[color:var(--primary)]/10 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[var(--primary)]"
          />
        </div>

        {message && (
          <p className="rounded-2xl bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
            {message}
          </p>
        )}

        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
          {candidates.length === 0 ? (
            <EmptyState
              title="No matching users"
              description={
                isInstructorMode
                  ? "No available course instructors match your search. Rejected or cancelled invitations can be sent again."
                  : "No available student collaborators match your search. Rejected or cancelled invitations can be sent again."
              }
            />
          ) : (
            candidates.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--primary)]/10 bg-white/80 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar user={user} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[var(--ink)]">
                      {getDisplayName(user)}
                    </p>
                    <p className="truncate text-xs font-semibold text-[var(--muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSendInvitation(user)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <UserPlus className="h-4 w-4" />
                  Send invite
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AppModal>
  );
}

export default function ProjectCollaboratorsSection({
  project,
  users = [],
  courses = [],
  tasks = [],
  canManageCollaborators,
  canInvitePeople = canManageCollaborators,
  canCancelInvitations = canInvitePeople,
  canRemoveCollaborators = canManageCollaborators,
  refreshProject,
}) {
  const [inviteQuery, setInviteQuery] = useState("");
  const [inviteMode, setInviteMode] = useState("student");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const rawProject = useMemo(() => project?.raw || project || {}, [project]);

  const invitationStatuses = useMemo(
    () => (Array.isArray(project?.invitationStatuses) ? project.invitationStatuses : []),
    [project.invitationStatuses]
  );

  const course = courses.find(
    (item) =>
      String(item.id) === String(project?.courseId) ||
      String(item.code || item.courseCode || "").toLowerCase() ===
        String(project?.courseCode || "").toLowerCase() ||
      String(item.name || item.courseName || "").toLowerCase() ===
        String(project?.course || project?.courseName || "").toLowerCase()
  );

  const findUserById = useCallback(
    (id) => users.find((user) => String(user.id) === String(id)),
    [users]
  );

  const getStatusRecord = useCallback(
    (userId) =>
      invitationStatuses.find((item) => String(item.userId) === String(userId)),
    [invitationStatuses]
  );

  const getStatusForUser = useCallback(
    (userId, fallback = "accepted") =>
      normalizeStatus(getStatusRecord(userId)?.status || fallback),
    [getStatusRecord]
  );

  const relationshipRows = useMemo(() => {
    const collaboratorRows = [];
    const instructorRows = [];

    const instructorIds = new Set([
      ...(project?.instructorIds || []),
      ...(rawProject?.instructorIds || []),
      ...(Array.isArray(project?.instructors)
        ? project.instructors.map((item) => item?.id).filter(Boolean)
        : []),
      ...(Array.isArray(rawProject?.instructors)
        ? rawProject.instructors.map((item) => item?.id).filter(Boolean)
        : []),
    ]);

    const collaboratorIds = new Set([
      ...(project?.collaboratorIds || []),
      ...(rawProject?.collaboratorIds || []),
      ...(Array.isArray(rawProject?.collaborators)
        ? rawProject.collaborators.map((item) => item?.id).filter(Boolean)
        : []),
      ...(Array.isArray(project?.team)
        ? project.team
            .filter(
              (member) => String(member.role || "").toLowerCase() !== "owner"
            )
            .map((member) => member?.id)
            .filter(Boolean)
        : []),
    ]);

    instructorIds.forEach((id) => {
      const user =
        findUserById(id) ||
        project?.instructors?.find((item) => String(item.id) === String(id)) ||
        rawProject?.instructors?.find((item) => String(item.id) === String(id));

      if (!user) return;

      instructorRows.push({
        id,
        user,
        type: "instructor",
        status: getStatusForUser(id, "accepted"),
      });
    });

    collaboratorIds.forEach((id) => {
      const user =
        findUserById(id) ||
        project?.team?.find((item) => String(item.id) === String(id)) ||
        rawProject?.collaborators?.find(
          (item) => String(item.id) === String(id)
        );

      if (!user) return;

      const role = normalizeRole(user.role);

      if (role === "instructor") return;
      if (instructorIds.has(id)) return;

      collaboratorRows.push({
        id,
        user,
        type: "collaborator",
        status: getStatusForUser(id, "accepted"),
      });
    });

    invitationStatuses.forEach((record) => {
      const status = normalizeStatus(record.status);
      if (["cancelled", "removed"].includes(status)) return;

      const user = findUserById(record.userId);

      if (!user) return;

      const role =
        record.role === "instructor" || normalizeRole(user.role) === "instructor"
          ? "instructor"
          : "collaborator";

      const alreadyInstructor = instructorRows.some(
        (row) => getUserKey(row.user) === getUserKey(user)
      );

      const alreadyCollaborator = collaboratorRows.some(
        (row) => getUserKey(row.user) === getUserKey(user)
      );

      if (role === "instructor") {
        if (alreadyInstructor) return;

        instructorRows.push({
          id: record.userId,
          user,
          type: "instructor",
          status,
        });

        return;
      }

      if (alreadyInstructor || alreadyCollaborator) return;

      collaboratorRows.push({
        id: record.userId,
        user,
        type: "collaborator",
        status,
      });
    });

    const instructorKeys = new Set(
      instructorRows.map((row) => getUserKey(row.user))
    );

    return {
      collaborators: uniqueRows(
        collaboratorRows.filter((row) => !instructorKeys.has(getUserKey(row.user)))
      ),
      instructors: uniqueRows(instructorRows),
    };
  }, [
    findUserById,
    getStatusForUser,
    invitationStatuses,
    project,
    rawProject,
  ]);

  const topContributor = useMemo(() => {
    const scoreMap = new Map();

    tasks.forEach((task) => {
      const status = String(task.status || "").toLowerCase();
      const isCompleted = status === "completed" || status === "done";
      if (!isCompleted) return;

      const keys = [
        task.assigneeId,
        task.assignee,
        task.assigneeName,
        task.assignedTo,
      ].map((value) => String(value || "").toLowerCase());

      keys.forEach((key) => {
        if (!key) return;
        scoreMap.set(key, (scoreMap.get(key) || 0) + 1);
      });
    });

    const candidates = [
      {
        id: project?.ownerId,
        name: project?.ownerName,
        email: rawProject?.owner?.email,
        avatar: rawProject?.owner?.avatar || rawProject?.owner?.image,
      },
      ...relationshipRows.collaborators
        .filter((row) => normalizeStatus(row.status) === "accepted")
        .map((row) => row.user),
    ].filter(Boolean);

    let best = candidates[0] || null;
    let bestScore = -1;

    candidates.forEach((user) => {
      const keys = [
        user.id,
        user.name,
        user.fullName,
        user.email,
        getDisplayName(user),
      ].map((value) => String(value || "").toLowerCase());

      const score = keys.reduce(
        (max, key) => Math.max(max, scoreMap.get(key) || 0),
        0
      );

      if (score > bestScore) {
        bestScore = score;
        best = user;
      }
    });

    return {
      user: best,
      score: Math.max(bestScore, 0),
    };
  }, [tasks, relationshipRows, project, rawProject]);

  const inviteCandidates = useMemo(() => {
    const activeInvitationUserIds = new Set(
      invitationStatuses
        .filter((item) =>
          ["pending", "accepted", "no reply", "no_reply", "no-reply"].includes(
            String(item.status || "").toLowerCase()
          )
        )
        .map((item) => String(item.userId))
    );

    const existingIds = new Set([
      ...(project?.collaboratorIds || []).map(String),
      ...(project?.instructorIds || []).map(String),
      ...activeInvitationUserIds,
      String(project?.ownerId),
    ]);

    const allowedInstructorIds = new Set(
      (course?.instructorIds || []).map((id) => String(id))
    );

    return users
      .filter((user) => {
        const role = normalizeRole(user.role);

        if (existingIds.has(String(user.id))) return false;

        if (inviteMode === "student" && role !== "student") return false;

        if (inviteMode === "instructor") {
          if (role !== "instructor") return false;
          if (allowedInstructorIds.size > 0 && !allowedInstructorIds.has(String(user.id))) {
            return false;
          }
        }

        return userMatchesSearch(user, inviteQuery);
      })
      .slice(0, 30);
  }, [users, invitationStatuses, project, inviteMode, inviteQuery, course]);

  const openInvite = (mode) => {
    setInviteMode(mode);
    setInviteQuery("");
    setInviteMessage("");
    setInviteOpen(true);
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setInviteQuery("");
    setInviteMessage("");
  };

  const handleModeChange = (mode) => {
    setInviteMode(mode);
    setInviteQuery("");
    setInviteMessage("");
  };

 const updateInvitationStatus = (user, status, role) => {
  const now = new Date().toISOString();
  const currentStatuses = project.invitationStatuses || [];
  const userId = user?.id;

  const normalizedRole =
    role === "instructor" ? "instructor" : "collaborator";

  const exists = currentStatuses.some(
    (item) => String(item.userId) === String(userId)
  );

  if (exists) {
    return currentStatuses.map((item) =>
      String(item.userId) === String(userId)
        ? {
            ...item,
            role: normalizedRole,
            status,
            updatedAt: now,
            ...(status === "pending"
              ? {
                  invitedAt: now,
                  sentAt: now,
                  respondedAt: null,
                }
              : {
                  respondedAt: now,
                }),
          }
        : item
    );
  }

  return [
    ...currentStatuses,
    {
      userId,
      role: normalizedRole,
      status,
      invitedAt: now,
      sentAt: now,
      updatedAt: now,
      respondedAt: null,
    },
  ];
};

  const sendInvitation = (user) => {
    if (!project?.id || !canInvitePeople || !user?.id) return;

    const role = inviteMode === "instructor" ? "instructor" : "collaborator";
    const nextStatuses = updateInvitationStatus(user, "pending", role);

    updateProject(project.id, {
      invitationStatuses: nextStatuses,
    });

    makeNotification(
      user.id,
      "Project invitation",
      `You were invited to join ${project.title} as ${
        role === "instructor" ? "course instructor" : "collaborator"
      }.`,
      project.id,
      role
    );

    setInviteMessage(`${getDisplayName(user)} has been invited.`);
    setActionMessage(`${getDisplayName(user)} has been invited.`);
    refreshProject?.();
  };

  const confirmCancelInvitation = () => {
    if (!cancelTarget?.user?.id || !project?.id) return;

    const role = cancelTarget.type === "instructor" ? "instructor" : "student";
    const nextStatuses = updateInvitationStatus(cancelTarget.user, "cancelled", role);

    updateProject(project.id, {
      invitationStatuses: nextStatuses,
    });

    setActionMessage(`Invitation to ${getDisplayName(cancelTarget.user)} was cancelled.`);
    setCancelTarget(null);
    refreshProject?.();
  };

  const removeCollaborator = (row) => {
    if (!project?.id || !canRemoveCollaborators || !row?.user?.id) return;

    const userId = String(row.user.id);
    const nextCollaboratorIds = (project.collaboratorIds || []).filter(
      (id) => String(id) !== userId
    );

    const nextStatuses = updateInvitationStatus(row.user, "removed", "student");

    updateProject(project.id, {
      collaboratorIds: nextCollaboratorIds,
      invitationStatuses: nextStatuses,
    });

    setActionMessage(`${getDisplayName(row.user)} was removed from the project.`);
    refreshProject?.();
  };

  const collaboratorRows = relationshipRows.collaborators.filter(
    (row) => !["cancelled", "removed"].includes(normalizeStatus(row.status))
  );
  const instructorRows = relationshipRows.instructors.filter(
    (row) => !["cancelled", "removed"].includes(normalizeStatus(row.status))
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-[var(--primary)]">
            Collaborators &amp; Instructors
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Manage team members, course instructors, and invitation statuses.
          </p>
        </div>

        {canInvitePeople && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openInvite("student")}
              className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--primary)]/10 bg-white px-4 py-2 text-sm font-black text-[var(--primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[rgba(156,213,255,0.16)]"
            >
              <UserPlus className="h-4 w-4" />
              Invite Collaborator
            </button>

            <button
              type="button"
              onClick={() => openInvite("instructor")}
              className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--primary)]/10 bg-white px-4 py-2 text-sm font-black text-[var(--primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[rgba(156,213,255,0.16)]"
            >
              <GraduationCap className="h-4 w-4" />
              Invite Instructor
            </button>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-[rgba(156,213,255,0.18)] px-4 py-3 text-sm font-bold text-[var(--primary)]">
          {actionMessage}
        </div>
      )}

      <section className="rounded-3xl border border-[color:var(--primary)]/10 bg-white/70 p-5 shadow-sm">
        <SectionHeader
          icon={Award}
          title="Top Contributor"
          subtitle="Based on completed project tasks and assigned work."
          count={topContributor.score ? `${topContributor.score} completed` : "0"}
        />

        {topContributor.user ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--primary)]/10 bg-white/80 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar user={topContributor.user} size="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-[var(--ink)]">
                  {getDisplayName(topContributor.user)}
                </p>
                <p className="truncate text-xs font-semibold text-[var(--muted)]">
                  {topContributor.score || 0} completed tasks
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No contributor data yet"
            description="Complete or assign tasks to highlight the top contributor."
          />
        )}
      </section>

      <section>
        <SectionHeader
          icon={Users}
          title="Collaborators"
          subtitle="Students invited or added to this project."
          count={collaboratorRows.length}
        />

        {collaboratorRows.length === 0 ? (
          <EmptyState
            title="No collaborators yet"
            description="Invite student collaborators to build the project team."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {collaboratorRows.map((row) => (
              <PersonCard
                key={`${row.type}-${row.id}`}
                row={row}
                canCancelInvitations={canCancelInvitations}
                canRemoveCollaborators={canRemoveCollaborators}
                onCancel={setCancelTarget}
                onRemove={removeCollaborator}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          icon={GraduationCap}
          title="Instructors"
          subtitle="Course instructors assigned or invited to this project."
          count={instructorRows.length}
        />

        {instructorRows.length === 0 ? (
          <EmptyState
            title="No instructors yet"
            description="Invite a course instructor linked to this project course."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {instructorRows.map((row) => (
              <PersonCard
                key={`${row.type}-${row.id}`}
                row={row}
                canCancelInvitations={canCancelInvitations}
                canRemoveCollaborators={false}
                onCancel={setCancelTarget}
                onRemove={removeCollaborator}
              />
            ))}
          </div>
        )}
      </section>

      <InviteModal
        open={inviteOpen}
        mode={inviteMode}
        query={inviteQuery}
        message={inviteMessage}
        candidates={inviteCandidates}
        onClose={closeInvite}
        onModeChange={handleModeChange}
        onQueryChange={setInviteQuery}
        onSendInvitation={sendInvitation}
      />

      <DeleteConfirmationModal
        open={Boolean(cancelTarget)}
        title="Cancel invitation?"
        description={
          cancelTarget
            ? `This will withdraw the invitation sent to ${getDisplayName(cancelTarget.user)}.`
            : "This action cannot be undone."
        }
        confirmText="Cancel invite"
        onCancel={() => setCancelTarget(null)}
        onConfirm={confirmCancelInvitation}
      />
    </div>
  );
}
