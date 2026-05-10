import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Bot,
  Building2,
  ChevronRight,
  Download,
  Eye,
  GraduationCap,
  KeyRound,
  Link as LinkIcon,
  Lock,
  Mail,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/context/UserProfileContext";
import { getCurrentUser, setCurrentUser, updateUser } from "@/data/demoStore";

const AI_KEYS = {
  enabled: "guc-ai-companion-enabled",
  collapsed: "guc-ai-companion-collapsed",
  emotions: "guc-ai-companion-emotions",
  sleeping: "guc-ai-companion-sleeping-mode",
  hearts: "guc-ai-companion-hearts",
  name: "guc-ai-companion-name",
  gender: "guc-ai-companion-gender",
};

const roleMeta = {
  student: {
    label: "Student",
    title: "Student Settings",
    subtitle: "Manage your account, portfolio visibility, notifications, and workspace preferences.",
    icon: GraduationCap,
  },
  instructor: {
    label: "Instructor",
    title: "Instructor Settings",
    subtitle: "Manage your academic profile, visibility, notifications, and workspace preferences.",
    icon: User,
  },
  employer: {
    label: "Employer",
    title: "Employer Settings",
    subtitle: "Manage your company profile, visibility, notifications, and workspace preferences.",
    icon: Building2,
  },
  admin: {
    label: "Admin",
    title: "Admin Settings",
    subtitle: "Manage account preferences, platform notifications, appearance, and assistant behavior.",
    icon: Shield,
  },
};

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "visibility", label: "Visibility", icon: Eye },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "assistant", label: "AI Companion", icon: Bot },
  { id: "data", label: "Data", icon: Download },
];

function normalizeRole(value) {
  const role = String(value || "").toLowerCase();
  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer") || role.includes("company")) return "employer";
  return "student";
}

function localBool(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function localText(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  return value ?? fallback;
}

function toListString(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function fromListString(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function defaultPreferences(role, user = {}) {
  return {
    visibility: {
      profileVisibility: role === "student" ? "public" : "listed",
      showEmail: false,
      showProjects: true,
      allowMessages: role !== "admin",
      allowEmployerContact: role === "student",
      showCourses: role === "instructor",
      showInternships: role === "employer",
      ...(user.preferences?.visibility || user.preferences?.privacy || {}),
    },
    notifications: {
      muteAll: Boolean(user.notificationMuted || user.preferences?.notifications?.mutedAll),
      inApp: true,
      email: false,
      messages: true,
      projectUpdates: true,
      internshipUpdates: role === "student" || role === "employer",
      courseUpdates: role === "student" || role === "instructor",
      adminAnnouncements: true,
      ...(user.preferences?.notifications || {}),
    },
    workspace: {
      compactMode: false,
      reduceMotion: false,
      highContrast: false,
      ...(user.preferences?.workspace || user.preferences?.accessibility || {}),
    },
  };
}

function buildInitialForm(user, profile) {
  const source = user || profile || {};
  const role = normalizeRole(source.role || source.accountRole || source.systemRole);
  const links = source.links || {};

  return {
    id: source.id,
    role,
    name: source.name || "",
    email: source.email || "",
    image: source.image || source.avatar || "",
    title: source.title || "",
    bio: source.bio || "",
    major: source.major || "",
    semester: source.semester || "",
    department: source.department || "",
    office: source.office || "",
    officeHours: source.officeHours || "",
    companyName: source.companyName || source.company || "",
    industry: source.industry || "",
    location: source.location || source.address || "",
    contactEmail: source.contactEmail || source.email || "",
    skills: toListString(source.skills),
    researchInterests: toListString(source.researchInterests),
    linkedin: source.linkedin || links.linkedin || "",
    github: source.github || links.github || "",
    portfolio: source.portfolio || links.website || links.portfolio || "",
    behance: source.behance || links.behance || "",
    googleScholar: source.googleScholar || links.googleScholar || "",
    companyWebsite: source.companyWebsite || links.companyWebsite || links.website || "",
  };
}

function TextField({ label, value, onChange, placeholder, type = "text", hint }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[color:var(--border-soft)] bg-white/75 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20 dark:bg-white/5"
      />
      {hint ? <span className="mt-2 block text-xs font-semibold text-[color:var(--muted)]">{hint}</span> : null}
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-[color:var(--border-soft)] bg-white/75 px-4 py-3 text-sm font-semibold leading-6 text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20 dark:bg-white/5"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</span>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[color:var(--border-soft)] bg-white/75 px-4 py-3 text-sm font-black text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20 dark:bg-[color:var(--surface)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] text-[color:var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[color:var(--ink)]">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p> : null}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SettingRow({ icon: Icon, title, description, right, children }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-white/55 p-4 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {Icon ? <Icon className="h-5 w-5 shrink-0 text-[color:var(--primary)]" /> : null}
          <div className="min-w-0">
            <p className="text-sm font-black text-[color:var(--ink)]">{title}</p>
            {description ? <p className="mt-1 text-sm font-semibold leading-5 text-[color:var(--muted)]">{description}</p> : null}
          </div>
        </div>
        {right ?? <ChevronRight className="h-5 w-5 shrink-0 text-[color:var(--muted)]" />}
      </div>
      {children ? <div className="mt-4 border-t border-[color:var(--border-soft)] pt-4">{children}</div> : null}
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange, disabled = false }) {
  return (
    <SettingRow
      icon={icon}
      title={title}
      description={description}
      right={<Switch checked={Boolean(checked)} disabled={disabled} onCheckedChange={onChange} />}
    />
  );
}

function SaveBar({ dirty, saving, onSave }) {
  return (
    <div className="sticky bottom-4 z-20 mt-8 flex justify-end">
      <div className="flex items-center gap-3 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-2 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <span className="hidden px-3 text-sm font-bold text-[color:var(--muted)] sm:inline">
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-[var(--gradient-brand)] px-5 py-3 text-sm font-black text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving" : "Save settings"}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const { profile, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const [user, setUserState] = useState(() => getCurrentUser() || profile || {});
  const role = normalizeRole(user.role || user.accountRole || user.systemRole || profile?.role);
  const meta = roleMeta[role] || roleMeta.student;
  const RoleIcon = meta.icon;

  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState(() => buildInitialForm(user, profile));
  const [preferences, setPreferences] = useState(() => defaultPreferences(role, user));
  const [assistant, setAssistant] = useState(() => ({
    enabled: localBool(AI_KEYS.enabled, true),
    collapsed: localBool(AI_KEYS.collapsed, true),
    emotions: localBool(AI_KEYS.emotions, true),
    sleeping: localBool(AI_KEYS.sleeping, true),
    hearts: localBool(AI_KEYS.hearts, true),
    name: localText(AI_KEYS.name, localText(AI_KEYS.gender, "male") === "female" ? "Nova" : "Atlas"),
    gender: localText(AI_KEYS.gender, "male"),
  }));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const nextUser = getCurrentUser() || profile || {};
      setUserState(nextUser);
      setForm(buildInitialForm(nextUser, profile));
      setPreferences(defaultPreferences(normalizeRole(nextUser.role || profile?.role), nextUser));
      setDirty(false);
    };
    window.addEventListener("demo-current-user-change", refresh);
    window.addEventListener("demo-db-change", refresh);
    return () => {
      window.removeEventListener("demo-current-user-change", refresh);
      window.removeEventListener("demo-db-change", refresh);
    };
  }, [profile]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const updatePreference = (group, key, value) => {
    setPreferences((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value,
      },
    }));
    setDirty(true);
  };

  const updateAssistant = (key, value) => {
    setAssistant((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const savedPayload = useMemo(() => {
    const links = {
      linkedin: form.linkedin,
      github: form.github,
      website: form.portfolio || form.companyWebsite,
      portfolio: form.portfolio,
      behance: form.behance,
      googleScholar: form.googleScholar,
      companyWebsite: form.companyWebsite,
    };

    return {
      name: role === "employer" ? form.companyName || form.name : form.name,
      email: form.email,
      image: form.image,
      avatar: form.image,
      title: form.title,
      bio: form.bio,
      major: form.major,
      semester: form.semester,
      department: form.department,
      office: form.office,
      officeHours: form.officeHours,
      companyName: form.companyName,
      company: form.companyName,
      industry: form.industry,
      location: form.location,
      address: form.location,
      contactEmail: form.contactEmail,
      skills: fromListString(form.skills),
      researchInterests: fromListString(form.researchInterests),
      linkedin: form.linkedin,
      github: form.github,
      portfolio: form.portfolio,
      behance: form.behance,
      googleScholar: form.googleScholar,
      companyWebsite: form.companyWebsite,
      links,
      preferences,
      notificationMuted: preferences.notifications.muteAll,
    };
  }, [form, preferences, role]);

  const saveSettings = () => {
    setSaving(true);
    try {
      let saved = null;
      if (user?.id) {
        saved = updateUser(user.id, savedPayload);
      }

      const nextUser = saved || { ...user, ...savedPayload };
      setCurrentUser(nextUser);
      updateProfile(nextUser);

      localStorage.setItem(AI_KEYS.enabled, String(Boolean(assistant.enabled)));
      localStorage.setItem(AI_KEYS.collapsed, String(Boolean(assistant.collapsed)));
      localStorage.setItem(AI_KEYS.emotions, String(Boolean(assistant.emotions)));
      localStorage.setItem(AI_KEYS.sleeping, String(Boolean(assistant.sleeping)));
      localStorage.setItem(AI_KEYS.hearts, String(Boolean(assistant.hearts)));
      localStorage.setItem(AI_KEYS.name, assistant.name || (assistant.gender === "female" ? "Nova" : "Atlas"));
      localStorage.setItem(AI_KEYS.gender, assistant.gender || "male");
      localStorage.setItem("guc-portfolio-workspace-preferences", JSON.stringify(preferences.workspace));

      setUserState(nextUser);
      setDirty(false);
      toast.success("Settings saved", { description: "Your settings were updated in the seed/demo database." });
    } catch (error) {
      toast.error("Could not save settings", { description: error?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user: savedPayload, assistant, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${role}-settings.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderRoleFields = () => {
    if (role === "student") {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Major" value={form.major} onChange={(value) => updateForm("major", value)} />
          <TextField label="Semester" value={form.semester} onChange={(value) => updateForm("semester", value)} />
          <TextField label="Skills" value={form.skills} onChange={(value) => updateForm("skills", value)} hint="Separate skills with commas." />
          <TextField label="GitHub" value={form.github} onChange={(value) => updateForm("github", value)} placeholder="https://github.com/..." />
        </div>
      );
    }

    if (role === "instructor") {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Department" value={form.department} onChange={(value) => updateForm("department", value)} />
          <TextField label="Office" value={form.office} onChange={(value) => updateForm("office", value)} />
          <TextField label="Office hours" value={form.officeHours} onChange={(value) => updateForm("officeHours", value)} />
          <TextField label="Research interests" value={form.researchInterests} onChange={(value) => updateForm("researchInterests", value)} hint="Separate interests with commas." />
        </div>
      );
    }

    if (role === "employer") {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Company name" value={form.companyName} onChange={(value) => updateForm("companyName", value)} />
          <TextField label="Industry" value={form.industry} onChange={(value) => updateForm("industry", value)} />
          <TextField label="Location" value={form.location} onChange={(value) => updateForm("location", value)} />
          <TextField label="Company website" value={form.companyWebsite} onChange={(value) => updateForm("companyWebsite", value)} placeholder="https://..." />
        </div>
      );
    }

    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Admin title" value={form.title} onChange={(value) => updateForm("title", value)} />
        <TextField label="Department" value={form.department} onChange={(value) => updateForm("department", value)} />
      </div>
    );
  };

  const content = {
    account: (
      <div className="space-y-5">
        <SettingsCard title="Profile information" description="Only the essential fields that identify this account across the platform." icon={User}>
          <div className="grid gap-4 lg:grid-cols-[120px_minmax(0,1fr)]">
            <div className="flex items-start justify-center lg:justify-start">
              <div className="h-24 w-24 overflow-hidden rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] shadow-[var(--shadow-card)]">
                {form.image ? <img src={form.image} alt={form.name || "Profile"} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><RoleIcon className="h-8 w-8 text-[color:var(--primary)]" /></div>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <TextField label={role === "employer" ? "Contact person / display name" : "Full name"} value={form.name} onChange={(value) => updateForm("name", value)} />
                <TextField label="Email" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
                <TextField label="Profile image URL" value={form.image} onChange={(value) => updateForm("image", value)} placeholder="https://..." />
                <TextField label="LinkedIn" value={form.linkedin} onChange={(value) => updateForm("linkedin", value)} placeholder="https://linkedin.com/in/..." />
              </div>
              {renderRoleFields()}
              <TextArea label={role === "employer" ? "Company bio" : "Bio"} value={form.bio} onChange={(value) => updateForm("bio", value)} placeholder="Write a short description..." />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Account access" description="Simple demo security controls. No visual clutter, no fake analytics." icon={KeyRound}>
          <SettingRow icon={Mail} title="Primary email" description={form.email || "No email saved"} />
          <ToggleRow icon={Lock} title="Two-step verification" description="Demo toggle only. Useful for showing a realistic account setting without adding backend auth." checked={preferences.workspace.twoFactorEnabled} onChange={(value) => updatePreference("workspace", "twoFactorEnabled", value)} />
        </SettingsCard>
      </div>
    ),
    visibility: (
      <SettingsCard title="Visibility" description="Control what other users can see. This replaces the previous messy privacy section with clear, direct choices." icon={Eye}>
        <SelectField
          label={role === "employer" ? "Company profile visibility" : "Profile visibility"}
          value={preferences.visibility.profileVisibility}
          onChange={(value) => updatePreference("visibility", "profileVisibility", value)}
          options={[
            { value: "public", label: "Public" },
            { value: "listed", label: "GUC users only" },
            { value: "private", label: "Private" },
          ]}
        />
        <ToggleRow icon={Mail} title="Show email on profile" description="Let people see the email attached to this account." checked={preferences.visibility.showEmail} onChange={(value) => updatePreference("visibility", "showEmail", value)} />
        <ToggleRow icon={Eye} title={role === "employer" ? "Show active internships" : "Show projects"} description={role === "employer" ? "Display published internships on the company profile." : "Display project work on the public profile."} checked={role === "employer" ? preferences.visibility.showInternships : preferences.visibility.showProjects} onChange={(value) => updatePreference("visibility", role === "employer" ? "showInternships" : "showProjects", value)} />
        <ToggleRow icon={Mail} title="Allow messages" description="Allow other stakeholders to contact this account inside the platform." checked={preferences.visibility.allowMessages} onChange={(value) => updatePreference("visibility", "allowMessages", value)} />
        {role === "student" ? <ToggleRow icon={Building2} title="Allow employer contact" description="Employers can reach out about internship opportunities." checked={preferences.visibility.allowEmployerContact} onChange={(value) => updatePreference("visibility", "allowEmployerContact", value)} /> : null}
        {role === "instructor" ? <ToggleRow icon={GraduationCap} title="Show courses" description="Show taught courses on the instructor profile." checked={preferences.visibility.showCourses} onChange={(value) => updatePreference("visibility", "showCourses", value)} /> : null}
      </SettingsCard>
    ),
    notifications: (
      <SettingsCard title="Notifications" description="A clean version of requirement-based notification preferences: all mute plus the main categories users expect." icon={Bell}>
        <ToggleRow icon={Bell} title="Mute all notifications" description="Stops non-critical notifications while keeping the preferences below saved." checked={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "muteAll", value)} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ToggleRow icon={Bell} title="In-app notifications" checked={preferences.notifications.inApp} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "inApp", value)} />
          <ToggleRow icon={Mail} title="Email notifications" checked={preferences.notifications.email} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "email", value)} />
          <ToggleRow icon={User} title="Messages" checked={preferences.notifications.messages} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "messages", value)} />
          <ToggleRow icon={Eye} title="Project updates" checked={preferences.notifications.projectUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "projectUpdates", value)} />
          <ToggleRow icon={Building2} title="Internship updates" checked={preferences.notifications.internshipUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "internshipUpdates", value)} />
          <ToggleRow icon={GraduationCap} title="Course updates" checked={preferences.notifications.courseUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "courseUpdates", value)} />
        </div>
      </SettingsCard>
    ),
    appearance: (
      <SettingsCard title="Appearance" description="Small display preferences only. No fake dashboard controls." icon={Palette}>
        <ToggleRow icon={theme === "dark" ? Moon : Sun} title="Dark mode" description="Match the app to your preferred visual mode." checked={theme === "dark"} onChange={(value) => { setTheme(value ? "dark" : "light"); setDirty(true); }} />
        <ToggleRow icon={Palette} title="Compact mode" description="Slightly tighter spacing for dense dashboards." checked={preferences.workspace.compactMode} onChange={(value) => updatePreference("workspace", "compactMode", value)} />
        <ToggleRow icon={Palette} title="Reduce motion" description="Reduce decorative animations where supported." checked={preferences.workspace.reduceMotion} onChange={(value) => updatePreference("workspace", "reduceMotion", value)} />
        <ToggleRow icon={Palette} title="High contrast" description="Store the preference so theme components can read it later." checked={preferences.workspace.highContrast} onChange={(value) => updatePreference("workspace", "highContrast", value)} />
      </SettingsCard>
    ),
    assistant: (
      <SettingsCard title="AI Companion" description="Keep the companion useful without making the settings page about the companion." icon={Bot}>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField label="Companion name" value={assistant.name} onChange={(value) => updateAssistant("name", value)} placeholder="Atlas" />
          <SelectField label="Companion style" value={assistant.gender} onChange={(value) => updateAssistant("gender", value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <ToggleRow icon={Bot} title="Show AI companion" description="Turn the companion on or off across dashboards." checked={assistant.enabled} onChange={(value) => updateAssistant("enabled", value)} />
        <ToggleRow icon={Bot} title="Start as small circle" description="Open dashboards with the companion collapsed into its draggable circle." checked={assistant.collapsed} onChange={(value) => updateAssistant("collapsed", value)} />
        <div className="grid gap-4 lg:grid-cols-3">
          <ToggleRow icon={Bot} title="Emotions" checked={assistant.emotions} onChange={(value) => updateAssistant("emotions", value)} />
          <ToggleRow icon={Moon} title="Sleeping mode" checked={assistant.sleeping} onChange={(value) => updateAssistant("sleeping", value)} />
          <ToggleRow icon={Bot} title="Hearts" checked={assistant.hearts} onChange={(value) => updateAssistant("hearts", value)} />
        </div>
      </SettingsCard>
    ),
    data: (
      <SettingsCard title="Data" description="Simple data controls for the demo database. No danger-zone theatrics." icon={Download}>
        <SettingRow icon={Download} title="Export my settings" description="Download the current profile and settings as a JSON file." right={<button type="button" onClick={exportData} className="rounded-2xl border border-[color:var(--border-blue)] px-4 py-2 text-sm font-black text-[color:var(--primary)] transition hover:bg-[color:var(--surface-soft)]">Export</button>} />
        <SettingRow icon={LinkIcon} title="Connected links" description="Portfolio, LinkedIn, GitHub, and company links are saved with the user in demoStore.">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextField label="Portfolio / website" value={form.portfolio} onChange={(value) => updateForm("portfolio", value)} placeholder="https://..." />
            {role === "student" ? <TextField label="Behance" value={form.behance} onChange={(value) => updateForm("behance", value)} placeholder="https://behance.net/..." /> : null}
            {role === "instructor" ? <TextField label="Google Scholar" value={form.googleScholar} onChange={(value) => updateForm("googleScholar", value)} placeholder="https://scholar.google.com/..." /> : null}
            {role === "employer" ? <TextField label="Company contact email" value={form.contactEmail} onChange={(value) => updateForm("contactEmail", value)} /> : null}
          </div>
        </SettingRow>
      </SettingsCard>
    ),
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-7 flex flex-col gap-4 rounded-[30px] border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)]">
              {form.image ? <img src={form.image} alt={form.name || "Profile"} className="h-full w-full object-cover" /> : <RoleIcon className="h-6 w-6 text-[color:var(--primary)]" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--muted)]">{meta.label} workspace</p>
              <h1 className="mt-1 text-2xl font-black text-[color:var(--ink)]">{meta.title}</h1>
              <p className="mt-1 max-w-2xl text-sm font-semibold text-[color:var(--muted)]">{meta.subtitle}</p>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-3 shadow-[var(--shadow-card)] lg:sticky lg:top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${active ? "bg-[color:var(--surface-soft)] text-[color:var(--primary)]" : "text-[color:var(--muted)] hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--ink)]"}`}
                  >
                    <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{tab.label}</span>
                    <ChevronRight className={`h-4 w-4 transition ${active ? "opacity-100" : "opacity-30"}`} />
                  </button>
                );
              })}
            </nav>
          </aside>

          <main>
            {content[activeTab]}
            <SaveBar dirty={dirty} saving={saving} onSave={saveSettings} />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
