import { MessageSquare, Star } from "lucide-react";

import { EmptyState } from "@/components/projectPage/ProjectPageShared";
import { formatProjectDate } from "@/utils/projectPage/projectPageHelpers";

export default function ProjectFeedbackTab({
  project,
  loggedInUser,
  isAdmin,
  canAddInstructorFeedback,
  ratingDraft,
  setRatingDraft,
  projectFeedbackDraft,
  setProjectFeedbackDraft,
  onSaveRating,
  onAddProjectFeedback,
  onEditProjectFeedback,
  onDeleteProjectFeedback,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black text-[var(--primary)]">
          Instructor Feedback
        </h3>

        {canAddInstructorFeedback && (
          <div className="flex items-center gap-2 rounded-2xl border bg-white/70 px-3 py-2">
            <Star className="h-4 w-4 text-yellow-500" />

            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={ratingDraft}
              onChange={(event) => setRatingDraft(event.target.value)}
              className="w-20 bg-transparent text-sm font-black outline-none"
            />

            <span className="text-xs font-black text-[var(--muted)]">/ 5</span>

            <button
              type="button"
              onClick={onSaveRating}
              className="text-xs font-black text-[var(--primary)]"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-black text-white">
              {project.instructor.name?.charAt(0) || "I"}
            </div>

            <div>
              <p className="text-sm font-black text-[var(--ink)]">
                Project rating
              </p>

              <p className="text-xs text-[var(--muted)]">
                Visible to everyone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
            ⭐ {project.rating || 0} / 5
          </div>
        </div>
      </div>

      {project.feedback.length === 0 && (
        <EmptyState
          title="No project feedback yet"
          description="Instructor project-level feedback will appear here."
        />
      )}

      {project.feedback.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-black text-white">
                {(item.authorName || project.instructor.name)?.charAt(0) || "I"}
              </div>

              <div>
                <p className="text-sm font-black text-[var(--ink)]">
                  {item.authorName || project.instructor.name}
                </p>

                <p className="text-xs text-[var(--muted)]">
                  {formatProjectDate(item.createdAt)}
                </p>
              </div>
            </div>

            {(item.authorId === loggedInUser?.id || isAdmin) && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditProjectFeedback(item.id)}
                  className="text-xs font-black text-[var(--primary)]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteProjectFeedback(item.id)}
                  className="text-xs font-black text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-sm text-[var(--muted)]">
            {item.message}
          </p>
        </div>
      ))}

      {canAddInstructorFeedback && (
        <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-black text-[var(--ink)]">
            <MessageSquare className="h-4 w-4 text-[var(--primary)]" />
            Add general feedback
          </p>

          <textarea
            value={projectFeedbackDraft}
            onChange={(event) => setProjectFeedbackDraft(event.target.value)}
            placeholder="Write project-level feedback..."
            className="min-h-28 w-full rounded-xl border bg-white p-3 text-sm font-semibold outline-none"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onAddProjectFeedback}
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-black text-white"
            >
              Add Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}