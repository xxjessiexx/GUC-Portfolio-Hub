import { Save, X } from "lucide-react";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputStyles =
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";

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

export default function AdminCourseEditPanel({
  editingCourse,
  setEditingCourse,
  onCancel,
  onSave,
}) {
  if (!editingCourse) return null;

  return (
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
          <AppButton variant="glass" size="sm" onClick={onCancel}>
            <X className="size-4" />
            Cancel
          </AppButton>

          <AppButton
              variant="brand"
              size="sm"
              onClick={onSave}
              className="text-[color:var(--primary)] disabled:text-[color:var(--primary)] disabled:opacity-70"
            >
            <Save className="size-4" />
            Save changes
          </AppButton>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
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
  );
}