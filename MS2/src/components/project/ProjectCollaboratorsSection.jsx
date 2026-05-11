import { useMemo, useState } from "react";

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

function getImageForUser(user, fallbackIndex = 1) {
  return (
    user?.avatar ||
    user?.image ||
    user?.profileImage ||
    `https://i.pravatar.cc/80?img=${fallbackIndex}`
  );
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

  return status || "accepted";
}

function statusClassName(status) {
  const clean = normalizeStatus(status);

  if (clean === "accepted") return "bg-green-100 text-green-700";
  if (clean === "rejected") return "bg-red-100 text-red-600";
  if (clean === "cancelled") return "bg-gray-100 text-gray-500";

  return "bg-yellow-100 text-yellow-700";
}

function roleBadgeClassName(type) {
  if (type === "instructor") {
    return "bg-[#EAF6FF] text-[var(--primary)]";
  }

  return "bg-[rgba(156,213,255,0.25)] text-[var(--primary)]";
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-white/50 p-5 text-sm font-semibold text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
      <p className="font-black text-[var(--ink)]">{title}</p>
      <p className="mt-1">{description}</p>
    </div>
  );
}

function makeNotification(userId, title, body, projectId) {
  if (!userId) return;

  addNotification({
    id: makeId("notification"),
    userId,
    title,
    body,
    message: body,
    type: "project",
    projectId,
    unread: true,
    createdAt: new Date().toISOString(),
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

function RelationshipRow({
  row,
  index,
  canManageCollaborators,
  onCancel,
  onRemove,
}) {
  const status = normalizeStatus(row.status);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/60 p-4">
      <div className="flex items-center gap-3">
        <img
          src={getImageForUser(row.user, index + 5)}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <p className="text-sm font-black text-[var(--ink)]">
            {getDisplayName(row.user)}
          </p>
          <p className="text-xs font-semibold text-[var(--muted)]">
            {row.user.email}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${roleBadgeClassName(
            row.type
          )}`}
        >
          {row.type === "instructor" ? "Instructor" : "Collaborator"}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClassName(
            status
          )}`}
        >
          {status}
        </span>

        {canManageCollaborators && status === "no reply" && (
          <button
            type="button"
            onClick={() => onCancel(row.id)}
            className="rounded-xl bg-yellow-50 px-3 py-2 text-xs font-black text-yellow-700 transition hover:bg-yellow-100"
          >
            Cancel
          </button>
        )}

        {canManageCollaborators &&
          row.type === "collaborator" &&
          status === "accepted" && (
            <button
              type="button"
              onClick={() => onRemove(row.id)}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
            >
              Remove
            </button>
          )}
      </div>
    </div>
  );
}

export default function ProjectCollaboratorsSection({
  project,
  users = [],
  courses = [],
  tasks = [],
  canManageCollaborators,
  refreshProject,
}) {
  const [inviteQuery, setInviteQuery] = useState("");
  const [invitePanel, setInvitePanel] = useState(null); // "student" | "instructor" | null
  const [inviteMessage, setInviteMessage] = useState("");

  const rawProject = project?.raw || project || {};

  const invitationStatuses = Array.isArray(project?.invitationStatuses)
    ? project.invitationStatuses
    : [];

  const course = courses.find(
    (item) =>
      String(item.id) === String(project?.courseId) ||
      String(item.code || item.courseCode || "").toLowerCase() ===
        String(project?.courseCode || "").toLowerCase() ||
      String(item.name || item.courseName || "").toLowerCase() ===
        String(project?.course || project?.courseName || "").toLowerCase()
  );

  const findUserById = (id) =>
    users.find((user) => String(user.id) === String(id));

  const getStatusRecord = (userId) =>
    invitationStatuses.find((item) => String(item.userId) === String(userId));

  const getStatusForUser = (userId, fallback = "accepted") =>
    normalizeStatus(getStatusRecord(userId)?.status || fallback);

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

    if (project?.type === "Bachelor Project") {
      (course?.instructorIds || []).forEach((id) => instructorIds.add(id));
    }

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
          status: normalizeStatus(record.status),
        });

        return;
      }

      if (alreadyInstructor || alreadyCollaborator) return;

      collaboratorRows.push({
        id: record.userId,
        user,
        type: "collaborator",
        status: normalizeStatus(record.status),
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
  }, [project, rawProject, users, course, invitationStatuses]);

  const topContributor = useMemo(() => {
    const scoreMap = new Map();

    tasks.forEach((task) => {
      const status = String(task.status || "").toLowerCase();
      const isCompleted = status === "completed";
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
      ...relationshipRows.collaborators.map((row) => row.user),
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
    if (!invitePanel) return [];

    const existingIds = new Set([
      ...(project?.collaboratorIds || []).map(String),
      ...(project?.instructorIds || []).map(String),
      ...(invitationStatuses || []).map((item) => String(item.userId)),
      String(project?.ownerId),
    ]);

    return users
      .filter((user) => {
        const role = normalizeRole(user.role);

        if (existingIds.has(String(user.id))) return false;

        if (invitePanel === "student" && role !== "student") return false;

        if (invitePanel === "instructor") {
          if (role !== "instructor") return false;

          const allowedInstructorIds = course?.instructorIds || [];

          if (
            allowedInstructorIds.length > 0 &&
            !allowedInstructorIds.includes(user.id)
          ) {
            return false;
          }
        }

        return userMatchesSearch(user, inviteQuery);
      })
      .slice(0, 8);
  }, [invitePanel, inviteQuery, users, project, course, invitationStatuses]);

  const persistProject = (updates) => {
    const updated = updateProject(project.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    refreshProject?.();

    window.dispatchEvent(new Event("demo-db-change"));

    return updated;
  };

  const sendInvitationToUser = (target) => {
    if (!canManageCollaborators || !target || !invitePanel) return;

    const targetRole = normalizeRole(target.role);

    if (invitePanel === "student" && targetRole !== "student") {
      setInviteMessage("Collaborator invitations can only be sent to students.");
      return;
    }

    if (invitePanel === "instructor") {
      const allowedInstructorIds = course?.instructorIds || [];

      if (
        targetRole !== "instructor" ||
        (allowedInstructorIds.length > 0 &&
          !allowedInstructorIds.includes(target.id))
      ) {
        setInviteMessage("Only instructors linked to this course can be invited.");
        return;
      }
    }

    const nextStatuses = [
      ...invitationStatuses.filter(
        (item) => String(item.userId) !== String(target.id)
      ),
      {
        userId: target.id,
        role: invitePanel === "instructor" ? "instructor" : "student",
        status: "pending",
        invitedAt: new Date().toISOString(),
      },
    ];

    persistProject({ invitationStatuses: nextStatuses });

    makeNotification(
      target.id,
      "Project invitation received",
      `${project.ownerName} invited you to join ${project.title}.`,
      project.id
    );

    setInviteQuery("");
    setInviteMessage(`Invitation sent to ${getDisplayName(target)}.`);
  };

  const cancelInvitation = (userId) => {
    const nextStatuses = [
      ...invitationStatuses.filter(
        (item) => String(item.userId) !== String(userId)
      ),
      {
        userId,
        role: "student",
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      },
    ];

    persistProject({ invitationStatuses: nextStatuses });
  };

  const removeCollaborator = (userId) => {
    if (!canManageCollaborators) return;

    const nextStatuses = [
      ...invitationStatuses.filter(
        (item) => String(item.userId) !== String(userId)
      ),
      {
        userId,
        role: "student",
        status: "cancelled",
        removedAt: new Date().toISOString(),
      },
    ];

    persistProject({
      collaboratorIds: (project?.collaboratorIds || []).filter(
        (id) => String(id) !== String(userId)
      ),
      collaborators: Array.isArray(rawProject?.collaborators)
        ? rawProject.collaborators.filter(
            (user) => String(user.id) !== String(userId)
          )
        : rawProject?.collaborators,
      invitationStatuses: nextStatuses,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-[var(--primary)]">
            Collaborators & Instructors
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Manage project participation, invitation statuses, and instructor links.
          </p>
        </div>

        {canManageCollaborators && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setInvitePanel((current) =>
                  current === "student" ? null : "student"
                );
                setInviteQuery("");
                setInviteMessage("");
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-black shadow-sm transition hover:-translate-y-0.5 ${
                invitePanel === "student"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[color:var(--primary)]/15 bg-white/80 text-[var(--primary)]"
              }`}
            >
              + Invite Collaborator
            </button>

            <button
              type="button"
              onClick={() => {
                setInvitePanel((current) =>
                  current === "instructor" ? null : "instructor"
                );
                setInviteQuery("");
                setInviteMessage("");
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-black shadow-sm transition hover:-translate-y-0.5 ${
                invitePanel === "instructor"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[color:var(--primary)]/15 bg-white/80 text-[var(--primary)]"
              }`}
            >
              + Invite Instructor
            </button>
          </div>
        )}
      </div>

      {invitePanel && canManageCollaborators && (
        <div className="rounded-3xl border border-[color:var(--primary)]/10 bg-white/70 p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[var(--ink)]">
                {invitePanel === "instructor"
                  ? "Invite course instructor"
                  : "Invite student collaborator"}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                Search by email, first name, or last name, then choose from the list.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setInvitePanel(null);
                setInviteQuery("");
                setInviteMessage("");
              }}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
            >
              Close
            </button>
          </div>

          <input
            value={inviteQuery}
            onChange={(event) => {
              setInviteQuery(event.target.value);
              setInviteMessage("");
            }}
            placeholder="Search by email, first name, or last name"
            className="mb-4 h-12 w-full rounded-2xl border border-[color:var(--primary)]/10 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[var(--primary)]"
          />

          {inviteMessage && (
            <p className="mb-3 rounded-2xl bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
              {inviteMessage}
            </p>
          )}

          <div className="space-y-3">
            {inviteCandidates.length === 0 ? (
              <EmptyState
                title="No matching users"
                description={
                  invitePanel === "instructor"
                    ? "No course instructors match your search."
                    : "No student collaborators match your search."
                }
              />
            ) : (
              inviteCandidates.map((user, index) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageForUser(user, index + 12)}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-black text-[var(--ink)]">
                        {getDisplayName(user)}
                      </p>
                      <p className="text-xs font-semibold text-[var(--muted)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => sendInvitationToUser(user)}
                    className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Send Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary)]">
          Top Contributor
        </p>

        {topContributor.user ? (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={getImageForUser(topContributor.user, 4)}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-black text-[var(--ink)]">
                {getDisplayName(topContributor.user)}
              </p>
              <p className="text-xs font-semibold text-[var(--muted)]">
                Based on completed and assigned project tasks
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
            No contributor activity yet.
          </p>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-black text-[var(--ink)]">
                Collaborators
              </h4>
              <p className="text-xs font-semibold text-[var(--muted)]">
                Students invited or added to this project.
              </p>
            </div>

            <span className="rounded-full bg-[rgba(156,213,255,0.18)] px-3 py-1 text-xs font-black text-[var(--primary)]">
              {relationshipRows.collaborators.length}
            </span>
          </div>

          <div className="space-y-3">
            {relationshipRows.collaborators.length === 0 ? (
              <EmptyState
                title="No collaborators"
                description="No student collaborators have been added or invited yet."
              />
            ) : (
              relationshipRows.collaborators.map((row, index) => (
                <RelationshipRow
                  key={`${row.type}-${row.id}`}
                  row={row}
                  index={index}
                  canManageCollaborators={canManageCollaborators}
                  onCancel={cancelInvitation}
                  onRemove={removeCollaborator}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-black text-[var(--ink)]">
                Instructors
              </h4>
              <p className="text-xs font-semibold text-[var(--muted)]">
                Assigned or invited course instructors.
              </p>
            </div>

            <span className="rounded-full bg-[rgba(156,213,255,0.18)] px-3 py-1 text-xs font-black text-[var(--primary)]">
              {relationshipRows.instructors.length}
            </span>
          </div>

          <div className="space-y-3">
            {relationshipRows.instructors.length === 0 ? (
              <EmptyState
                title="No instructors"
                description="No instructors have been linked or invited yet."
              />
            ) : (
              relationshipRows.instructors.map((row, index) => (
                <RelationshipRow
                  key={`${row.type}-${row.id}`}
                  row={row}
                  index={index}
                  canManageCollaborators={canManageCollaborators}
                  onCancel={cancelInvitation}
                  onRemove={removeCollaborator}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}