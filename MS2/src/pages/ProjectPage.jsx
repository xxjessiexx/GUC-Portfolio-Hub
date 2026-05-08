import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";

import DragDropList from "@/components/ui/DragDropList";
import SortableCard from "@/components/ui/SortableCard";

import {
  Eye,
  EyeOff,
  Star,
  Users,
} from "lucide-react";

export default function ProjectPage() {

  /* ================= PROJECT DATA ================= */
  const project = {
    title: "Smart Study Buddy",
    type: "Course Project",
    course: "CSEN 501 - Software Engineering",
    visibility: "Public",
    updatedAt: "March 1, 2026",
    collaborators: 2,
    rating: 4.5,
    video: "/demo.mp4",

    description:
      "An AI-powered platform that helps students organize study plans, track progress, and collaborate efficiently.",

    technologies: ["React", "Node.js", "MongoDB"],

    team:
      "Course Project" === "Bachelor Project"
        ? []
        : [
            {
              name: "Ahmed Hassan",
              role: "Owner",
              img: "https://i.pravatar.cc/40?img=1",
            },
            {
              name: "Sara Mohamed",
              role: "Member",
              img: "https://i.pravatar.cc/40?img=2",
            },
          ],

    instructor: {
      name: "Dr. Mervat Abuelkheir",
      role: "Course Instructor",
      img: "https://i.pravatar.cc/40?img=3",
    },
  };

  /* ================= CURRENT USER ================= */

  // CHANGE THIS TO TEST DIFFERENT USERS
  // "Ahmed Hassan" -> creator
  // "Sara Mohamed" -> collaborator
  // "Dr. Mervat Abuelkheir" -> instructor
  // "Omar Ali" -> outsider

  const currentUser = "Ahmed Hassan";

  /* ================= PROJECT CREATOR ================= */
  const projectCreator = "Ahmed Hassan";

  /* ================= ROLE CHECKS ================= */
  const isCreator =
    currentUser === projectCreator;

  const isInstructor =
    currentUser === project.instructor.name;

  const isCollaborator =
    project.team.some(
      (member) =>
        member.name === currentUser
    );

  /* ================= COMMENT VISIBILITY ================= */
  const canViewComments =
    isCreator ||
    isCollaborator ||
    isInstructor;

  /* ================= BACHELOR PROJECT ================= */
  const isBachelorProject =
    project.type === "Bachelor Project";

  /* ================= STATES ================= */
  const [activeTab, setActiveTab] =
    useState("overview");

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Implement user authentication",
      description:
        "Add JWT-based authentication with login and registration",
      assignee: "Ahmed Hassan",
      status: "completed",

      instructorComment:
        "Excellent security implementation and clean JWT structure.",
    },

    {
      id: "2",
      title: "Design database schema",
      description:
        "Create MongoDB schema for products, orders, and users",
      assignee: "Sara Mohamed",
      status: "completed",

      instructorComment:
        "Good normalization and schema relationships.",
    },

    {
      id: "3",
      title: "Build admin dashboard",
      description:
        "Create admin panel for managing products and orders",
      assignee: "Ahmed Hassan",
      status: "in-progress",

      instructorComment:
        "Need better responsive design for smaller screens.",
    },
  ]);

  const [showTaskPopup, setShowTaskPopup] =
    useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    status: "pending",
    time: "",
  });

  /* ===== EDIT TASK ===== */
  const [showEditPopup, setShowEditPopup] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  /* ================= FUNCTIONS ================= */

  const updateTaskStatus = (
    id,
    newStatus
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const addTask = () => {
    if (!newTask.title) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newTask,
        instructorComment: "",
      },
    ]);

    setNewTask({
      title: "",
      description: "",
      assignee: "",
      deadline: "",
      status: "pending",
      time: "",
    });

    setShowTaskPopup(false);
  };

  /* ===== OPEN EDIT ===== */
  const openEditPopup = (task) => {
    setEditingTask(task);
    setShowEditPopup(true);
  };

  /* ===== SAVE EDIT ===== */
  const saveEditedTask = () => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? editingTask
          : task
      )
    );

    setShowEditPopup(false);
  };

  const isPublic =
    project.visibility === "Public";

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ===== MAIN CARD ===== */}
        <AppCard className="space-y-6 p-6">

          {/* ===== TITLE ===== */}
          <div>
            <h2 className="text-2xl font-black text-[var(--ink)]">
              {project.title}
            </h2>

            <p className="text-sm font-semibold text-[var(--muted)]">
              {project.course} • {project.type}
            </p>
          </div>

          {/* ===== INFO ===== */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--muted)]">

            <span>
              Updated {project.updatedAt}
            </span>

            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.collaborators} collaborators
            </span>

            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {project.rating} / 5
            </span>

            {/* VISIBILITY */}
            <span
              className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
                isPublic
                  ? "bg-[rgba(156,213,255,0.35)] text-[var(--primary)]"
                  : "bg-[rgba(230,199,123,0.25)] text-[var(--primary)]"
              }`}
            >
              {isPublic ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}

              {project.visibility}
            </span>
          </div>

          {/* ===== VIDEO ===== */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <video
                controls
                className="h-[500px] w-full rounded-2xl border border-[color:var(--primary)]/10 object-cover shadow-md"
              >
                <source
                  src={project.video}
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-6 border-b border-[color:var(--primary)]/10 pb-2">

            {["overview", "tasks", "feedback"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className={`pb-2 text-sm font-black capitalize ${
                    activeTab === tab
                      ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                      : "text-[color:var(--muted)]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* DESCRIPTION */}
              <div>
                <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                  About This Project
                </h3>

                <p className="text-sm text-[var(--muted)]">
                  {project.description}
                </p>
              </div>

              {/* TECHNOLOGIES */}
              <div>
                <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                  Technologies
                </h3>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[var(--primary)]"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* TEAM */}
              {!isBachelorProject && (
                <div>
                  <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                    Team Members
                  </h3>

                  <div className="space-y-3">
                    {project.team.map(
                      (member) => (
                        <div
                          key={member.name}
                          className="flex items-center gap-3 rounded-xl border bg-white/60 p-3"
                        >
                          <img
                            src={member.img}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />

                          <div>
                            <p className="text-sm font-bold">
                              {member.name}
                            </p>

                            <p className="text-xs text-[var(--muted)]">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* INSTRUCTOR */}
              <div>
                <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                  Instructor
                </h3>

                <div className="flex items-center gap-3 rounded-xl border bg-green-50 p-3">
                  <img
                    src={project.instructor.img}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />

                  <div>
                    <p className="text-sm font-bold">
                      {project.instructor.name}
                    </p>

                    <p className="text-xs text-[var(--muted)]">
                      {project.instructor.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TASKS ===== */}
          {activeTab === "tasks" && (
            <DragDropList
              items={tasks}
              setItems={
                isCreator
                  ? setTasks
                  : () => {}
              }
            >
              <div className="space-y-4">

                {/* ADD TASK BUTTON */}
                {isCreator && (
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setShowTaskPopup(true)
                      }
                      className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                    >
                      + Add Task
                    </button>
                  </div>
                )}

                {tasks.map((task) => {

                  const canEditStatus =
                    isCreator ||
                    task.assignee ===
                      currentUser;

                  const statusStyles = {
                    completed:
                      "bg-green-100 text-green-700",
                    "in-progress":
                      "bg-blue-100 text-blue-700",
                    pending:
                      "bg-gray-200 text-gray-600",
                    "post-poned":
                      "bg-yellow-100 text-yellow-700",
                  };

                  return (
                    <div
                      key={task.id}
                      className="space-y-3"
                    >

                      <SortableCard
                        id={task.id}
                        updated={task.assignee}

                        left={
                          <div>
                            <h3 className="font-bold text-[16px] text-[#16253A]">
                              {task.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>
                          </div>
                        }

                        middle={
                          <div className="flex justify-center">
                            <div className="relative">

                              <select
                                value={task.status}
                                disabled={
                                  !canEditStatus
                                }
                                onChange={(e) =>
                                  updateTaskStatus(
                                    task.id,
                                    e.target.value
                                  )
                                }
                                className={`appearance-none rounded-xl px-4 py-2 text-xs font-bold border ${
                                  canEditStatus
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed opacity-60"
                                } ${
                                  statusStyles[
                                    task.status
                                  ]
                                }`}
                              >
                                <option value="pending">
                                  Pending
                                </option>

                                <option value="post-poned">
                                  Post-Poned
                                </option>

                                <option value="completed">
                                  Completed
                                </option>
                              </select>

                            </div>
                          </div>
                        }

                        right={
                          <div className="flex items-center gap-2">

                            {isCreator && (
                              <button
                                onClick={() =>
                                  openEditPopup(task)
                                }
                                className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
                              >
                                Edit
                              </button>
                            )}

                          </div>
                        }
                      />

                      {/* ===== TASK COMMENT ===== */}
                      {canViewComments && (
                        <div className="ml-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                          <p className="text-xs font-black uppercase tracking-wide text-blue-600">
                            Instructor Comment
                          </p>

                          <p className="mt-2 text-sm text-gray-700">
                            {task.instructorComment}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}

              </div>
            </DragDropList>
          )}

          {/* ===== ADD TASK POPUP ===== */}
          {showTaskPopup && isCreator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

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
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        title:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-bold">
                    Description
                  </label>

                  <textarea
                    value={
                      newTask.description
                    }
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        description:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                {!isBachelorProject && (
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">
                      Collaborator
                    </label>

                    <select
                      value={
                        newTask.assignee
                      }
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assignee:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border p-3"
                    >
                      <option value="">
                        Choose collaborator
                      </option>

                      {project.team.map(
                        (member) => (
                          <option
                            key={member.name}
                            value={
                              member.name
                            }
                          >
                            {member.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      setShowTaskPopup(false)
                    }
                    className="w-1/2 rounded-xl border px-4 py-2 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addTask}
                    className="w-1/2 rounded-xl bg-[var(--primary)] px-4 py-2 font-bold text-white"
                  >
                    Confirm
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* ===== EDIT TASK POPUP ===== */}
          {showEditPopup && editingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

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
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        title:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-bold">
                    Description
                  </label>

                  <textarea
                    value={
                      editingTask.description
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-bold">
                    Assignee
                  </label>

                  <select
                    value={
                      editingTask.assignee
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        assignee:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    {project.team.map(
                      (member) => (
                        <option
                          key={member.name}
                          value={
                            member.name
                          }
                        >
                          {member.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="mb-1 block text-sm font-bold">
                    Status
                  </label>

                  <select
                    value={
                      editingTask.status
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        status:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="post-poned">
                      Post-Poned
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      setShowEditPopup(false)
                    }
                    className="w-1/2 rounded-xl border px-4 py-2 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveEditedTask}
                    className="w-1/2 rounded-xl bg-[var(--primary)] px-4 py-2 font-bold text-white"
                  >
                    Save Changes
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* ===== FEEDBACK ===== */}
          {activeTab === "feedback" && (

            <div className="space-y-6">

              <h3 className="text-xl font-black text-[var(--primary)]">
                Instructor Feedback
              </h3>

              <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-black text-white">
                      D
                    </div>

                    <div>
                      <p className="text-sm font-black text-[var(--ink)]">
                        Dr. Mervat Abuelkheir
                      </p>

                      <p className="text-xs text-[var(--muted)]">
                        05/03/2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                    ⭐ 9 / 10
                  </div>
                </div>

                <p className="mt-4 leading-relaxed text-sm text-[var(--muted)]">
                  Excellent implementation of
                  microservices architecture.
                  The UI is intuitive and
                  responsive. Great work on
                  the payment integration!
                </p>
              </div>

            </div>
          )}

        </AppCard>
      </div>
    </DashboardLayout>
  );
}