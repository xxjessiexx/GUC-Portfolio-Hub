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

import { useEffect, useRef, useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef(null);
  const ITEMS_PER_PAGE = 12;
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

    const matchesDate = (() => {
      if (selectedDate === "Anytime") return true;

      const rawDate = project.date || project.createdAt || project.updatedAt;
      const projectDate = rawDate ? new Date(rawDate) : null;
      if (!projectDate || Number.isNaN(projectDate.getTime())) return false;

      const now = new Date();
      const cutoff = new Date(now);

      if (selectedDate === "This Week") {
        cutoff.setDate(now.getDate() - 7);
        return projectDate >= cutoff && projectDate <= now;
      }

      if (selectedDate === "This Month") {
        cutoff.setMonth(now.getMonth() - 1);
        return projectDate >= cutoff && projectDate <= now;
      }

      return true;
    })();

    return (
      matchesSearch &&
      matchesCourse &&
      matchesInstructor &&
      matchesDate
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      resultsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const getVisiblePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis-start",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-start",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };

  return (
    <DashboardLayout>

      {/* MAIN */}
      <main className="px-4 py-7 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">

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
            onSearchChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search projects by title, keyword, or technology..."
            showSort
            sortValue={`Sort by: ${selectedSort}`}
            onSortChange={(value) => {
              setSelectedSort(value.replace("Sort by: ", ""));
              setCurrentPage(1);
            }}
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
              setCurrentPage(1);
            }}
          >
            <FilterSelect
              value={`Course: ${selectedCourse}`}
              onChange={(value) => {
                setSelectedCourse(
                  value.replace("Course: ", "")
                );
                setCurrentPage(1);
              }}
              options={courseOptions}
            />

            <FilterSelect
              value={`Instructor: ${selectedInstructor}`}
              onChange={(value) => {
                setSelectedInstructor(
                  value.replace("Instructor: ", "")
                );
                setCurrentPage(1);
              }}
              options={instructorOptions}
            />

            <FilterSelect
              value={`Date: ${selectedDate}`}
              onChange={(value) => {
                setSelectedDate(
                  value.replace("Date: ", "")
                );
                setCurrentPage(1);
              }}
              options={[
                "Date: Anytime",
                "Date: This Week",
                "Date: This Month",
              ]}
            />
          </SearchFilterToolbar>
        {/* TOP BAR */}
        <div ref={resultsTopRef} className="flex scroll-mt-28 items-center justify-between">

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

          {paginatedProjects.map((project) => (
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

        {filteredProjects.length > ITEMS_PER_PAGE ? (
          <nav
            className="mt-8 flex flex-col gap-3 border-t border-[#355872]/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Project results pagination"
          >
            <p className="text-[12px] font-semibold text-[color:var(--muted)]">
              Showing {pageStartIndex + 1}–
              {Math.min(
                pageStartIndex + ITEMS_PER_PAGE,
                filteredProjects.length
              )} of {filteredProjects.length}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
              >
                Previous
              </button>

              {getVisiblePageNumbers().map((page) => {
                if (typeof page === "string") {
                  return (
                    <span
                      key={page}
                      className="inline-flex h-10 min-w-8 items-center justify-center px-1 text-[12px] font-black text-[#8A9AA4]"
                    >
                      …
                    </span>
                  );
                }

                const isActive = page === safeCurrentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] border px-3 text-[12px] font-black transition ${
                      isActive
                        ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)] dark:border-[#9CD5FF] dark:bg-[#9CD5FF] dark:text-[#071521]"
                        : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
              >
                Next
              </button>
            </div>
          </nav>
        ) : null}
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