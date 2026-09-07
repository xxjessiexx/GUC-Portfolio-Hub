
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
    const ITEMS_PER_PAGE = 8;

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
       <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">

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
<div ref={resultsTopRef} className="flex scroll-mt-28 items-center justify-between">

  <h2 className="font-bold text-[var(--ink)]">
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

        {filteredInstructors.length > ITEMS_PER_PAGE ? (
          <nav
            className="mt-8 flex flex-col gap-3 border-t border-[#355872]/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Instructor results pagination"
          >
            <p className="text-[12px] font-semibold text-[color:var(--muted)]">
              Showing {pageStartIndex + 1}–
              {Math.min(
                pageStartIndex + ITEMS_PER_PAGE,
                filteredInstructors.length
              )} of {filteredInstructors.length}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Previous
              </button>

              {getVisiblePageNumbers().map((page) => {
                if (typeof page === "string") {
                  return (
                    <span
                      key={page}
                      className="inline-flex h-10 min-w-8 items-center justify-center px-1 text-[12px] font-black text-[#8A9AA4]"
                    >
                      …
                    </span>
                  );
                }

                const isActive = page === safeCurrentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] border px-3 text-[12px] font-black transition ${
                      isActive
                        ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)]"
                        : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </nav>
        ) : null}

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


