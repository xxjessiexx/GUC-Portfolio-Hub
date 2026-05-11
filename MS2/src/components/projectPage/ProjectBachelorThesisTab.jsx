import { useState } from "react";
import { MessageSquare, Trash2, UploadCloud } from "lucide-react";

import AppModal from "@/components/common/AppModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { EmptyState } from "@/components/projectPage/ProjectPageShared";
import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

function ModalButton({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90",
    ghost: "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      className={`rounded-2xl px-4 py-2.5 text-sm font-black transition ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function ProjectBachelorThesisTab({
  visibleDrafts,
  isCreator,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  newDraft,
  setNewDraft,
  newDraftFile,
  setNewDraftFile,
  draftMessage,
  setDraftFeedbackDrafts,
  onAddThesisDraft,
  onViewDraft,
  onSelectFinalDraft,
  onDeleteThesisDraft,
  onAddDraftFeedback,
  onEditDraftFeedback,
  onDeleteDraftFeedback,
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [finalDraftTarget, setFinalDraftTarget] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const openAddFeedback = (draft) => {
    setDraftFeedbackDrafts((current) => ({ ...current, [draft.id]: "" }));
    setFeedbackModal({ mode: "add", draftId: draft.id, message: "" });
  };

  const openEditFeedback = (draft, feedback) => {
    setFeedbackModal({
      mode: "edit",
      draftId: draft.id,
      feedbackId: feedback.id,
      message: feedback.message || "",
    });
  };

  const submitFeedback = () => {
    if (!feedbackModal?.message?.trim()) return;

    if (feedbackModal.mode === "edit") {
      onEditDraftFeedback(
        feedbackModal.draftId,
        feedbackModal.feedbackId,
        feedbackModal.message
      );
    } else {
      setDraftFeedbackDrafts((current) => ({
        ...current,
        [feedbackModal.draftId]: feedbackModal.message,
      }));
      onAddDraftFeedback(feedbackModal.draftId);
    }

    setFeedbackModal(null);
  };

  const handleUpload = async () => {
    await onAddThesisDraft();
    if (newDraftFile) setUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[var(--primary)]">
            Bachelor Thesis
          </h3>

          <p className="mt-1 max-w-3xl text-sm font-semibold text-[var(--muted)]">
            Multiple drafts are supported. Only the selected final draft is public;
            every other draft remains private.
          </p>
        </div>

        {isCreator && (
          <ModalButton onClick={() => setUploadOpen(true)}>
            <UploadCloud className="mr-2 inline h-4 w-4" />
            Upload Draft
          </ModalButton>
        )}
      </div>

      {draftMessage && (
        <p className="rounded-2xl bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
          {draftMessage}
        </p>
      )}

      <div className="grid gap-4">
        {visibleDrafts.length === 0 ? (
          <EmptyState
            title="No visible drafts"
            description={
              isCreator
                ? "Upload your first thesis draft."
                : "The creator has not selected a final public draft yet."
            }
          />
        ) : (
          visibleDrafts.map((draft) => (
            <article
              key={draft.id}
              className="rounded-[28px] border border-[color:var(--primary)]/10 bg-white/80 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-black text-[var(--ink)]">
                    {draft.title}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                    {draft.fileName || draft.file?.name || "PDF draft"} • Uploaded{" "}
                    {formatProjectDate(draft.uploadedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      draft.isFinal
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {draft.isFinal ? "Final Draft" : "Private Draft"}
                  </span>

                  <ModalButton variant="ghost" onClick={() => onViewDraft(draft)}>
                    View PDF
                  </ModalButton>

                  {isCreator && !draft.isFinal && (
                    <ModalButton onClick={() => setFinalDraftTarget(draft)}>
                      Select Final
                    </ModalButton>
                  )}

                  {isCreator && !draft.isFinal && (
                    <ModalButton
                      variant="danger"
                      onClick={() => setDraftToDelete(draft)}
                    >
                      <Trash2 className="inline h-4 w-4" />
                    </ModalButton>
                  )}
                </div>
              </div>

              {canViewComments && draft.isFinal && (
                <div className="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-wide text-blue-600">
                      Thesis Feedback
                    </p>

                    {canAddInstructorFeedback && (
                      <button
                        type="button"
                        onClick={() => openAddFeedback(draft)}
                        className="rounded-xl bg-blue-100 px-3 py-1.5 text-xs font-black text-blue-700 transition hover:bg-blue-200"
                      >
                        <MessageSquare className="mr-1 inline h-3 w-3" />
                        Add feedback
                      </button>
                    )}
                  </div>

                  {(draft.feedback || []).length === 0 && (
                    <p className="text-sm font-semibold text-gray-700">
                      No thesis feedback yet.
                    </p>
                  )}

                  {(draft.feedback || []).map((item) => (
                    <div key={item.id} className="rounded-xl bg-white/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black text-[var(--primary)]">
                          {item.authorName || "Instructor"}
                        </p>

                        {item.authorId === loggedInUser?.id && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditFeedback(draft, item)}
                              className="text-xs font-black text-[var(--primary)]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setFeedbackToDelete({
                                  draftId: draft.id,
                                  feedbackId: item.id,
                                })
                              }
                              className="text-xs font-black text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {uploadOpen && (
        <AppModal title="Upload thesis draft" onClose={() => setUploadOpen(false)} maxWidth="max-w-xl">
          <div className="space-y-4">
            <input
              value={newDraft.title}
              onChange={(event) =>
                setNewDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Optional draft title"
              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
            />

            <label className="flex min-h-12 cursor-pointer items-center rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-[var(--muted)]">
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setNewDraftFile(file);
                }}
              />

              <span className="truncate">
                {newDraftFile?.name || "Choose PDF draft"}
              </span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <ModalButton variant="ghost" onClick={() => setUploadOpen(false)}>
              Cancel
            </ModalButton>
            <ModalButton onClick={handleUpload}>Upload draft</ModalButton>
          </div>
        </AppModal>
      )}

      {feedbackModal && (
        <AppModal
          title={feedbackModal.mode === "edit" ? "Edit thesis feedback" : "Add thesis feedback"}
          onClose={() => setFeedbackModal(null)}
          maxWidth="max-w-xl"
        >
          <textarea
            value={feedbackModal.message}
            onChange={(event) => {
              const message = event.target.value;
              setFeedbackModal((current) => ({ ...current, message }));
              if (feedbackModal.mode === "add") {
                setDraftFeedbackDrafts((current) => ({
                  ...current,
                  [feedbackModal.draftId]: message,
                }));
              }
            }}
            placeholder="Write thesis draft feedback..."
            className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--primary)]"
          />

          <div className="mt-6 flex justify-end gap-3">
            <ModalButton variant="ghost" onClick={() => setFeedbackModal(null)}>
              Cancel
            </ModalButton>
            <ModalButton
              onClick={submitFeedback}
              disabled={!feedbackModal.message.trim()}
            >
              {feedbackModal.mode === "edit" ? "Save feedback" : "Add feedback"}
            </ModalButton>
          </div>
        </AppModal>
      )}

      <DeleteConfirmationModal
        open={Boolean(draftToDelete)}
        title="Delete thesis draft?"
        description={
          draftToDelete
            ? `This will remove ${draftToDelete.title}. Final drafts cannot be deleted.`
            : "This action cannot be undone."
        }
        confirmText="Delete draft"
        onCancel={() => setDraftToDelete(null)}
        onConfirm={() => {
          onDeleteThesisDraft(draftToDelete.id);
          setDraftToDelete(null);
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(finalDraftTarget)}
        title="Select final draft?"
        description={
          finalDraftTarget
            ? `This will make ${finalDraftTarget.title} public and mark all other drafts as private.`
            : "Only one draft can be final."
        }
        confirmText="Select final"
        onCancel={() => setFinalDraftTarget(null)}
        onConfirm={() => {
          onSelectFinalDraft(finalDraftTarget.id);
          setFinalDraftTarget(null);
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(feedbackToDelete)}
        title="Delete thesis feedback?"
        description="This feedback note will be removed from the final thesis draft."
        confirmText="Delete feedback"
        onCancel={() => setFeedbackToDelete(null)}
        onConfirm={() => {
          onDeleteDraftFeedback(
            feedbackToDelete.draftId,
            feedbackToDelete.feedbackId
          );
          setFeedbackToDelete(null);
        }}
      />
    </div>
  );
}
