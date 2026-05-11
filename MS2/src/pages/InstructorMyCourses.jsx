import { useEffect, useMemo, useState } from "react";
import { BookMarked, CheckCircle2, Unlink } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import {
  getLinkedCoursesForInstructor,
  requestCourseLinkChange,
} from "@/data/demoStore";

const courseGrid = "lg:grid-cols-[0.75fr_1.55fr_0.9fr_1.35fr_0.75fr_0.9fr_1.35fr]";

function UnlinkAction({ course, onRequested }) {
  const [loading, setLoading] = useState(false);

  const submitRequest = () => {
    setLoading(true);

    try {
      requestCourseLinkChange(course.id, "unlink");
      toast.success("Unlink request sent", {
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
        Required course
      </span>
    );
  }

  if (course.requestStatus === "pending") {
    return (
      <span className="inline-flex items-center rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
        Pending {course.requestAction}
      </span>
    );
  }

  return (
    <AppButton size="sm" variant="danger" onClick={submitRequest} disabled={loading} className="min-w-[142px]">
      <Unlink className="mr-2 h-4 w-4" />
      {loading ? "Sending..." : "Request unlink"}
    </AppButton>
  );
}

export default function InstructorMyCourses() {
  const [courses, setCourses] = useState(() => getLinkedCoursesForInstructor());
  const [search, setSearch] = useState("");

  const refresh = () => setCourses(getLinkedCoursesForInstructor());

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
      return haystack.includes(search.toLowerCase());
    });
  }, [courses, search]);

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (course) => <p className="font-black text-[color:var(--ink)]">{course.code}</p>,
    },
    {
      key: "name",
      label: "Course",
      render: (course) => <p className="text-sm font-black text-[color:var(--ink)]">{course.name}</p>,
    },
    {
      key: "type",
      label: "Type",
      render: (course) => <p className="text-sm font-semibold text-[color:var(--muted)]">{course.type}</p>,
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
      label: "Status",
      render: () => <AdminStatusBadge status="active" />,
    },
    {
      key: "actions",
      label: "Action",
      render: (course) => <UnlinkAction course={course} onRequested={refresh} />,
    },
  ];

  return (
    <DashboardLayout workspace="instructor" workspaceLabel="Instructor Workspace">
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="My teaching courses"
          title="My Courses"
          description="These are the courses currently linked to your instructor account. You can request unlinking for normal courses; Bachelor Project stays automatically linked."
          icon={BookMarked}
        />

        <AppCard variant="strong" radius="lg" padding="lg">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">Linked courses</p>
              <h2 className="mt-1 text-2xl font-black text-[color:var(--ink)]">{courses.length} current course{courses.length === 1 ? "" : "s"}</h2>
              <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">New instructor accounts start here with Bachelor Project only, then can request more links from Courses.</p>
            </div>
            <AdminStatusBadge status="active" />
          </div>
        </AppCard>

        <SearchFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search my linked courses..."
        />

        <AdminGridTable columns={columns} rows={filtered} gridTemplate={courseGrid} emptyMessage="You are not linked to any courses yet except Bachelor Project." />
      </div>
    </DashboardLayout>
  );
}