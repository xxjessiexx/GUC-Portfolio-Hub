import { useMemo, useState } from "react";
import ProjectInvitePickerModal from "@/components/project/ProjectInvitePickerModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
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
import AppSelect from "@/components/common/AppSelect";
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
  "min-h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";

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
    <div className="flex items-start gap-3">
      <AppIconFrame>
        <Icon className="size-5" />
      </AppIconFrame>

      <div>
        <h2 className="text-2xl font-black tracking-tight text-[color:var(--ink)]">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[color:var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FormSection({ title, description, icon, children, className }) {
  return (
    <AppCard className={cn("p-6 sm:p-7", className)}>
      <div className="space-y-6">
        <SectionHeader title={title} description={description} icon={icon} />
        {children}
      </div>
    </AppCard>
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

    case "video":
      if (!data.video) return "";
      if (!data.video.type.startsWith("video/")) {
        return "Uploaded file must be a video.";
      }
      return "";

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
  setToast({
    open: true,
    title: "Unable to save changes",
    description: "Please check the highlighted fields and try again.",
    type: "error",
  });

  return;
}
    

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
  description: "Your project changes have been saved.",
  type: "success",
});
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
      inviteMode === "instructor"
        ? "instructor"
        : "collab",
      value
    )
  }
  onSelectUser={selectInviteUser}
/>

      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-6">
          <AppCard className="p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-stretch">
              <div className="flex min-h-[14rem] flex-col justify-between rounded-[1.75rem] bg-[var(--surface-soft)] p-6 shadow-[0_18px_44px_rgba(53,88,114,0.06)] sm:p-7">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
                    Project Workspace
                  </p>

                  <h1 className="mt-4 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                    Edit Project
                  </h1>

                  <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[color:var(--muted)]">
                    Update your project details, files, technologies, teammates,
                    and course instructors.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {["Course / Thesis", "GitHub", "Demo Video", "Reviewers"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[color:var(--accent)]/22 px-4 py-2 text-sm font-black text-[color:var(--primary)]"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <VisibilityPanel
                value={formData.visibility}
                onChange={(value) => updateField("visibility", value)}
              />
            </div>
          </AppCard>

          <FormSection
            title="Project Details"
            description="Enter the main information about the project."
            icon={FileText}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <FieldShell label="Project Title" required icon={Sparkles}>
                <Input
                  className={inputStyles}
                  placeholder="E-Commerce Platform"
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  onBlur={() => handleBlur("title")}
                />
                <FieldFeedback
                  error={errors.title}
                  helper="This is the name that will appear in your portfolio."
                />
              </FieldShell>

              <FieldShell label="Project Type" required icon={FileText}>
                <AppSelect
                  value={formData.type}
                  onChange={(value) => updateField("type", value)}
                  options={[
                    { value: "course", label: "Course Project" },
                    { value: "thesis", label: "Thesis" },
                  ]}
                  placeholder="Choose project type"
                />
                <FieldFeedback helper="Choose whether this is a course project or a thesis." />
              </FieldShell>
            </div>

            {formData.type === "course" ? (
              <FieldShell label="Course Name" required icon={FileText}>
                <Input
                  className={inputStyles}
                  placeholder="Software Engineering"
                  value={formData.courseName}
                  onChange={(event) =>
                    updateField("courseName", event.target.value)
                  }
                  onBlur={() => handleBlur("courseName")}
                />
                <FieldFeedback
                  error={errors.courseName}
                  helper="Required for course projects."
                />
              </FieldShell>
            ) : (
              <FileDropField
                label="Upload Thesis PDF"
                required
                accept="application/pdf"
                file={formData.thesisFile}
                icon={FileText}
                onChange={handleThesisChange}
                error={errors.thesisFile}
                success={
                  formData.thesisFile ? "Thesis file selected successfully." : ""
                }
                helper="Upload your thesis document in PDF format."
              />
            )}

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label className="flex items-center gap-2 text-sm font-black text-[color:var(--ink)]">
                  <FileText className="size-4 text-[color:var(--primary)]" />
                  Description
                  <span className="text-[color:var(--gold)]">*</span>
                </Label>

                <span className="text-xs font-bold text-[color:var(--muted)]">
                  {formData.description.length}/600
                </span>
              </div>

              <textarea
                className="min-h-44 w-full resize-none rounded-[1.5rem] border border-white/70 bg-[var(--input-bg)] px-4 py-4 text-sm font-semibold leading-7 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] outline-none placeholder:text-[color:var(--muted)]/65 transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)]"
                maxLength={600}
                placeholder="Briefly describe what the project does, the problem it solves, and your main contribution."
                value={formData.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                onBlur={() => handleBlur("description")}
              />

              <FieldFeedback
                error={errors.description}
                helper="A good summary makes the project easier to understand later."
              />
            </div>
          </FormSection>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <FormSection
              title="Project Files"
              description="Attach the repository and demo material."
              icon={Link2}
            >
              <FieldShell label="GitHub Repository" icon={Github}>
                <Input
                  className={inputStyles}
                  placeholder="https://github.com/your-project"
                  value={formData.github}
                  onChange={(event) => updateField("github", event.target.value)}
                  onBlur={() => handleBlur("github")}
                />
                <FieldFeedback
                  error={errors.github}
                  helper="Optional, but recommended if you have a repository."
                />
              </FieldShell>

              <FileDropField
                label="Project Demo Video"
                accept="video/*"
                file={formData.video}
                icon={Video}
                onChange={handleVideoChange}
                error={errors.video}
                success={
                  formData.video ? "Video uploaded and ready to be saved." : ""
                }
                helper="Optional. This video will be saved for later preview."
              />
            </FormSection>

            <FormSection
              title="Technologies"
              description="List the languages, frameworks, and tools used in this project."
              icon={Sparkles}
            >
              <ChipInput
                value={formData.tagInput}
                items={formData.tags}
                placeholder="React, Node.js, MongoDB"
                emptyText="React, Node.js, MongoDB"
                onValueChange={(value) => {
                  setFormData((current) => ({
                    ...current,
                    tagInput: value,
                  }));
                  if (tagFeedback.message) {
                    setTagFeedback({ type: "", message: "" });
                  }
                }}
                onAdd={addTag}
                onRemove={removeTag}
                feedback={tagFeedback}
              />
            </FormSection>
          </div>

          <FormSection
            title="People"
            description="Invite student collaborators separately from course instructors."
            icon={Users}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <InviteBox
                title="Student Collaborators"
                description="Add teammates who worked on this project."
                emptyText="No student collaborators added yet."
                items={formData.collaborators}
                onRemove={removeCollaborator}
                onOpenDialog={() => openInviteDialog("collab")}
                buttonLabel="Invite collaborator"
                feedback={inviteFeedback.collab}
              />

              <InviteBox
                title="Course Instructors"
                description="Invite instructors who should review or supervise this project."
                emptyText="No course instructors added yet."
                items={formData.instructors}
                onRemove={removeInstructor}
                onOpenDialog={() => openInviteDialog("instructor")}
                buttonLabel="Invite instructor"
                feedback={inviteFeedback.instructor}
              />
            </div>
          </FormSection>

          <AppCard className="sticky bottom-4 z-20 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold leading-5 text-[color:var(--muted)]">
                  {formData.visibility === "public"
                    ? "This project will be visible on your portfolio."
                    : "This project will be saved as a private draft."}
                </p>

               
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <AppButton
                  type="button"
                  onClick={() => {
                    setFormData(mapProjectToFormData(loadedProject));
                    setErrors({});
                    setTouched({});
                    setTagFeedback({ type: "", message: "" });
                    setInviteFeedback({
                      collab: { type: "", message: "" },
                      instructor: { type: "", message: "" },
                    });
                    setSaveMessage({ type: "", message: "" });
                    setToast({
  open: true,
  title: "Project reset successfully",
  description: "Your project changes have been reset.",
  type: "success",
});

                  }}
                  disabled={isSaving}
                  className="min-h-12 rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-6 font-black text-[color:var(--primary)] shadow-[0_10px_28px_rgba(53,88,114,0.06)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-elevated)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reset draft
                </AppButton>

                <AppButton
                  type="submit"
                  disabled={isSaving}
                  className="min-h-12 rounded-2xl bg-[var(--primary)] px-8 font-black text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 hover:bg-[var(--dark)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <CheckCircle2 className="mr-2 size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </AppButton>
              </div>
            </div>
          </AppCard>
        </form>
      </main>
    </DashboardLayout>
  );
}
