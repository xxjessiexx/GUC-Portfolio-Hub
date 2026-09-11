import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";

import {
  getAllProjects,
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

export default function FavoriteProjects() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [projects, setProjects] = useState(() => getAllProjects());
  const [page, setPage] = useState(1);

  useEffect(() => {
    const refresh = () => setProjects(getAllProjects());

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

  const totalPages = Math.max(
    1,
    Math.ceil(favoriteProjects.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(page, totalPages);
  const pageStartIndex = (safePage - 1) * ITEMS_PER_PAGE;

  const visibleProjects = favoriteProjects.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));

    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleFavorite = (id) => {
    toggleFavoriteProject(id);
    setProjects(getAllProjects());
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px]">
        <PageHeader
          className="mb-10"
          title="Favorite Projects"
          description="Projects you saved because you want to come back to the work, ideas, and technical execution."
        />

        <section ref={sectionRef} className="scroll-mt-28">
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
                    toggleFavorite={handleFavorite}
                  />
                ))}
              </div>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={favoriteProjects.length}
                pageStartIndex={pageStartIndex}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={goToPage}
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
      </div>
    </DashboardLayout>
  );
}
