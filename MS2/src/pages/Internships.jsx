import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterSelect from "@/components/common/FilterSelect";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";

import {
  getApplicationsForStudent,
  getCollection,
  getCurrentUser,
  toggleSavedInternship,
} from "@/data/demoStore";

function getEmployerName(internship, users) {
  if (internship.company) return internship.company;
  if (internship.companyName) return internship.companyName;

  const employerId =
    internship.employerId || internship.companyId || internship.ownerId || "";
  const employer = users.find((user) => user.id === employerId);

  return employer?.companyName || employer?.name || "Unknown Company";
}

function formatPostedAt(value) {
  if (!value) return "Posted recently";
  if (String(value).toLowerCase().includes("ago")) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  return `Posted ${diffDays}d ago`;
}

function postedAge(value = "") {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function normalizeInternship(internship, users) {
  const skills =
    internship.skills ||
    internship.requiredSkills ||
    internship.tags ||
    internship.technologies ||
    [];

  const createdAt =
    internship.createdAt ||
    internship.postedDate ||
    internship.postedAt ||
    internship.updatedAt ||
    "";

  return {
    id: internship.id,
    title:
      internship.title || internship.role || internship.position || "Internship",
    company: getEmployerName(internship, users),
    location: internship.location || internship.workLocation || "Not specified",
    duration: internship.duration || internship.period || "Not specified",
    workMode: internship.workMode || internship.mode || internship.type || "On-site",
    department: internship.department || internship.field || "General",
    skills,
    featured: Boolean(internship.featured || internship.isFeatured),
    postedAt: formatPostedAt(createdAt),
    deadline:
      internship.deadline ||
      internship.applicationDeadline ||
      internship.closesAt ||
      "Not specified",
    rating: Number(internship.rating || internship.companyRating || 4.5),
    overview:
      internship.overview ||
      internship.description ||
      internship.summary ||
      "Get hands-on experience, contribute to real work, and learn with support from the team.",
  };
}

function getSavedInternshipIdsForCurrentUser() {
  const currentUser = getCurrentUser();
  if (!currentUser?.id) return [];

  const internships = getCollection("internships") || [];
  const bookmarks = getCollection("bookmarks") || [];

  const fromUser = [
    ...(currentUser.savedInternshipIds || []),
    ...(currentUser.bookmarkedInternshipIds || []),
    ...(currentUser.savedInternships || []),
  ];

  const fromBookmarks = bookmarks
    .filter((bookmark) => {
      const userId =
        bookmark.userId || bookmark.studentId || bookmark.ownerId || bookmark.createdBy;
      const type = String(
        bookmark.type || bookmark.itemType || bookmark.collection || ""
      ).toLowerCase();

      return (
        String(userId || "") === String(currentUser.id) &&
        (type === "internship" || bookmark.internshipId || bookmark.itemId)
      );
    })
    .map((bookmark) => bookmark.internshipId || bookmark.itemId);

  const fromInternships = internships
    .filter((internship) =>
      (internship.savedBy || internship.bookmarkedBy || [])
        .map(String)
        .includes(String(currentUser.id))
    )
    .map((internship) => internship.id);

  return [...new Set([...fromUser, ...fromBookmarks, ...fromInternships])].map(String);
}

export default function Internships() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All Work Modes");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Sort by: Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsTopRef = useRef(null);
  const ITEMS_PER_PAGE = 9;

  const [internships, setInternships] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);


  const refreshInternships = () => {
    const users = getCollection("users") || [];
    const storeInternships = getCollection("internships") || [];

    setInternships(
      storeInternships.map((internship) => normalizeInternship(internship, users))
    );
    setSavedIds(getSavedInternshipIdsForCurrentUser());
    setAppliedIds(
      (getApplicationsForStudent(currentUser?.id) || [])
        .map((application) => application.internshipId)
        .filter(Boolean)
        .map(String)
    );
  };

  useEffect(() => {
    refreshInternships();
  }, []);

  const appliedSet = useMemo(() => new Set(appliedIds), [appliedIds]);

  // Explore is for discovery. Once a student applies, that role belongs in My Applications.
  const availableInternships = useMemo(
    () => internships.filter((internship) => !appliedSet.has(String(internship.id))),
    [internships, appliedSet]
  );

  const companies = [
    "All Companies",
    ...new Set(availableInternships.map((item) => item.company)),
  ];
  const durations = [
    "All Durations",
    ...new Set(availableInternships.map((item) => item.duration)),
  ];
  const workModes = [
    "All Work Modes",
    ...new Set(availableInternships.map((item) => item.workMode)),
  ];

  const filteredInternships = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = availableInternships.filter((internship) => {
      const searchableText = [
        internship.title,
        internship.company,
        internship.location,
        internship.department,
        internship.workMode,
        internship.duration,
        internship.overview,
        ...internship.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesCompany =
        selectedCompany === "All Companies" || internship.company === selectedCompany;
      const matchesDuration =
        selectedDuration === "All Durations" || internship.duration === selectedDuration;
      const matchesWorkMode =
        selectedWorkMode === "All Work Modes" || internship.workMode === selectedWorkMode;
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Saved" && savedIds.includes(String(internship.id))) ||
        (selectedStatus === "Featured" && internship.featured);

      return (
        matchesSearch &&
        matchesCompany &&
        matchesDuration &&
        matchesWorkMode &&
        matchesStatus
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Sort by: Newest") return postedAge(a.postedAt) - postedAge(b.postedAt);
      if (sortBy === "Sort by: Oldest") return postedAge(b.postedAt) - postedAge(a.postedAt);
      if (sortBy === "Sort by: Deadline Soon") {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === "Sort by: Highest Rating") return b.rating - a.rating;
      if (sortBy === "Sort by: Company A-Z") return a.company.localeCompare(b.company);
      return 0;
    });
  }, [
    availableInternships,
    searchTerm,
    selectedCompany,
    selectedDuration,
    selectedWorkMode,
    selectedStatus,
    sortBy,
    savedIds,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInternships.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInternships = filteredInternships.slice(
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("All Companies");
    setSelectedDuration("All Durations");
    setSelectedWorkMode("All Work Modes");
    setSelectedStatus("All");
    setSortBy("Sort by: Newest");
    setCurrentPage(1);
  };

  const toggleSave = (event, internshipId) => {
    event.stopPropagation();
    toggleSavedInternship(internshipId);
    refreshInternships();
  };


  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1480px]">
        <PageHeader
          title="Discover Internships"
          description="Find open roles that match the work you want to try next. Roles you apply to move to My Applications automatically."
        />

          <SearchFilterToolbar
            className="mt-7"
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search roles, companies, skills, or locations..."
            showSort
            sortValue={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            sortOptions={[
              "Sort by: Newest",
              "Sort by: Oldest",
              "Sort by: Deadline Soon",
              "Sort by: Highest Rating",
              "Sort by: Company A-Z",
            ]}
            showFilters
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((current) => !current)}
            filterTitle="Filter internships"
            onClearFilters={clearFilters}
          >
            <FilterSelect
              value={`Company: ${selectedCompany}`}
              onChange={(value) => {
                setSelectedCompany(value.replace("Company: ", ""));
                setCurrentPage(1);
              }}
              options={companies.map((company) => `Company: ${company}`)}
            />
            <FilterSelect
              value={`Duration: ${selectedDuration}`}
              onChange={(value) => {
                setSelectedDuration(value.replace("Duration: ", ""));
                setCurrentPage(1);
              }}
              options={durations.map((duration) => `Duration: ${duration}`)}
            />
            <FilterSelect
              value={`Work Mode: ${selectedWorkMode}`}
              onChange={(value) => {
                setSelectedWorkMode(value.replace("Work Mode: ", ""));
                setCurrentPage(1);
              }}
              options={workModes.map((mode) => `Work Mode: ${mode}`)}
            />
            <FilterSelect
              value={`Status: ${selectedStatus}`}
              onChange={(value) => {
                setSelectedStatus(value.replace("Status: ", ""));
                setCurrentPage(1);
              }}
              options={["Status: All", "Status: Featured", "Status: Saved"]}
            />
          </SearchFilterToolbar>

          <section ref={resultsTopRef} className="mt-8 scroll-mt-28">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#B89736]">
                  Explore open roles
                </p>
                <h2 className="mt-1 text-[26px] font-black tracking-[-0.025em] text-[color:var(--ink)]">
                  {filteredInternships.length} opportunities
                </h2>
              </div>
              <p className="text-[12px] font-semibold text-[color:var(--muted)]">
                Applied roles are hidden from this page.
              </p>
            </div>

            {paginatedInternships.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedInternships.map((internship) => (
                  <InternshipSurface
                    key={internship.id}
                    internship={internship}
                    saved={savedIds.includes(String(internship.id))}
                    onOpen={() => navigate(`/internships/${internship.id}`)}
                    onSave={(event) => toggleSave(event, internship.id)}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredInternships.length}
              pageStartIndex={pageStartIndex}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={goToPage}
              ariaLabel="Internship results pagination"
            />
          </section>
        </div>
    </DashboardLayout>
  );
}

function InternshipSurface({ internship, saved, onOpen, onSave }) {
  return (
    <article
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className={`group relative min-h-[285px] cursor-pointer overflow-hidden rounded-[24px] border bg-[#FBFCFA] p-5 shadow-[0_16px_36px_rgba(53,88,114,0.09)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7AAACE]/20 hover:-translate-y-[2px] hover:shadow-[0_22px_46px_rgba(53,88,114,0.13)] sm:p-6 ${
        internship.featured
          ? "border-[#DDC98E]"
          : "border-[#C9DBE4]"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.11em] text-[#355872]">
              {internship.company}
            </p>
            {internship.featured ? (
              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#9A7620]">
                Featured
              </span>
            ) : null}
          </div>

          <h3 className="mt-2.5 text-[21px] font-black leading-[1.1] tracking-[-0.035em] text-[#183247] transition-colors group-hover:text-[#244D69]">
            {internship.title}
          </h3>
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove from saved internships" : "Save internship"}
          onClick={onSave}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] border border-[#355872]/12 bg-white text-[#355872] transition hover:border-[#7AAACE]/45 hover:bg-[#F5FAFC]"
        >
          <Bookmark className={`h-[18px] w-[18px] ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <p className="mt-3.5 line-clamp-3 text-[12.5px] font-semibold leading-5 text-[#647A89]">
        {internship.overview}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-[#DCE7ED] py-3 text-[11px] font-bold text-[#627887]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#456D87]" />
          {internship.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-[#456D87]" />
          {internship.workMode}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 text-[#456D87]" />
          {internship.duration}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {internship.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-black text-[#45657A] before:mr-2 before:text-[#B89736] before:content-['·'] first:before:hidden"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A9AA4]">
            <CalendarDays className="h-3.5 w-3.5" />
            {internship.postedAt}
          </p>
        </div>
      </div>

      <ArrowUpRight className="pointer-events-none absolute bottom-5 right-5 h-4 w-4 text-[#355872] opacity-0 transition-opacity group-hover:opacity-25 sm:bottom-6 sm:right-6" />
    </article>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="rounded-[26px] border border-[#C9DBE4] bg-[#FBFCFA] px-6 py-14 text-center shadow-[0_18px_42px_rgba(53,88,114,0.08)]">
      <p className="text-xl font-black tracking-[-0.02em] text-[#183247]">
        No open internships match these filters.
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[#708491]">
        Try widening the search. Roles you already applied to are intentionally kept in My Applications instead of Explore.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 h-10 rounded-[13px] border border-[#355872]/14 bg-white px-4 text-[11px] font-black text-[#355872] transition hover:bg-[#F5FAFC]"
      >
        Clear filters
      </button>
    </div>
  );
}
