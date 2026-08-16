import { useEffect, useMemo, useState } from "react";
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
import ProjectInvitePickerModal from "@/components/project/ProjectInvitePickerModal";
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
import { cn } from "@/lib/utils";
import {
  addNotification,
  getCurrentUser,
  getCollection,
  createProject,
} from "@/data/demoStore";

const PROJECTS_STORAGE_KEY = "guc-portfolio-projects";
const PROJECT_FILES_DB = "guc-portfolio-files-db";
const PROJECT_FILES_STORE = "projectFiles";

const FALLBACK_COURSES = [
  "CSEN704",
  "Software Engineering",
  "Machine Learning",
  "Bachelor Project",
];

const initialProjectData = {
  title: "",
  type: "course",
  courseName: "",
  thesisDrafts: [],
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

const selectTriggerStyles = cn(
  inputStyles,
  "h-12 w-full justify-between py-0 text-left"
);



function makeInviteNotificationId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `notification-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `notification-${Date.now()}`;
}

function getDisplayName(user) {
  return (
    user?.name ||
    user?.fullName ||
    user?.companyName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Unknown User"
  );
}

function normalizeUserRole(value) {
  const role = String(value || "").trim().toLowerCase();

  if (role.includes("instructor") || role.includes("teacher")) {
    return "instructor";
  }

  if (role.includes("admin")) return "admin";
  if (role.includes("employer")) return "employer";

  return "student";
}

function userMatchesSearch(user, query) {
  const clean = String(query || "").trim().toLowerCase();

  if (!clean) return true;

  return [
    user.email,
    user.name,
    user.fullName,
    user.firstName,
    user.lastName,
    `${user.firstName || ""} ${user.lastName || ""}`,
  ].some((value) => String(value || "").toLowerCase().includes(clean));
}

function courseMatchesLabel(course, label) {
  const clean = String(label || "").trim().toLowerCase();

  if (!clean) return false;

  return [
    course?.id,
    course?.code,
    course?.courseCode,
    course?.name,
    course?.title,
  ]
    .filter(Boolean)
    .some((value) => String(value).trim().toLowerCase() === clean);
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
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch {
    return [];
  }
}

function saveProject(project) {
  const existingProjects = getStoredProjects();
  const updatedProjects = [project, ...existingProjects];
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
  return updatedProjects;
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
  if (!file) return null;

  const db = await openProjectFilesDB();

  const fallbackId = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const fileRecord = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `${prefix}-${Date.now()}-${crypto.randomUUID()}`
        : fallbackId,
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
            You can upload more than 1 draft
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
          {items.length ? `${items.length} added` : emptyText}
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
          <Chip key={item.id} onRemove={() => onRemove(item.id)}>
            {getDisplayName(item)} · no reply
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

    case "thesisDrafts":
      if (data.type !== "thesis") return "";
      if (data.thesisDrafts.length === 0) {
        return "Upload at least one thesis draft.";
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

export default function CreateNewProject() {
  const [availableCourses, setAvailableCourses] = useState(FALLBACK_COURSES);

  const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});

  useEffect(() => {
    const courses = getCollection("courses") || [];

    const courseLabels = courses
      .map((course) => course.code || course.courseCode || course.name || course.title)
      .filter(Boolean);

    if (courseLabels.length > 0) {
      setAvailableCourses(courseLabels);
    }
  }, []);

  const [formData, setFormData] = useState(initialProjectData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saveMessage, setSaveMessage] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  const [tagFeedback, setTagFeedback] = useState({
    type: "",
    message: "",
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
  const courses = useMemo(() => getCollection("courses") || [], []);
  const currentUser = getCurrentUser();

  const selectedCourse = useMemo(() => {
    const label =
      formData.type === "course" ? formData.courseName : "Bachelor Project";

    return courses.find((course) => courseMatchesLabel(course, label)) || null;
  }, [courses, formData.courseName, formData.type]);

  const selectedCollaborators = useMemo(
    () =>
      formData.collaborators
        .map((id) => users.find((user) => String(user.id) === String(id)))
        .filter(Boolean),
    [formData.collaborators, users]
  );

  const selectedInstructors = useMemo(
    () =>
      formData.instructors
        .map((id) => users.find((user) => String(user.id) === String(id)))
        .filter(Boolean),
    [formData.instructors, users]
  );

  const inviteMode = dialogs.instructor.open ? "instructor" : "student";

  const inviteQuery =
    inviteMode === "instructor"
      ? dialogs.instructor.value
      : dialogs.collab.value;

  const linkedInstructorIds = selectedCourse?.instructorIds || [];

  const inviteCandidates = useMemo(() => {
    const selectedIds =
      inviteMode === "instructor"
        ? formData.instructors
        : formData.collaborators;

    return users
      .filter((user) => {
        const role = normalizeUserRole(user.role);

        if (inviteMode === "instructor") {
          if (role !== "instructor") return false;

          if (
            linkedInstructorIds.length > 0 &&
            !linkedInstructorIds.some((id) => String(id) === String(user.id))
          ) {
            return false;
          }
        } else {
          if (role !== "student") return false;
          if (String(user.id) === String(currentUser?.id)) return false;
        }

        if (selectedIds.some((id) => String(id) === String(user.id))) {
          return false;
        }

        return userMatchesSearch(user, inviteQuery);
      })
      .slice(0, 12);
  }, [
    currentUser?.id,
    formData.collaborators,
    formData.instructors,
    inviteMode,
    inviteQuery,
    linkedInstructorIds,
    users,
  ]);

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
          ? { ...nextData, courseName: "", collaborators: [] }
          : { ...nextData, thesisDrafts: [] };

      setFormData(cleanedData);

      setErrors((current) => ({
        ...current,
        courseName: validateProjectField("courseName", cleanedData),
        thesisDrafts: validateProjectField("thesisDrafts", cleanedData),
      }));
    }

    if (field === "courseName") {
      setFormData((current) => ({
        ...current,
        instructors: [],
      }));

      setInviteFeedback((current) => ({
        ...current,
        instructor: {
          type: "",
          message: "",
        },
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

  const handleThesisUpload = (file) => {
    if (!file) return;

    const newDraft = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `draft-${Date.now()}`,
      file,
      uploadedAt: new Date().toISOString(),
      isFinal: false,
      visibility: "private",
    };

    const nextData = {
      ...formData,
      thesisDrafts: [...formData.thesisDrafts, newDraft],
    };

    setFormData(nextData);

    setTouched((current) => ({
      ...current,
      thesisDrafts: true,
    }));

    setErrors((current) => ({
      ...current,
      thesisDrafts: validateProjectField("thesisDrafts", nextData),
    }));

    setSaveMessage({
      type: "",
      message: "",
    });
  };

  const setFinalDraft = (draftId) => {
    setFormData((current) => ({
      ...current,
      thesisDrafts: current.thesisDrafts.map((draft) => ({
        ...draft,
        isFinal: draft.id === draftId,
        visibility: draft.id === draftId ? "public" : "private",
      })),
    }));
  };

  const removeDraft = (draftId) => {
    setFormData((current) => ({
      ...current,
      thesisDrafts: current.thesisDrafts.filter(
        (draft) => draft.id !== draftId
      ),
    }));
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
    if (!user?.id) return;

    const kind = dialogs.instructor.open ? "instructor" : "collab";
    const field = kind === "instructor" ? "instructors" : "collaborators";

    setFormData((current) => {
      if (current[field].some((id) => String(id) === String(user.id))) {
        return current;
      }

      return {
        ...current,
        [field]: [...current[field], user.id],
      };
    });

    setInviteFeedback((current) => ({
      ...current,
      [kind]: {
        type: "success",
        message: `${getDisplayName(user)} added as no reply.`,
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

    setSaveMessage({ type: "", message: "" });
  };

  const removeCollaborator = (userIdToRemove) => {
    setFormData((current) => ({
      ...current,
      collaborators: current.collaborators.filter(
        (id) => String(id) !== String(userIdToRemove)
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

  const removeInstructor = (userIdToRemove) => {
    setFormData((current) => ({
      ...current,
      instructors: current.instructors.filter(
        (id) => String(id) !== String(userIdToRemove)
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
      thesisDrafts: validateProjectField("thesisDrafts", formData),
      description: validateProjectField("description", formData),
      github: validateProjectField("github", formData),
      video: validateProjectField("video", formData),
    };

    setErrors(nextErrors);
    setTouched({
      title: true,
      courseName: true,
      thesisDrafts: true,
      description: true,
      github: true,
      video: true,
    });

    return Object.values(nextErrors).every((value) => !value);
  };

  const findCourseIdByLabel = (courseLabel) => {
    const matchedCourse = courses.find((course) => {
      const possibleLabels = [
        course.id,
        course.code,
        course.courseCode,
        course.name,
        course.title,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return possibleLabels.includes(String(courseLabel).toLowerCase());
    });

    return matchedCourse?.id || "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    

const isValid = validateAllFields();

if (!isValid) {
  setToast({
    open: true,
    title: "Unable to create project",
    description: "Please check the highlighted fields and try again.",
    type: "error",
  });

  return;
}

setIsSaving(true);
setSaveMessage({ type: "", message: "" });

    try {
      const now = new Date().toISOString();
      const projectId = `project-${Date.now()}`;

      if (!currentUser?.id) {
        throw new Error("No logged-in user found.");
      }

      const savedVideo = await saveProjectFile(
        formData.video,
        `${projectId}-video`
      );

      const savedThesisDrafts = await Promise.all(
        formData.thesisDrafts.map(async (draft) => {
          const savedFile = await saveProjectFile(
            draft.file,
            `${projectId}-draft`
          );

          return {
            id: draft.id,
            title: draft.file?.name || "Thesis draft",
            fileName: draft.file?.name || "Thesis draft",
            file: createStoredFileReference(savedFile),
            uploadedAt: draft.uploadedAt,
            isFinal: draft.isFinal,
            visibility: draft.visibility,
            feedback: [],
          };
        })
      );

      const isBachelorProject = formData.type === "thesis";

      const selectedCourseName = isBachelorProject
        ? "Bachelor Project"
        : formData.courseName.trim();

      const courseId = isBachelorProject
        ? findCourseIdByLabel("Bachelor Project")
        : findCourseIdByLabel(selectedCourseName);

      const collaboratorIds = isBachelorProject
        ? []
        : Array.from(new Set(formData.collaborators)).filter(
            (id) => String(id) !== String(currentUser.id)
          );

      const instructorIds = Array.from(new Set(formData.instructors)).filter(
        (id) => String(id) !== String(currentUser.id)
      );

      const collaboratorUsers = collaboratorIds
        .map((id) => users.find((user) => String(user.id) === String(id)))
        .filter(Boolean);

      const instructorUsers = instructorIds
        .map((id) => users.find((user) => String(user.id) === String(id)))
        .filter(Boolean);

      const invitationStatuses = [
        ...collaboratorIds.map((userId) => ({
          userId,
          role: "collaborator",
          status: "pending",
          sentAt: now,
          invitedAt: now,
        })),
        ...instructorIds.map((userId) => ({
          userId,
          role: "instructor",
          status: "pending",
          sentAt: now,
          invitedAt: now,
        })),
      ];

      const storedProject = {
        id: projectId,

        ownerId: currentUser.id,
        authorId: currentUser.id,
        studentId: currentUser.id,

        collaboratorIds,
        instructorIds,
        invitationStatuses,

        title: formData.title.trim(),
        name: formData.title.trim(),

        type: isBachelorProject ? "Bachelor Project" : "Course Project",
        courseId,
        courseName: selectedCourseName,
        course: selectedCourseName,

        thesisDrafts: savedThesisDrafts,
        description: formData.description.trim(),

        github: formData.github.trim(),
        githubUrl: formData.github.trim(),

        video: createStoredFileReference(savedVideo),

        technologies: formData.tags,
        tags: formData.tags,

        collaborators: collaboratorUsers,
        instructors: instructorUsers,

        visibility: formData.visibility,
        status: "draft",

        pinned: false,
        isPinned: false,

        rating: 0,
        comments: [],
        feedback: [],
        tasks: [],

        createdAt: now,
        updatedAt: now,
      };

      createProject(storedProject);
      saveProject(storedProject);

      invitationStatuses.forEach((invite) => {
        addNotification({
          id: makeInviteNotificationId(),
          userId: invite.userId,
          title: "Project invitation received",
          text: `${getDisplayName(currentUser)} invited you to join ${storedProject.title}.`,
          body: `${getDisplayName(currentUser)} invited you to join ${storedProject.title}.`,
          message: `${getDisplayName(currentUser)} invited you to join ${storedProject.title}.`,
          type: "project-invite",
          projectId: storedProject.id,
          invitationRole: invite.role,
          unread: true,
          createdAt: now,
          time: new Date().toLocaleString(),
        });
      });

      setFormData(initialProjectData);
      setErrors({});
      setTouched({});
      setTagFeedback({ type: "", message: "" });
      setInviteFeedback({
        collab: { type: "", message: "" },
        instructor: { type: "", message: "" },
      });
      setDialogs({
        collab: { open: false, value: "", error: "" },
        instructor: { open: false, value: "", error: "" },
      });

      

      setToast({
  open: true,
  title: "Project created successfully",
  description: "Your project has been created successfully.",
  type: "success",

});
    } catch (error) {
      console.error("Failed to save project:", error);
      setSaveMessage({
        type: "error",
        message: "Please check the highlighted fields.",
      });

      setToast({
    open: true,
    title: "Project could not be created",
    description:
       "Please check the highlighted fields and try again.",
    type: "error",
  });

    } finally {
      setIsSaving(false);
    }
  };

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
        onModeChange={(nextMode) => {
          if (nextMode === "instructor") {
            setInviteDialogOpen("collab", false);
            setInviteDialogOpen("instructor", true);
          } else {
            setInviteDialogOpen("instructor", false);
            setInviteDialogOpen("collab", true);
          }
        }}
        onQueryChange={(value) =>
          updateInviteValue(
            inviteMode === "instructor" ? "instructor" : "collab",
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
                    Create New Project
                  </h1>

                  <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[color:var(--muted)]">
                    Add your project details, files, technologies, teammates,
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
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateField("type", value)}
                >
                  <SelectTrigger className={selectTriggerStyles}>
                    <SelectValue placeholder="Choose project type" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl border-white/70 bg-[var(--surface-elevated)] text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-2xl">
                    <SelectItem value="course">Course Project</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                  </SelectContent>
                </Select>
                <FieldFeedback helper="Choose whether this is a course project or a thesis." />
              </FieldShell>
            </div>

            {formData.type === "course" ? (
              <FieldShell label="Course Name" required icon={FileText}>
                <Select
                  value={formData.courseName}
                  onValueChange={(value) => updateField("courseName", value)}
                >
                  <SelectTrigger className={selectTriggerStyles}>
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl border-white/70 bg-[var(--surface-elevated)] text-[color:var(--ink)] shadow-[var(--shadow-card)] backdrop-blur-2xl">
                    {availableCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FieldFeedback
                  error={errors.courseName}
                  helper="Select the course related to this project."
                />
              </FieldShell>
            ) : (
              <div className="space-y-4">
                <FileDropField
                  label="Upload Thesis Draft"
                  required
                  accept="application/pdf"
                  icon={FileText}
                  onChange={handleThesisUpload}
                  error={errors.thesisDrafts}
                  helper="Upload one or more thesis drafts."
                />

                <div className="space-y-3">
                  {formData.thesisDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="flex items-center justify-between rounded-2xl border border-white/60 bg-[var(--surface-soft)] p-4"
                    >
                      <div>
                        <p className="font-black text-[color:var(--ink)]">
                          {draft.file.name}
                        </p>

                        <p className="text-xs font-semibold text-[color:var(--muted)]">
                          {draft.isFinal
                            ? "Final Draft (Public)"
                            : "Private Draft"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {!draft.isFinal && (
                          <AppButton
                            type="button"
                            onClick={() => setFinalDraft(draft.id)}
                            className="min-h-12 rounded-2xl bg-[var(--primary)] px-4 font-black text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 hover:bg-[var(--dark)] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            Set Final
                          </AppButton>
                        )}

                        <AppButton
                          type="button"
                          onClick={() => removeDraft(draft.id)}
                          className="min-h-12 rounded-2xl bg-red-500 px-4 text-white transition hover:-translate-y-0.5 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Remove
                        </AppButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                items={selectedCollaborators}
                onRemove={removeCollaborator}
                onOpenDialog={() => openInviteDialog("collab")}
                buttonLabel="Invite collaborator"
                feedback={inviteFeedback.collab}
              />

              <InviteBox
                title="Course Instructors"
                description="Invite instructors who should review or supervise this project."
                emptyText="No course instructors added yet."
                items={selectedInstructors}
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

                {saveMessage.message ? (
                  <p
                    className={cn(
                      "mt-1 text-xs font-black",
                      saveMessage.type === "error"
                        ? "text-red-500"
                        : "text-[color:var(--primary)]"
                    )}
                  >
                    {saveMessage.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <AppButton
                  type="button"
                  onClick={() => {
                    setFormData(initialProjectData);
                    setErrors({});
                    setTouched({});
                    setTagFeedback({ type: "", message: "" });
                    setInviteFeedback({
                      collab: { type: "", message: "" },
                      instructor: { type: "", message: "" },
                    });
                    setDialogs({
                      collab: { open: false, value: "", error: "" },
                      instructor: { open: false, value: "", error: "" },
                    });
                    setSaveMessage({ type: "", message: "" });
                    setToast({
                    open: true,
                    title: "Draft reset successfully",
                    description: "Your project draft has been reset.",
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
                  {isSaving ? "Saving..." : "Create Project"}
                </AppButton>
              </div>
            </div>
          </AppCard>
        </form>
      </main>
    </DashboardLayout>
  );
}
