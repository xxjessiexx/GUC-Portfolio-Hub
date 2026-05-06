import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

import { Eye, EyeOff, Star, Users } from "lucide-react";

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
      { name: "Ahmed Hassan", role: "Owner", img: "https://i.pravatar.cc/40?img=1" },
      { name: "Sara Mohamed", role: "Member", img: "https://i.pravatar.cc/40?img=2" },
    ],
    instructor: {
      name: "Dr. Mervat Abuelkheir",
      role: "Course Instructor",
      img: "https://i.pravatar.cc/40?img=3",
    },
  };

  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Implement user authentication",
      description: "Add JWT-based authentication with login and registration",
      assignee: "Ahmed Hassan",
      status: "completed",
    },
    {
      id: 2,
      title: "Design database schema",
      description: "Create MongoDB schema for products, orders, and users",
      assignee: "Sara Mohamed",
      status: "completed",
    },
    {
      id: 3,
      title: "Build admin dashboard",
      description: "Create admin panel for managing products and orders",
      assignee: "Ahmed Hassan",
      status: "in-progress",
    },
  ]);

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const isPublic = project.visibility === "Public";

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ===== HEADER ===== */}
        <SectionHeader
          title="Project Details"
          subtitle="View full project information"
        />

        {/* ===== MAIN CARD ===== */}
        <AppCard className="p-6 space-y-6">

          {/* ===== TITLE + TYPE ===== */}
          <div>
            <h2 className="text-2xl font-black text-[var(--ink)]">
              {project.title}
            </h2>
            <p className="text-sm font-semibold text-[var(--muted)]">
              {project.course} • {project.type}
            </p>
          </div>

          {/* ===== META INFO ===== */}
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

            {/* VISIBILITY */}
            <span
              className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
                isPublic
                  ? "bg-[rgba(156,213,255,0.35)] text-[var(--primary)]"
                  : "bg-[rgba(230,199,123,0.25)] text-[var(--primary)]"
              }`}
            >
              {isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {project.visibility}
            </span>
          </div>

          {/* ===== VIDEO (FIXED SIZE) ===== */}
          <div className="w-full max-w-4xl mx-auto">
            <video
              controls
              className="w-full h-[360px] object-cover rounded-2xl border border-[color:var(--primary)]/10"
            >
              <source src={project.video} type="video/mp4" />
            </video>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-6 border-b border-[color:var(--primary)]/10 pb-2">
            {["overview", "tasks", "feedback"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-black capitalize ${
                  activeTab === tab
                    ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                    : "text-[color:var(--muted)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              <div>
                <h3 className="text-lg font-black text-[var(--ink)] mb-2">
                  About This Project
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-[var(--ink)] mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/70 text-xs font-black text-[var(--primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-[var(--ink)] mb-2">
                  Team Members
                </h3>
                <div className="space-y-3">
                  {project.team.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-3 rounded-xl border p-3 bg-white/60"
                    >
                      <img
                        src={member.img}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-[var(--ink)] mb-2">
                  Instructor
                </h3>
                <div className="flex items-center gap-3 rounded-xl border p-3 bg-green-50">
                  <img
                    src={project.instructor.img}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm">
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
  <div className="space-y-4">
    {tasks.map((task) => {
      const isActive = selectedTaskId === task.id;

      const statusStyles = {
        completed: "bg-green-100 text-green-700",
        "in-progress": "bg-blue-100 text-blue-700",
        todo: "bg-gray-200 text-gray-600",
      };

      return (
        <div
          key={task.id}
          onClick={() => setSelectedTaskId(task.id)}
          className={`cursor-pointer rounded-2xl border transition-all ${
            isActive
              ? "p-6 scale-[1.02] bg-white/90 shadow-lg border-[var(--primary)]"
              : "p-4 bg-white/60 border-white/70 hover:bg-white/80"
          }`}
        >
          {/* ===== TOP ROW ===== */}
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-black text-[var(--ink)]">
              {task.title}
            </h3>

            {/* ✅ STATUS ALWAYS VISIBLE */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                statusStyles[task.status]
              }`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-1 text-sm text-[var(--muted)]">
            {task.description}
          </p>

          {/* ASSIGNEE */}
          <p className="mt-2 text-xs text-[var(--muted)]">
            {task.assignee}
          </p>

          {/* ===== EDIT MODE ===== */}
          {isActive && (
            <div
              className="mt-4 flex gap-2"
              onClick={(e) => e.stopPropagation()} // prevent closing
            >
              {["todo", "in-progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateTaskStatus(task.id, status)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition ${
                    task.status === status
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white/70 text-[var(--muted)] hover:bg-white"
                  }`}
                >
                  {status.replace("-", " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}

{activeTab === "feedback" && (
  <div className="space-y-6">

    {/* TITLE */}
    <h3 className="text-xl font-black text-[var(--primary)]">
      Feedback & Reviews
    </h3>

    {/* FEEDBACK CARD */}
    <div className="rounded-2xl border border-[color:var(--primary)]/20 bg-white/70 p-5">

      {/* TOP ROW */}
      <div className="flex items-center justify-between">

        {/* LEFT: USER */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black">
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

        {/* RIGHT: RATING (IMPORTANT ⭐) */}
        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-black text-yellow-700">
          ⭐ 9 / 10
        </div>
      </div>

      {/* COMMENT */}
      <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
        Excellent implementation of microservices architecture. The UI is intuitive and responsive. Great work on the payment integration!
      </p>
    </div>
  </div>
)}
        </AppCard>
      </div>
    </DashboardLayout>
  );
}