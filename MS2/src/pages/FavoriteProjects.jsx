import DashboardLayout from "@/components/layout/DashboardLayout";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";

import Pannelforprojects from "@/components/ui/Searchcommons/Pannelforprojects";

import ProjectNameData from "@/data/ProjectNameData";

import { useState } from "react";

export default function FavoriteProjects() {

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

  const [filtersOpen, setFiltersOpen] =
    useState(false);

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
        
       <div className="[&_button]:hidden">    
        <Pannelforprojects
          projects={filteredProjects}
          view={view}
          toggleFavorite={toggleFavorite}
        />
        </div> 
      </div>
    </DashboardLayout>
  );
}