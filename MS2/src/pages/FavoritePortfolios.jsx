import DashboardLayout from "@/components/layout/DashboardLayout";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import Pannelforportfolios from "@/components/ui/Searchcommons/Pannelforportfolios";

import PortfolioData from "@/data/portfoliosData";

import { useState } from "react";
import {
  getAllPortfolios,
  toggleFavoritePortfolio,
} from "@/data/demoStore";
export default function FavoritePortfolios() {

  /* STATE */
  const [portfolios, setPortfolios] =
  useState(getAllPortfolios());

  const [view, setView] = useState("grid");

  const [search, setSearch] = useState("");

  const [selectedMajor, setSelectedMajor] =
    useState("All Majors");

  const [selectedSkill, setSelectedSkill] =
    useState("All Skills");

  const [selectedSort, setSelectedSort] =
    useState("Most Projects");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  /* FAVORITES */
  const toggleFavorite = (id) => {
  toggleFavoritePortfolio(id);

  setPortfolios(getAllPortfolios());
};

const majorOptions = [
  "Major: All Majors",

  ...Array.from(
    new Set(
      portfolios
        .map((portfolio) => portfolio.major)
        .filter(Boolean)
    )
  ).map((major) => `Major: ${major}`),
];

const skillOptions = [
  "Skill: All Skills",

  ...Array.from(
    new Set(
      portfolios.flatMap(
        (portfolio) =>
          portfolio.skills || []
      )
    )
  ).map((skill) => `Skill: ${skill}`),
];
  /* FILTERS */
  const filteredPortfolios = portfolios

    .filter((portfolio) => portfolio.favorite)

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

        portfolio.skills?.some((skill) =>
          skill
            .toLowerCase()
            .includes(search.toLowerCase())
        );

      const matchesMajor =
        selectedMajor === "All Majors" ||
        portfolio.major === selectedMajor;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        portfolio.skills?.includes(selectedSkill);

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

      <div className="min-h-screen p-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-[#16253A]">
            All your favorite portfolios
          </h1>

          <p className="mt-2 text-gray-600 font-medium">
            Browse all portfolios you liked.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <SearchFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by student name, email, skill..."

          showSort
          sortValue={`Sort by: ${selectedSort}`}
          onSortChange={(value) =>
            setSelectedSort(
              value.replace("Sort by: ", "")
            )
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

            options={majorOptions}
          />

          <FilterSelect
            value={`Skill: ${selectedSkill}`}
            onChange={(value) =>
              setSelectedSkill(
                value.replace("Skill: ", "")
              )
            }

            options={skillOptions}
          />
        </SearchFilterToolbar>

        {/* PORTFOLIOS */}
      <div className="[&_button]:hidden">
        <Pannelforportfolios
          portfolios={filteredPortfolios}
          view={view}
          toggleFavorite={toggleFavorite}
        />
      </div>
      </div>
    </DashboardLayout>
  );
}