import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, UserRound } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import PortfolioCard from "@/components/ui/Searchcommons/PortfolioCard";

import {
  getAllPortfolios,
  getAllProjects,
  toggleFavoritePortfolio,
  toggleFavoriteProject,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 8;

function EmptyCollection({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="
        flex min-h-[180px] items-center justify-center
        rounded-[24px]
        border border-dashed border-[var(--card-border)]
        bg-[var(--card-bg)]
        px-6 py-10 text-center
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
            mt-4 text-[13px] font-black
            text-[var(--primary)]
            transition hover:opacity-70
          "
        >
          {actionLabel} →
        </button>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageStartIndex,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : currentPage <= 4
      ? [1, 2, 3, 4, 5, "ellipsis-end", totalPages]
      : currentPage >= totalPages - 3
      ? [
          1,
          "ellipsis-start",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ]
      : [
          1,
          "ellipsis-start",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis-end",
          totalPages,
        ];

  return (
    <nav
      className="
        mt-6 flex flex-col gap-3
        border-t border-[#355872]/10
        pt-6
        sm:flex-row sm:items-center sm:justify-between
        dark:border-white/10
      "
      aria-label="Favorites pagination"
    >
      <p className="text-[12px] font-semibold text-[color:var(--muted)]">
        Showing {pageStartIndex + 1}–
        {Math.min(pageStartIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            inline-flex h-10 items-center justify-center
            rounded-[12px]
            border border-[#355872]/14
            bg-white/75
            px-4
            text-[12px] font-black text-[#355872]
            transition hover:bg-white
            disabled:cursor-not-allowed disabled:opacity-35

            dark:border-white/10
            dark:bg-white/[0.05]
            dark:text-[#9CD5FF]
          "
        >
          Previous
        </button>

        {pages.map((page) => {
          if (typeof page === "string") {
            return (
              <span
                key={page}
                className="
                  inline-flex h-10 min-w-8 items-center justify-center
                  px-1 text-[12px] font-black text-[#8A9AA4]
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
                inline-flex h-10 min-w-10 items-center justify-center
                rounded-[12px] border px-3
                text-[12px] font-black transition
                ${
                  active
                    ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)] dark:border-[#9CD5FF] dark:bg-[#9CD5FF] dark:text-[#071521]"
                    : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-[#9CD5FF]"
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
            inline-flex h-10 items-center justify-center
            rounded-[12px]
            border border-[#355872]/14
            bg-white/75
            px-4
            text-[12px] font-black text-[#355872]
            transition hover:bg-white
            disabled:cursor-not-allowed disabled:opacity-35

            dark:border-white/10
            dark:bg-white/[0.05]
            dark:text-[#9CD5FF]
          "
        >
          Next
        </button>
      </div>
    </nav>
  );
}

function CollectionHeader({ eyebrow, title, count }) {
  return (
    <div
      className="
        mb-6 max-w-[1180px]
        border-b border-[var(--border-blue)]
        pb-4
      "
    >
      <p
        className="
          text-[10px] font-black uppercase tracking-[0.18em]
          text-[#B89736]
          dark:text-[var(--gold)]
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
            text-[11px] font-black text-[var(--primary)]
            dark:bg-white/[0.06]
          "
        >
          {count}
        </span>
      </div>
    </div>
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
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const favoriteProjects = useMemo(
    () => projects.filter((project) => project.favorite),
    [projects]
  );

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
    setProjectPage(Math.min(Math.max(page, 1), projectTotalPages));

    requestAnimationFrame(() => {
      projectSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const goToPortfolioPage = (page) => {
    setPortfolioPage(Math.min(Math.max(page, 1), portfolioTotalPages));

    requestAnimationFrame(() => {
      portfolioSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleProjectFavorite = (id) => {
    toggleFavoriteProject(id);
    setProjects(getAllProjects());
  };

  const handlePortfolioFavorite = (id) => {
    toggleFavoritePortfolio(id);
    setPortfolios(getAllPortfolios());
  };

  return (
    <DashboardLayout>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px]">
          <header className="mb-10">
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

          <div className="space-y-12">
            <section ref={projectSectionRef} className="scroll-mt-28">
              <CollectionHeader
                eyebrow="Saved work"
                title="Favorite Projects"
                count={favoriteProjects.length}
              />

              {favoriteProjects.length ? (
                <>
                  <div
                    className="
                      grid grid-cols-1 gap-5
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                    "
                  >
                    {visibleProjects.map((project) => (
                      <ExploreProjectCard
                        key={project.id}
                        project={project}
                        view="grid"
                        toggleFavorite={handleProjectFavorite}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={safeProjectPage}
                    totalPages={projectTotalPages}
                    totalItems={favoriteProjects.length}
                    pageStartIndex={projectStartIndex}
                    onPageChange={goToProjectPage}
                  />
                </>
              ) : (
                <EmptyCollection
                  icon={FolderOpen}
                  title="No favorite projects yet"
                  description="Save projects from Explore Projects and they will appear here."
                  actionLabel="Explore projects"
                  onAction={() => navigate("/explore-projects")}
                />
              )}
            </section>

            <section ref={portfolioSectionRef} className="scroll-mt-28">
              <CollectionHeader
                eyebrow="Saved people"
                title="Favorite Portfolios"
                count={favoritePortfolios.length}
              />

              {favoritePortfolios.length ? (
                <>
                  <div
                    className="
                      grid grid-cols-1 gap-5
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >
                    {visiblePortfolios.map((portfolio) => (
                      <PortfolioCard
                        key={portfolio.id}
                        portfolio={portfolio}
                        toggleFavorite={handlePortfolioFavorite}
                        compactBadges
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={safePortfolioPage}
                    totalPages={portfolioTotalPages}
                    totalItems={favoritePortfolios.length}
                    pageStartIndex={portfolioStartIndex}
                    onPageChange={goToPortfolioPage}
                  />
                </>
              ) : (
                <EmptyCollection
                  icon={UserRound}
                  title="No favorite portfolios yet"
                  description="Save student portfolios while browsing and they will appear here."
                  actionLabel="Explore portfolios"
                  onAction={() => navigate("/explore-portfolio")}
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
