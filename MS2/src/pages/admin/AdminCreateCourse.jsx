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

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminPageHeader } from "@/components/adminModule/AdminPageHeader";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { courses, actions } = useAdminModuleData();

  const [form, setForm] = useState(emptyCourse);
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const normalizedCode = form.code
    .trim()
    .toUpperCase();

  const duplicateCode = useMemo(
    () =>
      Boolean(normalizedCode) &&
      courses.some(
        (course) =>
          String(course.code || "")
            .trim()
            .toUpperCase() ===
          normalizedCode
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
    Boolean(normalizedCode) &&
    Boolean(form.name.trim()) &&
    !duplicateCode;

  const resetForm = () => {
    setForm(emptyCourse);
    setSubmitted(false);
  };

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canSubmit) return;

    const createdCourseCode = normalizedCode;
    const createdCourseName = form.name.trim();

    actions.addCourse({
      code: createdCourseCode,
      name: createdCourseName,
      type: form.type,
      instructor:
        form.instructor.trim() ||
        "Unassigned",
      note: form.note.trim(),
    });

    /*
      addCourse updates the course collection immediately.

      If the new course code remains in the form after creation,
      duplicateCode becomes true on the next render and the page can
      misleadingly show "This course code already exists" even though
      the course was just created successfully.
    */
    resetForm();

    /*
      Use the app-wide side toast so it remains visible after
      navigating away from this page.
    */
    showToast({
      title: "Course created successfully",
      description: `${createdCourseCode} — ${createdCourseName} was added to the course catalog.`,
      type: "success",
    });

    /*
      Redirect directly to the Courses page after successful creation.
      replace prevents the completed creation form from being restored
      by pressing Back immediately afterward.
    */
    navigate("/admin/courses", {
      replace: true,
    });
  };

  return (
    <AdminPageShell
      sidebarProgress={{
        label: "Course readiness",
        value: Math.round(
          (completion / 4) * 100
        ),
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageMotion}
        className="space-y-5"
      >
        <motion.div variants={cardMotion}>
          <AdminPageHeader
            eyebrow="Academic Catalog"
            title="Create Course"
            description="Add a course to the academic catalog so it can be used across projects and instructor course links."
            actionLabel="Back to Courses"
            actionTo="/admin/courses"
            icon={ArrowLeft}
          />
        </motion.div>

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
                  description="Enter the course code and name that will appear across the platform."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Course code"
                    required
                    icon={Hash}
                    error={errors.code}
                    success={
                      normalizedCode &&
                      !duplicateCode
                        ? "Course code is available."
                        : ""
                    }
                    feedback="Use the official course code, for example CSEN501."
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
                      className={
                        adminInputStyles
                      }
                    />
                  </AdminField>

                  <AdminField
                    label="Course name"
                    required
                    icon={GraduationCap}
                    error={errors.name}
                    feedback="This name will appear in projects, search results, and course requests."
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
                      className={
                        adminInputStyles
                      }
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
                  description="Choose the course type and optionally assign an instructor."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Type"
                    icon={Layers3}
                    feedback="Select the category that best describes this course."
                  >
                    <Select
                      value={form.type}
                      onValueChange={(
                        value
                      ) =>
                        update(
                          "type",
                          value
                        )
                      }
                    >
                      <SelectTrigger
                        className={
                          adminInputStyles
                        }
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {COURSE_TYPES.map(
                          (type) => (
                            <SelectItem
                              key={
                                type
                              }
                              value={
                                type
                              }
                            >
                              {
                                type
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </AdminField>

                  <AdminField
                    label="Instructor"
                    icon={UserRound}
                    feedback="Optional. Leave this blank if no instructor has been assigned yet."
                  >
                    <Input
                      value={
                        form.instructor
                      }
                      onChange={(event) =>
                        update(
                          "instructor",
                          event.target
                            .value
                        )
                      }
                      placeholder="Dr. Mariam Hassan"
                      className={
                        adminInputStyles
                      }
                    />
                  </AdminField>
                </div>

                <AdminField
                  label="Admin note"
                  feedback="Optional. Add a short internal note about why this course was added."
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
                    placeholder="Add an optional note about this course..."
                    className={`${adminInputStyles} min-h-[90px] w-full resize-none py-3`}
                  />
                </AdminField>
              </div>
            </AdminMotionCard>

            <motion.div
              variants={cardMotion}
              className="flex flex-col-reverse gap-3 rounded-[28px] border border-white/70 bg-white/45 p-4 shadow-[0_18px_45px_rgba(53,88,114,0.08)] sm:flex-row sm:justify-end"
            >
              <AppButton
                type="button"
                variant="glass"
                className="rounded-2xl px-6 py-3 font-black"
                onClick={resetForm}
              >
                <RotateCcw className="size-4" />
                Reset
              </AppButton>

              <AppButton
                type="submit"
                className="rounded-2xl bg-[color:var(--primary)] px-6 py-3 font-black text-white shadow-[0_14px_30px_rgba(31,58,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary)]/90"
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
                  {normalizedCode ||
                    "CSEN000"}
                </p>

                <p className="mt-1 font-black text-[color:var(--ink)]">
                  {form.name ||
                    "Course name"}
                </p>

                <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
                  {form.type} •{" "}
                  {form.instructor ||
                    "Unassigned"}
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
                  done={Boolean(
                    form.type
                  )}
                >
                  Course type selected
                </RequirementLine>

                <RequirementLine
                  done={Boolean(
                    form.instructor.trim()
                  )}
                >
                  Instructor assigned or left
                  unassigned
                </RequirementLine>
              </div>
            </AppCard>
          </motion.aside>
        </form>
      </motion.div>
    </AdminPageShell>
  );
}
