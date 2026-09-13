import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookCheck,
  CheckCircle2,
  Eye,
  Flag,
  GraduationCap,
  RefreshCcw,
  Star,
  Users,
  MessageSquareText,
  FileText,
  Clock3,
  ChevronDown,
  SlidersHorizontal,
  Search,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
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
  { id: "unrated", label: "Unrated" },
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
  const changeSummary = getProjectChangeSummary(project, instructorId, { limit: 3 });

  return (
    <article
      onClick={() => onOpen(project, "overview")}
      className={`
        group relative cursor-pointer overflow-hidden rounded-[20px]
        border bg-white/92 px-5 py-4
        shadow-[0_10px_28px_rgba(53,88,114,0.05)]
        transition duration-200
        hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(53,88,114,0.085)]
        dark:bg-white/[0.045]
        ${
          isUpdated
            ? "border-[#DEC984] bg-[linear-gradient(90deg,rgba(255,248,225,0.72)_0%,rgba(255,255,255,0.94)_34%,rgba(255,255,255,0.94)_100%)] dark:border-[#E6C77B]/20"
            : isNeverReviewed
            ? "border-[#CCDCE5] dark:border-[#9CD5FF]/12"
            : "border-white/80 dark:border-white/9"
        }
      `}
    >
      {isUpdated ? (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-[#E6C77B]" />
      ) : isNeverReviewed ? (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-[#7AAACE]" />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <ReviewFreshnessBadge reviewState={reviewState} />
            <ReviewWorkflowLabel reviewState={reviewState} />

            {isRated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D6AD] bg-[#FFF8E7] px-2.5 py-1 text-[10px] font-black text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]">
                <Star className="h-3 w-3 fill-current" />
                {formatProjectRating(rating)}
              </span>
            ) : (
              <span className="text-[10px] font-black text-[#7E8F99] dark:text-[#879BA7]">
                Not Rated
              </span>
            )}

            <span className="text-[10px] font-bold text-[#758994] dark:text-[#8498A4]">
              {feedbackSummary}
            </span>
          </div>

          <h2 className="mt-2.5 line-clamp-1 text-[1.05rem] font-black tracking-[-0.02em] text-[color:var(--ink)]">
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
            <span>Content updated {formatDate(reviewState.contentUpdatedAt || getProjectContentUpdatedAt(project))}</span>
            {reviewState.lastReviewedAt ? (
              <>
                <span className="text-[#B1BDC4] dark:text-white/20">•</span>
                <span>Last reviewed {formatDate(reviewState.lastReviewedAt)}</span>
              </>
            ) : null}
          </div>

          {changeSummary.length ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8A6A18] dark:text-[#E6C77B]">
                What changed
              </span>
              {changeSummary.map((change) => (
                <button
                  key={`${change.type}-${change.targetId}-${change.createdAt}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(project, change.tab || "overview", change.targetId || "");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D8B8] bg-[#FFF9EA] px-2.5 py-1 text-[9.5px] font-black text-[#7F682B] transition hover:bg-[#FFF4D4] dark:border-[#E6C77B]/14 dark:bg-[#E6C77B]/7 dark:text-[#DCC77F]"
                >
                  {change.tab === "tasks" ? <MessageSquareText className="h-3 w-3" /> : change.tab === "bachelor thesis" ? <FileText className="h-3 w-3" /> : <RefreshCcw className="h-3 w-3" />}
                  {change.label}
                </button>
              ))}
            </div>
          ) : null}

          <p className="mt-2.5 line-clamp-1 max-w-[900px] text-[11.5px] font-semibold leading-5 text-[#71838E] dark:text-[#8599A5]">
            {project.description || "No project summary has been added yet."}
          </p>

          {technologies.length ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
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
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:pl-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onReport(project);
            }}
            className="grid h-10 w-10 place-items-center rounded-[12px] text-[#8797A1] transition hover:bg-red-50 hover:text-red-600 dark:text-[#7F949F] dark:hover:bg-red-400/10 dark:hover:text-red-300"
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
            className={
              reviewState.status !== "up-to-date"
                ? "inline-flex h-10 min-w-[132px] items-center justify-center gap-2 rounded-[13px] bg-[#355872] px-4 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(53,88,114,0.14)] transition hover:bg-[#294A61] dark:bg-[#9CD5FF] dark:text-[#071521] dark:hover:bg-[#B6E2FF]"
                : "inline-flex h-10 min-w-[132px] items-center justify-center gap-2 rounded-[13px] border border-[#CBDCE4] bg-white/70 px-4 text-[11px] font-black text-[#355872] transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#A9C4D3] dark:hover:bg-white/[0.07]"
            }
          >
            {isUpdated ? "Review changes" : isNeverReviewed ? "Review project" : "Open project"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
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
    ["unrated", "waiting-on-student", "follow-up", "revision-submitted", "new-thesis"].includes(initialView) ? initialView : "all"
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
      unrated: courseProjects.filter(
        (project) => getInstructorProjectRating(project, instructorId) === null
      ).length,
      "waiting-on-student": reviewStates.filter((state) => state.workflowStatus === "waiting-on-student").length,
      "follow-up": reviewStates.filter((state) => state.workflowStatus === "follow-up").length,
      "revision-submitted": reviewStates.filter((state) => state.workflowStatus === "revision-submitted").length,
      "new-thesis": courseProjects.filter((project) => hasNewThesisDraft(project, instructorId)).length,
    };
  }, [courseProjects, instructorId]);

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
          (workFilter === "unrated" && getInstructorProjectRating(project, instructorId) === null) ||
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
            originPath: `/instructor/courses/${encodeURIComponent(
              course.id
            )}/projects`,
            originLabel: `${course.code || "Course"} Projects`,
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

  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate("/instructor/my-courses")}
              className="inline-flex items-center gap-2 text-[11px] font-black text-[#6E8390] transition hover:text-[#355872] dark:text-[#8298A5] dark:hover:text-[#BFD7E3]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              My Courses
            </button>

            <section className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/86 px-6 py-5 shadow-[0_16px_42px_rgba(53,88,114,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
              <div className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-[#9CD5FF]/14 blur-3xl" />
              <div className="pointer-events-none absolute right-10 top-0 h-28 w-28 rounded-full bg-[#E6C77B]/10 blur-3xl" />

              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#0B2A3A] text-[#9CD5FF] shadow-[0_8px_18px_rgba(9,36,51,0.10)]">
                      {bachelorCourse ? <GraduationCap className="h-4 w-4" /> : <BookCheck className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6F8490] dark:text-[#8298A5]">
                        {course.code || course.type || "Course"}
                      </p>
                      <h1 className="mt-1 text-[clamp(1.55rem,2.4vw,2.15rem)] font-black tracking-[-0.035em] text-[color:var(--ink)]">
                        {course.name}
                      </h1>
                    </div>
                  </div>
                  <p className="mt-3 max-w-3xl text-[12px] font-semibold leading-5.5 text-[color:var(--muted)]">
                    Review student work, surface recent changes, and continue feedback where you left off.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-6 rounded-[18px] border border-[#DDE8ED] bg-white/72 px-5 py-3 dark:border-white/8 dark:bg-white/[0.035]">
                  <div>
                    <p className="text-[1.4rem] font-black tracking-[-0.035em] text-[color:var(--ink)]">{counts.all}</p>
                    <p className="text-[9px] font-bold text-[color:var(--muted)]">Projects</p>
                  </div>
                  <div className="h-8 w-px bg-[#DFE8EC] dark:bg-white/8" />
                  <div>
                    <p className="text-[1.4rem] font-black tracking-[-0.035em] text-[#A77E18] dark:text-[#E6C77B]">{counts.updated}</p>
                    <p className="text-[9px] font-bold text-[color:var(--muted)]">Modified</p>
                  </div>
                  <div className="h-8 w-px bg-[#DFE8EC] dark:bg-white/8" />
                  <div>
                    <p className="text-[1.4rem] font-black tracking-[-0.035em] text-[color:var(--ink)]">{counts.unrated}</p>
                    <p className="text-[9px] font-bold text-[color:var(--muted)]">Unrated</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#D9E4E9] pb-3 xl:flex-row xl:items-end xl:justify-between dark:border-white/10">
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {REVIEW_TABS.map((tab) => {
                const active = reviewFilter === tab.id;
                const label = tab.id === "updated" ? "Modified" : tab.id === "all" ? "All" : tab.label;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setReviewFilter(tab.id);
                      if (tab.id !== "all") {
                        setWorkFilter("all");
                        const next = new URLSearchParams(searchParams);
                        next.set("view", tab.id);
                        setSearchParams(next, { replace: true });
                      } else if (workFilter === "all") {
                        const next = new URLSearchParams(searchParams);
                        next.delete("view");
                        setSearchParams(next, { replace: true });
                      }
                    }}
                    className={`relative inline-flex h-10 items-center gap-2 px-3 text-[11px] font-black transition ${active ? "text-[#17384E] dark:text-white" : "text-[#7B8D98] hover:text-[#355872] dark:text-[#8298A6] dark:hover:text-[#C7D8E1]"}`}
                  >
                    {label}
                    <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-[9px] ${active ? "bg-[#F2E5B8] text-[#7A6327] dark:bg-[#E6C77B]/12 dark:text-[#E6C77B]" : "bg-[#E9F0F3] text-[#7A8D99] dark:bg-white/[0.05] dark:text-[#8599A5]"}`}>
                      {counts[tab.id]}
                    </span>
                    {active ? <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-[#E6C77B]" /> : null}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto xl:min-w-[660px]">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78909D]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects, students, or technology..."
                  className="h-11 w-full rounded-[14px] border border-[#D7E4EA] bg-white/92 pl-11 pr-4 text-[11px] font-bold text-[color:var(--ink)] outline-none transition placeholder:text-[#8DA0AA] focus:border-[#9CC4D8] focus:ring-2 focus:ring-[#9CD5FF]/18 dark:border-white/10 dark:bg-white/[0.05]"
                />
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setFilterMenuOpen((v) => !v); setSortMenuOpen(false); }}
                  className={`inline-flex h-11 min-w-[128px] items-center justify-between gap-3 rounded-[14px] border px-4 text-[10.5px] font-black transition ${workFilter !== "all" ? "border-[#D8C98F] bg-[#FFF8E6] text-[#80651C]" : "border-[#D7E4EA] bg-white/92 text-[#355872]"}`}
                >
                  <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5" />Filter{workFilter !== "all" ? " · 1" : ""}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition ${filterMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {filterMenuOpen ? (
                  <div className="absolute right-0 z-30 mt-2 w-[220px] overflow-hidden rounded-[16px] border border-[#D7E4EA] bg-white p-1.5 shadow-[0_16px_36px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-[#102631]">
                    {WORK_FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => {
                          setWorkFilter(filter.id);
                          if (filter.id !== "all") setReviewFilter("all");
                          const next = new URLSearchParams(searchParams);
                          if (filter.id === "all") next.delete("view"); else next.set("view", filter.id);
                          setSearchParams(next, { replace: true });
                          setFilterMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-[11px] px-3 py-2.5 text-left text-[10.5px] font-black transition ${workFilter === filter.id ? "bg-[#FFF5D7] text-[#80651C]" : "text-[#536E7E] hover:bg-[#F3F7F9] dark:text-[#A8BBC5] dark:hover:bg-white/[0.05]"}`}
                      >
                        <span>{filter.label === "All work" ? "All workflow states" : filter.label}</span>
                        <span className="text-[9px] opacity-65">{filter.id === "all" ? counts.all : counts[filter.id] || 0}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setSortMenuOpen((v) => !v); setFilterMenuOpen(false); }}
                  className="inline-flex h-11 min-w-[160px] items-center justify-between gap-3 rounded-[14px] border border-[#D7E4EA] bg-white/92 px-4 text-[10.5px] font-black text-[#355872] transition hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-[#B2C6D1]"
                >
                  <span>Sort: {selectedSort}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition ${sortMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {sortMenuOpen ? (
                  <div className="absolute right-0 z-30 mt-2 w-[190px] overflow-hidden rounded-[16px] border border-[#D7E4EA] bg-white p-1.5 shadow-[0_16px_36px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-[#102631]">
                    {["Review status", "Newest", "Rating", "A–Z"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => { setSelectedSort(option); setSortMenuOpen(false); }}
                        className={`block w-full rounded-[11px] px-3 py-2.5 text-left text-[10.5px] font-black transition ${selectedSort === option ? "bg-[#EAF4F8] text-[#244D65] dark:bg-[#9CD5FF]/10 dark:text-[#9CD5FF]" : "text-[#536E7E] hover:bg-[#F3F7F9] dark:text-[#A8BBC5] dark:hover:bg-white/[0.05]"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {visibleProjects.length ? (
            <div className="space-y-3.5">
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
            <div className="rounded-[26px] border border-dashed border-[#C9DBE4] bg-white/50 px-6 py-14 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <BookCheck className="mx-auto h-7 w-7 text-[#55758B] dark:text-[#9CD5FF]" />
              <h2 className="mt-4 text-xl font-black text-[color:var(--ink)]">
                No projects match this view
              </h2>
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
        </div>
      </main>

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
    </DashboardLayout>
  );
}
