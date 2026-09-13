import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Link2,
  Unlink,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import InstructorWorkspaceShell from "@/components/instructorWorkspace/InstructorWorkspaceShell";
import InstructorWorkspaceHeader from "@/components/instructorWorkspace/InstructorWorkspaceHeader";
import InstructorWorkspaceTabs from "@/components/instructorWorkspace/InstructorWorkspaceTabs";
import InstructorControlBar from "@/components/instructorWorkspace/InstructorControlBar";
import InstructorSearchField from "@/components/instructorWorkspace/InstructorSearchField";
import Pagination from "@/components/common/Pagination";
import {
  getAllCoursesForInstructorView,
  requestCourseLinkChange,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 6;

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "linked", label: "Linked" },
  { id: "available", label: "Available" },
  { id: "pending", label: "Pending" },
];

const SORT_OPTIONS = ["Code A–Z", "Course A–Z", "Most projects"];

function getCourseVisualState(course) {
  if (course.isBachelorProject) return "auto";
  if (course.requestStatus === "pending") return "pending";
  if (course.linked) return "linked";
  return "available";
}

function CourseStatus({ course }) {
  if (course.isBachelorProject) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D49E] bg-[#FFF8E6] px-2.5 py-1 text-[10px] font-black text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]">
        <GraduationCap className="h-3 w-3" />
        Auto-linked
      </span>
    );
  }

  if (course.requestStatus === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D49E] bg-[#FFF8E6] px-2.5 py-1 text-[10px] font-black text-[#8A6A18] dark:border-[#E6C77B]/16 dark:bg-[#E6C77B]/8 dark:text-[#E6C77B]">
        <Clock3 className="h-3 w-3" />
        Pending {course.requestAction}
      </span>
    );
  }

  if (course.linked) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CFE0D7] bg-[#F1F8F4] px-2.5 py-1 text-[10px] font-black text-[#4B735D] dark:border-emerald-300/10 dark:bg-emerald-300/[0.06] dark:text-emerald-200">
        <CheckCircle2 className="h-3 w-3" />
        Linked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-[#D8E4E9] bg-[#F5F9FB] px-2.5 py-1 text-[10px] font-black text-[#708591] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#8FA3AE]">
      Available
    </span>
  );
}

function CourseAction({ course, onRequested }) {
  const [loading, setLoading] = useState(false);

  if (course.isBachelorProject) return null;

  if (course.requestStatus === "pending") {
    return (
      <span className="text-[11px] font-black text-[#9A7618] dark:text-[#E6C77B]">
        Awaiting admin review
      </span>
    );
  }

  const action = course.linked ? "unlink" : "link";

  const submit = () => {
    setLoading(true);

    try {
      requestCourseLinkChange(course.id, action);
      toast.success(action === "link" ? "Link request sent" : "Unlink request sent", {
        description: `Admin will review your request for ${course.code}.`,
      });
      onRequested?.();
    } catch (error) {
      toast.error(error?.message || "Could not send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={submit}
      disabled={loading}
      className={
        course.linked
          ? "inline-flex h-10 items-center gap-2 rounded-[13px] px-3 text-[11px] font-black text-[#7A8C97] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-45 dark:text-[#8FA3AE] dark:hover:bg-red-400/10 dark:hover:text-red-300"
          : "inline-flex h-10 items-center gap-2 rounded-[13px] bg-[#355872] px-4 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(53,88,114,0.15)] transition hover:bg-[#294A61] disabled:opacity-45 dark:bg-[#9CD5FF] dark:text-[#071521] dark:hover:bg-[#B6E2FF]"
      }
    >
      {course.linked ? <Unlink className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
      {loading ? "Sending..." : course.linked ? "Request unlink" : "Request link"}
    </button>
  );
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState(() => getAllCoursesForInstructorView());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("Code A–Z");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [page, setPage] = useState(1);

  const refresh = () => setCourses(getAllCoursesForInstructorView());

  useEffect(() => {
    refresh();
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!sortRef.current?.contains(event.target)) setSortOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const counts = useMemo(
    () => ({
      all: courses.length,
      linked: courses.filter((course) => course.linked).length,
      available: courses.filter(
        (course) => !course.linked && course.requestStatus !== "pending"
      ).length,
      pending: courses.filter((course) => !course.isBachelorProject && course.requestStatus === "pending").length,
    }),
    [courses]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesSearch =
          !query ||
          `${course.code} ${course.name} ${course.type} ${course.instructor}`
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          status === "all" ||
          (status === "linked" && course.linked) ||
          (status === "available" &&
            !course.linked &&
            course.requestStatus !== "pending") ||
          (status === "pending" && !course.isBachelorProject && course.requestStatus === "pending");

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "Course A–Z") return a.name.localeCompare(b.name);
        if (sort === "Most projects") return Number(b.linkedProjects || 0) - Number(a.linkedProjects || 0);
        return String(a.code || "").localeCompare(String(b.code || ""));
      });
  }, [courses, search, status, sort]);

  useEffect(() => setPage(1), [search, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleCourses = filtered.slice(start, start + ITEMS_PER_PAGE);

  const tabItems = STATUS_TABS.map((tab) => ({
    ...tab,
    count: counts[tab.id],
  }));

  const sortControl = (
    <div ref={sortRef} className="relative w-full sm:w-[210px] sm:shrink-0">
      <button
        type="button"
        onClick={() => setSortOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={sortOpen}
        className={`flex h-[52px] w-full items-center justify-between rounded-[17px] border px-4 text-left shadow-[0_9px_24px_rgba(53,88,114,0.08)] outline-none transition ${
          sortOpen
            ? "border-[color:var(--primary)]/45 bg-[color:var(--primary)]/[0.075] ring-4 ring-[color:var(--primary)]/10"
            : "border-[#C8DAE4] bg-white hover:border-[color:var(--primary)]/30"
        } dark:border-white/12 dark:bg-[#102638]`}
      >
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-[#7B8E9A] dark:text-[#7F98A8]">
            Sort by
          </span>
          <span className="mt-0.5 block truncate text-[12px] font-black text-[color:var(--ink)]">
            {sort}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#55758B] transition-transform ${sortOpen ? "rotate-180" : ""}`}
        />
      </button>

      {sortOpen ? (
        <div
          role="listbox"
          aria-label="Sort courses"
          className="absolute right-0 top-[58px] z-30 w-full overflow-hidden rounded-[17px] border border-[#C9DBE4] bg-white p-1.5 shadow-[0_18px_44px_rgba(29,63,84,0.20)] dark:border-white/12 dark:bg-[#102638]"
        >
          {SORT_OPTIONS.map((option) => {
            const selected = sort === option;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setSort(option);
                  setSortOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-left text-[12px] font-bold transition ${
                  selected
                    ? "bg-[color:var(--primary)] text-white"
                    : "text-[color:var(--ink)] hover:bg-[color:var(--primary)]/[0.075]"
                }`}
              >
                {option}
                {selected ? <Check className="h-3.5 w-3.5" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  return (
    <InstructorWorkspaceShell>
      <InstructorWorkspaceHeader
        eyebrow="Academic catalog"
        title="All Courses"
        description="Browse the academic catalog and request access to the courses you teach."
      />

      <InstructorControlBar
        tabs={
          <InstructorWorkspaceTabs
            items={tabItems}
            value={status}
            onChange={setStatus}
            ariaLabel="Filter all courses"
          />
        }
        controls={
          <>
            <InstructorSearchField
              value={search}
              onChange={setSearch}
              placeholder="Search course code, title, or instructor..."
              className="w-full sm:min-w-[360px] sm:flex-1 xl:min-w-[430px]"
            />
            {sortControl}
          </>
        }
      />

          <section className="overflow-hidden rounded-[28px] border border-[#C9DCE5] bg-white shadow-[0_22px_54px_rgba(53,88,114,0.11)] dark:border-white/10 dark:bg-[#0E2232]/90">
            {visibleCourses.length ? (
              <div className="divide-y divide-[#DDE7EB] dark:divide-white/8">
                {visibleCourses.map((course) => {
                  const visualState = getCourseVisualState(course);
                  const rowTone = {
                    auto: "border-l-[4px] border-l-[color:var(--gold)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--gold)_10%,white)_0%,rgba(255,255,255,0.96)_24%,rgba(255,255,255,0.90)_100%)] hover:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--gold)_14%,white)_0%,white_28%,rgba(255,255,255,0.96)_100%)]",
                    pending: "border-l-[4px] border-l-[color:var(--gold)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--gold)_8%,white)_0%,rgba(255,255,255,0.95)_24%,rgba(255,255,255,0.90)_100%)] hover:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--gold)_12%,white)_0%,white_28%,rgba(255,255,255,0.96)_100%)]",
                    linked: "border-l-[4px] border-l-[color:var(--primary)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_8%,white)_0%,rgba(255,255,255,0.95)_24%,rgba(255,255,255,0.90)_100%)] hover:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_12%,white)_0%,white_28%,rgba(255,255,255,0.96)_100%)]",
                    available: "border-l-[4px] border-l-[#8DB5CB] bg-[linear-gradient(90deg,#EEF7FB_0%,rgba(255,255,255,0.95)_24%,rgba(255,255,255,0.90)_100%)] hover:bg-[linear-gradient(90deg,#E6F3F9_0%,white_28%,rgba(255,255,255,0.96)_100%)]",
                  }[visualState];

                  const codeTone = {
                    auto: "border-[color:var(--gold)]/35 bg-[color:var(--gold)]/12 text-[#7B6220]",
                    pending: "border-[color:var(--gold)]/28 bg-[color:var(--gold)]/10 text-[#80671F]",
                    linked: "border-[color:var(--primary)]/28 bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
                    available: "border-[#BFD8E5] bg-[#EAF5FA] text-[#3E6A83]",
                  }[visualState];

                  return (
                  <article
                    key={course.id}
                    className={`grid gap-4 px-5 py-5 transition md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center ${rowTone} dark:bg-transparent dark:hover:bg-white/[0.035]`}
                  >
                    <div>
                      <div className={`inline-flex min-w-[104px] items-center gap-2 rounded-[14px] border px-3 py-2.5 shadow-[0_6px_16px_rgba(53,88,114,0.06)] ${codeTone} dark:border-white/10 dark:bg-white/[0.045] dark:text-[#9CD5FF]`}>
                        <BookOpen className="h-4 w-4" />
                        <span className="text-[12px] font-black">
                          {course.isBachelorProject ? "Bachelor" : course.code}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-black text-[color:var(--ink)]">
                          {course.name}
                        </h2>
                        <CourseStatus course={course} />
                      </div>

                      <p className="mt-1.5 text-[11.5px] font-semibold text-[color:var(--muted)]">
                        {course.instructor || "No instructors assigned"} · {course.linkedProjects || 0} project{Number(course.linkedProjects || 0) === 1 ? "" : "s"}
                      </p>

                      <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-[#84949E] dark:text-[#7F949F]">
                        {course.type || "Academic course"}
                      </p>
                    </div>

                    <div className="flex justify-start md:justify-end">
                      <CourseAction course={course} onRequested={refresh} />
                    </div>
                  </article>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <BookOpen className="mx-auto h-7 w-7 text-[#55758B] dark:text-[#9CD5FF]" />
                <h2 className="mt-4 text-xl font-black text-[color:var(--ink)]">
                  No courses match these filters
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-[13px] font-semibold leading-6 text-[color:var(--muted)]">
                  Try a different search or clear the current status filter.
                </p>
              </div>
            )}
          </section>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageStartIndex={start}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setPage}
        ariaLabel="Course catalog pagination"
      />
    </InstructorWorkspaceShell>
  );
}
