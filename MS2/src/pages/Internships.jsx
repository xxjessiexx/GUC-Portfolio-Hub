import { useMemo, useState } from "react";
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
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";

import AppModal from "@/components/common/AppModal";
import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import { notifications } from "@/data/studentDashboardData";
import { internshipsData } from "@/data/internshipsData";

const SAVED_INTERNSHIPS_KEY = "guc-saved-internships";
const APPLIED_INTERNSHIPS_KEY = "guc-applied-internships";
const COVER_LETTERS_KEY = "guc-cover-letters";

function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStoredIds(key, ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function getStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function getPostedNumber(postedAt) {
  const match = postedAt.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function Internships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All Work Modes");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Sort by: Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(6);

  const [savedIds, setSavedIds] = useState(() =>
    getStoredIds(SAVED_INTERNSHIPS_KEY)
  );
  const [appliedIds, setAppliedIds] = useState(() =>
    getStoredIds(APPLIED_INTERNSHIPS_KEY)
  );

  const [previewInternship, setPreviewInternship] = useState(null);
  const [applyInternship, setApplyInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const companies = [
    "All Companies",
    ...new Set(internshipsData.map((item) => item.company)),
  ];

  const durations = [
    "All Durations",
    ...new Set(internshipsData.map((item) => item.duration)),
  ];

  const workModes = [
    "All Work Modes",
    ...new Set(internshipsData.map((item) => item.workMode)),
  ];

  const featuredInternships = internshipsData.filter((item) => item.featured);

  const filteredInternships = useMemo(() => {
    const filtered = internshipsData.filter((internship) => {
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
    const updated = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    setSavedIds(updated);
    setStoredIds(SAVED_INTERNSHIPS_KEY, updated);
  };

  const openApplyModal = (internship) => {
    const storedLetters = getStoredObject(COVER_LETTERS_KEY);
    setCoverLetter(storedLetters[internship.id] || "");
    setApplyInternship(internship);
  };

  const confirmApply = () => {
    if (!applyInternship) return;

    const updatedApplied = appliedIds.includes(applyInternship.id)
      ? appliedIds
      : [...appliedIds, applyInternship.id];

    const storedLetters = getStoredObject(COVER_LETTERS_KEY);
    const updatedLetters = {
      ...storedLetters,
      [applyInternship.id]: coverLetter,
    };

    setAppliedIds(updatedApplied);
    setStoredIds(APPLIED_INTERNSHIPS_KEY, updatedApplied);
    localStorage.setItem(COVER_LETTERS_KEY, JSON.stringify(updatedLetters));

    setApplyInternship(null);
    setCoverLetter("");
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
    <DashboardLayout notifications={notifications}>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--primary)]">
              Internships
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
              Discover Internships
              <Sparkles className="ml-2 inline h-5 w-5 fill-[color:var(--gold)] text-[color:var(--gold)]" />
            </h1>

            <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
              Find opportunities, build experience, save roles, preview details,
              and apply with an optional cover letter.
            </p>
          </div>

          <AppCard className="p-5">
            <div className="flex flex-wrap items-center gap-4">                
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

                <Input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder="Search by internship title, company, skill, or location..."
                  className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 font-semibold text-[color:var(--ink)]"
                />
              </div>
            <div className="w-[13rem]">
              <FilterSelect
                value={selectedCompany}
                onChange={(value) => {
                  setSelectedCompany(value);
                  setVisibleCount(6);
                }}
                options={companies}
              />
            </div>
            
            <div className="w-[13rem]">
              <FilterSelect
                value={selectedDuration}
                onChange={(value) => {
                  setSelectedDuration(value);
                  setVisibleCount(6);
                }}
                options={durations}
              />
            </div>

            <div className="w-[13rem]">
              <FilterSelect
                value={selectedWorkMode}
                onChange={(value) => {
                  setSelectedWorkMode(value);
                  setVisibleCount(6);
                }}
                options={workModes}
              />
            </div>

            <div className="w-[9rem]">
              <FilterSelect
                value={selectedStatus}
                onChange={(value) => {
                  setSelectedStatus(value);
                  setVisibleCount(6);
                }}
                options={["All", "Featured", "Saved", "Applied"]}
              />
            </div>

            <div className="w-[14rem]">
              <FilterSelect
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setVisibleCount(6);
                }}
                options={[
                  "Sort by: Newest",
                  "Sort by: Oldest",
                  "Sort by: Deadline Soon",
                  "Sort by: Highest Rating",
                  "Sort by: Company A-Z",
                ]}
              />
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 text-sm font-black text-red-500 transition hover:bg-red-50 md:col-span-2 xl:col-span-6"                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </AppCard>

          <AppCard className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-[color:var(--ink)]">
                  Featured Internships
                  <Sparkles className="ml-2 inline h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
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