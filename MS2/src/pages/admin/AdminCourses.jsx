import { useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import AdminCourseEditPanel from "@/components/adminModule/AdminCourseEditPanel";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { AppButton } from "@/components/ui/AppButton";
import { Link } from "react-router-dom";

const courseGrid =
  "lg:grid-cols-[0.75fr_1.5fr_0.8fr_1.2fr_0.7fr_0.8fr_1.3fr]";

export default function AdminCourses() {
  const { courses, actions } = useAdminModuleData();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(
    () =>
      courses.filter((course) => {
        const haystack =
          `${course.code} ${course.name} ${course.type} ${course.instructor}`.toLowerCase();

        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "all" || course.status === status)
        );
      }),
    [courses, search, status]
  );

  const startEditing = (course) => {
    setEditingCourse({ ...course, note: "" });
  };

  const openDecision = (course, action, nextStatus) => {
    setDecision({ course, action, nextStatus });
    setNote("");
  };

  const saveEdit = () => {
    if (!editingCourse?.code?.trim() || !editingCourse?.name?.trim()) {
      toast.error("Course code and name are required.");
      return;
    }

    actions.updateCourse(
      editingCourse.id,
      {
        code: editingCourse.code.trim().toUpperCase(),
        name: editingCourse.name.trim(),
        type: editingCourse.type.trim() || "Course",
        instructor: editingCourse.instructor.trim() || "Unassigned",
      },
      editingCourse.note?.trim()
    );

    toast.success("Course updated", {
      description: `${editingCourse.code.toUpperCase()} was updated.`,
    });

    setEditingCourse(null);
  };

  const confirmDecision = () => {
    if (
      (decision.action === "delete" || decision.nextStatus === "inactive") &&
      !note.trim()
    ) {
      return;
    }

    if (decision.action === "delete") {
      actions.deleteCourse(decision.course.id, note.trim());
    } else {
      actions.setCourseStatus(
        decision.course.id,
        decision.nextStatus,
        note.trim()
      );
    }

    toast.success(
      decision.action === "delete" ? "Course deleted" : "Course status updated"
    );

    setDecision(null);
  };

  const courseColumns = [
    {
      key: "code",
      label: "Code",
      render: (course) => (
        <p className="font-black text-[color:var(--ink)]">{course.code}</p>
      ),
    },
    {
      key: "name",
      label: "Course",
      render: (course) => (
        <p className="text-sm font-black text-[color:var(--ink)]">
          {course.name}
        </p>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (course) => (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {course.type}
        </p>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (course) => (
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {course.instructor}
        </p>
      ),
    },
    {
      key: "linkedProjects",
      label: "Projects",
      render: (course) => (
        <p className="text-sm font-black text-[color:var(--ink)]">
          {course.linkedProjects}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (course) => <AdminStatusBadge status={course.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (course) => (
        <AdminTableActions
          rowId={course.id}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          actions={[
            {
              label: "Edit course",
              icon: Pencil,
              onClick: () => startEditing(course),
            },
            {
              label:
                course.status === "active"
                  ? "Deactivate course"
                  : "Activate course",
              onClick: () =>
                openDecision(
                  course,
                  "status",
                  course.status === "active" ? "inactive" : "active"
                ),
            },
            {
              label: "Delete course",
              danger: true,
              onClick: () => openDecision(course, "delete"),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          eyebrow="Academic Catalog"
          title="Course Management"
          description="View, edit, activate, deactivate, and delete course records used across projects and instructor linking."
        />

        <AppButton
          as={Link}
          to="/admin/courses/create"
          className="h-14 rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base font-black text-white shadow-none hover:from-[#263849] hover:to-[#6A9DBF]"
        >
          <Plus className="size-5" />
          Create Course
        </AppButton>
      </div>

      <AdminCourseEditPanel
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
        onCancel={() => setEditingCourse(null)}
        onSave={saveEdit}
      />

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
          value={`Status: ${status === "all" ? "All statuses" : status}`}
          onChange={(value) => {
            const next = value.replace("Status: ", "");
            setStatus(next === "All statuses" ? "all" : next);
          }}
          options={[
            "Status: All statuses",
            "Status: active",
            "Status: inactive",
          ]}
        />
      </SearchFilterToolbar>

      <AdminGridTable
        columns={courseColumns}
        rows={filtered}
        gridTemplate={courseGrid}
        emptyMessage="No courses found"
      />

      <AdminActionDialog
        open={Boolean(decision)}
        tone={
          decision?.action === "delete" || decision?.nextStatus === "inactive"
            ? "danger"
            : "brand"
        }
        title={
          decision?.action === "delete"
            ? "Delete this course?"
            : `${
                decision?.nextStatus === "inactive" ? "Deactivate" : "Activate"
              } this course?`
        }
        description={
          decision ? `${decision.course.code} - ${decision.course.name}` : ""
        }
        confirmLabel={
          decision?.action === "delete" ? "Delete course" : "Confirm change"
        }
        noteRequired={
          decision?.action === "delete" || decision?.nextStatus === "inactive"
        }
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => setDecision(null)}
        onConfirm={confirmDecision}
      />
    </AdminPageShell>
  );
}
