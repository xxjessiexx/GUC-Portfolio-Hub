import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bookmark,
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import SearchFilterToolbar from "@/components/common/SearchFilterToolbar";
import { Input } from "@/components/ui/input";

import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import { getCurrentUser, getCollection } from "@/data/demoStore";

function normalizeStatus(status) {
  const value = String(status || "Pending").toLowerCase();

  if (value === "accepted" || value === "approved") return "Accepted";
  if (value === "rejected" || value === "declined") return "Rejected";

  if (
    value === "under_review" ||
    value === "under review" ||
    value === "review" ||
    value === "reviewing"
  ) {
    return "Under Review";
  }

  return "Pending";
}

function formatDisplayDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function getEmployerName(internship, users) {
  if (internship?.company) return internship.company;
  if (internship?.companyName) return internship.companyName;

  const employerId =
    internship?.employerId || internship?.companyId || internship?.ownerId || "";

  const employer = users.find((user) => user.id === employerId);

  return employer?.companyName || employer?.name || "Unknown Company";
}
function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "object") return Object.values(value);

  return [];
}
function getApplicationDate(application) {
  return (
    application?.dateApplied ||
    application?.appliedAt ||
    application?.createdAt ||
    application?.submittedAt ||
    application?.updatedAt ||
    ""
  );
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

  return possibleApplicationValues.some((value) => studentValues.includes(value));
}

function normalizeApplicationFromStore(application, internship, users) {
  const status = normalizeStatus(application?.status);
  const dateApplied = getApplicationDate(application);

  return {
    id:
      application?.id ||
      `${internship?.id || application?.internshipId || "internship"}-${
        application?.studentId ||
        application?.applicantId ||
        application?.studentEmail ||
        application?.email ||
        Date.now()
      }`,

    internshipId: application?.internshipId || internship?.id,

    company: getEmployerName(internship || application || {}, users),

    title:
      internship?.title ||
      internship?.role ||
      internship?.position ||
      application?.title ||
      application?.role ||
      "Internship Application",

    location:
      internship?.location ||
      internship?.workLocation ||
      application?.location ||
      "Not specified",

    duration:
      internship?.duration ||
      internship?.period ||
      application?.duration ||
      "Not specified",

    dateApplied,

    displayDate: formatDisplayDate(dateApplied),

    status,

    nextStep:
      application?.nextStep ||
      application?.nextAction ||
      (status === "Accepted"
        ? "Offer accepted"
        : status === "Rejected"
        ? "Application closed"
        : status === "Under Review"
        ? "Application under review"
        : "Waiting for employer response"),

    note:
      application?.note ||
      application?.feedback ||
      application?.message ||
      application?.reason ||
      (status === "Accepted"
        ? "Check the internship details for next steps."
        : status === "Rejected"
        ? "You can keep browsing other internships."
        : status === "Under Review"
        ? "The employer is reviewing your application."
        : "We will update you once the employer responds."),
  };
}

function getApplicationsForCurrentStudent() {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) return [];

  const applications = [
    ...(getCollection("applications") || []),
    ...(getCollection("internshipApplications") || []),
  ];

  const internships = getCollection("internships") || [];
  const users = getCollection("users") || [];

  const topLevelApplications = applications
    .filter((application) =>
      applicationBelongsToCurrentStudent(application, currentUser)
    )
    .map((application) => {
      const internship = internships.find(
        (item) => item.id === application.internshipId
      );

      return normalizeApplicationFromStore(application, internship, users);
    });

  const nestedApplications = internships.flatMap((internship) => {
   const possibleNestedApplications = [
  ...toArray(internship.applications),
  ...toArray(internship.applicants),
  ...toArray(internship.candidates),
];
    

    return possibleNestedApplications
      .map((application) => {
        if (typeof application === "string") {
          return {
            id: `${internship.id}-${application}`,
            internshipId: internship.id,
            studentId: application,
            status: "Pending",
            createdAt: internship.createdAt || internship.updatedAt || "",
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
      .map((application) =>
        normalizeApplicationFromStore(application, internship, users)
      );
  });

  const mergedApplications = [...topLevelApplications, ...nestedApplications];

  return Array.from(
    new Map(
      mergedApplications.map((application) => [
        `${application.internshipId}-${application.id}`,
        application,
      ])
    ).values()
  );
}

function getSavedInternshipsForCurrentStudent() {
  const currentUser = getCurrentUser();

  if (!currentUser?.id) return [];

  const internships = getCollection("internships") || [];
  const bookmarks = getCollection("bookmarks") || [];
  const users = getCollection("users") || [];

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
        bookmark.type ||
          bookmark.itemType ||
          bookmark.collection ||
          ""
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

  const savedIds = [
    ...new Set([
      ...savedIdsFromUser,
      ...savedIdsFromBookmarks,
      ...savedIdsFromInternships,
    ]),
  ];

  return savedIds
    .map((internshipId) => {
      const internship = internships.find((item) => item.id === internshipId);

      if (!internship) return null;

      return {
        id: `saved-${internship.id}`,
        internshipId: internship.id,
        title: internship.title || internship.role || internship.position || "Internship",
        company: getEmployerName(internship, users),
      };
    })
    .filter(Boolean);
}


function getUpcomingInterviews(applications) {
  return applications
    .filter((application) => application.status === "Accepted")
    .slice(0, 2)
    .map((application, index) => {
      const date = new Date(application.dateApplied);

      if (!Number.isNaN(date.getTime())) {
        date.setDate(date.getDate() + 7 + index * 2);
      }

      const day = Number.isNaN(date.getTime())
        ? "--"
        : date.toLocaleDateString("en", { day: "2-digit" });

      const month = Number.isNaN(date.getTime())
        ? "TBD"
        : date.toLocaleDateString("en", { month: "short" });

      const time = Number.isNaN(date.getTime())
        ? "Interview date to be announced"
        : `${formatDisplayDate(date.toISOString())} • ${
            index === 0 ? "2:00 PM" : "11:00 AM"
          }`;

      return {
        id: `interview-${application.id}`,
        day,
        month,
        company: application.company,
        role: application.title,
        time,
      };
    });
}

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [savedApplications, setSavedApplications] = useState([]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDate, setSelectedDate] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const refreshApplications = () => {
    setApplications(getApplicationsForCurrentStudent());
    setSavedApplications(getSavedInternshipsForCurrentStudent());
  };

  useEffect(() => {
    refreshApplications();
  }, []);

  const statusCounts = {
    All: applications.length,
    "Under Review": applications.filter((app) => app.status === "Under Review")
      .length,
    Pending: applications.filter((app) => app.status === "Pending").length,
    Accepted: applications.filter((app) => app.status === "Accepted").length,
    Rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const companies = [
    "All Companies",
    ...new Set(applications.map((app) => app.company)),
  ];

  const upcomingInterviews = useMemo(() => {
    return getUpcomingInterviews(applications);
  }, [applications]);

  const hasActiveFilters =
    searchTerm ||
    selectedStatus !== "All Statuses" ||
    selectedCompany !== "All Companies" ||
    selectedDate ||
    activeTab !== "All";

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchableText = [
        application.company,
        application.title,
        application.location,
        application.duration,
        application.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "All" || application.status === activeTab;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        application.status === selectedStatus;

      const matchesCompany =
        selectedCompany === "All Companies" ||
        application.company === selectedCompany;

      const matchesDate =
        !selectedDate ||
        formatDateInputValue(application.dateApplied) === selectedDate;

      return (
        matchesSearch &&
        matchesTab &&
        matchesStatus &&
        matchesCompany &&
        matchesDate
      );
    });
  }, [
    applications,
    activeTab,
    searchTerm,
    selectedStatus,
    selectedCompany,
    selectedDate,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All Statuses");
    setSelectedCompany("All Companies");
    setSelectedDate("");
    setActiveTab("All");
  };

  return (
    <DashboardLayout >
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
              My Applications
            </h1>

            <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
              Track your internship applications, next steps, saved internships,
              and application statuses.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <SearchFilterToolbar
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search by company or role..."
                showFilters
                filtersOpen={filtersOpen}
                onToggleFilters={() => setFiltersOpen((current) => !current)}
                filterTitle="Filter applications"
                onClearFilters={hasActiveFilters ? resetFilters : undefined}
              >
                <FilterSelect
                  value={`Status: ${selectedStatus}`}
                  onChange={(value) =>
                    setSelectedStatus(value.replace("Status: ", ""))
                  }
                  options={[
                    "Status: All Statuses",
                    "Status: Under Review",
                    "Status: Pending",
                    "Status: Accepted",
                    "Status: Rejected",
                  ]}
                />

                <FilterSelect
                  value={`Company: ${selectedCompany}`}
                  onChange={(value) =>
                    setSelectedCompany(value.replace("Company: ", ""))
                  }
                  options={companies.map((company) => `Company: ${company}`)}
                />

                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] pl-11 pr-3 text-sm font-black text-[color:var(--ink)] shadow-sm"/>
                </div>
              </SearchFilterToolbar>

              <AppCard className="overflow-hidden">
                <div className="grid grid-cols-5 border-b border-[color:var(--primary)]/10 text-center text-sm font-black">
                  {[
                    "All",
                    "Under Review",
                    "Pending",
                    "Accepted",
                    "Rejected",
                  ].map((tab) => (
                    <Tab
                      key={tab}
                      label={tab}
                      count={statusCounts[tab]}
                      active={activeTab === tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setSelectedStatus("All Statuses");
                      }}
                    />
                  ))}
                </div>

                <div className="hidden grid-cols-[1.5fr_0.7fr_0.75fr_1.15fr_0.7fr] border-b border-[color:var(--primary)]/10 px-6 py-4 text-sm font-black text-[color:var(--dark)] lg:grid lg:items-center lg:gap-4">
                  <p>Internship</p>
                  <p>Date Applied</p>
                  <p>Status</p>
                  <p>Next Step</p>
                  <p>Action</p>
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="p-10 text-center">
                    <h2 className="text-2xl font-black text-[color:var(--ink)]">
                      No applications found
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
                      Try changing your search or filter options.
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="grid gap-4 border-b border-[color:var(--primary)]/10 px-6 py-5 last:border-b-0 lg:grid-cols-[1.5fr_0.7fr_0.75fr_1.15fr_0.7fr] lg:items-center"
                    >
                      <div className="flex gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white">
                          <Briefcase className="h-5 w-5" />
                        </div>

                        <div>
                          <h2 className="font-black text-[color:var(--ink)]">
                            {application.company}
                          </h2>

                          <p className="text-sm font-bold text-[color:var(--primary)]">
                            {application.title}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-[color:var(--muted)]">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {application.location}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {application.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-black text-[color:var(--ink)]">
                          {application.displayDate}
                        </p>
                        <p className="text-xs font-semibold text-[color:var(--muted)]">
                          Recently applied
                        </p>
                      </div>

                      <StatusBadge status={application.status} />

                      <div>
                        <p className="text-sm font-black text-[color:var(--ink)]">
                          {application.nextStep}
                        </p>
                        <p className="text-xs font-semibold text-[color:var(--muted)]">
                          {application.note}
                        </p>
                      </div>

                      <Link to={`/internships/${application.internshipId}`}>
                      <AppButton
  className="
    rounded-2xl
    border border-[color:var(--border)]
    bg-[color:var(--card)]
    px-4
    font-black
    text-[color:var(--primary)]
    hover:bg-[color:var(--card-hover)]
  "
>
                          View Internship
                        </AppButton>
                      </Link>
                    </div>
                  ))
                )}
              </AppCard>
            </div>

            <aside className="space-y-6">
              <AppCard className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[color:var(--primary)]" />
                  <h2 className="text-xl font-black text-[color:var(--ink)]">
                    Application Overview
                  </h2>
                </div>

                <p className="text-5xl font-black text-[color:var(--primary)]">
                  {applications.length}
                </p>

                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  Total Applications
                </p>

                <div className="mt-6 space-y-3">
                  <OverviewRow
                    label="Under Review"
                    value={statusCounts["Under Review"]}
                    color="bg-blue-400"
                  />
                  <OverviewRow
                    label="Pending"
                    value={statusCounts.Pending}
                    color="bg-purple-400"
                  />
                  <OverviewRow
                    label="Accepted"
                    value={statusCounts.Accepted}
                    color="bg-green-400"
                  />
                  <OverviewRow
                    label="Rejected"
                    value={statusCounts.Rejected}
                    color="bg-red-400"
                  />
                </div>
              </AppCard>

              <AppCard className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[color:var(--primary)]" />
                  <h2 className="text-xl font-black text-[color:var(--ink)]">
                    Upcoming Interviews
                  </h2>
                </div>

                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      day={interview.day}
                      month={interview.month}
                      company={interview.company}
                      role={interview.role}
                      time={interview.time}
                    />
                  ))
                ) : (
                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    No upcoming interviews yet.
                  </p>
                )}
              </AppCard>

              <AppCard className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-[color:var(--primary)]" />
                  <h2 className="text-xl font-black text-[color:var(--ink)]">
                    Saved Internships
                  </h2>
                </div>

                <div className="space-y-3">
                  {savedApplications.length > 0 ? (
                    savedApplications.map((item) => (
                      <Link key={item.id} to={`/internships/${item.internshipId}`}>
                        <div
  className="
    flex items-center justify-between
    rounded-2xl
    border border-[color:var(--border)]
    bg-[color:var(--card)]
    p-4
    transition
    hover:bg-[color:var(--card-hover)]
  "
>
                          <div>
                            <p className="font-black text-[color:var(--ink)]">
                              {item.title}
                            </p>
                            <p className="text-sm font-semibold text-[color:var(--muted)]">
                              {item.company}
                            </p>
                          </div>

                          <Bookmark className="h-4 w-4 fill-[color:var(--primary)] text-[color:var(--primary)]" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      No saved internships yet.
                    </p>
                  )}
                </div>

                <Link
                  to="/internships"
                  className="mt-5 inline-block text-sm font-black text-[color:var(--primary)]"
                >
                  View all saved →
                </Link>
              </AppCard>
            </aside>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

function Tab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-r border-[color:var(--primary)]/10 px-4 py-4 last:border-r-0 transition ${
        active
  ? "bg-[color:var(--accent)]/20 text-[color:var(--primary)]"
  : "bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-hover)]"
      }`}
    >
      {label}
      <span className="ml-2 rounded-full bg-[color:var(--card)] px-2 py-0.5 text-xs text-[color:var(--ink)]">
        {count}
      </span>
    </button>
  );
}

function OverviewRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-sm font-bold">
      <span className="flex items-center gap-2 text-[color:var(--muted)]">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>
      <span className="text-[color:var(--ink)]">{value}</span>
    </div>
  );
}

function InterviewCard({ day, month, company, role, time }) {
  return (
    <div
  className="
    mb-3
    rounded-2xl
    border border-[color:var(--border)]
    bg-[color:var(--card)]
    p-4
    last:mb-0
  "
>
      <div className="flex gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[color:var(--accent)]/25 text-center">
          <div>
            <p className="text-xs font-black uppercase text-[color:var(--primary)]">
              {month}
            </p>
            <p className="text-lg font-black text-[color:var(--ink)]">{day}</p>
          </div>
        </div>

        <div>
          <p className="font-black text-[color:var(--ink)]">{company}</p>
          <p className="text-sm font-semibold text-[color:var(--muted)]">
            {role}
          </p>
          <p className="mt-1 text-xs font-bold text-[color:var(--primary)]">
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}