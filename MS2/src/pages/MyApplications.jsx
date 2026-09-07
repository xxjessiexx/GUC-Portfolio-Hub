import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import {
  getApplicationsForStudent,
  getCurrentUser,
} from "@/data/demoStore";

const ITEMS_PER_PAGE = 6;

function normalizeStatus(status) {
  const value = String(status || "pending").trim().toLowerCase();

  if (value === "accepted" || value === "approved") return "Accepted";
  if (value === "rejected" || value === "declined") return "Rejected";

  return "Pending";
}

function formatDisplayDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeApplication(application) {
  const status = normalizeStatus(application.status);

  return {
    ...application,
    status,
    company:
      application.company ||
      application.companyName ||
      "Unknown Company",
    title:
      application.title ||
      application.role ||
      application.position ||
      "Internship",
    location: application.location || "Location not specified",
    duration: application.duration || "Duration not specified",
    dateApplied:
      application.dateApplied ||
      application.appliedAt ||
      application.createdAt ||
      application.submittedAt ||
      "",
    nextStep:
      application.nextStep ||
      application.nextAction ||
      (status === "Accepted"
        ? "Offer accepted"
        : status === "Rejected"
        ? "Application closed"
        : "Waiting for employer response"),
    note:
      application.note ||
      application.feedback ||
      application.message ||
      application.reason ||
      (status === "Accepted"
        ? "Open the internship to review the role and any next steps."
        : status === "Rejected"
        ? "This application is no longer active."
        : "Your application is still waiting for an employer response."),
  };
}

function getApplicationTimestamp(application) {
  const date = new Date(application.dateApplied || "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function MyApplications() {
  const navigate = useNavigate();
  const resultsTopRef = useRef(null);

  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedPeriod, setSelectedPeriod] = useState("Anytime");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const refreshApplications = () => {
    const currentUser = getCurrentUser();

    const nextApplications = currentUser?.id
      ? getApplicationsForStudent(currentUser.id).map(normalizeApplication)
      : [];

    setApplications(nextApplications);
  };

  useEffect(() => {
    refreshApplications();

    const handleStoreChange = () => refreshApplications();

    window.addEventListener("demo-db-change", handleStoreChange);
    window.addEventListener("demo-current-user-change", handleStoreChange);

    return () => {
      window.removeEventListener("demo-db-change", handleStoreChange);
      window.removeEventListener("demo-current-user-change", handleStoreChange);
    };
  }, []);

  const companyOptions = useMemo(
    () => [
      "All Companies",
      ...Array.from(
        new Set(applications.map((application) => application.company))
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const now = Date.now();

    const filtered = applications.filter((application) => {
      const searchable = [
        application.title,
        application.company,
        application.location,
        application.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        application.status === selectedStatus;

      const matchesCompany =
        selectedCompany === "All Companies" ||
        application.company === selectedCompany;

      const timestamp = getApplicationTimestamp(application);
      let matchesPeriod = true;

      if (selectedPeriod === "This Week") {
        matchesPeriod =
          timestamp > 0 &&
          now - timestamp <= 7 * 24 * 60 * 60 * 1000;
      }

      if (selectedPeriod === "This Month") {
        matchesPeriod =
          timestamp > 0 &&
          now - timestamp <= 30 * 24 * 60 * 60 * 1000;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompany &&
        matchesPeriod
      );
    });

    return [...filtered].sort((a, b) => {
      if (selectedSort === "Oldest") {
        return getApplicationTimestamp(a) - getApplicationTimestamp(b);
      }

      if (selectedSort === "A-Z") {
        return a.title.localeCompare(b.title);
      }

      return getApplicationTimestamp(b) - getApplicationTimestamp(a);
    });
  }, [
    applications,
    searchTerm,
    selectedStatus,
    selectedCompany,
    selectedPeriod,
    selectedSort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedApplications = filteredApplications.slice(
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

  const resetFilters = () => {
    setSelectedStatus("All Statuses");
    setSelectedCompany("All Companies");
    setSelectedPeriod("Anytime");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedStatus !== "All Statuses" ||
    selectedCompany !== "All Companies" ||
    selectedPeriod !== "Anytime";

  return (
    <DashboardLayout>
      <main className="px-4 py-7 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1480px] space-y-6">
          <header>
            <div className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]" />

            <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
              My Applications
            </h1>

            <p className="mt-3 max-w-2xl text-base font-semibold text-[color:var(--muted)]">
              Track your internship applications and keep up with each
              employer's decision.
            </p>
          </header>

          <SearchFilterToolbar
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search applications by company, role, or location..."
            showSort
            sortValue={`Sort by: ${selectedSort}`}
            onSortChange={(value) => {
              setSelectedSort(value.replace("Sort by: ", ""));
              setCurrentPage(1);
            }}
            sortOptions={[
              "Sort by: Newest",
              "Sort by: Oldest",
              "Sort by: A-Z",
            ]}
            showFilters
            filtersOpen={filtersOpen}
            onToggleFilters={() =>
              setFiltersOpen((current) => !current)
            }
            filterTitle="Filter applications"
            onClearFilters={hasActiveFilters ? resetFilters : undefined}
          >
            <FilterSelect
              value={`Status: ${selectedStatus}`}
              onChange={(value) => {
                setSelectedStatus(value.replace("Status: ", ""));
                setCurrentPage(1);
              }}
              options={[
                "Status: All Statuses",
                "Status: Pending",
                "Status: Accepted",
                "Status: Rejected",
              ]}
            />

            <FilterSelect
              value={`Company: ${selectedCompany}`}
              onChange={(value) => {
                setSelectedCompany(value.replace("Company: ", ""));
                setCurrentPage(1);
              }}
              options={companyOptions.map(
                (company) => `Company: ${company}`
              )}
            />

            <FilterSelect
              value={`Date: ${selectedPeriod}`}
              onChange={(value) => {
                setSelectedPeriod(value.replace("Date: ", ""));
                setCurrentPage(1);
              }}
              options={[
                "Date: Anytime",
                "Date: This Week",
                "Date: This Month",
              ]}
            />
          </SearchFilterToolbar>

          <section ref={resultsTopRef} className="scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-[var(--ink)]">
                {filteredApplications.length} application
                {filteredApplications.length === 1 ? "" : "s"} found
              </h2>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[12px] font-black text-[var(--primary)] transition hover:opacity-70"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {paginatedApplications.length ? (
              <div className="space-y-4">
                {paginatedApplications.map((application) => (
                  <ApplicationSurface
                    key={application.id}
                    application={application}
                    onOpen={() =>
                      navigate(`/internships/${application.internshipId}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                hasFilters={Boolean(searchTerm.trim()) || hasActiveFilters}
                onClear={() => {
                  setSearchTerm("");
                  resetFilters();
                }}
                onBrowse={() => navigate("/internships")}
              />
            )}

            {filteredApplications.length > ITEMS_PER_PAGE ? (
              <nav
                className="mt-8 flex flex-col gap-3 border-t border-[#355872]/10 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
                aria-label="Application results pagination"
              >
                <p className="text-[12px] font-semibold text-[color:var(--muted)]">
                  Showing {pageStartIndex + 1}–
                  {Math.min(
                    pageStartIndex + ITEMS_PER_PAGE,
                    filteredApplications.length
                  )} of {filteredApplications.length}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
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
                            ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)] dark:border-[#9CD5FF] dark:bg-[#9CD5FF] dark:text-[#071521]"
                            : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
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
                    className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
                  >
                    Next
                  </button>
                </div>
              </nav>
            ) : null}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}

function ApplicationSurface({ application, onOpen }) {
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
      className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#C9DBE4] bg-[#FBFCFA] px-5 py-5 shadow-[0_16px_36px_rgba(53,88,114,0.08)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7AAACE]/20 hover:-translate-y-[2px] hover:shadow-[0_22px_46px_rgba(53,88,114,0.12)] sm:px-6 sm:py-6 dark:border-[var(--card-border)] dark:bg-[var(--surface)]"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.55fr)] lg:items-center lg:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.11em] text-[#355872] dark:text-[var(--secondary)]">
              {application.company}
            </p>
            <StatusBadge status={application.status} />
          </div>

          <h3 className="mt-2.5 text-[21px] font-black leading-[1.1] tracking-[-0.035em] text-[#183247] transition-colors group-hover:text-[#244D69] dark:text-[var(--ink)]">
            {application.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-[#627887] dark:text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#456D87] dark:text-[var(--secondary)]" />
              {application.location}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#456D87] dark:text-[var(--secondary)]" />
              {application.duration}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#456D87] dark:text-[var(--secondary)]" />
              Applied {formatDisplayDate(application.dateApplied)}
            </span>
          </div>
        </div>

        <div className="border-t border-[#DCE7ED] pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-[var(--card-border)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B89736]">
            Next step
          </p>

          <p className="mt-2 text-[14px] font-black text-[#183247] dark:text-[var(--ink)]">
            {application.nextStep}
          </p>

          <p className="mt-1.5 line-clamp-2 text-[12px] font-semibold leading-5 text-[#708491] dark:text-[var(--muted)]">
            {application.note}
          </p>
        </div>
      </div>

      <ArrowUpRight className="pointer-events-none absolute bottom-5 right-5 h-4 w-4 text-[#355872] opacity-0 transition-opacity group-hover:opacity-25 sm:bottom-6 sm:right-6 dark:text-[var(--secondary)]" />
    </article>
  );
}

function EmptyState({ hasFilters, onClear, onBrowse }) {
  return (
    <div className="rounded-[26px] border border-[#C9DBE4] bg-[#FBFCFA] px-6 py-14 text-center shadow-[0_18px_42px_rgba(53,88,114,0.08)] dark:border-[var(--card-border)] dark:bg-[var(--surface)]">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-[15px] border border-[#355872]/12 bg-white text-[#355872] dark:border-[var(--card-border)] dark:bg-[var(--surface-elevated)] dark:text-[var(--secondary)]">
        <BriefcaseBusiness className="h-5 w-5" />
      </div>

      <p className="mt-5 text-xl font-black tracking-[-0.02em] text-[#183247] dark:text-[var(--ink)]">
        {hasFilters
          ? "No applications match these filters."
          : "You haven't applied to any internships yet."}
      </p>

      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-[#708491] dark:text-[var(--muted)]">
        {hasFilters
          ? "Try widening your search or clearing the current filters."
          : "Applications you submit from Internships will be tracked here."}
      </p>

      <button
        type="button"
        onClick={hasFilters ? onClear : onBrowse}
        className="mt-5 h-10 rounded-[13px] border border-[#355872]/14 bg-white px-4 text-[11px] font-black text-[#355872] transition hover:bg-[#F5FAFC] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
      >
        {hasFilters ? "Clear filters" : "Explore internships"}
      </button>
    </div>
  );
}
