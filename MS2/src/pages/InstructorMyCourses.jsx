import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookCheck,
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
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

function CourseCard({ course, projects, instructorId, onOpen, onUnlink }) {
  const scopedProjects = getCourseProjects(course, projects);
  const unrated = scopedProjects.filter(
    (project) => getInstructorProjectRating(project, instructorId) === null
  ).length;
  const updated = scopedProjects.filter(
    (project) =>
      getInstructorProjectReviewState(project, instructorId).status === "updated"
  ).length;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(course)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(course);
        }
      }}
      className="
        group relative cursor-pointer overflow-hidden rounded-[26px]
        border border-white/80 bg-white/68
        p-5 shadow-[0_18px_46px_rgba(53,88,114,0.075)]
        transition duration-200
        hover:-translate-y-0.5 hover:border-[#D8CC98]
        hover:shadow-[0_24px_54px_rgba(53,88,114,0.11)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7AAACE]/45
        dark:border-white/10 dark:bg-white/[0.045]
        dark:hover:border-[#E6C77B]/20
      "
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#355872_0%,#7AAACE_58%,#E6C77B_100%)] opacity-70" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[#092433] text-[#9CD5FF] shadow-[0_10px_22px_rgba(9,36,51,0.16)] dark:bg-[#071923]">
            <BookCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#617987] dark:text-[#8CA1AD]">
                {course.isBachelorProject ? "Bachelor Project" : course.code}
              </p>
              <CourseState course={course} />
            </div>

            <h2 className="mt-2 line-clamp-2 text-[1.14rem] font-black leading-snug tracking-[-0.025em] text-[color:var(--ink)]">
              {course.name}
            </h2>

            <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-[color:var(--muted)]">
              {course.type || "Academic course"}
            </p>
          </div>
        </div>

        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#8AA0AD] transition duration-200 group-hover:translate-x-1 group-hover:text-[#355872] dark:group-hover:text-[#E6C77B]" />
      </div>

      <div className="mt-6 grid grid-cols-3 border-y border-[#DCE6EA] py-4 dark:border-white/8">
        <div>
          <p className="text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]">
            {scopedProjects.length}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">
            Projects
          </p>
        </div>

        <div className="border-l border-[#DCE6EA] pl-4 dark:border-white/8">
          <p className={updated ? "text-[1.55rem] font-black tracking-[-0.03em] text-[#A77E18] dark:text-[#E6C77B]" : "text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]"}>
            {updated}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">
            Updated
          </p>
        </div>

        <div className="border-l border-[#DCE6EA] pl-4 dark:border-white/8">
          <p className="text-[1.55rem] font-black tracking-[-0.03em] text-[color:var(--ink)]">
            {unrated}
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-[color:var(--muted)]">
            Unrated
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold text-[#6F8491] dark:text-[#8499A5]">
          {updated > 0
            ? `${updated} project${updated === 1 ? "" : "s"} changed since your last review`
            : unrated > 0
            ? `${unrated} project${unrated === 1 ? "" : "s"} not rated yet`
            : scopedProjects.length
            ? "No new project changes since your last reviews"
            : "No student projects are linked yet"}
        </p>

        <div className="flex items-center gap-2">
          {!course.isBachelorProject ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onUnlink(course);
              }}
              disabled={course.requestStatus === "pending"}
              className="inline-flex h-9 items-center gap-1.5 rounded-[12px] px-2.5 text-[10px] font-black text-[#81929C] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#8297A3] dark:hover:bg-red-400/10 dark:hover:text-red-300"
            >
              <Unlink className="h-3.5 w-3.5" />
              {course.requestStatus === "pending" ? "Pending" : "Unlink"}
            </button>
          ) : null}

          <span className="inline-flex h-9 items-center gap-1.5 rounded-[12px] bg-[#EEF5F8] px-3 text-[10px] font-black text-[#355872] transition group-hover:bg-[#E8F0F4] dark:bg-white/[0.055] dark:text-[#A9C5D4]">
            Open course
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
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
  const [page, setPage] = useState(1);

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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      if (!query) return true;

      return `${course.code} ${course.name} ${course.type} ${course.instructor}`
        .toLowerCase()
        .includes(query);
    });
  }, [courses, search]);

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleCourses = filtered.slice(start, start + ITEMS_PER_PAGE);

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
        <div className="mx-auto w-full max-w-[1480px] space-y-6">
          <PageHeader
            eyebrow="Teaching workspace"
            title="My Courses"
            description="Your active teaching responsibilities. Enter a course to review the student projects attached to it."
            action={
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#C9DBE4] bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:border-[#B9CED8] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
              >
                <GraduationCap className="h-4 w-4" />
                Browse all courses
              </button>
            }
          />

          <SearchFilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search your linked courses..."
          />

          {visibleCourses.length ? (
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  projects={projects}
                  instructorId={instructorId}
                  onOpen={(selectedCourse) =>
                    navigate(
                      `/instructor/courses/${encodeURIComponent(
                        selectedCourse.id
                      )}/projects`
                    )
                  }
                  onUnlink={handleUnlink}
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
                Clear the search or browse All Courses to request another teaching link.
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
