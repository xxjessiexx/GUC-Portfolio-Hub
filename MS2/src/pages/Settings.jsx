import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Eye,
  GraduationCap,
  KeyRound,
  Link2,
  LoaderCircle,
  Mail,
  MessageSquare,
  Moon,
  Palette,
  Shield,
  ShieldCheck,
  Sun,
  User,
  Users,
  Volume2,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AppSelect from "@/components/common/AppSelect";
import ProfilePhotoUploader from "@/components/profile/ProfilePhotoUploader";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/context/UserProfileContext";
import { useNotifications } from "@/context/NotificationsContext";
import {
  getCurrentUser,
  setCurrentUser,
  updateUser,
} from "@/data/demoStore";

const NOTIFICATION_SOUND_KEY = "guc-notification-sound-enabled";

const AI_KEYS = {
  collapsed: "guc-ai-companion-collapsed",
  name: "guc-ai-companion-name",
  gender: "guc-ai-companion-gender",
};

const roleMeta = {
  student: {
    label: "Student",
    profileRoute: "/edit-student-profile",
  },
  instructor: {
    label: "Instructor",
    profileRoute: "/edit-instructor-profile",
  },
  employer: {
    label: "Employer",
    profileRoute: "/edit-employer-profile",
  },
  admin: {
    label: "Admin",
    profileRoute: "/admin/overview",
  },
};

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: KeyRound },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Companion", icon: Bot },
];

const facultyOptions = [
  "Engineering and Technology",
  "Management Technology",
  "Pharmacy and Biotechnology",
  "Applied Sciences and Arts",
  "Law and Legal Studies",
  "Dentistry",
];

const majorOptions = [
  "MET",
  "DMET",
  "CSEN",
  "IET",
  "EMS",
  "BI",
  "Applied Sciences and Arts",
  "Architecture",
  "Pharmacy and Biotechnology",
  "Civil",
  "Dentistry",
  "Law and Legal Studies",
  "Management",
  "Mechatronics",
];

const semesterOptions = Array.from({ length: 10 }, (_, index) =>
  String(index + 1)
);

const engineeringMajors = new Set([
  "MET",
  "DMET",
  "CSEN",
  "IET",
  "EMS",
  "Civil",
  "Mechatronics",
]);

function resolveFaculty(major, currentFaculty) {
  if (engineeringMajors.has(String(major || ""))) {
    return "Engineering and Technology";
  }

  if (major === "Management" || major === "BI") {
    return "Management Technology";
  }

  if (major === "Pharmacy and Biotechnology") {
    return "Pharmacy and Biotechnology";
  }

  if (major === "Dentistry") {
    return "Dentistry";
  }

  if (major === "Law and Legal Studies") {
    return "Law and Legal Studies";
  }

  if (
    major === "Applied Sciences and Arts" ||
    major === "Architecture"
  ) {
    return "Applied Sciences and Arts";
  }

  return currentFaculty || "Engineering and Technology";
}

function normalizeRole(value) {
  const role = String(value || "").toLowerCase();
  if (role.includes("admin")) return "admin";
  if (role.includes("instructor")) return "instructor";
  if (role.includes("employer") || role.includes("company")) return "employer";
  return "student";
}

function getDefaultPrivacy(role, user = {}) {
  const stored =
    user?.preferences?.visibility ||
    user?.preferences?.privacy ||
    user?.settings?.privacy ||
    {};

  return {
    profileVisibility: role === "admin" ? "private" : "public",
    showEmail: false,
    showProjects: role !== "admin" && role !== "employer",
    allowMessages: role !== "admin",
    allowEmployerContact: role === "student",
    showCourses: role === "instructor",
    showInternships: role === "employer",
    ...stored,
  };
}

function defaultCompanionName(gender) {
  return gender === "female" ? "Nova" : "Atlas";
}

function readAiSettings() {
  if (typeof window === "undefined") {
    return {
      name: "Atlas",
      gender: "male",
      collapsed: true,
    };
  }

  const gender =
    localStorage.getItem(AI_KEYS.gender) === "female" ? "female" : "male";

  return {
    gender,
    name:
      localStorage.getItem(AI_KEYS.name) ||
      defaultCompanionName(gender),
    collapsed: localStorage.getItem(AI_KEYS.collapsed) === "true",
  };
}

function Surface({ children, className = "" }) {
  return (
    <section
      className={`
        border-b border-[#D2E0E7]
        bg-[#F7FAFB] dark:bg-transparent
        last:border-b-0
        dark:border-white/10
        ${className}
      `}
    >
      {children}
    </section>
  );
}

function PanelHeading({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#D2E0E7] px-7 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <div>
        <h2 className="text-[21px] font-black tracking-[-0.025em] text-[color:var(--ink)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-[12.5px] font-semibold leading-5 text-[#6E8290] dark:text-[#91A6B4]">
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </div>
  );
}

function FieldRow({
  label,
  hint,
  children,
  last = false,
}) {
  return (
    <div
      className={`grid gap-3 px-6 py-4 md:grid-cols-[205px_minmax(0,1fr)] md:items-center ${
        last ? "" : "border-b border-[#D2E0E7] dark:border-white/10"
      }`}
    >
      <div>
        <p className="text-[13px] font-black text-[color:var(--ink)]">
          {label}
        </p>
        {hint ? (
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#6E8290] dark:text-[#91A6B4]">
            {hint}
          </p>
        ) : null}
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="
        h-11 w-full rounded-[11px]
        border border-[#CFDEE6]
        bg-[#F2F7F9] px-4
        text-[13px] font-semibold text-[color:var(--ink)]
        outline-none transition
        placeholder:text-[#6E8290] dark:text-[#91A6B4]/55
        focus:border-[#7AAACE]
        focus:ring-4 focus:ring-[#7AAACE]/14
        dark:border-white/10
        dark:bg-[#142B3D]
      "
    />
  );
}

function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={4}
      className="
        w-full resize-none rounded-[11px]
        border border-[#CFDEE6]
        bg-[#F2F7F9] px-4 py-3
        text-[13px] font-semibold leading-6 text-[color:var(--ink)]
        outline-none transition
        placeholder:text-[#6E8290] dark:text-[#91A6B4]/55
        focus:border-[#7AAACE]
        focus:ring-4 focus:ring-[#7AAACE]/14
        dark:border-white/10
        dark:bg-[#142B3D]
      "
    />
  );
}

function InlineSaveStatus({ state, className = "" }) {
  if (!state || state === "idle") return null;

  if (state === "saving") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#B18C2E] dark:text-[#E7C66B] ${className}`}
      >
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        Saving…
      </span>
    );
  }

  if (state === "error") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#B94D55] dark:text-[#FF9AA1] ${className}`}
      >
        Couldn’t save
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#B18C2E] dark:text-[#E7C66B] ${className}`}
    >
      <Check className="h-3.5 w-3.5" />
      Saved
    </span>
  );
}

function SectionTitle({ title, description, status }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[13px] font-black text-[color:var(--ink)]">
          {title}
        </p>
        {description ? (
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#6E8290] dark:text-[#91A6B4]">
            {description}
          </p>
        ) : null}
      </div>

      <InlineSaveStatus state={status} className="mt-0.5" />
    </div>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex h-10 items-center justify-center rounded-[12px]
        border border-[#CBDCE5]
        bg-[#F2F7F9] px-4
        text-[12px] font-black text-[#355872]
        transition hover:bg-[#F0F6F9]
        dark:border-white/10
        dark:bg-white/[0.05]
        dark:text-[#BFE5FF]
        dark:hover:bg-white/[0.08]
      "
    >
      {children}
    </button>
  );
}

function Switch({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative shrink-0 rounded-full border-2
        transition-colors duration-200
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-[#7AAACE]/20
        ${
          checked
            ? "border-[#355872] bg-[#355872] dark:border-[#9CD5FF] dark:bg-[#9CD5FF]"
            : "border-[#A6BAC6] bg-[#DDE7EC] dark:border-white/18 dark:bg-[#173044]"
        }
        ${disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
      `}
      style={{
        width: 52,
        height: 30,
        minWidth: 52,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <span
        className="
          pointer-events-none absolute rounded-full bg-white
          shadow-[0_2px_6px_rgba(20,43,58,0.24)]
          transition-[left] duration-200
        "
        style={{
          width: 20,
          height: 20,
          top: 3,
          left: checked ? 25 : 3,
        }}
      />
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 px-6 py-[17px] ${
        last ? "" : "border-b border-[#D2E0E7] dark:border-white/10"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#EEF5F8] text-[#46677E] dark:bg-white/[0.05] dark:text-[#9CD5FF]">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-[13.5px] font-black text-[color:var(--ink)]">
            {title}
          </p>
          <p className="mt-1 max-w-2xl text-[11.5px] font-semibold leading-5 text-[#6E8290] dark:text-[#91A6B4]">
            {description}
          </p>
        </div>
      </div>

      <Switch
        checked={Boolean(checked)}
        onChange={onChange}
        disabled={disabled}
        label={title}
      />
    </div>
  );
}

function Choice({
  selected,
  title,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        relative rounded-[14px] border p-4 text-left transition
        ${
          selected
            ? "border-[#355872] bg-[#EDF5F9] shadow-[0_10px_24px_rgba(53,88,114,0.10)] dark:border-[#9CD5FF]/70 dark:bg-[#9CD5FF]/[0.08]"
            : "border-[#D3E1E8] bg-white hover:border-[#ACC6D5] dark:border-white/10 dark:bg-white/[0.035]"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid h-8 w-8 place-items-center rounded-[10px] ${
            selected
              ? "bg-[#355872] text-white dark:bg-[#9CD5FF] dark:text-[#071521]"
              : "bg-[#EEF5F8] text-[#55758B] dark:bg-white/[0.05] dark:text-[#9CB5C6]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        {selected ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#355872] text-white dark:bg-[#9CD5FF] dark:text-[#071521]">
            <Check className="h-3 w-3" />
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[13px] font-black text-[color:var(--ink)]">
        {title}
      </p>
      <p className="mt-1 text-[11px] font-semibold leading-4 text-[#6E8290] dark:text-[#91A6B4]">
        {description}
      </p>
    </button>
  );
}

function SkillEditor({ skills, onChange }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value || skills.includes(value)) return;
    onChange([...skills, value]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-[#C8DBE5]
              bg-[#EEF5F8] px-3 py-1.5
              text-[11px] font-black text-[#355872]
              dark:border-white/10 dark:bg-white/[0.06] dark:text-[#BFE5FF]
            "
          >
            {skill}
            <button
              type="button"
              onClick={() => onChange(skills.filter((item) => item !== skill))}
              className="opacity-55 transition hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <TextInput
          value={draft}
          onChange={setDraft}
          placeholder="Add a skill"
        />
        <GhostButton onClick={add}>Add</GhostButton>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, updateProfile } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const {
    notificationPreferences,
    setNotificationPreference,
    toggleMuteAll,
  } = useNotifications();

  const [user, setUser] = useState(() => getCurrentUser() || profile || {});
  const role = normalizeRole(
    user.role || user.accountRole || user.systemRole || profile?.role
  );
  const meta = roleMeta[role] || roleMeta.student;

  const requestedTab = searchParams.get("tab");
  const initialTab = tabs.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const activeMeta =
    tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const [privacy, setPrivacy] = useState(() => getDefaultPrivacy(role, user));
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(NOTIFICATION_SOUND_KEY) !== "false";
  });
  const [ai, setAi] = useState(readAiSettings);
  const [aiSaveState, setAiSaveState] = useState("idle");
  const [aiSaveGroup, setAiSaveGroup] = useState(null);
  const aiSaveTimerRef = useRef(null);


  const [profileDraft, setProfileDraft] = useState(() => ({
    bio: profile?.bio || "",
    major: profile?.major || majorOptions[0],
    faculty: resolveFaculty(
      profile?.major || majorOptions[0],
      profile?.faculty
    ),
    semester: String(profile?.semester || "1"),
    skills: profile?.skills || [],
    links: {
      linkedin: profile?.links?.linkedin || "",
      github: profile?.links?.github || "",
      behance: profile?.links?.behance || "",
    },
  }));

  const [profileSaveStates, setProfileSaveStates] = useState({
    photo: "idle",
    bio: "idle",
    academic: "idle",
    skills: "idle",
    links: "idle",
  });
  const profileSaveTimerRef = useRef(null);
  const savedFeedbackTimersRef = useRef({});

  useEffect(() => {
    const next = searchParams.get("tab");
    if (next && tabs.some((tab) => tab.id === next)) {
      setActiveTab(next);
    }
  }, [searchParams]);

  useEffect(() => {
    setProfileDraft({
      bio: profile?.bio || "",
      major: profile?.major || majorOptions[0],
      faculty: resolveFaculty(
        profile?.major || majorOptions[0],
        profile?.faculty
      ),
      semester: String(profile?.semester || "1"),
      skills: profile?.skills || [],
      links: {
        linkedin: profile?.links?.linkedin || "",
        github: profile?.links?.github || "",
        behance: profile?.links?.behance || "",
      },
    });
  }, [profile]);

  useEffect(() => {
    return () => {
      if (profileSaveTimerRef.current) {
        clearTimeout(profileSaveTimerRef.current);
      }

      Object.values(savedFeedbackTimersRef.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });

      if (aiSaveTimerRef.current) {
        clearTimeout(aiSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const refresh = () => {
      const nextUser = getCurrentUser() || profile || {};
      setUser(nextUser);
      setPrivacy(getDefaultPrivacy(normalizeRole(nextUser.role), nextUser));
    };

    window.addEventListener("demo-current-user-change", refresh);
    window.addEventListener("demo-db-change", refresh);

    return () => {
      window.removeEventListener("demo-current-user-change", refresh);
      window.removeEventListener("demo-db-change", refresh);
    };
  }, [profile]);

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const setProfileGroupState = (group, state) => {
    setProfileSaveStates((current) => ({
      ...current,
      [group]: state,
    }));
  };

  const settleProfileGroup = (group) => {
    if (savedFeedbackTimersRef.current[group]) {
      clearTimeout(savedFeedbackTimersRef.current[group]);
    }

    savedFeedbackTimersRef.current[group] = setTimeout(() => {
      setProfileGroupState(group, "idle");
    }, 1500);
  };

  const persistProfileDraft = (draft, group) => {
    const normalizedFaculty = resolveFaculty(
      draft.major,
      draft.faculty
    );

    try {
      updateProfile({
        bio: draft.bio,
        faculty: normalizedFaculty,
        major: draft.major,
        semester: draft.semester,
        skills: draft.skills,
        links: draft.links,
        role: `${draft.major} Student`,
      });

      if (draft.faculty !== normalizedFaculty) {
        setProfileDraft((current) => ({
          ...current,
          faculty: normalizedFaculty,
        }));
      }

      setProfileGroupState(group, "saved");
      settleProfileGroup(group);
    } catch (error) {
      setProfileGroupState(group, "error");
      toast.error(error?.message || "Could not save profile changes.");
    }
  };

  const queueProfileSave = (
    nextDraft,
    group,
    immediate = false
  ) => {
    if (profileSaveTimerRef.current) {
      clearTimeout(profileSaveTimerRef.current);
    }

    if (savedFeedbackTimersRef.current[group]) {
      clearTimeout(savedFeedbackTimersRef.current[group]);
    }

    setProfileGroupState(group, "saving");

    profileSaveTimerRef.current = setTimeout(
      () => persistProfileDraft(nextDraft, group),
      immediate ? 0 : 650
    );
  };

  const changeProfileDraft = (
    updater,
    group,
    immediate = false
  ) => {
    setProfileDraft((current) => {
      const next =
        typeof updater === "function"
          ? updater(current)
          : { ...current, ...updater };

      queueProfileSave(next, group, immediate);
      return next;
    });
  };

  const saveProfilePhoto = (image) => {
    setProfileGroupState("photo", "saving");

    try {
      updateProfile({ image });
      setProfileGroupState("photo", "saved");
      settleProfileGroup("photo");
    } catch (error) {
      setProfileGroupState("photo", "error");
      toast.error(error?.message || "Could not update profile photo.");
    }
  };

  const persistPrivacy = (nextPrivacy) => {
    const nextPreferences = {
      ...(user.preferences || {}),
      visibility: nextPrivacy,
    };

    const payload = { preferences: nextPreferences };
    const saved = user?.id ? updateUser(user.id, payload) : null;
    const nextUser = saved || { ...user, ...payload };

    setCurrentUser(nextUser);
    setUser(nextUser);
    setPrivacy(nextPrivacy);
  };

  const updatePrivacy = (key, value) => {
    persistPrivacy({
      ...privacy,
      [key]: value,
    });
  };

  const updateSound = (value) => {
    setSoundEnabled(value);
    localStorage.setItem(NOTIFICATION_SOUND_KEY, value ? "true" : "false");
  };

  const persistAi = (nextAi) => {
    try {
      localStorage.setItem(
        AI_KEYS.name,
        nextAi.name || defaultCompanionName(nextAi.gender)
      );
      localStorage.setItem(AI_KEYS.gender, nextAi.gender);
      localStorage.setItem(
        AI_KEYS.collapsed,
        String(Boolean(nextAi.collapsed))
      );

      window.dispatchEvent(
        new CustomEvent("guc-ai-companion-settings-change", {
          detail: nextAi,
        })
      );

      setAiSaveState("saved");

      setTimeout(() => {
        setAiSaveState("idle");
      }, 1600);
    } catch (error) {
      setAiSaveState("error");
      toast.error(error?.message || "Could not save AI companion settings.");
    }
  };

  const changeAi = (updater, group, immediate = false) => {
    setAi((current) => {
      const next =
        typeof updater === "function"
          ? updater(current)
          : { ...current, ...updater };

      if (aiSaveTimerRef.current) {
        clearTimeout(aiSaveTimerRef.current);
      }

      setAiSaveGroup(group);
      setAiSaveState("saving");
      aiSaveTimerRef.current = setTimeout(
        () => persistAi(next),
        immediate ? 0 : 500
      );

      return next;
    });
  };

  const notificationItems = [
    {
      key: "projectInvitations",
      title: "Project invitations",
      description: "Invites to join student projects.",
      icon: Users,
    },
    {
      key: "commentsFeedback",
      title: "Comments & feedback",
      description: "New comments, reviews, and feedback on your work.",
      icon: MessageSquare,
    },
    {
      key: "privateMessages",
      title: "Messages",
      description: "Direct messages and collaboration conversations.",
      icon: Mail,
    },
    {
      key: "internshipUpdates",
      title: "Internship updates",
      description: "Application and internship activity.",
      icon: BriefcaseBusiness,
      roles: ["student", "employer"],
    },
    {
      key: "courseLinking",
      title: "Course updates",
      description: "Course-related activity and linking.",
      icon: GraduationCap,
      roles: ["student", "instructor"],
    },
    {
      key: "adminAnnouncements",
      title: "Platform announcements",
      description: "Important administrative notices.",
      icon: Shield,
    },
  ];

  const content = {
    profile: (
      <Surface>
        <PanelHeading
          title="Profile"
          description="Information shown on your profile and portfolio."
        />

        <div className="border-b border-[#D2E0E7] px-6 py-5 dark:border-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ProfilePhotoUploader
              image={profile.image}
              setImage={saveProfilePhoto}
              name={profile.name}
              size="compact"
            />

            <div className="min-w-0">
              <h3 className="text-[18px] font-black tracking-[-0.025em] text-[color:var(--ink)]">
                {profile.name}
              </h3>
              <p className="mt-1 text-[12px] font-semibold text-[#6E8290] dark:text-[#91A6B4]">
                {profile.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-[11px] font-semibold text-[#5D788B] dark:text-[#94AAB8]">
                  Change your photo using the edit icon.
                </p>
                <InlineSaveStatus state={profileSaveStates.photo} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[#D2E0E7] px-6 py-5 dark:border-white/10">
          <div className="grid gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
            <SectionTitle
              title="Bio"
              description="A short introduction shown on your portfolio."
              status={profileSaveStates.bio}
            />

            <TextArea
              value={profileDraft.bio}
              onChange={(value) =>
                changeProfileDraft(
                  (current) => ({
                    ...current,
                    bio: value,
                  }),
                  "bio"
                )
              }
              placeholder="Write a short bio"
            />
          </div>
        </div>

        {role === "student" ? (
          <div className="border-b border-[#D2E0E7] px-6 py-5 dark:border-white/10">
            <SectionTitle
              title="Academic information"
              description="Faculty, major, and current semester."
              status={profileSaveStates.academic}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                  Faculty
                </span>
                <AppSelect
                  value={profileDraft.faculty}
                  options={facultyOptions}
                  placeholder="Select faculty"
                  onValueChange={(value) =>
                    changeProfileDraft(
                      (current) => ({
                        ...current,
                        faculty: value,
                      }),
                      "academic",
                      true
                    )
                  }
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                  Major
                </span>
                <AppSelect
                  value={profileDraft.major}
                  options={majorOptions}
                  placeholder="Select major"
                  onValueChange={(value) =>
                    changeProfileDraft(
                      (current) => ({
                        ...current,
                        major: value,
                        faculty: resolveFaculty(value, current.faculty),
                      }),
                      "academic",
                      true
                    )
                  }
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                  Semester
                </span>
                <AppSelect
                  value={profileDraft.semester}
                  options={semesterOptions}
                  placeholder="Select semester"
                  onValueChange={(value) =>
                    changeProfileDraft(
                      (current) => ({
                        ...current,
                        semester: value,
                      }),
                      "academic",
                      true
                    )
                  }
                />
              </label>
            </div>
          </div>
        ) : null}

        <div className="border-b border-[#D2E0E7] px-6 py-5 dark:border-white/10">
          <div className="grid gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
            <SectionTitle
              title="Skills"
              description="Keep this focused on the skills you want to showcase."
              status={profileSaveStates.skills}
            />

            <SkillEditor
              skills={profileDraft.skills}
              onChange={(skills) =>
                changeProfileDraft(
                  (current) => ({ ...current, skills }),
                  "skills",
                  true
                )
              }
            />
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="mb-4 flex items-start gap-2">
            <Link2 className="mt-0.5 h-4 w-4 text-[#55758B] dark:text-[#9CD5FF]" />
            <div className="min-w-0 flex-1">
              <SectionTitle
                title="Portfolio links"
                description="Add the profiles you want visitors to reach."
                status={profileSaveStates.links}
              />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <label>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                LinkedIn
              </span>
              <TextInput
                value={profileDraft.links.linkedin}
                onChange={(value) =>
                  changeProfileDraft(
                    (current) => ({
                      ...current,
                      links: { ...current.links, linkedin: value },
                    }),
                    "links"
                  )
                }
                placeholder="linkedin.com/in/..."
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                GitHub
              </span>
              <TextInput
                value={profileDraft.links.github}
                onChange={(value) =>
                  changeProfileDraft(
                    (current) => ({
                      ...current,
                      links: { ...current.links, github: value },
                    }),
                    "links"
                  )
                }
                placeholder="github.com/..."
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6E8290] dark:text-[#91A6B4]">
                Behance
              </span>
              <TextInput
                value={profileDraft.links.behance}
                onChange={(value) =>
                  changeProfileDraft(
                    (current) => ({
                      ...current,
                      links: { ...current.links, behance: value },
                    }),
                    "links"
                  )
                }
                placeholder="behance.net/..."
              />
            </label>
          </div>
        </div>
      </Surface>
    ),

    account: (
      <Surface>
        <PanelHeading
          title="Account"
          description="Sign-in and account-level actions."
        />

        <FieldRow label="Email">
          <p className="text-[13px] font-semibold text-[#6E8290] dark:text-[#91A6B4]">
            {user?.email || profile?.email}
          </p>
        </FieldRow>

        <FieldRow label="Password" last>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#6E8290] dark:text-[#91A6B4]">
              Reset your password using account recovery.
            </p>
            <GhostButton onClick={() => navigate("/forgot-password")}>
              Reset password
            </GhostButton>
          </div>
        </FieldRow>
      </Surface>
    ),

    privacy: (
      <div>
        {role !== "admin" ? (
          <Surface>
            <PanelHeading
              title="Profile visibility"
              description="Choose who can discover your profile."
            />

            <div className="grid gap-3 p-6 md:grid-cols-3">
              <Choice
                selected={privacy.profileVisibility === "public"}
                title="Public"
                description="Visible to people using the platform."
                icon={Users}
                onClick={() => updatePrivacy("profileVisibility", "public")}
              />
              <Choice
                selected={privacy.profileVisibility === "guc"}
                title="GUC only"
                description="Visible only within the GUC community."
                icon={GraduationCap}
                onClick={() => updatePrivacy("profileVisibility", "guc")}
              />
              <Choice
                selected={privacy.profileVisibility === "private"}
                title="Private"
                description="Hidden from discovery and public-facing surfaces."
                icon={ShieldCheck}
                onClick={() => updatePrivacy("profileVisibility", "private")}
              />
            </div>
          </Surface>
        ) : null}

        <Surface>
          <PanelHeading
            title="Contact & visibility"
            description="Control which profile details and contact options are available."
          />

          <ToggleRow
            icon={Mail}
            title="Show email"
            description="Display your email where profile contact details are shown."
            checked={privacy.showEmail}
            onChange={(value) => updatePrivacy("showEmail", value)}
          />

          {role === "student" || role === "instructor" ? (
            <ToggleRow
              icon={Eye}
              title="Show projects"
              description="Display your project work on your profile."
              checked={privacy.showProjects}
              onChange={(value) => updatePrivacy("showProjects", value)}
            />
          ) : null}

          {role === "employer" ? (
            <ToggleRow
              icon={BriefcaseBusiness}
              title="Show active internships"
              description="Display active internship listings on the company profile."
              checked={privacy.showInternships}
              onChange={(value) => updatePrivacy("showInternships", value)}
            />
          ) : null}

          {role !== "admin" ? (
            <ToggleRow
              icon={MessageSquare}
              title="Allow messages"
              description="Let other people on the platform contact you directly."
              checked={privacy.allowMessages}
              onChange={(value) => updatePrivacy("allowMessages", value)}
            />
          ) : null}

          {role === "student" ? (
            <ToggleRow
              icon={Building2}
              title="Allow employer contact"
              description="Let employers contact you about internship opportunities."
              checked={privacy.allowEmployerContact}
              onChange={(value) =>
                updatePrivacy("allowEmployerContact", value)
              }
              last
            />
          ) : null}
        </Surface>
      </div>
    ),

    notifications: (
      <div>
        <Surface>
          <PanelHeading
            title="Notification settings"
            description="Choose how notifications behave inside the app."
          />

          <ToggleRow
            icon={Bell}
            title="Mute all notifications"
            description="Temporarily silence non-critical notifications."
            checked={notificationPreferences.muteAll}
            onChange={() => toggleMuteAll()}
          />

          <ToggleRow
            icon={Bell}
            title="In-app notifications"
            description="Show alerts and notification toasts in the app."
            checked={notificationPreferences.inApp}
            disabled={notificationPreferences.muteAll}
            onChange={(value) => setNotificationPreference("inApp", value)}
          />

          <ToggleRow
            icon={Volume2}
            title="Notification sound"
            description="Play a short sound when a notification appears."
            checked={soundEnabled}
            disabled={notificationPreferences.muteAll}
            onChange={updateSound}
            last
          />
        </Surface>

        <Surface>
          <PanelHeading
            title="Activity"
            description="Choose which events create notifications."
          />

          {notificationItems
            .filter((item) => !item.roles || item.roles.includes(role))
            .map((item, index, items) => (
              <ToggleRow
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                checked={notificationPreferences[item.key] !== false}
                disabled={notificationPreferences.muteAll}
                onChange={(value) =>
                  setNotificationPreference(item.key, value)
                }
                last={index === items.length - 1}
              />
            ))}
        </Surface>
      </div>
    ),

    appearance: (
      <Surface>
        <PanelHeading
          title="Appearance"
          description="Choose the interface theme."
        />

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <Choice
            title="Light"
            description="Use the light interface."
            icon={Sun}
            selected={theme !== "dark"}
            onClick={() => setTheme("light")}
          />

          <Choice
            title="Dark"
            description="Use the dark interface."
            icon={Moon}
            selected={theme === "dark"}
            onClick={() => setTheme("dark")}
          />
        </div>
      </Surface>
    ),

    ai: (
      <Surface>
        <PanelHeading
          title="AI Companion"
          description="Personalize how your assistant appears in the workspace."
        />

        <FieldRow
          label="Name"
          hint={
            <span className="flex flex-wrap items-center gap-2">
              <span>The name shown in the companion interface.</span>
              <InlineSaveStatus
                state={aiSaveGroup === "name" ? aiSaveState : "idle"}
              />
            </span>
          }
        >
          <TextInput
            value={ai.name}
            onChange={(value) =>
              changeAi(
                (current) => ({ ...current, name: value }),
                "name"
              )
            }
            placeholder={defaultCompanionName(ai.gender)}
          />
        </FieldRow>

        <FieldRow
          label="Gender"
          hint={
            <span className="flex flex-wrap items-center gap-2">
              <span>Changes the companion's supported visual persona.</span>
              <InlineSaveStatus
                state={aiSaveGroup === "gender" ? aiSaveState : "idle"}
              />
            </span>
          }
        >
          <div className="inline-flex rounded-[12px] border border-[#D3E1E8] bg-[#EEF4F7] p-1 dark:border-white/10 dark:bg-white/[0.04]">
            {[
              ["male", "Male"],
              ["female", "Female"],
            ].map(([value, label]) => {
              const active = ai.gender === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    changeAi((current) => ({
                      ...current,
                      gender: value,
                      name:
                        !current.name ||
                        current.name ===
                          defaultCompanionName(
                            value === "male" ? "female" : "male"
                          )
                          ? defaultCompanionName(value)
                          : current.name,
                    }), "gender", true)
                  }
                  className={`
                    min-w-[96px] rounded-[9px] px-4 py-2.5
                    text-[12px] font-black transition
                    ${
                      active
                        ? "bg-white text-[#294F69] shadow-sm dark:bg-[#9CD5FF] dark:text-[#071521]"
                        : "text-[#6B8190] hover:text-[#294F69] dark:text-[#8FA8B8] dark:hover:text-white"
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FieldRow>

        <FieldRow
          label="Default state"
          hint={
            <span className="flex flex-wrap items-center gap-2">
              <span>Choose how the companion appears when you enter the workspace.</span>
              <InlineSaveStatus
                state={
                  aiSaveGroup === "defaultState" ? aiSaveState : "idle"
                }
              />
            </span>
          }
          last
        >
          <div className="flex items-center justify-between gap-4 rounded-[14px] border border-[#D3E1E8] bg-[#F2F7F9] px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
            <div>
              <p className="text-[12.5px] font-black text-[color:var(--ink)]">
                Start as small circle
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#6E8290] dark:text-[#91A6B4]">
                Keep the assistant collapsed until you open it.
              </p>
            </div>

            <Switch
              checked={ai.collapsed}
              onChange={(value) =>
                changeAi(
                  (current) => ({ ...current, collapsed: value }),
                  "defaultState",
                  true
                )
              }
              label="Start as small circle"
            />
          </div>
        </FieldRow>
      </Surface>
    ),
  };

  return (
    <DashboardLayout showFooter={false}>
      <main className="h-[calc(100vh-144px)] overflow-hidden px-4 py-5 sm:px-6 lg:px-7 xl:px-8">
        <div className="mx-auto flex h-full w-full max-w-[1480px] min-h-0 flex-col">
          <header className="mb-5 shrink-0">
            <div className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]" />
            <h1 className="text-[44px] font-black leading-none tracking-[-0.045em] text-[color:var(--ink)] sm:text-[50px]">
              Settings
            </h1>
            <p className="mt-2.5 max-w-3xl text-[14px] font-semibold leading-6 text-[#6E8290] dark:text-[#91A6B4]">
              Manage your profile, privacy, notifications, appearance, and AI companion.
            </p>
          </header>

          <div
            className="
              min-h-0 flex-1 overflow-hidden rounded-[22px]
              border border-[#C9DBE4]
              bg-[#EEF4F7]
              shadow-[0_12px_30px_rgba(53,88,114,0.065)]
              dark:border-white/10
              dark:bg-[#0B1C29]
              dark:shadow-[0_16px_36px_rgba(0,0,0,0.22)]
            "
          >
            <div className="grid h-full min-h-0 lg:grid-cols-[236px_minmax(0,1fr)]">
              <aside
                className="
                  shrink-0 overflow-hidden
                  border-b border-[#D2E0E7]
                  bg-[#EEF4F7]
                  p-4
                  lg:border-b-0 lg:border-r
                  dark:border-white/10
                  dark:bg-[#0F2433]
                "
              >
                <div className="px-2 pb-3 pt-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6D8392] dark:text-[#87A1B2]">
                    Settings
                  </p>
                </div>

                <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => selectTab(tab.id)}
                        className={`
                          flex w-full items-center gap-3 rounded-[11px]
                          px-3.5 py-3 text-left transition
                          ${
                            active
                              ? "bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.16)] dark:bg-[#9CD5FF] dark:text-[#071521]"
                              : "text-[#607686] hover:bg-white/80 hover:text-[#183247] dark:text-[#91A9B8] dark:hover:bg-white/[0.05] dark:hover:text-white"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-[13px] font-black">
                          {tab.label}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 ${
                            active ? "opacity-75" : "opacity-25"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </aside>

              <section
                aria-label={`${activeMeta.label} settings`}
                className="
                  min-h-0 min-w-0 overflow-y-auto overscroll-contain
                  bg-[#F3F7F9]
                  dark:bg-[#0D2130]
                "
              >
                {content[activeTab]}
              </section>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
