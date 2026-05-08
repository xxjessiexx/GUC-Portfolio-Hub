import { useState } from "react";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-4 text-sm font-semibold text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20"
      />
    </label>
  );
}

export function CreateAdminForm({ onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onCreate?.({ name, email });
    setName("");
    setEmail("");
  };

  return (
    <AppCard variant="strong" radius="lg" padding="lg">
      <SectionHeader eyebrow="Admin access" title="Create admin account" subtitle="Prototype action for requirement 53. The account appears immediately in the users table." />
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <Field label="Name" value={name} onChange={setName} placeholder="Admin name" />
        <Field label="Email" value={email} onChange={setEmail} placeholder="admin@guc.edu.eg" />
        <AppButton type="submit" variant="brand">Create</AppButton>
      </form>
    </AppCard>
  );
}

export function CourseForm({ onCreate }) {
  const [form, setForm] = useState({ code: "", name: "", type: "Course", instructor: "" });
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    onCreate?.(form);
    setForm({ code: "", name: "", type: "Course", instructor: "" });
  };

  return (
    <AppCard variant="strong" radius="lg" padding="lg">
      <SectionHeader eyebrow="Course catalog" title="Add a course" subtitle="Create a course or bachelor project entry for project discovery and instructor linking." />
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-4 md:items-end">
        <Field label="Code" value={form.code} onChange={(value) => update("code", value)} placeholder="CSEN501" />
        <Field label="Name" value={form.name} onChange={(value) => update("name", value)} placeholder="Software Engineering" />
        <Field label="Type" value={form.type} onChange={(value) => update("type", value)} placeholder="Course" />
        <div className="flex gap-3">
          <Field label="Instructor" value={form.instructor} onChange={(value) => update("instructor", value)} placeholder="Unassigned" />
          <AppButton type="submit" variant="brand" className="mt-6">Add</AppButton>
        </div>
      </form>
    </AppCard>
  );
}
