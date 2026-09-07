// src/pages/ExplorePortfolios.jsx

import DashboardLayout from "@/components/layout/DashboardLayout";

import DiscoverSearchBar from "@/components/ui/Searchcommons/DiscoverSearchBar";
import CourseBadge from "@/components/ui/CourseBadge";
import PortfolioCard from "@/components/ui/Searchcommons/PortfolioCard";
import InsightRow from "@/components/ui/Searchcommons/InsightRow";
import {AppCard} from "@/components/ui/AppCard";
import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import FavoriteButton from "@/components/ui/Searchcommons/FavoriteButton";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import { useLocation } from "react-router-dom";
import { useNavigate }
from "react-router-dom";

import {
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import portfoliosData from "@/data/portfoliosData";

import {
  getAllPortfolios,
  toggleFavoritePortfolio,
} from "@/data/demoStore";




export default function ExplorePortfolios({showReport = false}) {
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] =
  useState(false);

const [selectedPortfolio, setSelectedPortfolio] =
  useState(null);

const ITEMS_PER_PAGE = 8;
const resultsTopRef = useRef(null);

const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMajor, setSelectedMajor] =
    useState("All Majors");

  const [selectedSkill, setSelectedSkill] =
    useState("All Skills");

  const [selectedSort, setSelectedSort] =
    useState("Most Projects");
    const [filtersOpen, setFiltersOpen] =
  useState(false);

    
    const [portfolios, setPortfolios] =
  useState(getAllPortfolios());

  const toggleFavorite = (id) => {
  toggleFavoritePortfolio(id);

  setPortfolios(getAllPortfolios());
};

  /* FILTERING */
  const filteredPortfolios = portfolios
    .filter((portfolio) => {

      const matchesSearch =
        portfolio.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

          portfolio.email
    .toLowerCase()
    .includes(search.toLowerCase()) ||

        portfolio.bio
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        portfolio.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(search.toLowerCase())

            
        );

      const matchesMajor =
        selectedMajor === "All Majors" ||
        portfolio.major === selectedMajor;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        portfolio.skills.includes(selectedSkill);


      return (
        matchesSearch &&
        matchesMajor &&
        matchesSkill
      );
    })

    .sort((a, b) => {

      if (selectedSort === "Most Projects") {
        return b.projects - a.projects;
      }

      if (selectedSort === "A-Z") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });


  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedMajor, selectedSkill, selectedSort]);


  const totalPages = Math.max(
    1,
    Math.ceil(filteredPortfolios.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPortfolios = filteredPortfolios.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      resultsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const getVisiblePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
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
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };


  return (
    <DashboardLayout>

      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">

        {/* HEADER */}
        <div>
           <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Explore Portfolios
          </h1>

           <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Discover and get inspired by portfolios from talented GUC students across all majors and interests.
          </p>
        </div>

        <div className="space-y-5">

            {/* SEARCH + FILTERS */}
<SearchFilterToolbar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search by student name, email, skill..."

  showSort
  sortValue={`Sort by: ${selectedSort}`}
  onSortChange={(value) =>
    setSelectedSort(value.replace("Sort by: ", ""))
  }
  sortOptions={[
    "Sort by: Most Projects",
    "Sort by: A-Z",
  ]}

  showFilters
  filtersOpen={filtersOpen}
  onToggleFilters={() =>
    setFiltersOpen((current) => !current)
  }

  filterTitle="Filter portfolios"

  onClearFilters={() => {
    setSelectedMajor("All Majors");
    setSelectedSkill("All Skills");
  }}
>
  <FilterSelect
  value={`Major: ${selectedMajor}`}
  onChange={(value) =>
    setSelectedMajor(
      value.replace("Major: ", "")
    )
  }

  options={[
    "Major: All Majors",

    ...Array.from(
      new Set(
        portfolios
          .map((portfolio) =>
            portfolio.major
          )
          .filter(Boolean)
      )
    ).map(
      (major) => `Major: ${major}`
    ),
  ]}
/>

  <FilterSelect
  value={`Skill: ${selectedSkill}`}
  onChange={(value) =>
    setSelectedSkill(
      value.replace("Skill: ", "")
    )
  }

  options={[
    "Skill: All Skills",

    ...Array.from(
      new Set(
        portfolios.flatMap(
          (portfolio) =>
            portfolio.skills || []
        )
      )
    ).map(
      (skill) => `Skill: ${skill}`
    ),
  ]}
/>
</SearchFilterToolbar>



            {/* PORTFOLIOS */}
            {/* PORTFOLIOS */}
<div ref={resultsTopRef} className="grid scroll-mt-28 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

  {paginatedPortfolios.map((portfolio) => (
    <PortfolioCard
      key={portfolio.id}
      portfolio={portfolio}
      toggleFavorite={toggleFavorite}
      showReport={showReport}
      onReport={(portfolio) => {
        setSelectedPortfolio(portfolio);
        setReportOpen(true);
      }}
    />
  ))}

</div>


        {filteredPortfolios.length > ITEMS_PER_PAGE ? (
          <nav
            className="mt-8 flex flex-col gap-3 border-t border-[#355872]/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Portfolio results pagination"
          >
            <p className="text-[12px] font-semibold text-[color:var(--muted)]">
              Showing {pageStartIndex + 1}–
              {Math.min(
                pageStartIndex + ITEMS_PER_PAGE,
                filteredPortfolios.length
              )} of {filteredPortfolios.length}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Previous
              </button>

              {getVisiblePageNumbers().map((page) => {
                if (typeof page === "string") {
                  return (
                    <span
                      key={page}
                      className="inline-flex h-10 min-w-8 items-center justify-center px-1 text-[12px] font-black text-[#8A9AA4]"
                    >
                      …
                    </span>
                  );
                }

                const isActive = page === safeCurrentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] border px-3 text-[12px] font-black transition ${
                      isActive
                        ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)]"
                        : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </nav>
        ) : null}

        

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            

            {/* FEATURED */}
            
            



          </div>
        </div>
        {reportOpen && (
        <AppModal
          title="Report Portfolio"
          onClose={() => setReportOpen(false)}
        >
          <p className="text-gray-600">
            Report {selectedPortfolio?.name}?
          </p>
        </AppModal>
      )}
      </div>
      </main>
    </DashboardLayout>
  );
}