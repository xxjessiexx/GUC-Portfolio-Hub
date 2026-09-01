import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Hash,
  Layers3,
  Plus,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import SideToast from "@/components/ui/SideToast";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  AdminField,
  AdminFormSectionHeader,
  AdminMotionCard,
  RequirementLine,
} from "@/components/adminModule/AdminFormPrimitives";

import {
  adminInputStyles,
  cardMotion,
  pageMotion,
} from "@/lib/adminFormTokens";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";

import AppSelect from "@/components/common/AppSelect";

import { useAdminModuleData } from "@/hooks/useAdminModuleData";
import { useToast } from "@/context/ToastContext";

const COURSE_TYPES = [
  "Course",
  "Bachelor Project",
  "Elective",
  "Lab",
];

const emptyCourse = {
  code: "",
  name: "",
  type: "Course",
  instructor: "",
  note: "",
};

export default function AdminCreateCourse() {
  const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});
  const navigate = useNavigate();

  const { courses, actions } = useAdminModuleData();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyCourse);
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const normalizedCode =
    form.code.trim().toUpperCase();

  const duplicateCode = useMemo(
    () =>
      courses.some(
        (course) =>
          course.code.toUpperCase() === normalizedCode
      ),
    [courses, normalizedCode]
  );

  const errors = {
    code:
      submitted && !normalizedCode
        ? "Course code is required."
        : duplicateCode
        ? "This course code already exists."
        : "",

    name:
      submitted && !form.name.trim()
        ? "Course name is required."
        : "",
  };

  const completion = [
    normalizedCode && !duplicateCode,
    form.name.trim(),
    form.type,
    form.instructor.trim(),
  ].filter(Boolean).length;

  const canSubmit =
    normalizedCode &&
    form.name.trim() &&
    !duplicateCode;

  const submit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    if (!normalizedCode || !form.name.trim()) {
      showToast({
        title: "Missing course details",
        description:
          "Course code and name are required.",
        type: "error",
      });

      return;
    }

    if (duplicateCode) {
      showToast({
        title: "Course already exists",
        description: `${normalizedCode} is already in the catalog.`,
        type: "error",
      });

      return;
    }

    if (!canSubmit) {
      return;
    }

    actions.addCourse({
      code: normalizedCode,
      name: form.name.trim(),
      type: form.type,
      instructor:
        form.instructor.trim() || "Unassigned",
      note: form.note.trim(),
    });

    setToast({
  open: true,
  title: "Course added successfully",
  description: "The new course has been added.",
  type: "success",
});
    
  };

  const resetForm = () => {
    setForm(emptyCourse);
    setSubmitted(false);
  };

  return (
    <AdminPageShell
      sidebarProgress={{
        label: "Course readiness",
        value: Math.round((completion / 4) * 100),
      }}
    >
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
                          title="Create Course"
                          subtitle="Add a course record that instructors can link to and students can use when publishing projects."
                          action={
                                    <div className="-m-2">
                                      <span
                                        onClick={() => navigate("/admin/courses")}
                                        className="inline-flex gap-2 items-center rounded-2xl px-9 py-3 text-white font-semibold 
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
                                        <ArrowLeft className="h-5 w-5" />
                                        
                                        Back to Courses
                                      </span>
                                    </div>
                                  }
                                />

        <form
          onSubmit={submit}
          className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <div className="space-y-4">
            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader
                  icon={BookOpen}
                  title="Course identity"
                  description="Keep the catalog details short and searchable."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Course code"
                    required
                    icon={Hash}
                    error={errors.code}
                    feedback="Example: CSEN501"
                  >
                    <Input
                      value={form.code}
                      onChange={(event) =>
                        update(
                          "code",
                          event.target.value
                        )
                      }
                      placeholder="CSEN501"
                      className={adminInputStyles}
                    />
                  </AdminField>

                  <AdminField
                    label="Course name"
                    required
                    icon={GraduationCap}
                    error={errors.name}
                    feedback="Displayed across search, projects, and link requests."
                  >
                    <Input
                      value={form.name}
                      onChange={(event) =>
                        update(
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="Software Engineering"
                      className={adminInputStyles}
                    />
                  </AdminField>
                </div>
              </div>
            </AdminMotionCard>

            <AdminMotionCard>
              <div className="space-y-4">
                <AdminFormSectionHeader
                  icon={Layers3}
                  title="Academic setup"
                  description="Set the type and optionally attach an instructor now."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Type"
                    icon={Layers3}
                    feedback="Bachelor Project is supported by the requirements."
                  >
                    <AppSelect
                      value={form.type}
                      onChange={(value) => update("type", value)}
                      options={COURSE_TYPES}
                      placeholder="Choose course type"
                    />
                  </AdminField>

                  <AdminField
                    label="Instructor"
                    icon={UserRound}
                    feedback="Leave blank if it is not assigned yet."
                  >
                    <Input
                      value={form.instructor}
                      onChange={(event) =>
                        update(
                          "instructor",
                          event.target.value
                        )
                      }
                      placeholder="Dr. Mariam Hassan"
                      className={adminInputStyles}
                    />
                  </AdminField>
                </div>

                <AdminField
                  label="Admin note"
                  feedback="Optional note for recent activity/audit context."
                >
                  <textarea
                    value={form.note}
                    onChange={(event) =>
                      update(
                        "note",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Why is this course being added?"
                    className={`${adminInputStyles} min-h-[90px] w-full resize-none py-3`}
                  />
                </AdminField>
              </div>
            </AdminMotionCard>

            <motion.div
              variants={cardMotion}
              className="
                flex
                flex-col-reverse
                gap-3
                rounded-[28px]
                border
                border-white/70
                bg-white/45
                p-4
                shadow-[0_18px_45px_rgba(53,88,114,0.08)]
                sm:flex-row
                sm:justify-end
              "
            >
              <AppButton
                type="button"
                variant="glass"
                className="rounded-2xl px-6 py-3 font-black"
                onClick={() => {
                  setForm(emptyCourse);
                  setSubmitted(false);
                  setToast({
                  open: true,
                  title: "Course reset successfully",
                  description: "The course has been reset.",
                  type: "success",
                });
                }}
              >

                <RotateCcw className="size-4" />
                Reset
              </AppButton>

              <AppButton
                type="submit"
                className="
                  rounded-2xl
                  bg-[color:var(--primary)]
                  px-6
                  py-3
                  font-black
                  text-white
                  shadow-[0_14px_30px_rgba(31,58,92,0.22)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[color:var(--primary)]/90
                "
              >
                <Plus className="size-4" />
                Create course
              </AppButton>
            </motion.div>
          </div>

          <motion.aside
            variants={cardMotion}
            className="space-y-4 xl:sticky xl:top-6 xl:self-start"
          >
            <AppCard
              variant="strong"
              radius="lg"
              padding="lg"
              className="p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--secondary)]">
                Live preview
              </p>

              <div className="mt-4 rounded-3xl border border-[color:var(--border-blue)] bg-white/70 p-4">
                <p className="text-xl font-black text-[color:var(--primary)]">
                  {normalizedCode || "CSEN000"}
                </p>

                <p className="mt-1 font-black text-[color:var(--ink)]">
                  {form.name || "Course name"}
                </p>

                <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
                  {form.type} •{" "}
                  {form.instructor || "Unassigned"}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <RequirementLine
                  done={Boolean(
                    normalizedCode &&
                      !duplicateCode
                  )}
                >
                  Unique course code
                </RequirementLine>

                <RequirementLine
                  done={Boolean(
                    form.name.trim()
                  )}
                >
                  Course name added
                </RequirementLine>

                <RequirementLine
                  done={Boolean(form.type)}
                >
                  Course type selected
                </RequirementLine>

                <RequirementLine
                  done={Boolean(
                    form.instructor.trim()
                  )}
                >
                  Instructor assigned or intentionally blank
                </RequirementLine>
              </div>
            </AppCard>
          </motion.aside>
        </form>
      </div>
      </main>
    </AdminPageShell>
  );
}