import {
  formatProjectDate,
  getDisplayName,
  getImageForUser,
} from "@/utils/projectPage/projectPageHelpers";

export function normalizeVisibility(value) {
  return String(value || "private").toLowerCase() === "public"
    ? "Public"
    : "Private";
}

export function normalizeProjectType(value, course = "") {
  const text = `${value || ""} ${course || ""}`.toLowerCase();

  if (text.includes("bachelor") || text.includes("thesis")) {
    return "Bachelor Project";
  }

  return "Course Project";
}

export function getProjectTechnologies(project) {
  return project?.technologies || project?.tags || project?.languages || [];
}

export function getProjectRating(project) {
  const rating = project?.rating;

  if (typeof rating === "number") return rating;
  if (typeof rating === "string") return Number(rating) || 0;

  if (rating && typeof rating === "object") {
    return Number(rating.value || rating.score || 0) || 0;
  }

  return Number(project?.averageRating || 0) || 0;
}

export function getInvitationStatus(project, userId) {
  const status = (project?.invitationStatuses || []).find(
    (item) => String(item.userId) === String(userId)
  )?.status;

  return status || "accepted";
}

function normalizeTask(task, index, owner) {
  const assigneeId = task.assigneeId || task.assignedToId || task.userId || "";

  const assigneeName =
    task.assigneeName ||
    task.assignee ||
    task.assignedTo ||
    getDisplayName(owner) ||
    "Unassigned";

  return {
    id: task.id || `task-${index + 1}`,
    title: task.title || `Task ${index + 1}`,
    description: task.description || task.details || "No description added.",
    assigneeId,
    assignee: assigneeName,
    deadline: task.deadline || task.dueDate || "",
    status: task.status || "pending",
    instructorComment: task.instructorComment || "",
    feedback: Array.isArray(task.feedback) ? task.feedback : [],
    order: Number.isFinite(Number(task.order)) ? Number(task.order) : index,
  };
}

function normalizeFeedbackItems(value) {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    return [
      {
        id: value.id || "legacy-feedback",
        authorId: value.authorId || value.instructorId || "",
        authorName: value.authorName || value.instructorName || "Instructor",
        message: value.message || value.comment || "",
        createdAt:
          value.createdAt || value.updatedAt || new Date().toISOString(),
      },
    ].filter((item) => item.message);
  }

  return [];
}

function normalizeDraft(draft) {
  const file = draft.file || draft.fileRef || null;

  return {
    ...draft,
    title: draft.title || file?.name || draft.name || "Thesis draft",
    fileName: draft.fileName || file?.name || draft.name || "PDF draft",
    uploadedAt:
      draft.uploadedAt ||
      draft.createdAt ||
      draft.savedAt ||
      new Date().toISOString(),
    visibility: draft.visibility || (draft.isFinal ? "public" : "private"),
    isFinal: Boolean(draft.isFinal),
    feedback: Array.isArray(draft.feedback) ? draft.feedback : [],
  };
}

export function normalizeProjectForPage(storeProject) {
  if (!storeProject) return null;

  const owner = storeProject.owner || storeProject.student || null;

  const collaborators = Array.isArray(storeProject.collaborators)
    ? storeProject.collaborators
    : [];

  const instructors = Array.isArray(storeProject.instructors)
    ? storeProject.instructors
    : [];

  const course =
    storeProject.course ||
    storeProject.courseName ||
    storeProject.courseCode ||
    "Unlinked Course";

  const type = normalizeProjectType(storeProject.type, course);

  const acceptedCollaborators = collaborators.filter(
    (member) => getInvitationStatus(storeProject, member.id) === "accepted"
  );

  const team =
    type === "Bachelor Project"
      ? []
      : [
          {
            name: getDisplayName(owner),
            role: "Owner",
            img: getImageForUser(owner, 1),
            id: owner?.id,
          },
          ...acceptedCollaborators.map((member, index) => ({
            name: getDisplayName(member),
            role: "Member",
            img: getImageForUser(member, index + 2),
            id: member?.id,
          })),
        ].filter((member) => member.name && member.name !== "Unknown User");

  const acceptedInstructors = instructors.filter(
    (instructor) => getInvitationStatus(storeProject, instructor.id) === "accepted"
  );

  const instructorCards = acceptedInstructors.map((instructor, index) => ({
    name: getDisplayName(instructor),
    role: instructor?.title || "Course Instructor",
    img: getImageForUser(instructor, index + 3),
    id: instructor?.id,
  }));

  const firstInstructor = instructorCards[0];
  const rawTasks = Array.isArray(storeProject.tasks) ? storeProject.tasks : [];

  return {
    raw: storeProject,
    id: storeProject.id,
    title: storeProject.title || storeProject.name || "Untitled Project",
    type,
    course,
    courseId: storeProject.courseId,
    courseCode: storeProject.courseCode,
    courseName: storeProject.courseName,
    visibility: normalizeVisibility(storeProject.visibility),
    createdAt: formatProjectDate(storeProject.createdAt),
    updatedAt: formatProjectDate(
      storeProject.updatedAt || storeProject.updated || storeProject.createdAt
    ),
    collaborators: acceptedCollaborators.length,
    rating: getProjectRating(storeProject),
    github:
      storeProject.github ||
      storeProject.githubLink ||
      storeProject.githubUrl ||
      "",
    video:
      typeof storeProject.video === "string"
        ? storeProject.video
        : storeProject.video?.url ||
          storeProject.demoUrl ||
          storeProject.demo ||
          "",
    videoFile:
      storeProject.video &&
      typeof storeProject.video === "object" &&
      !storeProject.video?.url
        ? storeProject.video
        : null,

    description:
      storeProject.description ||
      storeProject.shortDescription ||
      storeProject.summary ||
      "No description added yet.",

    technologies: getProjectTechnologies(storeProject),
    team,
    instructors: instructorCards,
    instructor: firstInstructor || {
      name:
        storeProject.instructor ||
        storeProject.instructorNames?.[0] ||
        "Unassigned Instructor",
      role: "Course Instructor",
      img: getImageForUser(null, 3),
      id: "",
    },

    ownerName: getDisplayName(owner),
    ownerId: owner?.id || storeProject.ownerId || storeProject.studentId || storeProject.authorId || storeProject.creatorId,
    owner,

    collaboratorIds: storeProject.collaboratorIds || [],
    instructorIds: storeProject.instructorIds || [],
    invitationStatuses: Array.isArray(storeProject.invitationStatuses)
      ? storeProject.invitationStatuses
      : [],

    tasks: rawTasks
      .map((task, index) => normalizeTask(task, index, owner))
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),

    feedback: normalizeFeedbackItems(
      storeProject.feedback || storeProject.instructorFeedback
    ),
    comments: Array.isArray(storeProject.comments) ? storeProject.comments : [],
    thesisDrafts: Array.isArray(storeProject.thesisDrafts)
      ? storeProject.thesisDrafts.map(normalizeDraft)
      : [],
  };
}