import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FolderOpen,
  GraduationCap,
  Heart,
  Star,
  UserRound,
  Users,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getAllPortfolios,
  getAllProjects,
  toggleFavoritePortfolio,
  toggleFavoriteProject,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 6;

const PROJECT_VISUAL_FALLBACKS = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200&auto=format&fit=crop",
];

function getStableIndex(value, length) {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash % length;
}

function getProjectVisual(project, duplicateImageCounts) {
  const image = project?.image || project?.thumbnail || "";
  const duplicateCount = image ? duplicateImageCounts.get(image) || 0 : 0;

  if (image && duplicateCount <= 1) {
    return image;
  }

  return PROJECT_VISUAL_FALLBACKS[
    getStableIndex(project?.id || project?.title, PROJECT_VISUAL_FALLBACKS.length)
  ];
}

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getProjectCourse(project) {
  const type = String(project?.type || "").toLowerCase();

  if (type.includes("bachelor") || type.includes("thesis")) {
    return "Bachelor Project";
  }

  return (
    project?.course ||
    project?.courseName ||
    project?.courseCode ||
    project?.program ||
    "Course Project"
  );
}

function getProjectTags(project) {
  const tags =
    project?.tags ||
    project?.technologies ||
    project?.skills ||
    [];

  return Array.isArray(tags) ? tags.filter(Boolean).slice(0, 3) : [];
}

function FavoriteHeart({ active = true, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="
        inline-flex h-10 w-10 shrink-0 items-center justify-center
        rounded-full
        border border-[var(--card-border)]
        bg-[var(--surface-elevated)]
        text-[var(--favorite-heart)]
        shadow-[var(--shadow-soft)]
        transition
        hover:-translate-y-0.5
        hover:border-[var(--primary)]
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-[#7AAACE]/20

        dark:border-white/10
        dark:bg-white/[0.07]
      "
    >
      <Heart
        className={`h-4.5 w-4.5 ${
          active
            ? "fill-[var(--favorite-heart)] text-[var(--favorite-heart)]"
            : "text-[var(--muted)]"
        }`}
      />
    </button>
  );
}

function FavoriteProjectCard({ project, image, onOpen, onRemove }) {
  const tags = getProjectTags(project);

  const open = () => onOpen(project);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-[24px]
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        shadow-[var(--shadow-soft)]
        transition
        duration-200
        hover:-translate-y-1
        hover:border-[var(--primary)]/35
        hover:shadow-[var(--shadow-lifted)]

        dark:border-white/10
        dark:bg-white/[0.055]
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="
            h-36 w-full object-cover
            transition duration-300
            group-hover:scale-[1.015]
          "
        />

        <div className="absolute right-4 top-4">
          <FavoriteHeart
            label={`Remove ${project.title} from favorites`}
            onClick={() => onRemove(project.id)}
          />
        </div>
      </div>

      <div className="flex min-h-[215px] flex-col p-4.5 sm:p-5">
        <p
          className="
            text-[10px] font-black uppercase tracking-[0.16em]
            text-[var(--primary)]
          "
        >
          {getProjectCourse(project)}
        </p>

        <h3
          className="
            mt-2 text-[20px] font-black leading-[1.15]
            tracking-[-0.025em]
            text-[var(--ink)]
            transition
            group-hover:text-[var(--primary)]
          "
        >
          {project.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-[13px] font-semibold text-[var(--muted)]">
          {project.instructor ? (
            <div className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{project.instructor}</span>
            </div>
          ) : null}

          {project.students ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>{project.students} students</span>
            </div>
          ) : null}
        </div>

        {tags.length ? (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="
                  text-[11px] font-black
                  text-[var(--primary)]
                "
              >
                {tag}
                {index < tags.length - 1 ? (
                  <span className="ml-3 text-[var(--gold)]">·</span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="
            mt-auto flex items-center justify-between gap-4
            border-t border-[var(--border-blue)]
            pt-3.5
            text-[12px] font-bold text-[var(--muted)]
          "
        >
          <span className="inline-flex items-center gap-1.5 text-[#B89736] dark:text-[var(--gold)]">
            <Star className="h-4 w-4" />
            {project.rating ?? "—"}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatDate(project.date || project.updatedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

function FavoritePortfolioCard({ portfolio, onOpen, onRemove }) {
  const skills = Array.isArray(portfolio.skills)
    ? portfolio.skills.filter(Boolean).slice(0, 3)
    : [];

  const open = () => onOpen(portfolio);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      className="
        group
        cursor-pointer
        rounded-[24px]
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        p-5
        shadow-[var(--shadow-soft)]
        transition
        duration-200
        hover:-translate-y-1
        hover:border-[var(--primary)]/35
        hover:shadow-[var(--shadow-lifted)]

        dark:border-white/10
        dark:bg-white/[0.055]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={portfolio.image}
            alt={portfolio.name}
            className="
              h-[72px] w-[72px] shrink-0 rounded-[20px]
              border border-[var(--card-border)]
              object-cover
              dark:border-white/10
            "
          />

          <div className="min-w-0">
            <p
              className="
                text-[10px] font-black uppercase tracking-[0.14em]
                text-[var(--primary)]
              "
            >
              Student portfolio
            </p>

            <h3
              className="
                mt-1 truncate
                text-[21px] font-black tracking-[-0.03em]
                text-[var(--ink)]
                transition
                group-hover:text-[var(--primary)]
              "
            >
              {portfolio.name}
            </h3>

            <p className="mt-1 text-[13px] font-semibold text-[var(--muted)]">
              {[portfolio.major, portfolio.level].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <FavoriteHeart
          label={`Remove ${portfolio.name} from favorites`}
          onClick={() => onRemove(portfolio.id)}
        />
      </div>

      {portfolio.bio ? (
        <p
          className="
            mt-4 line-clamp-2
            text-[13px] font-semibold leading-6
            text-[var(--muted)]
          "
        >
          {portfolio.bio}
        </p>
      ) : null}

      {skills.length ? (
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="text-[11px] font-black text-[var(--primary)]"
            >
              {skill}
              {index < skills.length - 1 ? (
                <span className="ml-3 text-[var(--gold)]">·</span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      <div
        className="
          mt-4 flex items-center justify-between
          border-t border-[var(--border-blue)]
          pt-4
          text-[12px] font-bold text-[var(--muted)]
        "
      >
        <span className="inline-flex items-center gap-1.5">
          <FolderOpen className="h-4 w-4" />
          {portfolio.projects ?? 0} projects
        </span>

        {Number(portfolio.projects || 0) >= 6 ? (
          <span
            className="
              text-[10px] font-black uppercase tracking-[0.12em]
              text-[#B89736] dark:text-[var(--gold)]
            "
          >
            Outstanding
          </span>
        ) : null}
      </div>
    </article>
  );
}

function EmptyCollection({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div
      className="
        flex min-h-[180px] items-center justify-center
        rounded-[24px]
        border border-dashed border-[var(--card-border)]
        bg-[var(--card-bg)]
        px-6 py-10
        text-center
        dark:border-white/10
        dark:bg-white/[0.035]
      "
    >
      <div>
        <div
          className="
            mx-auto grid h-12 w-12 place-items-center
            rounded-[16px]
            bg-[var(--surface-soft)]
            text-[var(--primary)]
            dark:bg-white/[0.06]
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-[18px] font-black text-[var(--ink)]">
          {title}
        </h3>

        <p
          className="
            mx-auto mt-2 max-w-md
            text-[13px] font-semibold leading-6
            text-[var(--muted)]
          "
        >
          {description}
        </p>

        <button
          type="button"
          onClick={onAction}
          className="
            mt-4 text-[13px] font-black text-[var(--primary)]
            transition hover:opacity-70
          "
        >
          {actionLabel} →
        </button>
      </div>
    </div>
  );
}

function CollectionPagination({
  currentPage,
  totalPages,
  totalItems,
  pageStartIndex,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis-start",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-start",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };

  return (
    <nav
      className="
        mt-5 flex flex-col gap-2.5
        border-t border-[var(--border-blue)]
        pt-4
        sm:flex-row sm:items-center sm:justify-between
      "
      aria-label="Favorites pagination"
    >
      <p className="text-[12px] font-semibold text-[var(--muted)]">
        Showing {pageStartIndex + 1}–
        {Math.min(pageStartIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            inline-flex h-9 items-center justify-center
            rounded-[11px]
            border border-[var(--card-border)]
            bg-[var(--card-bg)]
            px-3.5
            text-[11px] font-black
            text-[var(--primary)]
            transition
            hover:bg-[var(--surface-elevated)]
            disabled:cursor-not-allowed
            disabled:opacity-35

            dark:border-white/10
            dark:bg-white/[0.05]
          "
        >
          Previous
        </button>

        {getVisiblePages().map((page) => {
          if (typeof page === "string") {
            return (
              <span
                key={page}
                className="
                  inline-flex h-10 min-w-7 items-center justify-center
                  px-1 text-[12px] font-black text-[var(--muted)]
                "
              >
                …
              </span>
            );
          }

          const active = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={active ? "page" : undefined}
              className={`
                inline-flex h-10 min-w-9 items-center justify-center
                rounded-[11px] border px-2.5
                text-[11px] font-black transition
                ${
                  active
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)] dark:text-[#071521]"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--primary)] hover:bg-[var(--surface-elevated)] dark:border-white/10 dark:bg-white/[0.05]"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            inline-flex h-9 items-center justify-center
            rounded-[11px]
            border border-[var(--card-border)]
            bg-[var(--card-bg)]
            px-3.5
            text-[11px] font-black
            text-[var(--primary)]
            transition
            hover:bg-[var(--surface-elevated)]
            disabled:cursor-not-allowed
            disabled:opacity-35

            dark:border-white/10
            dark:bg-white/[0.05]
          "
        >
          Next
        </button>
      </div>
    </nav>
  );
}

function CollectionSection({
  eyebrow,
  title,
  count,
  children,
  empty,
  pagination,
  sectionRef,
}) {
  return (
    <section ref={sectionRef} className="scroll-mt-28">
      <div
        className="
          mb-5 flex max-w-[1180px] flex-col gap-2
          border-b border-[var(--border-blue)]
          pb-4
        "
      >
        <div>
          <p
            className="
              text-[10px] font-black uppercase tracking-[0.18em]
              text-[#B89736] dark:text-[var(--gold)]
            "
          >
            {eyebrow}
          </p>

          <div className="mt-1 flex items-center gap-3">
            <h2
              className="
                text-[26px] font-black tracking-[-0.03em]
                text-[var(--ink)]
              "
            >
              {title}
            </h2>

            <span
              className="
                inline-flex min-w-7 items-center justify-center
                rounded-full
                bg-[var(--surface-soft)]
                px-2 py-1
                text-[11px] font-black
                text-[var(--primary)]
                dark:bg-white/[0.06]
              "
            >
              {count}
            </span>
          </div>
        </div>
      </div>

      {count ? children : empty}
      {pagination}
    </section>
  );
}

export default function FavoriteList() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => getAllProjects());
  const [portfolios, setPortfolios] = useState(() => getAllPortfolios());

  const [projectPage, setProjectPage] = useState(1);
  const [portfolioPage, setPortfolioPage] = useState(1);

  const projectSectionRef = useRef(null);
  const portfolioSectionRef = useRef(null);

  useEffect(() => {
    const refresh = () => {
      setProjects(getAllProjects());
      setPortfolios(getAllPortfolios());
    };

    window.addEventListener("demo-db-change", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
    };
  }, []);

  const favoriteProjects = useMemo(
    () => projects.filter((project) => project.favorite),
    [projects]
  );

  const duplicateProjectImages = useMemo(() => {
    const counts = new Map();

    favoriteProjects.forEach((project) => {
      const image = project?.image || project?.thumbnail || "";
      if (!image) return;
      counts.set(image, (counts.get(image) || 0) + 1);
    });

    return counts;
  }, [favoriteProjects]);

  const favoritePortfolios = useMemo(
    () => portfolios.filter((portfolio) => portfolio.favorite),
    [portfolios]
  );

  const projectTotalPages = Math.max(
    1,
    Math.ceil(favoriteProjects.length / ITEMS_PER_PAGE)
  );

  const portfolioTotalPages = Math.max(
    1,
    Math.ceil(favoritePortfolios.length / ITEMS_PER_PAGE)
  );

  const safeProjectPage = Math.min(projectPage, projectTotalPages);
  const safePortfolioPage = Math.min(portfolioPage, portfolioTotalPages);

  const projectStartIndex = (safeProjectPage - 1) * ITEMS_PER_PAGE;
  const portfolioStartIndex = (safePortfolioPage - 1) * ITEMS_PER_PAGE;

  const visibleProjects = favoriteProjects.slice(
    projectStartIndex,
    projectStartIndex + ITEMS_PER_PAGE
  );

  const visiblePortfolios = favoritePortfolios.slice(
    portfolioStartIndex,
    portfolioStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (projectPage > projectTotalPages) {
      setProjectPage(projectTotalPages);
    }
  }, [projectPage, projectTotalPages]);

  useEffect(() => {
    if (portfolioPage > portfolioTotalPages) {
      setPortfolioPage(portfolioTotalPages);
    }
  }, [portfolioPage, portfolioTotalPages]);

  const goToProjectPage = (page) => {
    const next = Math.min(Math.max(page, 1), projectTotalPages);
    setProjectPage(next);

    requestAnimationFrame(() => {
      projectSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const goToPortfolioPage = (page) => {
    const next = Math.min(Math.max(page, 1), portfolioTotalPages);
    setPortfolioPage(next);

    requestAnimationFrame(() => {
      portfolioSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const removeProjectFavorite = (id) => {
    toggleFavoriteProject(id);
    setProjects(getAllProjects());
  };

  const removePortfolioFavorite = (id) => {
    toggleFavoritePortfolio(id);
    setPortfolios(getAllPortfolios());
  };

  const openProject = (project) => {
    navigate(`/project?projectId=${encodeURIComponent(project.id)}`);
  };

  const openPortfolio = (portfolio) => {
    navigate(`/public-portfolio?userId=${encodeURIComponent(portfolio.id)}`);
  };

  return (
    <DashboardLayout>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px]">
          <header className="mb-9">
            <div className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]" />

            <h1
              className="
                text-4xl font-black tracking-[-0.04em]
                text-[var(--ink)]
                sm:text-5xl
              "
            >
              Favorite List
            </h1>

            <p
              className="
                mt-3 max-w-2xl
                text-[15px] font-semibold leading-6
                text-[var(--muted)]
              "
            >
              A saved collection of projects and student portfolios you want to
              come back to.
            </p>
          </header>

          <div className="space-y-10">
            <CollectionSection
              sectionRef={projectSectionRef}
              eyebrow="Saved work"
              title="Favorite Projects"
              count={favoriteProjects.length}
              empty={
                <EmptyCollection
                  icon={FolderOpen}
                  title="No favorite projects yet"
                  description="Save projects from Explore Projects and they will appear here."
                  actionLabel="Explore projects"
                  onAction={() => navigate("/explore-projects")}
                />
              }
              pagination={
                <CollectionPagination
                  currentPage={safeProjectPage}
                  totalPages={projectTotalPages}
                  totalItems={favoriteProjects.length}
                  pageStartIndex={projectStartIndex}
                  onPageChange={goToProjectPage}
                />
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project) => (
                  <FavoriteProjectCard
                    key={project.id}
                    project={project}
                    image={getProjectVisual(project, duplicateProjectImages)}
                    onOpen={openProject}
                    onRemove={removeProjectFavorite}
                  />
                ))}
              </div>
            </CollectionSection>

            <CollectionSection
              sectionRef={portfolioSectionRef}
              eyebrow="Saved people"
              title="Favorite Portfolios"
              count={favoritePortfolios.length}
              empty={
                <EmptyCollection
                  icon={UserRound}
                  title="No favorite portfolios yet"
                  description="Save student portfolios while browsing and they will appear here."
                  actionLabel="Explore portfolios"
                  onAction={() => navigate("/explore-portfolio")}
                />
              }
              pagination={
                <CollectionPagination
                  currentPage={safePortfolioPage}
                  totalPages={portfolioTotalPages}
                  totalItems={favoritePortfolios.length}
                  pageStartIndex={portfolioStartIndex}
                  onPageChange={goToPortfolioPage}
                />
              }
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visiblePortfolios.map((portfolio) => (
                  <FavoritePortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onOpen={openPortfolio}
                    onRemove={removePortfolioFavorite}
                  />
                ))}
              </div>
            </CollectionSection>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
