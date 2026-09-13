import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Link2,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
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

  const counts = useMemo(
    () => ({
      all: courses.length,
      linked: courses.filter((course) => course.linked).length,
      available: courses.filter(
        (course) => !course.linked && course.requestStatus !== "pending"
      ).length,
      pending: courses.filter((course) => course.requestStatus === "pending").length,
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
          (status === "pending" && course.requestStatus === "pending");

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

  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">
          <PageHeader
            eyebrow="Academic catalog"
            title="All Courses"
            description="Browse the full academic catalog and request access to the courses you teach. Your active teaching responsibilities stay in My Courses."
          />

          <div className="flex flex-wrap items-center gap-2 border-b border-[#D9E4E9] dark:border-white/10">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatus(tab.id)}
                  className={`relative inline-flex h-11 items-center gap-2 px-3 text-[12px] font-black transition ${
                    active
                      ? "text-[#17384E] dark:text-white"
                      : "text-[#7B8D98] hover:text-[#355872] dark:text-[#8298A6] dark:hover:text-[#C7D8E1]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-[#F2E5B8] text-[#7A6327] dark:bg-[#E6C77B]/12 dark:text-[#E6C77B]"
                        : "bg-[#E9F0F3] text-[#7A8D99] dark:bg-white/[0.05] dark:text-[#8599A5]"
                    }`}
                  >
                    {counts[tab.id]}
                  </span>

                  {active ? (
                    <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-[#E6C77B]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <SearchFilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search course code, title, or instructor..."
            showSort
            sortValue={`Sort by: ${sort}`}
            onSortChange={(value) => setSort(value.replace("Sort by: ", ""))}
            sortOptions={[
              "Sort by: Code A–Z",
              "Sort by: Course A–Z",
              "Sort by: Most projects",
            ]}
          />

          <section className="overflow-hidden rounded-[28px] border border-white/75 bg-white/58 shadow-[0_18px_48px_rgba(53,88,114,0.07)] dark:border-white/10 dark:bg-white/[0.035]">
            {visibleCourses.length ? (
              <div className="divide-y divide-[#DDE7EB] dark:divide-white/8">
                {visibleCourses.map((course) => (
                  <article
                    key={course.id}
                    className="grid gap-4 px-5 py-5 transition hover:bg-white/55 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-center dark:hover:bg-white/[0.025]"
                  >
                    <div>
                      <div className="inline-flex min-w-[104px] items-center gap-2 rounded-[14px] border border-[#D3E1E8] bg-[#EEF5F8] px-3 py-2.5 text-[#355872] dark:border-white/10 dark:bg-white/[0.045] dark:text-[#9CD5FF]">
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
                ))}
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
        </div>
      </main>
    </DashboardLayout>
  );
}
