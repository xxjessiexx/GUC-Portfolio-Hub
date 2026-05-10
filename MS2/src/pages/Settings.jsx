import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Lock,
  Mail,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/context/UserProfileContext";
import { getCurrentUser, setCurrentUser, updateUser } from "@/data/demoStore";

const AI_KEYS = {
  collapsed: "guc-ai-companion-collapsed",
  legacyEnabled: "guc-ai-companion-enabled",
  name: "guc-ai-companion-name",
  gender: "guc-ai-companion-gender",
  launcherPosition: "guc-ai-companion-launcher-position",
  panelPosition: "guc-ai-companion-panel-position",
};

const roleMeta = {
  student: {
    label: "Student",
    title: "Settings",
    subtitle: "Manage visibility, notifications, appearance, and assistant preferences.",
    icon: GraduationCap,
    profileRoute: "/edit-student-profile",
  },
  instructor: {
    label: "Instructor",
    title: "Settings",
    subtitle: "Manage visibility, notifications, appearance, and assistant preferences.",
    icon: User,
    profileRoute: "/edit-instructor-profile",
  },
  employer: {
    label: "Employer",
    title: "Settings",
    subtitle: "Manage company visibility, notifications, appearance, and assistant preferences.",
    icon: Building2,
    profileRoute: "/edit-employer-profile",
  },
  admin: {
    label: "Admin",
    title: "Settings",
    subtitle: "Manage platform preferences, notifications, appearance, and assistant preferences.",
    icon: Shield,
    profileRoute: "/admin/overview",
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

function readLocalBool(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function readLocalText(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function getDefaultAssistantName(gender) {
  return gender === "female" ? "Nova" : "Atlas";
}

function getDefaultPreferences(role, user = {}) {
  const stored = user.preferences || {};

  return {
    visibility: {
      profileVisibility: role === "student" ? "public" : "listed",
      showEmail: false,
      showProjects: role !== "admin",
      allowMessages: role !== "admin",
      allowEmployerContact: role === "student",
      showCourses: role === "instructor",
      showInternships: role === "employer",
      ...(stored.visibility || stored.privacy || {}),
    },
    notifications: {
      muteAll: Boolean(user.notificationMuted || stored.notifications?.muteAll || stored.notifications?.mutedAll),
      inApp: true,
      email: false,
      messages: true,
      projectUpdates: true,
      internshipUpdates: role === "student" || role === "employer",
      courseUpdates: role === "student" || role === "instructor",
      adminAnnouncements: true,
      ...(stored.notifications || {}),
    },
    appearance: {
      compactMode: false,
      reduceMotion: false,
      highContrast: false,
      ...(stored.appearance || stored.workspace || stored.accessibility || {}),
    },
  };
}

function applySavedAppearance(preferences) {
  if (typeof document === "undefined" || typeof localStorage === "undefined") return;
  const appearance = preferences?.appearance || {};
  document.documentElement.classList.toggle("guc-compact-mode", Boolean(appearance.compactMode));
  document.documentElement.classList.toggle("guc-reduce-motion", Boolean(appearance.reduceMotion));
  document.documentElement.classList.toggle("guc-high-contrast", Boolean(appearance.highContrast));
  localStorage.setItem("guc-portfolio-appearance-preferences", JSON.stringify(appearance));
}

function ToggleControl({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[58px] rounded-full border p-1 transition ${
        checked
          ? "border-[color:var(--primary)] bg-[image:var(--gradient-brand)] shadow-[0_10px_25px_rgba(53,88,114,0.22)]"
          : "border-[color:var(--border-soft)] bg-white/70 dark:bg-white/10"
      } ${disabled ? "cursor-not-allowed opacity-45" : "hover:-translate-y-0.5"}`}
      aria-pressed={checked}
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${checked ? "translate-x-[26px]" : "translate-x-0"}`}
      />
    </button>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</span>
      <input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-[color:var(--border-soft)] bg-white/75 px-4 text-sm font-semibold text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20 dark:bg-white/5"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">{label}</span>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[color:var(--border-soft)] bg-white/75 px-4 text-sm font-black text-[color:var(--ink)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/20 dark:bg-[color:var(--surface)]"
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
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] text-[color:var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[color:var(--ink)]">{title}</h2>
          {description ? <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-[color:var(--muted)]">{description}</p> : null}
        </div>
      </div>
      <div className="divide-y divide-[color:var(--border-soft)] rounded-3xl border border-[color:var(--border-soft)] bg-white/45 dark:bg-white/[0.03]">
        {children}
      </div>
    </section>
  );
}

function SettingRow({ icon: Icon, title, description, right, children }) {
  return (
    <div className="p-4 sm:p-5">
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
      {children ? <div className="mt-4 pl-0 sm:pl-8">{children}</div> : null}
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange, disabled = false }) {
  return (
    <SettingRow
      icon={icon}
      title={title}
      description={description}
      right={<ToggleControl checked={Boolean(checked)} disabled={disabled} onChange={onChange} />}
    />
  );
}

function PrimaryButton({ children, onClick, icon: Icon, variant = "primary" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5";
  const styles = variant === "primary"
    ? "bg-[image:var(--gradient-brand)] text-white shadow-[var(--shadow-brand)]"
    : "border border-[color:var(--border-blue)] bg-white/65 text-[color:var(--primary)] hover:bg-[color:var(--surface-soft)] dark:bg-white/10 dark:text-[color:var(--accent)]";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

function SaveBar({ dirty, saving, onSave, onCancel }) {
  if (!dirty) return null;

  return (
    <div className="sticky bottom-4 z-30 mt-8 flex justify-end">
      <div className="flex items-center gap-3 rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--card-bg-strong)] p-2 shadow-[0_22px_60px_rgba(44,57,71,0.22)] backdrop-blur-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-2xl px-4 py-3 text-sm font-black text-[color:var(--muted)] transition hover:bg-[color:var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-brand)] px-5 py-3 text-sm font-black text-white shadow-[var(--shadow-brand)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const [user, setUserState] = useState(() => getCurrentUser() || profile || {});
  const role = normalizeRole(user.role || user.accountRole || user.systemRole || profile?.role);
  const meta = roleMeta[role] || roleMeta.student;
  const RoleIcon = meta.icon;

  const [activeTab, setActiveTab] = useState("account");
  const [preferences, setPreferences] = useState(() => getDefaultPreferences(role, user));
  const [assistant, setAssistant] = useState(() => {
    const gender = readLocalText(AI_KEYS.gender, "male") === "female" ? "female" : "male";
    return {
      collapsed: readLocalBool(AI_KEYS.collapsed, true),
      name: readLocalText(AI_KEYS.name, getDefaultAssistantName(gender)),
      gender,
    };
  });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const resetFormFromStore = () => {
    const nextUser = getCurrentUser() || profile || {};
    const nextRole = normalizeRole(nextUser.role || profile?.role);
    const gender = readLocalText(AI_KEYS.gender, "male") === "female" ? "female" : "male";
    setUserState(nextUser);
    setPreferences(getDefaultPreferences(nextRole, nextUser));
    setAssistant({
      collapsed: readLocalBool(AI_KEYS.collapsed, true),
      name: readLocalText(AI_KEYS.name, getDefaultAssistantName(gender)),
      gender,
    });
    setDirty(false);
  };

  useEffect(() => {
    applySavedAppearance(preferences);
  }, [preferences.appearance]);

  useEffect(() => {
    const refresh = () => resetFormFromStore();
    window.addEventListener("demo-current-user-change", refresh);
    window.addEventListener("demo-db-change", refresh);
    return () => {
      window.removeEventListener("demo-current-user-change", refresh);
      window.removeEventListener("demo-db-change", refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

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

  const persistAssistant = (nextAssistant) => {
    localStorage.removeItem(AI_KEYS.legacyEnabled);
    localStorage.setItem(AI_KEYS.collapsed, String(Boolean(nextAssistant.collapsed)));
    localStorage.setItem(AI_KEYS.name, nextAssistant.name || getDefaultAssistantName(nextAssistant.gender));
    localStorage.setItem(AI_KEYS.gender, nextAssistant.gender || "male");
    window.dispatchEvent(new CustomEvent("guc-ai-companion-settings-change", { detail: nextAssistant }));
  };

  const updateAssistant = (key, value) => {
    setAssistant((current) => {
      const next = { ...current, [key]: value };
      if (key === "gender") {
        const previousDefault = getDefaultAssistantName(current.gender);
        if (!current.name || current.name === previousDefault) next.name = getDefaultAssistantName(value);
      }
      persistAssistant(next);
      return next;
    });
    setDirty(true);
  };

  const savedPayload = useMemo(() => ({
    preferences,
    notificationMuted: preferences.notifications.muteAll,
  }), [preferences]);

  const saveSettings = () => {
    setSaving(true);
    try {
      let saved = null;
      if (user?.id) saved = updateUser(user.id, savedPayload);

      const nextUser = saved || { ...user, ...savedPayload };
      setCurrentUser(nextUser);
      updateProfile(nextUser);
      setUserState(nextUser);

      persistAssistant(assistant);
      localStorage.setItem("guc-portfolio-notification-preferences", JSON.stringify(preferences.notifications));
      localStorage.setItem("guc-portfolio-visibility-preferences", JSON.stringify(preferences.visibility));
      applySavedAppearance(preferences);
      window.dispatchEvent(new CustomEvent("guc-settings-updated", { detail: { preferences, user: nextUser } }));

      setDirty(false);
      toast.success("Settings saved", { description: "Your preferences were saved to demoStore and applied." });
    } catch (error) {
      toast.error("Could not save settings", { description: error?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const requestPasswordReset = () => {
    const confirmed = window.confirm("You will be redirected to the password reset page. Continue?");
    if (!confirmed) return;
    toast.success("Opening password reset");
    navigate("/forgot-password");
  };

  const exportData = () => {
    const blob = new Blob([
      JSON.stringify(
        {
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            role,
            preferences,
          },
          assistant,
          theme,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      ),
    ], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${role}-settings.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported");
  };

  const resetAssistantPosition = () => {
    localStorage.removeItem(AI_KEYS.launcherPosition);
    localStorage.removeItem(AI_KEYS.panelPosition);
    window.dispatchEvent(new Event("guc-ai-companion-reset-position"));
    toast.success("Assistant position reset");
  };

  const content = {
    account: (
      <SettingsCard title="Account" description="Profile details live on your existing profile page. Settings only controls account-level actions." icon={User}>
        <SettingRow
          icon={User}
          title="Profile information"
          description="Edit your name, image, bio, links, and role-specific profile fields from the existing profile page."
          right={<PrimaryButton variant="secondary" onClick={() => navigate(meta.profileRoute)}>Edit profile</PrimaryButton>}
        />
        <SettingRow
          icon={Mail}
          title="Signed in email"
          description={user?.email || profile?.email || "No email found for this demo account."}
          right={<span className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs font-black text-[color:var(--muted)]">{meta.label}</span>}
        />
        <SettingRow
          icon={KeyRound}
          title="Change password"
          description="Use the same password reset flow that already exists in your app."
          right={<PrimaryButton icon={Lock} onClick={requestPasswordReset}>Reset password</PrimaryButton>}
        />
      </SettingsCard>
    ),
    visibility: (
      <SettingsCard title="Visibility" description="These preferences are saved with the current user in demoStore." icon={Eye}>
        <div className="p-4 sm:p-5">
          <SelectField label="Profile visibility" value={preferences.visibility.profileVisibility} onChange={(value) => updatePreference("visibility", "profileVisibility", value)} options={[{ value: "public", label: "Public" }, { value: "guc", label: "GUC only" }, { value: "private", label: "Private" }, { value: "listed", label: "Listed" }]} />
        </div>
        <ToggleRow icon={Mail} title="Show email" description="Allow your email/contact email to appear on public-facing profile surfaces." checked={preferences.visibility.showEmail} onChange={(value) => updatePreference("visibility", "showEmail", value)} />
        {role !== "admin" ? <ToggleRow icon={Eye} title={role === "employer" ? "Show active internships" : "Show projects"} description={role === "employer" ? "Display internships on the company profile." : "Display project work on your profile/portfolio."} checked={role === "employer" ? preferences.visibility.showInternships : preferences.visibility.showProjects} onChange={(value) => updatePreference("visibility", role === "employer" ? "showInternships" : "showProjects", value)} /> : null}
        <ToggleRow icon={Mail} title="Allow messages" description="Allow other stakeholders to contact this account inside the platform." checked={preferences.visibility.allowMessages} onChange={(value) => updatePreference("visibility", "allowMessages", value)} />
        {role === "student" ? <ToggleRow icon={Building2} title="Allow employer contact" description="Employers can reach out about internship opportunities." checked={preferences.visibility.allowEmployerContact} onChange={(value) => updatePreference("visibility", "allowEmployerContact", value)} /> : null}
        {role === "instructor" ? <ToggleRow icon={GraduationCap} title="Show courses" description="Show taught courses on the instructor profile." checked={preferences.visibility.showCourses} onChange={(value) => updatePreference("visibility", "showCourses", value)} /> : null}
      </SettingsCard>
    ),
    notifications: (
      <SettingsCard title="Notifications" description="Notification preferences are stored in demoStore and mirrored to localStorage." icon={Bell}>
        <ToggleRow icon={Bell} title="Mute all notifications" description="Stops non-critical notifications while keeping your category choices saved." checked={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "muteAll", value)} />
        <ToggleRow icon={Bell} title="In-app notifications" checked={preferences.notifications.inApp} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "inApp", value)} />
        <ToggleRow icon={Mail} title="Email notifications" checked={preferences.notifications.email} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "email", value)} />
        <ToggleRow icon={User} title="Messages" checked={preferences.notifications.messages} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "messages", value)} />
        <ToggleRow icon={Eye} title="Project updates" checked={preferences.notifications.projectUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "projectUpdates", value)} />
        <ToggleRow icon={Building2} title="Internship updates" checked={preferences.notifications.internshipUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "internshipUpdates", value)} />
        <ToggleRow icon={GraduationCap} title="Course updates" checked={preferences.notifications.courseUpdates} disabled={preferences.notifications.muteAll} onChange={(value) => updatePreference("notifications", "courseUpdates", value)} />
      </SettingsCard>
    ),
    appearance: (
      <SettingsCard title="Appearance" description="Display preferences are applied immediately where the app supports them." icon={Palette}>
        <ToggleRow icon={theme === "dark" ? Moon : Sun} title="Dark mode" description="Changes the global app theme immediately." checked={theme === "dark"} onChange={(value) => { setTheme(value ? "dark" : "light"); setDirty(true); }} />
        <ToggleRow icon={Palette} title="Compact mode" description="Saved as a global appearance preference for dense pages." checked={preferences.appearance.compactMode} onChange={(value) => updatePreference("appearance", "compactMode", value)} />
        <ToggleRow icon={Palette} title="Reduce motion" description="Saved and applied as a global reduced-motion class." checked={preferences.appearance.reduceMotion} onChange={(value) => updatePreference("appearance", "reduceMotion", value)} />
        <ToggleRow icon={Palette} title="High contrast" description="Saved and applied as a global high-contrast class." checked={preferences.appearance.highContrast} onChange={(value) => updatePreference("appearance", "highContrast", value)} />
      </SettingsCard>
    ),
    assistant: (
      <SettingsCard title="AI Companion" description="These controls update the visible companion immediately, without refreshing the page." icon={Bot}>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <TextField label="Companion name" value={assistant.name} onChange={(value) => updateAssistant("name", value)} placeholder="Atlas" />
          <SelectField label="Companion style" value={assistant.gender} onChange={(value) => updateAssistant("gender", value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <ToggleRow icon={Bot} title="Start as small circle" description="Dashboards open with the companion collapsed into its draggable circle." checked={assistant.collapsed} onChange={(value) => updateAssistant("collapsed", value)} />
        <SettingRow icon={RotateCcw} title="Reset companion position" description="Move the tiny circle and open panel back to their default dashboard position." right={<PrimaryButton variant="secondary" onClick={resetAssistantPosition}>Reset</PrimaryButton>} />
      </SettingsCard>
    ),
    data: (
      <SettingsCard title="Data" description="Simple demo data controls." icon={Download}>
        <SettingRow icon={Download} title="Export my settings" description="Download the current preferences, theme, and companion settings as JSON." right={<PrimaryButton variant="secondary" onClick={exportData}>Export</PrimaryButton>} />
      </SettingsCard>
    ),
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-7 flex flex-col gap-4 rounded-[30px] border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)]">
              {user?.image || user?.avatar ? <img src={user.image || user.avatar} alt={user?.name || "Profile"} className="h-full w-full object-cover" /> : <RoleIcon className="h-6 w-6 text-[color:var(--primary)]" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--muted)]">{meta.label} workspace</p>
              <h1 className="mt-1 text-2xl font-black text-[color:var(--ink)]">{meta.title}</h1>
              <p className="mt-1 max-w-2xl text-sm font-semibold text-[color:var(--muted)]">{meta.subtitle}</p>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--card-bg-strong)] p-3 shadow-[var(--shadow-card)] lg:sticky lg:top-28">
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
            <SaveBar dirty={dirty} saving={saving} onSave={saveSettings} onCancel={resetFormFromStore} />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
