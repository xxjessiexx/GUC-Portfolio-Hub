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
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
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
  if (value === "shortlisted") return "Shortlisted";
  if (value === "nominated") return "Nominated";
  if (value === "reviewing" || value === "under review") return "Reviewing";

  return "Reviewing";
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
        ? "Application accepted"
        : status === "Rejected"
          ? "Application closed"
          : status === "Nominated"
            ? "You've been nominated"
            : status === "Shortlisted"
              ? "You've been shortlisted"
              : "Employer review in progress"),
    note:
      application.note ||
      application.feedback ||
      application.message ||
      application.reason ||
      (status === "Accepted"
        ? "Open the internship to review the role and any next steps."
        : status === "Rejected"
          ? "This application is no longer active."
          : status === "Nominated"
            ? "The employer has moved your application forward to the nomination stage."
            : status === "Shortlisted"
              ? "Your application has moved forward and remains under consideration."
              : "The employer is currently reviewing your application."),
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
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        <PageHeader
          title="My Applications"
          description="Track your internship applications and keep up with each employer's decision."
        />

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
                "Status: Reviewing",
                "Status: Shortlisted",
                "Status: Nominated",
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

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={filteredApplications.length}
              pageStartIndex={pageStartIndex}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={goToPage}
              ariaLabel="Application results pagination"
            />
          </section>
        </div>
    </DashboardLayout>
  );
}

function ApplicationSurface({ application, onOpen }) {
  const statusTone =
    application.status === "Accepted"
      ? {
          label: "Accepted application",
          accent: "text-[#9BD2AE]",
          dot: "bg-[#9BD2AE]",
          line: "bg-[#9BD2AE]",
        }
      : application.status === "Rejected"
        ? {
            label: "Closed application",
            accent: "text-[#F0A8A8]",
            dot: "bg-[#EFA0A0]",
            line: "bg-[#EFA0A0]",
          }
        : application.status === "Nominated"
          ? {
              label: "Nominated",
              accent: "text-[#E6C77B]",
              dot: "bg-[#E6C77B]",
              line: "bg-[#E6C77B]",
            }
          : application.status === "Shortlisted"
            ? {
                label: "Shortlisted",
                accent: "text-[#A7D9FA]",
                dot: "bg-[#A7D9FA]",
                line: "bg-[#A7D9FA]",
              }
            : {
                label: "Application in review",
                accent: "text-[#E6C77B]",
                dot: "bg-[#E6C77B]",
                line: "bg-[#E6C77B]",
              };

  return (
    <article
      className="group overflow-hidden rounded-[30px] border border-white bg-white/95 p-0 shadow-[0_22px_55px_rgba(53,88,114,0.13)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_30px_68px_rgba(53,88,114,0.18)] dark:border-[var(--card-border)] dark:bg-[var(--surface)]"
    >
      <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <button
          type="button"
          onClick={onOpen}
          className="relative flex min-h-[235px] flex-col overflow-hidden bg-[linear-gradient(145deg,#071D2C_0%,#102F45_52%,#1E4964_100%)] p-7 text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#79B0E3]"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.19),transparent_69%)]" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(230,199,123,0.11),transparent_70%)]" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className={`text-[9px] font-black uppercase tracking-[0.18em] ${statusTone.accent}`}>
                {statusTone.label}
              </p>

              <span className={`h-2.5 w-2.5 rounded-full ${statusTone.dot}`} />
            </div>

            <span className={`mt-4 block h-[2px] w-10 rounded-full ${statusTone.line}`} />

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.10em] text-[#8FC3E5]">
              {application.company}
            </p>

            <h3 className="mt-3 max-w-[220px] text-[28px] font-black leading-[1.02] tracking-[-0.045em] text-white">
              {application.title}
            </h3>
          </div>

          <div className="relative mt-auto border-t border-white/15 pt-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#A7D9FA]" />
                {application.location}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-[#A7D9FA]" />
                {application.duration}
              </span>
            </div>
          </div>
        </button>

        <div className="relative flex min-w-0 flex-col px-7 py-6 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.10),transparent_70%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#B89736]">
                Next step
              </p>

              <h4 className="mt-1.5 text-[22px] font-black leading-tight tracking-[-0.03em] text-[color:var(--ink)]">
                {application.nextStep}
              </h4>

              <p className="mt-2 max-w-3xl text-[13px] font-medium leading-6 text-[color:var(--muted)]">
                {application.note}
              </p>
            </div>

            <StatusBadge status={application.status} />
          </div>

          <div className="relative mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                Applied
              </p>
              <p className="mt-1 text-[11px] font-black text-[#355872]">
                {formatDisplayDate(application.dateApplied)}
              </p>
            </div>

            <span className="hidden h-8 w-px bg-[#D3E1E9] sm:block" />

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                Company
              </p>
              <p className="mt-1 text-[11px] font-black text-[#355872]">
                {application.company}
              </p>
            </div>

            <span className="hidden h-8 w-px bg-[#D3E1E9] sm:block" />

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--muted)]">
                Status
              </p>
              <p className="mt-1 text-[11px] font-black text-[#355872]">
                {application.status}
              </p>
            </div>
          </div>

          
        </div>
      </div>
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
