import { useEffect, useState } from "react";
import { AppCard } from "../components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import DeleteConfirmationModal
from "@/components/ui/DeleteConfirmationModal";
import { AdminActionDialog }
from "@/components/adminModule/AdminActionDialog";

import {
  getCurrentUser,
  getProjectsForUser,
  getCollection,
  updateProject,
  deleteProject as deleteProjectFromStore,
} from "@/data/demoStore";

import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

import { Pencil, Trash2, ChevronDown, Globe, Lock } from "lucide-react";
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
  const projectType = String(project.type || "").toLowerCase();

  const isBachelorProject =
    projectType.includes("bachelor") ||
    projectType.includes("thesis");

  if (isBachelorProject) {
    return "Bachelor Project";
  }

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
  
  const [sortBy, setSortBy] = useState("Updated");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
  useState(null);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [appealOpen, setAppealOpen] =
  useState(false);

const [selectedAppealProject, setSelectedAppealProject] =
  useState(null);

const [appealMessage, setAppealMessage] =
  useState("");

const reportedProjects =
  JSON.parse(
    localStorage.getItem(
      "reportedProjects"
    )
  ) || [];

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
      

      return (
        name.toLowerCase().includes(search.toLowerCase()) &&
        (filterCourse === "All" ||
                filterCourse === "Bachelor Project"
        ? course === "Bachelor Project"
        : course
            .toUpperCase()
            .includes(filterCourse.toUpperCase())) &&
        (filterVisibility === "All" || visibility === filterVisibility) 
        
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

  const submitAppeal = () => {

  if (!appealMessage.trim()) return;

  const savedAppeals =
    JSON.parse(
      localStorage.getItem("projectAppeals")
    ) || [];

  const updatedAppeals = [

    ...savedAppeals,

    {
      id: Date.now(),

      projectId:
        selectedAppealProject.id,

      studentId:
        currentUser.id,

      student:
        currentUser.name,

      message:
        appealMessage,

      submittedAt:
        new Date().toLocaleString(),

      status: "pending",
    },
  ];

  localStorage.setItem(
    "projectAppeals",
    JSON.stringify(updatedAppeals)
  );

  /* UPDATE FLAGGED PROJECT */

  const flagged =
    JSON.parse(
      localStorage.getItem(
        "flaggedProjects"
      )
    ) || [];

  const updatedFlags =
    flagged.map((project) =>

      project.id ===
      selectedAppealProject.id

        ? {
            ...project,
            appealStatus: "pending",
          }

        : project
    );

  localStorage.setItem(
    "flaggedProjects",
    JSON.stringify(updatedFlags)
  );

  refreshProjects();

setProjects((prev) =>

  prev.map((project) =>

    project.id ===
    selectedAppealProject.id

      ? {
          ...project,
          appealStatus: "pending",
        }

      : project
  )
);

setAppealOpen(false);

setAppealMessage("");
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
        <SearchFilterToolbar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search my projects..."
  showSort
  sortValue={`Sort: ${sortBy}`}
  onSortChange={(value) =>
    setSortBy(value.replace("Sort: ", ""))
  }
  sortOptions={[
    "Sort: None",
    "Sort: Updated",
    "Sort: Alphabetical",
  ]}
  showFilters
  filtersOpen={filtersOpen}
  onToggleFilters={() =>
    setFiltersOpen((prev) => !prev)
  }
  filterTitle="Project Filters"
  onClearFilters={() => {
    setFilterCourse("All");
    setFilterVisibility("All");
    
  }}
>
  <FilterSelect
  value={`Course: ${filterCourse}`}
  onChange={(value) =>
    setFilterCourse(
      value.replace("Course: ", "")
    )
  }
  options={[
    "Course: All",
    "Course: CSEN",
    "Course: MET",
    "Course: BI",
    "Course: Bachelor Project",
  ]}
/>

  <FilterSelect
    value={`Visibility: ${filterVisibility}`}
    onChange={(value) =>
      setFilterVisibility(
        value.replace("Visibility: ", "")
      )
    }
    options={[
      "Visibility: All",
      "Visibility: Public",
      "Visibility: Private",
    ]}
  />

  
</SearchFilterToolbar>

        {/* Flagged Projects */}
<AppCard className="p-5">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">

      <Label
        className="
          text-xl
          font-black
          text-[#243B6B]
        "
      >
        Flagged Projects
      </Label>

      <div
        className="
          w-7 h-7
          rounded-full
          bg-red-100
          text-red-500
          flex items-center justify-center
          text-sm font-bold
        "
      >
        {
          projects.filter((p) =>

  reportedProjects.some(
    (reported) =>

      reported.projectId === p.id &&

      reported.ownerId ===
        currentUser?.id
  )
).length
        }
      </div>

    </div>

    <button
      className="
        text-[#4F8CFF]
        text-sm
        font-bold
        hover:underline
      "
    >
      View all flagged →
    </button>

  </div>

  <div className="mt-5 space-y-4">

    {projects
  .filter((p) =>

    reportedProjects.some(
      (reported) =>

        reported.projectId === p.id &&

        reported.ownerId ===
          currentUser?.id
    )
  )

  .map((p) => (

        <div
          key={p.id}
          onClick={() =>
            openProject(p.id)
          }
          className="
            border
            rounded-3xl
            bg-white
            px-5 py-4
            flex items-center
            justify-between
            gap-6
            hover:bg-slate-50
            transition
            cursor-pointer
          "
        >

          {/* LEFT */}
          <div className="flex items-center gap-5 min-w-0">

            <img
              src={p.image}
              alt={getProjectName(p)}
              className="
                w-44 h-28
                rounded-2xl
                object-cover
                shrink-0
              "
            />

            <div className="min-w-0">

              <h3
                className="
                  text-[22px]
                  font-black
                  text-[#16253A]
                  truncate
                "
              >
                {getProjectName(p)}
              </h3>

              <p
                className="
                  text-gray-500
                  font-semibold
                  mt-1
                "
              >
                {getProjectCourse(
                  p,
                  courses
                )}
              </p>

              <div
                className="
                  flex items-center
                  gap-4
                  mt-3
                  text-gray-500
                  text-sm
                "
              >

                <span>
                  👨‍🏫 {p.instructor ||
                  "Instructor"}
                </span>

                <span>
                  👥 {p.students ||
                  0} Students
                </span>

              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              flex items-center
              gap-4
              shrink-0
            "
          >

            {(() => {

  const savedAppeals =
    JSON.parse(
      localStorage.getItem(
        "projectAppeals"
      )
    ) || [];

  const projectAppeal =
    savedAppeals.find(
      (appeal) =>
        appeal.projectId === p.id
    );

  const appealStatus =
    projectAppeal?.status;

  return (

    <button
      onClick={(event) => {

        event.stopPropagation();

        if (
          appealStatus === "pending" ||
          appealStatus === "accepted"
        ) {
          return;
        }

        setSelectedAppealProject(p);

        setAppealOpen(true);
      }}

      className={`
        px-5 py-2
        rounded-full
        font-bold
        text-sm
        transition

        ${
          appealStatus === "accepted"

            ? `
              bg-green-100
              text-green-600
            `

            : appealStatus === "pending"

            ? `
              bg-orange-100
              text-orange-500
            `

            : `
              bg-red-100
              text-red-500
              hover:bg-red-200
            `
        }
      `}
    >

      {appealStatus === "accepted"

        ? "Resolved"

        : appealStatus === "pending"

        ? "Reviewing Appeal"

        : "Send Appeal"}

    </button>

  );
})()}
            

            <button
              onClick={(event) => {
                event.stopPropagation();
                setProjectToDelete(
                  p.id
                );
              }}
              className="
                p-3
                rounded-xl
                border
                text-red-500
                hover:bg-red-50
              "
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>

      ))}

  </div>

</AppCard>

        {/* All Projects */}
        <AppCard className="p-4">
          <div className="flex items-center gap-3 mb-4 ml-3">

  <Label
    className="
      text-xl
      font-black
      text-[#243B6B]
    "
  >
    All My Projects
  </Label>

  <div
    className="
      w-7 h-7
      rounded-full
      bg-[#EEF4FF]
      text-[#4F8CFF]
      flex items-center justify-center
      text-sm
      font-bold
    "
  >
    {filteredProjects.length}
  </div>

</div>

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

                

                <span className="-ml-4">Rating / Comments</span>

                <span className="pl-7">Actions</span>
              </div>

              <DragDropList items={filteredProjects} setItems={setProjects}>
                <div className="space-y-4">
                  {filteredProjects.map((p) => {
                    const visibility = normalizeVisibility(p.visibility);
                    

                    return (
                      <SortableCard
                        key={p.id}
                        id={p.id}
                        updated={getProjectUpdated(p)}
                        onClick={() => openProject(p.id)}
                        left={
                          <div className="min-w-0 pr-10">
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

                            <p className="max-w-sm text-sm text-gray-500 line-clamp-2">
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
                                  setProjectToDelete(p.id);
                                }}
                                className="
                                  p-2
                                  rounded
                                  border
                                  hover:bg-red-100
                                  text-red-500
                                "
                              >
                                <Trash2 size={16} />
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
      <DeleteConfirmationModal
  open={!!projectToDelete}
  title="Delete project?"
  description="
    This action cannot be undone.
    The project will be permanently removed.
  "
  onCancel={() =>
    setProjectToDelete(null)
  }
  onConfirm={() => {
    deleteProject(projectToDelete);
    setProjectToDelete(null);
  }}
  confirmText="Delete project"
/>

<AdminActionDialog
  open={appealOpen}

  tone="warning"

  title="Submit Appeal"

  description="
  Explain why this project
  should be restored.
  "

  confirmLabel="Send Appeal"

  cancelLabel="Cancel"

  noteLabel="Appeal Message"

  notePlaceholder="
  Explain your appeal...
  "

  noteRequired

  noteValue={appealMessage}

  onNoteChange={
    setAppealMessage
  }

  onCancel={() =>
    setAppealOpen(false)
  }

  onConfirm={submitAppeal}
/>
    </DashboardLayout>
  );
}