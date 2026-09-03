import AppModal from "@/components/common/AppModal";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "post-poned", label: "Post-Poned" },
  { value: "completed", label: "Completed" },
];

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
      <span>{children}</span>
      {required ? (
        <span
          className="text-[color:var(--gold)]"
          aria-hidden="true"
        >
          *
        </span>
      ) : null}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-semibold leading-5 text-red-500">
      {message}
    </p>
  );
}

function FormInput({ hasError = false, className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-[var(--ink)] outline-none transition focus:ring-4 ${
        hasError
          ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
          : "border-slate-200 focus:border-[var(--primary)] focus:ring-[color:var(--primary)]/10"
      } ${className}`}
    />
  );
}

function FormTextarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10"
    />
  );
}

function FormSelect(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10"
    />
  );
}

function ModalFooter({ onCancel, onConfirm, confirmText }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90"
      >
        {confirmText}
      </button>
    </div>
  );
}

export default function ProjectTaskModals({
  project,
  isBachelorProject,

  showTaskPopup,
  setShowTaskPopup,
  onCloseTaskPopup,
  newTask,
  setNewTask,
  updateNewTask,
  taskErrors,
  onAddTask,

  showEditPopup,
  setShowEditPopup,
  editingTask,
  setEditingTask,
  onSaveEditedTask,
}) {
  const team = project?.team || [];

  const updateTaskDraft = (updates) => {
    if (typeof updateNewTask === "function") {
      updateNewTask(updates);
      return;
    }

    setNewTask((current) => ({
      ...current,
      ...updates,
    }));
  };

  return (
    <>
      {showTaskPopup && (
        <AppModal
          title="Add task"
          onClose={() => {
            if (typeof onCloseTaskPopup === "function") {
              onCloseTaskPopup();
            } else {
              setShowTaskPopup(false);
            }
          }}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel required>Task title</FieldLabel>
              <FormInput
                type="text"
                value={newTask.title}
                hasError={Boolean(taskErrors?.title)}
                aria-invalid={Boolean(taskErrors?.title)}
                aria-describedby={
                  taskErrors?.title ? "new-task-title-error" : undefined
                }
                onChange={(event) =>
                  updateTaskDraft({
                    title: event.target.value,
                  })
                }
                placeholder="Example: Build login validation"
              />
              <div id="new-task-title-error">
                <FieldError message={taskErrors?.title} />
              </div>
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <FormTextarea
                value={newTask.description}
                onChange={(event) =>
                  updateTaskDraft({ description: event.target.value })
                }
                placeholder="Add a clear task description for the assignee."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Deadline</FieldLabel>
                <FormInput
                  type="date"
                  value={newTask.deadline}
                  onChange={(event) =>
                    updateTaskDraft({ deadline: event.target.value })
                  }
                />
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <FormSelect
                  value={newTask.status}
                  onChange={(event) =>
                    updateTaskDraft({ status: event.target.value })
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>

            {!isBachelorProject && (
              <div>
                <FieldLabel>Collaborator</FieldLabel>
                <FormSelect
                  value={newTask.assigneeId}
                  onChange={(event) => {
                    const member = team.find(
                      (item) => String(item.id) === String(event.target.value)
                    );

                    updateTaskDraft({
                      assigneeId: event.target.value,
                      assignee: member?.name || "",
                    });
                  }}
                >
                  <option value="">Choose collaborator</option>

                  {team.map((member) => (
                    <option
                      key={member.id || member.name}
                      value={member.id || member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </FormSelect>
              </div>
            )}
          </div>

          <ModalFooter
            onCancel={() => {
              if (typeof onCloseTaskPopup === "function") {
                onCloseTaskPopup();
              } else {
                setShowTaskPopup(false);
              }
            }}
            onConfirm={onAddTask}
            confirmText="Create task"
          />
        </AppModal>
      )}

      {showEditPopup && editingTask && (
        <AppModal
          title="Edit task"
          onClose={() => {
            setShowEditPopup(false);
            setEditingTask(null);
          }}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>Task title</FieldLabel>
              <FormInput
                type="text"
                value={editingTask.title}
                onChange={(event) =>
                  setEditingTask({ ...editingTask, title: event.target.value })
                }
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <FormTextarea
                value={editingTask.description || ""}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    description: event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Deadline</FieldLabel>
                <FormInput
                  type="date"
                  value={editingTask.deadline || ""}
                  onChange={(event) =>
                    setEditingTask({
                      ...editingTask,
                      deadline: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <FormSelect
                  value={editingTask.status}
                  onChange={(event) =>
                    setEditingTask({ ...editingTask, status: event.target.value })
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
            </div>

            {!isBachelorProject && (
              <div>
                <FieldLabel>Assignee</FieldLabel>
                <FormSelect
                  value={editingTask.assigneeId || ""}
                  onChange={(event) => {
                    const member = team.find(
                      (item) => String(item.id) === String(event.target.value)
                    );

                    setEditingTask({
                      ...editingTask,
                      assigneeId: event.target.value,
                      assignee: member?.name || editingTask.assignee,
                    });
                  }}
                >
                  <option value="">Choose collaborator</option>

                  {team.map((member) => (
                    <option
                      key={member.id || member.name}
                      value={member.id || member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </FormSelect>
              </div>
            )}
          </div>

          <ModalFooter
            onCancel={() => {
              setShowEditPopup(false);
              setEditingTask(null);
            }}
            onConfirm={onSaveEditedTask}
            confirmText="Save changes"
          />
        </AppModal>
      )}
    </>
  );
}
