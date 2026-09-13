import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookCheck,
  CheckCircle2,
  Eye,
  Flag,
  RefreshCcw,
  Star,
  Users,
  Clock3,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import InstructorWorkspaceShell from "@/components/instructorWorkspace/InstructorWorkspaceShell";
import InstructorWorkspaceHeader from "@/components/instructorWorkspace/InstructorWorkspaceHeader";
import InstructorWorkspaceTabs from "@/components/instructorWorkspace/InstructorWorkspaceTabs";
import InstructorControlBar from "@/components/instructorWorkspace/InstructorControlBar";
import InstructorSearchField from "@/components/instructorWorkspace/InstructorSearchField";
import Pagination from "@/components/common/Pagination";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import SideToast from "@/components/ui/SideToast";

import {
  getAllProjects,
  getCurrentUser,
  getDemoDb,
  getLinkedCourseIdsForInstructor,
  reportProject,
} from "@/data/demoStore";
import {
  formatProjectRating,
  getInstructorProjectRating,
  normalizeProjectRating,
} from "@/lib/projectRating";
import {
  getInstructorProjectReviewState,
  getProjectContentUpdatedAt,
  getProjectChangeSummary,
} from "@/lib/projectReview";

const ITEMS_PER_PAGE = 6;

const REVIEW_TABS = [
  { id: "all", label: "All projects" },
  { id: "updated", label: "Updated" },
  { id: "never-reviewed", label: "Never reviewed" },
  { id: "up-to-date", label: "Up to date" },
];

const WORK_FILTERS = [
  { id: "all", label: "All work" },
  { id: "waiting-on-student", label: "Waiting on student" },
  { id: "follow-up", label: "Follow-up" },
  { id: "revision-submitted", label: "Revision submitted" },
  { id: "new-thesis", label: "New thesis draft" },
];

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

function isBachelorCourse(course) {
  const label = `${course?.code || ""} ${course?.name || ""} ${course?.type || ""}`.toLowerCase();
  return label.includes("bachelor") || label.includes("thesis");
}

function getOwnerLabel(project) {
  return (
    project.owner?.name ||
    project.student?.name ||
    project.ownerName ||
    project.createdByName ||
    "Student team"
  );
}

function getUpdatedTime(project) {
  const value = project.updatedAt || project.createdAt || project.date;
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatDate(value) {
  if (!value) return "No recent update";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getFeedbackActivity(project) {
  const projectFeedbackCount = Array.isArray(project.feedback)
    ? project.feedback.length
    : 0;

  const taskFeedbackCount = (project.tasks || []).reduce(
    (total, task) => total + ((task.feedback || []).length || 0),
    0
  );

  const thesisFeedbackCount = (project.thesisDrafts || []).reduce(
    (total, draft) => total + ((draft.feedback || []).length || 0),
    0
  );

  return {
    projectFeedbackCount,
    taskFeedbackCount,
    thesisFeedbackCount,
    total: projectFeedbackCount + taskFeedbackCount + thesisFeedbackCount,
  };
}

function getFeedbackSummary(project, bachelorCourse = false) {
  const activity = getFeedbackActivity(project);
  const parts = [];

  if (activity.projectFeedbackCount > 0) {
    parts.push(
      `${activity.projectFeedbackCount} project comment${activity.projectFeedbackCount === 1 ? "" : "s"}`
    );
  }

  if (activity.taskFeedbackCount > 0) {
    parts.push(
      `${activity.taskFeedbackCount} task comment${activity.taskFeedbackCount === 1 ? "" : "s"}`
    );
  }

  if (bachelorCourse && activity.thesisFeedbackCount > 0) {
    parts.push(
      `${activity.thesisFeedbackCount} thesis comment${activity.thesisFeedbackCount === 1 ? "" : "s"}`
    );
  }

  return parts.length ? parts.join(" · ") : "No instructor comments yet";
}

function hasNewThesisDraft(project, instructorId) {
  return getProjectChangeSummary(project, instructorId, { limit: 6 }).some(
    (change) => change.type === "thesis-draft-added" || change.type === "thesis-final-selected"
  );
}

function ReviewWorkflowLabel({ reviewState }) {
  if (!reviewState?.workflowStatus || reviewState.workflowStatus === "reviewed" || reviewState.workflowStatus === "not-started") return null;

  const classes = reviewState.workflowStatus === "revision-submitted"
    ? "border-[#E3D6AD] bg-[#FFF8E7] text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]"
    : "border-[#D6E2E8] bg-[#F4F8FA] text-[#607A89] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#97ABB6]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black ${classes}`}>
      <Clock3 className="h-3 w-3" />
      {reviewState.workflowLabel}
    </span>
  );
}

function ReviewFreshnessBadge({ reviewState }) {
  if (reviewState.status === "updated") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D6AD] bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-black text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]">
        <RefreshCcw className="h-3 w-3" />
        Updated since your review
      </span>
    );
  }

  if (reviewState.status === "never-reviewed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8DCE8] bg-[#EEF6FA] px-2.5 py-1 text-[10px] font-black text-[#55758B] dark:border-[#9CD5FF]/12 dark:bg-[#9CD5FF]/7 dark:text-[#9CD5FF]">
        <Eye className="h-3 w-3" />
        Never reviewed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#718690] dark:text-[#8CA0AB]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Up to date
    </span>
  );
}

function getProjectImage(project) {
  return (
    project.thumbnail ||
    project.coverImage ||
    project.projectImage ||
    project.image ||
    project.media?.[0]?.url ||
    ""
  );
}

function ProjectRow({ project, bachelorCourse, instructorId, onOpen, onReport }) {
  const rating = getInstructorProjectRating(project, instructorId);
  const isRated = rating !== null;
  const reviewState = getInstructorProjectReviewState(project, instructorId);
  const isUpdated = reviewState.status === "updated";
  const isNeverReviewed = reviewState.status === "never-reviewed";
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : project.tags || [];
  const collaborators =
    (project.collaborators || []).length ||
    (project.collaboratorIds || []).length ||
    1;
  const feedbackSummary = getFeedbackSummary(project, bachelorCourse);
  const changeSummary = getProjectChangeSummary(project, instructorId, { limit: 3 })
    .filter((change) => !(
      change.type === "project-update" &&
      change.label === "Project content updated"
    ))
    .slice(0, 2);
  const image = getProjectImage(project);

  const stateTone = isUpdated
    ? "border-[#DEC984] bg-[linear-gradient(90deg,rgba(255,248,225,0.78)_0%,rgba(255,255,255,0.97)_30%,rgba(255,255,255,0.96)_100%)]"
    : isNeverReviewed
    ? "border-[#C9DDE8] bg-[linear-gradient(90deg,rgba(232,244,250,0.90)_0%,rgba(255,255,255,0.97)_30%,rgba(255,255,255,0.96)_100%)]"
    : "border-[#D7E4EA] bg-white/[0.96]";

  return (
    <article
      onClick={() => onOpen(project, "overview")}
      className={`group relative cursor-pointer overflow-hidden rounded-[22px] border shadow-[0_12px_30px_rgba(53,88,114,0.06)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_18px_42px_rgba(53,88,114,0.10)] dark:border-white/10 dark:bg-white/[0.045] ${stateTone}`}
    >
      <div className="grid min-h-[210px] md:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
        <div className="relative min-h-[180px] overflow-hidden bg-[linear-gradient(145deg,#17384E,#355872_55%,#7AAACE)] md:min-h-full">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <BookCheck className="h-10 w-10 text-white/72" />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(8,31,44,0.32)_100%)]" />
        </div>

        <div className="min-w-0 px-5 py-[18px] md:px-6 md:py-5 md:pr-40 xl:pr-48">
          <div className="flex flex-wrap items-center gap-2.5">
            <ReviewFreshnessBadge reviewState={reviewState} />
            <ReviewWorkflowLabel reviewState={reviewState} />
            {isRated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D6AD] bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-black text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]">
                <Star className="h-3 w-3 fill-current" />
                {formatProjectRating(rating)}
              </span>
            ) : (
              <span className="rounded-full border border-[#D9E5EA] bg-[#F6F9FA] px-2.5 py-1 text-[10px] font-black text-[#718690] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#8CA0AB]">
                Not rated
              </span>
            )}
            <span className="text-[10px] font-bold text-[#758994] dark:text-[#8498A4]">
              {feedbackSummary}
            </span>
          </div>

          <h2 className="mt-3 text-[1.08rem] font-black tracking-[-0.025em] text-[color:var(--ink)] sm:text-[1.14rem]">
            {project.title}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[color:var(--muted)]">
            <span>{getOwnerLabel(project)}</span>
            <span className="text-[#B1BDC4] dark:text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {collaborators} student{collaborators === 1 ? "" : "s"}
            </span>
            <span className="text-[#B1BDC4] dark:text-white/20">•</span>
            <span>Updated {formatDate(reviewState.contentUpdatedAt || getProjectContentUpdatedAt(project))}</span>
            {reviewState.lastReviewedAt ? (
              <>
                <span className="text-[#B1BDC4] dark:text-white/20">•</span>
                <span>Reviewed {formatDate(reviewState.lastReviewedAt)}</span>
              </>
            ) : null}
          </div>

          <p className="mt-3 line-clamp-2 max-w-[900px] text-[11.5px] font-semibold leading-5 text-[#71838E] dark:text-[#8599A5]">
            {project.description || "No project summary has been added yet."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {technologies.slice(0, 4).map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-[#D4E1E7] bg-[#F5F8FA] px-2.5 py-1 text-[9px] font-black text-[#587487] dark:border-white/9 dark:bg-white/[0.035] dark:text-[#9EB3BF]"
              >
                {technology}
              </span>
            ))}
            {technologies.length > 4 ? (
              <span className="rounded-full border border-[#E3D8B4] bg-[#FFF9EA] px-2.5 py-1 text-[9px] font-black text-[#92701C] dark:border-[#E6C77B]/12 dark:bg-[#E6C77B]/7 dark:text-[#DCC77F]">
                +{technologies.length - 4}
              </span>
            ) : null}
          </div>

          {changeSummary.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {changeSummary.map((change) => (
                <button
                  key={`${change.type}-${change.targetId}-${change.createdAt}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(project, change.tab || "overview", change.targetId || "");
                  }}
                  className="rounded-full border border-[#E2D8B8] bg-[#FFF9EA] px-2.5 py-1 text-[9px] font-black text-[#7F682B] transition hover:bg-[#FFF4D4] dark:border-[#E6C77B]/14 dark:bg-[#E6C77B]/7 dark:text-[#DCC77F]"
                >
                  {change.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onReport(project);
          }}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-[11px] text-[#8797A1] transition hover:bg-red-50 hover:text-red-600 dark:text-[#7F949F] dark:hover:bg-red-400/10 dark:hover:text-red-300"
          aria-label={`Report ${project.title}`}
          title="Report project"
        >
          <Flag className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(project, "overview");
          }}
          className="absolute bottom-4 right-5 z-10 inline-flex items-center gap-1.5 text-[10px] font-black text-[color:var(--muted)] opacity-72 transition duration-200 group-hover:text-[color:var(--primary)] group-hover:opacity-100"
        >
          {isUpdated ? "Review changes" : isNeverReviewed ? "Review project" : "Open project"}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

export default function InstructorProjects() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = getCurrentUser();
  const instructorId = currentUser?.id;

  const [projects, setProjects] = useState(() =>
    getAllProjects({ includePrivate: true })
  );
  const [search, setSearch] = useState("");
  const initialView = searchParams.get("view") || "all";
  const [reviewFilter, setReviewFilter] = useState(
    ["updated", "never-reviewed", "up-to-date"].includes(initialView) ? initialView : "all"
  );
  const [workFilter, setWorkFilter] = useState(
    ["waiting-on-student", "follow-up", "revision-submitted", "new-thesis"].includes(initialView) ? initialView : "all"
  );
  const [selectedSort, setSelectedSort] = useState("Review status");
  const [page, setPage] = useState(1);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const refresh = () => setProjects(getAllProjects({ includePrivate: true }));
    refresh();
    window.addEventListener("demo-db-change", refresh);

    return () => window.removeEventListener("demo-db-change", refresh);
  }, []);

  const db = getDemoDb();
  const linkedCourseIds = useMemo(
    () => new Set(getLinkedCourseIdsForInstructor(instructorId).map(String)),
    [instructorId, projects]
  );

  const course = useMemo(
    () =>
      (db.courses || []).find((item) => sameId(item.id, courseId)) || null,
    [db.courses, courseId]
  );

  const hasCourseAccess = Boolean(
    course && linkedCourseIds.has(String(course.id))
  );

  const courseProjects = useMemo(() => {
    if (!course) return [];

    const linkedProjectIds = new Set(
      (course.linkedProjectIds || []).map(String)
    );

    return projects.filter(
      (project) =>
        sameId(project.courseId, course.id) ||
        linkedProjectIds.has(String(project.id))
    );
  }, [course, projects]);

  const bachelorCourse = isBachelorCourse(course);

  const counts = useMemo(() => {
    const reviewStates = courseProjects.map((project) =>
      getInstructorProjectReviewState(project, instructorId)
    );

    return {
      all: courseProjects.length,
      updated: reviewStates.filter((state) => state.status === "updated").length,
      "never-reviewed": reviewStates.filter(
        (state) => state.status === "never-reviewed"
      ).length,
      "up-to-date": reviewStates.filter(
        (state) => state.status === "up-to-date"
      ).length,
      "waiting-on-student": reviewStates.filter((state) => state.workflowStatus === "waiting-on-student").length,
      "follow-up": reviewStates.filter((state) => state.workflowStatus === "follow-up").length,
      "revision-submitted": reviewStates.filter((state) => state.workflowStatus === "revision-submitted").length,
      "new-thesis": courseProjects.filter((project) => hasNewThesisDraft(project, instructorId)).length,
    };
  }, [courseProjects, instructorId]);

  const hasWorkflowFilters =
    counts["waiting-on-student"] > 0 ||
    counts["follow-up"] > 0 ||
    counts["revision-submitted"] > 0 ||
    counts["new-thesis"] > 0;

  useEffect(() => {
    if (!hasWorkflowFilters && workFilter !== "all") {
      setWorkFilter("all");
      const next = new URLSearchParams(searchParams);
      next.delete("view");
      setSearchParams(next, { replace: true });
    }
  }, [hasWorkflowFilters, workFilter, searchParams, setSearchParams]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courseProjects
      .filter((project) => {
        const matchesSearch =
          !query ||
          [
            project.title,
            project.description,
            getOwnerLabel(project),
            ...(project.technologies || []),
            ...(project.tags || []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);

        const reviewState = getInstructorProjectReviewState(project, instructorId);
        const matchesReview =
          reviewFilter === "all" || reviewState.status === reviewFilter;

        const matchesWork =
          workFilter === "all" ||
          (["waiting-on-student", "follow-up", "revision-submitted"].includes(workFilter) && reviewState.workflowStatus === workFilter) ||
          (workFilter === "new-thesis" && hasNewThesisDraft(project, instructorId));

        return matchesSearch && matchesReview && matchesWork;
      })
      .sort((a, b) => {
        if (selectedSort === "Review status") {
          const priority = { updated: 0, "never-reviewed": 1, "up-to-date": 2 };
          const aState = getInstructorProjectReviewState(a, instructorId).status;
          const bState = getInstructorProjectReviewState(b, instructorId).status;
          return (
            (priority[aState] ?? 3) - (priority[bState] ?? 3) ||
            getUpdatedTime(b) - getUpdatedTime(a)
          );
        }

        if (selectedSort === "Newest") {
          return getUpdatedTime(b) - getUpdatedTime(a);
        }

        if (selectedSort === "Rating") {
          return (normalizeProjectRating(b.rating) || 0) -
            (normalizeProjectRating(a.rating) || 0);
        }

        if (selectedSort === "A–Z") {
          return String(a.title || "").localeCompare(String(b.title || ""));
        }

        return getUpdatedTime(b) - getUpdatedTime(a);
      });
  }, [
    courseProjects,
    search,
    reviewFilter,
    workFilter,
    selectedSort,
    instructorId,
  ]);

  useEffect(() => setPage(1), [search, reviewFilter, workFilter, selectedSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = filteredProjects.slice(
    start,
    start + ITEMS_PER_PAGE
  );

  const openProject = (project, tab = "overview", focus = "") => {
    const focusQuery = focus ? `&focus=${encodeURIComponent(focus)}` : "";
    navigate(
      `/project?projectId=${encodeURIComponent(
        project.id
      )}&tab=${encodeURIComponent(tab)}${focusQuery}`,
      {
        state: {
          projectFlow: {
            originPath: "/instructor/my-courses",
            originLabel: "My Courses",
            projectIds: filteredProjects.map((item) => item.id),
          },
        },
      }
    );
  };

  const handleConfirmReport = () => {
    if (!selectedProject || !reportReason.trim()) return;

    try {
      reportProject(selectedProject.id, reportReason.trim());

      setNotification({
        title: "Project reported",
        text: "The project was sent to the admin flagged-projects review list.",
      });

      setReportOpen(false);
      setReportReason("");
      setSelectedProject(null);

      window.setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        title: "Could not report project",
        text: error?.message || "Please try again.",
      });
    }
  };

  if (!courseId || !course || !hasCourseAccess) {
    return <Navigate to="/instructor/my-courses" replace />;
  }

  const reviewItems = REVIEW_TABS.map((tab) => ({
    id: tab.id,
    label: tab.id === "updated" ? "Modified" : tab.id === "all" ? "All" : tab.label,
    count: counts[tab.id],
  }));

  const workflowLabel =
    workFilter === "all"
      ? "Workflow"
      : WORK_FILTERS.find((item) => item.id === workFilter)?.label || "Workflow";

  const overlays = (
    <>
      <AdminActionDialog
        open={reportOpen}
        title="Report project"
        description="Send this project to the admin moderation queue. Reporting is separate from academic feedback."
        confirmLabel="Submit report"
        cancelLabel="Cancel"
        tone="danger"
        noteLabel="Reason"
        notePlaceholder="Explain what the admin should review..."
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
    </>
  );

  return (
    <InstructorWorkspaceShell overlay={overlays}>
      <InstructorWorkspaceHeader
        eyebrow={course.code || course.type || "Course workspace"}
        title={course.name}
        description="Review student work, surface recent changes, and continue feedback where you left off."
      />

      <InstructorControlBar
        tabs={
          <InstructorWorkspaceTabs
            items={reviewItems}
            value={reviewFilter}
            onChange={(nextFilter) => {
              setReviewFilter(nextFilter);
              if (nextFilter !== "all") {
                setWorkFilter("all");
                const next = new URLSearchParams(searchParams);
                next.set("view", nextFilter);
                setSearchParams(next, { replace: true });
              } else if (workFilter === "all") {
                const next = new URLSearchParams(searchParams);
                next.delete("view");
                setSearchParams(next, { replace: true });
              }
            }}
            ariaLabel="Filter projects by review freshness"
          />
        }
        controls={
          <>
            <InstructorSearchField
              value={search}
              onChange={setSearch}
              placeholder="Search projects, students, or technology..."
              className="w-full sm:min-w-[320px] sm:flex-1 xl:w-[430px] xl:flex-none"
            />

            {hasWorkflowFilters ? (
              <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setFilterMenuOpen((value) => !value);
                  setSortMenuOpen(false);
                }}
                className={`inline-flex h-[52px] min-w-[145px] items-center justify-between gap-3 rounded-[17px] border px-4 text-[11px] font-black shadow-[0_9px_24px_rgba(53,88,114,0.07)] transition ${
                  workFilter !== "all"
                    ? "border-[#D8C98F] bg-[#FFF8E6] text-[#80651C]"
                    : "border-[#C8DAE4] bg-white text-[color:var(--primary)]"
                } dark:border-white/10 dark:bg-[#102638]`}
              >
                <span className="inline-flex min-w-0 items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{workflowLabel}</span>
                </span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition ${filterMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {filterMenuOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-[230px] overflow-hidden rounded-[16px] border border-[#D7E4EA] bg-white p-1.5 shadow-[0_18px_42px_rgba(53,88,114,0.16)] dark:border-white/10 dark:bg-[#102631]">
                  {WORK_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => {
                        setWorkFilter(filter.id);
                        if (filter.id !== "all") setReviewFilter("all");
                        const next = new URLSearchParams(searchParams);
                        if (filter.id === "all") next.delete("view");
                        else next.set("view", filter.id);
                        setSearchParams(next, { replace: true });
                        setFilterMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[11px] px-3 py-2.5 text-left text-[10.5px] font-black transition ${
                        workFilter === filter.id
                          ? "bg-[#FFF5D7] text-[#80651C]"
                          : "text-[#536E7E] hover:bg-[#F3F7F9] dark:text-[#A8BBC5] dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{filter.id === "all" ? "All workflow states" : filter.label}</span>
                      <span className="text-[9px] opacity-65">
                        {filter.id === "all" ? counts.all : counts[filter.id] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            ) : null}


            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSortMenuOpen((value) => !value);
                  setFilterMenuOpen(false);
                }}
                className="inline-flex h-[52px] min-w-[176px] items-center justify-between gap-3 rounded-[17px] border border-[#C8DAE4] bg-white px-4 text-[11px] font-black text-[color:var(--primary)] shadow-[0_9px_24px_rgba(53,88,114,0.07)] transition hover:border-[color:var(--primary)]/30 dark:border-white/10 dark:bg-[#102638] dark:text-[#B2C6D1]"
              >
                <span>Sort: {selectedSort}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition ${sortMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {sortMenuOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-[190px] overflow-hidden rounded-[16px] border border-[#D7E4EA] bg-white p-1.5 shadow-[0_18px_42px_rgba(53,88,114,0.16)] dark:border-white/10 dark:bg-[#102631]">
                  {["Review status", "Newest", "Rating", "A–Z"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedSort(option);
                        setSortMenuOpen(false);
                      }}
                      className={`block w-full rounded-[11px] px-3 py-2.5 text-left text-[10.5px] font-black transition ${
                        selectedSort === option
                          ? "bg-[#EAF4F8] text-[#244D65] dark:bg-[#9CD5FF]/10 dark:text-[#9CD5FF]"
                          : "text-[#536E7E] hover:bg-[#F3F7F9] dark:text-[#A8BBC5] dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        }
      />

      {visibleProjects.length ? (
        <div className="space-y-4">
          {visibleProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              bachelorCourse={bachelorCourse}
              instructorId={instructorId}
              onOpen={openProject}
              onReport={(projectToReport) => {
                setSelectedProject(projectToReport);
                setReportOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[26px] border border-dashed border-[#C9DBE4] bg-white/70 px-6 py-14 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <BookCheck className="mx-auto h-7 w-7 text-[#55758B] dark:text-[#9CD5FF]" />
          <h2 className="mt-4 text-xl font-black text-[color:var(--ink)]">No projects match this view</h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] font-semibold leading-6 text-[color:var(--muted)]">
            Try another review state or clear the current search.
          </p>
        </div>
      )}

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filteredProjects.length}
        pageStartIndex={start}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setPage}
        ariaLabel={`${course.code || "Course"} projects pagination`}
      />
    </InstructorWorkspaceShell>
  );
}

