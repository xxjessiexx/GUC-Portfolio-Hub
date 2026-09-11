import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  Eye,
  FileText,
  Languages,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Users,
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
import SideToast from "@/components/ui/SideToast";

import {
  getInternshipById,
  updateInternship,
} from "@/data/demoStore";

const inputStyles =
  "min-h-[52px] rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 text-[14px] font-extrabold text-[#183247] shadow-[inset_0_1px_0_rgba(255,255,255,0.66)] placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus-visible:border-[#557C97] focus-visible:bg-white/95 focus-visible:ring-4 focus-visible:ring-[#7AAACE]/10";

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


function InternshipEditorTabs({ active, onChange }) {
  const items = [
    { id: "basics", label: "Basics", icon: Briefcase },
    { id: "role", label: "Role details", icon: FileText },
    { id: "requirements", label: "Requirements", icon: Languages },
    { id: "settings", label: "Settings", icon: ClipboardList },
  ];

  return (
    <nav
      className="mt-5 flex items-center gap-1 border-b border-[#BFD1DC]/85"
      aria-label="Internship editor sections"
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

export default function EditInternship() {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const [formData, setFormData] = useState(initialInternshipData);
  const [activeSection, setActiveSection] = useState("basics");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewOpen, setPreviewOpen] = useState(false);

  const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});
  useEffect(() => {
    const foundInternship = getInternshipById(internshipId);

    if (!foundInternship) {
      setToast({
        open: true,
        title: "Internship not found",
        description: "This internship could not be loaded.",
        type: "error",
      });
      return;
    }

    setFormData({
      title: foundInternship.title || "",
      department: foundInternship.department || "",
      workMode: foundInternship.workMode || "Hybrid",
      duration: foundInternship.duration || "",
      startDate: foundInternship.startDate || "",
      deadline: foundInternship.deadline || "",
      description:
        foundInternship.description ||
        foundInternship.overview ||
        foundInternship.details ||
        "",
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
        foundInternship.hiringActive ??
        !["closed", "filled", "archived"].includes(
          String(foundInternship.status || "").toLowerCase()
        ),
      positionFilled:
        foundInternship.positionFilled ??
        String(foundInternship.status || "").toLowerCase().includes("filled"),
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

  const buildInternshipPayload = (status) => ({
    title: formData.title.trim(),
    department: formData.department.trim(),
    workMode: formData.workMode,
    duration: formData.duration,
    startDate: formData.startDate,
    deadline: formData.deadline,
    description: formData.description.trim(),
    overview: formData.description.trim(),
    responsibilities: responsibilitiesList,
    requirements: requirementsList,
    skills: formData.skills,
    languages: formData.languages,
    openings: formData.openings,
    stipend: formData.stipend.trim(),
    hiringActive: formData.hiringActive,
    positionFilled: formData.positionFilled,
    status,
  });

  const persistChanges = (status) => {
    const updated = updateInternship(
      internshipId,
      buildInternshipPayload(status)
    );

    if (!updated) {
      throw new Error("This internship could not be found.");
    }

    return updated;
  };

  const handleSaveDraft = () => {
    try {
      persistChanges("draft");

      setToast({
        open: true,
        title: "Draft saved successfully",
        description: "Your internship draft changes have been saved.",
        type: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        title: "Could not save draft",
        description:
          error?.message || "The internship draft could not be saved.",
        type: "error",
      });
    }
  };

  const handlePublish = (event) => {
    event.preventDefault();

    if (!validateAllFields()) {
      const nextErrors = {
        title: validateInternshipField("title", formData),
        department: validateInternshipField("department", formData),
        duration: validateInternshipField("duration", formData),
        deadline: validateInternshipField("deadline", formData),
        description: validateInternshipField("description", formData),
        responsibilities: validateInternshipField("responsibilities", formData),
        requirements: validateInternshipField("requirements", formData),
      };

      if (
        nextErrors.title ||
        nextErrors.department ||
        nextErrors.duration ||
        nextErrors.deadline
      ) {
        setActiveSection("basics");
      } else if (nextErrors.description || nextErrors.responsibilities) {
        setActiveSection("role");
      } else if (nextErrors.requirements) {
        setActiveSection("requirements");
      }

      setToast({
        open: true,
        title: "Unable to save changes",
        description: "Please check the highlighted fields and try again.",
        type: "error",
      });

      return;
    }

    try {
      persistChanges(
        formData.positionFilled
          ? "Filled"
          : formData.hiringActive
            ? "Active"
            : "Closed"
      );

      setToast({
        open: true,
        title: "Internship updated successfully",
        description: "Your internship changes have been saved.",
        type: "success",
      });

      setTimeout(() => {
        navigate("/manage-internships");
      }, 1200);
    } catch (error) {
      setToast({
        open: true,
        title: "Could not save changes",
        description:
          error?.message || "The internship changes could not be saved.",
        type: "error",
      });
    }
  };

  const resetForm = () => {
  setFormData(initialInternshipData);
  setErrors({});
  setTouched({});
  setMessage({ type: "", text: "" });

  setToast({
    open: true,
    title: "Form cleared successfully",
    description: "All internship fields have been cleared.",
    type: "success",
  });
};
  return (
    <DashboardLayout showFooter={false}>

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
      <main className="h-[calc(100vh-9rem)] min-h-0">
        <form
          onSubmit={handlePublish}
          className="mx-auto flex h-full min-h-0 w-full max-w-[1480px] flex-col"
        >
          <div className="shrink-0 border-b border-[#BFD1DC]/75 pb-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
                    Internship editor
                  </p>
                </div>
                <h1 className="mt-3 text-[40px] font-black leading-none tracking-[-0.045em] text-[#112A3B] sm:text-[46px]">
                  Edit Internship
                </h1>
                <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-[#718391]">
                  Build the internship listing in one focused workspace.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="h-11 rounded-[14px] border border-[#C4D6E0] bg-[#F7FAFC] px-4 text-[12px] font-black text-[#355872] shadow-[0_6px_16px_rgba(53,88,114,0.06)] transition hover:bg-white"
                >
                  Save draft changes
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="h-11 rounded-[14px] px-4 text-[12px] font-black text-[#718391] transition hover:bg-[#EAF2F6] hover:text-[#355872]"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#355872] px-6 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] transition hover:bg-[#294A61]"
                >
                  <Send className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <InternshipEditorTabs
              active={activeSection}
              onChange={setActiveSection}
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#C9DBE4]/80 bg-[rgba(249,252,253,0.70)] shadow-[0_16px_36px_rgba(53,88,114,0.065)] backdrop-blur-xl">
            <div className="h-full overflow-y-auto px-6 py-6 pr-5 sm:px-9 sm:pr-7 [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#9AAAB4]/35 hover:[&::-webkit-scrollbar-thumb]:bg-[#8799A5]/50">
              <div className="h-full">
          {activeSection === "basics" ? (
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
          ) : null}

          {activeSection === "role" ? (
            <FormSection number="2" title="About the Internship" icon={FileText}>
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Short Description" required icon={FileText}>
                <textarea
                  className="min-h-36 w-full resize-none rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 py-3 text-[14px] font-semibold leading-6 text-[#183247] outline-none placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus:border-[#557C97] focus:bg-white/95 focus:ring-4 focus:ring-[#7AAACE]/10"
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
                  className="min-h-36 w-full resize-none rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 py-3 text-[14px] font-semibold leading-6 text-[#183247] outline-none placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus:border-[#557C97] focus:bg-white/95 focus:ring-4 focus:ring-[#7AAACE]/10"
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
          ) : null}

          {activeSection === "requirements" ? (
            <FormSection number="3" title="Requirements & Details" icon={Languages}>
            <div className="grid gap-5 xl:grid-cols-3">
              <FieldShell label="Requirements" required icon={FileText}>
                <textarea
                  className="min-h-36 w-full resize-none rounded-[14px] border border-[#C7D7E0] bg-[rgba(247,250,252,0.84)] px-4 py-3 text-[14px] font-semibold leading-6 text-[#183247] outline-none placeholder:text-[#8798A4] transition hover:border-[#9AB3C1] focus:border-[#557C97] focus:bg-white/95 focus:ring-4 focus:ring-[#7AAACE]/10"
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
          ) : null}

          {activeSection === "settings" ? (
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
          ) : null}

{activeSection === "settings" ? (
              <div className="flex justify-end border-t border-[#C9DBE4]/70 pt-5">
                <AppButton
                  type="button"
                  onClick={resetForm}
                  className="min-h-11 rounded-[14px] border border-[#C9DBE4] bg-white/55 px-5 font-black text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="mr-2 size-4" />
                  Clear form
                </AppButton>
              </div>
              ) : null}
              </div>
            </div>
          </div>
        </form>
      </main>

      
          
        
      {previewOpen && (
        <AppModal
          title=""
          onClose={() => setPreviewOpen(false)}
          maxWidth="max-w-[54rem]"
        >
          <div className="-m-2 sm:-m-3">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[linear-gradient(135deg,#355872_0%,#7AAACE_100%)]
                  text-white
                  shadow-[0_12px_28px_rgba(53,88,114,.22)]
                "
              >
                <Sparkles className="h-5 w-5" />
              </div>
      
              <div>
                <h2 className="text-3xl font-black tracking-tight text-[color:var(--ink)]">
                  Internship Preview
                </h2>
      
                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                  This is how the internship information will look before publishing.
                </p>
              </div>
            </div>
      
            {/* Internship hero */}
            <div
              className="
                relative
                mt-7
                overflow-hidden
                rounded-[28px]
                border
                border-[color:var(--border-blue)]
                bg-[linear-gradient(135deg,rgba(156,213,255,.22)_0%,rgba(247,248,240,.72)_55%,rgba(122,170,206,.16)_100%)]
                p-6
                shadow-[0_18px_45px_rgba(53,88,114,.10)]
                dark:bg-[linear-gradient(135deg,rgba(53,88,114,.38)_0%,rgba(16,32,48,.92)_55%,rgba(122,170,206,.12)_100%)]
              "
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
      
              <div className="relative flex items-center gap-4">
                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-[22px]
                    border
                    border-white/60
                    bg-white/60
                    text-[color:var(--primary)]
                    shadow-[0_10px_26px_rgba(53,88,114,.12)]
                    backdrop-blur-xl
                    dark:bg-white/10
                  "
                >
                  <Briefcase className="h-7 w-7" />
                </div>
      
                <div>
                  <h3 className="text-3xl font-black text-[color:var(--ink)]">
                    {formData.title || "Untitled Internship"}
                  </h3>
      
                  <p
        className="
          mt-2
          max-w-2xl
          text-sm
          font-semibold
          leading-6
      
          text-[#294B67]
          dark:text-[#9CD5FF]
        "
      >
        {formData.description || "No description added yet."}
      </p>
                </div>
              </div>
            </div>
      
            {/* Information grid */}
            {/* Information grid */}
      <div
        className="
          mt-5
          grid
          grid-cols-1
          gap-3
          rounded-[24px]
          border
          border-[color:var(--border-blue)]
          bg-[var(--surface-elevated)]
          p-4
          shadow-[0_18px_45px_rgba(53,88,114,.08)]
      
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
              <PreviewInfoCard
                icon={Briefcase}
                label="Department"
                value={formData.department}
              />
      
              <PreviewInfoCard
                icon={Briefcase}
                label="Work Mode"
                value={formData.workMode}
              />
      
              <PreviewInfoCard
                icon={CalendarDays}
                label="Duration"
                value={formData.duration}
              />
      
              <PreviewInfoCard
                icon={CalendarDays}
                label="Start Date"
                value={formData.startDate}
              />
      
              <PreviewInfoCard
                icon={CalendarDays}
                label="Deadline"
                value={formData.deadline}
              />
      
              <PreviewInfoCard
                icon={Plus}
                label="Openings"
                value={formData.openings}
              />
      
              <PreviewInfoCard
                icon={Briefcase}
                label="Stipend"
                value={formData.stipend}
              />
      
              <PreviewInfoCard
                icon={CheckCircle2}
                label="Hiring Active"
                value={formData.hiringActive ? "Yes" : "No"}
                positive={formData.hiringActive}
              />
      
              <PreviewInfoCard
                icon={CheckCircle2}
                label="Position Filled"
                value={formData.positionFilled ? "Yes" : "No"}
                positive={formData.positionFilled}
              />
            </div>
      
            {/* Responsibilities + Requirements */}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div
                className="
                  rounded-[24px]
                  border
                  border-[color:var(--border-blue)]
                  bg-[var(--surface-soft)]
                  p-5
                "
              >
                <PreviewList
                  title="Responsibilities"
                  items={responsibilitiesList}
                />
              </div>
      
              <div
                className="
                  rounded-[24px]
                  border
                  border-[color:var(--border-blue)]
                  bg-[var(--surface-soft)]
                  p-5
                "
              >
                <PreviewList
                  title="Requirements"
                  items={requirementsList}
                />
              </div>
            </div>
      
            {/* Skills */}
            {[...formData.skills, ...formData.languages].length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {[...formData.skills, ...formData.languages].map((item) => (
                  <StatusBadge key={item} status={item} />
                ))}
              </div>
            )}
      
            {/* Footer */}
            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="
                  h-12
                  rounded-2xl
                  bg-[linear-gradient(135deg,#2C3947_0%,#355872_55%,#7AAACE_100%)]
                  px-7
                  font-black
                  text-white
                  shadow-[0_12px_30px_rgba(53,88,114,.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:brightness-110
                "
              >
                Looks Good
              </button>
            </div>
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
    <section className="w-full">
      <div className="mb-7 flex items-start gap-3">
        <span className="mt-2 h-[2px] w-8 shrink-0 rounded-full bg-[#E6C77B]" />
        <div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-[#557C97]" />}
            <h2 className="text-[20px] font-black tracking-[-0.025em] text-[#142A3A]">
              {title}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A9AA5]">
              {number}
            </span>
          </div>
        </div>
      </div>
      {children}
    </section>
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

     
function PreviewInfoCard({
  icon: Icon,
  label,
  value,
  positive = false,
}) {
  return (
    <div
      className="
        flex
        min-h-[88px]
        items-center
        gap-3
        rounded-2xl
        border
        px-4
        py-3

        border-[color:var(--card-border)]
        bg-[var(--surface-soft)]

        shadow-[0_4px_14px_rgba(53,88,114,.04)]

        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-[color:var(--secondary)]/40
        hover:bg-[var(--surface-strong)]
        hover:shadow-[0_8px_20px_rgba(53,88,114,.08)]
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl

          bg-[color:var(--accent)]/18
          text-[color:var(--primary)]

          dark:bg-[color:var(--accent)]/12
          dark:text-[color:var(--accent)]
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-sm
            font-black
            text-[color:var(--ink)]
          "
        >
          {label}
        </p>

        <p
          className={`mt-0.5 text-sm font-semibold ${
            positive
              ? "text-green-600 dark:text-green-400"
              : "text-[color:var(--muted)]"
          }`}
        >
          {value || "Not added"}
        </p>
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