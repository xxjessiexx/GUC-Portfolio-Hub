import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bookmark,
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  Search,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";

import FilterSelect from "@/components/common/FilterSelect";
import StatusBadge from "@/components/common/StatusBadge";

import { notifications } from "@/data/studentDashboardData";

const applications = [
  {
    id: "app-1",
    internshipId: "int-1",
    company: "Greenbyte Solutions",
    title: "Software Engineering Intern",
    location: "Cairo, Egypt",
    duration: "4–6 months",
    dateApplied: "2026-05-08",
    displayDate: "May 8, 2026",
    status: "Under Review",
    nextStep: "Application under review",
    note: "We will update you soon.",
  },
  {
    id: "app-2",
    internshipId: "int-2",
    company: "CodeWave Labs",
    title: "Frontend Developer Intern",
    location: "Remote",
    duration: "3 months",
    dateApplied: "2026-05-07",
    displayDate: "May 7, 2026",
    status: "Pending",
    nextStep: "Technical interview pending",
    note: "Waiting for employer confirmation.",
  },
  {
    id: "app-3",
    internshipId: "int-3",
    company: "DesignLab Cairo",
    title: "UI/UX Design Intern",
    location: "Cairo, Egypt",
    duration: "2 months",
    dateApplied: "2026-05-05",
    displayDate: "May 5, 2026",
    status: "Accepted",
    nextStep: "Accept offer by May 20",
    note: "Confirm your acceptance.",
  },
  {
    id: "app-4",
    internshipId: "int-1",
    company: "Nova Labs",
    title: "Product Design Intern",
    location: "New Cairo, Egypt",
    duration: "3–6 months",
    dateApplied: "2026-05-02",
    displayDate: "May 2, 2026",
    status: "Rejected",
    nextStep: "Feedback available",
    note: "Check your email for details.",
  },
  {
    id: "app-5",
    internshipId: "int-2",
    company: "DataPeak",
    title: "Data Analyst Intern",
    location: "Remote",
    duration: "3 months",
    dateApplied: "2026-04-28",
    displayDate: "Apr 28, 2026",
    status: "Under Review",
    nextStep: "Portfolio review",
    note: "The team is reviewing your work.",
  },
];

const savedApplications = [
  {
    id: "saved-1",
    internshipId: "int-1",
    title: "Software Engineering Intern",
    company: "Greenbyte Solutions",
  },
  {
    id: "saved-2",
    internshipId: "int-2",
    title: "Frontend Developer Intern",
    company: "CodeWave Labs",
  },
  {
    id: "saved-3",
    internshipId: "int-3",
    title: "UI/UX Design Intern",
    company: "DesignLab Cairo",
  },
];

export default function MyApplications() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedDate, setSelectedDate] = useState("");

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
        !selectedDate || application.dateApplied === selectedDate;

      return (
        matchesSearch &&
        matchesTab &&
        matchesStatus &&
        matchesCompany &&
        matchesDate
      );
    });
  }, [activeTab, searchTerm, selectedStatus, selectedCompany, selectedDate]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All Statuses");
    setSelectedCompany("All Companies");
    setSelectedDate("");
    setActiveTab("All");
  };

  return (
    <DashboardLayout notifications={notifications}>
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
              <AppCard className="p-5">
                <div className="grid items-center gap-4 lg:grid-cols-[1.3fr_240px_240px_240px_auto]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by company or role..."
                      className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 font-semibold text-[color:var(--ink)]"
                    />
                  </div>

                  <FilterSelect
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={[
                      "All Statuses",
                      "Under Review",
                      "Pending",
                      "Accepted",
                      "Rejected",
                    ]}
                  />

                  <FilterSelect
                    value={selectedCompany}
                    onChange={setSelectedCompany}
                    options={companies}
                  />

                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 pr-3 text-sm font-black text-[color:var(--ink)] shadow-sm"
                    />
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-black text-red-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                </div>
              </AppCard>

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

                <div className="hidden grid-cols-[1.4fr_0.6fr_0.7fr_1fr_auto] border-b border-[color:var(--primary)]/10 px-6 py-4 text-sm font-black text-[color:var(--dark)] lg:grid">
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
                      className="grid gap-4 border-b border-[color:var(--primary)]/10 px-6 py-5 last:border-b-0 lg:grid-cols-[1.4fr_0.6fr_0.7fr_1fr_auto] lg:items-center"
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
                        <AppButton className="rounded-2xl border border-white/70 bg-white/60 px-4 font-black text-[color:var(--primary)] hover:bg-white/80">
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

                <InterviewCard
                  day="22"
                  month="May"
                  company="Greenbyte Solutions"
                  role="Software Engineering Intern"
                  time="May 22, 2026 • 2:00 PM"
                />

                <InterviewCard
                  day="24"
                  month="May"
                  company="CodeWave Labs"
                  role="Frontend Developer Intern"
                  time="May 24, 2026 • 11:00 AM"
                />
              </AppCard>

              <AppCard className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-[color:var(--primary)]" />
                  <h2 className="text-xl font-black text-[color:var(--ink)]">
                    Saved Internships
                  </h2>
                </div>

                <div className="space-y-3">
                  {savedApplications.map((item) => (
                    <Link key={item.id} to={`/internships/${item.internshipId}`}>
                      <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-4 transition hover:bg-white/75">
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
                  ))}
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
          ? "bg-[color:var(--accent)]/25 text-[color:var(--primary)]"
          : "bg-white/30 text-[color:var(--muted)] hover:bg-white/50"
      }`}
    >
      {label}
      <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-xs">
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
    <div className="mb-3 rounded-2xl border border-white/70 bg-white/55 p-4 last:mb-0">
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