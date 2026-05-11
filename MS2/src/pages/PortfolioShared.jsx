import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  BookOpen,
  CalendarDays,
  ChevronDown,
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
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/context/UserProfileContext";
import { ViewAllButton } from "@/components/ui/ViewAllButton";
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
  "bg-[#355872] text-white shadow-[0_16px_40px_rgba(53,88,114,0.22)] hover:bg-[#253F53] dark:bg-[#9CD5FF] dark:text-[#071521] dark:hover:bg-white";

const softButton =
  "border border-[#355872]/15 bg-white/80 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-[#9CD5FF] dark:hover:bg-white/[0.1]";

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
      className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-black transition ${
        active
          ? "bg-[#355872] text-white shadow-[0_12px_28px_rgba(53,88,114,0.16)] dark:bg-[#9CD5FF] dark:text-[#071521]"
          : "border border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-[#9CD5FF]"
      }`}
    >
      {children}
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

function PortfolioHeader({ page, viewMode = "own", viewedName = "", onOpenSaveDialog }) {
  const isManage = page === "manage";
  const isPublic = viewMode === "public";

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#355872]/45 dark:text-[#9CD5FF]/60">
          Portfolio Hub
        </p>

        <h1 className="mt-2 text-5xl font-black tracking-tight text-[color:var(--ink)]">
          {isManage
            ? "Manage Portfolio"
            : isPublic
            ? `${viewedName || "Student"}'s Portfolio`
            : "My Portfolio"}
        </h1>

        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-[color:var(--muted)]">
          {isManage
            ? "Control your public portfolio, pin featured work, remove projects, edit entries, and save changes when you are done."
            : isPublic
            ? "Review this student's public work, featured projects, skills, portfolio links, and academic contributions."
            : "Showcase your public work, featured projects, instructor scores, skills, and portfolio links."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {isPublic ? null : page === "preview" ? (
          <PrimaryButton to="/manage-portfolio" className="px-7">
            <Edit3 className="h-4 w-4" />
            Manage Portfolio
          </PrimaryButton>
        ) : (
          <>
            <SoftButton to="/create-project">
              <FolderKanban className="h-4 w-4" />
              Add Project
            </SoftButton>

            <PrimaryButton onClick={onOpenSaveDialog}>
              Save Changes
            </PrimaryButton>
          </>
        )}
      </div>
    </section>
  );
}

function PortfolioTopCard({ profile, stats, page, canManageProfile = false }) {
  const links = getProfileLinks(profile);
  const profileImage = getProfileImage(profile);
  const skills = profile?.skills || [];

  return (
    <AppCard className="p-6 lg:p-7">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_190px] xl:items-end">
        <div className="flex h-full flex-col items-center text-center xl:justify-end">
          <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-[#355872]/14 bg-[linear-gradient(145deg,#16293A,#355872)] text-4xl font-black text-white shadow-[0_22px_55px_rgba(16,32,48,0.22)] dark:border-white/10 dark:bg-[linear-gradient(145deg,#071521,#183248)]">
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

          <h2 className="mt-4 text-3xl font-black leading-tight text-[color:var(--ink)]">
            {profile?.name || "Yasmin Khaled"}
          </h2>

          <p className="mt-1 text-base font-semibold text-[color:var(--muted)]">
            {profile?.role || "Computer Science Student"}
          </p>

          <p className="mt-4 max-w-[240px] text-sm font-semibold leading-7 text-[color:var(--muted)]">
            {profile?.bio ||
              "Passionate about building impactful digital solutions."}
          </p>

          {canManageProfile ? (
            <PrimaryButton to="/edit-student-profile" className="mt-5 w-full max-w-[210px]">
              <Edit3 className="h-4 w-4" />
              Manage Profile
            </PrimaryButton>
          ) : null}
        </div>

        <div className="flex h-full flex-col justify-end gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <ProfileInfoRow
              icon={GraduationCap}
              label="Faculty"
              value={profile?.faculty || "Engineering and Technology"}
            />

            <ProfileInfoRow
              icon={BookOpen}
              label="Major"
              value={profile?.major || "Computer Science"}
            />

            <ProfileInfoRow
              icon={CalendarDays}
              label="Semester"
              value={profile?.semester || "6"}
            />

            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <Star className="mt-1 h-4 w-4 text-[#355872] dark:text-[#9CD5FF]" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[color:var(--ink)]">Skills</p>

                    <span className="text-sm font-bold text-[color:var(--muted)]">
                      {skills.length} added
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.slice(0, 4).map((skill) => (
                        <SkillChip key={skill}>{skill}</SkillChip>
                      ))
                    ) : (
                      <span className="text-xs font-semibold text-[color:var(--muted)]">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="grid gap-2 md:grid-cols-3">
            <LinkRow icon={Link2} label="LinkedIn" value={links.linkedin} />
            <LinkRow icon={Code2} label="GitHub" value={links.github} />
            <LinkRow icon={Palette} label="Behance" value={links.behance} />
          </div>
        </div>

        <div className="flex h-full flex-col justify-end gap-3">
          <StatTile value={stats.total} label="Public" />
          <StatTile value={stats.pinnedCount} label="Pinned" />
          <StatTile value={stats.averageRating} label="Avg. Rating" />
        </div>
      </div>
    </AppCard>
  );
}

function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "date", label: "Date Updated" },
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
        className={`${buttonBase} ${softButton} min-w-[230px] justify-between`}
      >
        <span className="inline-flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort: {selected?.label}
        </span>

        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
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

          <div className="absolute right-0 top-14 z-50 w-[250px] overflow-hidden rounded-[1.35rem] border border-[#355872]/15 bg-[#F7F8F0]/95 p-2 shadow-[0_22px_60px_rgba(53,88,114,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#102030]/95">
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
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                    active
                      ? "bg-[#355872] text-white shadow-[0_10px_24px_rgba(53,88,114,0.16)] dark:bg-[#9CD5FF] dark:text-[#102030]"
                      : "text-[color:var(--muted)] hover:bg-white/75 hover:text-[#355872] dark:hover:bg-white/10 dark:hover:text-[#9CD5FF]"
                  }`}
                >
                  {option.label}

                  {active ? (
                    <span className="h-2 w-2 rounded-full bg-current" />
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

function ProjectsToolbar({
  search,
  setSearch,
  projectType,
  setProjectType,
  sortBy,
  setSortBy,
}) {
  return (
    <AppCard className="p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            Portfolio Projects
          </h2>

          <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
            Search and filters apply to both pinned and public project sections.
          </p>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects, people, languages..."
              className="h-12 rounded-full border-white/70 bg-white/75 pl-11 font-semibold shadow-sm dark:border-white/10 dark:bg-white/[0.045]"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 p-1 dark:border-white/10 dark:bg-white/[0.045]">
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
        </div>
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

      {page === "manage" ? (
        <div className="absolute right-4 top-4">
          <MoreMenu
            project={project}
            onEditProject={onEditProject}
            onDeleteRequest={onDeleteRequest}
          />
        </div>
      ) : null}

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
  onEditProject,
  onDeleteRequest,
}) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.006 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenProject(project)}
      className="w-[340px] shrink-0 cursor-pointer overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/75 shadow-[0_16px_38px_rgba(53,88,114,0.10)] dark:border-white/10 dark:bg-white/[0.045]"
    >
      <ProjectHeader
        project={project}
        compact
        page={page}
        onTogglePin={onTogglePin}
        onEditProject={onEditProject}
        onDeleteRequest={onDeleteRequest}
      />

      <div className="space-y-3 p-4">
        <p className="line-clamp-1 text-sm font-black text-[color:var(--ink)]">
          {getProjectBucket(project) === "bachelor"
            ? "Bachelor Project"
            : project.course}
        </p>

        <ScoreBadge rating={project.rating} />

        <p className="line-clamp-2 text-xs font-semibold leading-6 text-[color:var(--muted)]">
          {project.description}
        </p>

        <TagList items={project.technologies} limit={3} />

        <div className="grid grid-cols-3 gap-2 rounded-[1rem] border border-white/60 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[0.035]">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[color:var(--muted)]">
              People
            </p>

            <p className="mt-1 text-xs font-black text-[color:var(--ink)]">
              {project.collaborators.length}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[color:var(--muted)]">
              Reviewers
            </p>

            <p className="mt-1 text-xs font-black text-[color:var(--ink)]">
              {project.instructors.length}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[color:var(--muted)]">
              Updated
            </p>

            <p className="mt-1 text-xs font-black text-[color:var(--ink)]">
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
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
  const shouldFade = projects.length > 3;
  const shouldCenter = projects.length > 0 && projects.length <= 3;

  return (
    <AppCard className="overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Pin className="h-5 w-5 text-[#B89736] dark:text-[#E6C77B]" />

          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            Pinned Projects
          </h2>
        </div>

        <p className="hidden text-sm font-semibold text-[color:var(--muted)] md:block">
          Featured work appears first.
        </p>
      </div>

      {projects.length > 0 ? (
        <div
          className={`pb-3 ${
            shouldFade
              ? "overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
              : "overflow-visible"
          }`}
        >
          <div
            className={`flex gap-5 px-1 ${
              shouldCenter ? "min-w-full justify-center" : "w-max"
            }`}
          >
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
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      onClick={() => onOpenProject(project)}
      className="group cursor-pointer overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/74 shadow-[0_18px_44px_rgba(53,88,114,0.09)] dark:border-white/10 dark:bg-white/[0.045]"
    >
      <div className="grid min-h-[210px] lg:grid-cols-[260px_1fr]">
        <ProjectHeader
          project={project}
          page={page}
          onTogglePin={onTogglePin}
          onEditProject={onEditProject}
          onDeleteRequest={onDeleteRequest}
        />

        <div className="flex h-full flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[color:var(--ink)]">
                {getProjectBucket(project) === "bachelor"
                  ? "Bachelor Project"
                  : project.course}
              </p>

              <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
                {project.status} • Updated {formatDate(project.updatedAt)}
              </p>
            </div>

            <ScoreBadge rating={project.rating} />
          </div>

          <div className="mt-4 px-1 py-1">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#355872] dark:text-[#9CD5FF]">
              Project Summary
            </p>

            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-6 text-[color:var(--muted)]">
              {project.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#355872] dark:text-[#9CD5FF]">
                <Code2 className="h-3.5 w-3.5" />
                Tech
              </span>

              <TagList items={project.technologies} limit={4} />
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <MiniMetric
              label="Collaborators"
              value={project.collaborators.length}
              tone="blue"
            />
            <MiniMetric
              label="Instructors"
              value={project.instructors.length}
              tone="gold"
            />
            <MiniMetric
              label="Type"
              value={
                getProjectBucket(project) === "bachelor" ? "Bachelor" : "Course"
              }
              tone="navy"
            />
            <MiniMetric
              label="Updated"
              value={formatDate(project.updatedAt)}
              tone="soft"
            />
          </div>

          <div className="mt-auto flex flex-wrap gap-3 pt-4">
            {project.github ? (
              <SoftButton
                href={normalizeUrl(project.github)}
                className="h-10 px-4 text-xs"
                onClick={(event) => event.stopPropagation()}
              >
                GitHub
                <ExternalLink className="h-4 w-4" />
              </SoftButton>
            ) : null}

            {project.demo ? (
              <SoftButton
                href={normalizeUrl(project.demo)}
                className="h-10 px-4 text-xs"
                onClick={(event) => event.stopPropagation()}
              >
                Demo
                <ExternalLink className="h-4 w-4" />
              </SoftButton>
            ) : null}

            {page === "manage" ? (
              <SoftButton
                className="h-10 px-4 text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditProject(project);
                }}
              >
                Edit
                <ExternalLink className="h-4 w-4" />
              </SoftButton>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
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
  useInlineExpand = false,
  isExpanded = false,
  onToggleExpand,
}) {
  

  return (
    <AppCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-[#355872] dark:text-[#9CD5FF]" />

          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            Internships
          </h2>
        </div>

        {useInlineExpand ? (
          <PrimaryButton
            onClick={onToggleExpand}
            className="h-14 min-w-[150px] rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base shadow-none hover:from-[#263849] hover:to-[#6A9DBF]"
          >
            {isExpanded ? "Show Less" : "View All"}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            to="/internships"
            className="h-14 min-w-[150px] rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base shadow-none hover:from-[#263849] hover:to-[#6A9DBF]"
          >
            View All
          </PrimaryButton>
        )}
      </div>

      {internships.length > 0 ? (
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
                      <FolderKanban className="h-3.5 w-3.5" />
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
      ) : (
        <EmptyState
          title="No internships added yet."
          description="Internships will appear here once added to the portfolio."
        />
      )}
    </AppCard>
  );
}

function ProjectsGrid({
  title,
  projects,
  page,
  showViewAll = false,
  useInlineExpand = false,
  isExpanded = false,
  onToggleExpand,
  onOpenProject,
  onTogglePin,
  onEditProject,
  onDeleteRequest,
}) {
  return (
    <AppCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-[#355872] dark:text-[#9CD5FF]" />

          <h2 className="text-2xl font-black text-[color:var(--ink)]">
            {title}
          </h2>
        </div>

        {showViewAll ? (
          useInlineExpand ? (
            <PrimaryButton
              onClick={onToggleExpand}
              className="h-14 min-w-[150px] rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base shadow-none hover:from-[#263849] hover:to-[#6A9DBF]"
            >
              {isExpanded ? "Show Less" : "View All"}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              to="/view-all-projects"
              className="h-14 min-w-[150px] rounded-[1.35rem] bg-gradient-to-r from-[#2E4053] to-[#77A9CC] px-8 text-base shadow-none hover:from-[#263849] hover:to-[#6A9DBF]"
            >
              View All
            </PrimaryButton>
          )
        ) : null}
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
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
    <AlertDialog open={open} onOpenChange={(state) => !state && onCancel()}>
      <AlertDialogContent className="max-w-md rounded-[2rem] border border-[#355872]/18 bg-[#F7F8F0] px-8 py-7 text-[color:var(--ink)] shadow-[0_30px_80px_rgba(53,88,114,0.22)] dark:border-white/10 dark:bg-[#102030]">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-3xl font-black tracking-tight text-[color:var(--ink)]">
            Save portfolio changes?
          </AlertDialogTitle>

          <AlertDialogDescription className="pt-2 text-base font-semibold leading-7 text-[color:var(--muted)]">
            Save your portfolio updates and go to preview, discard this editing
            session, or cancel and keep editing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-5 h-px w-full bg-[#355872]/12 dark:bg-white/10" />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#355872]/16 bg-white px-5 font-black text-[color:var(--ink)] hover:bg-white/80 dark:border-white/10 dark:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 font-black text-red-600 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300"
          >
            Discard Changes
          </button>

          <button
            type="button"
            onClick={onSave}
            className={`inline-flex h-11 items-center justify-center rounded-full px-5 font-black ${primaryButton}`}
          >
            Save & Preview
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
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

  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllInternships, setShowAllInternships] = useState(false);

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
      return {
        ...viewedUser,
        ...profile,
        name: profile?.name || viewedUser?.name,
        role: profile?.role || viewedUser?.role,
        bio: profile?.bio || viewedUser?.bio,
        skills: profile?.skills || viewedUser?.skills || [],
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
    return filteredProjects.filter((project) => project.pinned);
  }, [filteredProjects]);

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

    return {
      total: publicProjects.length,
      pinnedCount: publicProjects.filter((project) => project.pinned).length,
      averageRating: average,
    };
  }, [publicProjects]);

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
    navigate(`/project?projectId=${project.id}`);
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
    navigate("/portfolio");
  };

  const handleDiscardChanges = () => {
    setDraftOverrides({});
    setDraftDeletedProjectIds([]);
    setShowSaveDialog(false);

    refreshPortfolioData();
    navigate("/portfolio");
  };

  const canManageProfile = page === "manage" && viewMode !== "public";

  return (
    <DashboardLayout>
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

      <div className="space-y-6">
        <PortfolioHeader
          page={page}
          viewMode={viewMode}
          viewedName={portfolioProfile?.name}
          onOpenSaveDialog={() => setShowSaveDialog(true)}
        />

        <PortfolioTopCard
          profile={portfolioProfile}
          stats={stats}
          page={page}
          canManageProfile={canManageProfile}
        />

        <PinnedProjectsCarousel
          projects={pinnedProjects}
          page={page}
          onOpenProject={handleOpenProject}
          onTogglePin={handleTogglePin}
          onEditProject={handleEditProject}
          onDeleteRequest={setProjectToDelete}
        />

        <ProjectsToolbar
          search={search}
          setSearch={setSearch}
          projectType={projectType}
          setProjectType={setProjectType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProjectsGrid
          title="All Public Projects"
          projects={viewMode === "public" && showAllProjects ? filteredProjects : filteredProjects.slice(0, 3)}
          showViewAll
          useInlineExpand={viewMode === "public"}
          isExpanded={showAllProjects}
          onToggleExpand={() =>
            setShowAllProjects((current) => !current)
          }
          page={page}
          onOpenProject={handleOpenProject}
          onTogglePin={handleTogglePin}
          onEditProject={handleEditProject}
          onDeleteRequest={setProjectToDelete}
        />
        <InternshipsGrid
          internships={
            viewMode === "public" && showAllInternships
              ? acceptedInternships
              : acceptedInternships.slice(0, 3)
          }
          useInlineExpand={viewMode === "public"}
          isExpanded={showAllInternships}
          onToggleExpand={() =>
            setShowAllInternships((current) => !current)
          }
        />
      </div>
    </DashboardLayout>
  );
}
