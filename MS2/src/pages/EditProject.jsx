import { useEffect, useMemo, useState } from "react";
import ProjectInvitePickerModal from "@/components/project/ProjectInvitePickerModal";
import ProjectVideoUploadField from "@/components/project/ProjectVideoUploadField";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Save,
  FileText,
  Globe2,
  Link2,
  Lock,
  Plus,
  Sparkles,
  UploadCloud,
  Users,
  Video,
  X,
} from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import SideToast from "@/components/ui/SideToast";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import AppIconFrame from "@/components/ui/AppIconFrame";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { getCollection, getProjectById, updateProject } from "@/data/demoStore";

const PROJECT_FILES_DB = "guc-portfolio-files-db";
const PROJECT_FILES_STORE = "projectFiles";

const initialProjectData = {
  title: "",
  type: "course",
  courseName: "",
  thesisFile: null,
  description: "",
  github: "",
  video: null,
  tags: [],
  tagInput: "",
  collaborators: [],
  instructors: [],
  visibility: "private",
};

const inputStyles =
  "min-h-[58px] rounded-[15px] border border-[#C5D6E0] bg-[#F4F8FA] px-4 text-[15px] font-extrabold text-[#183247] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] placeholder:text-[#8798A4] transition hover:border-[#90AFC0] focus-visible:border-[#4F7EA4] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#7AAACE]/14";

const selectTriggerStyles = cn(
  inputStyles,
  "h-[58px] w-full justify-between py-0 text-left bg-white [&>span]:text-[#183247] [&>span]:font-extrabold [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[#294F69]"
);

const EDITOR_THEME = {
  "--ink": "#102536",
  "--muted": "#718391",
  "--primary": "#355872",
  "--dark": "#294A61",
  "--accent": "#7AAACE",
  "--gold": "#E6C77B",
  "--surface-soft": "#F4F8FA",
  "--surface-strong": "#EAF2F6",
  "--surface-elevated": "#FFFFFF",
  "--input-bg": "#FFFFFF",
  "--ring-soft": "rgba(122,170,206,0.18)",
  "--shadow-soft": "0 16px 38px rgba(53,88,114,0.10)",
  "--shadow-brand": "0 14px 30px rgba(53,88,114,0.22)",
  colorScheme: "light",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function isValidEmail(value) {
  return EMAIL_REGEX.test(value.trim());
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isGithubUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname.includes("github.com");
  } catch {
    return false;
  }
}

function getStoredProjects() {
  return getCollection("projects") || [];
}

function saveProject(project) {
  return project;
}

function updateStoredProject(projectId, updatedProject) {
  return updateProject(projectId, updatedProject);
}

function findStoredProject(projectId) {
  return getProjectById(projectId);
}

function mapProjectToFormData(project) {
  return {
    title: project.title || "",
    type:
      project.type === "Bachelor Project" || project.type === "thesis"
        ? "thesis"
        : "course",
    courseName: project.courseName || "",
    thesisFile: project.thesisFile
      ? { ...project.thesisFile, __existing: true }
      : null,
    description: project.description || "",
    github: project.github || "",
    video: project.video ? { ...project.video, __existing: true } : null,
    tags: project.technologies || project.tags || [],
    tagInput: "",
    collaborators: (project.collaborators || []).map((item) => item.email || item).filter(Boolean),
    instructors: (project.instructors || []).map((item) => item.email || item).filter(Boolean),
    visibility: project.visibility || "private",
  };
}

function openProjectFilesDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROJECT_FILES_DB, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(PROJECT_FILES_STORE)) {
        db.createObjectStore(PROJECT_FILES_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveProjectFile(file, prefix) {
  if (!file || file.__existing) return null;

  const db = await openProjectFilesDB();

  const fileRecord = {
    id: `${prefix}-${Date.now()}-${crypto.randomUUID()}`,
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    file,
    savedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_FILES_STORE, "readwrite");
    const store = transaction.objectStore(PROJECT_FILES_STORE);

    store.put(fileRecord);

    transaction.oncomplete = () => resolve(fileRecord);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getProjectFile(fileId) {
  if (!fileId) return null;

  const db = await openProjectFilesDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_FILES_STORE, "readonly");
    const store = transaction.objectStore(PROJECT_FILES_STORE);
    const request = store.get(fileId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function createStoredFileReference(fileRecord) {
  if (!fileRecord) return null;

  return {
    id: fileRecord.id,
    name: fileRecord.name,
    type: fileRecord.type,
    size: fileRecord.size,
    lastModified: fileRecord.lastModified,
    savedAt: fileRecord.savedAt,
  };
}

function FieldFeedback({ error, success, helper, className }) {
  const message = error || success || helper;

  if (!message) return null;

  return (
    <p
      className={cn(
        "text-xs font-semibold leading-5",
        error
          ? "text-red-500"
          : success
          ? "text-[color:var(--primary)]"
          : "text-[color:var(--muted)]",
        className
      )}
    >
      {message}
    </p>
  );
}

function FieldShell({ label, required, icon: Icon, children, className }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      <Label className="flex items-center gap-2 text-sm font-black text-[color:var(--ink)]">
        {Icon ? <Icon className="size-4 text-[color:var(--primary)]" /> : null}
        {label}
        {required ? <span className="text-[color:var(--gold)]">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function SectionHeader({ title, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-2 h-[3px] w-8 shrink-0 rounded-full bg-[#E6C77B]" />
      <div>
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="size-4 text-[#557C97]" /> : null}
          <h2 className="text-[24px] font-black tracking-[-0.03em] text-[#142A3A]">{title}</h2>
        </div>
        {description ? <p className="mt-1 max-w-3xl text-[14px] font-semibold leading-6 text-[#718391]">{description}</p> : null}
      </div>
    </div>
  );
}

function FormSection({ title, description, icon, children, className }) {
  return (
    <section className={cn("border-b border-[#DCE7ED] px-6 py-7 last:border-b-0 sm:px-8", className)}>
      <div className="space-y-6">
        <SectionHeader title={title} description={description} icon={icon} />
        {children}
      </div>
    </section>
  );
}

function EditorRail({ formData, onVisibilityChange, completedCount, totalCount, isSaving, onSubmit, onCancel, onView }) {
  const isPublic = formData.visibility === "public";
  const percent = Math.round((completedCount / Math.max(totalCount, 1)) * 100);
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-[26px] border border-[#CDDDE6] bg-white shadow-[0_18px_44px_rgba(53,88,114,0.11)]">
        <div className="bg-[linear-gradient(145deg,#294A61_0%,#3F6884_100%)] px-6 py-6 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C8E4F5]">Project status</p>
          <h3 className="mt-2 text-[24px] font-black tracking-[-0.03em]">{isPublic ? "Published project" : "Private draft"}</h3>
          <p className="mt-2 text-[12px] font-semibold leading-5 text-white/75">{isPublic ? "Changes will update the project people can see." : "Only you and invited people can access this project."}</p>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7894A6]">Visibility</p><p className="mt-1 text-[14px] font-black text-[#183247]">{isPublic ? "Public" : "Private"}</p></div>
            <Switch checked={isPublic} onCheckedChange={(checked) => onVisibilityChange(checked ? "public" : "private")} />
          </div>
          <div className="border-t border-[#DCE7ED] pt-5">
            <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7894A6]">Completion</p><p className="mt-1 text-[22px] font-black tracking-[-0.03em] text-[#183247]">{completedCount} of {totalCount}</p></div><span className="text-[12px] font-black text-[#557C97]">{percent}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5EEF3]"><div className="h-full rounded-full bg-[#4F7EA4]" style={{ width: `${percent}%` }} /></div>
          </div>
          <div className="space-y-2 border-t border-[#DCE7ED] pt-5 text-[12px] font-semibold text-[#6F8290]">
            <p className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${formData.title.trim() ? "bg-emerald-500" : "bg-[#CAD7DE]"}`} />Project title</p>
            <p className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${formData.description.trim() ? "bg-emerald-500" : "bg-[#CAD7DE]"}`} />Description</p>
            <p className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${(formData.type === "thesis" || formData.courseName.trim()) ? "bg-emerald-500" : "bg-[#CAD7DE]"}`} />Project type / course</p>
            <p className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${(formData.github.trim() || formData.video) ? "bg-emerald-500" : "bg-[#CAD7DE]"}`} />Media or repository</p>
          </div>
          <button type="button" onClick={onSubmit} disabled={isSaving} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[17px] bg-[#355872] px-5 text-[13px] font-black text-white shadow-[0_12px_26px_rgba(53,88,114,0.22)] transition hover:-translate-y-[1px] hover:bg-[#294A61] disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? "Saving..." : "Save changes"}</button>
          <button type="button" onClick={onView} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[15px] border border-[#355872]/14 bg-white text-[12px] font-black text-[#355872] transition hover:bg-[#F6FAFC]"><Eye className="h-4 w-4" />View project</button>
          <button type="button" onClick={onCancel} className="w-full text-center text-[12px] font-black text-[#6B8799] transition hover:text-[#355872]">Cancel</button>
        </div>
      </div>
    </aside>
  );
}

function VisibilityPanel({ value, onChange }) {
  const isPublic = value === "public";

  return (
    <div className="flex h-full min-h-[14rem] flex-col justify-between rounded-[1.75rem] bg-[var(--primary)] p-6 text-white shadow-[var(--shadow-soft)]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/65">
          Visibility
        </p>

        <h2 className="mt-3 text-2xl font-black">
          {isPublic ? "Public project" : "Private draft"}
        </h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-white/75">
          {isPublic
            ? "This project will appear on your portfolio and discovery pages."
            : "This project is only visible to you and invited people."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-white/12 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {isPublic ? (
            <Globe2 className="size-4 text-[color:var(--accent)]" />
          ) : (
            <Lock className="size-4 text-[color:var(--accent)]" />
          )}

          <span className="text-sm font-black">
            {isPublic ? "Public" : "Private"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-black text-white/65 sm:inline">
            Private
          </span>

          <Switch
            checked={isPublic}
            onCheckedChange={(checked) =>
              onChange(checked ? "public" : "private")
            }
            className="
              h-7 w-12
              border border-white/30
              bg-white/20
              shadow-inner
              data-[state=checked]:bg-[color:var(--accent)]
              data-[state=unchecked]:bg-white/20
              [&>span]:h-5
              [&>span]:w-5
              [&>span]:bg-white
              [&>span]:shadow-md
              [&>span]:data-[state=checked]:translate-x-5
            "
          />

          <span className="hidden text-xs font-black text-white/65 sm:inline">
            Public
          </span>
        </div>
      </div>
    </div>
  );
}

function FileDropField({
  label,
  accept,
  file,
  onChange,
  icon: Icon,
  required,
  error,
  helper,
  success,
}) {
  return (
    <FieldShell label={label} required={required} icon={Icon}>
      <label className="group flex min-h-[108px] cursor-pointer items-center gap-4 rounded-[1.5rem] border border-dashed border-white/70 bg-[var(--surface-soft)] px-4 py-4 shadow-[0_14px_34px_rgba(53,88,114,0.07)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-[var(--surface-strong)]">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)]">
          <UploadCloud className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-[color:var(--ink)]">
            {file?.name || "Click to upload file"}
          </p>

          <p className="mt-1 text-xs font-semibold leading-5 text-[color:var(--muted)]">
            The selected file name will appear here.
          </p>
        </div>

        <Input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>

      <FieldFeedback error={error} success={success} helper={helper} />
    </FieldShell>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)]/10 px-3 py-1.5 text-sm font-bold text-[color:var(--primary)]">
      {children}

      <button
        type="button"
        onClick={onRemove}
        className="text-[color:var(--primary)]/70 transition hover:text-red-500"
        aria-label={`Remove ${children}`}
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

function ChipInput({
  value,
  items,
  placeholder,
  emptyText,
  onValueChange,
  onAdd,
  onRemove,
  feedback,
}) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-[15px] border border-[#C5D6E0] bg-[#F4F8FA] px-3 py-3">
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

      <FieldFeedback
        error={feedback?.type === "error" ? feedback.message : ""}
        success={feedback?.type === "success" ? feedback.message : ""}
        helper="Press Enter after each technology."
      />
    </div>
  );
}

 
  

function InviteBox({
  title,
  description,
  emptyText,
  items,
  onRemove,
  onOpenDialog,
  buttonLabel,
  feedback,
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/65 bg-[var(--surface-soft)] p-5 shadow-[0_16px_40px_rgba(53,88,114,0.07)]">
      <h3 className="text-lg font-black text-[color:var(--ink)]">{title}</h3>

      <p className="mt-1 text-sm font-semibold leading-6 text-[color:var(--muted)]">
        {description}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {items.length
            ? `${items.length} added`
            : emptyText}
        </p>

        <AppButton
          type="button"
          onClick={onOpenDialog}
          className="min-h-11 rounded-2xl bg-[var(--primary)] px-5 font-black text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[var(--dark)]"
        >
          <Plus className="mr-2 size-4" />
          {buttonLabel}
        </AppButton>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip key={item} onRemove={() => onRemove(item)}>
            {item}
          </Chip>
        ))}
      </div>

      <div className="mt-3">
        <FieldFeedback
          error={feedback?.type === "error" ? feedback.message : ""}
          success={feedback?.type === "success" ? feedback.message : ""}
        />
      </div>
    </div>
  );
}

function validateProjectField(field, data) {
  switch (field) {
    case "title":
      if (!data.title.trim()) return "Project title is required.";
      if (data.title.trim().length < 3) {
        return "Project title should be at least 3 characters.";
      }
      return "";

    case "courseName":
      if (data.type !== "course") return "";
      if (!data.courseName.trim()) return "Course name is required.";
      return "";

    case "thesisFile":
      if (data.type !== "thesis") return "";
      if (!data.thesisFile) return "Please upload the thesis PDF.";
      if (data.thesisFile.type !== "application/pdf") {
        return "Thesis file must be a PDF.";
      }
      return "";

    case "description":
      if (!data.description.trim()) return "Project description is required.";
      if (data.description.trim().length < 20) {
        return "Description should be at least 20 characters.";
      }
      return "";

    case "github":
      if (!data.github.trim()) return "";
      if (!isValidUrl(data.github.trim())) return "Enter a valid URL.";
      if (!isGithubUrl(data.github.trim())) {
        return "Please enter a GitHub repository URL.";
      }
      return "";

    case "video": {
      if (!data.video) return "";

      if (data.video.__existing) return "";

      const supportedVideoTypes = ["video/mp4", "video/webm"];

      if (!data.video.type?.startsWith("video/")) {
        return "Uploaded file must be a video.";
      }

      if (!supportedVideoTypes.includes(data.video.type)) {
        return "Use an MP4 or WebM video so it can be previewed in the browser.";
      }

      return "";
    }

    default:
      return "";
  }
}

function validateInviteEmail(value, existing) {
  const clean = value.trim().toLowerCase();

  if (!clean) return "Email address is required.";
  if (!isValidEmail(clean)) return "Enter a valid email address.";
  if (existing.includes(clean)) return "This email is already added.";
  return "";
}

function EditorTabs({ active, onChange }) {
  const items = [
    { id: "details", label: "Details", icon: FileText },
    { id: "media", label: "Media", icon: Video },
    { id: "team", label: "Team", icon: Users },
  ];

  return (
    <nav className="mt-6 flex items-center gap-1 border-b border-[#BFD1DC]" aria-label="Project editor sections">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "relative inline-flex h-12 items-center gap-2.5 px-4 text-[13px] font-black transition",
              selected
                ? "text-[#17384E]"
                : "text-[#7A8D99] hover:text-[#355872]"
            )}
          >
            <Icon className={cn("h-4 w-4", selected ? "text-[#4F7EA4]" : "text-[#8EA0AA]")} />
            {item.label}
            {selected ? (
              <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-[#4F7EA4]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function TeamEditorGroup({
  title,
  description,
  items,
  emptyText,
  buttonLabel,
  onInvite,
  onRemove,
  feedback,
}) {
  return (
    <section className="py-5 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[18px] font-black tracking-[-0.02em] text-[#183247]">{title}</h3>
          <p className="mt-1 text-[13px] font-semibold leading-5 text-[#738694]">{description}</p>
        </div>

        <button
          type="button"
          onClick={onInvite}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[15px] border border-[#355872]/14 bg-white px-4 text-[12px] font-black text-[#294F69] shadow-[0_8px_20px_rgba(53,88,114,0.08)] transition hover:-translate-y-[1px] hover:border-[#7AAACE]/45 hover:bg-[#F7FBFD]"
        >
          <Plus className="h-4 w-4" />
          {buttonLabel}
        </button>
      </div>

      <div className="mt-4 border-y border-[#DCE7ED]">
        {items.length ? (
          <div className="divide-y divide-[#DCE7ED]">
            {items.map((item) => {
              const name =
                item?.name ||
                item?.fullName ||
                item?.companyName ||
                item?.email ||
                item?.id ||
                "Team member";
              const key = item?.id || item?.email || name;

              return (
                <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#EAF3F7] text-[12px] font-black text-[#355872]">
                      {item?.image ? (
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        String(name)
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-black text-[#183247]">{name}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#82939E]">Invitation pending</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-xl px-3 py-2 text-[11px] font-black text-[#81919C] transition hover:bg-red-50 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-4 text-[13px] font-semibold text-[#708491]">{emptyText}</p>
        )}
      </div>

      {feedback?.message ? (
        <div className="mt-3">
          <FieldFeedback
            error={feedback.type === "error" ? feedback.message : ""}
            success={feedback.type === "success" ? feedback.message : ""}
          />
        </div>
      ) : null}
    </section>
  );
}

function LiveProjectPreview({ formData }) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    async function resolveVideo() {
      setVideoUrl("");
      const file = formData.video;
      if (!file) return;

      if (typeof file === "string") {
        setVideoUrl(file);
        return;
      }

      if (file instanceof File || file instanceof Blob) {
        objectUrl = URL.createObjectURL(file);
        setVideoUrl(objectUrl);
        return;
      }

      if (file?.url) {
        setVideoUrl(file.url);
        return;
      }

      if (file?.id) {
        try {
          const saved = await getProjectFile(file.id);
          if (!saved?.file || cancelled) return;
          objectUrl = URL.createObjectURL(saved.file);
          if (!cancelled) setVideoUrl(objectUrl);
        } catch {
          if (!cancelled) setVideoUrl("");
        }
      }
    }

    resolveVideo();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [formData.video]);

  const title = formData.title.trim();
  const courseLabel =
    formData.type === "thesis"
      ? "Bachelor Project"
      : formData.courseName.trim();
  const description = formData.description.trim();
  const hasIdentity = Boolean(title || courseLabel || description || formData.tags.length || formData.video);

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
            Live preview
          </p>
          <p className="mt-1 text-[12px] font-semibold text-[#7B8E9A]">
            A miniature of the project page — not a separate design.
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#93A2AB]">
          updates live
        </span>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-[#B8CEDA] bg-[#EEF4F7] shadow-[0_18px_42px_rgba(53,88,114,0.13)]">
        <div className="border-b border-[#C9D9E2] bg-[#F8FBFC] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-7 rounded-full bg-[#E6C77B]" />
                <span className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-[#5B8198]">
                  {courseLabel || (formData.type === "thesis" ? "Bachelor Project" : "Course project")}
                </span>
              </div>

              {title ? (
                <h2 className="mt-3 text-[24px] font-black leading-[1.04] tracking-[-0.04em] text-[#122B3B]">
                  {title}
                </h2>
              ) : (
                <div className="mt-4 h-7 w-[72%] rounded-md bg-[#DCE8EE]" />
              )}

              <p className="mt-2 text-[11px] font-bold text-[#758895]">
                {formData.type === "thesis" ? "Bachelor Project" : "Course Project"}
              </p>
            </div>

            <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#BFD2DD] bg-white px-3 text-[10px] font-black text-[#4D748E]">
              {formData.visibility === "public" ? <Globe2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {formData.visibility === "public" ? "Public" : "Private"}
            </span>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          {formData.video ? (
            <div className="overflow-hidden rounded-[16px] border border-[#355872]/12 bg-[#111820] shadow-[0_12px_26px_rgba(16,32,48,0.16)]">
              {videoUrl ? (
                <video src={videoUrl} controls preload="metadata" playsInline className="aspect-video w-full object-contain" />
              ) : (
                <div className="flex aspect-video items-center justify-center text-[11px] font-bold text-white/60">
                  Video attached
                </div>
              )}
            </div>
          ) : null}

          {description ? (
            <p className="text-[13px] font-semibold leading-6 text-[#637987]">
              {description}
            </p>
          ) : hasIdentity ? (
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded bg-[#DCE7ED]" />
              <div className="h-2.5 w-[78%] rounded bg-[#DCE7ED]" />
            </div>
          ) : (
            <div className="border-l-2 border-[#7AAACE] pl-4 py-1">
              <p className="text-[12px] font-bold leading-5 text-[#7A8D99]">
                Start with the title. The preview will build only from information you actually add.
              </p>
            </div>
          )}

          {formData.tags.length ? (
            <div className="flex flex-wrap gap-2 border-t border-[#D3E0E7] pt-4">
              {formData.tags.slice(0, 6).map((tag) => (
                <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-[#355872] ring-1 ring-[#C7D8E2]">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {formData.github.trim() ? (
            <div className="flex items-center gap-2 border-t border-[#D3E0E7] pt-4 text-[10px] font-black text-[#4D748E]">
              <Github className="h-3.5 w-3.5" />
              Repository linked
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}


export default function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loadedProject] = useState(() => findStoredProject(projectId));
  const [formData, setFormData] = useState(() =>
    loadedProject ? mapProjectToFormData(loadedProject) : initialProjectData
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saveMessage, setSaveMessage] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  const [tagFeedback, setTagFeedback] = useState({
    type: "",
    message: "",
  });

  const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});
  const [inviteFeedback, setInviteFeedback] = useState({
    collab: { type: "", message: "" },
    instructor: { type: "", message: "" },
  });

  const [dialogs, setDialogs] = useState({
    collab: { open: false, value: "", error: "" },
    instructor: { open: false, value: "", error: "" },
  });

  const users = useMemo(() => getCollection("users") || [], []);

  const updateField = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    setSaveMessage({ type: "", message: "" });

    if (touched[field] || errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateProjectField(field, nextData),
      }));
    }

    if (field === "type") {
      const cleanedData =
        value === "thesis"
          ? { ...nextData, courseName: "" }
          : { ...nextData, thesisFile: null };

      setFormData(cleanedData);

      setErrors((current) => ({
        ...current,
        courseName: validateProjectField("courseName", cleanedData),
        thesisFile: validateProjectField("thesisFile", cleanedData),
      }));

      return;
    }
  };

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateProjectField(field, formData),
    }));
  };

  const handleVideoChange = (file) => {
    const nextData = { ...formData, video: file };
    setFormData(nextData);
    setTouched((current) => ({ ...current, video: true }));
    setErrors((current) => ({
      ...current,
      video: validateProjectField("video", nextData),
    }));
    setSaveMessage({ type: "", message: "" });
  };

  const handleThesisChange = (file) => {
    const nextData = { ...formData, thesisFile: file };
    setFormData(nextData);
    setTouched((current) => ({ ...current, thesisFile: true }));
    setErrors((current) => ({
      ...current,
      thesisFile: validateProjectField("thesisFile", nextData),
    }));
    setSaveMessage({ type: "", message: "" });
  };

  const addTag = () => {
    const cleanTag = formData.tagInput.trim();

    if (!cleanTag) {
      setTagFeedback({
        type: "error",
        message: "Enter a technology before adding it.",
      });
      return;
    }

    if (formData.tags.includes(cleanTag)) {
      setTagFeedback({
        type: "error",
        message: "This technology is already added.",
      });
      return;
    }

    setFormData((current) => ({
      ...current,
      tags: [...current.tags, cleanTag],
      tagInput: "",
    }));

    setTagFeedback({
      type: "success",
      message: "Technology added successfully.",
    });

    setSaveMessage({ type: "", message: "" });
  };

  const removeTag = (tagToRemove) => {
    setFormData((current) => ({
      ...current,
      tags: current.tags.filter((tag) => tag !== tagToRemove),
    }));

    setTagFeedback({
      type: "success",
      message: "Technology removed.",
    });

    setSaveMessage({ type: "", message: "" });
  };

  const getDisplayName = (user) => {
  return (
    user?.name ||
    user?.fullName ||
    user?.companyName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Unknown User"
  );
};

const normalizeUserRole = (value) => {
  const role = String(value || "").trim().toLowerCase();

  if (role.includes("instructor") || role.includes("teacher")) {
    return "instructor";
  }

  return "student";
};

const inviteMode = dialogs.instructor.open ? "instructor" : "student";

const inviteQuery =
  inviteMode === "instructor"
    ? dialogs.instructor.value
    : dialogs.collab.value;

const inviteCandidates = useMemo(() => {
  const existing =
    inviteMode === "instructor"
      ? formData.instructors
      : formData.collaborators;

  return users
    .filter((user) => {
      const role = normalizeUserRole(user.role);

      if (inviteMode === "instructor") {
        if (role !== "instructor") return false;
      } else {
        if (role !== "student") return false;
      }

      if (existing.includes(user.email)) {
        return false;
      }

      const query = String(inviteQuery || "").trim().toLowerCase();

      if (!query) return true;

      return [
        user.email,
        user.name,
        user.fullName,
        user.firstName,
        user.lastName,
        `${user.firstName || ""} ${user.lastName || ""}`,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    })
    .slice(0, 12);
}, [
  users,
  inviteMode,
  inviteQuery,
  formData.collaborators,
  formData.instructors,
]);

  const openInviteDialog = (kind) => {
    setDialogs((current) => ({
      ...current,
      [kind]: {
        open: true,
        value: "",
        error: "",
      },
    }));

    setInviteFeedback((current) => ({
      ...current,
      [kind]: { type: "", message: "" },
    }));
  };

  const setInviteDialogOpen = (kind, open) => {
    setDialogs((current) => ({
      ...current,
      [kind]: {
        ...current[kind],
        open,
        error: open ? current[kind].error : "",
      },
    }));
  };

  const updateInviteValue = (kind, value) => {
  setDialogs((current) => ({
    ...current,
    [kind]: {
      ...current[kind],
      value,
      error: "",
    },
  }));
};

  const selectInviteUser = (user) => {
  if (!user?.email) return;

  const kind = dialogs.instructor.open ? "instructor" : "collab";

  const field =
    kind === "instructor"
      ? "instructors"
      : "collaborators";

  setFormData((current) => {
    if (current[field].includes(user.email)) {
      return current;
    }

    return {
      ...current,
      [field]: [...current[field], user.email],
    };
  });

  setInviteFeedback((current) => ({
    ...current,
    [kind]: {
      type: "success",
      message: `${getDisplayName(user)} added successfully.`,
    },
  }));

  setDialogs((current) => ({
    ...current,
    [kind]: {
      open: false,
      value: "",
      error: "",
    },
  }));

  setSaveMessage({
    type: "",
    message: "",
  });
};
  const removeCollaborator = (emailToRemove) => {
    setFormData((current) => ({
      ...current,
      collaborators: current.collaborators.filter(
        (email) => email !== emailToRemove
      ),
    }));

    setInviteFeedback((current) => ({
      ...current,
      collab: {
        type: "success",
        message: "Collaborator removed.",
      },
    }));

    setSaveMessage({ type: "", message: "" });
  };

  const removeInstructor = (emailToRemove) => {
    setFormData((current) => ({
      ...current,
      instructors: current.instructors.filter(
        (email) => email !== emailToRemove
      ),
    }));

    setInviteFeedback((current) => ({
      ...current,
      instructor: {
        type: "success",
        message: "Course instructor removed.",
      },
    }));

    setSaveMessage({ type: "", message: "" });
  };

  const validateAllFields = () => {
    const nextErrors = {
      title: validateProjectField("title", formData),
      courseName: validateProjectField("courseName", formData),
      thesisFile: validateProjectField("thesisFile", formData),
      description: validateProjectField("description", formData),
      github: validateProjectField("github", formData),
      video: validateProjectField("video", formData),
    };

    setErrors(nextErrors);
    setTouched({
      title: true,
      courseName: true,
      thesisFile: true,
      description: true,
      github: true,
      video: true,
    });

    return Object.values(nextErrors).every((value) => !value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateAllFields();

if (!isValid) {
  const detailsHaveError =
    validateProjectField("title", formData) ||
    validateProjectField("courseName", formData) ||
    validateProjectField("description", formData);

  setActiveSection(detailsHaveError ? "details" : "media");

  setToast({
    open: true,
    title: "Unable to save changes",
    description: "Please check the highlighted fields and try again.",
    type: "error",
  });

  return;
}
    

    setIsSaving(true);

    try {
      const now = new Date().toISOString();

      const savedVideo = await saveProjectFile(
        formData.video,
        `${projectId}-video`
      );

      const savedThesisFile = await saveProjectFile(
        formData.thesisFile,
        `${projectId}-thesis`
      );
      const isBachelorProject = formData.type === "thesis";

      const storedProject = {
        ...loadedProject,
        id: projectId,
        title: formData.title.trim(),
        name: formData.title.trim(),
        type: isBachelorProject ? "Bachelor Project" : "Course Project",
        courseName: isBachelorProject ? "" : formData.courseName.trim(),
        courseCode: isBachelorProject ? "" : loadedProject.courseCode,
        course: isBachelorProject ? "" : formData.courseName.trim(),
        thesisFile: formData.thesisFile?.__existing
          ? loadedProject.thesisFile
          : createStoredFileReference(savedThesisFile),
        description: formData.description.trim(),
        github: formData.github.trim(),
        video: formData.video?.__existing
          ? loadedProject.video
          : createStoredFileReference(savedVideo),
        videoFileId: formData.video?.__existing
          ? loadedProject.videoFileId || loadedProject.video?.id || null
          : savedVideo?.id || null,
        technologies: formData.tags,
        collaborators: formData.collaborators,
        instructors: formData.instructors,
        visibility: formData.visibility,
        status: "draft",
        createdAt: loadedProject.createdAt || now,
        updatedAt: now,
      };

      updateStoredProject(projectId, storedProject);

      setFormData(mapProjectToFormData(storedProject));
      setErrors({});
      setTouched({});
      setTagFeedback({ type: "", message: "" });
      setInviteFeedback({
        collab: { type: "", message: "" },
        instructor: { type: "", message: "" },
      });

      setToast({
        open: true,
        title: "Project updated successfully",
        description: "Opening the updated project...",
        type: "success",
      });

      window.setTimeout(() => {
        navigate(`/project?projectId=${encodeURIComponent(projectId)}`, { replace: true });
      }, 250);
    } catch (error) {
  console.error("Failed to save project:", error);

  setToast({
    open: true,
    title: "Project could not be updated",
    description: "Please check the highlighted fields and try again.",
    type: "error",
  });
} finally {
      setIsSaving(false);
    }
  };

  if (!loadedProject) {
    return (
      <DashboardLayout>
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
        <AppCard className="p-8">
          <h1 className="text-3xl font-black text-[color:var(--ink)]">
            Project not found
          </h1>
          <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
            The project you are trying to edit could not be found in the demo database.
          </p>
          <AppButton
            type="button"
            onClick={() => navigate("/student-dashboard")}
            className="mt-6 rounded-2xl bg-[var(--primary)] px-6 font-black text-white"
          >
            Back to dashboard
          </AppButton>
        </AppCard>
      </DashboardLayout>
    );
  }

  const selectedCollaborators = formData.collaborators.map((value) => {
    const user = users.find((item) => item.email === value || String(item.id) === String(value));
    return user ? { ...user, id: value } : { id: value, email: value, name: value };
  });
  const selectedInstructors = formData.instructors.map((value) => {
    const user = users.find((item) => item.email === value || String(item.id) === String(value));
    return user ? { ...user, id: value } : { id: value, email: value, name: value };
  });
  return (
    <DashboardLayout>
      <SideToast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />

      <ProjectInvitePickerModal
        open={dialogs.collab.open || dialogs.instructor.open}
        mode={inviteMode}
        query={inviteQuery}
        message={
          inviteMode === "instructor"
            ? inviteFeedback.instructor.message
            : inviteFeedback.collab.message
        }
        candidates={inviteCandidates}
        onClose={() => {
          setInviteDialogOpen("collab", false);
          setInviteDialogOpen("instructor", false);
        }}
        onQueryChange={(value) =>
          updateInviteValue(
            inviteMode === "instructor" ? "instructor" : "collab",
            value
          )
        }
        onSelectUser={selectInviteUser}
      />

      <main className="px-4 py-6 pb-16 sm:px-6 lg:px-8">
        <form
          id="project-editor-form"
          onSubmit={handleSubmit}
          style={EDITOR_THEME}
          className="mx-auto w-full max-w-[1180px]"
        >
          {/* EDITOR HEADER */}
          <div className="border-b border-[#BFD1DC] pb-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-9 rounded-full bg-[#E6C77B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5C8199]">
                    Project editor
                  </p>
                </div>

                <h1 className="mt-3 text-[40px] font-black leading-none tracking-[-0.045em] text-[#112A3B] sm:text-[46px]">
                  Edit Project
                </h1>

                <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-[#718391]">
                  Refine the project details, media, and team in one focused workspace.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <div className="inline-flex h-11 items-center gap-2.5 rounded-[14px] border border-[#C4D6E0] bg-[#F7FAFC] px-4 shadow-[0_6px_16px_rgba(53,88,114,0.06)]">
                  {formData.visibility === "public" ? (
                    <Globe2 className="h-4 w-4 text-[#557C97]" />
                  ) : (
                    <Lock className="h-4 w-4 text-[#557C97]" />
                  )}
                  <span className="text-[12px] font-black text-[#355872]">
                    {formData.visibility === "public" ? "Public" : "Private"}
                  </span>
                  <Switch
                    checked={formData.visibility === "public"}
                    onCheckedChange={(checked) =>
                      updateField("visibility", checked ? "public" : "private")
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/project?projectId=${encodeURIComponent(projectId)}`)}
                  className="h-11 rounded-[14px] px-4 text-[12px] font-black text-[#718391] transition hover:bg-[#EAF2F6] hover:text-[#355872]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#355872] px-6 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#294A61] hover:shadow-[0_14px_30px_rgba(53,88,114,0.23)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>

          <EditorTabs active={activeSection} onChange={setActiveSection} />

          <div className="mt-6 w-full">
            {/* EDITOR */}
            <section className="relative w-full overflow-hidden rounded-[24px] border border-[#C9DBE4] border-l-[4px] border-l-[#355872] bg-[#FBFCFA] shadow-[0_18px_42px_rgba(53,88,114,0.10)]">
              {activeSection === "details" ? (
                <div className="px-6 py-7 sm:px-9">
                  <SectionHeader
                    title="Project details"
                    description="Update the identity and story people see first."
                    icon={FileText}
                  />

                  <div className="mt-7 space-y-6">
                    <FieldShell label="Project Title" required icon={Sparkles}>
                      <Input
                        className={inputStyles}
                        placeholder="Project Portfolio Web Platform"
                        value={formData.title}
                        onChange={(event) => updateField("title", event.target.value)}
                        onBlur={() => handleBlur("title")}
                      />
                      <FieldFeedback error={errors.title} helper="Use the name you want people to remember." />
                    </FieldShell>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldShell label="Project Type" required icon={FileText}>
                        <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                          <SelectTrigger className={selectTriggerStyles}>
                            <SelectValue placeholder="Choose project type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[16px] border-[#C6D8E2] bg-white text-[#183247] shadow-[0_18px_40px_rgba(53,88,114,0.16)]">
                            <SelectItem value="course">Course Project</SelectItem>
                            <SelectItem value="thesis">Bachelor Thesis</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldShell>

                      {formData.type === "course" ? (
                        <FieldShell label="Course" required icon={FileText}>
                          <Input
                            className={inputStyles}
                            placeholder="Software Engineering"
                            value={formData.courseName}
                            onChange={(event) => updateField("courseName", event.target.value)}
                            onBlur={() => handleBlur("courseName")}
                          />
                          <FieldFeedback error={errors.courseName} />
                        </FieldShell>
                      ) : (
                        <div className="rounded-[15px] border border-[#C5D6E0] bg-[#F4F8FA] px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7894A6]">Project type</p>
                          <p className="mt-1 text-[13px] font-black text-[#183247]">Bachelor Project</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="flex items-center gap-2 text-sm font-black text-[#183247]">
                          <FileText className="size-4 text-[#557C97]" />
                          Description <span className="text-[#C6A64D]">*</span>
                        </Label>
                        <span className="text-xs font-bold text-[#81919C]">{formData.description.length}/600</span>
                      </div>
                      <textarea
                        className="min-h-[190px] w-full resize-none rounded-[15px] border border-[#C5D6E0] bg-[#F4F8FA] px-4 py-4 text-[15px] font-semibold leading-7 text-[#183247] outline-none placeholder:text-[#8798A4] transition hover:border-[#90AFC0] focus:border-[#4F7EA4] focus:bg-white focus:ring-4 focus:ring-[#7AAACE]/14"
                        maxLength={600}
                        placeholder="What did you build, why does it matter, and what was your contribution?"
                        value={formData.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        onBlur={() => handleBlur("description")}
                      />
                      <FieldFeedback error={errors.description} helper="Write for someone seeing the project for the first time." />
                    </div>

                    <div className="border-t border-[#DCE7ED] pt-6">
                      <div className="mb-4">
                        <h3 className="text-[17px] font-black text-[#183247]">Technologies</h3>
                        <p className="mt-1 text-[12px] font-semibold text-[#7C8E99]">Keep the stack focused on what actually defines the project.</p>
                      </div>
                      <ChipInput
                        value={formData.tagInput}
                        items={formData.tags}
                        placeholder="React, Node.js, MongoDB"
                        emptyText="Type a technology and press Enter"
                        onValueChange={(value) => {
                          setFormData((current) => ({ ...current, tagInput: value }));
                          if (tagFeedback.message) setTagFeedback({ type: "", message: "" });
                        }}
                        onAdd={addTag}
                        onRemove={removeTag}
                        feedback={tagFeedback}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {activeSection === "media" ? (
                <div className="px-6 py-7 sm:px-9">
                  <SectionHeader
                    title="Media & links"
                    description="Update the repository, demo video, and thesis file without leaving the editor."
                    icon={Video}
                  />

                  <div className="mt-7 space-y-7">
                    <FieldShell label="GitHub Repository" icon={Github}>
                      <Input
                        className={inputStyles}
                        placeholder="https://github.com/your-project"
                        value={formData.github}
                        onChange={(event) => updateField("github", event.target.value)}
                        onBlur={() => handleBlur("github")}
                      />
                      <FieldFeedback error={errors.github} helper="Optional. Link the source when it can be shared." />
                    </FieldShell>

                    <ProjectVideoUploadField
                      file={formData.video}
                      onChange={handleVideoChange}
                      error={errors.video}
                    />

                    {formData.type === "thesis" ? (
                      <div className="border-t border-[#DCE7ED] pt-6">
                        <FileDropField
                          label="Thesis PDF"
                          required
                          accept="application/pdf"
                          file={formData.thesisFile}
                          icon={FileText}
                          onChange={handleThesisChange}
                          error={errors.thesisFile}
                          success={formData.thesisFile ? "Thesis file ready." : ""}
                          helper="Upload the current thesis document in PDF format."
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {activeSection === "team" ? (
                <div className="px-6 py-7 sm:px-9">
                  <SectionHeader
                    title="Team"
                    description="Keep the people connected to this project accurate."
                    icon={Users}
                  />

                  <div className="mt-7 divide-y divide-[#DCE7ED]">
                    {formData.type !== "thesis" ? (
                      <TeamEditorGroup
                        title="Collaborators"
                        description="Students working with you on this project."
                        items={selectedCollaborators}
                        emptyText="No collaborators added yet."
                        buttonLabel="Invite collaborator"
                        onInvite={() => openInviteDialog("collab")}
                        onRemove={removeCollaborator}
                        feedback={inviteFeedback.collab}
                      />
                    ) : null}

                    <TeamEditorGroup
                      title="Course instructors"
                      description="People who can review or supervise this project."
                      items={selectedInstructors}
                      emptyText="No instructors added yet."
                      buttonLabel="Invite instructor"
                      onInvite={() => openInviteDialog("instructor")}
                      onRemove={removeInstructor}
                      feedback={inviteFeedback.instructor}
                    />
                  </div>
                </div>
              ) : null}
            </section>

          </div>
        </form>
      </main>
    </DashboardLayout>
  );
}
