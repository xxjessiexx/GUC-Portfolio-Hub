import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, GraduationCap, Hash, Layers3, Plus, RotateCcw, UserRound } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminField, AdminFormSectionHeader, AdminMotionCard, RequirementLine } from "@/components/adminModule/AdminFormPrimitives";
import { adminInputStyles, cardMotion, pageMotion } from "@/lib/adminFormTokens";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminModuleData } from "@/hooks/useAdminModuleData";

const COURSE_TYPES = ["Course", "Bachelor Project", "Elective", "Lab"];
const emptyCourse = { code: "", name: "", type: "Course", instructor: "", note: "" };

export default function AdminCreateCourse() {
  const navigate = useNavigate();
  const { courses, actions } = useAdminModuleData();
  const [form, setForm] = useState(emptyCourse);
  const [submitted, setSubmitted] = useState(false);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const normalizedCode = form.code.trim().toUpperCase();
  const duplicateCode = useMemo(() => courses.some((course) => course.code.toUpperCase() === normalizedCode), [courses, normalizedCode]);
  const errors = {
    code: submitted && !normalizedCode ? "Course code is required." : duplicateCode ? "This course code already exists." : "",
    name: submitted && !form.name.trim() ? "Course name is required." : "",
  };
  const completion = [normalizedCode && !duplicateCode, form.name.trim(), form.type, form.instructor.trim()].filter(Boolean).length;
  const canSubmit = normalizedCode && form.name.trim() && !duplicateCode;

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    actions.addCourse({ code: normalizedCode, name: form.name.trim(), type: form.type, instructor: form.instructor.trim() || "Unassigned", note: form.note.trim() });
    toast.success("Course created", { description: `${normalizedCode} was added to the catalog.` });
    navigate("/admin/courses");
  };

  return (
    <AdminPageShell sidebarProgress={{ label: "Course readiness", value: Math.round((completion / 4) * 100) }}>
      <motion.div initial="hidden" animate="visible" variants={pageMotion} className="space-y-5">
        <motion.div variants={cardMotion}>
          <AppButton as={Link} to="/admin/courses" variant="glass" size="sm" className="w-fit"><ArrowLeft className="size-4" />Back to courses</AppButton>
        </motion.div>

        <motion.div variants={cardMotion}>
          <AppCard variant="dark" radius="xl" padding="lg" className="overflow-hidden py-6">
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[color:var(--gold)]">Academic catalog</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Create course</h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/65">Add a course record that instructors can link to and students can use when publishing projects.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">Req 55</p>
                <p className="mt-1 text-sm font-bold text-white/80">Create / view / edit / delete courses</p>
              </div>
            </div>
          </AppCard>
        </motion.div>

        <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader icon={BookOpen} title="Course identity" description="Keep the catalog details short and searchable." />
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Course code" required icon={Hash} error={errors.code} feedback="Example: CSEN501">
                    <Input value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="CSEN501" className={adminInputStyles} />
                  </AdminField>
                  <AdminField label="Course name" required icon={GraduationCap} error={errors.name} feedback="Displayed across search, projects, and link requests.">
                    <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Software Engineering" className={adminInputStyles} />
                  </AdminField>
                </div>
              </div>
            </AdminMotionCard>

            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader icon={Layers3} title="Academic setup" description="Set the type and optionally attach an instructor now." />
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Type" icon={Layers3} feedback="Bachelor Project is supported by the requirements.">
                    <Select value={form.type} onValueChange={(value) => update("type", value)}>
                      <SelectTrigger className={adminInputStyles}><SelectValue /></SelectTrigger>
                      <SelectContent>{COURSE_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select>
                  </AdminField>
                  <AdminField label="Instructor" icon={UserRound} feedback="Leave blank if it is not assigned yet.">
                    <Input value={form.instructor} onChange={(e) => update("instructor", e.target.value)} placeholder="Dr. Mariam Hassan" className={adminInputStyles} />
                  </AdminField>
                </div>
                <AdminField label="Admin note" feedback="Optional note for recent activity/audit context.">
                  <textarea value={form.note} onChange={(e) => update("note", e.target.value)} rows={3} placeholder="Why is this course being added?" className={`${adminInputStyles} min-h-[90px] w-full resize-none py-3`} />
                </AdminField>
              </div>
            </AdminMotionCard>

            <motion.div variants={cardMotion} className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AppButton type="button" variant="glass" onClick={() => { setForm(emptyCourse); setSubmitted(false); }}><RotateCcw className="size-4" />Reset</AppButton>
              <AppButton type="submit" variant="brand"><Plus className="size-4" />Create course</AppButton>
            </motion.div>
          </div>

          <motion.aside variants={cardMotion} className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <AppCard variant="strong" radius="lg" padding="lg" className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--secondary)]">Live preview</p>
              <div className="mt-4 rounded-3xl border border-[color:var(--border-blue)] bg-white/70 p-4">
                <p className="text-xl font-black text-[color:var(--primary)]">{normalizedCode || "CSEN000"}</p>
                <p className="mt-1 font-black text-[color:var(--ink)]">{form.name || "Course name"}</p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">{form.type} • {form.instructor || "Unassigned"}</p>
              </div>
              <div className="mt-4 space-y-2">
                <RequirementLine done={Boolean(normalizedCode && !duplicateCode)}>Unique course code</RequirementLine>
                <RequirementLine done={Boolean(form.name.trim())}>Course name added</RequirementLine>
                <RequirementLine done={Boolean(form.type)}>Course type selected</RequirementLine>
                <RequirementLine done={Boolean(form.instructor.trim())}>Instructor assigned or intentionally blank</RequirementLine>
              </div>
            </AppCard>
          </motion.aside>
        </form>
      </motion.div>
    </AdminPageShell>
  );
}
