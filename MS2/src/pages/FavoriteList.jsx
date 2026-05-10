import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterPanel from "@/components/common/FilterPanel";
import FilterSelect from "@/components/common/FilterSelect";
import Pannelforportfolios from "@/components/ui/Searchcommons/Pannelforportfolios";
import PortfolioData from "@/data/portfoliosData";


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
  )

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

  return (
    <DashboardLayout>

      {/* MAIN */}
      <div className="min-h-screen p-8 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-[#16253A]">
            Favorite List
          </h1>

          <p className="mt-2 text-gray-600 font-medium">
            Your Favorite List from Portfolios and Projects
          </p>
        </div>

        {/* SEARCH + FILTERS */}
          

        {/* PROJECTS */}
        <Pannelforprojects
  projects={filteredProjects
    .filter((project) => project.favorite)
    .slice(0, 3)}
  view={view}
  toggleFavorite={toggleFavorite}
/>

<Pannelforportfolios
  portfolios={portfolios
    .filter((portfolio) => portfolio.favorite)
    .slice(0, 3)}
  view={view}
  toggleFavorite={togglePortfolioFavorite}
/>
      </div>
    </DashboardLayout>
  );
}