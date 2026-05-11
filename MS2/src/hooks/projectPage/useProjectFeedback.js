import { useMemo, useState } from "react";

import {
  getDisplayName,
  getImageForUser,
  makeId,
} from "@/utils/projectPage/projectPageHelpers";

function getInvitationStatus(project, userId) {
  const status = (project?.invitationStatuses || []).find(
    (item) => String(item.userId) === String(userId)
  )?.status;

  return status || "accepted";
}

function getProjectStudentRecipients(project, currentUserId) {
  if (!project) return [];

  const acceptedCollaboratorIds = (project.collaboratorIds || []).filter(
    (id) => getInvitationStatus(project, id) === "accepted"
  );

  return Array.from(new Set([project.ownerId, ...acceptedCollaboratorIds]))
    .filter(Boolean)
    .filter((id) => String(id) !== String(currentUserId));
}

function getProjectRatings(project) {
  const ratings = project?.raw?.ratings || project?.ratings;
  return Array.isArray(ratings) ? ratings : [];
}

function getUserRating(project, userId) {
  const ownRating = getProjectRatings(project).find(
    (rating) => String(rating.instructorId) === String(userId)
  );

  if (ownRating) return Number(ownRating.value) || 0;

  return Number(project?.rating) || 0;
}

function getAverageRating(ratings, fallbackRating = 0) {
  if (!ratings.length) return Number(fallbackRating) || 0;

  const total = ratings.reduce(
    (sum, rating) => sum + (Number(rating.value) || 0),
    0
  );

  return Number((total / ratings.length).toFixed(1));
}

export function useProjectFeedback({
  project,
  canAddInstructorFeedback,
  loggedInUser,
  persistProject,
  makeNotification,
}) {
  const [projectFeedbackDraft, setProjectFeedbackDraft] = useState("");
  const [ratingDraft, setRatingDraft] = useState("");

  const ratings = useMemo(() => getProjectRatings(project), [project]);

  const myRating = useMemo(
    () => getUserRating(project, loggedInUser?.id),
    [project, loggedInUser?.id]
  );

  const notifyProjectStudents = (title, body) => {
    getProjectStudentRecipients(project, loggedInUser?.id).forEach((userId) => {
      makeNotification(userId, title, body, project.id);
    });
  };

  const addProjectFeedback = () => {
    if (!project || !canAddInstructorFeedback || !projectFeedbackDraft.trim()) {
      return;
    }

    const authorName = getDisplayName(loggedInUser);
    const message = projectFeedbackDraft.trim();

    const nextFeedback = [
      ...(project.feedback || []),
      {
        id: makeId("feedback"),
        authorId: loggedInUser?.id,
        authorName,
        authorImage: getImageForUser(loggedInUser),
        message,
        createdAt: new Date().toISOString(),
      },
    ];

    persistProject({ feedback: nextFeedback });
    setProjectFeedbackDraft("");

    notifyProjectStudents(
      "New project feedback",
      `${authorName} added feedback on ${project.title}.`
    );
  };

  const deleteProjectFeedback = (feedbackId) => {
    if (!project) return;

    const item = (project.feedback || []).find(
      (feedback) => String(feedback.id) === String(feedbackId)
    );

    if (!item || item.authorId !== loggedInUser?.id) {
      return;
    }

    persistProject({
      feedback: (project.feedback || []).filter(
        (feedback) => String(feedback.id) !== String(feedbackId)
      ),
    });
  };

  const editProjectFeedback = (feedbackId, nextMessage) => {
    if (!project || !nextMessage?.trim()) return;

    const item = (project.feedback || []).find(
      (feedback) => String(feedback.id) === String(feedbackId)
    );

    if (!item || item.authorId !== loggedInUser?.id) {
      return;
    }

    const updatedMessage = nextMessage.trim();

    persistProject({
      feedback: (project.feedback || []).map((feedback) =>
        String(feedback.id) === String(feedbackId)
          ? {
              ...feedback,
              message: updatedMessage,
              updatedAt: new Date().toISOString(),
            }
          : feedback
      ),
    });

    notifyProjectStudents(
      "Project feedback updated",
      `${getDisplayName(loggedInUser)} updated feedback on ${project.title}.`
    );
  };

  const saveRating = () => {
    if (!project || !canAddInstructorFeedback) return;

    const ratingValue = Math.max(0, Math.min(5, Number(ratingDraft) || 0));
    const now = new Date().toISOString();
    const instructorId = loggedInUser?.id || "admin";
    const existingRatings = getProjectRatings(project);

    const ratingEntry = {
      instructorId,
      instructorName: getDisplayName(loggedInUser),
      instructorImage: getImageForUser(loggedInUser),
      value: ratingValue,
      updatedAt: now,
    };

    const hadRating = existingRatings.some(
      (rating) => String(rating.instructorId) === String(instructorId)
    );

    const nextRatings = hadRating
      ? existingRatings.map((rating) =>
          String(rating.instructorId) === String(instructorId)
            ? { ...rating, ...ratingEntry }
            : rating
        )
      : [...existingRatings, { ...ratingEntry, createdAt: now }];

    persistProject({
      ratings: nextRatings,
      rating: getAverageRating(nextRatings, ratingValue),
      ratingMeta: ratingEntry,
    });

    notifyProjectStudents(
      "Project rating updated",
      `${getDisplayName(loggedInUser)} rated ${project.title} ${ratingValue} / 5.`
    );
  };

  return {
    projectFeedbackDraft,
    setProjectFeedbackDraft,
    ratingDraft,
    setRatingDraft,
    ratings,
    myRating,
    addProjectFeedback,
    deleteProjectFeedback,
    editProjectFeedback,
    saveRating,
  };
}
