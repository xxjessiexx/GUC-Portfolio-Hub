function parseTimestamp(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function latestTimestamp(values = []) {
  const valid = values.map(parseTimestamp).filter((value) => value !== null);
  return valid.length ? Math.max(...valid) : null;
}

function getSourceProject(project) {
  return project?.raw || project || {};
}

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

export function getProjectContentUpdatedAt(project) {
  const source = getSourceProject(project);
  return (
    source.contentUpdatedAt ||
    source.updatedAt ||
    source.updated ||
    source.createdAt ||
    null
  );
}

export function getInstructorReviewEntry(project, instructorId) {
  if (!project || !instructorId) return null;
  const source = getSourceProject(project);
  return (
    (source.reviewStates || []).find((entry) =>
      sameId(entry?.instructorId || entry?.userId, instructorId)
    ) || null
  );
}

export function getInstructorLastReviewedAt(project, instructorId) {
  if (!project || !instructorId) return null;

  const source = getSourceProject(project);
  const id = String(instructorId);

  const explicitReviewTimes = (source.reviewStates || [])
    .filter((entry) => String(entry?.instructorId || entry?.userId || "") === id)
    .map((entry) => entry.lastReviewedAt || entry.reviewedAt || entry.updatedAt);

  const ratingTimes = (source.ratings || [])
    .filter((entry) => String(entry?.instructorId || entry?.userId || "") === id)
    .map((entry) => entry.updatedAt || entry.createdAt);

  const projectFeedbackTimes = (source.feedback || [])
    .filter((entry) => String(entry?.authorId || entry?.instructorId || "") === id)
    .map((entry) => entry.updatedAt || entry.createdAt);

  const taskFeedbackTimes = (source.tasks || []).flatMap((task) =>
    (task.feedback || [])
      .filter((entry) => String(entry?.authorId || entry?.instructorId || "") === id)
      .map((entry) => entry.updatedAt || entry.createdAt)
  );

  const thesisFeedbackTimes = (source.thesisDrafts || []).flatMap((draft) =>
    (draft.feedback || [])
      .filter((entry) => String(entry?.authorId || entry?.instructorId || "") === id)
      .map((entry) => entry.updatedAt || entry.createdAt)
  );

  const time = latestTimestamp([
    ...explicitReviewTimes,
    ...ratingTimes,
    ...projectFeedbackTimes,
    ...taskFeedbackTimes,
    ...thesisFeedbackTimes,
  ]);

  return time === null ? null : new Date(time).toISOString();
}

export function getProjectActivity(project) {
  const source = getSourceProject(project);
  return Array.isArray(source.activityHistory) ? source.activityHistory : [];
}

export function getProjectChangesSinceReview(project, instructorId) {
  const lastReviewedAt = getInstructorLastReviewedAt(project, instructorId);
  const reviewedTime = parseTimestamp(lastReviewedAt);

  return getProjectActivity(project)
    .filter((event) => event?.kind === "content")
    .filter((event) => {
      const eventTime = parseTimestamp(event.createdAt);
      if (eventTime === null) return false;
      return reviewedTime === null || eventTime > reviewedTime;
    })
    .sort((a, b) => (parseTimestamp(b.createdAt) || 0) - (parseTimestamp(a.createdAt) || 0));
}

export function getProjectChangeSummary(project, instructorId, { limit = 3 } = {}) {
  const changes = getProjectChangesSinceReview(project, instructorId);
  if (!changes.length) return [];

  const seen = new Set();
  const summary = [];

  for (const change of changes) {
    const key = `${change.type || "change"}:${change.targetId || change.label || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    summary.push({
      type: change.type || "project-update",
      label: change.label || "Project content updated",
      detail: change.detail || "",
      tab: change.tab || "overview",
      targetId: change.targetId || "",
      createdAt: change.createdAt,
    });
    if (summary.length >= limit) break;
  }

  return summary;
}

export function getInstructorProjectReviewState(project, instructorId) {
  const contentUpdatedAt = getProjectContentUpdatedAt(project);
  const lastReviewedAt = getInstructorLastReviewedAt(project, instructorId);
  const reviewEntry = getInstructorReviewEntry(project, instructorId);

  const contentTime = parseTimestamp(contentUpdatedAt);
  const reviewedTime = parseTimestamp(lastReviewedAt);
  const workflowStatus = reviewEntry?.workflowStatus || "reviewed";

  if (reviewedTime === null) {
    return {
      status: "never-reviewed",
      label: "Never reviewed",
      contentUpdatedAt,
      lastReviewedAt: null,
      workflowStatus: "not-started",
      workflowLabel: "Not started",
      changes: getProjectChangeSummary(project, instructorId),
    };
  }

  if (contentTime !== null && contentTime > reviewedTime) {
    const revisionSubmitted = workflowStatus === "waiting-on-student";
    return {
      status: "updated",
      label: revisionSubmitted ? "Revision submitted" : "Updated since your review",
      contentUpdatedAt,
      lastReviewedAt,
      workflowStatus: revisionSubmitted ? "revision-submitted" : workflowStatus,
      workflowLabel: revisionSubmitted ? "Revision submitted" : getWorkflowLabel(workflowStatus),
      changes: getProjectChangeSummary(project, instructorId),
    };
  }

  return {
    status: "up-to-date",
    label: "Up to date",
    contentUpdatedAt,
    lastReviewedAt,
    workflowStatus,
    workflowLabel: getWorkflowLabel(workflowStatus),
    changes: [],
  };
}

export function getWorkflowLabel(status) {
  const labels = {
    "not-started": "Not started",
    reviewed: "Reviewed",
    "follow-up": "Follow-up",
    "waiting-on-student": "Waiting on student",
    "revision-submitted": "Revision submitted",
  };
  return labels[status] || "Reviewed";
}

export function withInstructorReviewState(
  project,
  instructorId,
  reviewedAt = new Date().toISOString(),
  updates = {}
) {
  if (!project || !instructorId) return project;

  const source = getSourceProject(project);
  const id = String(instructorId);
  const existingStates = Array.isArray(source.reviewStates) ? source.reviewStates : [];
  const existing = existingStates.find((entry) =>
    sameId(entry?.instructorId || entry?.userId, id)
  );

  const nextEntry = {
    ...(existing || {}),
    instructorId,
    lastReviewedAt: reviewedAt,
    workflowStatus: updates.workflowStatus || existing?.workflowStatus || "reviewed",
    ...updates,
  };

  return {
    ...source,
    reviewStates: existing
      ? existingStates.map((entry) =>
          sameId(entry?.instructorId || entry?.userId, id) ? nextEntry : entry
        )
      : [...existingStates, nextEntry],
  };
}
