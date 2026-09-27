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
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import FilterSelect from "@/components/common/FilterSelect";
import { useLocation } from "react-router-dom";
import { useNavigate }
from "react-router-dom";

import { 
  FolderOpen, 
  Sparkles, 
  ArrowRight,
  FolderSearch,
  RotateCcw,
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
    useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
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

const skillOptions = [
  ...new Set(
    portfolios.flatMap(
      (portfolio) => portfolio.skills || []
    )
  ),
];

const majorOptions = [
  ...new Set(
    portfolios
      .map((portfolio) => portfolio.major)
      .filter(Boolean)
  ),
];

const clearFilters = () => {
  setSearch("");
  setSelectedMajor([]);
  setSelectedSkills([]);
  setCurrentPage(1);
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
  selectedMajor.length === 0 ||
  selectedMajor.includes(portfolio.major);

     const matchesSkill =
  selectedSkills.length === 0 ||
  selectedSkills.some((skill) =>
    portfolio.skills?.some(
      (portfolioSkill) =>
        portfolioSkill.toLowerCase() === skill.toLowerCase()
    )
  );

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
}, [search, selectedMajor, selectedSkills, selectedSort]);


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

      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="Explore Portfolios"
          description="Discover and get inspired by portfolios from talented GUC students across all majors and interests."
        />

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

  onClearFilters={clearFilters}
>
  <FilterSelect
  multiple
  value={selectedMajor}
  onChange={(values) => {
    setSelectedMajor(values);
    setCurrentPage(1);
  }}
  options={majorOptions}
  placeholder="Major"
/>

  <FilterSelect
  multiple
  value={selectedSkills}
  onChange={(values) => {
    setSelectedSkills(values);
    setCurrentPage(1);
  }}
  options={skillOptions}
  placeholder="Tech Stack"
/>
</SearchFilterToolbar>



            {/* PORTFOLIOS */}
            {/* PORTFOLIOS / EMPTY STATE */}
<div ref={resultsTopRef} className="scroll-mt-28">

  {filteredPortfolios.length === 0 ? (
    <div
      className="
        relative
        flex min-h-[420px]
        items-center justify-center
        overflow-hidden
        rounded-[32px]
      "
    >
      {/* Decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          h-[300px] w-[300px]
          rounded-full
          bg-[#9CD5FF]/15
          blur-[70px]
        "
      />

      <div
        className="
          relative z-10
          flex max-w-[560px]
          flex-col items-center
          text-center
        "
      >
        {/* Illustration */}
        <div className="relative mb-6">

          <div
            className="
              absolute left-1/2 top-1/2
              h-36 w-36
              -translate-x-1/2 -translate-y-1/2
              rounded-full
              bg-[#9CD5FF]/15
            "
          />

          <div
            className="
              absolute left-1/2 top-1/2
              h-24 w-24
              -translate-x-1/2 -translate-y-1/2
              rounded-full
              bg-[#7AAACE]/10
            "
          />

          <div
            className="
              relative
              flex h-24 w-24
              items-center justify-center
              rounded-[28px]
              border border-[#7AAACE]/25
              bg-white/55
              shadow-[0_18px_45px_rgba(53,88,114,0.12)]
              backdrop-blur-xl

              dark:border-white/10
              dark:bg-white/[0.05]
            "
          >
            <FolderSearch
              size={45}
              strokeWidth={1.7}
              className="
                text-[#7AAACE]
                dark:text-[#8FC5E8]
              "
            />
          </div>

          {/* Decorative details */}
          <span
            className="
              absolute -left-8 top-4
              h-2.5 w-2.5
              rounded-full
              bg-[#7AAACE]/70
            "
          />

          <span
            className="
              absolute -right-8 bottom-5
              h-2 w-2
              rotate-45
              bg-[#C49A2C]/80
            "
          />
        </div>

        <h3
          className="
            text-[26px]
            font-black
            tracking-[-0.03em]
            text-[var(--ink)]
          "
        >
          No portfolios found
        </h3>

        <p
          className="
            mt-2
            max-w-[470px]
            text-[15px]
            font-medium
            leading-6
            text-[var(--muted)]
          "
        >
          We couldn't find any portfolios matching your search or filters.
          Try adjusting your keywords or filters to discover more students.
        </p>

        <button
          type="button"
          onClick={clearFilters}
          className="
            mt-6
            inline-flex
            items-center
            gap-2

            rounded-2xl
            border border-[#7AAACE]/35
            bg-[#9CD5FF]/15

            px-5 py-3

            text-sm
            font-black
            text-[#355872]

            shadow-[0_8px_24px_rgba(53,88,114,0.08)]

            transition-all
            duration-200

            hover:-translate-y-0.5
            hover:border-[#7AAACE]/60
            hover:bg-[#9CD5FF]/25
            hover:shadow-[0_12px_30px_rgba(53,88,114,0.12)]

            dark:border-[#7AAACE]/25
            dark:bg-[#7AAACE]/10
            dark:text-[#8FC5E8]
          "
        >
          <RotateCcw size={16} strokeWidth={2.4} />
          Clear all filters
        </button>
      </div>
    </div>
  ) : (
    <>
      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
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

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={filteredPortfolios.length}
        pageStartIndex={pageStartIndex}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={goToPage}
        ariaLabel="Portfolio results pagination"
      />
    </>
  )}

</div>

        

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
    </DashboardLayout>
  );
}