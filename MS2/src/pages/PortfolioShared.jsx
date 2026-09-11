import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Edit3,
  ExternalLink,
  Eye,
  FolderKanban,
  GraduationCap,
  Link2,
  MoreVertical,
  Palette,
  Pin,
  Search,
  Star,
  Trash2,
  MessageCircle,
  X,
} from "lucide-react";
import SideToast from "@/components/ui/SideToast";
import {
  FaLinkedinIn,
  FaGithub,
  FaBehance,
} from "react-icons/fa";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/context/UserProfileContext";
import { ViewAllButton } from "@/components/ui/ViewAllButton";
import Pagination from "@/components/common/Pagination";
import {
  getCurrentUser,
  getUserById,
  getProjectsForUser,
  getCollection,
  updateProject,
  deleteProject as deleteProjectFromStore,
} from "@/data/demoStore";
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

const PROJECTS_PAGE_SIZE = 4;
const INTERNSHIPS_PAGE_SIZE = 3;

function normalizeUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);

  if (!parts.length) return "YK";

  return parts
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProjectBucket(project) {
  const text = `${project.type || ""} ${project.course || ""}`.toLowerCase();

  if (text.includes("bachelor") || text.includes("thesis")) return "bachelor";

  return "course";
}

function getProjectCover(project) {
  const direct =
    project?.coverImage ||
    project?.cover ||
    project?.thumbnail ||
    project?.image ||
    project?.imageUrl ||
    project?.banner ||
    project?.heroImage ||
    "";

  if (direct) return direct;

  const media = Array.isArray(project?.media) ? project.media : [];
  const firstImage = media.find((item) =>
    typeof item === "string"
      ? item
      : String(item?.type || "").toLowerCase().includes("image") || item?.url
  );

  return typeof firstImage === "string" ? firstImage : firstImage?.url || "";
}

function getProfileImage(profile) {
  return (
    profile?.profileImage ||
    profile?.avatar ||
    profile?.image ||
    profile?.photo ||
    ""
  );
}

function getProfileLinks(profile) {
  return {
    linkedin:
      profile?.links?.linkedin ||
      profile?.linkedin ||
      profile?.linkedinUrl ||
      "",
    github:
      profile?.links?.github || profile?.github || profile?.githubUrl || "",
    behance:
      profile?.links?.behance || profile?.behance || profile?.behanceUrl || "",
  };
}

function applyOverrides(project, overrides) {
  return {
    ...project,
    ...(overrides[project.id] || {}),
  };
}

const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-black transition hover:-translate-y-0.5";

const primaryButton =
  "bg-[#355872] text-white shadow-[0_16px_40px_rgba(53,88,114,0.22)] hover:bg-[#253F53] dark:bg-[#9CD5FF] dark:hover:bg-[#7AAACE]";

const softButton =
  "border border-[#355872]/15 bg-white/80 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-[#9CD5FF] dark:hover:bg-white/[0.1]";

  




function SocialActionLink({ href, label, icon: Icon }) {
  const normalizedHref = normalizeUrl(href);

  if (!normalizedHref) return null;

  return (
    <a
      href={normalizedHref}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${label}`}
      className="
        group flex min-w-0 items-center justify-between
        rounded-[14px]
        border border-[#D8E2E7]
        bg-[#FFFDF8]
        px-4 py-3
        text-[#24323B]
        shadow-[0_5px_14px_rgba(53,88,114,0.04)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[#D4AF42]
        hover:bg-[#FFF6D8]
        hover:shadow-[0_10px_22px_rgba(184,151,54,0.12)]
        dark:border-white/9
        dark:bg-[#101D26]
        dark:text-[#F4F1E8]
        dark:shadow-[0_7px_18px_rgba(0,0,0,0.12)]
        dark:hover:border-[#E6C77B]/28
        dark:hover:bg-[#172329]
        dark:hover:shadow-[0_9px_22px_rgba(0,0,0,0.18)]
      "
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className="
            grid h-8 w-8 shrink-0 place-items-center
            rounded-[9px]
            bg-[#FFF1BE]
            text-[#B9890D]
            transition-all duration-200
            group-hover:bg-[#F2D77C]
            group-hover:text-[#8F6808]
            dark:bg-[#E6C77B]/9
            dark:text-[#E6C77B]
            dark:group-hover:bg-[#E6C77B]/14
          "
        >
          <Icon className="h-4 w-4" />
        </span>

        <span className="text-[12px] font-black">{label}</span>
      </span>

      <ExternalLink
        className="
          h-3.5 w-3.5 shrink-0
          text-[#B9890D]
          opacity-0
          -translate-x-1
          transition-all duration-200
          group-hover:translate-x-0
          group-hover:-translate-y-0.5
          group-hover:opacity-100
          dark:text-[#E6C77B]
        "
      />
    </a>
  );
}
function PrimaryButton({
  children,
  onClick,
  to,
  href,
  className = "",
  type = "button",
}) {
  const classes = `${buttonBase} ${primaryButton} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

function SoftButton({
  children,
  onClick,
  to,
  href,
  className = "",
  type = "button",
}) {
  const classes = `${buttonBase} ${softButton} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative px-1.5 pb-2 pt-1
        text-[12px] font-black
        transition-colors duration-200
        ${
          active
            ? "text-[#1F3441] dark:text-[#F3E9C8]"
            : "text-[#80919B] hover:text-[#355872] dark:text-[#7F939F] dark:hover:text-[#D5E0E5]"
        }
      `}
    >
      {children}

      <span
        className={`
          absolute inset-x-1 bottom-0 h-[2px] rounded-full
          transition-opacity duration-200
          ${
            active
              ? "inset-x-0 bg-[#D7B54D] opacity-100"
              : "opacity-0"
          }
        `}
      />
    </button>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#24465E]/10 bg-[#355872] px-3 py-1.5 text-xs font-black text-white shadow-[0_8px_18px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-[#9CD5FF] dark:text-[#071521]">
      {children}
    </span>
  );
}

function SkillChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#355872]/20 bg-[#355872] px-3 py-1.5 text-xs font-black text-white shadow-[0_8px_18px_rgba(53,88,114,0.14)] dark:border-white/10 dark:bg-[#9CD5FF] dark:text-[#071521]">
      {children}
    </span>
  );
}

function TagList({ items = [], limit = 3 }) {
  const shown = items.slice(0, limit);
  const remaining = items.length - shown.length;

  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}

      {remaining > 0 ? <Tag>+{remaining}</Tag> : null}
    </div>
  );
}

function VisibilityBadge({ visibility }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-[#9CD5FF] backdrop-blur-md">
      <Eye className="h-3.5 w-3.5" />
      {visibility}
    </span>
  );
}

function ScoreBadge({ rating }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(230,199,123,0.22)] px-3 py-1.5 text-xs font-black text-[#B89736] dark:bg-[rgba(230,199,123,0.18)] dark:text-[#E6C77B]">
      <Star className="h-3.5 w-3.5 fill-current" />
      Instructor Score {rating}
    </span>
  );
}
function SocialIconLink({ href, label, children }) {
  const normalizedHref = normalizeUrl(href);

  if (!normalizedHref) return null;

  return (
    <a
      href={normalizedHref}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="
       grid h-9 w-9 place-items-center rounded-[11px]
        border border-[#D4E1E7]
        bg-[#F3F7F9]
        text-[#355872]
        shadow-[0_7px_18px_rgba(53,88,114,0.06)]
        transition
        hover:-translate-y-0.5
        hover:border-[#AFC7D4]
        hover:bg-white
        hover:shadow-[0_10px_22px_rgba(53,88,114,0.11)]
        dark:border-white/10
        dark:bg-white/[0.05]
        dark:text-[#9CD5FF]
      "
    >
      {children}
    </a>
  );
}

function PortfolioStat({ icon: Icon, value, label, accent = false }) {
  return (
    <div
      className="
        flex min-h-[92px] items-center gap-4
        rounded-[18px]
        border border-[#E2E7EA]
        bg-[#FFFDF8]
        px-4 py-4
        shadow-[0_11px_26px_rgba(53,88,114,0.06),0_2px_7px_rgba(184,151,54,0.03)]
        transition-shadow duration-200
        hover:shadow-[0_14px_30px_rgba(53,88,114,0.08),0_3px_9px_rgba(184,151,54,0.045)]
        dark:border-white/8
        dark:bg-[#101D26]
        dark:shadow-[0_10px_24px_rgba(0,0,0,0.16)]
        dark:hover:shadow-[0_13px_28px_rgba(0,0,0,0.22)]
      "
    >
      <div
        className={`
          grid h-11 w-11 shrink-0 place-items-center rounded-[14px]
          ${
            accent
              ? "bg-[#F8EDC4] text-[#B78B14] dark:bg-[#E6C77B]/11 dark:text-[#E6C77B]"
              : "border border-[#DDE6EA] bg-white text-[#667D8B] dark:border-white/8 dark:bg-white/[0.04] dark:text-[#AABAC4]"
          }
        `}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-[28px] font-black leading-none tracking-[-0.04em] text-[#102B38] dark:text-[#F4F6F7]">
          {value}
        </p>

        <p className="mt-1.5 text-[12px] font-bold text-[#738692] dark:text-[#91A5B1]">
          {label}
        </p>
      </div>
    </div>
  );
}
function ProfileInfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="mt-1 h-4 w-4 text-[#355872] dark:text-[#9CD5FF]" />

      <div>
        <p className="text-sm font-black text-[color:var(--ink)]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
          {value || "Not added"}
        </p>
      </div>
    </div>
  );
}

function LinkRow({ icon: Icon, label, value }) {
  const href = normalizeUrl(value);

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-[#355872] dark:text-[#9CD5FF]" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-[color:var(--ink)]">{label}</p>

        <div className="mt-1 flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-[color:var(--muted)]">
            {value || "Not added"}
          </span>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[#355872] transition hover:opacity-70 dark:text-[#9CD5FF]"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-[1.15rem] border border-white/60 bg-white/58 px-5 py-4 shadow-[0_10px_24px_rgba(53,88,114,0.06)] dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[2rem] leading-none font-black text-[color:var(--ink)]">
        {value}
      </p>

      <p className="mt-2 text-sm font-bold text-[color:var(--muted)]">
        {label}
      </p>
    </div>
  );
}

function PortfolioModeSwitch({ active = "public" }) {
  const itemClass = (isActive) => `
    rounded-[10px] px-4 py-2
    text-[11px] font-black
    transition-all duration-200
    ${
      isActive
        ? "bg-[#F4D97E] text-[#24323B] shadow-[0_4px_12px_rgba(184,151,54,0.12)] dark:bg-[#D8B653] dark:text-[#111A20]"
        : "bg-transparent text-[#7D8078] hover:bg-[#FFF8E7] hover:text-[#24323B] dark:text-[#9A9A8F] dark:hover:bg-[#E6C77B]/7 dark:hover:text-[#F4E5B6]"
    }
  `;

  return (
    <div
      className="
        inline-flex items-center gap-1 rounded-[14px]
        border border-[#E6DFC8]
        bg-white/74 p-1
        shadow-[0_5px_14px_rgba(53,88,114,0.045)]
        backdrop-blur-sm
        dark:border-white/10
        dark:bg-[#0F1B23]/78
        dark:shadow-[0_6px_16px_rgba(0,0,0,0.14)]
      "
      aria-label="Portfolio view mode"
    >
      <Link
        to="/portfolio"
        aria-current={active === "public" ? "page" : undefined}
        className={itemClass(active === "public")}
      >
        Public view
      </Link>

      <Link
        to="/manage-portfolio"
        aria-current={active === "manage" ? "page" : undefined}
        className={itemClass(active === "manage")}
      >
        Manage
      </Link>
    </div>
  );
}

function PortfolioHeader({ onOpenSaveDialog }) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-4xl font-black tracking-[-0.035em] text-[color:var(--ink)]">
          Manage Portfolio
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[color:var(--muted)]">
          Curate the work that appears publicly, feature your strongest projects, and save when you are done.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <PortfolioModeSwitch active="manage" />

        <SoftButton to="/create-project" className="h-10 rounded-[12px] px-4 text-xs">
          <FolderKanban className="h-4 w-4" />
          Add Project
        </SoftButton>

        <PrimaryButton
          onClick={onOpenSaveDialog}
          className="h-10 rounded-[12px] px-5 text-xs"
        >
          Save Changes
        </PrimaryButton>
      </div>
    </section>
  );
}
function PortfolioContextBar({
  page,
  viewMode = "own",
  internshipId = "",
  onOpenSaveDialog,
}) {
  const navigate = useNavigate();

  if (page === "manage") {
    return <PortfolioHeader onOpenSaveDialog={onOpenSaveDialog} />;
  }

  if (viewMode === "own") {
    return (
      <div className="-mb-1 flex items-center justify-end px-1">
        <PortfolioModeSwitch active="public" />
      </div>
    );
  }

  if (internshipId) {
    return (
      <div className="flex min-h-9 items-center px-1">
        <button
          type="button"
          onClick={() => navigate(`/manage-applicants/${internshipId}`)}
          className="
            inline-flex items-center gap-2
            text-[11px] font-black text-[#58758A]
            transition hover:text-[#355872]
            dark:text-[#91A8B6] dark:hover:text-white
          "
        >
          <span aria-hidden="true">←</span>
          Back to applicants
        </button>
      </div>
    );
  }

  return null;
}

function PortfolioTopCard({
  profile,
  stats,
  page,
  canManageProfile = false,
  viewMode = "own",
  internshipId = "",
}) {
  const navigate = useNavigate();

  const links = getProfileLinks(profile);
  const profileImage = getProfileImage(profile);
  const skills = profile?.skills || [];
  const opportunityStatus = profile?.opportunityStatus || "Open to work";
  const showOpenToWork = /^open\b/i.test(String(opportunityStatus).trim());
  const expectedGraduation =
    profile?.expectedGraduation || profile?.graduationYear || "";

  const isPublicViewer = viewMode === "public";
  const openChat = () => {
    if (!profile?.id || !isPublicViewer) return;

    const params = new URLSearchParams({
      targetUserId: profile.id,
    });

    if (internshipId) {
      params.set("internshipId", internshipId);
    }

    navigate(`/chat?${params.toString()}`);
  };

  return (
   <AppCard className="px-6 py-5 lg:px-7 lg:py-5">
     <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)_190px]">
        {/* Identity */}
        <div
          className="
            flex flex-col items-center justify-center
            border-b border-[#D8E3E8] pb-6 text-center
            xl:border-b-0 xl:border-r xl:pb-0 xl:pr-7
            dark:border-white/10
          "
        >
          <div className="relative">
            <div
              className="
                grid h-32 w-32 place-items-center overflow-hidden rounded-full
                border border-[#355872]/14
                bg-[linear-gradient(145deg,#16293A,#355872)]
                text-4xl font-black text-white
                shadow-[0_18px_45px_rgba(16,32,48,0.16)]
                dark:border-white/10
              "
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(profile?.name || "User")
              )}
            </div>

            {showOpenToWork ? (
              <span
                title={opportunityStatus}
                aria-label={opportunityStatus}
                className="
                  absolute bottom-2 right-1
                  h-4 w-4 rounded-full
                  border-[3px] border-white
                  bg-[#43A76D]
                  shadow-[0_2px_7px_rgba(67,167,109,0.18)]
                  dark:border-[#0E1A22]
                "
              />
            ) : null}
          </div>
<h2 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.035em] text-[color:var(--ink)]">
  {profile?.name || "Yasmin Khaled"}
</h2>

<p className="mt-1.5 max-w-[260px] text-[13px] font-black leading-5 text-[#4F6E82] dark:text-[#A8C1D0]">
  {profile?.major || "Media Engineering and Technology"}
</p>

<p className="mt-0.5 text-[11.5px] font-bold capitalize text-[#7A8E9A] dark:text-[#91A6B4]">
  Student
</p>


<div className="mt-3 h-[2px] w-8 rounded-full bg-[var(--gold)]" />

          <p className="mt-3 max-w-[250px] text-[13px] font-semibold leading-6 text-[color:var(--muted)]">
            {profile?.bio ||
              "Passionate about building impactful digital solutions."}
          </p>

          

          {isPublicViewer ? (
  <button
    type="button"
    onClick={openChat}
    className="
      mt-5 inline-flex h-12 w-full max-w-[250px]
      items-center justify-center gap-2.5
      rounded-[13px]
      border border-[#D5AE35]/75
      bg-[#FFF3C8]
      px-6
      text-[12px] font-black text-[#24323B]
      shadow-[0_10px_24px_rgba(184,151,54,0.14)]
      transition-all duration-200
      hover:-translate-y-0.5
      hover:border-[#C89E22]
      hover:bg-[#FBE8A7]
      hover:shadow-[0_14px_30px_rgba(184,151,54,0.20)]
      focus-visible:outline-none
      focus-visible:ring-4
      focus-visible:ring-[#D7B54D]/15
      dark:border-[#E6C77B]/28
      dark:bg-[#1A2427]
      dark:text-[#F5F1E5]
      dark:shadow-[0_10px_24px_rgba(0,0,0,0.20)]
      dark:hover:border-[#E6C77B]/48
      dark:hover:bg-[#222B2B]
      dark:hover:shadow-[0_13px_28px_rgba(0,0,0,0.25)]
    "
  >
    <MessageCircle className="h-[18px] w-[18px] text-[#B9890D] dark:text-[#E6C77B]" />
    Message
  </button>
) : null}

          {canManageProfile ? (
            <PrimaryButton
              to="/edit-student-profile"
              className="mt-4 w-full max-w-[210px]"
            >
              <Edit3 className="h-4 w-4" />
              Manage Profile
            </PrimaryButton>
          ) : null}
        </div>

        {/* Academic identity */}
        <div className="flex min-w-0 flex-col justify-center xl:px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#708795] dark:text-[#91A8B6]">
            Academic information
          </p>

         <div className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-3">
  <ProfileInfoRow
    icon={GraduationCap}
    label="Faculty"
    value={profile?.faculty || "Engineering and Technology"}
  />

  <ProfileInfoRow
    icon={CalendarDays}
    label="Semester"
    value={profile?.semester || "6"}
  />

  <ProfileInfoRow
    icon={GraduationCap}
    label="Expected Graduation"
    value={expectedGraduation}
  />
</div>

          <div className="mt-5 border-t border-[#D8E3E8] pt-5 dark:border-white/10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#708795] dark:text-[#91A8B6]">
                Skills
              </p>

              <span className="text-[11px] font-bold text-[#83949E] dark:text-[#91A6B4]">
                {skills.length} added
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">

              {skills.length ? (
                <>
                  {skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="
                        inline-flex items-center rounded-full
                        border border-[#C9DCE6]
                        bg-[#EDF4F8]
                        px-3.5 py-1.5
                        text-[11px] font-black text-[#355872]
                        transition
                        hover:border-[#AFC8D5]
                        hover:bg-white
                        dark:border-white/10
                        dark:bg-white/[0.06]
                        dark:text-[#BFE5FF]
                      "
                    >
                      {skill}
                    </span>
                  ))}

                  {skills.length > 4 ? (
                    <span
                      className="
                        inline-flex items-center rounded-full
                        border border-[#D5E1E7]
                        bg-white/50
                        px-3.5 py-1.5
                        text-[11px] font-black text-[#607989]
                        dark:border-white/10
                        dark:bg-white/[0.03]
                        dark:text-[#9BB0BD]
                      "
                    >
                      +{skills.length - 4} more
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-[11px] font-semibold text-[color:var(--muted)]">
                  No skills added yet
                </span>
              )}
            </div>

            <div className="mt-5 border-t border-[#D8E3E8] pt-5 dark:border-white/10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#708795] dark:text-[#91A8B6]">
                  Professional Profiles
                </p>

                <span className="hidden text-[10px] font-bold text-[#A8A18D] dark:text-[#777567] sm:block">
                  External profiles
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <SocialActionLink
                  href={links.linkedin}
                  label="LinkedIn"
                  icon={FaLinkedinIn}
                />

                <SocialActionLink
                  href={links.github}
                  label="GitHub"
                  icon={FaGithub}
                />

                <SocialActionLink
                  href={links.behance}
                  label="Behance"
                  icon={FaBehance}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Portfolio proof */}
        <div
          className="
            grid gap-3 border-t border-[#D8E3E8] pt-6
            xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0
            dark:border-white/10
          "
        >
          <PortfolioStat
            icon={FolderKanban}
            value={stats.total}
            label="Public Projects"
          />

          <PortfolioStat
            icon={Briefcase}
            value={stats.completedInternships}
            label="Completed Internships"
            accent
          />

          <PortfolioStat
            icon={Star}
            value={stats.averageRating}
            label="Avg. Rating"
            accent
          />
        </div>
      </div>
    </AppCard>
  );
}

function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "date", label: "Updated" },
    { value: "rating", label: "Rating" },
    { value: "name-asc", label: "Name A → Z" },
    { value: "name-desc", label: "Name Z → A" },
  ];

  const selected = options.find((option) => option.value === sortBy);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="
          inline-flex h-9 items-center gap-2
          px-0
          text-[12px] font-black text-[#607785]
          transition-colors
          hover:text-[#355872]
          dark:text-[#8CA0AC]
          dark:hover:text-[#DCE6EA]
        "
      >
        <ArrowUpDown className="h-3.5 w-3.5" />

        <span>
          Sort: <span className="text-[#334E60] dark:text-[#C9D7DE]">{selected?.label}</span>
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close sort menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            className="
              absolute right-0 top-10 z-50 w-[210px]
              overflow-hidden rounded-[16px]
              border border-[#DDE5E9]
              bg-white/96 p-1.5
              shadow-[0_18px_44px_rgba(53,88,114,0.16)]
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-[#10202A]/96
            "
          >
            {options.map((option) => {
              const active = option.value === sortBy;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSortBy(option.value);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between
                    rounded-[11px] px-3 py-2.5
                    text-left text-[12px] font-black
                    transition
                    ${
                      active
                        ? "bg-[#FFF8E7] text-[#8D6D18] dark:bg-[#E6C77B]/10 dark:text-[#E6C77B]"
                        : "text-[#708591] hover:bg-[#F5F8FA] hover:text-[#355872] dark:text-[#8FA2AD] dark:hover:bg-white/[0.05] dark:hover:text-[#DCE6EA]"
                    }
                  `}
                >
                  {option.label}

                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D7B54D]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

function PortfolioWorkBrowser({
  activeTab,
  setActiveTab,
  projectSearch,
  setProjectSearch,
  internshipSearch,
  setInternshipSearch,
  projectType,
  setProjectType,
  sortBy,
  setSortBy,
  internshipCount = 0,
}) {
  const isProjects = activeTab === "projects";
  const searchValue = isProjects ? projectSearch : internshipSearch;
  const setSearchValue = isProjects ? setProjectSearch : setInternshipSearch;

  return (
    <AppCard className="overflow-hidden p-0">
      {/* Section switch — architectural, not filter-like */}
      <div className="border-b border-[#DDE6EA] dark:border-white/10">
        <div
          className="
            grid grid-cols-2
            bg-white/40
            dark:bg-white/[0.018]
          "
          role="tablist"
          aria-label="Portfolio work"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isProjects}
            onClick={() => setActiveTab("projects")}
            className={`
              relative h-[62px]
              border-r border-[#E3E8EB]
              text-[13px] font-black
              transition-colors duration-200
              dark:border-white/8
              ${
                isProjects
                  ? "bg-[#FFFDF6] text-[#24323B] dark:bg-[#E6C77B]/[0.055] dark:text-[#F3EEE2]"
                  : "text-[#7A8C97] hover:bg-white/55 hover:text-[#355872] dark:text-[#8296A2] dark:hover:bg-white/[0.025] dark:hover:text-[#D6E1E6]"
              }
            `}
          >
            <span className="inline-flex items-center justify-center gap-2.5">
              <FolderKanban
                className={`h-4 w-4 ${
                  isProjects
                    ? "text-[#B9890D] dark:text-[#E6C77B]"
                    : "text-[#8EA1AD]"
                }`}
              />
              Projects
            </span>

            <span
              className={`
                absolute inset-x-[18%] bottom-0 h-[2px] rounded-full
                transition-opacity duration-200
                ${
                  isProjects
                    ? "bg-[#D7B54D] opacity-100"
                    : "opacity-0"
                }
              `}
            />
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={!isProjects}
            onClick={() => setActiveTab("internships")}
            className={`
              relative h-[62px]
              text-[13px] font-black
              transition-colors duration-200
              ${
                !isProjects
                  ? "bg-[#FFFDF6] text-[#24323B] dark:bg-[#E6C77B]/[0.055] dark:text-[#F3EEE2]"
                  : "text-[#7A8C97] hover:bg-white/55 hover:text-[#355872] dark:text-[#8296A2] dark:hover:bg-white/[0.025] dark:hover:text-[#D6E1E6]"
              }
            `}
          >
            <span className="inline-flex items-center justify-center gap-2.5">
              <Briefcase
                className={`h-4 w-4 ${
                  !isProjects
                    ? "text-[#B9890D] dark:text-[#E6C77B]"
                    : "text-[#8EA1AD]"
                }`}
              />
              Internships
            </span>

            <span
              className={`
                absolute inset-x-[18%] bottom-0 h-[2px] rounded-full
                transition-opacity duration-200
                ${
                  !isProjects
                    ? "bg-[#D7B54D] opacity-100"
                    : "opacity-0"
                }
              `}
            />
          </button>
        </div>
      </div>

      {/* Search row */}
      <div className="border-b border-[#E2E9EC] px-6 py-4 dark:border-white/8">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#788D9A] dark:text-[#8196A3]" />

          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={
              isProjects
                ? "Search projects, technologies, people..."
                : "Search internships, companies, roles..."
            }
            className="
              h-12 w-full rounded-[14px]
              border-[#D7E1E6]
              bg-white/82
              pl-11 pr-4
              text-[13px] font-semibold
              shadow-[0_5px_16px_rgba(53,88,114,0.035)]
              focus-visible:border-[#D7B54D]/55
              focus-visible:ring-[#D7B54D]/15
              dark:border-white/10
              dark:bg-white/[0.035]
              dark:text-[#EAF1F4]
              dark:placeholder:text-[#728693]
            "
          />
        </div>
      </div>

      {/* Contextual controls row */}
      <div className="px-6 py-3.5">
        {isProjects ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <FilterPill
                active={projectType === "all"}
                onClick={() => setProjectType("all")}
              >
                All
              </FilterPill>

              <FilterPill
                active={projectType === "course"}
                onClick={() => setProjectType("course")}
              >
                Course
              </FilterPill>

              <FilterPill
                active={projectType === "bachelor"}
                onClick={() => setProjectType("bachelor")}
              >
                Bachelor
              </FilterPill>
            </div>

            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-[12px] font-semibold text-[color:var(--muted)]">
              {internshipCount} completed internship
              {internshipCount === 1 ? "" : "s"}
            </p>

            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-[#E2D9BA]
                bg-[#FFF9E9]
                px-3.5 py-2
                text-[10px] font-black uppercase tracking-[0.10em]
                text-[#8D6D18]
                dark:border-[#E6C77B]/14
                dark:bg-[#E6C77B]/[0.055]
                dark:text-[#D9C57E]
              "
            >
              <Briefcase className="h-3.5 w-3.5" />
              Completed
            </div>
          </div>
        )}
      </div>
    </AppCard>
  );
}

function MoreMenu({ project, onEditProject, onDeleteRequest }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-11 z-30 w-44 rounded-2xl border border-white/70 bg-[#F7F8F0] p-2 shadow-[0_20px_60px_rgba(53,88,114,0.2)] dark:border-white/10 dark:bg-[#102030]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEditProject(project);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-black text-[#355872] transition hover:bg-[#355872]/8 dark:text-[#9CD5FF] dark:hover:bg-white/10"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDeleteRequest(project);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-black text-red-500 transition hover:bg-red-500/10 dark:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ProjectHeader({
  project,
  compact = false,
  page,
  onTogglePin,
  onEditProject,
  onDeleteRequest,
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#071C2C] dark:bg-[#071521] ${
        compact ? "h-32" : "h-full min-h-[190px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(122,170,206,0.18),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(230,199,123,0.08),transparent_34%)]" />

      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <VisibilityBadge visibility={project.visibility} />

        {project.pinned ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              if (page === "manage") {
                onTogglePin(project);
              }
            }}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[rgba(230,199,123,0.18)] px-3 text-xs font-black text-[#E6C77B] transition hover:bg-[rgba(230,199,123,0.28)]"
            title={page === "manage" ? "Unpin project" : "Pinned project"}
          >
            <Pin className="h-3.5 w-3.5" />
            {page === "manage" ? "Unpin" : "Pinned"}
          </button>
        ) : page === "manage" ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePin(project);
            }}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-3 text-xs font-black text-white transition hover:bg-white/18"
          >
            <Pin className="h-3.5 w-3.5" />
            Pin
          </button>
        ) : null}
      </div>

      <div
        className={`absolute left-4 right-4 ${
          compact ? "top-[4.35rem]" : "bottom-4"
        }`}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
          {project.type}
        </p>

        <h3
          className={`mt-2 line-clamp-2 font-black leading-tight text-white ${
            compact ? "text-[1.55rem]" : "text-[1.7rem]"
          }`}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
}

function PinnedProjectCard({
  project,
  page,
  onOpenProject,
  onTogglePin,
}) {
  const projectCover = getProjectCover(project);
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : [];
  const isBachelor = getProjectBucket(project) === "bachelor";
  const courseCode = String(project?.course || "")
    .split("-")[0]
    .trim();

  return (
    <article
      data-pinned-card
      onClick={() => onOpenProject(project)}
      className="
        group relative w-[390px] shrink-0 cursor-pointer overflow-hidden
        rounded-[1.55rem] border border-[#DDE6EA]
        bg-white/95
        shadow-[0_14px_30px_rgba(53,88,114,0.075)]
        transition-[transform,box-shadow,border-color] duration-300 ease-out
        hover:-translate-y-1.5
        hover:border-[#C8D8E0]
        hover:shadow-[0_24px_50px_rgba(32,61,80,0.14),0_8px_20px_rgba(184,151,54,0.055)]
        dark:border-white/[0.07]
        dark:bg-[#10202A]
        dark:shadow-[0_14px_30px_rgba(0,0,0,0.22)]
        dark:hover:border-[#3E5E70]/55
        dark:hover:shadow-[0_26px_56px_rgba(0,0,0,0.34),0_8px_24px_rgba(45,94,122,0.10)]
      "
    >
      <div className="relative h-[182px] overflow-hidden bg-[#0B2231] dark:bg-[#081A24]">
        {projectCover ? (
          <img
            src={projectCover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_20%_18%,rgba(122,170,206,0.22),transparent_30%),radial-gradient(circle_at_82%_75%,rgba(230,199,123,0.10),transparent_33%),linear-gradient(145deg,#0B2232,#071722)]
              dark:bg-[radial-gradient(circle_at_20%_18%,rgba(98,160,194,0.16),transparent_31%),radial-gradient(circle_at_82%_76%,rgba(58,106,132,0.13),transparent_35%),linear-gradient(145deg,#0A2635,#071722)]
            "
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#071821]/52 via-transparent to-[#071821]/6 dark:from-[#06131B]/40" />

        {project?.rating ? (
          <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0A1C27]/60 px-3 py-1.5 text-[11px] font-black text-[#F0CF78] backdrop-blur-md dark:border-white/14 dark:bg-[#07141D]/56">
            <Star className="h-3.5 w-3.5 fill-current" />
            {project.rating}
          </div>
        ) : null}

        {page === "manage" ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onTogglePin(project);
            }}
            className="absolute left-4 top-4 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/14 bg-[#071821]/60 px-3 text-[11px] font-black text-white backdrop-blur-md transition hover:border-[#E6C77B]/35 hover:text-[#E6C77B]"
          >
            <Pin className="h-3.5 w-3.5" />
            Unpin
          </button>
        ) : null}
      </div>

      <div className="flex min-h-[218px] flex-col bg-white/95 p-5 dark:bg-[#10212B]">
        <div className="flex min-w-0 items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#8A9AA4] dark:text-[#8296A2]">
          <span>
            {isBachelor ? "Bachelor Project" : project.type || "Course Project"}
          </span>

          {courseCode ? (
            <>
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#D7B54D]/60" />
              <span className="truncate tracking-[0.12em] text-[#768B98] dark:text-[#78909C]">
                {courseCode}
              </span>
            </>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 text-[1.3rem] font-black leading-tight tracking-[-0.025em] text-[color:var(--ink)]">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-[12px] font-semibold leading-5 text-[color:var(--muted)]">
          {project.description ||
            "Open this project to explore the work in more detail."}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {technologies.slice(0, 3).map((technology) => (
            <span
              key={technology}
              className="
                inline-flex items-center rounded-full
                border border-[#D8E3E8]
                bg-[#F4F8FA]
                px-2.5 py-1
                text-[10px] font-black text-[#45657A]
                dark:border-white/[0.08]
                dark:bg-[#182A34]
                dark:text-[#BFD0D9]
              "
            >
              {technology}
            </span>
          ))}

          {technologies.length > 3 ? (
            <span
              className="
                inline-flex items-center rounded-full
                border border-[#E2D8B6]
                bg-[#FFF8E7]
                px-2.5 py-1
                text-[10px] font-black text-[#9C7A20]
                dark:border-[#E6C77B]/14
                dark:bg-[#E6C77B]/8
                dark:text-[#D9C37F]
              "
            >
              +{technologies.length - 3}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function PinnedProjectsCarousel({
  projects,
  page,
  onOpenProject,
  onTogglePin,
  onEditProject,
  onDeleteRequest,
}) {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector("[data-pinned-card]");
    const amount = firstCard
      ? firstCard.getBoundingClientRect().width + 24
      : 414;

    track.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  return (
    <AppCard className="overflow-hidden px-5 pb-6 pt-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pin className="h-5 w-5 text-[#B89736] dark:text-[#E6C77B]" />

            <h2 className="text-2xl font-black text-[color:var(--ink)]">
              Pinned Projects
            </h2>
          </div>

          <p className="mt-1.5 text-[12px] font-semibold text-[color:var(--muted)]">
            Featured work selected by the student.
          </p>
        </div>

        {projects.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous pinned projects"
              className="
                grid h-9 w-9 place-items-center rounded-[11px]
                border border-[#DCE4E8] bg-white/80 text-[#355872]
                shadow-[0_5px_14px_rgba(53,88,114,0.05)]
                transition
                hover:border-[#D7B54D] hover:bg-[#FFF8E7] hover:text-[#9C7617]
                dark:border-white/9 dark:bg-white/[0.04] dark:text-[#B7CAD4]
                dark:hover:border-[#E6C77B]/28 dark:hover:bg-[#E6C77B]/7 dark:hover:text-[#E6C77B]
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next pinned projects"
              className="
                grid h-9 w-9 place-items-center rounded-[11px]
                border border-[#DCE4E8] bg-white/80 text-[#355872]
                shadow-[0_5px_14px_rgba(53,88,114,0.05)]
                transition
                hover:border-[#D7B54D] hover:bg-[#FFF8E7] hover:text-[#9C7617]
                dark:border-white/9 dark:bg-white/[0.04] dark:text-[#B7CAD4]
                dark:hover:border-[#E6C77B]/28 dark:hover:bg-[#E6C77B]/7 dark:hover:text-[#E6C77B]
              "
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <div
          className="
            relative overflow-hidden rounded-[28px]
            border border-[#DFE8EC]
            bg-[linear-gradient(145deg,rgba(239,247,250,0.86),rgba(251,249,243,0.76))]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_16px_38px_rgba(53,88,114,0.045)]
            dark:border-white/[0.06]
            dark:bg-[linear-gradient(145deg,#081923,#0A202B)]
            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_20px_46px_rgba(0,0,0,0.18)]
          "
        >
          <div
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_48%_42%,rgba(142,199,226,0.13),transparent_34%),radial-gradient(circle_at_72%_76%,rgba(230,199,123,0.05),transparent_32%)]
              dark:bg-[radial-gradient(circle_at_48%_42%,rgba(66,129,161,0.12),transparent_35%),radial-gradient(circle_at_72%_76%,rgba(230,199,123,0.035),transparent_34%)]
            "
          />

          <div
            ref={trackRef}
            className="
              scrollbar-hide relative z-[1]
              overflow-x-auto overflow-y-visible
              px-6 pb-8 pt-7
              overscroll-x-contain
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div className="flex w-max gap-6">
              {projects.map((project) => (
                <PinnedProjectCard
                  key={project.id}
                  project={project}
                  page={page}
                  onOpenProject={onOpenProject}
                  onTogglePin={onTogglePin}
                  onEditProject={onEditProject}
                  onDeleteRequest={onDeleteRequest}
                />
              ))}
            </div>
          </div>

          <div
            className="
              pointer-events-none absolute inset-y-0 left-0 w-10
              bg-gradient-to-r from-[#F0F7F9]/88 to-transparent
              dark:from-[#081923]/92
            "
          />
          <div
            className="
              pointer-events-none absolute inset-y-0 right-0 w-10
              bg-gradient-to-l from-[#F6F7F3]/88 to-transparent
              dark:from-[#0A202B]/92
            "
          />
        </div>
      ) : (
        <EmptyState
          title="No pinned projects yet."
          description={
            page === "manage"
              ? "Pin a public project below to feature it here."
              : "Pinned public projects will appear here once added."
          }
        />
      )}
    </AppCard>
  );
}

function HorizontalProjectCard({
  project,
  page,
  onOpenProject,
  onTogglePin,
  onEditProject,
  onDeleteRequest,
}) {
  const isBachelor = getProjectBucket(project) === "bachelor";
  const collaboratorCount = project.collaborators?.length || 0;
  const instructorCount = project.instructors?.length || 0;
  const technologies = Array.isArray(project?.technologies)
    ? project.technologies
    : [];

  const openProject = () => onOpenProject(project);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      className="
        group relative cursor-pointer
        px-1 py-5
        outline-none
        transition-colors duration-200
        hover:bg-[#FAFCFD]/70
        focus-visible:bg-[#FAFCFD]/80
        dark:hover:bg-white/[0.022]
        dark:focus-visible:bg-white/[0.03]
      "
    >
      {/* Gold only appears as a subtle interaction cue. */}
      <span
        className="
          absolute bottom-4 left-0 top-4 w-[3px] rounded-full
          bg-[#D7B54D]
          opacity-0
          transition-opacity duration-200
          group-hover:opacity-100
          group-focus-visible:opacity-100
        "
      />

      <div className="flex min-w-0 gap-4 pl-4 pr-2">
        {/* Small project marker, not a competing visual panel. */}
        <div
          className="
            mt-0.5 grid h-10 w-10 shrink-0 place-items-center
            rounded-[12px]
            border border-[#D6E3E8]
            bg-[#EDF4F8]
            text-[#355872]
            dark:border-white/10
            dark:bg-white/[0.055]
            dark:text-[#9CC7DA]
          "
        >
          <FolderKanban className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Primary scan line */}
          <div className="flex min-w-0 items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3
                  className="
                    min-w-0 text-[1.04rem] font-black
                    leading-tight tracking-[-0.02em]
                    text-[color:var(--ink)]
                  "
                >
                  {project.title}
                </h3>

                {project.pinned ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      if (page === "manage") {
                        onTogglePin(project);
                      }
                    }}
                    className="
                      inline-flex h-6 shrink-0 items-center gap-1
                      rounded-full
                      border border-[#E5DAB7]
                      bg-[#FFF9E9]
                      px-2
                      text-[9px] font-black text-[#96731B]
                      transition
                      hover:bg-[#FFF1C4]
                      dark:border-[#E6C77B]/14
                      dark:bg-[#E6C77B]/8
                      dark:text-[#DCC77F]
                      dark:hover:bg-[#E6C77B]/12
                    "
                    title={page === "manage" ? "Unpin project" : "Pinned project"}
                  >
                    <Pin className="h-3 w-3" />
                    Pinned
                  </button>
                ) : page === "manage" ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onTogglePin(project);
                    }}
                    className="
                      grid h-6 w-6 place-items-center rounded-full
                      text-[#91A2AC]
                      transition
                      hover:bg-[#FFF8E7] hover:text-[#A57D18]
                      dark:text-[#728894]
                      dark:hover:bg-[#E6C77B]/8
                      dark:hover:text-[#DCC77F]
                    "
                    title="Pin project"
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <div
                className="
                  mt-1.5 flex flex-wrap items-center
                  gap-x-2 gap-y-1
                  text-[10.5px] font-semibold
                  text-[color:var(--muted)]
                "
              >
                <span className="font-black text-[#5B7382] dark:text-[#AFC1CB]">
                  {project.course ||
                    (isBachelor ? "Bachelor Project" : "Course Project")}
                </span>

                <span className="text-[#C7D2D8] dark:text-white/16">•</span>

                <span>
                  Updated{" "}
                  <span className="font-black text-[#5B7382] dark:text-[#AFC1CB]">
                    {formatDate(project.updatedAt)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {project.rating ? (
                <span
                  className="
                    inline-flex items-center gap-1.5
                    rounded-full
                    border border-[#E6C77B]/20
                    bg-[#FFF8E7]
                    px-2.5 py-1
                    text-[10px] font-black text-[#9A7618]
                    dark:border-[#E6C77B]/14
                    dark:bg-[#E6C77B]/8
                    dark:text-[#E6C77B]
                  "
                  title="Instructor score"
                >
                  <Star className="h-3 w-3 fill-current" />
                  {project.rating}
                </span>
              ) : null}

              {page === "manage" ? (
                <MoreMenu
                  project={project}
                  onEditProject={onEditProject}
                  onDeleteRequest={onDeleteRequest}
                />
              ) : null}
            </div>
          </div>

          {/* Enough context to decide whether the project is worth opening. */}
          <p
            className="
              mt-3 line-clamp-2 max-w-[1120px]
              text-[12px] font-semibold leading-5.5
              text-[color:var(--muted)]
            "
          >
            {project.description || "No project summary added yet."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {technologies.slice(0, 3).map((technology) => (
              <span
                key={technology}
                className="
                  inline-flex items-center rounded-full
                  border border-[#C9DCE6]
                  bg-[#EDF4F8]
                  px-3 py-1.5
                  text-[10px] font-black text-[#355872]
                  dark:border-white/10
                  dark:bg-white/[0.055]
                  dark:text-[#BFD7E3]
                "
              >
                {technology}
              </span>
            ))}

            {technologies.length > 3 ? (
              <span
                className="
                  inline-flex items-center rounded-full
                  border border-[#E3D8B4]
                  bg-[#FFF8E7]
                  px-3 py-1.5
                  text-[10px] font-black text-[#9A7618]
                  dark:border-[#E6C77B]/14
                  dark:bg-[#E6C77B]/8
                  dark:text-[#DCC77F]
                "
              >
                +{technologies.length - 3}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div
              className="
                flex flex-wrap items-center gap-x-2.5 gap-y-1
                text-[10.5px] font-semibold
                text-[#788B96]
                dark:text-[#8296A2]
              "
            >
              <span>
                <span className="font-black text-[#415E70] dark:text-[#BCCDD5]">
                  {collaboratorCount}
                </span>{" "}
                collaborator{collaboratorCount === 1 ? "" : "s"}
              </span>

              <span className="text-[#C7D2D8] dark:text-white/16">•</span>

              <span>
                <span className="font-black text-[#415E70] dark:text-[#BCCDD5]">
                  {instructorCount}
                </span>{" "}
                instructor{instructorCount === 1 ? "" : "s"}
              </span>
            </div>

            <ChevronRight
              className="
                h-4 w-4 shrink-0 -translate-x-1
                text-[#9FB0BA] opacity-0
                transition-all duration-200
                group-hover:translate-x-0 group-hover:opacity-100
                group-focus-visible:translate-x-0 group-focus-visible:opacity-100
                dark:text-[#7F949F]
              "
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({ label, value, tone = "soft" }) {
  const styles = {
    blue: "border-[#355872]/12 bg-[#355872]/8 text-[#355872] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF]",
    gold: "border-[#B89736]/20 bg-[#E6C77B]/14 text-[#B89736] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#E6C77B]",
    navy: "border-[#355872]/12 bg-white/70 text-[#355872] dark:border-white/10 dark:bg-white/[0.04] dark:text-white",
    soft: "border-[#355872]/10 bg-white/75 text-[color:var(--muted)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70",
  };

  return (
    <div className={`rounded-[1rem] border px-3 py-2.5 ${styles[tone]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.12em] opacity-80">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-[color:var(--ink)]">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[#355872]/20 bg-white/45 p-8 text-center dark:border-white/10 dark:bg-white/[0.035]">
      <p className="text-base font-black text-[color:var(--ink)]">{title}</p>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-[color:var(--muted)]">
        {description}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
function InternshipsGrid({
  internships = [],
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  pageStartIndex = 0,
  onPageChange,
}) {
  return (
    <AppCard className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-[#B89736] dark:text-[#E6C77B]" />

        <h2 className="text-2xl font-black text-[color:var(--ink)]">
          Completed Internships
        </h2>
      </div>

      {internships.length > 0 ? (
        <>
          <div className="space-y-4">
            {internships.map((internship) => (
              <motion.article
                key={internship.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className="group cursor-pointer overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/74 shadow-[0_18px_44px_rgba(53,88,114,0.09)] dark:border-white/10 dark:bg-white/[0.045]"
              >
                <div className="grid min-h-[210px] lg:grid-cols-[260px_1fr]">
                  <div className="relative overflow-hidden bg-[#071C2C] dark:bg-[#071521]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(122,170,206,0.18),transparent_32%),radial-gradient(circle_at_82%_82%,rgba(230,199,123,0.08),transparent_34%)]" />

                    <div className="absolute left-4 top-4 z-10">
                      <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 text-xs font-black text-[#9CD5FF] backdrop-blur-md">
                        <Briefcase className="h-3.5 w-3.5" />
                        Internship
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                        {internship.company || "Company"}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-[1.7rem] font-black leading-tight text-white">
                        {internship.title || internship.role || "Internship"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-[color:var(--ink)]">
                          {internship.title || internship.role || "Internship"}
                        </p>

                        <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
                          {internship.company || "Company not added"} •{" "}
                          {internship.location || "Location not added"}
                        </p>
                      </div>

                      <ScoreBadge rating={internship.rating || "4.8"} />
                    </div>

                    <div className="mt-4 px-1 py-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#355872] dark:text-[#9CD5FF]">
                        Internship Summary
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-6 text-[color:var(--muted)]">
                        {internship.overview ||
                          internship.details ||
                          internship.description ||
                          internship.summary ||
                          "No internship description added yet."}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-4">
                      <MiniMetric
                        label="Type"
                        value={internship.type || "Internship"}
                        tone="navy"
                      />

                      <MiniMetric
                        label="Duration"
                        value={internship.duration || "Not added"}
                        tone="soft"
                      />

                      <MiniMetric
                        label="Status"
                        value={internship.status || "Completed"}
                        tone="blue"
                      />

                      <MiniMetric
                        label="Updated"
                        value={
                          internship.updatedAt
                            ? formatDate(internship.updatedAt)
                            : internship.deadline
                            ? `Deadline ${formatDate(internship.deadline)}`
                            : internship.postedAt || "Unknown"
                        }
                        tone="soft"
                      />
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3 pt-4">
                      {internship.link ? (
                        <SoftButton
                          href={normalizeUrl(internship.link)}
                          className="h-10 px-4 text-xs"
                        >
                          View Internship
                          <ExternalLink className="h-4 w-4" />
                        </SoftButton>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageStartIndex={pageStartIndex}
            pageSize={INTERNSHIPS_PAGE_SIZE}
            onPageChange={onPageChange}
            ariaLabel="Completed internships pagination"
          />
        </>
      ) : (
        <EmptyState
          title="No internships found."
          description="Try changing the internship search."
        />
      )}
    </AppCard>
  );
}

function ProjectsGrid({
  title,
  projects,
  page,
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  pageStartIndex = 0,
  onPageChange,
  onOpenProject,
  onTogglePin,
  onEditProject,
  onDeleteRequest,
}) {
  return (
    <AppCard className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <FolderKanban className="h-5 w-5 text-[#355872] dark:text-[#9CD5FF]" />

        <h2 className="text-2xl font-black text-[color:var(--ink)]">
          {title}
        </h2>
      </div>

      {projects.length > 0 ? (
        <>
          <div className="divide-y divide-[#E1E9ED] dark:divide-white/8">
            {projects.map((project) => (
              <HorizontalProjectCard
                key={project.id}
                project={project}
                page={page}
                onOpenProject={onOpenProject}
                onTogglePin={onTogglePin}
                onEditProject={onEditProject}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageStartIndex={pageStartIndex}
            pageSize={PROJECTS_PAGE_SIZE}
            onPageChange={onPageChange}
            ariaLabel="Public projects pagination"
          />
        </>
      ) : (
        <EmptyState
          title="No public projects found."
          description="Try changing the search, project type, or sorting options."
          action={
            page === "manage" ? (
              <PrimaryButton to="/create-project">Create Project</PrimaryButton>
            ) : null
          }
        />
      )}
    </AppCard>
  );
}

function ProjectPreviewModal({
  project,
  onClose,
  onEditProject,
  onTogglePin,
  page,
}) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#102030]/25 px-4 backdrop-blur-md dark:bg-[#071521]/65">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-[#355872]/15 bg-[#F7F8F0] p-7 text-[color:var(--ink)] shadow-[0_34px_100px_rgba(16,32,48,0.22)] dark:border-white/10 dark:bg-[#102030]"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#355872] dark:text-[#9CD5FF]">
              Project Preview
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight text-[color:var(--ink)]">
              {project.title}
            </h2>

            <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
              {getProjectBucket(project) === "bachelor"
                ? "Bachelor Project"
                : project.course}{" "}
              • {project.status}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#355872]/15 bg-white/85 text-[#355872] shadow-[0_12px_28px_rgba(53,88,114,0.12)] transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-[#9CD5FF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[#355872]/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(122,170,206,0.14))] p-6 shadow-[0_20px_60px_rgba(53,88,114,0.10)] dark:border-white/10 dark:bg-white/[0.045]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#355872]/16 bg-[#355872]/10 px-3 py-1.5 text-xs font-black text-[#355872] dark:border-white/10 dark:bg-white/10 dark:text-[#9CD5FF]">
              <Eye className="h-3.5 w-3.5" />
              {project.visibility}
            </span>

            {project.pinned ? (
              <button
                type="button"
                onClick={() => page === "manage" && onTogglePin(project)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(230,199,123,0.20)] px-3 py-1.5 text-xs font-black text-[#B89736] transition hover:bg-[rgba(230,199,123,0.28)] dark:text-[#E6C77B]"
              >
                <Pin className="h-3.5 w-3.5" />
                {page === "manage" ? "Unpin" : "Pinned"}
              </button>
            ) : page === "manage" ? (
              <button
                type="button"
                onClick={() => onTogglePin(project)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#355872]/16 bg-[#355872]/10 px-3 py-1.5 text-xs font-black text-[#355872]"
              >
                <Pin className="h-3.5 w-3.5" />
                Pin
              </button>
            ) : null}

            <ScoreBadge rating={project.rating} />
          </div>

          <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[color:var(--muted)]">
            {project.description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#355872]/12 bg-white/65 p-5 shadow-[0_14px_34px_rgba(53,88,114,0.07)] dark:border-white/10 dark:bg-white/[0.045]">
            <h3 className="font-black text-[color:var(--ink)]">
              Technologies
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.technologies || []).map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#355872]/12 bg-white/65 p-5 shadow-[0_14px_34px_rgba(53,88,114,0.07)] dark:border-white/10 dark:bg-white/[0.045]">
            <h3 className="font-black text-[color:var(--ink)]">Details</h3>

            <div className="mt-4 space-y-2 text-sm font-semibold text-[color:var(--muted)]">
              <p>{project.collaborators.length} collaborators</p>
              <p>{project.instructors.length} instructors</p>
              <p>Updated {formatDate(project.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.github ? (
            <SoftButton href={normalizeUrl(project.github)}>
              GitHub
              <ExternalLink className="h-4 w-4" />
            </SoftButton>
          ) : null}

          {project.demo ? (
            <SoftButton href={normalizeUrl(project.demo)}>
              Demo
              <ExternalLink className="h-4 w-4" />
            </SoftButton>
          ) : null}

          {page === "manage" ? (
            <>
              <SoftButton onClick={() => onEditProject(project)}>
                Edit Project
              </SoftButton>

              <SoftButton onClick={() => onTogglePin(project)}>
                <Pin className="h-4 w-4" />
                {project.pinned ? "Unpin" : "Pin"}
              </SoftButton>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function DeleteProjectDialog({ project, onCancel, onConfirm }) {
  return (
    <AlertDialog
      open={Boolean(project)}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent className="max-w-md rounded-[2rem] border border-[#355872]/18 bg-[#F7F8F0] px-8 py-7 text-[color:var(--ink)] shadow-[0_30px_80px_rgba(53,88,114,0.22)] dark:border-white/10 dark:bg-[#102030]">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-3xl font-black tracking-tight text-[color:var(--ink)]">
            Delete project?
          </AlertDialogTitle>

          <AlertDialogDescription className="pt-2 text-base font-semibold leading-7 text-[color:var(--muted)]">
            {project
              ? `This will remove "${project.title}" from the portfolio when you save changes.`
              : "This will remove the selected project when you save changes."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-5 h-px w-full bg-[#355872]/12 dark:bg-white/10" />

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="min-h-11 rounded-full border border-[#355872]/16 bg-white px-5 font-black text-[color:var(--ink)] hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-[color:var(--ink)]">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="min-h-11 rounded-full bg-red-500 px-5 font-black text-white shadow-[0_14px_35px_rgba(239,68,68,0.22)] hover:bg-red-600"
          >
            Yes, remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SaveChangesDialog({ open, onCancel, onDiscard, onSave }) {
  return (
    <AdminActionDialog
      open={open}
      title="Save portfolio changes?"
      description="Save your portfolio updates and go to preview, discard this editing session, or cancel and keep editing."
      cancelLabel="Cancel"
      secondaryLabel="Discard Changes"
      confirmLabel="Save & Preview"
      showIcon={false}
      tone="brand"
      dialogClassName="
  !max-w-[560px]
  [&>div]:!min-h-0
  [&>div]:!h-auto
"
      onCancel={onCancel}
      onSecondary={onDiscard}
      onConfirm={onSave}
    />
  );
}


function getCourseLabelFromStore(project, courses) {
  const projectType = String(project.type || "").toLowerCase();

  const isBachelorProject =
    projectType.includes("bachelor") ||
    projectType.includes("thesis");

  if (isBachelorProject) {
    return "Bachelor Project";
  }

  if (project.course) return project.course;
  if (project.courseCode) return project.courseCode;
  if (project.courseName) return project.courseName;

  const course = courses.find((item) => item.id === project.courseId);

  return (
    course?.code ||
    course?.courseCode ||
    course?.name ||
    course?.title ||
    project.courseId ||
    "Course Project"
  );
}

function getUserDisplayName(userId, users) {
  const user = users.find((item) => item.id === userId);
  return user?.name || user?.email || userId;
}

function normalizeStoreProject(project, courses, users) {
  const technologies =
    project.technologies ||
    project.tags ||
    project.languages ||
    project.skills ||
    [];

  const collaboratorIds =
    project.collaboratorIds ||
    project.collaboratorsIds ||
    project.collaboratorIDs ||
    [];

  const instructorIds =
    project.instructorIds ||
    project.instructorsIds ||
    project.instructorIDs ||
    [];

  const collaborators =
    Array.isArray(project.collaborators) && project.collaborators.length > 0
      ? project.collaborators
      : collaboratorIds.map((id) => getUserDisplayName(id, users));

  const instructors =
    Array.isArray(project.instructors) && project.instructors.length > 0
      ? project.instructors
      : instructorIds.map((id) => getUserDisplayName(id, users));

  const course = getCourseLabelFromStore(project, courses);

  return {
    id: project.id,
    title: project.title || project.name || "Untitled Project",
    course,
    type:
      project.type === "thesis" ||
      project.type === "Bachelor Project" ||
      course.toLowerCase().includes("bachelor")
        ? "Bachelor Project"
        : project.type === "course"
        ? "Course Project"
        : project.type || "Course Project",
    description:
      project.description ||
      project.shortDescription ||
      project.summary ||
      "No description added yet.",
    visibility:
      String(project.visibility || "public").toLowerCase() === "public"
        ? "Public"
        : "Private",
    status: project.status || "Draft",
    rating: Number(project.rating || project.averageRating || 4.5),
    technologies,
    collaborators,
    instructors,
    github: project.github || project.githubUrl || "",
    demo: project.demo || project.demoUrl || project.video?.name || "",
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt:
      project.updatedAt ||
      project.updated ||
      project.createdAt ||
      new Date().toISOString(),
    pinned: Boolean(project.pinned || project.isPinned),
    isMock: false,
  };
}

export function PortfolioPageShell({ page = "preview" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useUserProfile();

  const location = useLocation();

const [toast, setToast] = useState({
  open: false,
  title: "",
  description: "",
  type: "success",
});

useEffect(() => {
  const storedToast = sessionStorage.getItem("portfolioToast");

  if (!storedToast) return;

  try {
    const parsedToast = JSON.parse(storedToast);

    setToast({
      open: true,
      ...parsedToast,
    });
  } catch {
    // ignore invalid stored toast
  }

  sessionStorage.removeItem("portfolioToast");
}, [location.pathname]);

  const [storeProjects, setStoreProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [viewedUser, setViewedUser] = useState(null);
  const [viewMode, setViewMode] = useState("own");

  const [draftOverrides, setDraftOverrides] = useState({});
  const [draftDeletedProjectIds, setDraftDeletedProjectIds] = useState([]);

  const [previewProject, setPreviewProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [workTab, setWorkTab] = useState("projects");
  const [search, setSearch] = useState("");
  const [internshipSearch, setInternshipSearch] = useState("");
  const [projectType, setProjectType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [projectPage, setProjectPage] = useState(1);
  const [internshipPage, setInternshipPage] = useState(1);

  const refreshPortfolioData = () => {
    const currentUser = getCurrentUser();
    const queryUserId = searchParams.get("userId");

    const targetUserId =
      page === "manage" ? currentUser?.id : queryUserId || currentUser?.id;

    const isPublicView =
      page !== "manage" && Boolean(queryUserId) && queryUserId !== currentUser?.id;

    setViewMode(isPublicView ? "public" : "own");

    if (!targetUserId) {
      setStoreProjects([]);
      setCourses([]);
      setUsers([]);
      setViewedUser(null);
      return;
    }

    const allCourses = getCollection("courses") || [];
    const allUsers = getCollection("users") || [];
    const targetUser = getUserById(targetUserId);

    setCourses(allCourses);
    setUsers(allUsers);
    setViewedUser(targetUser || currentUser || null);
    setStoreProjects(getProjectsForUser(targetUserId) || []);
    setInternships(getCollection("internships") || []);
  };

  useEffect(() => {
    refreshPortfolioData();
  }, [page, searchParams]);

  const activeOverrides = page === "manage" ? draftOverrides : {};

  const portfolioProfile = useMemo(() => {
    const currentUser = getCurrentUser();
    const isOwnProfile = viewedUser?.id === currentUser?.id;

    if (isOwnProfile) {
      const viewedLinks = viewedUser?.links || {};
      const contextLinks = profile?.links || {};

      return {
        ...viewedUser,
        ...profile,

        // Prefer the live profile context for editable text fields,
        // but never let empty context values wipe populated store data.
        name: profile?.name || viewedUser?.name,
        role: profile?.role || viewedUser?.role,
        bio: profile?.bio || viewedUser?.bio,
        faculty: profile?.faculty || viewedUser?.faculty,
        major: profile?.major || viewedUser?.major,
        semester: profile?.semester || viewedUser?.semester,
        expectedGraduation:
          profile?.expectedGraduation ||
          profile?.graduationYear ||
          viewedUser?.expectedGraduation ||
          viewedUser?.graduationYear ||
          "",
        graduationYear:
          profile?.graduationYear ||
          profile?.expectedGraduation ||
          viewedUser?.graduationYear ||
          viewedUser?.expectedGraduation ||
          "",
        opportunityStatus:
          profile?.opportunityStatus || viewedUser?.opportunityStatus,
        skills:
          Array.isArray(profile?.skills) && profile.skills.length
            ? profile.skills
            : viewedUser?.skills || [],

        // Own-profile bug fix:
        // UserProfileContext may contain empty image/link fields. Because it is
        // spread after viewedUser, those empty values were replacing the real
        // student data and causing initials + missing professional links.
        profileImage:
          profile?.profileImage ||
          profile?.avatar ||
          profile?.image ||
          profile?.photo ||
          viewedUser?.profileImage ||
          viewedUser?.avatar ||
          viewedUser?.image ||
          viewedUser?.photo ||
          "",
        avatar:
          profile?.avatar ||
          profile?.profileImage ||
          viewedUser?.avatar ||
          viewedUser?.profileImage ||
          "",
        links: {
          ...viewedLinks,
          ...contextLinks,
          linkedin:
            contextLinks.linkedin ||
            profile?.linkedin ||
            profile?.linkedinUrl ||
            viewedLinks.linkedin ||
            viewedUser?.linkedin ||
            viewedUser?.linkedinUrl ||
            "",
          github:
            contextLinks.github ||
            profile?.github ||
            profile?.githubUrl ||
            viewedLinks.github ||
            viewedUser?.github ||
            viewedUser?.githubUrl ||
            "",
          behance:
            contextLinks.behance ||
            profile?.behance ||
            profile?.behanceUrl ||
            viewedLinks.behance ||
            viewedUser?.behance ||
            viewedUser?.behanceUrl ||
            "",
        },

        // Keep the flat aliases too because older parts of the app still
        // understand these shapes.
        linkedin:
          profile?.linkedin ||
          profile?.linkedinUrl ||
          contextLinks.linkedin ||
          viewedUser?.linkedin ||
          viewedUser?.linkedinUrl ||
          viewedLinks.linkedin ||
          "",
        github:
          profile?.github ||
          profile?.githubUrl ||
          contextLinks.github ||
          viewedUser?.github ||
          viewedUser?.githubUrl ||
          viewedLinks.github ||
          "",
        behance:
          profile?.behance ||
          profile?.behanceUrl ||
          contextLinks.behance ||
          viewedUser?.behance ||
          viewedUser?.behanceUrl ||
          viewedLinks.behance ||
          "",
      };
    }

    return viewedUser || profile;
  }, [profile, viewedUser]);

  const allProjects = useMemo(() => {
    return storeProjects
      .filter((project) =>
        page === "manage" ? !draftDeletedProjectIds.includes(project.id) : true
      )
      .map((project) => normalizeStoreProject(project, courses, users))
      .map((project) => applyOverrides(project, activeOverrides));
  }, [storeProjects, courses, users, activeOverrides, draftDeletedProjectIds, page]);

  const publicProjects = useMemo(() => {
    return allProjects.filter((project) => project.visibility === "Public");
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = publicProjects.filter((project) => {
      const searchableText = [
        project.title,
        project.course,
        project.type,
        project.status,
        project.description,
        project.github,
        project.demo,
        ...(project.technologies || []),
        ...(project.collaborators || []),
        ...(project.instructors || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      const bucket = getProjectBucket(project);
      const matchesType = projectType === "all" || bucket === projectType;

      return matchesSearch && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      if (sortBy === "name-desc") return b.title.localeCompare(a.title);

      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [publicProjects, search, projectType, sortBy]);

  const pinnedProjects = useMemo(() => {
    return publicProjects.filter((project) => project.pinned);
  }, [publicProjects]);

  const stats = useMemo(() => {
    const ratings = publicProjects
      .map((project) => Number(project.rating || 0))
      .filter((value) => value > 0);

    const average =
      ratings.length > 0
        ? (
            ratings.reduce((sum, value) => sum + value, 0) / ratings.length
          ).toFixed(1)
        : "0.0";

    const completedInternships = internships.filter((internship) => {
      const status = String(internship.status || "").toLowerCase();

      return (
        status === "accepted" ||
        status === "filled" ||
        status === "completed"
      );
    }).length;

    return {
      total: publicProjects.length,
      completedInternships,
      averageRating: average,
    };
  }, [publicProjects, internships]);

  const acceptedInternships = useMemo(() => {
    return internships.filter((internship) => {
      const status = String(internship.status || "").toLowerCase();

      return (
        status === "accepted" ||
        status === "filled" ||
        status === "completed"
      );
    });
  }, [internships]);

  const filteredInternships = useMemo(() => {
    const q = internshipSearch.trim().toLowerCase();

    if (!q) return acceptedInternships;

    return acceptedInternships.filter((internship) => {
      const searchableText = [
        internship.title,
        internship.role,
        internship.company,
        internship.location,
        internship.type,
        internship.duration,
        internship.status,
        internship.overview,
        internship.details,
        internship.description,
        internship.summary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [acceptedInternships, internshipSearch]);

  useEffect(() => {
    setProjectPage(1);
  }, [search, projectType, sortBy]);

  useEffect(() => {
    setInternshipPage(1);
  }, [internshipSearch]);

  const projectTotalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PROJECTS_PAGE_SIZE)
  );
  const safeProjectPage = Math.min(projectPage, projectTotalPages);
  const projectStartIndex =
    (safeProjectPage - 1) * PROJECTS_PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(
    projectStartIndex,
    projectStartIndex + PROJECTS_PAGE_SIZE
  );

  const internshipTotalPages = Math.max(
    1,
    Math.ceil(filteredInternships.length / INTERNSHIPS_PAGE_SIZE)
  );
  const safeInternshipPage = Math.min(internshipPage, internshipTotalPages);
  const internshipStartIndex =
    (safeInternshipPage - 1) * INTERNSHIPS_PAGE_SIZE;
  const paginatedInternships = filteredInternships.slice(
    internshipStartIndex,
    internshipStartIndex + INTERNSHIPS_PAGE_SIZE
  );

  const updateDraftOverride = (projectId, patch) => {
    setDraftOverrides((current) => ({
      ...current,
      [projectId]: {
        ...(current[projectId] || {}),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const handleOpenProject = (project) => {
    const sequence = [...pinnedProjects, ...filteredProjects];
    const projectIds = Array.from(
      new Set(sequence.map((item) => String(item.id)))
    );

    navigate(`/project?projectId=${encodeURIComponent(project.id)}`, {
      state: {
        projectFlow: {
          originPath: `${location.pathname}${location.search}`,
          originLabel:
            viewMode === "public"
              ? `${portfolioProfile?.name || "Student"}'s Portfolio`
              : "My Portfolio",
          projectIds,
        },
      },
    });
  };

  const handleTogglePin = (project) => {
    if (page !== "manage") return;

    const nextPinned = !project.pinned;

    updateDraftOverride(project.id, {
      pinned: nextPinned,
      isPinned: nextPinned,
    });

    setPreviewProject((current) =>
      current?.id === project.id ? { ...current, pinned: nextPinned } : current
    );
  };

  const handleEditProject = (project) => {
    navigate(`/edit-project/${project.id}`);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;

    const project = projectToDelete;

    setDraftDeletedProjectIds((current) => [
      ...new Set([...current, project.id]),
    ]);

    if (previewProject?.id === project.id) {
      setPreviewProject(null);
    }

    setProjectToDelete(null);
  };

  const handleSaveChanges = () => {
    Object.entries(draftOverrides).forEach(([projectId, patch]) => {
      updateProject(projectId, {
        ...patch,
        updatedAt: new Date().toISOString(),
      });
    });

    draftDeletedProjectIds.forEach((projectId) => {
      deleteProjectFromStore(projectId);
    });

   setDraftOverrides({});
setDraftDeletedProjectIds([]);
setShowSaveDialog(false);

refreshPortfolioData();

sessionStorage.setItem(
  "portfolioToast",
  JSON.stringify({
    title: "Portfolio saved successfully",
    description: "Your portfolio changes have been saved.",
    type: "success",
  })
);

navigate("/portfolio");
  };

  const handleDiscardChanges = () => {
  setDraftOverrides({});
  setDraftDeletedProjectIds([]);
  setShowSaveDialog(false);

  refreshPortfolioData();

  sessionStorage.setItem(
    "portfolioToast",
    JSON.stringify({
      title: "Changes discarded",
      description: "Your unsaved portfolio changes have been discarded.",
      type: "success",
    })
  );

  navigate("/portfolio");
};

  const canManageProfile = page === "manage" && viewMode !== "public";

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
      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
        onEditProject={handleEditProject}
        onTogglePin={handleTogglePin}
        page={page}
      />

      <DeleteProjectDialog
        project={projectToDelete}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <SaveChangesDialog
        open={showSaveDialog}
        onCancel={() => setShowSaveDialog(false)}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveChanges}
      />
      <main className="px-4 pt-5 pb-24 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[1480px] space-y-6">
  <PortfolioContextBar
    page={page}
    viewMode={viewMode}
    internshipId={searchParams.get("internshipId") || ""}
    onOpenSaveDialog={() => setShowSaveDialog(true)}
  />

  <PortfolioTopCard
    profile={portfolioProfile}
    stats={stats}
    page={page}
    canManageProfile={canManageProfile}
    viewMode={viewMode}
    internshipId={searchParams.get("internshipId") || ""}
  />

        <PinnedProjectsCarousel
          projects={pinnedProjects}
          page={page}
          onOpenProject={handleOpenProject}
          onTogglePin={handleTogglePin}
          onEditProject={handleEditProject}
          onDeleteRequest={setProjectToDelete}
        />

        <PortfolioWorkBrowser
          activeTab={workTab}
          setActiveTab={setWorkTab}
          projectSearch={search}
          setProjectSearch={setSearch}
          internshipSearch={internshipSearch}
          setInternshipSearch={setInternshipSearch}
          projectType={projectType}
          setProjectType={setProjectType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          internshipCount={acceptedInternships.length}
        />

        {workTab === "projects" ? (
          <ProjectsGrid
            title="Public Projects"
            projects={paginatedProjects}
            page={page}
            totalItems={filteredProjects.length}
            currentPage={safeProjectPage}
            totalPages={projectTotalPages}
            pageStartIndex={projectStartIndex}
            onPageChange={setProjectPage}
            onOpenProject={handleOpenProject}
            onTogglePin={handleTogglePin}
            onEditProject={handleEditProject}
            onDeleteRequest={setProjectToDelete}
          />
        ) : (
          <InternshipsGrid
            internships={paginatedInternships}
            totalItems={filteredInternships.length}
            currentPage={safeInternshipPage}
            totalPages={internshipTotalPages}
            pageStartIndex={internshipStartIndex}
            onPageChange={setInternshipPage}
          />
        )}
      </div>
      </main>
    </DashboardLayout>
  );
}
