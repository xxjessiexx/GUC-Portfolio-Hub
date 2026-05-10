import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterPanel from "@/components/common/FilterPanel";
import FilterSelect from "@/components/common/FilterSelect";

/* IMPORT DATA */
import ProjectNameData from "@/data/ProjectNameData";


import {
  Search,
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import { useState } from "react";

export default function ExploreProjects() {

  /* STATE */
  const [projects, setProjects] = useState(() => {
  const saved =
    localStorage.getItem("favoriteProjects");

  return saved
    ? JSON.parse(saved)
    : ProjectNameData;
});

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
  setProjects((prev) => {
    const updated = prev.map((project) =>
      project.id === id
        ? {
            ...project,
            favorite: !project.favorite,
          }
        : project
    );

    localStorage.setItem(
      "favoriteProjects",
      JSON.stringify(updated)
    );

    return updated;
  });
};

  /* FILTERS */
  const filteredProjects = projects
  .filter((project) => {

    const matchesSearch =
      project.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      project.tags.some((tag) =>
        tag
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    const matchesCourse =
      selectedCourse === "All Courses" ||

      project.course === selectedCourse ||

      project.program === selectedCourse;

    const matchesInstructor =
      selectedInstructor === "All Instructors" ||
      project.instructor === selectedInstructor;

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
            Explore Projects
          </h1>

          <p className="mt-2 text-gray-600 font-medium">
            Discover projects created by GUC students.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
          <SearchFilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search projects by title, keyword, or technology..."
            showSort
            sortValue={`Sort by: ${selectedSort}`}
            onSortChange={(value) =>
              setSelectedSort(value.replace("Sort by: ", ""))
            }
            sortOptions={[
              "Sort by: Newest",
              "Sort by: Oldest",
              "Sort by: Highest Rated",
              "Sort by: A-Z",
            ]}
            showFilters
            filtersOpen={filtersOpen}
            onToggleFilters={() =>
              setFiltersOpen((current) => !current)
            }
            filterTitle="Filter projects"
            onClearFilters={() => {
              setSelectedCourse("All Courses");
              setSelectedInstructor("All Instructors");
              setSelectedDate("Anytime");
            }}
          >
            <FilterSelect
              value={`Course: ${selectedCourse}`}
              onChange={(value) =>
                setSelectedCourse(
                  value.replace("Course: ", "")
                )
              }
              options={[
                "Course: All Courses",
                "Course: CSEN 501 - Software Engineering",
                "Course: CSEN 507 - Database Systems",
                "Course: CSEN 504 - Mobile Computing",
                "Course: Bachelor Project",
              ]}
            />

            <FilterSelect
              value={`Instructor: ${selectedInstructor}`}
              onChange={(value) =>
                setSelectedInstructor(
                  value.replace("Instructor: ", "")
                )
              }
              options={[
                "Instructor: All Instructors",
                "Instructor: Dr. Mostafa Ahmed",
                "Instructor: Dr. Hossam Ali",
                "Instructor: Dr. Sara Mahmoud",
                "Instructor: Dr. Amr Abdelsalam",
              ]}
            />

            <FilterSelect
              value={`Date: ${selectedDate}`}
              onChange={(value) =>
                setSelectedDate(
                  value.replace("Date: ", "")
                )
              }
              options={[
                "Date: Anytime",
                "Date: This Week",
                "Date: This Month",
              ]}
            />
          </SearchFilterToolbar>
        {/* TOP BAR */}
        <div className="flex items-center justify-between">

          <h2 className="font-bold text-[#16253A]">
            {filteredProjects.length} projects found
          </h2>

          {/* VIEW BUTTONS */}
          <div className="flex gap-2">

            <button
              onClick={() => setView("grid")}
              className={`p-3 rounded-xl border transition ${
                view === "grid"
                  ? "bg-[#2C4E80] text-white"
                  : "bg-white"
              }`}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-3 rounded-xl border transition ${
                view === "list"
                  ? "bg-[#2C4E80] text-white"
                  : "bg-white"
              }`}
            >
              <List size={18} />
            </button>

          </div>
        </div>

        {/* PROJECTS */}
        <div
          className={
            view === "grid"
              ? `
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-5
              `
              : "flex flex-col gap-5"
          }
        >

          {filteredProjects.map((project) => (
            <ExploreProjectCard
              key={project.id}
              project={project}
              view={view}
              toggleFavorite={toggleFavorite}
            />
          ))}

        </div>
      </div>
    </DashboardLayout>
  );
}