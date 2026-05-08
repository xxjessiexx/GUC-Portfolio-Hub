import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { CourseForm } from "@/components/adminModule/AdminForms";
import { AppButton } from "@/components/ui/AppButton";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

export default function AdminCourses() {
  const { courses, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => courses.filter((course) => {
    const haystack = `${course.code} ${course.name} ${course.type} ${course.instructor}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || course.status === status);
  }), [courses, search, status]);

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Academic catalog" title="Course management" description="Create, view, activate, deactivate and delete course records used across projects and instructor linking." icon={BookOpen} />
      <CourseForm onCreate={actions.addCourse} />
      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["active", "inactive"]} />
      <AdminTable
        rows={filtered}
        columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Course" },
          { key: "type", label: "Type" },
          { key: "instructor", label: "Instructor" },
          { key: "linkedProjects", label: "Projects" },
          { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
          { key: "actions", label: "Actions", render: (row) => (
            <div className="flex flex-wrap gap-2">
              <AppButton variant="glass" size="sm" onClick={() => actions.setCourseStatus(row.id, row.status === "active" ? "inactive" : "active")}>{row.status === "active" ? "Deactivate" : "Activate"}</AppButton>
              <AppButton variant="danger" size="sm" onClick={() => actions.deleteCourse(row.id)}>Delete</AppButton>
            </div>
          )},
        ]}
      />
    </AdminPageShell>
  );
}
