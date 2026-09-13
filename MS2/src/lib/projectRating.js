export function normalizeProjectRating(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return Math.min(5, Math.max(0, numeric));
}

export function hasProjectRating(value) {
  return normalizeProjectRating(value) !== null;
}

export function getProjectRatingClassification(value) {
  const rating = normalizeProjectRating(value);

  if (rating === null) return "Not Rated";
  if (rating >= 4.5) return "Outstanding";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.0) return "Good";
  if (rating >= 2.0) return "Fair";

  return "Needs Improvement";
}

export function formatProjectRating(value, { includeClassification = true } = {}) {
  const rating = normalizeProjectRating(value);

  if (rating === null) return "Not Rated";

  const score = `${rating.toFixed(1)} / 5`;

  return includeClassification
    ? `${score} · ${getProjectRatingClassification(rating)}`
    : score;
}

export function getInstructorProjectRating(project, instructorId) {
  if (!project || !instructorId) return null;

  const ratings = Array.isArray(project.ratings) ? project.ratings : [];
  const matchingRating = ratings.find(
    (entry) =>
      String(entry?.instructorId || entry?.userId || "") === String(instructorId)
  );

  if (matchingRating) {
    return normalizeProjectRating(matchingRating.value ?? matchingRating.rating);
  }

  // Backward compatibility for older demo records that only stored one project-level
  // rating and one assigned instructor. Do not infer ownership when multiple
  // instructors are attached to the project.
  const instructorIds = Array.isArray(project.instructorIds)
    ? project.instructorIds
    : [];

  if (
    ratings.length === 0 &&
    instructorIds.length === 1 &&
    String(instructorIds[0]) === String(instructorId)
  ) {
    return normalizeProjectRating(project.rating);
  }

  return null;
}
