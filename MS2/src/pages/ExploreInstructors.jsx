
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
import { useEffect, useRef, useState } from "react";
import { instructors } from "@/data/InstructorSearchdata";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
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
    const resultsTopRef = useRef(null);
    const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCourse]);


  const totalPages = Math.max(
    1,
    Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInstructors = filteredInstructors.slice(
    pageStartIndex,
    pageStartIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);

    requestAnimationFrame(() => {
      resultsTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const getVisiblePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis-start",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-start",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis-end",
      totalPages,
    ];
  };


  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="Find Instructors"
          description="Connect with expert instructors across the GUC community and explore their courses and specialties."
        />

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
<div ref={resultsTopRef} className="flex scroll-mt-28 items-center justify-between">

  <h2 className="font-bold text-[var(--ink)]">
    {filteredInstructors.length} instructors found
  </h2>

</div>
        {/* INSTRUCTORS LIST */}
        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={filteredInstructors.length}
          pageStartIndex={pageStartIndex}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={goToPage}
          ariaLabel="Instructor results pagination"
        />

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


