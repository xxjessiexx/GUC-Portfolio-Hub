import { useEffect, useState } from "react";
import { AppCard } from "../components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import AppSelect from "@/components/common/AppSelect";
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

import { Pencil, Trash2 } from "lucide-react";
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
  project.title || project.name || "Untitled Project";

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

  const courseOptions = [
  "Course: All",
  ...Array.from(
    new Set(
      projects.map((project) =>
        getProjectCourse(project, courses)
      )
    )
  ).map((course) => `Course: ${course}`),
];


  const filteredProjects = projects
  .filter((p) => {
    const name = getProjectName(p);
    const course = getProjectCourse(p, courses);
    const visibility = normalizeVisibility(p.visibility);


  
    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCourse =
      filterCourse === "All"
        ? true
        : filterCourse === "Bachelor Project"
        ? course === "Bachelor Project"
        : course
            .toUpperCase()
            .includes(filterCourse.toUpperCase());

    const matchesVisibility =
      filterVisibility === "All" ||
      visibility === filterVisibility;

      
    return (
      matchesSearch &&
      matchesCourse &&
      matchesVisibility
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
    String(project.id) === String(selectedAppealProject.id)
      ? {
          ...project,
          appealStatus: "pending",
          status: "under-review",
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
    String(project.id) === String(selectedAppealProject.id)
      ? {
          ...project,
          appealStatus: "pending",
          status: "under-review",
        }
      : project
  )
);

setAppealOpen(false);

setAppealMessage("");
};

  return (
    <DashboardLayout>
       <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
  className="
    [&_h2]:mt-3
    [&_h2]:text-4xl
    [&_h2]:font-black
    [&_h2]:tracking-tight
    [&_h2]:text-[color:var(--ink)]
    sm:[&_h2]:text-5xl

    [&_p]:mt-3
    [&_p]:text-base
    [&_p]:font-semibold
    [&_p]:text-[color:var(--muted)]
  "
  title="My Projects"
  subtitle="Manage, edit, and organize your projects."
  action={
            <div className="-m-2">
              <span
                onClick={() => navigate("/create-project")}
                className="inline-flex items-center rounded-2xl px-9 py-3 text-white font-semibold 
                bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)]
hover:bg-[linear-gradient(135deg,#355872_0%,#46739A_55%,#8CC3EA_100%)] shadow-md hover:bg-[#243f69] transition-all cursor-pointer  hover:-translate-y-1
      hover:scale-[1.02]
      hover:brightness-110
      hover:shadow-[0_24px_50px_rgba(53,88,114,.35)]  shadow-[0_12px_30px_rgba(53,88,114,.22)]

      transition-all
      duration-300
      ease-out
      hover:shadow-[0_20px_40px_rgba(53,88,114,.30),0_10px_45px_rgba(122,170,206,.35)] hover:bg-[linear-gradient(135deg,#1F2E3C_0%,#2D4B63_55%,#4F7EA4_100%)]"
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
    setFilterCourse(value.replace("Course: ", ""))
  }
  options={courseOptions}
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
          text-[var(--ink)]
          shadow-[var(--shadow-soft)]
        "
      >
        Flagged Projects
      </Label>

      <div
        className="
          w-7 h-7
          rounded-full
          border border-red-500/20
bg-red-500/10
text-red-400
hover:bg-red-500/20
dark:bg-[rgba(239,68,68,0.18)]
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
            
            rounded-3xl
            
            px-5 py-4
            flex items-center
            justify-between
            gap-6
            
            transition
            cursor-pointer
            bg-[var(--card-bg)]
border border-[var(--card-border)]
hover:bg-[var(--surface-elevated)]
transition-colors
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
                  text-[var(--ink)]
                  truncate
                "
              >
                {getProjectName(p)}
              </h3>

              <p
                className="
                  text-[var(--primary)]
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
                  text-[var(--primary)]
                  text-sm
                "
              >

                <div className="flex items-center gap-1 text-[var(--muted)]0">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-8 0v2m8 0H9"
    />
  </svg>

  <span>
    {p.instructor || "Instructor"}
  </span>
</div>

<div className="flex items-center gap-1 text-[var(--muted)]">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87m8-6a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>

  <span>
    {p.students || 0} Students
  </span>

</div>

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

  const projectAppeals =
  savedAppeals.filter(
    (appeal) =>
      appeal.projectId === p.id
  );

const latestAppeal =
  projectAppeals[
    projectAppeals.length - 1
  ];

const flagged =
  JSON.parse(
    localStorage.getItem(
      "flaggedProjects"
    )
  ) || [];

const currentFlag =
  flagged.find(
    (project) =>
      String(project.id) ===
      String(p.id)
  );

const appealStatus =
  currentFlag?.appealStatus;
  
return (

    <button
      onClick={(event) => {

        event.stopPropagation();

        if (
  appealStatus === "pending" ||
  appealStatus === "accepted" ||
  appealStatus === "rejected"
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
    appealStatus === "pending"

      ? `
        bg-orange-100
        text-orange-500
      `

      : appealStatus === "rejected"

      ? `
        border border-red-500/20
bg-red-500/10
text-red-400
hover:bg-red-500/20
dark:bg-[rgba(239,68,68,0.18)]
      `

      : `
       border border-red-500/20
bg-red-500/10
text-red-400
hover:bg-red-500/20
dark:bg-[rgba(239,68,68,0.18)]
        hover:bg-red-200
      `
  }
`}
    >

     {
  appealStatus === "pending"

    ? "Reviewing Appeal"

    : appealStatus === "rejected"

    ? "Appeal Rejected"

    : "Send Appeal"
}

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
        


          <AppCard
className="
p-6
bg-[var(--card-bg)]
border
border-[var(--card-border)]
shadow-[var(--shadow-card)]
rounded-[28px]
"
>
          <div className="flex items-center gap-3 mb-4 ml-3">

  <Label

    className="
      text-xl
      font-black
      text-[var(--ink)]
    "
  >
    All My Projects
  </Label>

  <div
    className="
      w-7 h-7
      rounded-full
     bg-[var(--project-badge-bg)]
text-[var(--project-badge-text)]
border border-[var(--project-badge-border)]
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
              <h3 className="text-lg font-bold text-[var(--ink)]">
                No projects found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create a project or adjust your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[3.7fr_1.3fr_1.3fr_1.7fr_1.6fr_1fr] px-10 py-3 text-xs font-semibold text-[var(--muted)] uppercase">
                <span className="pl-12">Project</span>

                <span className="-ml-14">Updated</span>

                <span className="-ml-6">Portfolio Visibility</span>

                

                <div className="flex justify-center">
  <span>Rating / Comments</span>
</div>

                <span className="pl-16">Actions</span>
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
  className="
    font-bold
    text-[16px]
    text-[var(--project-blue-title)]
    max-w-md
    truncate
    leading-none
    cursor-pointer
    transition-colors
    duration-200
    hover:text-[#90CAF9]
  "
>
  {getProjectName(p)}
</h3>

                            <p className="mt-1
    text-sm
    font-semibold
    text-[var(--project-blue)]">
                              {getProjectCourse(p, courses)}
                            </p>

                            <p className="max-w-sm text-sm text-[var(--muted)] line-clamp-2">
                              {getProjectDescription(p)}
                            </p>
                          </div>
                        }
                        middle={
  <>
    {/* Visibility column */}
    <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
      <div className="w-[150px]">
        <AppSelect
          value={visibility}
          onChange={(value) => toggleVisibility(p.id, value)}
          options={[
            { value: "Public", label: "Public" },
            { value: "Private", label: "Private" },
          ]}
          placeholder="Visibility"
          className="h-10 text-xs font-bold"
        />
      </div>
    </div>

    {/* Rating column */}
    <div className="w-full flex flex-col items-center justify-center text-sm text-[var(--muted)]">
  <div className="flex items-center gap-1">
    <span className="font-medium">
      {getProjectRating(p)}
    </span>

    <span className="text-yellow-400">★</span>
  </div>

  <span className="mt-1">
    {getProjectComments(p)} comments
  </span>
</div>
  </>

  
}
                       right={
  <div className="flex justify-center gap-2 ml-4
  ">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                editProject(p.id);
                              }}
                              className="p-2 rounded border border-[var(--card-border)]
text-[var(--muted)]
hover:bg-[var(--surface-soft)]"
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
                                 border border-red-500/20
bg-red-500/10
text-red-400
hover:bg-red-500/20
dark:bg-[rgba(239,68,68,0.18)]
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
</main>
    </DashboardLayout>
  );
}