import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Link2, Unlink } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import {
  getAllCoursesForInstructorView,
  requestCourseLinkChange,
} from "@/data/demoStore";

const courseGrid = "lg:grid-cols-[0.75fr_1.5fr_0.9fr_1.25fr_0.75fr_0.9fr_1.45fr]";

function CourseRequestButton({ course, onRequested }) {
  const [loading, setLoading] = useState(false);

  const linked = course.linked;
  const pending = course.requestStatus === "pending";
  const action = linked ? "unlink" : "link";

  const submitRequest = () => {
    setLoading(true);

    try {
      requestCourseLinkChange(course.id, action);
      toast.success(action === "unlink" ? "Unlink request sent" : "Link request sent", {
        description: `Admin will review your request for ${course.code}.`,
      });
      onRequested?.();
    } catch (error) {
      toast.error(error?.message || "Could not send request.");
    } finally {
      setLoading(false);
    }
  };

  if (course.isBachelorProject) {
    return (
      <span className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-3 py-2 text-xs font-black text-[color:var(--primary)]">
        <CheckCircle2 className="h-4 w-4" />
        Auto-linked
      </span>
    );
  }

  if (pending) {
    return (
      <span className="inline-flex items-center rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
        Pending {course.requestAction}
      </span>
    );
  }

  return (
     <AppButton
    size="sm"
    variant={linked ? "danger" : "brand"}
    onClick={submitRequest}
    disabled={loading}
    className={
      linked
        ? "min-w-[132px]"
        : "min-w-[132px] bg-gradient-to-r from-[#355872] via-[#4f7fa3] to-[#7AAACE] text-white shadow-[0_14px_32px_rgba(53,88,114,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(53,88,114,0.28)]"
    }
  >
    {linked ? (
      <Unlink className="mr-2 h-4 w-4" />
    ) : (
      <Link2 className="mr-2 h-4 w-4" />
    )}
    {loading ? "Sending..." : linked ? "Request unlink" : "Request link"}
  </AppButton>
);
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState(() => getAllCoursesForInstructorView());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const haystack = `${course.code} ${course.name} ${course.type} ${course.instructor}`.toLowerCase();
      const statusMatch =
        status === "all" ||
        (status === "linked" && course.linked) ||
        (status === "not linked" && !course.linked) ||
        (status === "pending" && course.requestStatus === "pending");

      return haystack.includes(search.toLowerCase()) && statusMatch;
    });
  }, [courses, search, status]);

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (course) => (
        <p className="font-black text-[color:var(--ink)]">
          {course.type === "Bachelor Project" ? "-" : course.code}
        </p>
      ),
    },
    {
      key: "name",
      label: "Course",
      render: (course) => <p className="text-sm font-black text-[color:var(--ink)]">{course.name}</p>,
    },
    {
        key: "type",
        label: "Type",
        render: (course) =>
          course.type === "Bachelor Project" ? null : (
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              {course.type}
            </p>
          ),
      },
    {
      key: "instructor",
      label: "Linked instructors",
      render: (course) => <p className="text-sm font-semibold text-[color:var(--muted)]">{course.instructor}</p>,
    },
    {
      key: "linkedProjects",
      label: "Projects",
      render: (course) => <p className="text-sm font-black text-[color:var(--ink)]">{course.linkedProjects}</p>,
    },
    {
      key: "status",
      label: "My status",
      render: (course) => course.linked ? <AdminStatusBadge status="active" /> : <AdminStatusBadge status="pending" />,
    },
    {
      key: "actions",
      label: "Action",
      render: (course) => <CourseRequestButton course={course} onRequested={refresh} />,
    },
  ];

  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      

        <div className="min-h-screen p-8 space-y-6">
  

<h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
           Courses
          </h1>

          <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            View every course in the academic catalog and request to link or unlink yourself from the courses you teach. Bachelor Project is automatically linked for all course instructors.
            </p>

        <AppCard variant="strong" radius="lg" padding="lg">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">Instructor rules</p>
              <h2 className="mt-1 text-2xl font-black text-[color:var(--ink)]">{courses.filter((course) => course.linked).length} linked course{courses.filter((course) => course.linked).length === 1 ? "" : "s"}</h2>
              <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">Requests are saved in the demo database and appear in the admin Link Requests page with notifications.</p>
            </div>
            <AdminStatusBadge status="active" />
          </div>
        </AppCard>

        <SearchFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search courses..."
          showFilters
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((current) => !current)}
          filterTitle="Filter courses"
          onClearFilters={() => setStatus("all")}
        >
          <FilterSelect
            value={`Status: ${status === "all" ? "All courses" : status}`}
            onChange={(value) => {
              const next = value.replace("Status: ", "");
              setStatus(next === "All courses" ? "all" : next);
            }}
            options={["Status: All courses", "Status: linked", "Status: not linked", "Status: pending"]}
          />
        </SearchFilterToolbar>

        <AdminGridTable columns={columns} rows={filtered} gridTemplate={courseGrid} emptyMessage="No courses found" />
      </div>
    </DashboardLayout>
  );
}