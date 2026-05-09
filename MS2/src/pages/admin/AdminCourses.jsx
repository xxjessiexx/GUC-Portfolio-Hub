import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
import { AdminToolbar } from "@/components/adminModule/AdminToolbar";
import { AdminTable } from "@/components/adminModule/AdminTable";
import { AdminStatusBadge } from "@/components/adminModule/AdminStatusBadge";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const inputStyles = "min-h-11 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";

function EditField({ label, value, onChange, placeholder }) {
  return <label className="space-y-2"><Label className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</Label><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputStyles} /></label>;
}

export default function AdminCourses() {
  const { courses, actions } = useAdminModuleData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(() => courses.filter((course) => {
    const haystack = `${course.code} ${course.name} ${course.type} ${course.instructor}`.toLowerCase();
    return haystack.includes(search.toLowerCase()) && (status === "all" || course.status === status);
  }), [courses, search, status]);

  const startEditing = (course) => setEditingCourse({ ...course, note: "" });
  const openDecision = (course, action, nextStatus) => { setDecision({ course, action, nextStatus }); setNote(""); };

  const saveEdit = () => {
    if (!editingCourse?.code?.trim() || !editingCourse?.name?.trim()) { toast.error("Course code and name are required."); return; }
    actions.updateCourse(editingCourse.id, { code: editingCourse.code.trim().toUpperCase(), name: editingCourse.name.trim(), type: editingCourse.type.trim() || "Course", instructor: editingCourse.instructor.trim() || "Unassigned" }, editingCourse.note?.trim());
    toast.success("Course updated", { description: `${editingCourse.code.toUpperCase()} was updated.` });
    setEditingCourse(null);
  };

  const confirmDecision = () => {
    if ((decision.action === "delete" || decision.nextStatus === "inactive") && !note.trim()) return;
    if (decision.action === "delete") actions.deleteCourse(decision.course.id, note.trim());
    else actions.setCourseStatus(decision.course.id, decision.nextStatus, note.trim());
    toast.success(decision.action === "delete" ? "Course deleted" : "Course status updated");
    setDecision(null);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader eyebrow="Academic catalog" title="Course management" description="View, edit, activate, deactivate and delete course records used across projects and instructor linking." actionLabel="Create course" onAction={() => { window.location.href = "/admin/courses/create"; }} icon={Plus} />
      <div className="flex justify-end"><AppButton as={Link} to="/admin/courses/create" variant="brand" size="lg"><Plus className="size-4" />Create course</AppButton></div>

      {editingCourse ? (
        <AppCard variant="strong" radius="lg" padding="lg" className="border-[color:var(--accent)]/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--secondary)]">Edit course</p><h2 className="mt-1 text-2xl font-black tracking-tight text-[color:var(--ink)]">{editingCourse.code}</h2><p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">Update the catalog record without leaving the management table.</p></div>
            <div className="flex gap-2"><AppButton variant="glass" size="sm" onClick={() => setEditingCourse(null)}><X className="size-4" />Cancel</AppButton><AppButton variant="brand" size="sm" onClick={saveEdit}><Save className="size-4" />Save changes</AppButton></div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4"><EditField label="Code" value={editingCourse.code} onChange={(value) => setEditingCourse((prev) => ({ ...prev, code: value }))} placeholder="CSEN501" /><EditField label="Name" value={editingCourse.name} onChange={(value) => setEditingCourse((prev) => ({ ...prev, name: value }))} placeholder="Software Engineering" /><EditField label="Type" value={editingCourse.type} onChange={(value) => setEditingCourse((prev) => ({ ...prev, type: value }))} placeholder="Course" /><EditField label="Instructor" value={editingCourse.instructor} onChange={(value) => setEditingCourse((prev) => ({ ...prev, instructor: value }))} placeholder="Unassigned" /></div>
          <label className="mt-4 block space-y-2"><Label className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Admin note</Label><textarea value={editingCourse.note || ""} onChange={(event) => setEditingCourse((prev) => ({ ...prev, note: event.target.value }))} rows={3} placeholder="Optional reason for this edit..." className={`${inputStyles} min-h-[90px] w-full resize-none py-3`} /></label>
        </AppCard>
      ) : null}

      <AdminToolbar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} statusOptions={["active", "inactive"]} />
      <AdminTable rows={filtered} columns={[
        { key: "code", label: "Code" }, { key: "name", label: "Course" }, { key: "type", label: "Type" }, { key: "instructor", label: "Instructor" }, { key: "linkedProjects", label: "Projects" }, { key: "status", label: "Status", render: (row) => <AdminStatusBadge status={row.status} /> },
        { key: "actions", label: "Actions", render: (row) => <div className="flex flex-wrap gap-2"><AppButton variant="glass" size="sm" onClick={() => startEditing(row)}><Pencil className="size-4" />Edit</AppButton><AppButton variant="glass" size="sm" onClick={() => openDecision(row, "status", row.status === "active" ? "inactive" : "active")}>{row.status === "active" ? "Deactivate" : "Activate"}</AppButton><AppButton variant="danger" size="sm" onClick={() => openDecision(row, "delete")}>Delete</AppButton></div> },
      ]} />

      <AdminActionDialog open={Boolean(decision)} tone={decision?.action === "delete" || decision?.nextStatus === "inactive" ? "danger" : "brand"} title={decision?.action === "delete" ? "Delete this course?" : `${decision?.nextStatus === "inactive" ? "Deactivate" : "Activate"} this course?`} description={decision ? `${decision.course.code} - ${decision.course.name}` : ""} confirmLabel={decision?.action === "delete" ? "Delete course" : "Confirm change"} noteRequired={decision?.action === "delete" || decision?.nextStatus === "inactive"} noteValue={note} onNoteChange={setNote} onCancel={() => setDecision(null)} onConfirm={confirmDecision} />
    </AdminPageShell>
  );
}
