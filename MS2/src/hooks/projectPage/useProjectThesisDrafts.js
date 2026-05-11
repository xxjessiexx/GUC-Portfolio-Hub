import { useMemo, useState } from "react";

import {
  createStoredFileReference,
  getProjectFile,
  saveProjectFile,
} from "@/utils/projectPage/projectFiles";

import {
  getDisplayName,
  makeId,
} from "@/utils/projectPage/projectPageHelpers";

export function useProjectThesisDrafts({
  project,
  isCreator,
  canAddInstructorFeedback,
  loggedInUser,
  persistProject,
  makeNotification,
}) {
  const [draftFeedbackDrafts, setDraftFeedbackDrafts] = useState({});
  const [newDraft, setNewDraft] = useState({ title: "", fileName: "" });
  const [newDraftFile, setNewDraftFile] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");

  const visibleDrafts = useMemo(() => {
    if (!project?.thesisDrafts) return [];

    if (isCreator) return project.thesisDrafts;

    return project.thesisDrafts.filter(
      (draft) => draft.isFinal || draft.visibility === "public"
    );
  }, [isCreator, project]);

  const addThesisDraft = async () => {
    if (!isCreator || !newDraftFile) {
      setDraftMessage("Choose a PDF thesis draft before adding it.");
      return;
    }

    try {
      const savedFile = await saveProjectFile(
        newDraftFile,
        `${project.id}-draft`
      );

      const fileRef = createStoredFileReference(savedFile);
      const title = newDraft.title.trim() || newDraftFile.name;

      const nextDrafts = [
        ...(project.thesisDrafts || []),
        {
          id: makeId("thesis-draft"),
          title,
          file: fileRef,
          uploadedAt: new Date().toISOString(),
          visibility: "private",
          isFinal: false,
          feedback: [],
        },
      ];

      persistProject({ thesisDrafts: nextDrafts });

      setNewDraft({ title: "", fileName: "" });
      setNewDraftFile(null);
      setDraftMessage("Thesis draft uploaded successfully.");
    } catch {
      setDraftMessage("Could not save this thesis draft in browser storage.");
    }
  };

  const selectFinalDraft = (draftId) => {
    if (!isCreator || !project) return;

    persistProject({
      thesisDrafts: (project.thesisDrafts || []).map((draft) => ({
        ...draft,
        isFinal: draft.id === draftId,
        visibility: draft.id === draftId ? "public" : "private",
      })),
    });
  };

  const deleteThesisDraft = (draftId) => {
    if (!isCreator || !project) return;

    const target = (project.thesisDrafts || []).find(
      (draft) => draft.id === draftId
    );

    if (target?.isFinal) return;

    persistProject({
      thesisDrafts: (project.thesisDrafts || []).filter(
        (draft) => draft.id !== draftId
      ),
    });
  };

  const viewDraft = async (draft) => {
    setDraftMessage("");

    const fileId = draft.file?.id || draft.fileId || draft.id;

    try {
      const saved = await getProjectFile(fileId);
      const file = saved?.file;

      if (!file) {
        setDraftMessage(
          "This draft is listed, but its uploaded file is not available in this browser storage."
        );
        return;
      }

      const url = URL.createObjectURL(file);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setDraftMessage("Could not open this draft file from browser storage.");
    }
  };

  const addDraftFeedback = (draftId) => {
    if (!canAddInstructorFeedback || !project) return;

    const message = draftFeedbackDrafts[draftId]?.trim();
    if (!message) return;

    persistProject({
      thesisDrafts: (project.thesisDrafts || []).map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              feedback: [
                ...(draft.feedback || []),
                {
                  id: makeId("draft-feedback"),
                  authorId: loggedInUser.id,
                  authorName: getDisplayName(loggedInUser),
                  message,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : draft
      ),
    });

    setDraftFeedbackDrafts((current) => ({
      ...current,
      [draftId]: "",
    }));

    makeNotification(
      project.ownerId,
      "New thesis feedback",
      `${getDisplayName(loggedInUser)} commented on a thesis draft in ${project.title}.`,
      project.id
    );
  };

  const editDraftFeedback = (draftId, feedbackId, nextMessage = "") => {
    if (!project) return;

    const draft = (project.thesisDrafts || []).find(
      (item) => item.id === draftId
    );

    const feedback = draft?.feedback?.find((item) => item.id === feedbackId);

    if (!feedback || feedback.authorId !== loggedInUser?.id) {
      return;
    }

    if (!nextMessage.trim()) return;

    persistProject({
      thesisDrafts: (project.thesisDrafts || []).map((item) =>
        item.id === draftId
          ? {
              ...item,
              feedback: (item.feedback || []).map((entry) =>
                entry.id === feedbackId
                  ? {
                      ...entry,
                      message: nextMessage.trim(),
                      updatedAt: new Date().toISOString(),
                    }
                  : entry
              ),
            }
          : item
      ),
    });
  };

  const deleteDraftFeedback = (draftId, feedbackId) => {
    if (!project) return;

    const draft = (project.thesisDrafts || []).find(
      (item) => item.id === draftId
    );

    const feedback = draft?.feedback?.find((item) => item.id === feedbackId);

    if (!feedback || feedback.authorId !== loggedInUser?.id) return;

    persistProject({
      thesisDrafts: (project.thesisDrafts || []).map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              feedback: (draft.feedback || []).filter(
                (item) => item.id !== feedbackId
              ),
            }
          : draft
      ),
    });
  };

  return {
    visibleDrafts,
    draftFeedbackDrafts,
    setDraftFeedbackDrafts,
    newDraft,
    setNewDraft,
    newDraftFile,
    setNewDraftFile,
    draftMessage,
    addThesisDraft,
    selectFinalDraft,
    deleteThesisDraft,
    viewDraft,
    addDraftFeedback,
    editDraftFeedback,
    deleteDraftFeedback,
  };
}