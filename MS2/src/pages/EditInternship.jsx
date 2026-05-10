import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Languages,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import AppIconFrame from "@/components/ui/AppIconFrame";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import AppModal from "@/components/common/AppModal";
import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import { internshipsData } from "@/data/internshipsData";

const INTERNSHIPS_STORAGE_KEY = "guc-portfolio-internships";

const inputStyles =
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";

const initialInternshipData = {
  title: "",
  department: "",
  workMode: "Hybrid",
  duration: "",
  startDate: "",
  deadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: [],
  skillInput: "",
  languages: [],
  languageInput: "",
  openings: 1,
  stipend: "",
  hiringActive: true,
  positionFilled: false,
};

function getStoredInternships() {
  try {
    const stored = localStorage.getItem(INTERNSHIPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}



function validateInternshipField(field, data) {
  switch (field) {
    case "title":
      if (!data.title.trim()) return "Internship title is required.";
      if (data.title.trim().length < 3) return "Title is too short.";
      return "";

    case "department":
      if (!data.department.trim()) return "Department is required.";
      return "";

    case "duration":
      if (!data.duration.trim()) return "Duration is required.";
      return "";

    case "deadline":
      if (!data.deadline) return "Application deadline is required.";
      return "";

    case "description":
      if (!data.description.trim()) return "Short description is required.";
      if (data.description.trim().length < 20)
        return "Description should be at least 20 characters.";
      return "";

    case "responsibilities":
      if (!data.responsibilities.trim()) return "Responsibilities are required.";
      return "";

    case "requirements":
      if (!data.requirements.trim()) return "Requirements are required.";
      return "";

    default:
      return "";
  }
}

export default function EditInternship() {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const [formData, setFormData] = useState(initialInternshipData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
  const storedInternships = getStoredInternships();

  const baseInternship = internshipsData.find((item) => item.id === internshipId);
  const storedInternship = storedInternships.find((item) => item.id === internshipId);

  const foundInternship = {
    ...baseInternship,
    ...storedInternship,
    duration: storedInternship?.duration || baseInternship?.duration || "",
    workMode: storedInternship?.workMode || baseInternship?.workMode || "Hybrid",
  };

  if (!foundInternship) return;

  setFormData({
    title: foundInternship.title || "",
    department: foundInternship.department || "",
    workMode: foundInternship.workMode || "Hybrid",
    duration: foundInternship.duration || "",
    startDate: foundInternship.startDate || "",
    deadline: foundInternship.deadline || "",
    description:
      foundInternship.description ||
      foundInternship.details ||
      "Update internship description here.",
    responsibilities: Array.isArray(foundInternship.responsibilities)
      ? foundInternship.responsibilities.join("\n")
      : foundInternship.responsibilities || "",
    requirements: Array.isArray(foundInternship.requirements)
      ? foundInternship.requirements.join("\n")
      : foundInternship.requirements || "",
    skills: foundInternship.skills || [],
    skillInput: "",
    languages: foundInternship.languages || [],
    languageInput: "",
    openings: foundInternship.openings || 1,
    stipend: foundInternship.stipend || "",
    hiringActive:
      foundInternship.hiringActive ?? foundInternship.status !== "Filled",
    positionFilled:
      foundInternship.positionFilled ?? foundInternship.status === "Filled",
  });
}, [internshipId]);

  const responsibilitiesList = useMemo(() => {
    return formData.responsibilities
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [formData.responsibilities]);

  const requirementsList = useMemo(() => {
    return formData.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [formData.requirements]);

  const updateField = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    setMessage({ type: "", text: "" });

    if (touched[field] || errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateInternshipField(field, nextData),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateInternshipField(field, formData),
    }));
  };

  const addSkill = () => {
    const clean = formData.skillInput.trim();
    if (!clean || formData.skills.includes(clean)) return;

    setFormData((current) => ({
      ...current,
      skills: [...current.skills, clean],
      skillInput: "",
    }));
  };

  const removeSkill = (skill) => {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const addLanguage = () => {
    const clean = formData.languageInput.trim();
    if (!clean || formData.languages.includes(clean)) return;

    setFormData((current) => ({
      ...current,
      languages: [...current.languages, clean],
      languageInput: "",
    }));
  };

  const removeLanguage = (language) => {
    setFormData((current) => ({
      ...current,
      languages: current.languages.filter((item) => item !== language),
    }));
  };

  const validateAllFields = () => {
    const nextErrors = {
      title: validateInternshipField("title", formData),
      department: validateInternshipField("department", formData),
      duration: validateInternshipField("duration", formData),
      deadline: validateInternshipField("deadline", formData),
      description: validateInternshipField("description", formData),
      responsibilities: validateInternshipField("responsibilities", formData),
      requirements: validateInternshipField("requirements", formData),
    };

    setErrors(nextErrors);
    setTouched({
      title: true,
      department: true,
      duration: true,
      deadline: true,
      description: true,
      responsibilities: true,
      requirements: true,
    });

    return Object.values(nextErrors).every((value) => !value);
  };

  const buildStoredInternship = (status) => {
    const now = new Date().toISOString();

    return {
      id: internshipId,
      title: formData.title.trim(),
      department: formData.department.trim(),
      workMode: formData.workMode,
      duration: formData.duration,
      startDate: formData.startDate,
      deadline: formData.deadline,
      description: formData.description.trim(),
      responsibilities: responsibilitiesList,
      requirements: requirementsList,
      skills: formData.skills,
      languages: formData.languages,
      openings: formData.openings,
      stipend: formData.stipend.trim(),
      hiringActive: formData.hiringActive,
      positionFilled: formData.positionFilled,
      status,
      createdAt: now,
      updatedAt: now,
    };
  };

  const handleSaveDraft = () => {
    const draft = buildStoredInternship("draft");
    updateStoredInternship(draft);

    setMessage({
      type: "success",
      text: "Internship draft changes saved successfully.",
    });
  };
  const handlePublish = (event) => {
    event.preventDefault();

    if (!validateAllFields()) {
      setMessage({
        type: "error",
        text: "Please fix the highlighted fields before publishing.",
      });
      return;
    }

    const published = buildStoredInternship("published");
    updateStoredInternship(published);

    setMessage({
    type: "success",
    text: "Internship updated successfully.",
    });

    setTimeout(() => {
    navigate("/manage-internships");
    }, 700);
    };

  const resetForm = () => {
    setFormData(initialInternshipData);
    setErrors({});
    setTouched({});
    setMessage({ type: "", text: "" });
  };

  return (
    <DashboardLayout >
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <form onSubmit={handlePublish} className="mx-auto max-w-7xl space-y-6">
          <AppCard className="p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
                  Internship Workspace
                </p>

                <h1 className="mt-4 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                  Edit Internship
                </h1>

                <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[color:var(--muted)]">
                  Add internship details, responsibilities, skills, duration,
                  deadline, openings, stipend, and programming languages.
                </p>
              </div>

              <AppButton
                type="button"
                onClick={handleSaveDraft}
                className="min-h-12 rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-6 font-black text-[color:var(--primary)]"
              >
                Save Draft Changes
              </AppButton>
            </div>
          </AppCard>

          <FormSection number="1" title="Basic Information" icon={Briefcase}>
            <div className="grid gap-5 lg:grid-cols-3">
              <FieldShell label="Internship Title" required icon={Sparkles}>
                <Input
                  className={inputStyles}
                  placeholder="Frontend Intern"
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  onBlur={() => handleBlur("title")}
                />
                <FieldFeedback error={errors.title} />
              </FieldShell>

              <FieldShell label="Department" required icon={Briefcase}>
                <Input
                  className={inputStyles}
                  placeholder="Engineering / Design / AI"
                  value={formData.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                  onBlur={() => handleBlur("department")}
                />
                <FieldFeedback error={errors.department} />
              </FieldShell>

              <FieldShell label="Work Mode" required icon={Briefcase}>
                <FilterSelect
                  value={formData.workMode}
                  onChange={(value) => updateField("workMode", value)}
                  options={["On-site", "Remote", "Hybrid"]}
                />
              </FieldShell>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <FieldShell label="Duration" required icon={CalendarDays}>
                <FilterSelect
                  value={formData.duration}
                  onChange={(value) => updateField("duration", value)}
                  options={[
                    "2–4 months",
                    "3 months",
                    "3–6 months",
                    "4–6 months",
                    "6 months",
                  ]}
                />
                <FieldFeedback error={errors.duration} />
              </FieldShell>

              <FieldShell label="Start Date" icon={CalendarDays}>
                <Input
                  type="date"
                  className={inputStyles}
                  value={formData.startDate}
                  onChange={(event) =>
                    updateField("startDate", event.target.value)
                  }
                />
              </FieldShell>

              <FieldShell
                label="Application Deadline"
                required
                icon={CalendarDays}
              >
                <Input
                  type="date"
                  className={inputStyles}
                  value={formData.deadline}
                  onChange={(event) =>
                    updateField("deadline", event.target.value)
                  }
                  onBlur={() => handleBlur("deadline")}
                />
                <FieldFeedback error={errors.deadline} />
              </FieldShell>
            </div>
          </FormSection>

          <FormSection number="2" title="About the Internship" icon={FileText}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Short Description" required icon={FileText}>
                <textarea
                  className="min-h-40 w-full resize-none rounded-[1.5rem] border border-white/70 bg-[var(--input-bg)] px-4 py-4 text-sm font-semibold leading-7 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none placeholder:text-[color:var(--muted)]/65 transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)]"
                  placeholder="Describe the internship and what the candidate will learn."
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  onBlur={() => handleBlur("description")}
                />
                <FieldFeedback error={errors.description} />
              </FieldShell>

              <FieldShell
                label="Responsibilities"
                required
                icon={CheckCircle2}
              >
                <textarea
                  className="min-h-40 w-full resize-none rounded-[1.5rem] border border-white/70 bg-[var(--input-bg)] px-4 py-4 text-sm font-semibold leading-7 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none placeholder:text-[color:var(--muted)]/65 transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)]"
                  placeholder={`Write each responsibility on a new line.\nExample:\nBuild reusable UI components\nCollaborate with the product team`}
                  value={formData.responsibilities}
                  onChange={(event) =>
                    updateField("responsibilities", event.target.value)
                  }
                  onBlur={() => handleBlur("responsibilities")}
                />
                <FieldFeedback error={errors.responsibilities} />
              </FieldShell>
            </div>
          </FormSection>

          <FormSection number="3" title="Requirements & Details" icon={Languages}>
            <div className="grid gap-5 xl:grid-cols-3">
              <FieldShell label="Requirements" required icon={FileText}>
                <textarea
                  className="min-h-40 w-full resize-none rounded-[1.5rem] border border-white/70 bg-[var(--input-bg)] px-4 py-4 text-sm font-semibold leading-7 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none placeholder:text-[color:var(--muted)]/65 transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)]"
                  placeholder={`Write each requirement on a new line.\nExample:\nGood React basics\nStrong communication skills`}
                  value={formData.requirements}
                  onChange={(event) =>
                    updateField("requirements", event.target.value)
                  }
                  onBlur={() => handleBlur("requirements")}
                />
                <FieldFeedback error={errors.requirements} />
              </FieldShell>

              <div className="space-y-5">
                <FieldShell label="Preferred Skills" icon={Sparkles}>
                  <ChipInput
                    items={formData.skills}
                    value={formData.skillInput}
                    placeholder="Figma, Research, Prototyping"
                    emptyText="Add a skill and press Enter"
                    onValueChange={(value) => updateField("skillInput", value)}
                    onAdd={addSkill}
                    onRemove={removeSkill}
                    helper="Press Enter after each skill."
                  />
                </FieldShell>

                <FieldShell label="Programming Languages" icon={Languages}>
                  <ChipInput
                    items={formData.languages}
                    value={formData.languageInput}
                    placeholder="JavaScript, Python, Java"
                    emptyText="Add a language and press Enter"
                    onValueChange={(value) =>
                      updateField("languageInput", value)
                    }
                    onAdd={addLanguage}
                    onRemove={removeLanguage}
                    helper="Press Enter after each language."
                  />
                </FieldShell>
              </div>

              <div className="space-y-5">
                <FieldShell label="Number of Openings" required icon={Plus}>
                  <div className="flex h-12 items-center justify-between rounded-2xl border border-white/70 bg-[var(--input-bg)] px-3 shadow-[0_10px_28px_rgba(53,88,114,0.06)]">
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "openings",
                          Math.max(1, formData.openings - 1)
                        )
                      }
                      className="grid h-8 w-8 place-items-center rounded-xl bg-white/70 font-black text-[color:var(--primary)]"
                    >
                      -
                    </button>

                    <span className="font-black text-[color:var(--ink)]">
                      {formData.openings}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateField("openings", formData.openings + 1)
                      }
                      className="grid h-8 w-8 place-items-center rounded-xl bg-white/70 font-black text-[color:var(--primary)]"
                    >
                      +
                    </button>
                  </div>
                </FieldShell>

                <FieldShell label="Stipend" icon={Briefcase}>
                  <Input
                    className={inputStyles}
                    placeholder="EGP 5,000 / month"
                    value={formData.stipend}
                    onChange={(event) =>
                      updateField("stipend", event.target.value)
                    }
                  />
                </FieldShell>
              </div>
            </div>
          </FormSection>

          <FormSection number="4" title="Additional Settings" icon={Briefcase}>
            <div className="grid gap-5 md:grid-cols-2">
              <ToggleCard
                title="Hiring Status"
                description="Actively hiring for this internship."
                checked={formData.hiringActive}
                onCheckedChange={(checked) =>
                  updateField("hiringActive", checked)
                }
              />

              <ToggleCard
                title="Position Filled"
                description="Mark as filled when the right candidate is selected."
                checked={formData.positionFilled}
                onCheckedChange={(checked) =>
                  updateField("positionFilled", checked)
                }
              />
            </div>
          </FormSection>

          <AppCard className="sticky bottom-4 z-20 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold leading-5 text-[color:var(--muted)]">
                  You can preview before publishing.
                </p>

                {message.text && (
                  <p
                    className={`mt-1 text-xs font-black ${
                      message.type === "error"
                        ? "text-red-500"
                        : "text-[color:var(--primary)]"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <AppButton
                  type="button"
                  onClick={resetForm}
                  className="min-h-12 rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-6 font-black text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="mr-2 size-4" />
                  Clear
                </AppButton>

                <AppButton
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="min-h-12 rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-6 font-black text-[color:var(--primary)] transition hover:bg-[var(--surface-elevated)]"
                >
                  <Eye className="mr-2 size-4" />
                  Preview
                </AppButton>

                <AppButton
                  type="submit"
                  className="min-h-12 rounded-2xl bg-[var(--primary)] px-8 font-black text-white shadow-[var(--shadow-brand)] transition hover:bg-[var(--dark)]"
                >
                  <Send className="mr-2 size-4" />
                  Save Changes
                </AppButton>
              </div>
            </div>
          </AppCard>
        </form>
      </main>

      {previewOpen && (
        <AppModal
          title="Internship Preview"
          onClose={() => setPreviewOpen(false)}
          maxWidth="max-w-[52rem]"
        >
          <p className="text-base leading-7 text-[color:var(--muted)]">
            This is how the internship information will look before publishing.
          </p>

          <div className="mt-4 rounded-[1.5rem] border border-[color:var(--primary)]/10 bg-[var(--surface-soft)] p-5">
            <h3 className="text-2xl font-black text-[color:var(--ink)]">
              {formData.title || "Untitled Internship"}
            </h3>

            <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
              {formData.description || "No description added yet."}
            </p>

            <div className="mt-5 grid gap-2">
              <PreviewRow label="Department" value={formData.department} />
              <PreviewRow label="Work Mode" value={formData.workMode} />
              <PreviewRow label="Duration" value={formData.duration} />
              <PreviewRow label="Start Date" value={formData.startDate} />
              <PreviewRow label="Deadline" value={formData.deadline} />
              <PreviewRow label="Openings" value={formData.openings} />
              <PreviewRow label="Stipend" value={formData.stipend} />
              <PreviewRow
                label="Hiring Active"
                value={formData.hiringActive ? "Yes" : "No"}
              />
              <PreviewRow
                label="Position Filled"
                value={formData.positionFilled ? "Yes" : "No"}
              />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <PreviewList title="Responsibilities" items={responsibilitiesList} />
              <PreviewList title="Requirements" items={requirementsList} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[...formData.skills, ...formData.languages].map((item) => (
                <StatusBadge key={item} status={item} />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="h-12 rounded-2xl bg-[color:var(--primary)] px-6 font-black text-white"
            >
              Looks Good
            </button>
          </div>
        </AppModal>
      )}
    </DashboardLayout>
  );
}

function FieldFeedback({ error, helper }) {
  if (!error && !helper) return null;

  return (
    <p
      className={`text-xs font-semibold leading-5 ${
        error ? "text-red-500" : "text-[color:var(--muted)]"
      }`}
    >
      {error || helper}
    </p>
  );
}

function FieldShell({ label, required, icon: Icon, children }) {
  return (
    <div className="space-y-2.5">
      <Label className="flex items-center gap-2 text-sm font-black text-[color:var(--ink)]">
        {Icon && <Icon className="size-4 text-[color:var(--primary)]" />}
        {label}
        {required && <span className="text-[color:var(--gold)]">*</span>}
      </Label>
      {children}
    </div>
  );
}

function FormSection({ number, title, icon: Icon, children }) {
  return (
    <AppCard className="p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <AppIconFrame>
          <span className="text-sm font-black">{number}</span>
        </AppIconFrame>

        <div>
          <h2 className="text-2xl font-black tracking-tight text-[color:var(--ink)]">
            {title}
          </h2>
          {Icon && <Icon className="mt-1 size-4 text-[color:var(--primary)]" />}
        </div>
      </div>

      {children}
    </AppCard>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-[#7AAACE]/55 bg-[#5F86A3] px-3 py-1.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-white/10 dark:text-[color:var(--accent)] dark:shadow-none">
      {children}

      <button
        type="button"
        onClick={onRemove}
        className="text-white/80 transition hover:text-red-200"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

function ChipInput({
  items,
  value,
  placeholder,
  emptyText,
  onValueChange,
  onAdd,
  onRemove,
  helper,
}) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-[var(--surface-soft)] px-3 py-3 shadow-[0_12px_30px_rgba(53,88,114,0.06)]">
        {items.map((item) => (
          <Chip key={item} onRemove={() => onRemove(item)}>
            {item}
          </Chip>
        ))}

        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={items.length ? placeholder : emptyText}
          className="min-w-[180px] flex-1 bg-transparent text-sm font-semibold text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70"
        />
      </div>

      <FieldFeedback helper={helper} />
    </div>
  );
}
function updateStoredInternship(updatedInternship) {
  const existing = getStoredInternships();

  const exists = existing.some((item) => item.id === updatedInternship.id);

  const updated = exists
    ? existing.map((item) =>
        item.id === updatedInternship.id ? updatedInternship : item
      )
    : [updatedInternship, ...existing];

  localStorage.setItem(INTERNSHIPS_STORAGE_KEY, JSON.stringify(updated));
}

function ToggleCard({ title, description, checked, onCheckedChange }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-[var(--surface-soft)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-[color:var(--ink)]">{title}</p>
          <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
            {description}
          </p>
        </div>

        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="
            h-7 w-12 rounded-full border border-[color:var(--primary)]/20
            bg-gray-300 data-[state=checked]:bg-[color:var(--primary)]
            [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white [&>span]:shadow-md
            [&>span]:data-[state=checked]:translate-x-5
          "
        />
      </div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-[color:var(--primary)]/10 py-3 sm:grid-cols-[160px_1fr]">
      <p className="text-sm font-black text-[color:var(--dark)]">{label}</p>
      <p className="text-sm font-semibold text-[color:var(--muted)]">
        {value || "Not added"}
      </p>
    </div>
  );
}

function PreviewList({ title, items }) {
  return (
    <div>
      <h4 className="font-black text-[color:var(--ink)]">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-[color:var(--muted)]">
        {items.length ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>Not added</li>
        )}
      </ul>
    </div>
  );
}