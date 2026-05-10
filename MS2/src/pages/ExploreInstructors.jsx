
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

export default function ExploreInstructors() {
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedInstructor, setSelectedInstructor] =
    useState(null);
    const [filtersOpen, setFiltersOpen] =
  useState(false);
    const filteredInstructors = instructors.filter(
  (instructor) => {
    const matchesCourse =
      selectedCourse === "all" ||
      instructor.courses.some((course) =>
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
        .toLowerCase()
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
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <p className="uppercase tracking-[0.3em] text-xs font-black text-gray-400">
            Instructors
          </p>

          <h1 className="mt-2 text-5xl font-black text-[#16253A]">
            Find Instructors
          </h1>

          <p className="mt-3 text-gray-500 text-lg">
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
    options={[
      "Course: All Courses",
      "Course: Data Structures",
      "Course: Algorithms",
      "Course: Operating Systems",
      "Course: Database Systems",
      "Course: Software Engineering",
      "Course: Machine Learning",
      "Course: Deep Learning",
      "Course: Artificial Intelligence",
      "Course: UI/UX",
    ]}
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
    </DashboardLayout>
  );
}


