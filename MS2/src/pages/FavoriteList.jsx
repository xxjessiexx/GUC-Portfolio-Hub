import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterPanel from "@/components/common/FilterPanel";
import FilterSelect from "@/components/common/FilterSelect";
import Pannelforportfolios from "@/components/ui/Searchcommons/Pannelforportfolios";
import PortfolioData from "@/data/portfoliosData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FolderOpen, UserRound } from "lucide-react";

/* IMPORT DATA */
import ProjectNameData from "@/data/ProjectNameData";
import Pannelforprojects from "@/components/ui/Searchcommons/Pannelforprojects";
import {
  getAllProjects,
  getAllPortfolios,
  toggleFavoriteProject,
  toggleFavoritePortfolio,
} from "@/data/demoStore";

import {
  Search,
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import { useState } from "react";

export default function FavoriteList() {
 const [portfolios, setPortfolios] =
  useState(getAllPortfolios());
  /* STATE */
  const [projects, setProjects] =
  useState(getAllProjects());
  const [view, setView] = useState("grid");

  const [search, setSearch] = useState("");

  const [selectedCourse, setSelectedCourse] =
    useState("All Courses");

  const [selectedInstructor, setSelectedInstructor] =
    useState("All Instructors");

  const [selectedDate, setSelectedDate] =
    useState("Anytime");

  const [selectedSort, setSelectedSort] =
    useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  /* FAVORITES */
  const toggleFavorite = (id) => {
  toggleFavoriteProject(id);

  setProjects(getAllProjects());
};

  const togglePortfolioFavorite = (id) => {
  toggleFavoritePortfolio(id);

  setPortfolios(getAllPortfolios());
};

  /* FILTERS */
  const filteredProjects = projects
  .filter((project) => {

    const matchesSearch =
      project.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      project.tags?.some((tag) =>
        tag
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    const matchesCourse =
      selectedCourse === "All Courses" ||

      project.course === selectedCourse ||
      project.courseName === selectedCourse ||

      project.program === selectedCourse;

    const matchesInstructor =
      selectedInstructor === "All Instructors" ||
      project.instructor
  ?.toLowerCase()
  .includes(
    selectedInstructor.toLowerCase()
  );

    return (
      matchesSearch &&
      matchesCourse &&
      matchesInstructor
    );
  })

  .sort((a, b) => {

  /* NEWEST */
  if (selectedSort === "Newest") {
    return new Date(b.date) - new Date(a.date);
  }

  /* OLDEST */
  if (selectedSort === "Oldest") {
    return new Date(a.date) - new Date(b.date);
  }

  /* A-Z */
  if (selectedSort === "A-Z") {
    return a.title.localeCompare(b.title);
  }

  /* HIGHEST RATED */
  if (selectedSort === "Highest Rated") {
    return b.rating - a.rating;
  }

  return 0;
});
const navigate = useNavigate();
  return (
    <DashboardLayout>

      {/* MAIN */}
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Favorite List
          </h1>

          <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Your Favorite List from Portfolios and Projects
          </p>
        </div>

        {/* SEARCH + FILTERS */}
          

        {/* PROJECTS */}
        {filteredProjects.filter(
  (project) => project.favorite
).length > 0 ? (

  
  <Pannelforprojects
  projects={filteredProjects
    .filter((project) => project.favorite)
    .slice(0, 3)}
  view={view}
  toggleFavorite={toggleFavorite}
  hideViewMore={
    filteredProjects.filter(
      (project) => project.favorite
    ).length < 3
  }
/>

) : (

  <div
  className="
    flex items-center justify-center
    gap-6
    py-16
    rounded-[32px]

    bg-[var(--card-bg)]
    border border-dashed border-[var(--card-border)]

    shadow-[var(--shadow-card)]
    backdrop-blur-md
  "
>
  <div
    className="
      w-20 h-20
      rounded-full
      border border-[var(--border-blue)]
      bg-[var(--surface-soft)]

      flex items-center justify-center
    "
  >
    <FolderOpen
      size={25}
      className="text-[var(--primary)]"
    />
  </div>

  <div>
    <span
      onClick={() => navigate("/explore-projects")}
      className="
        cursor-pointer
        font-bold
        text-2xl
        text-[var(--primary)]
        hover:text-[var(--accent)]
      "
    >
      Explore more projects
    </span>

    <span
      className="
        ml-2
        text-2xl
        text-[var(--muted)]
      "
    >
      to add to your favorite list!
    </span>
  </div>
</div>

)}

{portfolios.filter(
  (portfolio) => portfolio.favorite
).length > 0 ? (

  
  <Pannelforportfolios
  portfolios={portfolios
    .filter((portfolio) => portfolio.favorite)
    .slice(0, 3)}
  view={view}
  toggleFavorite={togglePortfolioFavorite}
  hideViewMore={
    portfolios.filter(
      (portfolio) => portfolio.favorite
    ).length < 3
  }
/>

) : (

  <div
  className="
    flex items-center justify-center
    gap-6
    py-16
    rounded-[32px]

    bg-[var(--card-bg)]
    border border-dashed border-[var(--card-border)]

    shadow-[var(--shadow-card)]
    backdrop-blur-md
  "
>
  <div
    className="
      w-20 h-20
      rounded-full
      border border-[var(--border-blue)]
      bg-[var(--surface-soft)]

      flex items-center justify-center
    "
  >
    <UserRound
      size={20}
      className="text-[var(--primary)]"
    />
  </div>

  <div>
    <span
      onClick={() => navigate("/explore-projects")}
      className="
        cursor-pointer
        font-bold
        text-2xl
        text-[var(--primary)]
        hover:text-[var(--accent)]
      "
    >
      Explore more portfolios
    </span>

    <span
      className="
        ml-2
        text-2xl
        text-[var(--muted)]
      "
    >
      to add to your favorite list!
    </span>
  </div>
</div>

)}
      </div>
      </main>
    </DashboardLayout>
  );
}