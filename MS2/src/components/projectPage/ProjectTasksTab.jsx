import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, GripVertical, MessageSquare, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import AppModal from "@/components/common/AppModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import DragDropList from "@/components/ui/DragDropList";
import { EmptyState } from "@/components/projectPage/ProjectPageShared";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "post-poned", label: "Post-Poned" },
  { value: "completed", label: "Completed" },
];

const statusStyles = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "in-progress": "border-sky-200 bg-sky-50 text-sky-700",
  pending: "border-slate-200 bg-slate-50 text-slate-600",
  "post-poned": "border-amber-200 bg-amber-50 text-amber-700",
};

function normalizeStatus(status) {
  return String(status || "pending").toLowerCase();
}

function getStatusLabel(status) {
  const normalized = normalizeStatus(status);
  return STATUS_OPTIONS.find((option) => option.value === normalized)?.label || "Pending";
}

function getInitial(name) {
  return String(name || "?").trim().charAt(0).toUpperCase() || "?";
}

function TaskAvatar({ name }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[color:var(--primary)]/10 text-sm font-black text-[var(--primary)] ring-1 ring-[color:var(--primary)]/10">
      {getInitial(name)}
    </div>
  );
}

function StatusPill({ status }) {
  const normalized = normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${
        statusStyles[normalized] || statusStyles.pending
      }`}
    >
      {normalized === "completed" && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
      {getStatusLabel(normalized)}
    </span>
  );
}

function TaskCard({
  task,
  canManageTasks,
  canEditStatus,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  onOpenEditTask,
  onRequestDeleteTask,
  onOpenStatusModal,
  onOpenAddFeedback,
  onOpenEditFeedback,
  onRequestDeleteFeedback,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const feedback = task.feedback || [];
  const hasFeedback = feedback.length > 0 || Boolean(task.instructorComment);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isDragging ? "scale-[1.01] shadow-xl" : ""
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          {canManageTasks ? (
            <button
              type="button"
              {...listeners}
              {...attributes}
              className="mt-1 grid h-10 w-8 shrink-0 place-items-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-[var(--primary)] active:cursor-grabbing"
              aria-label="Drag task to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </button>
          ) : (
            <div className="mt-1 w-8 shrink-0" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-black text-[var(--ink)]">
                {task.title || "Untitled task"}
              </h3>
              <StatusPill status={task.status} />
            </div>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[var(--muted)]">
              {task.description || "No description added."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs font-black text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                <UserRound className="h-3.5 w-3.5" />
                {task.assignee || "Unassigned"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {task.deadline ? `Deadline: ${task.deadline}` : "No deadline"}
              </span>

              {feedback.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {feedback.length} feedback note{feedback.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 lg:min-w-[280px]">
          {canEditStatus && (
            <button
              type="button"
              onClick={() => onOpenStatusModal(task)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50"
            >
              <Clock3 className="h-4 w-4" />
              Status
            </button>
          )}

          {canAddInstructorFeedback && (
            <button
              type="button"
              onClick={() => onOpenAddFeedback(task)}
              className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </button>
          )}

          {canManageTasks && (
            <>
              <button
                type="button"
                onClick={() => onOpenEditTask(task)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[var(--primary)] transition hover:bg-[color:var(--primary)]/5"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onRequestDeleteTask(task)}
                className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {canViewComments && (
        <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              <MessageSquare className="h-4 w-4" />
              Instructor comments
            </p>

            {!hasFeedback && (
              <span className="text-xs font-bold text-slate-500">
                No comments yet
              </span>
            )}
          </div>

          {task.instructorComment && (
            <p className="rounded-2xl bg-white/80 p-3 text-sm font-semibold text-slate-700">
              {task.instructorComment}
            </p>
          )}

          {feedback.length > 0 && (
            <div className="space-y-3">
              {feedback.map((item) => {
                const canEditFeedback = item.authorId === loggedInUser?.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <TaskAvatar name={item.authorName || "Instructor"} />
                        <div>
                          <p className="text-sm font-black text-[var(--ink)]">
                            {item.authorName || "Instructor"}
                          </p>
                          <p className="text-xs font-semibold text-[var(--muted)]">
                            Instructor feedback
                          </p>
                        </div>
                      </div>

                      {canEditFeedback && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEditFeedback(task, item)}
                            className="rounded-xl px-2 py-1 text-xs font-black text-[var(--primary)] transition hover:bg-[color:var(--primary)]/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestDeleteFeedback(task, item)}
                            className="rounded-xl px-2 py-1 text-xs font-black text-red-500 transition hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                      {item.message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function ProjectTasksTab({
  tasks,
  canManageTasks,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  setTaskFeedbackDrafts,
  onAddTaskClick,
  onStoreTasks,
  onUpdateTaskStatus,
  onOpenEditTask,
  onDeleteTask,
  onAddTaskFeedback,
  onEditTaskFeedback,
  onDeleteTaskFeedback,
}) {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  const taskCountLabel = useMemo(() => {
    const count = tasks.length;
    if (count === 0) return "No tasks yet";
    return `${count} task${count === 1 ? "" : "s"}`;
  }, [tasks.length]);

  const openAddFeedback = (task) => {
    setTaskFeedbackDrafts((current) => ({ ...current, [task.id]: "" }));
    setFeedbackModal({ mode: "add", taskId: task.id, message: "" });
  };

  const openEditFeedback = (task, feedback) => {
    setFeedbackModal({
      mode: "edit",
      taskId: task.id,
      feedbackId: feedback.id,
      message: feedback.message || "",
    });
  };

  const closeFeedbackModal = () => setFeedbackModal(null);

  const submitFeedbackModal = () => {
    if (!feedbackModal?.message?.trim()) return;

    if (feedbackModal.mode === "edit") {
      onEditTaskFeedback(
        feedbackModal.taskId,
        feedbackModal.feedbackId,
        feedbackModal.message
      );
    } else {
      onAddTaskFeedback(feedbackModal.taskId, feedbackModal.message);
    }

    closeFeedbackModal();
  };

  const submitStatusChange = () => {
    if (!statusModal?.taskId || !statusModal?.status) return;
    onUpdateTaskStatus(statusModal.taskId, statusModal.status);
    setStatusModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-black text-[var(--ink)]">Project Tasks</h3>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            Reorder work by importance, track progress, and keep instructor feedback attached to each task.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
            {taskCountLabel}
          </span>

          {canManageTasks && (
            <button
              type="button"
              onClick={onAddTaskClick}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description={
            canManageTasks
              ? "Create the first task for this project."
              : "The creator has not added tasks yet."
          }
        />
      ) : (
        <DragDropList
          items={tasks}
          setItems={canManageTasks ? onStoreTasks : () => {}}
        >
          <div className="space-y-4">
            {tasks.map((task) => {
              const canEditStatus = canManageTasks;

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  canManageTasks={canManageTasks}
                  canEditStatus={canEditStatus}
                  canViewComments={canViewComments}
                  canAddInstructorFeedback={canAddInstructorFeedback}
                  loggedInUser={loggedInUser}
                  onOpenEditTask={onOpenEditTask}
                  onRequestDeleteTask={setTaskToDelete}
                  onOpenStatusModal={(selectedTask) =>
                    setStatusModal({
                      taskId: selectedTask.id,
                      title: selectedTask.title,
                      status: normalizeStatus(selectedTask.status),
                    })
                  }
                  onOpenAddFeedback={openAddFeedback}
                  onOpenEditFeedback={openEditFeedback}
                  onRequestDeleteFeedback={(selectedTask, feedback) =>
                    setFeedbackToDelete({
                      taskId: selectedTask.id,
                      taskTitle: selectedTask.title,
                      feedbackId: feedback.id,
                    })
                  }
                />
              );
            })}
          </div>
        </DragDropList>
      )}

      {statusModal && (
        <AppModal
          title="Update task status"
          onClose={() => setStatusModal(null)}
          maxWidth="max-w-md"
        >
          <p className="mb-4 text-sm font-semibold text-[var(--muted)]">
            Choose the current status for <strong>{statusModal.title}</strong>.
          </p>

          <div className="grid gap-3">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setStatusModal((current) => ({
                    ...current,
                    status: option.value,
                  }))
                }
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                  statusModal.status === option.value
                    ? "border-[var(--primary)] bg-[color:var(--primary)]/10 text-[var(--primary)]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {statusModal.status === option.value && (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStatusModal(null)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitStatusChange}
              className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              Save status
            </button>
          </div>
        </AppModal>
      )}

      {feedbackModal && (
        <AppModal
          title={feedbackModal.mode === "edit" ? "Edit task feedback" : "Add task feedback"}
          onClose={closeFeedbackModal}
          maxWidth="max-w-xl"
        >
          <p className="mb-3 text-sm font-semibold text-[var(--muted)]">
            Instructor feedback will be visible to project students.
          </p>

          <textarea
            value={feedbackModal.message}
            onChange={(event) => {
              const message = event.target.value;
              setFeedbackModal((current) => ({ ...current, message }));

              if (feedbackModal.mode === "add") {
                setTaskFeedbackDrafts((current) => ({
                  ...current,
                  [feedbackModal.taskId]: message,
                }));
              }
            }}
            placeholder="Write clear feedback for this task..."
            className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeFeedbackModal}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitFeedbackModal}
              className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!feedbackModal.message.trim()}
            >
              {feedbackModal.mode === "edit" ? "Save feedback" : "Add feedback"}
            </button>
          </div>
        </AppModal>
      )}

      <DeleteConfirmationModal
        open={Boolean(taskToDelete)}
        title="Delete task?"
        description={
          taskToDelete
            ? `This will permanently remove “${taskToDelete.title}” and its instructor feedback.`
            : "This action cannot be undone."
        }
        confirmText="Delete task"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          onDeleteTask(taskToDelete.id);
          setTaskToDelete(null);
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(feedbackToDelete)}
        title="Remove feedback?"
        description={
          feedbackToDelete
            ? `This will remove the instructor feedback attached to “${feedbackToDelete.taskTitle}”.`
            : "This action cannot be undone."
        }
        confirmText="Remove feedback"
        onCancel={() => setFeedbackToDelete(null)}
        onConfirm={() => {
          onDeleteTaskFeedback(feedbackToDelete.taskId, feedbackToDelete.feedbackId);
          setFeedbackToDelete(null);
        }}
      />
    </div>
  );
}
