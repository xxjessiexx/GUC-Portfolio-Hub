import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterPanel from "@/components/common/FilterPanel";
import FilterSelect from "@/components/common/FilterSelect";
import { AdminActionDialog }
from "@/components/adminModule/AdminActionDialog";
import Toast from "@/components/ui/toast";
import SideToast from "@/components/ui/SideToast";

/* IMPORT DATA */
import ProjectNameData from "@/data/ProjectNameData";

import {
  getAllProjects,
  toggleFavoriteProject,
} from "@/data/demoStore";
import {
  Search,
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import { useState,useEffect } from "react";

export default function ExploreProjects({showReport = false,}) {

  /* STATE */
  const getDisplayCourse = (project) => {
  const projectType = String(project.type || "").toLowerCase();

  const isBachelorProject =
    projectType.includes("bachelor") ||
    projectType.includes("thesis");

  return isBachelorProject
    ? "Bachelor Project"
    : (
        project.course ||
        project.courseName ||
        project.courseCode ||
        "Course Project"
      );
};

  const [reportOpen, setReportOpen] =
  useState(false);

const [selectedProject, setSelectedProject] =
  useState(null);

const [reportReason, setReportReason] =
  useState("");

  const [projects, setProjects] =
  useState(() => getAllProjects());

  useEffect(() => {

  const syncProjects = () => {

    const updatedReports =
      JSON.parse(
        localStorage.getItem(
          "reportedProjects"
        )
      ) || [];

    setReportedProjects(
      updatedReports
    );

    setProjects(
      getAllProjects()
    );
  };

  window.addEventListener(
    "storage",
    syncProjects
  );

  syncProjects();

  return () =>
    window.removeEventListener(
      "storage",
      syncProjects
    );

}, []);

  const [view, setView] = useState("grid");

  const [search, setSearch] = useState("");

  const [selectedCourse, setSelectedCourse] =
    useState("All Courses");

  const [selectedInstructor, setSelectedInstructor] =
    useState("All Instructors");

  const [selectedDate, setSelectedDate] =
    useState("Anytime");

  const [selectedSort, setSelectedSort] =
    useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notification, setNotification] =
  useState(null);

const [reportedProjects, setReportedProjects] =

  useState(() => {

    const saved =
      localStorage.getItem(
        "reportedProjects"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  const courseOptions = [
  "Course: All Courses",

  ...new Set(
    projects.map(
      (project) =>
        `Course: ${getDisplayCourse(project)}`
    )
  ),
];

const instructorOptions = [
  "Instructor: All Instructors",

  ...new Set(
    projects
      .map((project) => project.instructor)
      .filter(Boolean)
      .map(
        (instructor) =>
          `Instructor: ${instructor}`
      )
  ),
];

  /* FAVORITES */
  const toggleFavorite = (id) => {
  toggleFavoriteProject(id);

  setProjects(getAllProjects());
};
  /* FILTERS */
  const filteredProjects = projects

  .filter((project) => {

  const isReported =
    reportedProjects.some(
      (reported) =>
        reported.projectId === project.id
    );

  return !isReported;
})

  .filter((project) => {

    const matchesSearch =
  project.title
    ?.toLowerCase()
    .includes(search.toLowerCase()) ||

  project.tags?.some((tag) =>
    tag
      ?.toLowerCase()
      .includes(search.toLowerCase())
  ) ||

  project.technologies?.some((tech) =>
    tech
      ?.toLowerCase()
      .includes(search.toLowerCase())
  ) ||

  project.languages?.some((lang) =>
    lang
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

    const matchesCourse =
  selectedCourse === "All Courses" ||

  getDisplayCourse(project) === selectedCourse ||

  project.courseName === selectedCourse ||

  project.program === selectedCourse;

    const matchesInstructor =
  selectedInstructor ===
    "All Instructors" ||

  project.instructor
    ?.toLowerCase()
    .includes(
      selectedInstructor.toLowerCase()
    );

    const courseOptions = [
  "Course: All Courses",

  ...new Set(
    projects.map(
      (project) => `Course: ${getDisplayCourse(project)}`
    )
  ),
];

    return (
      matchesSearch &&
      matchesCourse &&
      matchesInstructor
    );
  })

  .sort((a, b) => {

  /* NEWEST */
  if (selectedSort === "Newest") {
    return new Date(b.date) - new Date(a.date);
  }

  /* OLDEST */
  if (selectedSort === "Oldest") {
    return new Date(a.date) - new Date(b.date);
  }

  /* A-Z */
  if (selectedSort === "A-Z") {
    return a.title.localeCompare(b.title);
  }

  /* HIGHEST RATED */
  if (selectedSort === "Highest Rated") {
    return b.rating - a.rating;
  }

  return 0;
});

  return (
    <DashboardLayout>

      {/* MAIN */}
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
           <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Explore Projects
          </h1>

           <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Discover projects created by GUC students.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        
          <SearchFilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search projects by title, keyword, or technology..."
            showSort
            sortValue={`Sort by: ${selectedSort}`}
            onSortChange={(value) =>
              setSelectedSort(value.replace("Sort by: ", ""))
            }
            sortOptions={[
              "Sort by: Newest",
              "Sort by: Oldest",
              "Sort by: Highest Rated",
              "Sort by: A-Z",
            ]}
            showFilters
            filtersOpen={filtersOpen}
            onToggleFilters={() =>
              setFiltersOpen((current) => !current)
            }
            filterTitle="Filter projects"
            onClearFilters={() => {
              setSelectedCourse("All Courses");
              setSelectedInstructor("All Instructors");
              setSelectedDate("Anytime");
            }}
          >
            <FilterSelect
              value={`Course: ${selectedCourse}`}
              onChange={(value) =>
                setSelectedCourse(
                  value.replace("Course: ", "")
                )
              }
              options={courseOptions}
            />

            <FilterSelect
              value={`Instructor: ${selectedInstructor}`}
              onChange={(value) =>
                setSelectedInstructor(
                  value.replace("Instructor: ", "")
                )
              }
              options={instructorOptions}
            />

            <FilterSelect
              value={`Date: ${selectedDate}`}
              onChange={(value) =>
                setSelectedDate(
                  value.replace("Date: ", "")
                )
              }
              options={[
                "Date: Anytime",
                "Date: This Week",
                "Date: This Month",
              ]}
            />
          </SearchFilterToolbar>
        {/* TOP BAR */}
        <div className="flex items-center justify-between">

          <h2 className="font-bold text-[var(--ink)]">
            {filteredProjects.length} projects found
          </h2>

          {/* VIEW BUTTONS */}
          {/* VIEW BUTTONS */}
<div
  className="
    flex
    gap-2
    p-1
    rounded-2xl

    bg-[var(--card-bg)]
    border border-[var(--card-border)]
  "
>

  <button
    onClick={() => setView("grid")}
    className={`
      p-3
      rounded-xl
      transition-all
      duration-300

      ${
        view === "grid"
          ? `
            bg-[var(--surface-elevated)]
            text-[var(--primary)]
            border
            border-[var(--primary)]
            shadow-[var(--shadow-soft)]
          `
          : `
            bg-transparent
            text-[var(--muted)]
            hover:bg-[var(--surface-soft)]
            hover:text-[var(--primary)]
          `
      }
    `}
  >
    <Grid2X2 size={18} />
  </button>

  <button
    onClick={() => setView("list")}
    className={`
      p-3
      rounded-xl
      transition-all
      duration-300

      ${
        view === "list"
          ? `
            bg-[var(--surface-elevated)]
            text-[var(--primary)]
            border
            border-[var(--primary)]
            shadow-[var(--shadow-soft)]
          `
          : `
            bg-transparent
            text-[var(--muted)]
            hover:bg-[var(--surface-soft)]
            hover:text-[var(--primary)]
          `
      }
    `}
  >
    <List size={18} />
  </button>

</div>
        </div>

        {/* PROJECTS */}
        <div
          className={
            view === "grid"
              ? `
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-5
              `
              : "flex flex-col gap-5"
          }
        >

          {filteredProjects.map((project) => (
            <ExploreProjectCard
            key={project.id}
            project={{
            ...project,
            reported:
  reportedProjects.some(
    (reported) =>
      reported.projectId === project.id
  )
          }}
            view={view}
            toggleFavorite={toggleFavorite}
            showReport={showReport}
           onReport={(project) => {
          setSelectedProject(project);
          setReportOpen(true);
        }}
          />
          ))}

        </div>
      </div>

      <AdminActionDialog
  open={reportOpen}
  dialogClassName="[&>div]:!bg-[#F8FAFC] [&>div]:!backdrop-blur-none dark:[&>div]:!bg-[#0A1926]"
  title="Report Project"
  description="
    Please provide a reason for reporting
    this project.
  "
  confirmLabel="Submit Report"
  cancelLabel="Cancel"
  tone="danger"
  noteLabel="Report Description"
  notePlaceholder="
    Explain why this project should
    be reviewed...
  "
  noteRequired
  noteValue={reportReason}
  onNoteChange={setReportReason}
  onCancel={() => {
    setReportOpen(false);
    setReportReason("");
    setSelectedProject(null);
  }}
  onConfirm={() => {

  const updatedArray = [
  ...reportedProjects,

  {
    projectId: selectedProject.id,

    ownerId: selectedProject.ownerId
  },
];

  setReportedProjects(updatedArray);

  localStorage.setItem(
    "reportedProjects",
    JSON.stringify(updatedArray)
  );

  /* SAVE FLAGGED PROJECT */

  const savedFlags =
    JSON.parse(
      localStorage.getItem(
        "flaggedProjects"
      )
    ) || [];

  const newFlaggedProject = {
  id: selectedProject.id,

  title: selectedProject.title,

  student:
    selectedProject.students ||
    selectedProject.instructor ||
    "Unknown",

  course: selectedProject.course,

  reason: reportReason,

  flaggedBy: "Instructor Review",

  status: "flagged",

  active: false,

  appealStatus: null,
};

  localStorage.setItem(
    "flaggedProjects",
    JSON.stringify([
      ...savedFlags,
      newFlaggedProject,
    ])
  );

  /* TOAST */

  setNotification({
    title: "Project reported",
    text:
      "Your report has been submitted successfully for review.",
    time: "Just now",
  });

  setReportOpen(false);

  setReportReason("");

  setSelectedProject(null);

  setTimeout(() => {
    setNotification(null);
  }, 3000);
}}
/>
<SideToast
  open={!!notification}
  title={notification?.title}
  description={notification?.text}
/>
</main>
    </DashboardLayout>
  );
}