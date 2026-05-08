import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import ExploreProjectCard from "@/components/ui/Searchcommons/ExploreProjectCard";

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
  const [projects, setProjects] = useState(ProjectNameData);

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

  /* FAVORITES */
  const toggleFavorite = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              favorite: !project.favorite,
            }
          : project
      )
    );
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
        <AppCard
          className="
            p-4
            rounded-3xl
            bg-white/65
            backdrop-blur-md
            border border-white/40
            shadow-sm
          "
        >

          {/* SEARCH */}
          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search projects by title, keyword, or technology..."
              className="
                w-full
                rounded-2xl
                border border-gray-100
                py-3
                pl-12
                pr-4
                outline-none
                bg-white/80
              "
            />
          </div>

          {/* FILTERS */}
          <div className="mt-4 flex flex-wrap items-center gap-3">

            {/* COURSES */}
            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              className="
                px-4 py-3
                rounded-2xl
                border border-gray-100
                bg-white
                text-sm
                font-medium
              "
            >
              <option>All Courses</option>

              <option>
                CSEN 501 - Software Engineering
              </option>

              <option>
                CSEN 507 - Database Systems
              </option>

              <option>
                CSEN 504 - Mobile Computing
              </option>
              <option>
                Bachelor Project
              </option>

            </select>
            
            {/* INSTRUCTORS */}
            <select
              value={selectedInstructor}
              onChange={(e) =>
                setSelectedInstructor(e.target.value)
              }
              className="
                px-4 py-3
                rounded-2xl
                border border-gray-100
                bg-white
                text-sm
                font-medium
              "
            >
              <option>All Instructors</option>

              <option>
                Dr. Mostafa Ahmed
              </option>

              <option>
                Dr. Hossam Ali
              </option>

              <option>
                Dr. Sara Mahmoud
              </option>

              <option>
                Dr. Amr Abdelsalam
              </option>
            </select>

            {/* DATE */}
            <select
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="
                px-4 py-3
                rounded-2xl
                border border-gray-100
                bg-white
                text-sm
                font-medium
              "
            >
              <option>Anytime</option>

              <option>This Week</option>

              <option>This Month</option>
            </select>

            {/* SORT */}
            <select
              value={selectedSort}
              onChange={(e) =>
                setSelectedSort(e.target.value)
              }
              className="
                px-4 py-3
                rounded-2xl
                border border-gray-100
                bg-white
                text-sm
                font-medium
              "
            >
              <option>Newest</option>

              <option>Highest Rated</option>

              <option>A-Z</option>
            </select>

            {/* FILTER BUTTON */}
            <button
              className="
                ml-auto
                flex items-center gap-2
                px-5 py-3
                rounded-2xl
                border border-gray-100
                bg-white
                font-semibold
                text-gray-600
                hover:bg-gray-50
                transition
              "
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </AppCard>

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