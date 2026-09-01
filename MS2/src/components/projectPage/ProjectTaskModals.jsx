import AppModal from "@/components/common/AppModal";
import AppSelect from "@/components/common/AppSelect";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "post-poned", label: "Post-Poned" },
  { value: "completed", label: "Completed" },
];

function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">
      {children}
    </label>
  );
}

function FormInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/10"
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
  newTask,
  setNewTask,
  onAddTask,

  showEditPopup,
  setShowEditPopup,
  editingTask,
  setEditingTask,
  onSaveEditedTask,
}) {
  const team = project?.team || [];

  return (
    <>
      {showTaskPopup && (
        <AppModal
          title="Add task"
          onClose={() => setShowTaskPopup(false)}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div>
              <FieldLabel>Task title</FieldLabel>
              <FormInput
                type="text"
                value={newTask.title}
                onChange={(event) =>
                  setNewTask({ ...newTask, title: event.target.value })
                }
                placeholder="Example: Build login validation"
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <FormTextarea
                value={newTask.description}
                onChange={(event) =>
                  setNewTask({ ...newTask, description: event.target.value })
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
                    setNewTask({ ...newTask, deadline: event.target.value })
                  }
                />
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <AppSelect
                  value={newTask.status}
                  onChange={(value) =>
                    setNewTask({ ...newTask, status: value })
                  }
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
                />
              </div>
            </div>

            {!isBachelorProject && (
              <div>
                <FieldLabel>Collaborator</FieldLabel>
                <AppSelect
                  value={newTask.assigneeId}
                  onChange={(value) => {
                    const member = team.find(
                      (item) => String(item.id) === String(value)
                    );

                    setNewTask({
                      ...newTask,
                      assigneeId: value,
                      assignee: member?.name || "",
                    });
                  }}
                  options={team.map((member) => ({
                    value: member.id || member.name,
                    label: member.name,
                  }))}
                  placeholder="Choose collaborator"
                />
              </div>
            )}
          </div>

          <ModalFooter
            onCancel={() => setShowTaskPopup(false)}
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
                <AppSelect
                  value={editingTask.status}
                  onChange={(value) =>
                    setEditingTask({ ...editingTask, status: value })
                  }
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
                />
              </div>
            </div>

            {!isBachelorProject && (
              <div>
                <FieldLabel>Assignee</FieldLabel>
                <AppSelect
                  value={editingTask.assigneeId || ""}
                  onChange={(value) => {
                    const member = team.find(
                      (item) => String(item.id) === String(value)
                    );

                    setEditingTask({
                      ...editingTask,
                      assigneeId: value,
                      assignee: member?.name || editingTask.assignee,
                    });
                  }}
                  options={team.map((member) => ({
                    value: member.id || member.name,
                    label: member.name,
                  }))}
                  placeholder="Choose collaborator"
                />
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
