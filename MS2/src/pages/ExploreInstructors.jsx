
import {
  Search,
  Filter,
  Mail,
  MapPin,
  Eye,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import DiscoverSearchBar from "@/components/ui/Searchcommons/DiscoverSearchBar";
import CourseBadge from "@/components/ui/CourseBadge";
import PrimaryActionButton from "@/components/ui/Searchcommons/PrimaryActionButton";
import {SectionHeader} from "@/components/ui/SectionHeader";
import InstructorCard from "@/components/ui/Searchcommons/InsctructorCard";;
import { useState } from "react";
import Pagination from "@/components/ui/Searchcommons/Pagination";
import { instructors } from "@/data/InstructorSearchdata";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import ViewInstructor from "@/pages/ViewInstructor";
import { getAllInstructors } from "@/data/demoStore";

export default function ExploreInstructors() {
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [search, setSearch] = useState("");
    const [instructors, setInstructors] =
  useState(getAllInstructors());
    const [selectedInstructor, setSelectedInstructor] =
    useState(null);
    const [filtersOpen, setFiltersOpen] =
  useState(false);

  const courseOptions = [
  "Course: All Courses",

  ...Array.from(
    new Set(
      instructors.flatMap(
        (instructor) =>
          instructor.courses || []
      )
    )
  ).map(
    (course) => `Course: ${course}`
  ),
];

    const filteredInstructors = instructors.filter(
  (instructor) => {
    const matchesCourse =
      selectedCourse === "all" ||
      instructor.courses?.some((course) =>
        course
          .toLowerCase()
          .includes(selectedCourse.toLowerCase())
      );

    // CLEAN SEARCH
    const normalizedSearch = search
      .toLowerCase()
      .replace("dr.", "")
      .replace("dr", "")
      .trim();

    const normalizedName = instructor.name
      .toLowerCase()
      .replace("dr.", "")
      .replace("dr", "")
      .trim();

    const matchesSearch =
      normalizedName.includes(normalizedSearch) ||

      instructor.department
  ?.toLowerCase()
        .includes(normalizedSearch) ||

      instructor.courses.some((course) =>
        course
          .toLowerCase()
          .includes(normalizedSearch)
      );

    return matchesCourse && matchesSearch;
  }
);
    const [currentPage, setCurrentPage] = useState(1);
    const instructorsPerPage = 4;

const startIndex =
  (currentPage - 1) * instructorsPerPage;

const paginatedInstructors =
  filteredInstructors.slice(
    startIndex,
    startIndex + instructorsPerPage
  );

const totalPages = Math.ceil(
  filteredInstructors.length /
    instructorsPerPage
);
  return (
    <DashboardLayout>
       <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
           <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Find Instructors
          </h1>

           <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
            Connect with expert instructors across the GUC community and explore their courses and specialties.
          </p>
        </div>

       {/* SEARCH + FILTERS */}
<SearchFilterToolbar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search by instructor name or course..."

  showFilters
  filtersOpen={filtersOpen}
  onToggleFilters={() =>
    setFiltersOpen((current) => !current)
  }

  filterTitle="Filter instructors"

  onClearFilters={() => {
    setSelectedCourse("all");
  }}
>
  <FilterSelect
    value={
      selectedCourse === "all"
        ? "Course: All Courses"
        : `Course: ${selectedCourse}`
    }
    onChange={(value) => {
      const cleanedValue = value.replace(
        "Course: ",
        ""
      );

      setSelectedCourse(
        cleanedValue === "All Courses"
          ? "all"
          : cleanedValue
      );
    }}
    options={courseOptions}
  />
</SearchFilterToolbar>

{/* TOP BAR */}
<div className="flex items-center justify-between">

  <h2 className="font-bold text-[#16253A]">
    {filteredInstructors.length} instructors found
  </h2>

</div>
        {/* INSTRUCTORS LIST */}
        <div className="space-y-4">
          {paginatedInstructors.map((instructor) => (
            <InstructorCard
  key={instructor.id}
  instructor={instructor}
  onView={() =>
    setSelectedInstructor(instructor)
  }
/>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-2">
  
            <p className="text-sm text-gray-500 font-medium">
                Showing 1 to 4 of {filteredInstructors.length} instructors
            </p>
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>
      </div>
      {selectedInstructor && (
  <ViewInstructor
    instructor={selectedInstructor}
    onClose={() =>
      setSelectedInstructor(null)
    }
  />
)}  
</main>
    </DashboardLayout>
  );
}


