import { useMemo, useState } from "react";
import { Grid2X2, List } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import SideToast from "@/components/ui/SideToast";

import {
  getAllProjects,
  getCurrentUser,
  getDemoDb,
  getLinkedCourseIdsForInstructor,
  toggleFavoriteProject,
} from "@/data/demoStore";

function readJsonStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function uniqueOptions(values) {
  return [...new Set(values.filter(Boolean))];
}
function getDisplayCourse(project) {
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
}

function getProjectSearchText(project) {
  return [
    project.title,
    getDisplayCourse(project),
    project.instructor,
    ...(project.tags || []),
    ...(project.technologies || []),
    ...(project.languages || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function InstructorProjects() {
  const currentUser = getCurrentUser();
  const instructorId = currentUser?.id;

  const [projects, setProjects] = useState(() =>
    getAllProjects({ includePrivate: true })
  );

  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedDate, setSelectedDate] = useState("Anytime");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [notification, setNotification] = useState(null);

  const [reportedProjects, setReportedProjects] = useState(() =>
    readJsonStorage("reportedProjects", [])
  );

  const instructorScope = useMemo(() => {
    const db = getDemoDb();

    const linkedCourseIds = new Set(
      getLinkedCourseIdsForInstructor(instructorId).map(String)
    );

    const linkedCourses = (db.courses || []).filter((course) =>
      linkedCourseIds.has(String(course.id))
    );

    const linkedProjectIds = new Set(
      linkedCourses
        .flatMap((course) => course.linkedProjectIds || [])
        .map(String)
    );

    return {
      linkedCourseIds,
      linkedProjectIds,
      linkedCourses,
    };
  }, [instructorId]);

  const instructorProjects = useMemo(() => {
    return projects.filter((project) => {
      const projectCourseId = String(
        project.courseId || project.courseRecord?.id || ""
      );

      const projectId = String(project.id || "");

      return (
        instructorScope.linkedCourseIds.has(projectCourseId) ||
        instructorScope.linkedProjectIds.has(projectId)
      );
    });
  }, [projects, instructorScope]);

  const courseOptions = useMemo(
    () => [
      "Course: All Courses",
      ...uniqueOptions(
        instructorProjects.map(
          (project) => getDisplayCourse(project)
        )
      ).map((course) => `Course: ${course}`),
    ],
    [instructorProjects]
  );

  const filteredProjects = useMemo(() => {
    return instructorProjects
      .filter((project) => !reportedProjects.includes(project.id))
      .filter((project) => {
        const searchText = getProjectSearchText(project);

        const matchesSearch = searchText.includes(search.toLowerCase());

        const matchesCourse =
          selectedCourse === "All Courses" ||
          getDisplayCourse(project) === selectedCourse ||
          project.program === selectedCourse;

        const createdAt = project.createdAt ? new Date(project.createdAt) : null;
        const now = new Date();

        const daysOld = createdAt
          ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
          : null;

        const matchesDate =
          selectedDate === "Anytime" ||
          (selectedDate === "This Week" && daysOld !== null && daysOld <= 7) ||
          (selectedDate === "This Month" && daysOld !== null && daysOld <= 31);

        return matchesSearch && matchesCourse && matchesDate;
      })
      .sort((a, b) => {
        if (selectedSort === "Newest") {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        }

        if (selectedSort === "Oldest") {
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        }

        if (selectedSort === "A-Z") {
          return String(a.title || "").localeCompare(String(b.title || ""));
        }

        if (selectedSort === "Highest Rated") {
          return Number(b.rating || 0) - Number(a.rating || 0);
        }

        return 0;
      });
  }, [
    instructorProjects,
    reportedProjects,
    search,
    selectedCourse,
    selectedDate,
    selectedSort,
  ]);

  const toggleFavorite = (id) => {
    toggleFavoriteProject(id);
    setProjects(getAllProjects({ includePrivate: true }));
  };

  const handleConfirmReport = () => {
    if (!selectedProject || !reportReason.trim()) return;

    const updatedReportedProjects = [
      ...new Set([...reportedProjects, selectedProject.id]),
    ];

    setReportedProjects(updatedReportedProjects);

    localStorage.setItem(
      "reportedProjects",
      JSON.stringify(updatedReportedProjects)
    );

    const savedFlags = readJsonStorage("flaggedProjects", []);

    const flaggedProject = {
      id: selectedProject.id,
      title: selectedProject.title,
      student:
        selectedProject.owner?.name ||
        selectedProject.student?.name ||
        "Unknown student",
      course: getDisplayCourse(selectedProject),
      reason: reportReason.trim(),
      flaggedBy: currentUser?.name || "Instructor Review",
      flaggedById: currentUser?.id || instructorId,
      status: "flagged",
      active: false,
      createdAt: new Date().toISOString(),
    };

    const updatedFlags = [
      flaggedProject,
      ...savedFlags.filter((project) => project.id !== selectedProject.id),
    ];

    localStorage.setItem("flaggedProjects", JSON.stringify(updatedFlags));

    setNotification({
      title: "Project reported",
      text: "This project was sent to the admin flagged-projects review list.",
    });

    setReportOpen(false);
    setReportReason("");
    setSelectedProject(null);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <DashboardLayout workspace="instructor">
      <div className="min-h-screen p-8 space-y-6">
         <div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Course Projects
          </h1>

          <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Review and flag only the student projects attached to your linked courses.
          </p>
        </div>

          <div className="rounded-3xl border border-white/70 bg-[image:var(--gradient-brand)] px-5 py-4 text-sm font-bold text-white shadow-[0_18px_48px_rgba(53,88,114,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-none dark:bg-white/[0.06] dark:text-slate-300">
  <span className="text-white dark:text-[#9CD5FF]">
    {instructorScope.linkedCourses.length}
  </span>{" "}
  linked courses ·{" "}
  <span className="text-white dark:text-[#9CD5FF]">
    {instructorProjects.length}
  </span>{" "}
  visible projects
</div>
        

        <SearchFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search your course projects by title, keyword, or technology..."
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
          onToggleFilters={() => setFiltersOpen((current) => !current)}
          filterTitle="Filter course projects"
          onClearFilters={() => {
            setSelectedCourse("All Courses");
            setSelectedDate("Anytime");
          }}
        >
          <FilterSelect
            value={`Course: ${selectedCourse}`}
            onChange={(value) =>
              setSelectedCourse(value.replace("Course: ", ""))
            }
            options={courseOptions}
          />

          <FilterSelect
            value={`Date: ${selectedDate}`}
            onChange={(value) => setSelectedDate(value.replace("Date: ", ""))}
            options={["Date: Anytime", "Date: This Week", "Date: This Month"]}
          />
        </SearchFilterToolbar>

        <div className="flex items-center justify-between">
          <h2 className="font-black text-[#16253A] ">
            {filteredProjects.length} projects found
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`rounded-xl border p-3 transition dark:border-white/10 ${
                view === "grid"
                  ? "bg-[#2C4E80] text-white dark:bg-[#9CD5FF]/20 dark:text-[#DDF3FF]"
                  : "bg-white text-[#16253A] dark:bg-white/[0.06] dark:text-slate-200"
              }`}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`rounded-xl border p-3 transition dark:border-white/10 ${
                view === "list"
                  ? "bg-[#2C4E80] text-white dark:bg-[#9CD5FF]/20 dark:text-[#DDF3FF]"
                  : "bg-white text-[#16253A] dark:bg-white/[0.06] dark:text-slate-200"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {filteredProjects.length ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-5"
            }
          >
            {filteredProjects.map((project) => (
              <ExploreProjectCard
                key={project.id}
                project={{
                  ...project,
                  reported: reportedProjects.includes(project.id),
                }}
                view={view}
                toggleFavorite={toggleFavorite}
                showReport
                onReport={(projectToReport) => {
                  setSelectedProject(projectToReport);
                  setReportOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[color:var(--border-blue)] bg-white/70 p-10 text-center shadow-[0_18px_55px_rgba(53,88,114,0.08)] dark:border-white/10 dark:bg-white/[0.05]">
            <h3 className="text-2xl font-black text-[#16253A] dark:text-white">
              No projects in your course scope
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-gray-600 dark:text-slate-300">
              You will only see projects connected to courses linked to your
              instructor account. Try clearing the filters or linking to the
              needed course first.
            </p>
          </div>
        )}
      </div>

      <AdminActionDialog
        open={reportOpen}
        title="Report Project"
        description="Please provide a reason for reporting this project. The report will be sent to the admin review list."
        confirmLabel="Submit Report"
        cancelLabel="Cancel"
        tone="danger"
        noteLabel="Report Description"
        notePlaceholder="Explain why this project should be reviewed..."
        noteRequired
        noteValue={reportReason}
        onNoteChange={setReportReason}
        onCancel={() => {
          setReportOpen(false);
          setReportReason("");
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmReport}
      />

      <SideToast
        open={!!notification}
        title={notification?.title}
        description={notification?.text}
      />
    </DashboardLayout>
  );
}