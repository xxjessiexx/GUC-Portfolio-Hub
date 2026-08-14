import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";



import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminGridTable } from "@/components/adminModule/AdminTable";
import AdminTableActions from "@/components/adminModule/AdminTableActions";
import AdminCourseEditPanel from "@/components/adminModule/AdminCourseEditPanel";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { AppButton } from "@/components/ui/AppButton";
import SideToast from "@/components/ui/SideToast";
import { Link, useNavigate } from "react-router-dom";

const courseGrid =
  "lg:grid-cols-[0.75fr_1.5fr_0.8fr_1.2fr_0.7fr_0.8fr_1.3fr]";

export default function AdminCourses() {
  const { courses, actions } = useAdminModuleData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});
  const [status, setStatus] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    type: "success",
  });

  useEffect(() => {
    if (!toastData.open) return;

    const timer = setTimeout(() => {
      setToastData((current) => ({
        ...current,
        open: false,
      }));
    }, 4000);

    return () => clearTimeout(timer);
  }, [toastData.open]);

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
    setEditingCourse({
      ...course,
      note: "",
    });
  };

  const openDecision = (course, action, nextStatus) => {
    setDecision({
      course,
      action,
      nextStatus,
    });

    setNote("");
  };

  const saveEdit = () => {
    if (
      !editingCourse?.code?.trim() ||
      !editingCourse?.name?.trim()
    ) {
      setToastData({
        open: true,
        title: "Missing course details",
        description: "Course code and name are required.",
        type: "error",
      });

      return;
    }

    const updatedCode =
      editingCourse.code.trim().toUpperCase();

    actions.updateCourse(
      editingCourse.id,
      {
        code: updatedCode,
        name: editingCourse.name.trim(),
        type:
          editingCourse.type.trim() ||
          "Course",
        instructor:
          editingCourse.instructor.trim() ||
          "Unassigned",
      },
      editingCourse.note?.trim()
    );

    setToastData({
      open: true,
      title: "Course updated",
      description: `${updatedCode} was updated successfully.`,
      type: "success",
    });

    setEditingCourse(null);
  };

  const confirmDecision = () => {
    if (!decision) return;

    if (
      (decision.action === "delete" ||
        decision.nextStatus === "inactive") &&
      !note.trim()
    ) {
      return;
    }

    if (decision.action === "delete") {
      actions.deleteCourse(
        decision.course.id,
        note.trim()
      );

      setToastData({
        open: true,
        title: "Course deleted",
        description: `${decision.course.code} was deleted successfully.`,
        type: "success",
      });
    } else {
      actions.setCourseStatus(
        decision.course.id,
        decision.nextStatus,
        note.trim()
      );

      setToastData({
        open: true,
        title:
          decision.nextStatus === "active"
            ? "Course activated"
            : "Course deactivated",
        description: `${decision.course.code} was marked ${decision.nextStatus}.`,
        type: "success",
      });
    }

    setDecision(null);
    setNote("");
  };

  const courseColumns = [
    {
      key: "code",
      label: "Code",
      render: (course) => (
        <p className="font-black text-[color:var(--ink)]">
          {course.type === "Bachelor Project"
            ? "-"
            : course.code}
        </p>
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
      render: (course) =>
        course.type === "Bachelor Project" ? null : (
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
      render: (course) => (
        <AdminStatusBadge status={course.status} />
      ),
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
              onClick: () =>
                startEditing(course),
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
                  course.status === "active"
                    ? "inactive"
                    : "active"
                ),
            },

            {
              label: "Delete course",
              danger: true,
              onClick: () =>
                openDecision(
                  course,
                  "delete"
                ),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPageShell>
      <SideToast
  open={toast.open}
  title={toast.title}
  description={toast.description}
  type={toast.type}
  onClose={() =>
    setToast((current) => ({
      ...current,
      open: false,
    }))
  }
/>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <SectionHeader
        className="
          [&_h2]:mt-3
          [&_h2]:text-4xl
          [&_h2]:font-black
          [&_h2]:tracking-tight
          [&_h2]:text-[color:var(--ink)]
          sm:[&_h2]:text-5xl
      
          [&_p]:mt-3
          [&_p]:text-base
          [&_p]:font-semibold
          [&_p]:text-[color:var(--muted)]
        "
        title="Course Management"
        subtitle="View, edit, activate, deactivate, and delete course records used across projects and instructor linking."
        action={
                  <div className="-m-2">
                    <span
                      onClick={() => navigate("/admin/courses/create")}
                      className="inline-flex items-center rounded-2xl px-9 py-3 text-white font-semibold 
                      bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)]
      hover:bg-[linear-gradient(135deg,#355872_0%,#46739A_55%,#8CC3EA_100%)] shadow-md hover:bg-[#243f69] transition-all cursor-pointer  hover:-translate-y-1
            hover:scale-[1.02]
            hover:brightness-110
            hover:shadow-[0_24px_50px_rgba(53,88,114,.35)]  shadow-[0_12px_30px_rgba(53,88,114,.22)]
      
            transition-all
            duration-300
            ease-out
            hover:shadow-[0_20px_40px_rgba(53,88,114,.30),0_10px_45px_rgba(122,170,206,.35)] hover:bg-[linear-gradient(135deg,#1F2E3C_0%,#2D4B63_55%,#4F7EA4_100%)]"
                    >
                      + Create Course
                      
                    </span>
                    
                  </div>
                }
              />
      
      <AdminCourseEditPanel
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
        onCancel={() =>
          setEditingCourse(null)
        }
        onSave={saveEdit}
      />

      <SearchFilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses..."
        showFilters
        filtersOpen={filtersOpen}
        onToggleFilters={() =>
          setFiltersOpen(
            (current) => !current
          )
        }
        filterTitle="Filter courses"
        onClearFilters={() =>
          setStatus("all")
        }
      >
        <FilterSelect
          value={`Status: ${
            status === "all"
              ? "All statuses"
              : status
          }`}
          onChange={(value) => {
            const next = value.replace(
              "Status: ",
              ""
            );

            setStatus(
              next === "All statuses"
                ? "all"
                : next
            );
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

      </div>
      
      </main>

      
      <AdminActionDialog
        open={Boolean(decision)}
        tone={
          decision?.action === "delete" ||
          decision?.nextStatus === "inactive"
            ? "danger"
            : "brand"
        }
        title={
          decision?.action === "delete"
            ? "Delete this course?"
            : `${
                decision?.nextStatus ===
                "inactive"
                  ? "Deactivate"
                  : "Activate"
              } this course?`
        }
        description={
          decision
            ? `${decision.course.code} - ${decision.course.name}`
            : ""
        }
        confirmLabel={
          decision?.action === "delete"
            ? "Delete course"
            : "Confirm change"
        }
        noteRequired={
          decision?.action === "delete" ||
          decision?.nextStatus === "inactive"
        }
        noteValue={note}
        onNoteChange={setNote}
        onCancel={() => {
          setDecision(null);
          setNote("");
        }}
        onConfirm={confirmDecision}
      />

      <SideToast
        open={toastData.open}
        title={toastData.title}
        description={toastData.description}
        type={toastData.type}
        onClose={() =>
          setToastData((current) => ({
            ...current,
            open: false,
          }))
        }
      />
    </AdminPageShell>
  );
}