import { MessageSquare, Trash2, UploadCloud } from "lucide-react";

import { EmptyState } from "@/components/projectPage/ProjectPageShared";
import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

export default function ProjectBachelorThesisTab({
  visibleDrafts,
  isCreator,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  isAdmin,
  newDraft,
  setNewDraft,
  newDraftFile,
  setNewDraftFile,
  draftMessage,
  draftFeedbackDrafts,
  setDraftFeedbackDrafts,
  onAddThesisDraft,
  onViewDraft,
  onSelectFinalDraft,
  onDeleteThesisDraft,
  onAddDraftFeedback,
  onEditDraftFeedback,
  onDeleteDraftFeedback,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-[var(--primary)]">
          Bachelor Thesis
        </h3>

        <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
          Multiple drafts are supported. Only the selected final draft is public;
          every other draft remains private and hidden from everyone else,
          including instructors.
        </p>
      </div>

      {isCreator && (
        <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1.15fr_auto]">
            <input
              value={newDraft.title}
              onChange={(event) =>
                setNewDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Optional draft title"
              className="rounded-xl border bg-white px-3 py-3 text-sm font-semibold outline-none"
            />

            <label className="flex min-h-12 cursor-pointer items-center rounded-xl border bg-white px-3 py-3 text-sm font-bold text-[var(--muted)]">
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

            <button
              type="button"
              onClick={onAddThesisDraft}
              className="rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <UploadCloud className="mr-2 inline h-4 w-4" />
              Add Draft
            </button>
          </div>

          {draftMessage && (
            <p className="mt-3 rounded-2xl bg-[rgba(156,213,255,0.18)] px-4 py-3 text-xs font-bold text-[var(--primary)]">
              {draftMessage}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
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
            <div
              key={draft.id}
              className="rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[var(--ink)]">
                    {draft.title}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                    {draft.fileName || draft.file?.name || "PDF draft"} •
                    Uploaded {formatProjectDate(draft.uploadedAt)}
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

                  <button
                    type="button"
                    onClick={() => onViewDraft(draft)}
                    className="rounded-xl border border-[color:var(--primary)]/10 bg-white px-3 py-2 text-xs font-black text-[var(--primary)]"
                  >
                    View PDF
                  </button>

                  {isCreator && !draft.isFinal && (
                    <button
                      type="button"
                      onClick={() => onSelectFinalDraft(draft.id)}
                      className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-black text-white"
                    >
                      Select Final
                    </button>
                  )}

                  {isCreator && !draft.isFinal && (
                    <button
                      type="button"
                      onClick={() => onDeleteThesisDraft(draft.id)}
                      className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                    >
                      <Trash2 className="inline h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {canViewComments && draft.isFinal && (
                <div className="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-blue-600">
                    Thesis Feedback
                  </p>

                  {(draft.feedback || []).length === 0 && (
                    <p className="text-sm text-gray-700">
                      No thesis feedback yet.
                    </p>
                  )}

                  {(draft.feedback || []).map((item) => (
                    <div key={item.id} className="rounded-xl bg-white/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black text-[var(--primary)]">
                          {item.authorName || "Instructor"}
                        </p>

                        {(item.authorId === loggedInUser?.id || isAdmin) && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onEditDraftFeedback(draft.id, item.id)
                              }
                              className="text-xs font-black text-[var(--primary)]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onDeleteDraftFeedback(draft.id, item.id)
                              }
                              className="text-xs font-black text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-700">
                        {item.message}
                      </p>
                    </div>
                  ))}

                  {canAddInstructorFeedback && (
                    <div className="flex gap-2">
                      <input
                        value={draftFeedbackDrafts[draft.id] || ""}
                        onChange={(event) =>
                          setDraftFeedbackDrafts((current) => ({
                            ...current,
                            [draft.id]: event.target.value,
                          }))
                        }
                        placeholder="Add thesis draft feedback..."
                        className="min-h-10 flex-1 rounded-xl border bg-white px-3 text-sm font-semibold outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => onAddDraftFeedback(draft.id)}
                        className="rounded-xl bg-[var(--primary)] px-4 text-xs font-black text-white"
                      >
                        <MessageSquare className="mr-1 inline h-3 w-3" />
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}