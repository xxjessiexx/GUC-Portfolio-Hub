import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  CalendarDays,
  Clock,
  Eye,
  Grid2X2,
  List,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";

import AppModal from "@/components/common/AppModal";
import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";

import {
  getCurrentUser,
  getCollection,
  applyToInternship,
  toggleSavedInternship,
} from "@/data/demoStore";

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  return [];
}

function getEmployerName(internship, users) {
  if (internship.company) return internship.company;
  if (internship.companyName) return internship.companyName;

  const employerId =
    internship.employerId || internship.companyId || internship.ownerId || "";

  const employer = users.find((user) => user.id === employerId);

  return employer?.companyName || employer?.name || "Unknown Company";
}

function getPostedNumber(postedAt = "") {
  const match = String(postedAt).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function formatPostedAt(value) {
  if (!value) return "Posted recently";

  if (String(value).toLowerCase().includes("ago")) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";

  return `${diffDays} days ago`;
}

function normalizeInternship(internship, users) {
  const skills =
    internship.skills ||
    internship.requiredSkills ||
    internship.tags ||
    internship.technologies ||
    [];

  const responsibilities =
    internship.responsibilities ||
    internship.tasks ||
    internship.duties ||
    [
      "Contribute to team projects and product features.",
      "Collaborate with mentors and teammates.",
      "Document progress and communicate clearly.",
    ];

  const requirements =
    internship.requirements ||
    internship.qualifications ||
    [
      "Strong interest in the internship field.",
      "Good communication and teamwork skills.",
      "Ability to learn and work independently.",
    ];

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
      "2026-06-30",
    rating: Number(internship.rating || internship.companyRating || 4.5),
    overview:
      internship.overview ||
      internship.description ||
      internship.summary ||
      "This internship provides hands-on experience, mentorship, and exposure to real project work.",
    responsibilities,
    requirements,
  };
}

function getStudentMatchValues(currentUser) {
  return [
    currentUser?.id,
    currentUser?.email,
    currentUser?.name,
    currentUser?.studentId,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());
}

function applicationBelongsToCurrentStudent(application, currentUser) {
  const studentValues = getStudentMatchValues(currentUser);

  const possibleApplicationValues = [
    application?.studentId,
    application?.applicantId,
    application?.userId,
    application?.ownerId,
    application?.createdBy,
    application?.studentEmail,
    application?.applicantEmail,
    application?.email,
    application?.studentName,
    application?.applicantName,
    application?.name,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return possibleApplicationValues.some((value) =>
    studentValues.includes(value)
  );
}

function getAppliedInternshipIdsForCurrentUser() {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) return [];

  const applications = [
    ...(getCollection("applications") || []),
    ...(getCollection("internshipApplications") || []),
  ];

  const internships = getCollection("internships") || [];

  const topLevelAppliedIds = applications
    .filter((application) =>
      applicationBelongsToCurrentStudent(application, currentUser)
    )
    .map((application) => application.internshipId)
    .filter(Boolean);

  const nestedAppliedIds = internships.flatMap((internship) => {
    const nestedApplications = [
      ...normalizeArray(internship.applications),
      ...normalizeArray(internship.applicants),
      ...normalizeArray(internship.candidates),
    ];

    return nestedApplications
      .map((application) => {
        if (typeof application === "string") {
          return {
            internshipId: internship.id,
            studentId: application,
          };
        }

        return {
          ...application,
          internshipId: application.internshipId || internship.id,
        };
      })
      .filter((application) =>
        applicationBelongsToCurrentStudent(application, currentUser)
      )
      .map((application) => application.internshipId)
      .filter(Boolean);
  });

  return [...new Set([...topLevelAppliedIds, ...nestedAppliedIds])];
}

function getSavedInternshipIdsForCurrentUser() {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) return [];

  const internships = getCollection("internships") || [];
  const bookmarks = getCollection("bookmarks") || [];

  const savedIdsFromUser = [
    ...(currentUser.savedInternshipIds || []),
    ...(currentUser.bookmarkedInternshipIds || []),
    ...(currentUser.savedInternships || []),
  ];

  const savedIdsFromBookmarks = bookmarks
    .filter((bookmark) => {
      const userId =
        bookmark.userId ||
        bookmark.studentId ||
        bookmark.ownerId ||
        bookmark.createdBy;

      const type = String(
        bookmark.type || bookmark.itemType || bookmark.collection || ""
      ).toLowerCase();

      return (
        String(userId || "").toLowerCase() ===
          String(currentUser.id).toLowerCase() &&
        (type === "internship" || bookmark.internshipId || bookmark.itemId)
      );
    })
    .map((bookmark) => bookmark.internshipId || bookmark.itemId);

  const savedIdsFromInternships = internships
    .filter((internship) => {
      const savedBy = internship.savedBy || internship.bookmarkedBy || [];

      return savedBy
        .map((value) => String(value).toLowerCase())
        .some((value) => getStudentMatchValues(currentUser).includes(value));
    })
    .map((internship) => internship.id);

  return [
    ...new Set([
      ...savedIdsFromUser,
      ...savedIdsFromBookmarks,
      ...savedIdsFromInternships,
    ]),
  ];
}


export default function Internships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All Work Modes");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Sort by: Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(6);

  const [internships, setInternships] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);

  const [previewInternship, setPreviewInternship] = useState(null);
  const [applyInternship, setApplyInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const refreshInternships = () => {
    const users = getCollection("users") || [];
    const storeInternships = getCollection("internships") || [];

    setInternships(
      storeInternships.map((internship) => normalizeInternship(internship, users))
    );
    setSavedIds(getSavedInternshipIdsForCurrentUser());
    setAppliedIds(getAppliedInternshipIdsForCurrentUser());
    
  };

  useEffect(() => {
    refreshInternships();
  }, []);

  const companies = [
    "All Companies",
    ...new Set(internships.map((item) => item.company)),
  ];

  const durations = [
    "All Durations",
    ...new Set(internships.map((item) => item.duration)),
  ];

  const workModes = [
    "All Work Modes",
    ...new Set(internships.map((item) => item.workMode)),
  ];

  const featuredInternships = internships.filter((item) => item.featured);

  const filteredInternships = useMemo(() => {
    const filtered = internships.filter((internship) => {
      const searchableText = [
        internship.title,
        internship.company,
        internship.location,
        internship.department,
        internship.workMode,
        internship.duration,
        ...internship.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesCompany =
        selectedCompany === "All Companies" ||
        internship.company === selectedCompany;

      const matchesDuration =
        selectedDuration === "All Durations" ||
        internship.duration === selectedDuration;

      const matchesWorkMode =
        selectedWorkMode === "All Work Modes" ||
        internship.workMode === selectedWorkMode;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Saved" && savedIds.includes(internship.id)) ||
        (selectedStatus === "Applied" && appliedIds.includes(internship.id)) ||
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
      if (sortBy === "Sort by: Newest") {
        return getPostedNumber(a.postedAt) - getPostedNumber(b.postedAt);
      }

      if (sortBy === "Sort by: Oldest") {
        return getPostedNumber(b.postedAt) - getPostedNumber(a.postedAt);
      }

      if (sortBy === "Sort by: Deadline Soon") {
        return new Date(a.deadline) - new Date(b.deadline);
      }

      if (sortBy === "Sort by: Highest Rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "Sort by: Company A-Z") {
        return a.company.localeCompare(b.company);
      }

      return 0;
    });
  }, [
    internships,
    searchTerm,
    selectedCompany,
    selectedDuration,
    selectedWorkMode,
    selectedStatus,
    sortBy,
    savedIds,
    appliedIds,
  ]);

  const visibleInternships = filteredInternships.slice(0, visibleCount);

  const toggleSave = (id) => {
    toggleSavedInternship(id);
    refreshInternships();
  };

  const openApplyModal = (internship) => {
    setCoverLetter("");
    setApplyInternship(internship);
  };

  const confirmApply = () => {
    if (!applyInternship) return;

    applyToInternship(applyInternship.id, coverLetter);

    setApplyInternship(null);
    setCoverLetter("");
    refreshInternships();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("All Companies");
    setSelectedDuration("All Durations");
    setSelectedWorkMode("All Work Modes");
    setSelectedStatus("All");
    setSortBy("Sort by: Newest");
    setVisibleCount(6);
  };

  const hasFilters =
    searchTerm ||
    selectedCompany !== "All Companies" ||
    selectedDuration !== "All Durations" ||
    selectedWorkMode !== "All Work Modes" ||
    selectedStatus !== "All" ||
    sortBy !== "Sort by: Newest";

  return (
    <DashboardLayout >
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
              Discover Internships
              
            </h1>

            <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
              Find opportunities, build experience, save roles, preview details,
              and apply with an optional cover letter.
            </p>
          </div>

          <SearchFilterToolbar
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setVisibleCount(6);
            }}
            searchPlaceholder="Search by internship title, company, skill, or location..."
            showSort
            sortValue={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              setVisibleCount(6);
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
                setVisibleCount(6);
              }}
              options={companies.map((company) => `Company: ${company}`)}
            />

            <FilterSelect
              value={`Duration: ${selectedDuration}`}
              onChange={(value) => {
                setSelectedDuration(value.replace("Duration: ", ""));
                setVisibleCount(6);
              }}
              options={durations.map((duration) => `Duration: ${duration}`)}
            />

            <FilterSelect
              value={`Work Mode: ${selectedWorkMode}`}
              onChange={(value) => {
                setSelectedWorkMode(value.replace("Work Mode: ", ""));
                setVisibleCount(6);
              }}
              options={workModes.map((mode) => `Work Mode: ${mode}`)}
            />

            <FilterSelect
              value={`Status: ${selectedStatus}`}
              onChange={(value) => {
                setSelectedStatus(value.replace("Status: ", ""));
                setVisibleCount(6);
              }}
              options={[
                "Status: All",
                "Status: Featured",
                "Status: Saved",
                "Status: Applied",
              ]}
            />
          </SearchFilterToolbar>

          <AppCard className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[color:var(--ink)]">
                  Featured Internships
                  
                </h2>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  Handpicked opportunities from top organizations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("Featured");
                  setVisibleCount(6);
                  document.getElementById("all-internships")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="text-sm font-black text-[color:var(--primary)]"
              >
                View all featured →
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {featuredInternships.slice(0, 2).map((internship) => (
                <FeaturedInternshipCard
                  key={internship.id}
                  internship={internship}
                  isSaved={savedIds.includes(internship.id)}
                  isApplied={appliedIds.includes(internship.id)}
                  onSave={() => toggleSave(internship.id)}
                  onPreview={() => setPreviewInternship(internship)}
                  onApply={() => openApplyModal(internship)}
                />
              ))}
            </div>
          </AppCard>

          <AppCard id="all-internships" className="p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-[color:var(--ink)]">
                  All Internships
                  <span className="ml-2 rounded-full bg-[color:var(--accent)]/25 px-3 py-1 text-sm font-black text-[color:var(--primary)]">
                    {filteredInternships.length} results
                  </span>
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/70 ${
                    viewMode === "grid"
                      ? "bg-[color:var(--primary)] text-white"
                      : "bg-white/60 text-[color:var(--primary)]"
                  }`}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/70 ${
                    viewMode === "list"
                      ? "bg-[color:var(--primary)] text-white"
                      : "bg-white/60 text-[color:var(--primary)]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {visibleInternships.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-5 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {visibleInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    viewMode={viewMode}
                    isSaved={savedIds.includes(internship.id)}
                    isApplied={appliedIds.includes(internship.id)}
                    onSave={() => toggleSave(internship.id)}
                    onPreview={() => setPreviewInternship(internship)}
                    onApply={() => openApplyModal(internship)}
                  />
                ))}
              </div>
            )}

            {visibleCount < filteredInternships.length && (
              <div className="mt-6 flex justify-center">
                <AppButton
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="rounded-2xl border border-white/70 bg-white/60 px-6 font-black text-[color:var(--primary)] hover:bg-white/80"
                >
                  Load more internships
                  <ArrowRight className="ml-2 h-4 w-4" />
                </AppButton>
              </div>
            )}
          </AppCard>
        </div>

        {previewInternship && (
          <PreviewModal
            internship={previewInternship}
            isSaved={savedIds.includes(previewInternship.id)}
            isApplied={appliedIds.includes(previewInternship.id)}
            onClose={() => setPreviewInternship(null)}
            onSave={() => toggleSave(previewInternship.id)}
            onApply={() => {
              setPreviewInternship(null);
              openApplyModal(previewInternship);
            }}
          />
        )}

        {applyInternship && (
          <ApplyModal
            internship={applyInternship}
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            isApplied={appliedIds.includes(applyInternship.id)}
            onClose={() => setApplyInternship(null)}
            onConfirm={confirmApply}
          />
        )}
      </main>
    </DashboardLayout>
  );
}

function FeaturedInternshipCard({
  internship,
  isSaved,
  isApplied,
  onSave,
  onPreview,
  onApply,
}) {
  return (
    <AppCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <CompanyLogo company={internship.company} />

        <button
          type="button"
          onClick={onSave}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60 text-[color:var(--primary)] transition hover:bg-white/80"
        >
          <Bookmark
            className={`h-5 w-5 ${
              isSaved ? "fill-[color:var(--primary)]" : ""
            }`}
          />
        </button>
      </div>

      <div className="mt-4">
        <StatusBadge status="Featured" />

        <h3 className="mt-3 text-2xl font-black text-[color:var(--ink)]">
          {internship.title}
        </h3>

        <p className="mt-1 text-sm font-bold text-[color:var(--primary)]">
          {internship.company}
        </p>
      </div>

      <InfoRow internship={internship} />

      <SkillList skills={internship.skills.slice(0, 4)} />

      <div className="mt-5 flex flex-wrap gap-3">
        <AppButton
          type="button"
          onClick={onPreview}
          className="rounded-2xl border border-white/70 bg-white/60 px-5 font-black text-[color:var(--primary)] hover:bg-white/80"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </AppButton>

        <AppButton
          type="button"
          onClick={onApply}
          disabled={isApplied}
          className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white hover:bg-[color:var(--dark)] disabled:opacity-60"
        >
          <Send className="mr-2 h-4 w-4" />
          {isApplied ? "Applied" : "Apply"}
        </AppButton>

        <Link to={`/internships/${internship.id}`} className="ml-auto">
          <AppButton className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white hover:bg-[color:var(--dark)]">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </AppButton>
        </Link>
      </div>
    </AppCard>
  );
}

function InternshipCard({
  internship,
  viewMode,
  isSaved,
  isApplied,
  onSave,
  onPreview,
  onApply,
}) {
  const isList = viewMode === "list";

  return (
    <AppCard
      className={`p-5 ${isList ? "grid gap-4 lg:grid-cols-[1fr_auto]" : ""}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <CompanyLogo company={internship.company} />

          <button
            type="button"
            onClick={onSave}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60 text-[color:var(--primary)] transition hover:bg-white/80"
          >
            <Bookmark
              className={`h-5 w-5 ${
                isSaved ? "fill-[color:var(--primary)]" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {internship.featured && <StatusBadge status="Featured" />}
          {isApplied && <StatusBadge status="Applied" />}
          {isSaved && <StatusBadge status="Saved" />}
        </div>

        <h3 className="mt-3 text-xl font-black text-[color:var(--ink)]">
          {internship.title}
        </h3>

        <p className="mt-1 text-sm font-bold text-[color:var(--primary)]">
          {internship.company}
        </p>

        <InfoRow internship={internship} />

        <SkillList skills={internship.skills.slice(0, 3)} />
      </div>

      <div
        className={`mt-5 flex flex-wrap gap-3 ${
          isList ? "lg:mt-0 lg:flex-col lg:justify-center" : ""
        }`}
      >
        <AppButton
          type="button"
          onClick={onPreview}
          className="rounded-2xl border border-white/70 bg-white/60 px-4 font-black text-[color:var(--primary)] hover:bg-white/80"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </AppButton>

        <AppButton
          type="button"
          onClick={onApply}
          disabled={isApplied}
          className="rounded-2xl border border-white/70 bg-white/60 px-4 font-black text-[color:var(--primary)] hover:bg-white/80 disabled:opacity-60"
        >
          <Send className="mr-2 h-4 w-4" />
          {isApplied ? "Applied" : "Apply"}
        </AppButton>

        <Link to={`/internships/${internship.id}`}>
          <AppButton className="rounded-2xl bg-[color:var(--primary)] px-4 font-black text-white hover:bg-[color:var(--dark)]">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </AppButton>
        </Link>
      </div>
    </AppCard>
  );
}

function PreviewModal({
  internship,
  isSaved,
  isApplied,
  onClose,
  onSave,
  onApply,
}) {
  return (
    <AppModal
      title="Internship Preview"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <CompanyLogo company={internship.company} />

          <div>
            <div className="flex flex-wrap gap-2">
              {internship.featured && <StatusBadge status="Featured" />}
              {isSaved && <StatusBadge status="Saved" />}
              {isApplied && <StatusBadge status="Applied" />}
            </div>

            <h2 className="mt-3 text-3xl font-black text-[color:var(--ink)]">
              {internship.title}
            </h2>

            <p className="mt-1 font-bold text-[color:var(--primary)]">
              {internship.company}
            </p>
          </div>
        </div>

        <InfoRow internship={internship} />

        <p className="text-sm font-semibold leading-7 text-[color:var(--muted)]">
          {internship.overview}
        </p>

        <div>
          <h3 className="font-black text-[color:var(--ink)]">Key Skills</h3>
          <SkillList skills={internship.skills} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MiniList
            title="Responsibilities"
            items={internship.responsibilities}
          />
          <MiniList title="Requirements" items={internship.requirements} />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <AppButton
            type="button"
            onClick={onSave}
            className="rounded-2xl border border-white/70 bg-white/60 px-5 font-black text-[color:var(--primary)]"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            {isSaved ? "Unsave" : "Save"}
          </AppButton>

          <AppButton
            type="button"
            onClick={onApply}
            disabled={isApplied}
            className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            {isApplied ? "Already Applied" : "Apply Now"}
          </AppButton>

          <Link to={`/internships/${internship.id}`}>
            <AppButton className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white">
              Full Details
            </AppButton>
          </Link>
        </div>
      </div>
    </AppModal>
  );
}

function ApplyModal({
  internship,
  coverLetter,
  setCoverLetter,
  isApplied,
  onClose,
  onConfirm,
}) {
  return (
    <AppModal
      title={`Apply — ${internship.title}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <p className="text-sm font-semibold leading-7 text-[color:var(--muted)]">
        You can write a short cover letter, or leave it empty and apply directly.
      </p>

      <div className="mt-5 rounded-2xl border border-white/70 bg-white/55 p-4">
        <p className="font-black text-[color:var(--ink)]">
          {internship.company}
        </p>
        <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
          {internship.duration} • {internship.workMode} • Deadline{" "}
          {internship.deadline}
        </p>
      </div>

      <textarea
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        maxLength={700}
        placeholder="Write a short message to the employer..."
        className="mt-5 min-h-40 w-full resize-none rounded-2xl border border-[color:var(--primary)]/15 bg-white/70 p-4 text-sm font-semibold leading-7 text-[color:var(--ink)] outline-none focus:ring-4 focus:ring-[color:var(--accent)]/25"
      />

      <p className="mt-2 text-xs font-bold text-[color:var(--muted)]">
        {coverLetter.length}/700 characters
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-2xl border border-white/70 bg-white px-6 font-black text-[color:var(--muted)]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isApplied}
          className="h-12 rounded-2xl bg-[color:var(--primary)] px-6 font-black text-white disabled:opacity-60"
        >
          {isApplied ? "Already Applied" : "Submit Application"}
        </button>
      </div>
    </AppModal>
  );
}

function CompanyLogo({ company }) {
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-xl font-black text-white shadow-[var(--shadow-soft)]">
      {company.charAt(0)}
    </div>
  );
}

function InfoRow({ internship }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-[color:var(--muted)]">
      <span className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {internship.duration}
      </span>

      <span className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {internship.location}
      </span>

      <span className="flex items-center gap-2">
        <Briefcase className="h-4 w-4" />
        {internship.workMode}
      </span>

      <span className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {internship.postedAt}
      </span>
    </div>
  );
}

function SkillList({ skills }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-[color:var(--accent)]/25 px-3 py-1 text-xs font-black text-[color:var(--primary)]"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function MiniList({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/55 p-4">
      <h4 className="font-black text-[color:var(--ink)]">{title}</h4>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-[color:var(--muted)]">
        {items.slice(0, 4).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/55 p-10 text-center">
      <h3 className="text-2xl font-black text-[color:var(--ink)]">
        No internships found
      </h3>
      <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
        Try changing your search or filters.
      </p>
    </div>
  );
}