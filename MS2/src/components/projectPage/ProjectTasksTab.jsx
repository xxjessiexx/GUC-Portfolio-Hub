import DragDropList from "@/components/ui/DragDropList";
import SortableCard from "@/components/ui/SortableCard";
import { EmptyState } from "@/components/projectPage/ProjectPageShared";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "post-poned", label: "Post-Poned" },
  { value: "completed", label: "Completed" },
];

const statusStyles = {
  completed: "bg-green-100 text-green-700",
  "in-progress": "bg-blue-100 text-blue-700",
  pending: "bg-gray-200 text-gray-600",
  "post-poned": "bg-yellow-100 text-yellow-700",
};

export default function ProjectTasksTab({
  tasks,
  canManageTasks,
  canViewComments,
  canAddInstructorFeedback,
  loggedInUser,
  currentUser,
  isAdmin,
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
}) {
  const renderTask = (task) => {
    const canEditStatus =
      canManageTasks ||
      task.assigneeId === loggedInUser?.id ||
      task.assignee === currentUser;

    return (
      <div key={task.id} className="space-y-3">
        <SortableCard
          id={task.id}
          updated={task.assignee}
          left={
            <div>
              <h3 className="font-bold text-[16px] text-[#16253A]">
                {task.title}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {task.description}
              </p>

              <p className="mt-2 text-xs font-bold text-[var(--muted)]">
                Deadline: {task.deadline || "No deadline"}
              </p>
            </div>
          }
          middle={
            <div className="flex justify-center">
              <div className="relative">
                <select
                  value={task.status}
                  disabled={!canEditStatus}
                  onChange={(event) =>
                    onUpdateTaskStatus(task.id, event.target.value)
                  }
                  className={`appearance-none rounded-xl border px-4 py-2 text-xs font-bold ${
                    canEditStatus
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  } ${statusStyles[task.status] || statusStyles.pending}`}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          right={
            <div className="flex items-center gap-2">
              {canManageTasks && (
                <>
                  <button
                    onClick={() => onOpenEditTask(task)}
                    className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          }
        />

        {canViewComments && (
          <div className="ml-4 space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-blue-600">
              Instructor Comments
            </p>

            {task.instructorComment && (
              <p className="text-sm text-gray-700">
                {task.instructorComment}
              </p>
            )}

            {(task.feedback || []).map((item) => (
              <div key={item.id} className="rounded-xl bg-white/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black text-[var(--primary)]">
                    {item.authorName || "Instructor"}
                  </p>

                  {(item.authorId === loggedInUser?.id || isAdmin) && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEditTaskFeedback(task.id, item.id)}
                        className="text-xs font-black text-[var(--primary)]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTaskFeedback(task.id, item.id)}
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

            {!task.instructorComment &&
              (!task.feedback || task.feedback.length === 0) && (
                <p className="text-sm text-gray-700">
                  No instructor comments yet.
                </p>
              )}

            {canAddInstructorFeedback && (
              <div className="flex gap-2">
                <input
                  value={taskFeedbackDrafts[task.id] || ""}
                  onChange={(event) =>
                    setTaskFeedbackDrafts((current) => ({
                      ...current,
                      [task.id]: event.target.value,
                    }))
                  }
                  placeholder="Add task feedback..."
                  className="min-h-10 flex-1 rounded-xl border bg-white px-3 text-sm font-semibold outline-none"
                />

                <button
                  type="button"
                  onClick={() => onAddTaskFeedback(task.id)}
                  className="rounded-xl bg-[var(--primary)] px-4 text-xs font-black text-white"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {canManageTasks && (
        <div className="flex justify-end">
          <button
            onClick={onAddTaskClick}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            + Add Task
          </button>
        </div>
      )}

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
            {tasks.map(renderTask)}
          </div>
        </DragDropList>
      )}
    </div>
  );
}