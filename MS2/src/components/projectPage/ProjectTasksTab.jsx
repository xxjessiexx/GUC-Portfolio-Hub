import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import AppModal from "@/components/common/AppModal";
import DragDropList from "@/components/ui/DragDropList";
import SortableCard from "@/components/ui/SortableCard";
import { EmptyState } from "@/components/projectPage/ProjectPageShared";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "post-poned", label: "Postponed" },
  { value: "completed", label: "Completed" },
];

const STATUS_META = {
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    select: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  "in-progress": {
    label: "In Progress",
    dot: "bg-[#5B9FD0]",
    select: "border-[#C8DDEA] bg-[#EEF6FB] text-[#356F96]",
  },
  pending: {
    label: "Pending",
    dot: "bg-[#E6C77B]",
    select: "border-[#EADCB0] bg-[#FFF9E8] text-[#8A6B21]",
  },
  "post-poned": {
    label: "Postponed",
    dot: "bg-[#B8A36E]",
    select: "border-[#DED7C4] bg-[#F8F5ED] text-[#786D50]",
  },
};

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

function sameName(a, b) {
  return (
    String(a || "").trim().toLowerCase() ===
    String(b || "").trim().toLowerCase()
  );
}

function getStatusMeta(status) {
  return STATUS_META[status] || STATUS_META.pending;
}

function FeedbackArea({
  task,
  loggedInUser,
  canAddInstructorFeedback,
  taskFeedbackDrafts,
  setTaskFeedbackDrafts,
  onAddTaskFeedback,
  onStartEdit,
  onRequestDelete,
}) {
  const feedback = task.feedback || [];
  const hasFeedback = Boolean(task.instructorComment) || feedback.length > 0;

  return (
    <div className="mt-5 border-t border-[#D9E4EA] pt-4">
      <div className="flex items-start gap-2.5">
        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6F96AE]" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#5F8094]">
              Instructor feedback
            </p>

            {!hasFeedback ? (
              <span className="text-[12px] font-semibold text-[#8A9AA4]">
                No feedback yet.
              </span>
            ) : null}
          </div>

          {task.instructorComment ? (
            <p className="mt-2 max-w-3xl text-[13px] font-medium leading-6 text-[#5F7481]">
              {task.instructorComment}
            </p>
          ) : null}

          {feedback.length > 0 ? (
            <div className="mt-2.5 space-y-2">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[14px] border border-[#D8E3E9] bg-[#F7FAFC] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-[#355872]">
                        {item.authorName || "Instructor"}
                      </p>
                      <p className="mt-1 text-[12px] font-medium leading-5 text-[#607482]">
                        {item.message}
                      </p>
                    </div>

                    {item.authorId === loggedInUser?.id ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onStartEdit(item)}
                          className="text-[9px] font-black text-[#5F87A1] transition hover:text-[#355872]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestDelete(item)}
                          className="text-[9px] font-black text-[#A56D74] transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {canAddInstructorFeedback ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={taskFeedbackDrafts[task.id] || ""}
                onChange={(event) =>
                  setTaskFeedbackDrafts((current) => ({
                    ...current,
                    [task.id]: event.target.value,
                  }))
                }
                placeholder="Add feedback to this task..."
                className="h-10 min-w-0 flex-1 rounded-[12px] border border-[#C3D6E1] bg-white px-3.5 text-[12px] font-semibold text-[color:var(--ink)] outline-none transition placeholder:text-[#9AA9B2] focus:border-[#7AAACE] focus:shadow-[0_0_0_3px_rgba(122,170,206,0.10)]"
              />

              <button
                type="button"
                onClick={() => onAddTaskFeedback(task.id)}
                className="h-10 rounded-[12px] bg-[#355872] px-4 text-[11px] font-black text-white transition hover:bg-[#294A61]"
              >
                Add feedback
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ProjectTasksTab({
  tasks,
  canManageTasks,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  currentUser,
  taskFeedbackDrafts,
  setTaskFeedbackDrafts,
  onAddTaskClick,
  onStoreTasks,
  onUpdateTaskStatus,
  onOpenEditTask,
  onDeleteTask,
  onAddTaskFeedback,
  onEditTaskFeedback,
  onDeleteTaskFeedback,
  showAddTaskButton = true,
}) {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [feedbackToEdit, setFeedbackToEdit] = useState(null);
  const [feedbackEditValue, setFeedbackEditValue] = useState("");
  const [feedbackEditError, setFeedbackEditError] = useState("");
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [openStatusTaskId, setOpenStatusTaskId] = useState(null);

  const selectedTaskToDelete = tasks.find((task) => sameId(task.id, taskToDelete));

  const selectedFeedbackToDelete = feedbackToDelete
    ? tasks
        .find((task) => sameId(task.id, feedbackToDelete.taskId))
        ?.feedback?.find((item) => sameId(item.id, feedbackToDelete.feedbackId))
    : null;

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => String(task.status || "pending") === "completed"
    ).length;
    const inProgress = tasks.filter(
      (task) => String(task.status || "pending") === "in-progress"
    ).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, percent };
  }, [tasks]);

  const canEditTaskStatus = (task) => {
    if (canManageTasks) return true;

    return (
      sameId(task.assigneeId, loggedInUser?.id) ||
      sameId(task.assignedToId, loggedInUser?.id) ||
      sameId(task.userId, loggedInUser?.id) ||
      sameName(task.assignee, currentUser)
    );
  };

  const renderTask = (task, index) => {
    const canEditStatus = canEditTaskStatus(task);
    const status = String(task.status || "pending");
    const meta = getStatusMeta(status);
    const menuOpen = sameId(openTaskMenuId, task.id);

    return (
      <SortableCard
        key={task.id}
        id={task.id}
        variant="task"
        dragDisabled={!canManageTasks}
      >
        <div className="py-6">
          <div className="flex items-start gap-4">
            <div className="hidden w-8 shrink-0 pt-1 sm:block">
              <span className="text-[11px] font-black tracking-[0.12em] text-[#8E9DA7]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    <h3 className="min-w-0 text-[18px] font-black leading-tight tracking-[-0.02em] text-[#162A39] sm:text-[19px]">
                      {task.title}
                    </h3>
                  </div>

                  <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-[#6B7D89]">
                    {task.description || "No description added."}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 self-start">
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!canEditStatus}
                      onClick={() => {
                        if (!canEditStatus) return;
                        setOpenTaskMenuId(null);
                        setOpenStatusTaskId((current) =>
                          sameId(current, task.id) ? null : task.id
                        );
                      }}
                      title={
                        canEditStatus
                          ? "Update task status"
                          : "Only the owner or assigned collaborator can update this task status"
                      }
                      aria-haspopup="menu"
                      aria-expanded={sameId(openStatusTaskId, task.id)}
                      className={`inline-flex h-9 min-w-[118px] items-center justify-between gap-2 rounded-full border px-3.5 text-[11px] font-black transition ${
                        canEditStatus
                          ? "cursor-pointer hover:-translate-y-[1px] hover:shadow-[0_6px_14px_rgba(53,88,114,0.08)]"
                          : "cursor-not-allowed opacity-60"
                      } ${meta.select}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>

                      <ChevronDown
                        className={`h-3.5 w-3.5 opacity-60 transition-transform ${
                          sameId(openStatusTaskId, task.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {sameId(openStatusTaskId, task.id) ? (
                      <div
                        role="menu"
                        className="absolute right-0 top-11 z-40 w-[164px] overflow-hidden rounded-[16px] border border-[#D6E2E8] bg-white p-1.5 shadow-[0_16px_36px_rgba(53,88,114,0.16)]"
                      >
                        {STATUS_OPTIONS.map((option) => {
                          const optionMeta = getStatusMeta(option.value);
                          const selected = option.value === status;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              role="menuitemradio"
                              aria-checked={selected}
                              onClick={() => {
                                onUpdateTaskStatus(task.id, option.value);
                                setOpenStatusTaskId(null);
                              }}
                              className={`flex w-full items-center justify-between gap-3 rounded-[11px] px-3 py-2.5 text-left text-[12px] font-bold transition ${
                                selected
                                  ? "bg-[#EEF5F8] text-[#294A61]"
                                  : "text-[#557084] hover:bg-[#F3F7F9] hover:text-[#294A61]"
                              }`}
                            >
                              <span className="inline-flex items-center gap-2.5">
                                <span className={`h-2 w-2 rounded-full ${optionMeta.dot}`} />
                                {option.label}
                              </span>

                              {selected ? (
                                <Check className="h-3.5 w-3.5 text-[#355872]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  {canManageTasks ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenEditTask(task)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[11px] font-black text-[#5C7F96] transition hover:bg-[#EDF5F9] hover:text-[#355872]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenStatusTaskId(null);
                            setOpenTaskMenuId((current) =>
                              sameId(current, task.id) ? null : task.id
                            );
                          }}
                          className="grid h-9 w-9 place-items-center rounded-[10px] text-[#718895] transition hover:bg-[#EDF5F9] hover:text-[#355872]"
                          aria-label="More task actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {menuOpen ? (
                          <div className="absolute right-0 top-11 z-30 w-40 rounded-[14px] border border-[#D6E2E9] bg-white p-1.5 shadow-[0_18px_45px_rgba(53,88,114,0.16)]">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenTaskMenuId(null);
                                setTaskToDelete(task.id);
                              }}
                              className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[10px] font-black text-[#A85E66] transition hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete task
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-[#71838E]">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5 text-[#6F96AE]" />
                  {task.assignee || "Unassigned"}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#6F96AE]" />
                  {task.deadline || "No deadline"}
                </span>
              </div>

              {canViewComments ? (
                <FeedbackArea
                  task={task}
                  loggedInUser={loggedInUser}
                  canAddInstructorFeedback={canAddInstructorFeedback}
                  taskFeedbackDrafts={taskFeedbackDrafts}
                  setTaskFeedbackDrafts={setTaskFeedbackDrafts}
                  onAddTaskFeedback={onAddTaskFeedback}
                  onStartEdit={(item) => {
                    setFeedbackToEdit({
                      taskId: task.id,
                      feedbackId: item.id,
                    });
                    setFeedbackEditValue(item.message || "");
                    setFeedbackEditError("");
                  }}
                  onRequestDelete={(item) =>
                    setFeedbackToDelete({
                      taskId: task.id,
                      feedbackId: item.id,
                    })
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </SortableCard>
    );
  };

  const taskList = (
    <div className="overflow-hidden rounded-[24px] border border-[#CBDCE5] bg-white shadow-[0_16px_36px_rgba(53,88,114,0.10)]">
      {tasks.map(renderTask)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* TASK PROGRESS */}
      <div className="rounded-[22px] border border-[#CCDDE6] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(53,88,114,0.09)] sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-7 rounded-full bg-[#E6C77B]" />
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5F849B]">
                Task progress
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-[28px] font-black tracking-[-0.04em] text-[#162A39] sm:text-[30px]">
                {stats.completed} of {stats.total} complete
              </h3>
              <span className="text-[12px] font-bold text-[#7B8C97]">
                {stats.percent}%
              </span>
            </div>
          </div>

          {canManageTasks && showAddTaskButton ? (
            <button
              type="button"
              onClick={onAddTaskClick}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-[18px] border border-[#355872]/14 bg-white px-5 text-[13px] font-black text-[#294F69] shadow-[0_8px_20px_rgba(53,88,114,0.10)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#7AAACE]/45 hover:bg-[#F7FBFD] hover:shadow-[0_12px_28px_rgba(53,88,114,0.14)]"
            >
              <Plus className="h-[17px] w-[17px]" />
              Add task
            </button>
          ) : null}
        </div>

        <div className="mt-5 h-[7px] w-full overflow-hidden rounded-full bg-[#E4EDF2]">
          <div
            className="h-full rounded-full bg-[#4F7EA4] transition-all duration-300"
            style={{ width: `${stats.percent}%` }}
          />
        </div>

        <p className="mt-2.5 text-[11px] font-semibold text-[#748691]">
          {stats.inProgress} in progress · {Math.max(stats.total - stats.completed, 0)} remaining
        </p>
      </div>

      <div className="rounded-[26px] border border-[#D0DEE6] bg-[#EAF2F6] p-4 shadow-[0_14px_32px_rgba(53,88,114,0.08)] sm:p-5">
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description={
            canManageTasks
              ? "Create the first task for this project."
              : "The creator has not added tasks yet."
          }
        />
      ) : canManageTasks ? (
        <DragDropList items={tasks} setItems={onStoreTasks}>
          {taskList}
        </DragDropList>
      ) : (
        taskList
      )}
      </div>

      {feedbackToEdit ? (
        <AppModal
          open
          title="Edit task feedback"
          description="Update your instructor comment for this task."
          onClose={() => {
            setFeedbackToEdit(null);
            setFeedbackEditValue("");
            setFeedbackEditError("");
          }}
          maxWidth="max-w-xl"
        >
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
              Feedback
              <span className="ml-1 text-[color:var(--gold)]">*</span>
            </label>

            <textarea
              value={feedbackEditValue}
              onChange={(event) => {
                setFeedbackEditValue(event.target.value);
                if (event.target.value.trim()) setFeedbackEditError("");
              }}
              rows={4}
              placeholder="Edit your task feedback..."
              className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] outline-none transition focus:ring-4 ${
                feedbackEditError
                  ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-[var(--primary)] focus:ring-[color:var(--primary)]/10"
              }`}
            />

            {feedbackEditError ? (
              <p className="text-xs font-semibold text-red-500">
                {feedbackEditError}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setFeedbackToEdit(null);
                setFeedbackEditValue("");
                setFeedbackEditError("");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMessage = feedbackEditValue.trim();
                if (!nextMessage) {
                  setFeedbackEditError("Feedback cannot be empty.");
                  return;
                }

                onEditTaskFeedback(
                  feedbackToEdit.taskId,
                  feedbackToEdit.feedbackId,
                  nextMessage
                );

                setFeedbackToEdit(null);
                setFeedbackEditValue("");
                setFeedbackEditError("");
              }}
              className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--dark)]"
            >
              Save changes
            </button>
          </div>
        </AppModal>
      ) : null}

      <DeleteConfirmationModal
        open={Boolean(feedbackToDelete)}
        title="Delete feedback?"
        description={
          selectedFeedbackToDelete
            ? `This will permanently remove “${selectedFeedbackToDelete.message}”.`
            : "This instructor feedback will be permanently removed."
        }
        confirmText="Delete feedback"
        onCancel={() => setFeedbackToDelete(null)}
        onConfirm={() => {
          if (feedbackToDelete) {
            onDeleteTaskFeedback(
              feedbackToDelete.taskId,
              feedbackToDelete.feedbackId
            );
          }
          setFeedbackToDelete(null);
        }}
      />

      <DeleteConfirmationModal
        open={Boolean(taskToDelete)}
        title="Delete task?"
        description={
          selectedTaskToDelete
            ? `This will permanently remove “${selectedTaskToDelete.title}” and its instructor feedback.`
            : "This task and its instructor feedback will be permanently removed."
        }
        confirmText="Delete task"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          onDeleteTask(taskToDelete);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}
