import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Code2,
  Edit3,
  Eye,
  Lock,
  Star,
  Trash2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import FilterSelect from "@/components/common/FilterSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import {
  getCurrentUser,
  getProjectsForUser,
  getCollection,
  updateProject,
  deleteProject as deleteProjectFromStore,
} from "@/data/demoStore";
import { formatProjectRating } from "@/lib/projectRating";

const ITEMS_PER_PAGE = 6;

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
      Instructor Score {formatProjectRating(rating)}
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


function VisibilityControl({ project, onChange }) {
  const visibility = normalizeVisibility(project.visibility);
  const isPublic = visibility === "Public";

  return (
    <div
      className="relative z-20"
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={visibility}
        onValueChange={(nextValue) => onChange(project.id, nextValue)}
      >
        <SelectTrigger
          className={`h-9 min-h-9 w-[116px] rounded-[12px] border px-3 pl-9 text-[11px] font-black shadow-[0_8px_18px_rgba(122,97,34,0.16)] backdrop-blur-md transition ${
            isPublic
              ? "border-[#D9BE63] bg-[#F5E7B2]/94 text-[#6F571C] hover:bg-[#F1DEA0]"
              : "border-[#C7A84A] bg-[#8A6D26]/94 text-white hover:bg-[#7A5F20]"
          }`}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          position="popper"
          align="start"
          className="!min-w-[116px] !w-[116px] !rounded-[12px] !border-[#DFC873] !bg-[#FFF9E8] !p-1 !shadow-[0_14px_30px_rgba(122,97,34,0.16)] !backdrop-blur-none"
        >
          <SelectItem
            value="Public"
            className="!rounded-[9px] !px-2.5 !py-2 !pr-7 !text-[11px] !font-black !text-[#6F571C] focus:!bg-[#F3E3A9] data-[state=checked]:!bg-[#F3E3A9] data-[state=checked]:!text-[#6F571C]"
          >
            Public
          </SelectItem>

          <SelectItem
            value="Private"
            className="!rounded-[9px] !px-2.5 !py-2 !pr-7 !text-[11px] !font-black !text-[#6F571C] focus:!bg-[#F3E3A9] data-[state=checked]:!bg-[#F3E3A9] data-[state=checked]:!text-[#6F571C]"
          >
            Private
          </SelectItem>
        </SelectContent>
      </Select>

      {isPublic ? (
        <Eye className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-[#8A6D26]" />
      ) : (
        <Lock className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-white/85" />
      )}
    </div>
  );
}
function ProjectVisual({
  project,
  onVisibilityChange,
}) {
  const image = project.image || "";

  return (
    <div className="relative min-h-[220px] overflow-hidden bg-[#DDE7EC] dark:bg-[#071521]">
      {image ? (
        <img
          src={image}
          alt={getProjectName(project)}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#DCE8EE_0%,#EEF4F7_55%,#D5E3EA_100%)] dark:bg-[linear-gradient(145deg,#102B3D_0%,#17394E_55%,#234F69_100%)]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,28,44,0.08)_0%,transparent_48%,rgba(7,28,44,0.42)_100%)]" />

      <div className="absolute left-4 top-4 z-10">
        <VisibilityControl
          project={project}
          onChange={onVisibilityChange}
        />
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <p className="inline-flex rounded-full border border-white/20 bg-[#071C2C]/72 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
          {getProjectType(project)}
        </p>
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
      className="group cursor-pointer overflow-hidden rounded-[1.65rem] border border-[color:var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_24px_52px_rgba(53,88,114,0.14)] dark:border-white/10"
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

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#DCE6EB] pt-4 text-[11px] font-bold text-[color:var(--muted)] dark:border-white/10">
            <span>
              <strong className="font-black text-[#355872] dark:text-[#9CD5FF]">
                {getProjectCollaborators(project)}
              </strong>{" "}
              collaborators
            </span>

            <span className="hidden h-4 w-px bg-[#D3E1E9] sm:block dark:bg-white/10" />

            <span>
              <strong className="font-black text-[#355872] dark:text-[#9CD5FF]">
                {getProjectInstructors(project)}
              </strong>{" "}
              instructors
            </span>

            <span className="hidden h-4 w-px bg-[#D3E1E9] sm:block dark:bg-white/10" />

            <span>
              <strong className="font-black text-[#355872] dark:text-[#9CD5FF]">
                {getProjectComments(project)}
              </strong>{" "}
              comments
            </span>

            <span className="hidden h-4 w-px bg-[#D3E1E9] sm:block dark:bg-white/10" />

            <span>
              Updated{" "}
              <strong className="font-black text-[#355872] dark:text-[#9CD5FF]">
                {getProjectUpdated(project)}
              </strong>
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">

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
  const [currentPage, setCurrentPage] = useState(1);

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

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

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
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="My Projects"
          description="Manage, edit, and organize your projects."
          action={
            <button
              type="button"
              onClick={() => navigate("/create-project")}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)] px-8 text-sm font-black text-white shadow-[0_12px_30px_rgba(53,88,114,.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(53,88,114,.30)]"
            >
              + Create Project
            </button>
          }
        />

          <SearchFilterToolbar
            searchValue={search}
            onSearchChange={(value) => { setSearch(value); setCurrentPage(1); }}
            searchPlaceholder="Search my projects..."
            showSort
            sortValue={`Sort: ${sortBy}`}
            onSortChange={(value) => {
              setSortBy(value.replace("Sort: ", ""));
              setCurrentPage(1);
            }}
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
              setCurrentPage(1);
            }}
          >
            <FilterSelect
              value={`Course: ${filterCourse}`}
              onChange={(value) => {
                setFilterCourse(value.replace("Course: ", ""));
                setCurrentPage(1);
              }}
              options={courseOptions}
            />

            <FilterSelect
              value={`Visibility: ${filterVisibility}`}
              onChange={(value) => {
                setFilterVisibility(value.replace("Visibility: ", ""));
                setCurrentPage(1);
              }}
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
          ) : null}

          <section>
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
                {paginatedProjects.map((project) => (
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
          </section>

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={filteredProjects.length}
            pageStartIndex={pageStartIndex}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={goToPage}
            ariaLabel="My projects pagination"
          />
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
    </DashboardLayout>
  );
}
