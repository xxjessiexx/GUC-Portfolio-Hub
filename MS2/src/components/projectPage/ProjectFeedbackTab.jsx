import { useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { FaRegStar, FaStar } from "react-icons/fa";

import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { EmptyState } from "@/components/projectPage/ProjectPageShared";
import {
  formatProjectDate,
  getDisplayName,
  getImageForUser,
} from "@/utils/projectPage/projectPageHelpers";

function Avatar({ src, name, size = "h-12 w-12" }) {
  const initial = name?.charAt(0)?.toUpperCase() || "I";

  return (
    <div
      className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-black text-white shadow-sm`}
    >
      <span>{initial}</span>

      {src && (
        <img
          src={src}
          alt={name || "User"}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}

function RatingStars({ value = 0, onChange, readonly = false, size = "text-lg" }) {
  const rating = Number(value) || 0;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Math.round(rating);
        const Icon = active ? FaStar : FaRegStar;

        if (readonly) {
          return (
            <Icon
              key={star}
              className={`${size} ${active ? "text-amber-400" : "text-slate-300"}`}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(String(star))}
            className={`${size} transition hover:-translate-y-0.5 hover:scale-110`}
            aria-label={`Rate ${star} out of 5`}
          >
            <Icon className={active ? "text-amber-400" : "text-slate-300"} />
          </button>
        );
      })}
    </div>
  );
}

function FeedbackEditModal({ feedback, onCancel, onSave }) {
  const [message, setMessage] = useState(feedback?.message || "");

  useEffect(() => {
    setMessage(feedback?.message || "");
  }, [feedback]);

  if (!feedback) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/40 bg-white p-7 shadow-2xl">
        <h2 className="text-2xl font-black text-[var(--ink)]">
          Edit feedback
        </h2>

        <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
          Update the instructor feedback note shown on this project.
        </p>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-5 min-h-36 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold outline-none focus:border-[var(--primary)]"
          autoFocus
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-500 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(message)}
            disabled={!message.trim()}
            className="rounded-2xl bg-[var(--primary)] px-5 py-3 font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function getProjectRatings(project) {
  const ratings = project?.raw?.ratings || project?.ratings;
  return Array.isArray(ratings) ? ratings : [];
}

function getInstructorRating(project, instructorId) {
  const rating = getProjectRatings(project).find(
    (item) => String(item.instructorId) === String(instructorId)
  );

  if (rating) return Number(rating.value) || 0;

  return Number(project?.rating) || 0;
}

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
  const [editingRating, setEditingRating] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [feedbackToEdit, setFeedbackToEdit] = useState(null);

  const instructorName =
    project.instructor?.name || getDisplayName(loggedInUser) || "Instructor";

  const instructorImage =
    project.instructor?.img ||
    project.instructor?.image ||
    project.instructor?.avatar ||
    getImageForUser(project.raw?.instructors?.[0], 3);

  const projectRating = Number(project.rating) || 0;
  const loggedInInstructorRating = getInstructorRating(project, loggedInUser?.id);

  const selectedFeedbackToDelete = useMemo(
    () =>
      (project.feedback || []).find(
        (item) => String(item.id) === String(feedbackToDelete)
      ),
    [feedbackToDelete, project.feedback]
  );

  const selectedFeedbackToEdit = useMemo(
    () =>
      (project.feedback || []).find(
        (item) => String(item.id) === String(feedbackToEdit)
      ),
    [feedbackToEdit, project.feedback]
  );

  const handleStartEditRating = () => {
    setRatingDraft(loggedInInstructorRating ? String(loggedInInstructorRating) : "");
    setEditingRating(true);
  };

  const handleCancelEditRating = () => {
    setRatingDraft(loggedInInstructorRating ? String(loggedInInstructorRating) : "");
    setEditingRating(false);
  };

  const handleSaveRating = () => {
    onSaveRating();
    setEditingRating(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[var(--primary)]">
        Instructor Feedback
      </h3>

      <div className="rounded-2xl border border-[color:var(--primary)]/15 bg-white/80 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={instructorImage} name={instructorName} />

            <div>
              <p className="text-sm font-black text-[var(--ink)]">
                {instructorName}
              </p>

              <p className="text-xs font-semibold text-[var(--muted)]">
                Course Instructor
              </p>
            </div>
          </div>

          {!editingRating && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
                <RatingStars value={projectRating} readonly />

                <span className="text-sm font-black text-amber-700">
                  {projectRating.toFixed(1)} / 5
                </span>
              </div>

              {canAddInstructorFeedback && (
                <button
                  type="button"
                  onClick={handleStartEditRating}
                  className="rounded-xl border border-[color:var(--primary)]/20 bg-white px-4 py-2 text-sm font-black text-[var(--primary)] transition hover:bg-[color:var(--primary)]/5"
                >
                  {loggedInInstructorRating ? "Edit rating" : "Add rating"}
                </button>
              )}
            </div>
          )}

          {editingRating && canAddInstructorFeedback && (
            <div className="flex flex-wrap items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
              <RatingStars
                value={ratingDraft}
                onChange={setRatingDraft}
                size="text-xl"
              />

              <span className="text-sm font-black text-amber-700">
                {(Number(ratingDraft) || 0).toFixed(1)} / 5
              </span>

              <button
                type="button"
                onClick={handleSaveRating}
                className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-black text-white transition hover:bg-amber-600"
              >
                Save
              </button>

              <button
                type="button"
                onClick={handleCancelEditRating}
                className="rounded-full border border-amber-300 px-4 py-1.5 text-xs font-black text-amber-700 transition hover:bg-amber-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {project.feedback.length === 0 && (
        <EmptyState
          title="No project feedback yet"
          description="Instructor project-level feedback will appear here."
        />
      )}

      {project.feedback.map((item) => {
        const authorName = item.authorName || instructorName;
        const authorImage = item.authorImage || item.authorAvatar || instructorImage;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[color:var(--primary)]/15 bg-white/80 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Avatar src={authorImage} name={authorName} size="h-11 w-11" />

                <div>
                  <p className="text-sm font-black text-[var(--ink)]">
                    {authorName}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                    {formatProjectDate(item.updatedAt || item.createdAt)}
                    {item.updatedAt ? " · Edited" : ""}
                  </p>
                </div>
              </div>

              {(item.authorId === loggedInUser?.id || isAdmin) && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFeedbackToEdit(item.id)}
                    className="text-xs font-black text-[var(--primary)] transition hover:opacity-70"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackToDelete(item.id)}
                    className="text-xs font-black text-red-500 transition hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 leading-relaxed text-sm font-semibold text-[var(--muted)]">
              {item.message}
            </p>
          </div>
        );
      })}

      {canAddInstructorFeedback && (
        <div className="rounded-2xl border border-[color:var(--primary)]/15 bg-white/80 p-5 shadow-sm">
          <p className="mb-2 flex items-center gap-2 text-sm font-black text-[var(--ink)]">
            <MessageSquare className="h-4 w-4 text-[var(--primary)]" />
            Add general feedback
          </p>

          <textarea
            value={projectFeedbackDraft}
            onChange={(event) => setProjectFeedbackDraft(event.target.value)}
            placeholder="Write project-level feedback..."
            className="min-h-28 w-full rounded-xl border bg-white p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onAddProjectFeedback}
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
            >
              Add Feedback
            </button>
          </div>
        </div>
      )}

      <FeedbackEditModal
        feedback={selectedFeedbackToEdit}
        onCancel={() => setFeedbackToEdit(null)}
        onSave={(message) => {
          onEditProjectFeedback(feedbackToEdit, message);
          setFeedbackToEdit(null);
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(feedbackToDelete)}
        title="Delete feedback?"
        description={
          selectedFeedbackToDelete
            ? "This instructor feedback note will be permanently removed from the project."
            : "This action cannot be undone."
        }
        confirmText="Delete feedback"
        onCancel={() => setFeedbackToDelete(null)}
        onConfirm={() => {
          onDeleteProjectFeedback(feedbackToDelete);
          setFeedbackToDelete(null);
        }}
      />
    </div>
  );
}
