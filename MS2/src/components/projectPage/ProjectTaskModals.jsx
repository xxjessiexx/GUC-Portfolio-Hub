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
  return (
    <>
      {showTaskPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-black text-[var(--ink)]">
              Add New Task
            </h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Task Title
              </label>

              <input
                type="text"
                value={newTask.title}
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    title: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Description
              </label>

              <textarea
                value={newTask.description}
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    description: event.target.value,
                  })
                }
                className="min-h-24 w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Deadline
              </label>

              <input
                type="date"
                value={newTask.deadline}
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    deadline: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            {!isBachelorProject && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold">
                  Collaborator
                </label>

                <select
                  value={newTask.assigneeId}
                  onChange={(event) => {
                    const member = project.team.find(
                      (item) => String(item.id) === String(event.target.value)
                    );

                    setNewTask({
                      ...newTask,
                      assigneeId: event.target.value,
                      assignee: member?.name || "",
                    });
                  }}
                  className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
                >
                  <option value="">Choose collaborator</option>

                  {project.team.map((member) => (
                    <option
                      key={member.id || member.name}
                      value={member.id || member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="mb-1 block text-sm font-bold">
                Status
              </label>

              <select
                value={newTask.status}
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    status: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              >
                <option value="pending">Pending</option>
                <option value="post-poned">Post-Poned</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTaskPopup(false)}
                className="w-1/2 rounded-xl border px-4 py-2 font-bold transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onAddTask}
                className="w-1/2 rounded-xl bg-[var(--primary)] px-4 py-2 font-bold text-white transition hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-black text-[var(--ink)]">
              Edit Task
            </h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Task Title
              </label>

              <input
                type="text"
                value={editingTask.title}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    title: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Description
              </label>

              <textarea
                value={editingTask.description}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    description: event.target.value,
                  })
                }
                className="min-h-24 w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold">
                Deadline
              </label>

              <input
                type="date"
                value={editingTask.deadline || ""}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    deadline: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              />
            </div>

            {!isBachelorProject && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-bold">
                  Assignee
                </label>

                <select
                  value={editingTask.assigneeId || ""}
                  onChange={(event) => {
                    const member = project.team.find(
                      (item) => String(item.id) === String(event.target.value)
                    );

                    setEditingTask({
                      ...editingTask,
                      assigneeId: event.target.value,
                      assignee: member?.name || editingTask.assignee,
                    });
                  }}
                  className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
                >
                  <option value="">Choose collaborator</option>

                  {project.team.map((member) => (
                    <option
                      key={member.id || member.name}
                      value={member.id || member.name}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="mb-1 block text-sm font-bold">
                Status
              </label>

              <select
                value={editingTask.status}
                onChange={(event) =>
                  setEditingTask({
                    ...editingTask,
                    status: event.target.value,
                  })
                }
                className="w-full rounded-xl border p-3 text-sm font-semibold outline-none focus:border-[var(--primary)]"
              >
                <option value="pending">Pending</option>
                <option value="post-poned">Post-Poned</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditPopup(false);
                  setEditingTask(null);
                }}
                className="w-1/2 rounded-xl border px-4 py-2 font-bold transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSaveEditedTask}
                className="w-1/2 rounded-xl bg-[var(--primary)] px-4 py-2 font-bold text-white transition hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}