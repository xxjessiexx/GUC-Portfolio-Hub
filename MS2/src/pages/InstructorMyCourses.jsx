import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Pin,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import Pagination from "@/components/common/Pagination";
import {
  getAllProjects,
  getCurrentUser,
  getLinkedCoursesForInstructor,
  requestCourseLinkChange,
} from "@/data/demoStore";
import { getInstructorProjectRating } from "@/lib/projectRating";
import { getInstructorProjectReviewState } from "@/lib/projectReview";

const ITEMS_PER_PAGE = 6;

function getPinnedStorageKey(instructorId) {
  return `guc-instructor-pinned-courses:${String(instructorId || "guest")}`;
}

function readPinnedCourseIds(instructorId) {
  try {
    const raw = localStorage.getItem(getPinnedStorageKey(instructorId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writePinnedCourseIds(instructorId, ids) {
  localStorage.setItem(
    getPinnedStorageKey(instructorId),
    JSON.stringify(ids.map(String))
  );
}

function sameId(a, b) {
  return String(a || "") === String(b || "");
}

function getCourseProjects(course, projects) {
  const linkedIds = new Set((course.linkedProjectIds || []).map(String));

  return projects.filter(
    (project) =>
      sameId(project.courseId, course.id) ||
      linkedIds.has(String(project.id))
  );
}

function getCourseMetrics(course, projects, instructorId) {
  const scopedProjects = getCourseProjects(course, projects);
  const unrated = scopedProjects.filter(
    (project) => getInstructorProjectRating(project, instructorId) === null
  ).length;
  const reviewStates = scopedProjects.map((project) =>
    getInstructorProjectReviewState(project, instructorId)
  );
  const updated = reviewStates.filter((state) => state.status === "updated").length;
  const neverReviewed = reviewStates.filter(
    (state) => state.status === "never-reviewed"
  ).length;
  const waitingOnStudent = reviewStates.filter(
    (state) => state.workflowStatus === "waiting-on-student"
  ).length;

  return {
    scopedProjects,
    unrated,
    updated,
    neverReviewed,
    waitingOnStudent,
  };
}

function CourseState({ course }) {
  if (course.isBachelorProject) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#8A6A18] dark:text-[#E6C77B]">
        <GraduationCap className="h-3.5 w-3.5" />
        Required course
      </span>
    );
  }

  if (course.requestStatus === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#8A6A18] dark:text-[#E6C77B]">
        <Clock3 className="h-3.5 w-3.5" />
        Unlink pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#557A67] dark:text-emerald-200">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Active
    </span>
  );
}

function CourseCard({ course, projects, instructorId, onOpen, onUnlink, pinned, onTogglePin }) {
  const {
    scopedProjects,
    unrated,
    updated,
    neverReviewed,
    waitingOnStudent,
  } = getCourseMetrics(course, projects, instructorId);

  const attentionSummary = updated > 0
    ? `${updated} project${updated === 1 ? " has" : "s have"} changes since your last review`
    : unrated > 0
    ? `${unrated} project${unrated === 1 ? " is" : "s are"} still unrated`
    : scopedProjects.length
    ? "No projects need attention right now"
    : "No student projects are linked yet";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(course, "all")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(course, "all");
        }
      }}
      className={`
        group relative flex min-h-[238px] cursor-pointer flex-col overflow-hidden rounded-[26px]
        border bg-[rgba(255,255,255,0.975)]
        p-5 transition duration-200
        hover:-translate-y-1 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-[color:var(--secondary)]/45
        dark:bg-[rgba(10,25,38,0.95)]
        ${updated > 0
          ? "border-[color:var(--gold)]/22 shadow-[0_18px_46px_rgba(186,145,56,0.10)] hover:border-[color:var(--gold)]/42 hover:shadow-[0_26px_56px_rgba(186,145,56,0.15)]"
          : "border-[color:var(--primary)]/10 shadow-[0_18px_44px_rgba(53,88,114,0.085)] hover:border-[color:var(--secondary)]/34 hover:shadow-[0_24px_52px_rgba(53,88,114,0.13)] dark:border-white/10"}
      `}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: updated > 0
            ? "radial-gradient(ellipse 62% 58% at 9% 2%, color-mix(in srgb, var(--gold) 12%, transparent) 0%, color-mix(in srgb, var(--gold) 5%, transparent) 34%, transparent 67%)"
            : "radial-gradient(ellipse 62% 58% at 9% 2%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, color-mix(in srgb, var(--primary) 3%, transparent) 34%, transparent 67%)",
        }}
      />

      <div
        className={`absolute inset-x-0 top-0 h-[3px] ${
          updated > 0
            ? "bg-[color:var(--gold)]"
            : "bg-[color:var(--primary)]"
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[#092433] text-[#9CD5FF] dark:bg-[#071923]"
            style={{
              boxShadow: updated > 0
                ? "0 10px 24px color-mix(in srgb, var(--gold) 20%, rgba(9,36,51,0.12))"
                : "0 10px 24px color-mix(in srgb, var(--primary) 16%, rgba(9,36,51,0.12))",
            }}
          >
            <BookCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#617987] dark:text-[#8CA1AD]">
                {course.isBachelorProject ? "Bachelor Project" : course.code}
              </p>
              <CourseState course={course} />
            </div>

            <h2 className="mt-2 line-clamp-2 text-[1.14rem] font-black leading-snug tracking-[-0.025em] text-[color:var(--ink)] transition-colors duration-200 group-hover:text-[color:var(--primary)]">
              {course.name}
            </h2>

            <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-[color:var(--muted)]">
              {course.type || "Academic course"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePin(course);
            }}
            className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]/45 ${
              pinned
                ? "bg-[color:var(--gold)]/14 text-[color:var(--gold)] opacity-100"
                : "text-[color:var(--muted)] opacity-30 hover:bg-[color:var(--primary)]/7 hover:text-[color:var(--primary)] hover:opacity-100 group-hover:opacity-70"
            }`}
            aria-label={pinned ? `Unpin ${course.name}` : `Pin ${course.name}`}
            title={pinned ? "Unpin course" : "Pin course"}
          >
            <Pin className={`h-3.5 w-3.5 transition-transform duration-200 ${pinned ? "rotate-[-10deg]" : ""}`} />
          </button>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[color:var(--muted)] opacity-72 transition duration-200 group-hover:text-[color:var(--primary)] group-hover:opacity-100">
            Open course
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 border-y border-[#DCE6EA]/65 py-3.5 dark:border-white/8">
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onOpen(course, "all"); }}
          className="flex flex-col items-center justify-center text-center transition hover:opacity-70"
          title="View all projects"
        >
          <p className="text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]">{scopedProjects.length}</p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">Projects</p>
        </button>

        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onOpen(course, "updated"); }}
          className="flex flex-col items-center justify-center border-l border-[#DCE6EA]/55 text-center transition hover:opacity-70 dark:border-white/8"
          title="View projects updated since your review"
        >
          <p className={updated ? "text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--gold)]" : "text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]"}>{updated}</p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">Updated</p>
        </button>

        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onOpen(course, "unrated"); }}
          className="flex flex-col items-center justify-center border-l border-[#DCE6EA]/55 text-center transition hover:opacity-70 dark:border-white/8"
          title="View projects you have not rated"
        >
          <p className="text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]">{unrated}</p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">Unrated</p>
        </button>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[11px] font-extrabold text-[#5F7785] dark:text-[#93A7B1]">
            {updated > 0 ? (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gold)]"
                style={{ boxShadow: "0 0 0 3px color-mix(in srgb, var(--gold) 12%, transparent)" }}
              />
            ) : null}
            <span>{attentionSummary}</span>
          </p>
          {(neverReviewed > 0 || waitingOnStudent > 0) ? (
            <p className="mt-1 text-[9.5px] font-semibold text-[#8A9AA3] dark:text-[#778E9A]">
              {neverReviewed > 0 ? `${neverReviewed} never reviewed` : ""}
              {neverReviewed > 0 && waitingOnStudent > 0 ? " · " : ""}
              {waitingOnStudent > 0 ? `${waitingOnStudent} waiting on student` : ""}
            </p>
          ) : null}
        </div>

        {!course.isBachelorProject ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onUnlink(course);
            }}
            disabled={course.requestStatus === "pending"}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[12px] px-2.5 text-[10px] font-black text-[#81929C] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-75 dark:text-[#8297A3] dark:hover:bg-red-400/10 dark:hover:text-red-300"
          >
            <Unlink className="h-3.5 w-3.5" />
            {course.requestStatus === "pending" ? "Pending" : "Unlink"}
          </button>
        ) : (
          <span className="inline-flex h-8 shrink-0 items-center text-[10px] font-black text-[color:var(--muted)] opacity-65">
            Required course
          </span>
        )}
      </div>
    </article>
  );
}

export default function InstructorMyCourses() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const instructorId = currentUser?.id;

  const [courses, setCourses] = useState(() =>
    getLinkedCoursesForInstructor(instructorId)
  );
  const [projects, setProjects] = useState(() =>
    getAllProjects({ includePrivate: true })
  );
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pinnedCourseIds, setPinnedCourseIds] = useState(() =>
    readPinnedCourseIds(instructorId)
  );

  const refresh = () => {
    setCourses(getLinkedCoursesForInstructor(instructorId));
    setProjects(getAllProjects({ includePrivate: true }));
  };

  useEffect(() => {
    refresh();
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, [instructorId]);

  useEffect(() => {
    setPinnedCourseIds(readPinnedCourseIds(instructorId));
  }, [instructorId]);

  const courseOverview = useMemo(() => {
    const metricsByCourse = new Map();
    let modifiedCourses = 0;
    let unratedProjects = 0;
    let coursesWithUnrated = 0;
    let neverReviewedCourses = 0;

    courses.forEach((course) => {
      const metrics = getCourseMetrics(course, projects, instructorId);
      metricsByCourse.set(String(course.id), metrics);

      if (metrics.updated > 0) modifiedCourses += 1;
      unratedProjects += metrics.unrated;
      if (metrics.unrated > 0) coursesWithUnrated += 1;
      if (metrics.neverReviewed > 0) neverReviewedCourses += 1;
    });

    return {
      metricsByCourse,
      modifiedCourses,
      unratedProjects,
      coursesWithUnrated,
      neverReviewedCourses,
    };
  }, [courses, projects, instructorId]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const metrics = courseOverview.metricsByCourse.get(String(course.id));
      const matchesSearch = !query ||
        `${course.code} ${course.name} ${course.type} ${course.instructor}`
          .toLowerCase()
          .includes(query);

      if (!matchesSearch) return false;

      if (activeFilter === "modified") return (metrics?.updated || 0) > 0;
      if (activeFilter === "unrated") return (metrics?.unrated || 0) > 0;
      if (activeFilter === "never-reviewed") return (metrics?.neverReviewed || 0) > 0;

      return true;
    });
  }, [courses, search, activeFilter, courseOverview]);

  useEffect(() => setPage(1), [search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const pageCourses = filtered.slice(start, start + ITEMS_PER_PAGE);
  const pinnedSet = useMemo(
    () => new Set(pinnedCourseIds.map(String)),
    [pinnedCourseIds]
  );
  const visibleCourses = useMemo(
    () => [...pageCourses].sort((a, b) => {
      const aPinned = pinnedSet.has(String(a.id)) ? 1 : 0;
      const bPinned = pinnedSet.has(String(b.id)) ? 1 : 0;
      return bPinned - aPinned;
    }),
    [pageCourses, pinnedSet]
  );

  const handleTogglePin = (course) => {
    const courseId = String(course.id);
    const isPinned = pinnedCourseIds.includes(courseId);
    const nextPinnedIds = isPinned
      ? pinnedCourseIds.filter((id) => id !== courseId)
      : [...pinnedCourseIds, courseId];

    setPinnedCourseIds(nextPinnedIds);
    writePinnedCourseIds(instructorId, nextPinnedIds);

  };

  const handleUnlink = (course) => {
    try {
      requestCourseLinkChange(course.id, "unlink");
      toast.success("Unlink request sent", {
        description: `Admin will review your request for ${course.code}.`,
      });
      refresh();
    } catch (error) {
      toast.error(error?.message || "Could not send request.");
    }
  };

  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-5">
          <section className="relative isolate pb-1 pt-0 sm:pb-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(122,174,205,0.14),transparent_68%)] blur-xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[5%] top-5 h-28 w-56 rotate-[-8deg] rounded-full bg-[radial-gradient(ellipse,rgba(230,199,123,0.10),transparent_70%)] blur-2xl"
            />

            <PageHeader
              eyebrow="Teaching workspace"
              title="My Courses"
              description="Your active teaching responsibilities. Enter a course to review the student projects attached to it."
            />

          </section>

          <div className="flex flex-col gap-3 border-b border-[#D9E4E9] pb-2 dark:border-white/10 lg:flex-row lg:flex-nowrap lg:items-end lg:gap-7">
            <div
              className="flex shrink-0 flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Filter my courses"
            >
              {[
                { id: "all", label: "All", count: courses.length },
                {
                  id: "modified",
                  label: "Modified",
                  count: courseOverview.modifiedCourses,
                },
                {
                  id: "unrated",
                  label: "Unrated",
                  count: courseOverview.coursesWithUnrated,
                },
                {
                  id: "never-reviewed",
                  label: "Never reviewed",
                  count: courseOverview.neverReviewedCourses,
                },
              ].map((filter) => {
                const selected = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`relative inline-flex h-11 items-center gap-2.5 px-3.5 text-[13px] font-black transition ${
                      selected
                        ? "text-[#17384E] dark:text-white"
                        : "text-[#7B8D98] hover:text-[#355872] dark:text-[#8298A6] dark:hover:text-[#C7D8E1]"
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] ${
                        selected
                          ? "bg-[color:var(--gold)]/42 text-[#6F581D] shadow-[0_3px_10px_rgba(230,199,123,0.16)] dark:bg-[color:var(--gold)]/14 dark:text-[color:var(--gold)]"
                          : "bg-[#E9F0F3] text-[#7A8D99] dark:bg-white/[0.05] dark:text-[#8599A5]"
                      }`}
                    >
                      {filter.count}
                    </span>

                    {selected ? (
                      <span className="absolute inset-x-1.5 bottom-[-9px] h-[3px] rounded-t-full bg-[color:var(--gold)] shadow-[0_-2px_8px_rgba(230,199,123,0.24)]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="w-full min-w-0 lg:flex-1">
              <SearchFilterToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search linked courses..."
                className="[&>div:first-child]:!min-h-[56px] [&>div:first-child]:!rounded-[17px] [&>div:first-child]:!border-[#C4D8E3] [&>div:first-child]:!bg-white [&>div:first-child]:shadow-[0_10px_26px_rgba(53,88,114,0.09)] [&_input]:!min-h-[56px] [&_input]:!pl-[3.15rem] [&_input]:text-[13.5px] [&_input]:font-bold"
              />
            </div>
          </div>

          {visibleCourses.length ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  projects={projects}
                  instructorId={instructorId}
                  onOpen={(selectedCourse, view = "all") =>
                    navigate(
                      `/instructor/courses/${encodeURIComponent(
                        selectedCourse.id
                      )}/projects${view !== "all" ? `?view=${encodeURIComponent(view)}` : ""}`
                    )
                  }
                  onUnlink={handleUnlink}
                  pinned={pinnedSet.has(String(course.id))}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#C9DBE4] bg-white/55 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <BookCheck className="mx-auto h-7 w-7 text-[#55758B] dark:text-[#9CD5FF]" />
              <h2 className="mt-4 text-xl font-black text-[color:var(--ink)]">
                No linked courses match your search
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-[13px] font-semibold leading-6 text-[color:var(--muted)]">
                Clear the search or selected filter to see your linked courses.
              </p>
            </div>
          )}

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageStartIndex={start}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setPage}
            ariaLabel="My courses pagination"
          />
        </div>
      </main>
    </DashboardLayout>
  );
}
