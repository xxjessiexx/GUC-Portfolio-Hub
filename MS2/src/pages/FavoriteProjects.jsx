import DashboardLayout from "@/components/layout/DashboardLayout";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import Pannelforprojects from "@/components/ui/Searchcommons/Pannelforprojects";

import ProjectNameData from "@/data/ProjectNameData";

import { useState } from "react";
import {
  getAllProjects,
  toggleFavoriteProject,
} from "@/data/demoStore";

export default function FavoriteProjects() {

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

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const toggleFavorite = (id) => {
  toggleFavoriteProject(id);

  setProjects(getAllProjects());
};

const courseOptions = [
  "Course: All Courses",

  ...Array.from(
    new Set(
      projects
        .map(
          (project) =>
            project.course ||
            project.courseName
        )
        .filter(Boolean)
    )
  ).map(
    (course) => `Course: ${course}`
  ),
];

const instructorOptions = [
  "Instructor: All Instructors",

  ...Array.from(
    new Set(
      projects
        .map(
          (project) =>
            project.instructor
        )
        .filter(Boolean)
    )
  ).map(
    (instructor) =>
      `Instructor: ${instructor}`
  ),
];

  const filteredProjects = projects

    .filter((project) => project.favorite)

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

        project.courseName ===
          selectedCourse ||

        project.program ===
          selectedCourse

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

      if (selectedSort === "Newest") {
        return new Date(b.date) - new Date(a.date);
      }

      if (selectedSort === "Oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (selectedSort === "A-Z") {
        return a.title.localeCompare(b.title);
      }

      if (selectedSort === "Highest Rated") {
        return b.rating - a.rating;
      }

      return 0;
    });

  return (
    <DashboardLayout>

      <div className="min-h-screen p-8 space-y-6">

        <div>
          <h1 className="text-4xl font-black text-[#16253A]">
            Favorite Projects
          </h1>

          <p className="mt-2 text-gray-600 font-medium">
            Browse all projects you liked.
          </p>
        </div>

        <SearchFilterToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search projects by title, keyword, or technology..."

          showSort
          sortValue={`Sort by: ${selectedSort}`}

          onSortChange={(value) =>
            setSelectedSort(
              value.replace("Sort by: ", "")
            )
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

            options={courseOptions}
          />

          <FilterSelect
            value={`Instructor: ${selectedInstructor}`}
            onChange={(value) =>
              setSelectedInstructor(
                value.replace("Instructor: ", "")
              )
            }

            options={instructorOptions}
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
        
       {filteredProjects.length > 0 ? (

  <Pannelforprojects
  projects={filteredProjects}
  view={view}
  toggleFavorite={toggleFavorite}
  hideViewMore={
    filteredProjects.length < 3
  }
/>

) : (

  <div
    className="
      flex items-center justify-center
      py-24
      rounded-[32px]
      border border-dashed border-gray-200
      bg-white/60
    "
  >
    <p
      className="
        text-xl
        font-semibold
        text-gray-400
        text-center
      "
    >
      Explore more projects to add to your
      favorite list 
    </p>
  </div>

)}
      </div>
    </DashboardLayout>
  );
}