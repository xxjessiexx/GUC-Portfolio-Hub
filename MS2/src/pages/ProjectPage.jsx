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

    course:
      "CSEN 501 - Software Engineering",

    visibility: "Public",

    updatedAt: "March 1, 2026",

    collaborators: 2,

    rating: 4.5,

    video: "/demo.mp4",

    description:
      "An AI-powered platform that helps students organize study plans, track progress, and collaborate efficiently.",

    technologies: [
      "React",
      "Node.js",
      "MongoDB",
    ],

    team: [
      {
        name: "Ahmed Hassan",
        role: "Owner",
        img: "https://i.pravatar.cc/40?img=1",
        collaborationStatus:
          "Accepted",
      },

      {
        name: "Sara Mohamed",
        role: "Member",
        img: "https://i.pravatar.cc/40?img=2",
        collaborationStatus:
          "No Reply",
      },
    ],

    instructor: {
      name: "Dr. Mervat Abuelkheir",

      role: "Course Instructor",

      img: "https://i.pravatar.cc/40?img=3",
    },
  };

  /* ================= CURRENT USER ================= */

  const currentUser = "Ahmed Hassan";

  /* ================= ROLE CHECKS ================= */

  const projectCreator =
    "Ahmed Hassan";

  const isCreator =
    currentUser === projectCreator;

  const isInstructor =
    currentUser ===
    project.instructor.name;

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

  /* ================= STATES ================= */

  const [activeTab, setActiveTab] =
    useState("overview");

  const [showTaskPopup, setShowTaskPopup] =
    useState(false);

  const [showEditPopup, setShowEditPopup] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [tasks, setTasks] = useState([
    {
      id: "1",

      title:
        "Implement user authentication",

      description:
        "Add JWT-based authentication with login and registration",

      assignee: "Ahmed Hassan",

      status: "completed",

      instructorComment:
        "Excellent security implementation and clean JWT structure.",
    },

    {
      id: "2",

      title:
        "Design database schema",

      description:
        "Create MongoDB schema for products, orders, and users",

      assignee: "Sara Mohamed",

      status: "pending",

      instructorComment:
        "Good normalization and schema relationships.",
    },

    {
      id: "3",

      title:
        "Build admin dashboard",

      description:
        "Create admin panel for managing products and orders",

      assignee: "Ahmed Hassan",

      status: "post-poned",

      instructorComment:
        "Need better responsive layout for mobile.",
    },
  ]);

  const [newTask, setNewTask] =
    useState({
      title: "",
      description: "",
      assignee: "",
      status: "pending",
    });

  /* ================= FUNCTIONS ================= */

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
      status: "pending",
    });

    setShowTaskPopup(false);
  };

  const updateTaskStatus = (
    id,
    newStatus
  ) => {

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  const openEditPopup = (task) => {

    setEditingTask(task);

    setShowEditPopup(true);
  };

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

        <AppCard className="space-y-6 p-6">

          {/* ===== TITLE ===== */}

          <div>

            <h2 className="text-2xl font-black text-[var(--ink)]">
              {project.title}
            </h2>

            <p className="text-sm font-semibold text-[var(--muted)]">
              {project.course} •{" "}
              {project.type}
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

            <span
              className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
                isPublic
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
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
                className="h-[500px] w-full rounded-2xl border object-cover shadow-md"
              >
                <source
                  src={project.video}
                  type="video/mp4"
                />
              </video>

            </div>

          </div>

          {/* ===== TABS ===== */}

          <div className="flex gap-6 border-b pb-2">

            {[
              "overview",
              "tasks",
              "feedback",
            ].map((tab) => (

              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`pb-2 text-sm font-black capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>

            ))}

          </div>

          {/* ================= OVERVIEW ================= */}

          {activeTab === "overview" && (

            <div className="space-y-6">

              {/* DESCRIPTION */}

              <div>

                <h3 className="mb-2 text-lg font-black text-[#16253A]">
                  About This Project
                </h3>

                <p className="text-sm text-gray-500">
                  {project.description}
                </p>

              </div>

              {/* TECHNOLOGIES */}

              <div>

                <h3 className="mb-2 text-lg font-black text-[#16253A]">
                  Technologies
                </h3>

                <div className="flex flex-wrap gap-2">

                  {project.technologies.map(
                    (tech) => (

                      <span
                        key={tech}
                        className="rounded-full bg-white px-4 py-1 text-sm font-black text-[#355C7D]"
                      >
                        {tech}
                      </span>

                    )
                  )}

                </div>

              </div>

              {/* TEAM */}

              <div>

                <h3 className="mb-2 text-lg font-black text-[#16253A]">
                  Team Members
                </h3>

                <div className="space-y-3">

                  {project.team.map(
                    (member) => (

                      <div
                        key={member.name}
                        className="flex items-center justify-between rounded-2xl border bg-white/70 p-4"
                      >

                        <div className="flex items-center gap-3">

                          <img
                            src={member.img}
                            alt=""
                            className="h-12 w-12 rounded-full"
                          />

                          <div>

                            <p className="text-lg font-black text-[#16253A]">
                              {member.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {member.role}
                            </p>

                          </div>

                        </div>

                        {/* COLLAB STATUS */}

                        <div>

                          {member.collaborationStatus ===
                            "Accepted" && (
                            <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-black text-green-700">
                              Accepted
                            </span>
                          )}

                          {member.collaborationStatus ===
                            "Rejected" && (
                            <span className="rounded-full bg-red-100 px-4 py-1 text-xs font-black text-red-700">
                              Rejected
                            </span>
                          )}

                          {member.collaborationStatus ===
                            "No Reply" && (
                            <span className="rounded-full bg-yellow-100 px-4 py-1 text-xs font-black text-yellow-700">
                              No Reply
                            </span>
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* INSTRUCTOR */}

              <div>

                <h3 className="mb-2 text-lg font-black text-[#16253A]">
                  Instructor
                </h3>

                <div className="flex items-center gap-3 rounded-2xl border bg-green-50 p-4">

                  <img
                    src={project.instructor.img}
                    alt=""
                    className="h-12 w-12 rounded-full"
                  />

                  <div>

                    <p className="text-lg font-black text-[#16253A]">
                      {project.instructor.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {project.instructor.role}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ================= TASKS ================= */}

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
                      className="rounded-xl bg-[#355C7D] px-4 py-2 text-sm font-black text-white"
                    >
                      + Add Task
                    </button>

                  </div>

                )}

                {/* TASKS */}

                {tasks.map((task) => {

                  const canEditStatus =
                    isCreator ||
                    task.assignee ===
                      currentUser;

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

                            <p className="mt-1 text-sm text-gray-500">
                              {task.description}
                            </p>

                          </div>
                        }

                        middle={
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
                            className="rounded-xl border px-3 py-2 text-xs font-bold"
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
                        }

                        right={
                          isCreator && (
                            <button
                              onClick={() =>
                                openEditPopup(
                                  task
                                )
                              }
                              className="rounded-xl bg-[#355C7D] px-4 py-2 text-xs font-black text-white"
                            >
                              Edit
                            </button>
                          )
                        }
                      />

                      {/* COMMENTS */}

                      {canViewComments && (

                        <div className="ml-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                          <p className="text-xs font-black uppercase text-blue-600">
                            Instructor Comment
                          </p>

                          <p className="mt-2 text-sm text-gray-700">
                            {
                              task.instructorComment
                            }
                          </p>

                        </div>

                      )}

                    </div>

                  );
                })}

              </div>

            </DragDropList>

          )}

          {/* ================= FEEDBACK ================= */}

          {activeTab === "feedback" && (

            <div className="space-y-6">

              <h3 className="text-xl font-black text-[#355C7D]">
                Instructor Feedback
              </h3>

              <div className="rounded-2xl border bg-white/70 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black">
                      D
                    </div>

                    <div>

                      <p className="font-black text-[#16253A]">
                        Dr. Mervat Abuelkheir
                      </p>

                      <p className="text-xs text-gray-500">
                        05/03/2026
                      </p>

                    </div>

                  </div>

                  <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                    ⭐ 9 / 10
                  </div>

                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600">
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

      {/* ================= ADD TASK POPUP ================= */}

      {showTaskPopup && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-xl font-black text-[#16253A]">
              Add Task
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl border p-3"
              />

              <textarea
                rows={3}
                placeholder="Description"
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

              <select
                value={newTask.assignee}
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
                  Select Assignee
                </option>

                {project.team.map(
                  (member) => (

                    <option
                      key={member.name}
                      value={member.name}
                    >
                      {member.name}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setShowTaskPopup(false)
                }
                className="w-1/2 rounded-xl border py-3 font-black"
              >
                Cancel
              </button>

              <button
                onClick={addTask}
                className="w-1/2 rounded-xl bg-[#355C7D] py-3 font-black text-white"
              >
                Add Task
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= EDIT TASK POPUP ================= */}

      {showEditPopup &&
        editingTask && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* TITLE */}
            <h2 className="mb-6 text-2xl font-black text-[#16253A]">
              Edit Task
            </h2>

            {/* TASK TITLE */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-black text-[#16253A]">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-[#16253A] outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-black text-[#16253A]">
                Description
              </label>

              <textarea
                rows={3}
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-[#16253A] outline-none"
              />
            </div>

            {/* ASSIGNEE */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-black text-[#16253A]">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-[#16253A] outline-none"
              >
                {project.team.map(
                  (member) => (
                    <option
                      key={member.name}
                      value={member.name}
                    >
                      {member.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* STATUS */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-black text-[#16253A]">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-[#16253A] outline-none"
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

            {/* BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowEditPopup(false)
                }
                className="w-1/2 rounded-xl border border-gray-200 bg-white py-3 text-lg font-black text-[#16253A]"
              >
                Cancel
              </button>

              <button
                onClick={
                  saveEditedTask
                }
                className="w-1/2 rounded-xl bg-[#355C7D] py-3 text-lg font-black text-white"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}