import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Hash,
  Layers3,
  Save,
} from "lucide-react";

import { AdminPageShell } from "@/components/adminModule/AdminPageShell";
import { AdminField } from "@/components/adminModule/AdminFormPrimitives";
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

const COURSE_TYPES = ["Course", "Bachelor Project", "Elective", "Lab"];

const inputStyles =
  "min-h-[52px] rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 text-[14px] font-extrabold text-[#183247] shadow-[inset_0_1px_0_rgba(255,255,255,0.66)] placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus-visible:border-[#557C97] focus-visible:bg-white/95 focus-visible:ring-4 focus-visible:ring-[#7AAACE]/10";

const selectTriggerStyles =
  `${inputStyles} h-[52px] w-full justify-between py-0 text-left [&>span]:text-[#183247] [&>span]:font-extrabold [&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:text-[#294F69]`;

function CourseEditorTabs({ active, onChange }) {
  const items = [
    { id: "identity", label: "Identity", icon: BookOpen },
    { id: "setup", label: "Academic setup", icon: Layers3 },
  ];

  return (
    <nav
      className="mt-5 flex items-center gap-1 border-b border-[#BFD1DC]/85"
      aria-label="Course editor sections"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`relative inline-flex h-12 items-center gap-2.5 px-4 text-[13px] font-black transition ${
              selected
                ? "text-[#17384E]"
                : "text-[#7A8D99] hover:text-[#355872]"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                selected ? "text-[#355872]" : "text-[#8EA0AA]"
              }`}
            />
            {item.label}
            {selected ? (
              <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#E6C77B]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-7 flex items-start gap-3">
      <span className="mt-2 h-[2px] w-8 shrink-0 rounded-full bg-[#E6C77B]" />
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#557C97]" />
          <h2 className="text-[20px] font-black tracking-[-0.025em] text-[#142A3A]">
            {title}
          </h2>
        </div>
        <p className="mt-1 text-[13px] font-semibold leading-5 text-[#718391]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AdminEditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { courses, actions } = useAdminModuleData();

  const course = useMemo(
    () => courses.find((item) => String(item.id) === String(courseId)) || null,
    [courses, courseId]
  );

  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "Course",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState("identity");

  useEffect(() => {
    if (!course) return;

    setForm({
      code: course.code || "",
      name: course.name || "",
      type: course.type || "Course",
      note: "",
    });
  }, [course]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const normalizedCode = form.code.trim().toUpperCase();

  const duplicateCode = useMemo(
    () =>
      Boolean(normalizedCode) &&
      courses.some(
        (item) =>
          String(item.id) !== String(courseId) &&
          String(item.code || "").trim().toUpperCase() === normalizedCode
      ),
    [courses, normalizedCode, courseId]
  );

  const errors = {
    code:
      submitted && !normalizedCode
        ? "Course code is required."
        : duplicateCode
          ? "Another course already uses this code."
          : "",
    name:
      submitted && !form.name.trim()
        ? "Course name is required."
        : "",
  };

  const canSubmit =
    Boolean(normalizedCode) &&
    Boolean(form.name.trim()) &&
    !duplicateCode;

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!canSubmit || !course) {
      setActiveSection("identity");
      return;
    }

    actions.updateCourse(
      course.id,
      {
        code: normalizedCode,
        name: form.name.trim(),
        type: form.type,
      },
      form.note.trim()
    );

    showToast({
      title: "Course updated",
      description: `${normalizedCode} was updated successfully.`,
      type: "success",
    });

    navigate("/admin/courses");
  };

  if (!course) {
    return (
      <AdminPageShell>
        <main className="mx-auto w-full max-w-[1480px]">
          <div className="rounded-[24px] border border-[#C9DBE4]/80 bg-white/70 p-8">
            <h1 className="text-3xl font-black text-[#112A3B]">
              Course not found
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#718391]">
              This course may have been removed or the link is no longer valid.
            </p>
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="mt-6 h-11 rounded-[14px] bg-[#355872] px-5 text-sm font-black text-white"
            >
              Back to courses
            </button>
          </div>
        </main>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <main className="mx-auto flex h-[calc(100vh-9rem)] min-h-0 w-full max-w-[1480px] flex-col">
        <form
          id="course-editor-form"
          onSubmit={submit}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="shrink-0 border-b border-[#BFD1DC]/75 pb-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
                    Course editor
                  </p>
                </div>

                <h1 className="mt-3 text-[40px] font-black leading-none tracking-[-0.045em] text-[#112A3B] sm:text-[46px]">
                  Edit Course
                </h1>

                <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-[#718391]">
                  Update the catalog record without changing the editor pattern.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/admin/courses")}
                  className="h-11 rounded-[14px] px-4 text-[12px] font-black text-[#718391] transition hover:bg-[#EAF2F6] hover:text-[#355872]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#355872] px-6 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] transition hover:bg-[#294A61] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <CourseEditorTabs
              active={activeSection}
              onChange={setActiveSection}
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#C9DBE4]/80 bg-[rgba(249,252,253,0.70)] shadow-[0_16px_36px_rgba(53,88,114,0.065)] backdrop-blur-xl">
            <div className="h-full overflow-y-auto px-6 py-6 pr-5 sm:px-9 sm:pr-7 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9AAAB4]/35 hover:[&::-webkit-scrollbar-thumb]:bg-[#8799A5]/50">
              {activeSection === "identity" ? (
                <section>
                  <SectionHeader
                    icon={BookOpen}
                    title="Course identity"
                    description="Update the official course code and catalog name."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <AdminField
                      label="Course code"
                      required
                      icon={Hash}
                      error={errors.code}
                      success={
                        normalizedCode && !duplicateCode
                          ? "Course code is available."
                          : ""
                      }
                    >
                      <Input
                        value={form.code}
                        onChange={(event) =>
                          update("code", event.target.value)
                        }
                        className={inputStyles}
                      />
                    </AdminField>

                    <AdminField
                      label="Course name"
                      required
                      icon={GraduationCap}
                      error={errors.name}
                    >
                      <Input
                        value={form.name}
                        onChange={(event) =>
                          update("name", event.target.value)
                        }
                        className={inputStyles}
                      />
                    </AdminField>
                  </div>
                </section>
              ) : null}

              {activeSection === "setup" ? (
                <section>
                  <SectionHeader
                    icon={Layers3}
                    title="Academic setup"
                    description="Update the course category and record an optional administrative note."
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <AdminField
                      label="Course type"
                      icon={Layers3}
                    >
                      <Select
                        value={form.type}
                        onValueChange={(value) => update("type", value)}
                      >
                        <SelectTrigger className={selectTriggerStyles}>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {COURSE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AdminField>
                  </div>

                  <div className="mt-5">
                    <AdminField
                      label="Admin note"
                      feedback="Optional note explaining this catalog change."
                    >
                      <textarea
                        value={form.note}
                        onChange={(event) =>
                          update("note", event.target.value)
                        }
                        rows={5}
                        placeholder="Add an optional note..."
                        className={`${inputStyles} min-h-32 w-full resize-none py-3`}
                      />
                    </AdminField>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </form>
      </main>
    </AdminPageShell>
  );
}
