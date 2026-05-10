import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Accessibility,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Heart,
  IdCard,
  ImagePlus,
  KeyRound,
  Laptop,
  LayoutDashboard,
  Link as LinkIcon,
  Lock,
  MapPin,
  MessageSquare,
  Moon,
  Palette,
  RotateCcw,
  Save,
  School,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  User,
  Users,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Switch } from "@/components/ui/switch";
import { useUserProfile } from "@/context/UserProfileContext";
import { useTheme } from "@/hooks/useTheme";
import {
  getAdminModuleState,
  getAllProjects,
  getCollection,
  getCurrentUser,
  getInternshipsForEmployer,
  getNotificationsForUser,
  getOwnedProjectsForUser,
  getProjectsForUser,
  getUserById,
  resetDemoDb,
  updateUser,
} from "@/data/demoStore";

const AI_COLLAPSED_KEY = "guc-ai-companion-collapsed";
const AI_ENABLED_KEY = "guc-ai-companion-enabled";
const AI_EMOTIONS_KEY = "guc-ai-companion-emotions";
const AI_SLEEP_KEY = "guc-ai-companion-sleeping-mode";
const AI_HEARTS_KEY = "guc-ai-companion-hearts";
const AI_AUTOCOLLAPSE_KEY = "guc-ai-companion-auto-collapse";
const AI_PERSONALITY_KEY = "guc-ai-companion-personality";
const ACCESSIBILITY_KEY = "guc-portfolio-accessibility-preferences";

const roleConfig = {
  student: {
    label: "Student",
    title: "Student Settings",
    subtitle: "Portfolio visibility, internships, projects, notifications, and your personal workspace preferences.",
    icon: GraduationCap,
    dashboardPath: "/student-dashboard",
    profilePath: "/edit-student-profile",
    accent: "from-[#355872] via-[#4f82a6] to-[#9CD5FF]",
    quickActions: [
      { label: "Edit portfolio profile", path: "/edit-student-profile", icon: User },
      { label: "Manage portfolio", path: "/manage-portfolio", icon: Eye },
      { label: "Create project", path: "/create-project", icon: Sparkles },
      { label: "My applications", path: "/my-applications", icon: IdCard },
    ],
  },
  instructor: {
    label: "Course Instructor",
    title: "Instructor Settings",
    subtitle: "Academic profile, course review workflow, feedback preferences, and student contact controls.",
    icon: School,
    dashboardPath: "/instructor-dashboard",
    profilePath: "/edit-instructor-profile",
    accent: "from-[#2C3947] via-[#355872] to-[#7AAACE]",
    quickActions: [
      { label: "Edit instructor profile", path: "/edit-instructor-profile", icon: User },
      { label: "Explore projects", path: "/view-all-projects", icon: Search },
      { label: "Course discovery", path: "/discover", icon: School },
      { label: "Messages", path: "/chat", icon: MessageSquare },
    ],
  },
  employer: {
    label: "Employer",
    title: "Employer Settings",
    subtitle: "Company profile, hiring preferences, candidate privacy, and internship notification controls.",
    icon: Building2,
    dashboardPath: "/employer-dashboard",
    profilePath: "/edit-employer-profile",
    accent: "from-[#25445d] via-[#355872] to-[#E6C77B]",
    quickActions: [
      { label: "Edit company profile", path: "/edit-employer-profile", icon: Building2 },
      { label: "Manage internships", path: "/manage-internships", icon: Briefcase },
      { label: "View applicants", path: "/manage-applicants/emp-int-1", icon: Users },
      { label: "Favorites", path: "/fav-list", icon: Heart },
    ],
  },
  admin: {
    label: "Administrator",
    title: "Admin Settings",
    subtitle: "Moderation defaults, platform preferences, security controls, and demo database operations.",
    icon: ShieldCheck,
    dashboardPath: "/admin-dashboard",
    profilePath: "/admin-dashboard",
    accent: "from-[#162333] via-[#355872] to-[#7AAACE]",
    quickActions: [
      { label: "Manage users", path: "/admin/users", icon: Users },
      { label: "Manage companies", path: "/admin/employers", icon: Building2 },
      { label: "Manage courses", path: "/admin/courses", icon: School },
      { label: "Flagged projects", path: "/admin/flagged-projects", icon: ShieldCheck },
    ],
  },
};

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "workspace", label: "Workspace", icon: LayoutDashboard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Companion", icon: Bot },
  { id: "data", label: "Data & Reset", icon: Download },
];

function normalizeRole(value) {
  const role = String(value || "").trim().toLowerCase();
  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer") || role.includes("company")) return "employer";
  return "student";
}

function readLocalBoolean(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function writeLocalBoolean(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, String(Boolean(value)));
}

function writeLocalString(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, String(value || ""));
}

function cleanList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function todayLabel() {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toLocaleString();
  }
}

function getDefaultPreferences(role, user = {}) {
  const existing = user.preferences || {};
  return {
    privacy: {
      portfolioVisibility: role === "student" ? "public" : "listed",
      showEmail: role === "admin" ? true : false,
      showGpa: false,
      showSemester: role === "student",
      allowEmployerContact: role === "student",
      allowInstructorView: role === "student",
      showOfficeHours: role === "instructor",
      showCourses: role === "instructor",
      allowStudentMessages: role === "instructor",
      companyVisibility: role === "employer" ? "listed" : "private",
      showActiveInternships: role === "employer",
      showCompanyEmail: false,
      allowStudentMessagesToCompany: role === "employer",
      ...existing.privacy,
    },
    notifications: {
      mutedAll: Boolean(user.notificationMuted),
      inApp: true,
      email: false,
      projectInvitations: true,
      projectFeedback: true,
      messages: true,
      courses: role === "instructor" || role === "admin",
      internshipApplications: role === "student" || role === "employer",
      employerApprovals: role === "admin",
      linkRequests: role === "admin" || role === "instructor",
      adminAnnouncements: true,
      ...existing.notifications,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      autoLock: false,
      ...existing.security,
    },
    appearance: {
      reduceMotion: false,
      compactMode: false,
      largeText: false,
      highContrast: false,
      ...existing.appearance,
    },
    ai: {
      enabled: readLocalBoolean(AI_ENABLED_KEY, true),
      collapsed: readLocalBoolean(AI_COLLAPSED_KEY, false),
      emotions: readLocalBoolean(AI_EMOTIONS_KEY, true),
      sleepingMode: readLocalBoolean(AI_SLEEP_KEY, true),
      hearts: readLocalBoolean(AI_HEARTS_KEY, true),
      autoCollapse: readLocalBoolean(AI_AUTOCOLLAPSE_KEY, true),
      personality: typeof window !== "undefined" ? localStorage.getItem(AI_PERSONALITY_KEY) || "friendly" : "friendly",
      ...existing.ai,
    },
    workspace: {
      defaultDashboardTab: "overview",
      defaultSort: role === "instructor" ? "newest" : role === "admin" ? "risk-first" : "recommended",
      reviewReminderFrequency: "daily",
      autoHideClosedInternships: true,
      preferredProjectCategories: role === "student" ? ["AI", "Web", "Software Engineering"] : [],
      internshipInterests: role === "student" ? ["Frontend", "AI", "Data"] : [],
      candidatePreferenceTags: role === "employer" ? ["React", "Python", "Teamwork"] : [],
      adminModerationMode: role === "admin",
      ...existing.workspace,
    },
    connectedAccounts: {
      linkedin: user.links?.linkedin || user.linkedin || "",
      github: user.links?.github || user.github || "",
      behance: user.links?.behance || "",
      website: user.links?.website || user.website || "",
      googleScholar: user.links?.googleScholar || "",
      companyWebsite: user.links?.companyWebsite || user.companyWebsite || "",
      ...existing.connectedAccounts,
    },
  };
}

function buildForm(user = {}) {
  const links = user.links || {};
  const role = normalizeRole(user.role || user.accountRole || user.systemRole);
  const locationLabel = typeof user.location === "string" ? user.location : user.location?.label || "";
  return {
    id: user.id || "",
    name: user.name || "",
    email: user.email || "",
    status: user.status || "active",
    title: user.title || "",
    username: user.username || "",
    image: user.image || user.avatar || "",
    bio: user.bio || user.companyBio || "",
    major: user.major || "",
    semester: user.semester || "",
    faculty: user.faculty || "",
    skillsText: joinList(user.skills),
    linkedin: links.linkedin || user.linkedin || "",
    github: links.github || user.github || "",
    behance: links.behance || "",
    website: links.website || user.website || "",
    office: user.office || "",
    officeHours: user.officeHours || "",
    department: user.department || "",
    researchInterestsText: joinList(user.researchInterests),
    educationText: joinList(user.education),
    coursesText: joinList(user.linkedCourses || user.courses),
    companyName: user.companyName || (role === "employer" ? user.name : ""),
    industry: user.industry || "",
    companyBio: user.companyBio || user.bio || "",
    locationLabel,
    documentCount: user.uploadedDocuments?.length || user.documents?.length || 0,
  };
}

function normalizeFormForSave(role, form, existingUser, preferences) {
  const links = {
    ...(existingUser?.links || {}),
    linkedin: form.linkedin || preferences.connectedAccounts.linkedin,
    github: form.github || preferences.connectedAccounts.github,
    behance: form.behance || preferences.connectedAccounts.behance,
    website: form.website || preferences.connectedAccounts.website,
    googleScholar: preferences.connectedAccounts.googleScholar,
    companyWebsite: preferences.connectedAccounts.companyWebsite,
  };

  const base = {
    name: role === "employer" ? form.companyName || form.name : form.name,
    email: form.email,
    title: form.title,
    bio: role === "employer" ? form.companyBio || form.bio : form.bio,
    image: form.image,
    avatar: form.image,
    status: form.status,
    role,
    systemRole: role,
    accountRole: role,
    links,
    preferences,
    notificationMuted: preferences.notifications.mutedAll,
  };

  if (role === "student") {
    return {
      ...base,
      major: form.major,
      semester: form.semester,
      faculty: form.faculty,
      skills: cleanList(form.skillsText),
    };
  }

  if (role === "instructor") {
    return {
      ...base,
      office: form.office,
      officeHours: form.officeHours,
      department: form.department,
      researchInterests: cleanList(form.researchInterestsText),
      education: cleanList(form.educationText),
      linkedCourses: cleanList(form.coursesText),
    };
  }

  if (role === "employer") {
    return {
      ...base,
      companyName: form.companyName,
      industry: form.industry,
      companyBio: form.companyBio || form.bio,
      location: {
        ...(typeof existingUser?.location === "object" ? existingUser.location : {}),
        label: form.locationLabel,
      },
    };
  }

  return {
    ...base,
    username: form.username,
  };
}

function buildStats(role, user) {
  if (!user?.id) return [];
  if (role === "student") {
    const projects = getOwnedProjectsForUser(user.id);
    const notifications = getNotificationsForUser(user.id);
    return [
      ["Owned projects", projects.length],
      ["Public projects", projects.filter((p) => String(p.visibility).toLowerCase() === "public").length],
      ["Unread alerts", notifications.filter((n) => n.unread).length],
    ];
  }
  if (role === "instructor") {
    const projects = getProjectsForUser(user.id, { includePrivate: false });
    const courses = getCollection("courses").filter((course) => course.instructorIds?.includes(user.id));
    return [
      ["Linked courses", courses.length],
      ["Visible projects", projects.length],
      ["Unread alerts", getNotificationsForUser(user.id).filter((n) => n.unread).length],
    ];
  }
  if (role === "employer") {
    const internships = getInternshipsForEmployer(user.id);
    const applicants = internships.reduce((sum, item) => sum + (item.applications?.length || item.applicants || 0), 0);
    return [
      ["Internships", internships.length],
      ["Applicants", applicants],
      ["Saved projects", user.favoriteProjectIds?.length || 0],
    ];
  }
  const admin = getAdminModuleState();
  return [
    ["Users", admin.statistics.totalUsers],
    ["Projects", admin.statistics.totalProjects],
    ["Courses", admin.statistics.totalCourses],
  ];
}

function getCompletionChecks(role, form, preferences) {
  const base = [
    ["Profile image", Boolean(form.image)],
    ["Security reviewed", preferences.security.loginAlerts || preferences.security.twoFactorEnabled],
    ["Notifications configured", Object.values(preferences.notifications).some(Boolean)],
  ];
  if (role === "student") {
    return [
      ["Major added", Boolean(form.major)],
      ["Skills added", cleanList(form.skillsText).length > 0],
      ["LinkedIn/CV link", Boolean(form.linkedin || preferences.connectedAccounts.linkedin)],
      ["Portfolio visibility chosen", Boolean(preferences.privacy.portfolioVisibility)],
      ...base,
    ];
  }
  if (role === "instructor") {
    return [
      ["Biography added", Boolean(form.bio)],
      ["Research interests", cleanList(form.researchInterestsText).length > 0],
      ["Education background", cleanList(form.educationText).length > 0],
      ["Office hours visible", Boolean(form.office || form.officeHours)],
      ...base,
    ];
  }
  if (role === "employer") {
    return [
      ["Company biography", Boolean(form.companyBio || form.bio)],
      ["Industry selected", Boolean(form.industry)],
      ["Company location", Boolean(form.locationLabel)],
      ["Verification docs noted", Number(form.documentCount || 0) > 0],
      ...base,
    ];
  }
  return [
    ["Admin account active", form.status !== "inactive"],
    ["Email present", Boolean(form.email)],
    ["Moderation defaults", preferences.workspace.adminModerationMode],
    ...base,
  ];
}

function applyAccessibilityPreferences(appearance) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.reduceMotion = appearance.reduceMotion ? "true" : "false";
  root.dataset.compactMode = appearance.compactMode ? "true" : "false";
  root.dataset.largeText = appearance.largeText ? "true" : "false";
  root.dataset.highContrast = appearance.highContrast ? "true" : "false";
  localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(appearance));
}

function SettingsShell({ children, title, description, icon: Icon, action }) {
  return (
    <AppCard className="p-5 sm:p-6" variant="strong">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)] ring-1 ring-[color:var(--primary)]/10">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-[color:var(--ink)]">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </AppCard>
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange, disabled = false, badge }) {
  return (
    <div className={`flex flex-col gap-4 rounded-[24px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-4 transition sm:flex-row sm:items-center sm:justify-between ${disabled ? "opacity-55" : "hover:bg-[var(--surface-strong)]"}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)] ring-1 ring-[color:var(--primary)]/10">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black text-[color:var(--ink)]">{title}</h3>
            {badge && <span className="rounded-full bg-[color:var(--gold)]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-[color:var(--primary)]">{badge}</span>}
          </div>
          <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="shrink-0 self-start sm:self-center">
        <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-4 text-sm font-bold text-[color:var(--ink)] shadow-sm outline-none transition placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--accent)]/25"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <textarea
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-bold leading-6 text-[color:var(--ink)] shadow-sm outline-none transition placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--accent)]/25"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-[color:var(--border-blue)] bg-[var(--surface-elevated)] px-4 text-sm font-bold text-[color:var(--ink)] shadow-sm outline-none transition focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--accent)]/25"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function QuickActionCard({ action }) {
  const Icon = action.icon;
  return (
    <Link
      to={action.path}
      className="group flex items-center justify-between rounded-[24px] border border-[color:var(--border-soft)] bg-[var(--surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)] hover:shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-black text-[color:var(--ink)]">{action.label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--primary)]" />
    </Link>
  );
}

function RoleSpecificFields({ role, form, setForm }) {
  const patch = (updates) => setForm((prev) => ({ ...prev, ...updates }));
  if (role === "student") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <TextInput label="Major" value={form.major} onChange={(major) => patch({ major })} placeholder="MET / CSEN / DMET" />
        <TextInput label="Semester" value={form.semester} onChange={(semester) => patch({ semester })} placeholder="6" />
        <TextInput label="Faculty" value={form.faculty} onChange={(faculty) => patch({ faculty })} placeholder="Faculty of Engineering" />
        <TextInput label="Skills" value={form.skillsText} onChange={(skillsText) => patch({ skillsText })} placeholder="React, Python, UI/UX" />
        <div className="lg:col-span-2"><TextArea label="Portfolio bio" value={form.bio} onChange={(bio) => patch({ bio })} placeholder="Write a short portfolio biography..." /></div>
      </div>
    );
  }
  if (role === "instructor") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <TextInput label="Office" value={form.office} onChange={(office) => patch({ office })} placeholder="C7.214" />
        <TextInput label="Office hours" value={form.officeHours} onChange={(officeHours) => patch({ officeHours })} placeholder="Sunday 12:00 - 2:00" />
        <TextInput label="Department" value={form.department} onChange={(department) => patch({ department })} placeholder="Computer Science" />
        <TextInput label="Linked courses" value={form.coursesText} onChange={(coursesText) => patch({ coursesText })} placeholder="CSEN 601, Bachelor Project" />
        <TextInput label="Research interests" value={form.researchInterestsText} onChange={(researchInterestsText) => patch({ researchInterestsText })} placeholder="HCI, Software Engineering" />
        <TextInput label="Education background" value={form.educationText} onChange={(educationText) => patch({ educationText })} placeholder="PhD Computer Science, MSc Software Engineering" />
        <div className="lg:col-span-2"><TextArea label="Instructor biography" value={form.bio} onChange={(bio) => patch({ bio })} placeholder="Write a short academic biography..." /></div>
      </div>
    );
  }
  if (role === "employer") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <TextInput label="Company name" value={form.companyName} onChange={(companyName) => patch({ companyName })} placeholder="TechBridge" />
        <TextInput label="Industry" value={form.industry} onChange={(industry) => patch({ industry })} placeholder="Software, AI & Automotive Tech" />
        <TextInput label="Company location" value={form.locationLabel} onChange={(locationLabel) => patch({ locationLabel })} placeholder="New Cairo, Egypt" />
        <TextInput label="Contact email" value={form.email} onChange={(email) => patch({ email })} placeholder="company@example.com" type="email" />
        <div className="lg:col-span-2"><TextArea label="Company biography" value={form.companyBio || form.bio} onChange={(companyBio) => patch({ companyBio, bio: companyBio })} placeholder="Describe the company and hiring focus..." /></div>
      </div>
    );
  }
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TextInput label="Admin display name" value={form.name} onChange={(name) => patch({ name })} placeholder="Nadine Amin" />
      <TextInput label="Admin email" value={form.email} onChange={(email) => patch({ email })} placeholder="admin@guc.edu.eg" type="email" />
      <TextInput label="Title" value={form.title} onChange={(title) => patch({ title })} placeholder="Platform Administrator" />
      <TextInput label="Username" value={form.username} onChange={(username) => patch({ username })} placeholder="nadine.admin" />
      <div className="lg:col-span-2"><TextArea label="Admin note" value={form.bio} onChange={(bio) => patch({ bio })} placeholder="Short admin profile note..." /></div>
    </div>
  );
}

function ProfileCompletion({ role, form, preferences }) {
  const checks = getCompletionChecks(role, form, preferences);
  const complete = checks.filter(([, ok]) => ok).length;
  const percentage = Math.round((complete / checks.length) * 100);
  return (
    <AppCard className="p-6" variant="dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55">Readiness score</p>
          <h2 className="mt-2 text-4xl font-black text-white">{percentage}%</h2>
          <p className="mt-1 text-sm font-semibold text-white/65">Requirement coverage + real product settings.</p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[color:var(--accent)] ring-1 ring-white/10"><Sparkles className="h-6 w-6" /></span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[color:var(--accent)] transition-all" style={{ width: `${percentage}%` }} /></div>
      <div className="mt-5 space-y-3">
        {checks.map(([label, ok]) => (
          <div key={label} className="flex items-center gap-2 text-sm font-bold text-white/75">
            <CheckCircle2 className={`h-4 w-4 ${ok ? "text-[color:var(--accent)]" : "text-white/25"}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </AppCard>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { theme, setTheme, isDark } = useTheme();
  const [user, setUser] = useState(() => getCurrentUser() || profile);
  const role = normalizeRole(user?.role || user?.accountRole || profile?.role);
  const config = roleConfig[role] || roleConfig.student;
  const RoleIcon = config.icon;

  const [activeSection, setActiveSection] = useState("profile");
  const [form, setForm] = useState(() => buildForm(user));
  const [preferences, setPreferences] = useState(() => getDefaultPreferences(role, user));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const nextUser = getCurrentUser() || profile;
      setUser(nextUser);
      setForm(buildForm(nextUser));
      setPreferences(getDefaultPreferences(normalizeRole(nextUser?.role || profile?.role), nextUser));
    };
    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("demo-current-user-change", refresh);
    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("demo-current-user-change", refresh);
    };
  }, [profile]);

  useEffect(() => {
    applyAccessibilityPreferences(preferences.appearance);
  }, [preferences.appearance]);

  const stats = useMemo(() => buildStats(role, user), [role, user]);
  const notifications = useMemo(() => getNotificationsForUser(user?.id), [user?.id]);

  const patchPreference = (section, updates) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  const handleSaveAll = () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const existing = getUserById(user.id) || user;
      const saved = updateUser(user.id, normalizeFormForSave(role, form, existing, preferences));
      if (preferences.ai) {
        writeLocalBoolean(AI_ENABLED_KEY, preferences.ai.enabled);
        writeLocalBoolean(AI_COLLAPSED_KEY, preferences.ai.collapsed);
        writeLocalBoolean(AI_EMOTIONS_KEY, preferences.ai.emotions);
        writeLocalBoolean(AI_SLEEP_KEY, preferences.ai.sleepingMode);
        writeLocalBoolean(AI_HEARTS_KEY, preferences.ai.hearts);
        writeLocalBoolean(AI_AUTOCOLLAPSE_KEY, preferences.ai.autoCollapse);
        writeLocalString(AI_PERSONALITY_KEY, preferences.ai.personality);
        window.dispatchEvent(new Event("storage"));
      }
      applyAccessibilityPreferences(preferences.appearance);
      const next = saved || { ...existing, ...normalizeFormForSave(role, form, existing, preferences) };
      setUser(next);
      updateProfile(next);
      toast.success("Settings saved", { description: "Profile, preferences, and seed/demoStore data were updated." });
    } catch (error) {
      toast.error("Could not save settings", { description: error?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const exportMyData = () => {
    const projects = role === "student" ? getOwnedProjectsForUser(user.id) : getAllProjects({ includePrivate: true });
    const payload = {
      exportedAt: new Date().toISOString(),
      role,
      user,
      preferences,
      notifications,
      projects: role === "admin" ? projects : projects.filter((project) => project.ownerId === user.id || project.instructorIds?.includes(user.id)),
      internships: role === "employer" ? getInternshipsForEmployer(user.id) : [],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${role}-settings-export-${user.id || "demo"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Data export prepared");
  };

  const resetPreferences = () => {
    const defaults = getDefaultPreferences(role, { ...user, preferences: {} });
    setPreferences(defaults);
    toast.success("Preferences reset", { description: "Save changes to persist the reset." });
  };

  const resetDatabase = () => {
    const accepted = window.confirm("Reset the whole seed demo database? This restores the original demo data and clears local edits.");
    if (!accepted) return;
    resetDemoDb();
    toast.success("Demo database reset");
  };

  const renderSection = () => {
    if (activeSection === "profile") {
      return (
        <SettingsShell
          title="Profile & role information"
          description="This covers the required profile data for each stakeholder while keeping the UI closer to a real SaaS account settings page."
          icon={User}
          action={<AppButton variant="brand" onClick={handleSaveAll} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save all"}</AppButton>}
        >
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <TextInput label={role === "employer" ? "Contact person / display name" : "Display name"} value={form.name} onChange={(name) => setForm((prev) => ({ ...prev, name }))} />
            <TextInput label="Profile image / logo URL" value={form.image} onChange={(image) => setForm((prev) => ({ ...prev, image }))} placeholder="Paste an image URL" />
          </div>
          <RoleSpecificFields role={role} form={form} setForm={setForm} />
          {role === "employer" && (
            <div className="mt-5 rounded-[24px] border border-[color:var(--border-blue)] bg-[color:var(--accent)]/10 p-4">
              <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-[color:var(--primary)]" /><p className="text-sm font-semibold leading-6 text-[color:var(--muted)]"><strong className="text-[color:var(--ink)]">Location-ready:</strong> this stores the company location label in demoStore. Your map/profile page can reuse the same field later.</p></div>
            </div>
          )}
        </SettingsShell>
      );
    }

    if (activeSection === "privacy") {
      return (
        <SettingsShell title="Privacy & visibility" description="Control what other stakeholders can see before they contact you or review your work." icon={Eye}>
          <div className="grid gap-4 lg:grid-cols-2">
            {role === "student" && <>
              <SelectInput label="Portfolio visibility" value={preferences.privacy.portfolioVisibility} onChange={(portfolioVisibility) => patchPreference("privacy", { portfolioVisibility })} options={[{value:"public",label:"Public"},{value:"guc",label:"GUC users only"},{value:"private",label:"Private"}]} />
              <ToggleRow icon={Building2} title="Allow employers to contact me" description="Useful for internships and portfolio discovery." checked={preferences.privacy.allowEmployerContact} onChange={(allowEmployerContact) => patchPreference("privacy", { allowEmployerContact })} />
              <ToggleRow icon={School} title="Allow instructors to view my work" description="Keeps academic review flows smooth." checked={preferences.privacy.allowInstructorView} onChange={(allowInstructorView) => patchPreference("privacy", { allowInstructorView })} />
              <ToggleRow icon={IdCard} title="Show semester / academic level" description="Show academic level on portfolio cards." checked={preferences.privacy.showSemester} onChange={(showSemester) => patchPreference("privacy", { showSemester })} />
            </>}
            {role === "instructor" && <>
              <ToggleRow icon={User} title="Public instructor profile" description="Allow students and employers to discover your instructor profile." checked={preferences.privacy.portfolioVisibility !== "private"} onChange={(checked) => patchPreference("privacy", { portfolioVisibility: checked ? "listed" : "private" })} />
              <ToggleRow icon={School} title="Show courses taught" description="Supports course-linked project discovery." checked={preferences.privacy.showCourses} onChange={(showCourses) => patchPreference("privacy", { showCourses })} />
              <ToggleRow icon={MessageSquare} title="Allow student messages" description="Students can message you about projects and feedback." checked={preferences.privacy.allowStudentMessages} onChange={(allowStudentMessages) => patchPreference("privacy", { allowStudentMessages })} />
              <ToggleRow icon={Eye} title="Show office hours" description="Display office hours on the instructor profile." checked={preferences.privacy.showOfficeHours} onChange={(showOfficeHours) => patchPreference("privacy", { showOfficeHours })} />
            </>}
            {role === "employer" && <>
              <SelectInput label="Company profile visibility" value={preferences.privacy.companyVisibility} onChange={(companyVisibility) => patchPreference("privacy", { companyVisibility })} options={[{value:"listed",label:"Listed in discovery"},{value:"guc",label:"GUC users only"},{value:"private",label:"Private"}]} />
              <ToggleRow icon={Briefcase} title="Show active internships" description="Let students see currently hiring roles." checked={preferences.privacy.showActiveInternships} onChange={(showActiveInternships) => patchPreference("privacy", { showActiveInternships })} />
              <ToggleRow icon={MessageSquare} title="Allow student messages" description="Students can ask hiring questions before applying." checked={preferences.privacy.allowStudentMessagesToCompany} onChange={(allowStudentMessagesToCompany) => patchPreference("privacy", { allowStudentMessagesToCompany })} />
              <ToggleRow icon={IdCard} title="Show company contact email" description="Useful for external hiring communication." checked={preferences.privacy.showCompanyEmail} onChange={(showCompanyEmail) => patchPreference("privacy", { showCompanyEmail })} />
            </>}
            {role === "admin" && <>
              <ToggleRow icon={ShieldCheck} title="Show admin identity in moderation logs" description="Improves accountability in demo moderation flows." checked={preferences.privacy.showEmail} onChange={(showEmail) => patchPreference("privacy", { showEmail })} />
              <ToggleRow icon={Users} title="Enable quick user lookup defaults" description="Optimizes admin workflows for user management." checked={preferences.workspace.adminModerationMode} onChange={(adminModerationMode) => patchPreference("workspace", { adminModerationMode })} />
            </>}
            <ToggleRow icon={IdCard} title="Show email on profile" description="Keep this off unless contact visibility is important." checked={preferences.privacy.showEmail} onChange={(showEmail) => patchPreference("privacy", { showEmail })} />
          </div>
        </SettingsShell>
      );
    }

    if (activeSection === "notifications") {
      const muted = preferences.notifications.mutedAll;
      const toggle = (key) => (value) => patchPreference("notifications", { [key]: value });
      return (
        <SettingsShell title="Notification preferences" description="Granular controls for project invitations, comments, messages, internships, admin requests, and in-app/email channels." icon={Bell}>
          <div className="space-y-4">
            <ToggleRow icon={Bell} title="Mute all notifications" description="Matches the MS2 mute requirement while keeping per-category choices saved for later." checked={muted} onChange={toggle("mutedAll")} badge="Req 91" />
            <div className="grid gap-4 lg:grid-cols-2">
              <ToggleRow icon={Laptop} title="In-app notifications" description="Keep alerts inside the dashboard." checked={preferences.notifications.inApp} disabled={muted} onChange={toggle("inApp")} />
              <ToggleRow icon={IdCard} title="Email notifications" description="Demo-only email preference for production realism." checked={preferences.notifications.email} disabled={muted} onChange={toggle("email")} />
              <ToggleRow icon={Sparkles} title="Project invitations" description="Project invites and collaborator updates." checked={preferences.notifications.projectInvitations} disabled={muted} onChange={toggle("projectInvitations")} badge="Req 28" />
              <ToggleRow icon={MessageSquare} title="Comments & feedback" description="Instructor feedback, project comments, and task updates." checked={preferences.notifications.projectFeedback} disabled={muted} onChange={toggle("projectFeedback")} badge="Req 41" />
              <ToggleRow icon={MessageSquare} title="Private messages" description="Chat and direct messages from stakeholders." checked={preferences.notifications.messages} disabled={muted} onChange={toggle("messages")} badge="Req 70" />
              <ToggleRow icon={Briefcase} title="Internship updates" description="Applications, nominations, acceptances, and rejections." checked={preferences.notifications.internshipApplications} disabled={muted} onChange={toggle("internshipApplications")} badge="Req 89" />
              <ToggleRow icon={School} title="Courses & linking" description="Course updates and instructor link/unlink requests." checked={preferences.notifications.linkRequests || preferences.notifications.courses} disabled={muted} onChange={(value) => patchPreference("notifications", { linkRequests: value, courses: value })} />
              <ToggleRow icon={ShieldCheck} title="Admin announcements" description="Platform-level moderation and policy alerts." checked={preferences.notifications.adminAnnouncements} disabled={muted} onChange={toggle("adminAnnouncements")} />
            </div>
          </div>
        </SettingsShell>
      );
    }

    if (activeSection === "security") {
      return (
        <SettingsShell title="Account & security" description="A realistic security center with OTP password reset, 2FA simulation, login alerts, and active session visibility." icon={Lock}>
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <ToggleRow icon={ShieldCheck} title="Two-factor authentication simulation" description="Demo toggle for a real-world 2FA flow. It is saved to demoStore but does not send real codes." checked={preferences.security.twoFactorEnabled} onChange={(twoFactorEnabled) => patchPreference("security", { twoFactorEnabled })} />
              <ToggleRow icon={Bell} title="Login alerts" description="Show a warning if the account is accessed from a new browser/session." checked={preferences.security.loginAlerts} onChange={(loginAlerts) => patchPreference("security", { loginAlerts })} />
              <ToggleRow icon={Lock} title="Auto-lock sensitive actions" description="Ask for confirmation before reset, delete, or deactivate actions." checked={preferences.security.autoLock} onChange={(autoLock) => patchPreference("security", { autoLock })} />
              <AppButton variant="outline" onClick={() => navigate("/forgot-password")}><KeyRound className="h-4 w-4" /> Change password with OTP</AppButton>
            </div>
            <div className="rounded-[28px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">Active session</p>
              <div className="mt-4 space-y-3 text-sm font-bold text-[color:var(--ink)]">
                <div className="flex items-center justify-between gap-3"><span>Device</span><span className="text-[color:var(--muted)]">Chrome / Windows</span></div>
                <div className="flex items-center justify-between gap-3"><span>Role</span><span className="text-[color:var(--muted)]">{config.label}</span></div>
                <div className="flex items-center justify-between gap-3"><span>Last checked</span><span className="text-[color:var(--muted)]">{todayLabel()}</span></div>
                <div className="mt-4 rounded-2xl bg-[color:var(--accent)]/15 p-3 text-xs font-black uppercase tracking-[0.15em] text-[color:var(--primary)]">Demo-safe: no real security tokens are exposed.</div>
              </div>
            </div>
          </div>
        </SettingsShell>
      );
    }

    if (activeSection === "workspace") {
      return (
        <SettingsShell title="Workspace preferences" description="Role-specific dashboard defaults that make each stakeholder feel like a real product user, not the same generic account." icon={LayoutDashboard}>
          <div className="grid gap-4 lg:grid-cols-2">
            <SelectInput label="Default dashboard tab" value={preferences.workspace.defaultDashboardTab} onChange={(defaultDashboardTab) => patchPreference("workspace", { defaultDashboardTab })} options={[{value:"overview",label:"Overview"},{value:"projects",label:"Projects"},{value:"internships",label:"Internships"},{value:"portfolio",label:"Portfolio"},{value:"moderation",label:"Moderation"}]} />
            <SelectInput label="Default sorting" value={preferences.workspace.defaultSort} onChange={(defaultSort) => patchPreference("workspace", { defaultSort })} options={[{value:"recommended",label:"Recommended first"},{value:"newest",label:"Newest first"},{value:"oldest",label:"Oldest first"},{value:"course",label:"Course grouped"},{value:"risk-first",label:"High-risk first"}]} />
            {role === "student" && <>
              <TextInput label="Preferred project categories" value={joinList(preferences.workspace.preferredProjectCategories)} onChange={(value) => patchPreference("workspace", { preferredProjectCategories: cleanList(value) })} placeholder="AI, Web, Embedded" />
              <TextInput label="Internship interests" value={joinList(preferences.workspace.internshipInterests)} onChange={(value) => patchPreference("workspace", { internshipInterests: cleanList(value) })} placeholder="Frontend, AI, Data" />
            </>}
            {role === "instructor" && <>
              <SelectInput label="Review reminder frequency" value={preferences.workspace.reviewReminderFrequency} onChange={(reviewReminderFrequency) => patchPreference("workspace", { reviewReminderFrequency })} options={[{value:"off",label:"Off"},{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"}]} />
              <ToggleRow icon={School} title="Group review queue by course" description="Keeps bachelor project and course projects easier to scan." checked={preferences.workspace.defaultSort === "course"} onChange={(checked) => patchPreference("workspace", { defaultSort: checked ? "course" : "newest" })} />
            </>}
            {role === "employer" && <>
              <TextInput label="Candidate preference tags" value={joinList(preferences.workspace.candidatePreferenceTags)} onChange={(value) => patchPreference("workspace", { candidatePreferenceTags: cleanList(value) })} placeholder="React, Python, Communication" />
              <ToggleRow icon={Briefcase} title="Auto-hide closed internships" description="Keep old positions out of active hiring lists." checked={preferences.workspace.autoHideClosedInternships} onChange={(autoHideClosedInternships) => patchPreference("workspace", { autoHideClosedInternships })} />
            </>}
            {role === "admin" && <>
              <ToggleRow icon={ShieldCheck} title="Moderation mode" description="Prioritize flagged projects, appeals, and pending employers." checked={preferences.workspace.adminModerationMode} onChange={(adminModerationMode) => patchPreference("workspace", { adminModerationMode })} />
            </>}
          </div>
        </SettingsShell>
      );
    }

    if (activeSection === "appearance") {
      return (
        <SettingsShell title="Appearance & accessibility" description="Theme and inclusive UX controls. These are especially important because your app has motion, glass surfaces, and dark mode." icon={Palette}>
          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleRow icon={isDark ? Moon : Sun} title="Dark mode" description="Uses your existing ThemeProvider, not a separate fake theme switch." checked={theme === "dark"} onChange={(checked) => setTheme(checked ? "dark" : "light")} />
            <ToggleRow icon={Accessibility} title="Reduce motion" description="Preference for users who do not want heavy animation." checked={preferences.appearance.reduceMotion} onChange={(reduceMotion) => patchPreference("appearance", { reduceMotion })} />
            <ToggleRow icon={SlidersHorizontal} title="Compact mode" description="Denser cards and less vertical spacing for power users." checked={preferences.appearance.compactMode} onChange={(compactMode) => patchPreference("appearance", { compactMode })} />
            <ToggleRow icon={FileText} title="Large text mode" description="Improves readability in dashboards and forms." checked={preferences.appearance.largeText} onChange={(largeText) => patchPreference("appearance", { largeText })} />
            <ToggleRow icon={Eye} title="High contrast surfaces" description="Strengthens borders and text contrast for glassmorphism cards." checked={preferences.appearance.highContrast} onChange={(highContrast) => patchPreference("appearance", { highContrast })} />
          </div>
        </SettingsShell>
      );
    }

    if (activeSection === "ai") {
      return (
        <SettingsShell title="AI desk pet companion" description="The assistant should feel cute and helpful, but still controllable. These settings make the interaction feel intentional instead of annoying." icon={Bot}>
          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleRow icon={Bot} title="Enable AI companion" description="Shows the desk pet on dashboards. Disabling keeps the launcher state available if the component supports it." checked={preferences.ai.enabled} onChange={(enabled) => patchPreference("ai", { enabled })} />
            <ToggleRow icon={EyeOff} title="Start collapsed as tiny circle" description="Best default for users who want him nearby but not covering dashboard content." checked={preferences.ai.collapsed} onChange={(collapsed) => patchPreference("ai", { collapsed })} />
            <ToggleRow icon={Sparkles} title="Emotions and idle life" description="Allows waves, smiles, sleep, and thinking states." checked={preferences.ai.emotions} onChange={(emotions) => patchPreference("ai", { emotions })} />
            <ToggleRow icon={Moon} title="Sleeping mode" description="Lets him sleep when idle so he feels like a desk pet." checked={preferences.ai.sleepingMode} onChange={(sleepingMode) => patchPreference("ai", { sleepingMode })} />
            <ToggleRow icon={Heart} title="Hearts and friendly reactions" description="Small positive reactions after helpful actions." checked={preferences.ai.hearts} onChange={(hearts) => patchPreference("ai", { hearts })} />
            <ToggleRow icon={RotateCcw} title="Auto-collapse after interaction" description="After opening him, he can return to the tiny circle to stay out of the way." checked={preferences.ai.autoCollapse} onChange={(autoCollapse) => patchPreference("ai", { autoCollapse })} />
            <SelectInput label="Assistant personality" value={preferences.ai.personality} onChange={(personality) => patchPreference("ai", { personality })} options={[{value:"professional",label:"Professional"},{value:"friendly",label:"Friendly"},{value:"playful",label:"Playful desk pet"}]} />
          </div>
        </SettingsShell>
      );
    }

    return (
      <SettingsShell title="Data, export & reset" description="A production-style settings area should let users export their data, clear preferences, and recover from demo mistakes safely." icon={Download}>
        <div className="grid gap-4 lg:grid-cols-3">
          <button onClick={exportMyData} className="group rounded-[28px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-5 text-left transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)] hover:shadow-[var(--shadow-soft)]">
            <Download className="mb-4 h-6 w-6 text-[color:var(--primary)]" />
            <h3 className="font-black text-[color:var(--ink)]">Export my data</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">Download profile, preferences, notifications, and role-relevant demo data as JSON.</p>
          </button>
          <button onClick={resetPreferences} className="group rounded-[28px] border border-[color:var(--border-soft)] bg-[var(--surface-soft)] p-5 text-left transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)] hover:shadow-[var(--shadow-soft)]">
            <RotateCcw className="mb-4 h-6 w-6 text-[color:var(--primary)]" />
            <h3 className="font-black text-[color:var(--ink)]">Reset preferences</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">Restore default privacy, notifications, workspace, AI, and accessibility settings.</p>
          </button>
          <button onClick={resetDatabase} className="group rounded-[28px] border border-red-200 bg-red-50/80 p-5 text-left transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-[var(--shadow-soft)] dark:border-red-400/20 dark:bg-red-950/20">
            <Trash2 className="mb-4 h-6 w-6 text-red-600" />
            <h3 className="font-black text-red-700 dark:text-red-200">Reset demo database</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-red-700/70 dark:text-red-100/70">Danger zone. Restores seed data and clears local edits.</p>
          </button>
        </div>
      </SettingsShell>
    );
  };

  return (
    <DashboardLayout workspace={role} notifications={notifications}>
      <div className="space-y-6">
        <SectionHeader title={config.title} subtitle={config.subtitle} />

        <AppCard className="overflow-hidden" variant="strong">
          <div className={`relative bg-gradient-to-br ${config.accent} p-6 text-white`}>
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[color:var(--gold)]/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 overflow-hidden place-items-center rounded-[28px] bg-white/10 text-2xl font-black text-white ring-1 ring-white/15 shadow-2xl">
                  {form.image ? <img src={form.image} alt={form.name || config.label} className="h-full w-full object-cover" /> : <RoleIcon className="h-9 w-9 text-[color:var(--accent)]" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55">{config.label} workspace</p>
                  <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{form.companyName && role === "employer" ? form.companyName : form.name || "Account settings"}</h1>
                  <p className="mt-1 text-sm font-semibold text-white/70">{form.email || "No email saved"}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
                    <p className="text-xl font-black text-white">{value}</p>
                    <p className="text-xs font-bold text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppCard>

        <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6 xl:sticky xl:top-6">
            <ProfileCompletion role={role} form={form} preferences={preferences} />
            <AppCard className="p-3" variant="strong">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${active ? "bg-[var(--gradient-brand)] text-white shadow-[var(--shadow-brand)]" : "text-[color:var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[color:var(--primary)]"}`}
                    >
                      <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {section.label}</span>
                      {active && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </AppCard>
            <AppCard className="p-5" variant="soft">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[color:var(--ink)]">Quick actions</h2>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">Reversible routes, no browser-back reliance.</p>
                </div>
                <LayoutDashboard className="h-5 w-5 text-[color:var(--primary)]" />
              </div>
              <div className="space-y-3">
                <QuickActionCard action={{ label: "Back to dashboard", path: config.dashboardPath, icon: LayoutDashboard }} />
                {config.quickActions.map((action) => <QuickActionCard key={action.label} action={action} />)}
              </div>
            </AppCard>
          </div>

          <div className="space-y-6">
            {renderSection()}

            <SettingsShell title="Connected accounts" description="Portfolio platforms feel more real when stakeholders can connect external proof of work and company links." icon={LinkIcon}>
              <div className="grid gap-4 lg:grid-cols-2">
                <TextInput label="LinkedIn" value={preferences.connectedAccounts.linkedin} onChange={(linkedin) => { patchPreference("connectedAccounts", { linkedin }); setForm((prev) => ({ ...prev, linkedin })); }} placeholder="https://linkedin.com/in/..." />
                <TextInput label="GitHub" value={preferences.connectedAccounts.github} onChange={(github) => { patchPreference("connectedAccounts", { github }); setForm((prev) => ({ ...prev, github })); }} placeholder="https://github.com/..." />
                <TextInput label="Portfolio / website" value={preferences.connectedAccounts.website} onChange={(website) => { patchPreference("connectedAccounts", { website }); setForm((prev) => ({ ...prev, website })); }} placeholder="https://..." />
                {role === "student" && <TextInput label="Behance" value={preferences.connectedAccounts.behance} onChange={(behance) => patchPreference("connectedAccounts", { behance })} placeholder="https://behance.net/..." />}
                {role === "instructor" && <TextInput label="Google Scholar" value={preferences.connectedAccounts.googleScholar} onChange={(googleScholar) => patchPreference("connectedAccounts", { googleScholar })} placeholder="https://scholar.google.com/..." />}
                {role === "employer" && <TextInput label="Company website" value={preferences.connectedAccounts.companyWebsite} onChange={(companyWebsite) => patchPreference("connectedAccounts", { companyWebsite })} placeholder="https://company.com" />}
              </div>
            </SettingsShell>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <AppButton variant="outline" onClick={() => navigate(config.dashboardPath)}>Cancel</AppButton>
              <AppButton variant="brand" onClick={handleSaveAll} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save all settings"}</AppButton>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
