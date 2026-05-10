import { useEffect, useState } from "react";
import { AppCard } from "../components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  getCurrentUser,
  getProjectsForUser,
  getCollection,
  updateProject,
  deleteProject as deleteProjectFromStore,
} from "@/data/demoStore";

import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

import { Pencil, Trash2, Pin, ChevronDown, Globe, Lock } from "lucide-react";
import CourseBadge from "@/components/ui/CourseBadge";
import DragDropList from "@/components/ui/DragDropList";
import SortableCard from "@/components/ui/SortableCard";

import SearchInput from "@/components/Filters/SearchInput";
import CourseFilter from "@/components/Filters/CourseFilter";
import VisibilityFilter from "@/components/Filters/VisibilityFilter";
import PinnedFilter from "@/components/Filters/PinnedFilter";
import SortFilter from "@/components/Filters/SortFilter";

const normalizeVisibility = (value) => {
  if (!value) return "Public";
  return String(value).toLowerCase() === "private" ? "Private" : "Public";
};

const getProjectName = (project) =>
  project.name || project.title || "Untitled Project";

const getProjectDescription = (project) =>
  project.description ||
  project.shortDescription ||
  project.summary ||
  "No description added yet.";

const getProjectCourse = (project, courses) => {
  if (project.course) return project.course;
  if (project.courseCode) return project.courseCode;
  if (project.courseName) return project.courseName;

  const course = courses.find((c) => c.id === project.courseId);

  return (
    course?.code ||
    course?.courseCode ||
    course?.name ||
    course?.title ||
    project.courseId ||
    "No course"
  );
};

const getProjectUpdated = (project) => {
  const value = project.updated || project.updatedAt || project.createdAt;

  if (!value) return "Not updated yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProjectRating = (project) =>
  project.rating ?? project.averageRating ?? "—";

const getProjectComments = (project) => {
  if (typeof project.comments === "number") return project.comments;
  if (Array.isArray(project.comments)) return project.comments.length;
  if (Array.isArray(project.feedback)) return project.feedback.length;
  if (typeof project.commentsCount === "number") return project.commentsCount;
  return 0;
};

export default function ViewAllProjects() {
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterPinned, setFilterPinned] = useState("All");
  const [sortBy, setSortBy] = useState("Updated");

  const navigate = useNavigate();

  const refreshProjects = () => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      setProjects([]);
      setCourses([]);
      return;
    }

    setProjects(getProjectsForUser(currentUser.id) || []);
    setCourses(getCollection("courses") || []);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const deleteProject = (id) => {
    deleteProjectFromStore(id);
    refreshProjects();
  };

  const filteredProjects = projects
    .filter((p) => {
      const name = getProjectName(p);
      const course = getProjectCourse(p, courses);
      const visibility = normalizeVisibility(p.visibility);
      const pinned = Boolean(p.pinned || p.isPinned);

      return (
        name.toLowerCase().includes(search.toLowerCase()) &&
        (filterCourse === "All" ||
          course.toUpperCase().includes(filterCourse.toUpperCase())) &&
        (filterVisibility === "All" || visibility === filterVisibility) &&
        (filterPinned === "All" ||
          (filterPinned === "Pinned" && pinned) ||
          (filterPinned === "Unpinned" && !pinned))
      );
    })
    .sort((a, b) => {
      if (sortBy === "Alphabetical") {
        return getProjectName(a).localeCompare(getProjectName(b));
      }

      if (sortBy === "Updated") {
        return (
          new Date(b.updatedAt || b.updated || b.createdAt || 0) -
          new Date(a.updatedAt || a.updated || a.createdAt || 0)
        );
      }

      return 0;
    });

  const pinnedProjects = filteredProjects.filter(
    (p) => p.pinned || p.isPinned
  );

  const togglePin = (id) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    const nextPinned = !(project.pinned || project.isPinned);

    updateProject(id, {
      pinned: nextPinned,
      isPinned: nextPinned,
      updatedAt: new Date().toISOString(),
    });

    refreshProjects();
  };

  const toggleVisibility = (id, value) => {
    updateProject(id, {
      visibility: String(value).toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    refreshProjects();
  };

  const openProject = (id) => {
    navigate(`/project?projectId=${id}`);
  };

  const editProject = (id) => {
    navigate(`/edit-project/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <SectionHeader
          title="My Projects"
          subtitle="Manage, edit, and organize your projects."
          action={
            <div className="-m-2">
              <span
                onClick={() => navigate("/create-project")}
                className="inline-flex items-center rounded-2xl px-9 py-3 text-white font-semibold 
                bg-[#2C4E80] shadow-md hover:bg-[#243f69] transition-all cursor-pointer"
              >
                + Create Project
              </span>
            </div>
          }
        />

        {/* Filters */}
        <AppCard className="p-4 flex items-center gap-4 flex-wrap rounded-2xl bg-white/60 backdrop-blur-md">
          <SearchInput
            search={search}
            setSearch={setSearch}
            placeholder="Search my projects"
          />

          <CourseFilter
            value={filterCourse}
            onChange={setFilterCourse}
            options={["CSEN", "MET", "DMET", "BI"]}
          />

          <VisibilityFilter
            value={filterVisibility}
            onChange={setFilterVisibility}
            options={["Public", "Private"]}
          />

          <PinnedFilter
            value={filterPinned}
            onChange={setFilterPinned}
            options={["Pinned", "Unpinned"]}
          />

          <SortFilter
            value={sortBy}
            onChange={setSortBy}
            options={["None", "Updated", "Alphabetical"]}
          />
        </AppCard>

        {/* Pinned */}
        {pinnedProjects.length > 0 && (
          <AppCard className="p-4">
            <Label className="mb-1 text-xl font-bold text-[#243B6B]">
              Pinned on Portfolio
            </Label>

            <p className="text-sm text-gray-500 mt-0 mb-4">
              Projects highlighted at the top of your portfolio
            </p>

            <div className="flex gap-4 flex-wrap">
              {pinnedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProject(p.id)}
                  className="border rounded-2xl p-3 flex justify-between items-start w-80 cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[15px] text-[#243B6B] truncate max-w-[230px]">
                      {getProjectName(p)}
                    </h3>

                    <CourseBadge course={getProjectCourse(p, courses)} />
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      togglePin(p.id);
                    }}
                    className={`mt-2 flex items-center justify-center w-10 h-10 rounded-full border transition ${
                      p.pinned || p.isPinned
                        ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                        : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <Pin size={16} strokeWidth={2.5} className="rotate-45" />
                  </button>
                </div>
              ))}
            </div>
          </AppCard>
        )}

        {/* All Projects */}
        <AppCard className="p-4">
          <Label className="mb-4 ml-3 text-xl font-bold text-[#243B6B]">
            All My Projects
          </Label>

          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
              <h3 className="text-lg font-bold text-[#243B6B]">
                No projects found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create a project or adjust your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[3.5fr_1.2fr_1.7fr_1.2fr_1.5fr_1fr] px-10 py-3 text-xs font-semibold text-gray-500 uppercase">
                <span className="pl-12">Project</span>

                <span className="-ml-14">Updated</span>

                <span className="-ml-6">Portfolio Visibility</span>

                <span className="-ml-6">Pinned to Top</span>

                <span className="-ml-4">Rating / Comments</span>

                <span className="pl-7">Actions</span>
              </div>

              <DragDropList items={filteredProjects} setItems={setProjects}>
                <div className="space-y-4">
                  {filteredProjects.map((p) => {
                    const visibility = normalizeVisibility(p.visibility);
                    const pinned = Boolean(p.pinned || p.isPinned);

                    return (
                      <SortableCard
                        key={p.id}
                        id={p.id}
                        updated={getProjectUpdated(p)}
                        onClick={() => openProject(p.id)}
                        left={
                          <div>
                            <h3
                              onClick={(event) => {
                                event.stopPropagation();
                                openProject(p.id);
                              }}
                              className="font-bold text-[16px] text-[#16253A] max-w-md truncate leading-none cursor-pointer hover:text-blue-600"
                            >
                              {getProjectName(p)}
                            </h3>

                            <p className="text-[#3B82F6] text-sm font-semibold mt-1">
                              {getProjectCourse(p, courses)}
                            </p>

                            <p className="text-sm text-gray-500 min-w-0 line-clamp-2 max-w-xl">
                              {getProjectDescription(p)}
                            </p>
                          </div>
                        }
                        middle={
                          <div className="contents">
                            {/* Visibility */}
                            <div className="flex justify-center">
                              <div className="relative w-fit">
                                <select
                                  value={visibility}
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={(e) =>
                                    toggleVisibility(p.id, e.target.value)
                                  }
                                  className={`appearance-none pl-10 pr-8 py-2 rounded-xl border text-sm font-medium cursor-pointer ${
                                    visibility === "Public"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-100 text-gray-600 border-gray-200"
                                  }`}
                                >
                                  <option value="Public">Public</option>
                                  <option value="Private">Private</option>
                                </select>

                                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  {visibility === "Public" ? (
                                    <Globe size={16} className="text-green-600" />
                                  ) : (
                                    <Lock size={16} className="text-gray-500" />
                                  )}
                                </span>

                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <ChevronDown
                                    size={14}
                                    className="text-gray-400"
                                  />
                                </span>
                              </div>
                            </div>

                            {/* Pin */}
                            <div className="flex justify-center">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  togglePin(p.id);
                                }}
                                className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
                                  pinned
                                    ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                                    : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
                                }`}
                              >
                                <Pin
                                  size={16}
                                  strokeWidth={2.5}
                                  className="rotate-45"
                                />
                              </button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">
                                {getProjectRating(p)}
                              </span>

                              <span className="text-yellow-400">★</span>

                              <span className="text-gray-400">•</span>

                              <span>{getProjectComments(p)} comments</span>
                            </div>
                          </div>
                        }
                        right={
                          <div className="flex gap-2 justify-end -mr-4">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                editProject(p.id);
                              }}
                              className="p-2 rounded border hover:bg-gray-100"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();

                                if (
                                  confirm(
                                    "Are you sure you want to delete this project?"
                                  )
                                ) {
                                  deleteProject(p.id);
                                }
                              }}
                              className="p-2 rounded border hover:bg-red-100 text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>

                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                togglePin(p.id);
                              }}
                              className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
                                pinned
                                  ? "bg-yellow-100 border-yellow-300 text-yellow-600"
                                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
                              }`}
                            >
                              <Pin
                                size={16}
                                strokeWidth={2.5}
                                className="rotate-45"
                              />
                            </button>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </DragDropList>
            </>
          )}
        </AppCard>
      </div>
    </DashboardLayout>
  );
}