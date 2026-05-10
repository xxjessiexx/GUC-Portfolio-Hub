import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

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

import {
  getCurrentUser,
  getProjectById,
  updateProject,
} from "@/data/demoStore";

function normalizeVisibility(value) {
  return String(value || "private").toLowerCase() === "public"
    ? "Public"
    : "Private";
}

function normalizeProjectType(value, course = "") {
  const text = `${value || ""} ${course || ""}`.toLowerCase();

  if (text.includes("bachelor") || text.includes("thesis")) {
    return "Bachelor Project";
  }

  return "Course Project";
}

function formatProjectDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getImageForUser(user, fallbackIndex = 1) {
  return (
    user?.avatar ||
    user?.image ||
    user?.profileImage ||
    `https://i.pravatar.cc/40?img=${fallbackIndex}`
  );
}

function getDisplayName(user) {
  return user?.name || user?.fullName || user?.email || "Unknown User";
}

function getProjectTechnologies(project) {
  return project?.technologies || project?.tags || project?.languages || [];
}

function normalizeProjectForPage(storeProject) {
  if (!storeProject) return null;

  const owner = storeProject.owner || storeProject.student || null;

  const collaborators = Array.isArray(storeProject.collaborators)
    ? storeProject.collaborators
    : [];

  const instructors = Array.isArray(storeProject.instructors)
    ? storeProject.instructors
    : [];

  const course =
    storeProject.course ||
    storeProject.courseName ||
    storeProject.courseCode ||
    "Unlinked Course";

  const type = normalizeProjectType(storeProject.type, course);

  const team =
    type === "Bachelor Project"
      ? []
      : [
          {
            name: getDisplayName(owner),
            role: "Owner",
            img: getImageForUser(owner, 1),
            id: owner?.id,
          },
          ...collaborators.map((member, index) => ({
            name: getDisplayName(member),
            role: "Member",
            img: getImageForUser(member, index + 2),
            id: member?.id,
          })),
        ].filter((member) => member.name && member.name !== "Unknown User");

  const firstInstructor = instructors[0];

  const instructor = {
    name:
      getDisplayName(firstInstructor) ||
      storeProject.instructor ||
      storeProject.instructorNames?.[0] ||
      "Unassigned Instructor",
    role: firstInstructor?.title || "Course Instructor",
    img: getImageForUser(firstInstructor, 3),
    id: firstInstructor?.id,
  };

  const rawTasks = Array.isArray(storeProject.tasks) ? storeProject.tasks : [];

  const fallbackTasks = [
    {
      id: "1",
      title: "Project setup and planning",
      description:
        "Define the project scope, team responsibilities, and initial implementation plan.",
      assignee: getDisplayName(owner),
      status: "completed",
      instructorComment:
        "Good project direction and clear planning structure.",
    },
    {
      id: "2",
      title: "Core feature implementation",
      description:
        "Build the main functionality and connect the required project modules.",
      assignee: team[1]?.name || getDisplayName(owner),
      status: "in-progress",
      instructorComment:
        "Implementation is progressing well. Keep improving consistency and documentation.",
    },
    {
      id: "3",
      title: "Testing and final polishing",
      description:
        "Test the full project flow, fix bugs, and prepare the final version.",
      assignee: getDisplayName(owner),
      status: "pending",
      instructorComment:
        "Focus on edge cases and final presentation quality.",
    },
  ];

  return {
    id: storeProject.id,
    title: storeProject.title || storeProject.name || "Untitled Project",
    type,
    course,
    visibility: normalizeVisibility(storeProject.visibility),
    updatedAt: formatProjectDate(
      storeProject.updatedAt || storeProject.updated || storeProject.createdAt
    ),
    collaborators: collaborators.length,
    rating: Number(storeProject.rating || storeProject.averageRating || 0),
    video:
      typeof storeProject.video === "string"
        ? storeProject.video
        : storeProject.video?.url || storeProject.demoUrl || "/demo.mp4",

    description:
      storeProject.description ||
      storeProject.shortDescription ||
      storeProject.summary ||
      "No description added yet.",

    technologies: getProjectTechnologies(storeProject),

    team,
    instructor,

    ownerName: getDisplayName(owner),
    ownerId: owner?.id || storeProject.ownerId,

    tasks: rawTasks.length > 0 ? rawTasks : fallbackTasks,

    feedback: storeProject.feedback || storeProject.instructorFeedback || null,
  };
}

export default function ProjectPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const projectId =
    searchParams.get("projectId") ||
    params.projectId ||
    params.id;

  const [project, setProject] = useState(null);
  const [projectMissing, setProjectMissing] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState([]);

  const [showTaskPopup, setShowTaskPopup] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    status: "pending",
    time: "",
  });

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loggedInUser = getCurrentUser();

  const currentUser =
    loggedInUser?.name ||
    loggedInUser?.fullName ||
    loggedInUser?.email ||
    "";

  const refreshProject = () => {
    const loadedProject = getProjectById(projectId);

    if (!loadedProject) {
      setProject(null);
      setProjectMissing(true);
      setTasks([]);
      return;
    }

    const normalizedProject = normalizeProjectForPage(loadedProject);

    setProject(normalizedProject);
    setProjectMissing(false);
    setTasks(normalizedProject.tasks || []);
  };

  useEffect(() => {
    refreshProject();
  }, [projectId]);

  const storeTasks = (nextTasks) => {
    if (!project?.id) return;

    setProject((current) => ({
      ...current,
      tasks: nextTasks,
    }));

    updateProject(project.id, {
      tasks: nextTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const projectCreator = project?.ownerName || "";

  const isCreator =
    Boolean(project) &&
    (currentUser === projectCreator || loggedInUser?.id === project.ownerId);

  const isInstructor =
    Boolean(project) &&
    (currentUser === project.instructor.name ||
      loggedInUser?.id === project.instructor.id);

  const isCollaborator =
    Boolean(project) &&
    project.team.some(
      (member) => member.name === currentUser || member.id === loggedInUser?.id
    );

  const canViewComments = isCreator || isCollaborator || isInstructor;

  const isBachelorProject = project?.type === "Bachelor Project";

  const updateTaskStatus = (id, newStatus) => {
    const nextTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );

    setTasks(nextTasks);
    storeTasks(nextTasks);
  };

  const addTask = () => {
    if (!newTask.title) return;

    const nextTasks = [
      ...tasks,
      {
        id: Date.now().toString(),
        ...newTask,
        instructorComment: "",
      },
    ];

    setTasks(nextTasks);
    storeTasks(nextTasks);

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

  const openEditPopup = (task) => {
    setEditingTask(task);
    setShowEditPopup(true);
  };

  const saveEditedTask = () => {
    const nextTasks = tasks.map((task) =>
      task.id === editingTask.id ? editingTask : task
    );

    setTasks(nextTasks);
    storeTasks(nextTasks);

    setShowEditPopup(false);
  };

  if (projectMissing || !project) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <AppCard className="space-y-4 p-6">
            <h2 className="text-2xl font-black text-[var(--ink)]">
              Project not found
            </h2>

            <p className="text-sm font-semibold text-[var(--muted)]">
              The selected project could not be found in the demo database.
            </p>
          </AppCard>
        </div>
      </DashboardLayout>
    );
  }

  const isPublic = project.visibility === "Public";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AppCard className="space-y-6 p-6">
          <div>
            <h2 className="text-2xl font-black text-[var(--ink)]">
              {project.title}
            </h2>

            <p className="text-sm font-semibold text-[var(--muted)]">
              {project.course} • {project.type}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[var(--muted)]">
            <span>Updated {project.updatedAt}</span>

            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.collaborators} collaborators
            </span>

            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {project.rating} / 5
            </span>

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

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <video
                controls
                className="h-[500px] w-full rounded-2xl border border-[color:var(--primary)]/10 object-cover shadow-md"
              >
                <source src={project.video} type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="flex gap-6 border-b border-[color:var(--primary)]/10 pb-2">
            {["overview", "tasks", "feedback"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-black capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                    : "text-[color:var(--muted)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                  About This Project
                </h3>

                <p className="text-sm text-[var(--muted)]">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                  Technologies
                </h3>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[var(--primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {!isBachelorProject && (
                <div>
                  <h3 className="mb-2 text-lg font-black text-[var(--ink)]">
                    Team Members
                  </h3>

                  <div className="space-y-3">
                    {project.team.map((member) => (
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
                          <p className="text-sm font-bold">{member.name}</p>

                          <p className="text-xs text-[var(--muted)]">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

          {activeTab === "tasks" && (
            <DragDropList
              items={tasks}
              setItems={
                isCreator
                  ? (nextTasks) => {
                      setTasks(nextTasks);
                      storeTasks(nextTasks);
                    }
                  : () => {}
              }
            >
              <div className="space-y-4">
                {isCreator && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowTaskPopup(true)}
                      className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                    >
                      + Add Task
                    </button>
                  </div>
                )}

                {tasks.map((task) => {
                  const canEditStatus =
                    isCreator || task.assignee === currentUser;

                  const statusStyles = {
                    completed: "bg-green-100 text-green-700",
                    "in-progress": "bg-blue-100 text-blue-700",
                    pending: "bg-gray-200 text-gray-600",
                    "post-poned": "bg-yellow-100 text-yellow-700",
                  };

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
                                disabled={!canEditStatus}
                                onChange={(e) =>
                                  updateTaskStatus(task.id, e.target.value)
                                }
                                className={`appearance-none rounded-xl px-4 py-2 text-xs font-bold border ${
                                  canEditStatus
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed opacity-60"
                                } ${statusStyles[task.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="post-poned">Post-Poned</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        }
                        right={
                          <div className="flex items-center gap-2">
                            {isCreator && (
                              <button
                                onClick={() => openEditPopup(task)}
                                className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        }
                      />

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
                        title: e.target.value,
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
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        description: e.target.value,
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
                      value={newTask.assignee}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assignee: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border p-3"
                    >
                      <option value="">Choose collaborator</option>

                      {project.team.map((member) => (
                        <option key={member.name} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowTaskPopup(false)}
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
                        title: e.target.value,
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
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
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
                    value={editingTask.assignee}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        assignee: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    {project.team.map((member) => (
                      <option key={member.name} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="mb-1 block text-sm font-bold">
                    Status
                  </label>

                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border p-3"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="post-poned">Post-Poned</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditPopup(false)}
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

          {activeTab === "feedback" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-[var(--primary)]">
                Instructor Feedback
              </h3>

              <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-black text-white">
                      {project.instructor.name?.charAt(0) || "I"}
                    </div>

                    <div>
                      <p className="text-sm font-black text-[var(--ink)]">
                        {project.instructor.name}
                      </p>

                      <p className="text-xs text-[var(--muted)]">
                        {project.updatedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                    ⭐ {project.feedback?.score || "9"} / 10
                  </div>
                </div>

                <p className="mt-4 leading-relaxed text-sm text-[var(--muted)]">
                  {project.feedback?.comment ||
                    "Excellent progress and clear project structure. Keep improving the final polish, documentation, and consistency across the implementation."}
                </p>
              </div>
            </div>
          )}
        </AppCard>
      </div>
    </DashboardLayout>
  );
}