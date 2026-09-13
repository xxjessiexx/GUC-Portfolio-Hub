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

export function getInstructorProjectReviewState(project, instructorId) {
  const contentUpdatedAt = getProjectContentUpdatedAt(project);
  const lastReviewedAt = getInstructorLastReviewedAt(project, instructorId);

  const contentTime = parseTimestamp(contentUpdatedAt);
  const reviewedTime = parseTimestamp(lastReviewedAt);

  if (reviewedTime === null) {
    return {
      status: "never-reviewed",
      label: "Never reviewed",
      contentUpdatedAt,
      lastReviewedAt: null,
    };
  }

  if (contentTime !== null && contentTime > reviewedTime) {
    return {
      status: "updated",
      label: "Updated since your review",
      contentUpdatedAt,
      lastReviewedAt,
    };
  }

  return {
    status: "up-to-date",
    label: "Up to date",
    contentUpdatedAt,
    lastReviewedAt,
  };
}

export function withInstructorReviewState(project, instructorId, reviewedAt = new Date().toISOString()) {
  if (!project || !instructorId) return project;

  const source = getSourceProject(project);
  const id = String(instructorId);
  const existingStates = Array.isArray(source.reviewStates) ? source.reviewStates : [];
  const existing = existingStates.find(
    (entry) => String(entry?.instructorId || entry?.userId || "") === id
  );

  const nextEntry = {
    ...(existing || {}),
    instructorId,
    lastReviewedAt: reviewedAt,
  };

  return {
    ...source,
    reviewStates: existing
      ? existingStates.map((entry) =>
          String(entry?.instructorId || entry?.userId || "") === id
            ? nextEntry
            : entry
        )
      : [...existingStates, nextEntry],
  };
}
