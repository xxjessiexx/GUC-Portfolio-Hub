import { useMemo, useState } from "react";
import { Pencil, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const inputStyles =
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";

const courseGrid =
  "lg:grid-cols-[0.75fr_1.5fr_0.8fr_1.2fr_0.7fr_0.8fr_1.3fr]";

function EditField({ label, value, onChange, placeholder }) {
  return (
    <label className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </Label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputStyles}
      />
    </label>
  );
}

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
      <AdminPageHeader
        eyebrow="Academic Catalog"
        title="Course Management"
        description="View, edit, activate, deactivate, and delete course records used across projects and instructor linking."
        actionLabel="Create Course"
        actionTo="/admin/courses/create"
        icon={Plus}
      />

      {editingCourse && (
        <AppCard
          variant="strong"
          radius="xl"
          padding="lg"
          className="border border-[color:var(--accent)]/40"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                Edit course
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[color:var(--ink)]">
                {editingCourse.code}
              </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                Update the catalog record without leaving the management table.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <AppButton
                variant="glass"
                size="sm"
                onClick={() => setEditingCourse(null)}
              >
                <X className="size-4" />
                Cancel
              </AppButton>

              <AppButton variant="brand" size="sm" onClick={saveEdit}>
                <Save className="size-4" />
                Save changes
              </AppButton>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <EditField
              label="Code"
              value={editingCourse.code}
              onChange={(value) =>
                setEditingCourse((prev) => ({ ...prev, code: value }))
              }
              placeholder="CSEN501"
            />

            <EditField
              label="Name"
              value={editingCourse.name}
              onChange={(value) =>
                setEditingCourse((prev) => ({ ...prev, name: value }))
              }
              placeholder="Software Engineering"
            />

            <EditField
              label="Type"
              value={editingCourse.type}
              onChange={(value) =>
                setEditingCourse((prev) => ({ ...prev, type: value }))
              }
              placeholder="Course"
            />

            <EditField
              label="Instructor"
              value={editingCourse.instructor}
              onChange={(value) =>
                setEditingCourse((prev) => ({ ...prev, instructor: value }))
              }
              placeholder="Unassigned"
            />
          </div>

          <label className="mt-5 block space-y-2">
            <Label className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Admin note
            </Label>

            <textarea
              value={editingCourse.note || ""}
              onChange={(event) =>
                setEditingCourse((prev) => ({
                  ...prev,
                  note: event.target.value,
                }))
              }
              rows={3}
              placeholder="Optional reason for this edit..."
              className={`${inputStyles} min-h-[96px] w-full resize-none py-3`}
            />
          </label>
        </AppCard>
      )}

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
          onChange={(value) =>
            setStatus(
              value.replace("Status: ", "") === "All statuses"
                ? "all"
                : value.replace("Status: ", "")
            )
          }
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