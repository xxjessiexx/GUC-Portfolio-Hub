import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronDown,
  Code2,
  Edit3,
  Eye,
  Lock,
  Star,
  Trash2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import {
  getCurrentUser,
  getProjectsForUser,
  getCollection,
  updateProject,
  deleteProject as deleteProjectFromStore,
} from "@/data/demoStore";

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

  if (isBachelorProject) return "Bachelor Project";
  if (project.course) return project.course;
  if (project.courseCode) return project.courseCode;
  if (project.courseName) return project.courseName;

  const course = courses.find((item) => item.id === project.courseId);

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

  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
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

const getProjectTechnologies = (project) => {
  const values =
    project.technologies ||
    project.techStack ||
    project.skills ||
    project.tags ||
    [];

  if (Array.isArray(values)) return values;

  if (typeof values === "string") {
    return values
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getProjectCollaborators = (project) => {
  if (Array.isArray(project.collaborators)) return project.collaborators.length;
  if (typeof project.collaborators === "number") return project.collaborators;
  if (typeof project.students === "number") return project.students;
  return 0;
};

const getProjectInstructors = (project) => {
  if (Array.isArray(project.instructors)) return project.instructors.length;
  if (typeof project.instructors === "number") return project.instructors;
  if (project.instructor) return 1;
  return 0;
};

const getProjectType = (project) => {
  const text = String(project.type || "").trim();

  if (!text) return "Course Project";

  if (
    text.toLowerCase().includes("bachelor") ||
    text.toLowerCase().includes("thesis")
  ) {
    return "Bachelor Project";
  }

  return text;
};

function ScoreBadge({ rating }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(230,199,123,0.22)] px-3 py-1.5 text-xs font-black text-[#B89736] dark:bg-[rgba(230,199,123,0.18)] dark:text-[#E6C77B]">
      <Star className="h-3.5 w-3.5 fill-current" />
      Instructor Score {rating}
    </span>
  );
}

function TechTag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#355872]/20 bg-[#355872] px-3 py-1.5 text-xs font-black text-white shadow-[0_8px_18px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-[#9CD5FF] dark:text-[#071521]">
      {children}
    </span>
  );
}

function MiniMetric({ label, value, tone = "soft" }) {
  const styles = {
    blue:
      "border-[#355872]/12 bg-[#355872]/8 text-[#355872] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF]",
    gold:
      "border-[#B89736]/20 bg-[#E6C77B]/14 text-[#B89736] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#E6C77B]",
    navy:
      "border-[#355872]/12 bg-white/70 text-[#355872] dark:border-white/10 dark:bg-white/[0.04] dark:text-white",
    soft:
      "border-[#355872]/10 bg-white/75 text-[color:var(--muted)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70",
  };

  return (
    <div className={`rounded-[1rem] border px-3 py-2.5 ${styles[tone]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.12em] opacity-80">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-[color:var(--ink)]">
        {value}
      </p>
    </div>
  );
}

function VisibilityControl({ project, onChange }) {
  const visibility = normalizeVisibility(project.visibility);
  const isPublic = visibility === "Public";

  return (
    <div
      className="relative z-20 w-fit"
      onClick={(event) => event.stopPropagation()}
    >
      <select
        value={visibility}
        onChange={(event) => onChange(project.id, event.target.value)}
        className={`h-8 appearance-none rounded-full border px-8 pl-9 text-xs font-black outline-none backdrop-blur-md transition ${
          isPublic
            ? "border-white/10 bg-white/10 text-[#9CD5FF] hover:bg-white/15"
            : "border-white/15 bg-white/10 text-white/80 hover:bg-white/15"
        }`}
      >
        <option className="text-slate-900" value="Public">
          Public
        </option>
        <option className="text-slate-900" value="Private">
          Private
        </option>
      </select>

      {isPublic ? (
        <Eye className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CD5FF]" />
      ) : (
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/75" />
      )}

      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60" />
    </div>
  );
}

function ProjectVisual({
  project,
  onVisibilityChange,
}) {
  return (
    <div className="relative min-h-[220px] overflow-hidden bg-[#071C2C] dark:bg-[#071521]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(122,170,206,0.18),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(230,199,123,0.08),transparent_34%)]" />

      <div className="absolute left-4 top-4 z-10">
        <VisibilityControl
          project={project}
          onChange={onVisibilityChange}
        />
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
          {getProjectType(project)}
        </p>

        <h3 className="mt-2 line-clamp-3 text-[1.65rem] font-black leading-tight text-white">
          {getProjectName(project)}
        </h3>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  courses,
  onOpen,
  onEdit,
  onDelete,
  onVisibilityChange,
}) {
  const technologies = getProjectTechnologies(project);
  const visibleTech = technologies.slice(0, 4);
  const remaining = technologies.length - visibleTech.length;

  return (
    <article
      onClick={() => onOpen(project.id)}
      className="group cursor-pointer overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/74 shadow-[0_18px_44px_rgba(53,88,114,0.09)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_24px_52px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-white/[0.045]"
    >
      <div className="grid min-h-[220px] lg:grid-cols-[260px_1fr]">
        <ProjectVisual
          project={project}
          onVisibilityChange={onVisibilityChange}
        />

        <div className="flex h-full flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-black text-[color:var(--ink)]">
                {getProjectCourse(project, courses)}
              </p>

              <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
                {project.status || "Active"} • Updated{" "}
                {getProjectUpdated(project)}
              </p>
            </div>

            <ScoreBadge rating={getProjectRating(project)} />
          </div>

          <div className="mt-4 px-1 py-1">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#355872] dark:text-[#9CD5FF]">
              Project Summary
            </p>

            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-6 text-[color:var(--muted)]">
              {getProjectDescription(project)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#355872] dark:text-[#9CD5FF]">
                <Code2 className="h-3.5 w-3.5" />
                Tech
              </span>

              {visibleTech.length > 0 ? (
                <>
                  {visibleTech.map((technology) => (
                    <TechTag key={technology}>{technology}</TechTag>
                  ))}

                  {remaining > 0 ? <TechTag>+{remaining}</TechTag> : null}
                </>
              ) : (
                <span className="text-xs font-semibold text-[color:var(--muted)]">
                  No technologies added
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <MiniMetric
              label="Collaborators"
              value={getProjectCollaborators(project)}
              tone="blue"
            />
            <MiniMetric
              label="Instructors"
              value={getProjectInstructors(project)}
              tone="gold"
            />
            <MiniMetric
              label="Comments"
              value={getProjectComments(project)}
              tone="navy"
            />
            <MiniMetric
              label="Updated"
              value={getProjectUpdated(project)}
              tone="soft"
            />
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen(project.id);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#355872]/15 bg-white/80 px-4 text-xs font-black text-[#355872] transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-[#9CD5FF] dark:hover:bg-white/[0.1]"
            >
              <Eye className="h-4 w-4" />
              View Project
            </button>

            <div className="flex items-center gap-2">
       <button
  type="button"
  onClick={(event) => {
    event.stopPropagation();
    onEdit(project.id);
  }}
  className="
    inline-flex h-10 items-center justify-center gap-2
    rounded-full
    border border-[#355872]/15
    bg-[#355872]/8
    px-4
    text-xs font-black
    text-[#355872]
    transition-all duration-200
    hover:-translate-y-0.5
    hover:bg-[#355872]/12
    hover:shadow-[0_10px_24px_rgba(53,88,114,.12)]
  "
>
  <Edit3 className="h-4 w-4" />
  Edit
</button>

              <button
  type="button"
  onClick={(event) => {
    event.stopPropagation();
    onDelete(project.id);
  }}
  className="
    inline-flex h-10 items-center justify-center gap-2
    rounded-full
    border border-red-200/80
    bg-red-50/80
    px-4
    text-xs font-black
    text-red-500
    transition-all duration-200
    hover:-translate-y-0.5
    hover:bg-red-100
    hover:shadow-[0_10px_24px_rgba(239,68,68,.10)]
  "
>
  <Trash2 className="h-4 w-4" />
  Delete
</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function FlaggedProjectRow({
  project,
  courses,
  appealStatus,
  onOpen,
  onAppeal,
  onDelete,
}) {
  return (
    <div
      onClick={() => onOpen(project.id)}
      className="group cursor-pointer overflow-hidden rounded-[1.45rem] border border-red-500/10 bg-white/62 shadow-[0_12px_30px_rgba(53,88,114,0.06)] transition hover:-translate-y-0.5 hover:bg-white/78 dark:border-red-300/10 dark:bg-white/[0.035]"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400">
            Moderation review
          </p>

          <h3 className="mt-1 truncate text-lg font-black text-[color:var(--ink)]">
            {getProjectName(project)}
          </h3>

          <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
            {getProjectCourse(project, courses)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={["pending", "accepted", "rejected"].includes(
              appealStatus
            )}
            onClick={(event) => {
              event.stopPropagation();
              onAppeal(project, appealStatus);
            }}
            className={`h-10 rounded-full px-4 text-xs font-black transition ${
              appealStatus === "pending"
                ? "cursor-default bg-orange-100 text-orange-500"
                : appealStatus === "accepted"
                ? "cursor-default bg-emerald-100 text-emerald-700"
                : appealStatus === "rejected"
                ? "cursor-default bg-red-100 text-red-500"
                : "border border-red-500/15 bg-red-500/8 text-red-500 hover:bg-red-500/12"
            }`}
          >
            {appealStatus === "pending"
              ? "Reviewing Appeal"
              : appealStatus === "accepted"
              ? "Appeal Accepted"
              : appealStatus === "rejected"
              ? "Appeal Rejected"
              : "Send Appeal"}
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(project.id);
            }}
            className="grid h-10 w-10 place-items-center rounded-full border border-red-500/15 bg-red-500/8 text-red-500 transition hover:bg-red-500/12"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewAllProjects() {
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All");
  const [sortBy, setSortBy] = useState("Updated");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState(null);

  const [appealOpen, setAppealOpen] = useState(false);
  const [selectedAppealProject, setSelectedAppealProject] = useState(null);
  const [appealMessage, setAppealMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const reportedProjects =
    JSON.parse(localStorage.getItem("reportedProjects")) || [];

  const refreshProjects = () => {
    const user = getCurrentUser();

    if (!user?.id) {
      setProjects([]);
      setCourses([]);
      return;
    }

    setProjects(getProjectsForUser(user.id) || []);
    setCourses(getCollection("courses") || []);
  };

  useEffect(() => {
    refreshProjects();

    const handleStoreChange = () => refreshProjects();
    window.addEventListener("demo-db-change", handleStoreChange);

    return () => {
      window.removeEventListener("demo-db-change", handleStoreChange);
    };
  }, []);

  const deleteProject = (id) => {
    deleteProjectFromStore(id);
    refreshProjects();
  };

  const courseOptions = [
    "Course: All",
    ...Array.from(
      new Set(
        projects.map((project) => getProjectCourse(project, courses))
      )
    ).map((course) => `Course: ${course}`),
  ];

  const filteredProjects = projects
    .filter((project) => {
      const name = getProjectName(project);
      const description = getProjectDescription(project);
      const course = getProjectCourse(project, courses);
      const visibility = normalizeVisibility(project.visibility);

      const searchText = `${name} ${description} ${course} ${getProjectTechnologies(
        project
      ).join(" ")}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesCourse =
        filterCourse === "All"
          ? true
          : filterCourse === "Bachelor Project"
          ? course === "Bachelor Project"
          : course.toUpperCase().includes(filterCourse.toUpperCase());

      const matchesVisibility =
        filterVisibility === "All" || visibility === filterVisibility;

      return matchesSearch && matchesCourse && matchesVisibility;
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

  const flaggedProjects = projects.filter((project) =>
    reportedProjects.some(
      (reported) =>
        String(reported.projectId) === String(project.id) &&
        String(reported.ownerId) === String(currentUser?.id)
    )
  );

  const toggleVisibility = (id, value) => {
    updateProject(id, {
      visibility: String(value).toLowerCase(),
      updatedAt: new Date().toISOString(),
    });

    refreshProjects();
  };

  const openProject = (id) => {
    const projectIds = filteredProjects.map((project) => String(project.id));

    navigate(`/project?projectId=${encodeURIComponent(id)}`, {
      state: {
        projectFlow: {
          originPath: `${location.pathname}${location.search}`,
          originLabel: "My Projects",
          projectIds,
        },
      },
    });
  };

  const editProject = (id) => {
    navigate(`/edit-project/${id}`);
  };

  const getAppealStatus = (project) => {
    const flagged =
      JSON.parse(localStorage.getItem("flaggedProjects")) || [];

    return flagged.find(
      (item) => String(item.id) === String(project.id)
    )?.appealStatus;
  };

  const openAppeal = (project, appealStatus) => {
    if (["pending", "accepted", "rejected"].includes(appealStatus)) {
      return;
    }

    setSelectedAppealProject(project);
    setAppealOpen(true);
  };

  const submitAppeal = () => {
    if (!appealMessage.trim() || !selectedAppealProject || !currentUser?.id) {
      return;
    }

    const savedAppeals =
      JSON.parse(localStorage.getItem("projectAppeals")) || [];

    const updatedAppeals = [
      ...savedAppeals,
      {
        id: Date.now(),
        projectId: selectedAppealProject.id,
        studentId: currentUser.id,
        student: currentUser.name,
        message: appealMessage,
        submittedAt: new Date().toLocaleString(),
        status: "pending",
      },
    ];

    localStorage.setItem(
      "projectAppeals",
      JSON.stringify(updatedAppeals)
    );

    const flagged =
      JSON.parse(localStorage.getItem("flaggedProjects")) || [];

    const updatedFlags = flagged.map((project) =>
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

    setProjects((previous) =>
      previous.map((project) =>
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
    setSelectedAppealProject(null);
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
              <button
                type="button"
                onClick={() => navigate("/create-project")}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-8 text-sm font-black text-white shadow-[0_12px_30px_rgba(53,88,114,.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-[linear-gradient(135deg,#1F2E3C_0%,#2D4B63_55%,#4F7EA4_100%)] hover:shadow-[0_20px_40px_rgba(53,88,114,.30),0_10px_45px_rgba(122,170,206,.35)]"
              >
                + Create Project
              </button>
            }
          />

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
              setFiltersOpen((previous) => !previous)
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

          {flaggedProjects.length > 0 ? (
            <AppCard className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/10 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[color:var(--ink)]">
                      Flagged Projects
                    </h2>

                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500/10 px-2 text-xs font-black text-red-400">
                      {flaggedProjects.length}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                    Projects requiring moderation review or an appeal.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {flaggedProjects.map((project) => (
                  <FlaggedProjectRow
                    key={project.id}
                    project={project}
                    courses={courses}
                    appealStatus={getAppealStatus(project)}
                    onOpen={openProject}
                    onAppeal={openAppeal}
                    onDelete={setProjectToDelete}
                  />
                ))}
              </div>
            </AppCard>
          ) : (
            <AppCard className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#355872]/8 text-[#355872] dark:bg-white/[0.05] dark:text-[#9CD5FF]">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[color:var(--ink)]">
                      Flagged Projects
                    </h2>

                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#355872]/8 px-2 text-[11px] font-black text-[#355872] dark:bg-white/[0.05] dark:text-[#9CD5FF]">
                      0
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs font-semibold text-[color:var(--muted)]">
                    No projects currently require moderation review.
                  </p>
                </div>
              </div>
            </AppCard>
          )}

          <AppCard className="overflow-hidden p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-[color:var(--ink)]">
                  All My Projects
                </h2>

                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#355872]/10 bg-white/65 px-2 text-xs font-black text-[#355872] dark:border-white/10 dark:bg-white/[0.05] dark:text-[#9CD5FF]">
                  {filteredProjects.length}
                </span>
              </div>

              <p className="hidden text-sm font-semibold text-[color:var(--muted)] md:block">
                Open a project to view its full details.
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-[#355872]/20 bg-white/45 p-8 text-center dark:border-white/10 dark:bg-white/[0.035]">
                <p className="text-base font-black text-[color:var(--ink)]">
                  No projects found
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-[color:var(--muted)]">
                  Create a project or adjust your active filters.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    courses={courses}
                    onOpen={openProject}
                    onEdit={editProject}
                    onDelete={setProjectToDelete}
                    onVisibilityChange={toggleVisibility}
                  />
                ))}
              </div>
            )}
          </AppCard>
        </div>

        <DeleteConfirmationModal
          open={!!projectToDelete}
          title="Delete project?"
          description="This action cannot be undone. The project will be permanently removed."
          onCancel={() => setProjectToDelete(null)}
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
          description="Explain why this project should be restored."
          confirmLabel="Send Appeal"
          cancelLabel="Cancel"
          noteLabel="Appeal Message"
          notePlaceholder="Explain your appeal..."
          noteRequired
          noteValue={appealMessage}
          onNoteChange={setAppealMessage}
          onCancel={() => {
            setAppealOpen(false);
            setSelectedAppealProject(null);
          }}
          onConfirm={submitAppeal}
        />
      </main>
    </DashboardLayout>
  );
}
