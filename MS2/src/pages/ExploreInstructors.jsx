
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
import InstructorCard from "@/components/ui/Searchcommons/InsctructorCard";
import CourseFilter from "@/components/Filters/CourseFilter";
import { useState } from "react";
import Pagination from "@/components/ui/Searchcommons/Pagination";
import { instructors } from "@/data/InstructorSearchdata";

export default function ExploreInstructors() {
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [search, setSearch] = useState("");
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

       {/* SEARCH BAR */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">

            <DiscoverSearchBar
                placeholder="Search by instructor name or course (e.g., Data Structures, AI, Algorithms)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <CourseFilter
                value={selectedCourse}
                onChange={setSelectedCourse}
                courses={[
                    "Data Structures",
                    "Algorithms",
                    "Operating Systems",
                    "Database Systems",
                    "Software Engineering",
                    "Machine Learning",
                    "Deep Learning",
                    "Artificial Intelligence",
                    "UI/UX"
                    ]}
                placeholder="All Courses"
             />
            </div>

        {/* INSTRUCTORS LIST */}
        <div className="space-y-4">
          {paginatedInstructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
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
    </DashboardLayout>
  );
}


