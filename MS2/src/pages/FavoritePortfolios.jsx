import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import PortfolioCard from "@/components/ui/Searchcommons/PortfolioCard";

import {
  getAllPortfolios,
  toggleFavoritePortfolio,
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

export default function FavoritePortfolios() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const [portfolios, setPortfolios] = useState(() => getAllPortfolios());
  const [page, setPage] = useState(1);

  useEffect(() => {
    const refresh = () => setPortfolios(getAllPortfolios());

    window.addEventListener("demo-db-change", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("demo-db-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const favoritePortfolios = useMemo(
    () => portfolios.filter((portfolio) => portfolio.favorite),
    [portfolios]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(favoritePortfolios.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(page, totalPages);
  const pageStartIndex = (safePage - 1) * ITEMS_PER_PAGE;

  const visiblePortfolios = favoritePortfolios.slice(
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
    toggleFavoritePortfolio(id);
    setPortfolios(getAllPortfolios());
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px]">
        <PageHeader
          className="mb-10"
          title="Favorite Portfolios"
          description="Student portfolios you saved to revisit when evaluating people, skills, and project work."
        />

        <section ref={sectionRef} className="scroll-mt-28">
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
                    toggleFavorite={handleFavorite}
                    compactBadges
                  />
                ))}
              </div>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={favoritePortfolios.length}
                pageStartIndex={pageStartIndex}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={goToPage}
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
    </DashboardLayout>
  );
}
