import { useEffect, useState } from "react";

import {
  getDisplayName,
  makeId,
} from "@/utils/projectPage/projectPageHelpers";

export function useProjectFeedback({
  project,
  canAddInstructorFeedback,
  loggedInUser,
  isAdmin,
  persistProject,
  makeNotification,
}) {
  const [projectFeedbackDraft, setProjectFeedbackDraft] = useState("");
  const [ratingDraft, setRatingDraft] = useState("");

  useEffect(() => {
    setRatingDraft(project?.rating ? String(project.rating) : "");
  }, [project?.rating]);

  const addProjectFeedback = () => {
    if (!project || !canAddInstructorFeedback || !projectFeedbackDraft.trim()) {
      return;
    }

    const nextFeedback = [
      ...(project.feedback || []),
      {
        id: makeId("feedback"),
        authorId: loggedInUser?.id,
        authorName: getDisplayName(loggedInUser),
        message: projectFeedbackDraft.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    persistProject({ feedback: nextFeedback });
    setProjectFeedbackDraft("");

    makeNotification(
      project.ownerId,
      "New project feedback",
      `${getDisplayName(loggedInUser)} added feedback on ${project.title}.`,
      project.id
    );
  };

  const deleteProjectFeedback = (feedbackId) => {
    if (!project) return;

    persistProject({
      feedback: (project.feedback || []).filter(
        (item) => item.id !== feedbackId
      ),
    });
  };

  const editProjectFeedback = (feedbackId) => {
    if (!project) return;

    const item = (project.feedback || []).find(
      (feedback) => feedback.id === feedbackId
    );

    if (!item || (item.authorId !== loggedInUser?.id && !isAdmin)) {
      return;
    }

    const nextMessage = window.prompt(
      "Edit project feedback",
      item.message || ""
    );

    if (nextMessage === null || !nextMessage.trim()) return;

    persistProject({
      feedback: (project.feedback || []).map((feedback) =>
        feedback.id === feedbackId
          ? {
              ...feedback,
              message: nextMessage.trim(),
              updatedAt: new Date().toISOString(),
            }
          : feedback
      ),
    });
  };

  const saveRating = () => {
    if (!project || !canAddInstructorFeedback) return;

    const ratingValue = Math.max(0, Math.min(5, Number(ratingDraft) || 0));

    persistProject({ rating: ratingValue });
  };

  return {
    projectFeedbackDraft,
    setProjectFeedbackDraft,
    ratingDraft,
    setRatingDraft,
    addProjectFeedback,
    deleteProjectFeedback,
    editProjectFeedback,
    saveRating,
  };
}