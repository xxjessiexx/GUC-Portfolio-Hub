import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import DragDropList from "@/components/ui/DragDropList";
import SortableCard from "@/components/ui/SortableCard";

import {
  Eye,
  EyeOff,
  Star,
  Users,
  GripVertical,
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

    team: [
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

  /* ================= STATES ================= */
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Implement user authentication",
      description:
        "Add JWT-based authentication with login and registration",
      assignee: "Ahmed Hassan",
      status: "completed",
    },
    {
      id: "2",
      title: "Design database schema",
      description:
        "Create MongoDB schema for products, orders, and users",
      assignee: "Sara Mohamed",
      status: "completed",
    },
    {
      id: "3",
      title: "Build admin dashboard",
      description:
        "Create admin panel for managing products and orders",
      assignee: "Ahmed Hassan",
      status: "in-progress",
    },
  ]);
  const [showTaskPopup, setShowTaskPopup] = useState(false);

const [newTask, setNewTask] = useState({
  title: "",
  description: "",
  assignee: "",
  deadline: "",
  status: "pending",
  time: "",
});

  /* ================= FUNCTIONS ================= */
  const updateTaskStatus = (id, newStatus) => {
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
    },
  ]);

  setNewTask({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    status: "pending",
  });

  setShowTaskPopup(false);
};

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(tasks);

    const [removed] = reordered.splice(
      result.source.index,
      1
    );

    reordered.splice(result.destination.index, 0, removed);

    setTasks(reordered);
  };

  const isPublic = project.visibility === "Public";

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
                  onClick={() => setActiveTab(tab)}
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

              {/* TEAM */}
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
                        <p className="text-sm font-bold">
                          {member.name}
                        </p>

                        <p className="text-xs text-[var(--muted)]">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
          {/* ===== TASKS ===== */}
{activeTab === "tasks" && (
  <DragDropList
    items={tasks}
    setItems={setTasks}
  >
    <div className="space-y-4">

  {/* ADD TASK BUTTON */}
  <div className="flex justify-end">
    <button
      onClick={() => setShowTaskPopup(true)}
      className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
    >
      + Add Task
    </button>
  </div>

      {tasks.map((task) => {

        const statusStyles = {
          completed: "bg-green-100 text-green-700",
          "in-progress": "bg-blue-100 text-blue-700",
          todo: "bg-gray-200 text-gray-600",
        };

        return (
          <SortableCard
            key={task.id}
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
    onChange={(e) =>
      updateTaskStatus(task.id, e.target.value)
    }
    className={`appearance-none rounded-xl px-4 py-2 text-xs font-bold border cursor-pointer ${
      statusStyles[task.status]
    }`}
  >
    <option value="pending">Pending</option>
    <option value="post-poned">Post-Poned</option>
    <option value="completed">Completed</option>
  </select>

</div>
              </div>
            }

            right={
              <div className="text-sm text-gray-500">
               
              </div>
            }
          />
        );
      })}

    </div>
  </DragDropList>
  

)}
{/* ===== POPUP ===== */}
{showTaskPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      <h2 className="mb-4 text-xl font-black text-[var(--ink)]">
        Add New Task
      </h2>

      {/* TITLE */}
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

      {/* DESCRIPTION */}
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

      {/* ASSIGNEE */}
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
            <option
              key={member.name}
              value={member.name}
            >
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* DEADLINE */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-bold">
          Sub Deadline
        </label>

        <input
          type="date"
          
          value={newTask.deadline}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              deadline: e.target.value,
            })
          }
          className="w-full rounded-xl border p-3"
        />
      </div>
      {/* TIME */}
<div className="mt-4">
  <label className="mb-1 block text-sm font-bold">
    Deadline Time
  </label>

  <input
    type="time"
    value={newTask.time}
    onChange={(e) =>
      setNewTask({
        ...newTask,
        time: e.target.value,
      })
    }
    className="w-full rounded-xl border p-3"
  />
</div>

      {/* BUTTONS */}
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

          {/* ===== FEEDBACK ===== */}
          {activeTab === "feedback" && (
            <div className="space-y-6">

              <h3 className="text-xl font-black text-[var(--primary)]">
                Feedback & Reviews
              </h3>

              <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">

                <div className="flex items-center justify-between">

                  {/* USER */}
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

                  {/* RATING */}
                  <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
                    ⭐ 9 / 10
                  </div>
                </div>

                {/* COMMENT */}
                <p className="mt-4 leading-relaxed text-sm text-[var(--muted)]">
                  Excellent implementation of
                  microservices architecture. The
                  UI is intuitive and responsive.
                  Great work on the payment
                  integration!
                </p>
              </div>
            </div>
          )}
        </AppCard>
      </div>
    </DashboardLayout>
  );
}