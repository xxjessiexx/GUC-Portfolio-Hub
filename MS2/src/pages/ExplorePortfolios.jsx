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

import { useState } from "react";

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

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-[#16253A]">
            Explore Portfolios
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Discover and get inspired by portfolios from talented GUC students across all majors and interests.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

          {/* LEFT */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredPortfolios.map((portfolio) => (
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
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            

            {/* FEATURED */}
            <AppCard
            className="
              p-6
              rounded-[28px]
              bg-white/65
              border border-gray-100
              shadow-sm
            "
          >
                
              <h3 className="text-xl font-black text-[#16253A]">
                Featured Students
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Outstanding portfolios to check out.
              </p>

              <div className="mt-6 space-y-4">

                {portfolios
  .filter(
    (portfolio) =>
      portfolio.projects >= 6
  )
  .slice(0, 3)
  .map((student) => (
                  <div
                    key={student.id}
                    className="
                      flex items-center justify-between
                      p-3
                      rounded-[20px]
                      bg-white
                      border border-gray-100
                      shadow-sm
                    "
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={student.image}
                        alt={student.name}
                        className="
                          w-12 h-12
                          rounded-full
                          object-cover
                        "
                      />

                      <div>
                        <h4 className="font-bold text-[#16253A]">
                          {student.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {student.major}
                        </p>
                      </div>
                      
                    </div>

                    <div
                        className="
                            px-4 py-2
                            rounded-full
                            bg-[#EEF5FF]
                            text-[#69A7FF]
                            text-sm
                            font-bold
                            whitespace-nowrap
                            flex items-center justify-center
                    "
                    >
                    {student.projects} Projects
                    </div>
                   
                  </div>
                ))}
              </div>

              <PrimaryActionButton
            onClick={() =>
              navigate("/featured-students")
            }
            text="View All Portfolios"
            className="
              mt-6
              w-full
              h-14
              rounded-2xl
              bg-[#284C7A]
              text-white
              font-bold
              flex items-center justify-center gap-2
              hover:bg-[#1E3C63]
              transition
            "
          >
            

            
          </PrimaryActionButton>
            </AppCard>

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