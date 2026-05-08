import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import InitialsAvatar from "@/components/common/InitialsAvatar";
import MetricCard from "@/components/common/MetricCard";
import FilterSelect from "@/components/common/FilterSelect";
import AppModal from "@/components/common/AppModal";

import { notifications } from "@/data/studentDashboardData";
import FilterPanel from "@/components/common/FilterPanel";

const applicantsData = [
  {
    id: "applicant-1",
    name: "Omar Hassan",
    university: "GUC",
    major: "Computer Science",
    semester: "6th",
    skills: ["Python", "Django", "AWS", "SQL"],
    strength: "Excellent",
    projects: 8,
    score: 95,
    status: "Shortlisted",
    portfolioId: "portfolio-omar",
  },
  {
    id: "applicant-2",
    name: "Nouran Mohamed",
    university: "GUC",
    major: "Computer Science",
    semester: "5th",
    skills: ["React", "TypeScript", "Node.js", "UI/UX"],
    strength: "Excellent",
    projects: 7,
    score: 92,
    status: "Shortlisted",
    portfolioId: "portfolio-nouran",
  },
  {
    id: "applicant-3",
    name: "Youssef Ahmed",
    university: "Ain Shams University",
    major: "Software Engineering",
    semester: "6th",
    skills: ["Java", "Spring Boot", "Docker", "SQL"],
    strength: "Excellent",
    projects: 6,
    score: 89,
    status: "Nominated",
    portfolioId: "portfolio-youssef",
  },
  {
    id: "applicant-4",
    name: "Hana Ashraf",
    university: "GUC",
    major: "Information Systems",
    semester: "4th",
    skills: ["Figma", "UI/UX", "React", "CSS"],
    strength: "Very Good",
    projects: 5,
    score: 87,
    status: "Shortlisted",
    portfolioId: "portfolio-hana",
  },
  {
    id: "applicant-5",
    name: "Ahmed Tarek",
    university: "Helwan University",
    major: "Computer Science",
    semester: "5th",
    skills: ["Python", "Django", "PostgreSQL", "API"],
    strength: "Very Good",
    projects: 4,
    score: 84,
    status: "Nominated",
    portfolioId: "portfolio-ahmed",
  },
  {
    id: "applicant-6",
    name: "Malak Ayman",
    university: "GUC",
    major: "Computer Science",
    semester: "4th",
    skills: ["C++", "Data Structures", "OOP"],
    strength: "Good",
    projects: 3,
    score: 78,
    status: "Reviewing",
    portfolioId: "portfolio-malak",
  },
  {
    id: "applicant-7",
    name: "Kareem Mostafa",
    university: "Cairo University",
    major: "Software Engineering",
    semester: "6th",
    skills: ["Go", "Docker", "Kubernetes", "SQL"],
    strength: "Good",
    projects: 3,
    score: 76,
    status: "Accepted",
    portfolioId: "portfolio-kareem",
  },
  {
    id: "applicant-8",
    name: "Salma Ahmed",
    university: "Mansoura University",
    major: "Information Systems",
    semester: "5th",
    skills: ["JavaScript", "React", "Node.js"],
    strength: "Fair",
    projects: 2,
    score: 68,
    status: "Rejected",
    portfolioId: "portfolio-salma",
  },
];

const favoriteCandidates = [
  { name: "Mariam Khaled", match: 86 },
  { name: "Omar Adel", match: 82 },
  { name: "Salma Tamer", match: 79 },
];

function statusStyles(status) {
  if (status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  if (status === "Nominated")
    return "bg-[color:var(--gold)]/25 text-[color:var(--primary)]";
  if (status === "Shortlisted")
    return "bg-[color:var(--accent)]/30 text-[color:var(--primary)]";
  return "bg-purple-100 text-purple-700";
}

export default function ManageApplicants() {
  const navigate = useNavigate();
  const { internshipId } = useParams();

  const [applicants, setApplicants] = useState(applicantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All Majors");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Top Score");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const majors = ["All Majors", ...new Set(applicants.map((a) => a.major))];
  const semesters = [
    "All Semesters",
    ...new Set(applicants.map((a) => a.semester)),
  ];

  const filteredApplicants = useMemo(() => {
    const filtered = applicants.filter((applicant) => {
      const searchableText = [
        applicant.name,
        applicant.university,
        applicant.major,
        applicant.semester,
        ...applicant.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesMajor =
        selectedMajor === "All Majors" || applicant.major === selectedMajor;

      const matchesSemester =
        selectedSemester === "All Semesters" ||
        applicant.semester === selectedSemester;

      const matchesStatus =
        selectedStatus === "All Statuses" ||
        applicant.status === selectedStatus;

      return matchesSearch && matchesMajor && matchesSemester && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Top Score") return b.score - a.score;
      if (sortBy === "Top Contributors") return b.projects - a.projects;
      if (sortBy === "Name A-Z") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [
    applicants,
    searchTerm,
    selectedMajor,
    selectedSemester,
    selectedStatus,
    sortBy,
  ]);

  const stats = {
    total: applicants.length,
    shortlisted: applicants.filter((a) => a.status === "Shortlisted").length,
    accepted: applicants.filter((a) => a.status === "Accepted").length,
    rejected: applicants.filter((a) => a.status === "Rejected").length,
  };

  const updateApplicantStatus = (id, status) => {
    setApplicants((current) =>
      current.map((applicant) =>
        applicant.id === id ? { ...applicant, status } : applicant
      )
    );
  };

  const exportCandidates = () => {
    const headers = [
      "Name",
      "University",
      "Major",
      "Semester",
      "Skills",
      "Portfolio Strength",
      "Projects",
      "Score",
      "Status",
    ];

    const rows = applicants.map((a) => [
      a.name,
      a.university,
      a.major,
      a.semester,
      a.skills.join(" | "),
      a.strength,
      a.projects,
      a.score,
      a.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "internship-candidates.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout notifications={notifications}>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                Applicants — Software Engineering Intern
              </h1>

              <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
                Greenbyte Solutions • Internship ID: {internshipId}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AppButton className="rounded-2xl border border-white/70 bg-white/60 px-5 font-black text-[color:var(--primary)] hover:bg-white/80">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Search
              </AppButton>

              <AppButton
                onClick={exportCandidates}
                className="rounded-2xl bg-[color:var(--primary)] px-5 font-black text-white hover:bg-[color:var(--dark)]"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Candidates
              </AppButton>
            </div>
          </div>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Applicants"
              value={stats.total}
              icon={Users}
              helper="100% of all applicants"
            />
            <MetricCard
              title="Shortlisted"
              value={stats.shortlisted}
              icon={Bookmark}
              helper="Initial strong matches"
            />
            <MetricCard
              title="Accepted"
              value={stats.accepted}
              icon={CheckCircle2}
              helper="Confirmed candidates"
            />
            <MetricCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              helper="Not selected"
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
            <div className="space-y-6">
              <AppCard className="p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative min-w-[260px] flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, skills, or university..."
                      className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 font-semibold text-[color:var(--ink)]"
                    />
                  </div>

                  <div className="w-[14rem]">
                    <FilterSelect
                      value={`Sort by: ${sortBy}`}
                      onChange={(value) => setSortBy(value.replace("Sort by: ", ""))}
                      options={[
                        "Sort by: Top Score",
                        "Sort by: Top Contributors",
                        "Sort by: Name A-Z",
                      ]}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setFiltersOpen((current) => !current)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-5 text-sm font-black text-[color:var(--primary)] shadow-sm transition hover:bg-white/80"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                </div>

                {filtersOpen && (
                  <FilterPanel
                    title="Filter applicants"
                    onClear={() => {
                      setSelectedMajor("All Majors");
                      setSelectedSemester("All Semesters");
                      setSelectedStatus("All Statuses");
                    }}
                  >
                    <FilterSelect
                      value={`Major: ${selectedMajor}`}
                      onChange={(value) =>
                        setSelectedMajor(value.replace("Major: ", ""))
                      }
                      options={majors.map((major) => `Major: ${major}`)}
                    />

                    <FilterSelect
                      value={`Semester: ${selectedSemester}`}
                      onChange={(value) =>
                        setSelectedSemester(value.replace("Semester: ", ""))
                      }
                      options={semesters.map(
                        (semester) => `Semester: ${semester}`
                      )}
                    />

                    <FilterSelect
                      value={`Status: ${selectedStatus}`}
                      onChange={(value) =>
                        setSelectedStatus(value.replace("Status: ", ""))
                      }
                      options={[
                        "Status: All Statuses",
                        "Status: Shortlisted",
                        "Status: Nominated",
                        "Status: Accepted",
                        "Status: Rejected",
                        "Status: Reviewing",
                      ]}
                    />
                  </FilterPanel>
                )}
              </AppCard>

              <AppCard className="overflow-hidden">
                <div className="hidden grid-cols-[1.35fr_0.85fr_0.65fr_1.1fr_0.9fr_0.55fr_0.55fr_0.8fr_0.75fr] border-b border-[color:var(--primary)]/10 px-5 py-4 text-sm font-black text-[color:var(--dark)] lg:grid">
                  <p>Applicant</p>
                  <p>Major</p>
                  <p>Semester</p>
                  <p>Top Skills</p>
                  <p>Strength</p>
                  <p>Projects</p>
                  <p>Score</p>
                  <p>Status</p>
                  <p>Actions</p>
                </div>

                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="grid gap-4 border-b border-[color:var(--primary)]/10 px-5 py-5 last:border-b-0 lg:grid-cols-[1.35fr_0.85fr_0.65fr_1.1fr_0.9fr_0.55fr_0.55fr_0.8fr_0.75fr] lg:items-center"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/portfolio/${applicant.portfolioId}`)
                      }
                      className="flex items-center gap-3 text-left"
                    >
                      <InitialsAvatar name={applicant.name} />

                      <div>
                        <p className="font-black text-[color:var(--ink)] hover:text-[color:var(--primary)]">
                          {applicant.name}
                          <Star className="ml-1 inline h-3.5 w-3.5 fill-[color:var(--gold)] text-[color:var(--gold)]" />
                        </p>
                        <p className="text-sm font-semibold text-[color:var(--muted)]">
                          {applicant.university}
                        </p>
                      </div>
                    </button>

                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      {applicant.major}
                    </p>

                    <p className="text-sm font-semibold text-[color:var(--muted)]">
                      {applicant.semester}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {applicant.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[color:var(--accent)]/25 px-2 py-1 text-[10px] font-black text-[color:var(--primary)]"
                        >
                          {skill}
                        </span>
                      ))}

                      {applicant.skills.length > 3 && (
                        <span className="text-xs font-black text-[color:var(--muted)]">
                          +{applicant.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <StrengthBar strength={applicant.strength} />

                    <p className="text-sm font-black text-[color:var(--ink)]">
                      {applicant.projects}
                    </p>

                    <span className="w-fit rounded-xl bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">
                      {applicant.score}
                    </span>

                    <Select
                      value={applicant.status}
                      onValueChange={(value) =>
                        updateApplicantStatus(applicant.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`h-10 rounded-2xl border-0 px-3 text-xs font-black shadow-sm ${statusStyles(
                          applicant.status
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="z-[9999] rounded-2xl"
                      >
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Nominated">Nominated</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Reviewing">Reviewing</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/portfolio/${applicant.portfolioId}`)
                        }
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 text-[color:var(--primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 text-[color:var(--primary)]"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </AppCard>
            </div>

            <aside className="space-y-6">
              <AppCard className="p-6">
                <SideHeader title="Shortlisted" action="View all" />

                {applicants
                  .filter((a) => a.status === "Shortlisted")
                  .slice(0, 4)
                  .map((candidate) => (
                    <CandidateMini key={candidate.id} candidate={candidate} />
                  ))}
              </AppCard>

              <AppCard className="p-6">
                <SideHeader title="Suggested from Favorites" action="View all" />

                {favoriteCandidates.map((candidate) => (
                  <div
                    key={candidate.name}
                    className="mb-3 flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-4 last:mb-0"
                  >
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={candidate.name} />
                      <div>
                        <p className="font-black text-[color:var(--ink)]">
                          {candidate.name}
                        </p>
                        <p className="text-sm font-semibold text-[color:var(--muted)]">
                          Match {candidate.match}%
                        </p>
                      </div>
                    </div>

                    <span className="rounded-xl bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">
                      {candidate.match}
                    </span>
                  </div>
                ))}
              </AppCard>

              <AppCard className="p-6">
                <SideHeader title="Upcoming Interviews" action="View calendar" />

                <Interview
                  day="22"
                  name="Omar Hassan"
                  type="Technical Interview"
                  time="11:00 AM"
                />
                <Interview
                  day="22"
                  name="Nouran Mohamed"
                  type="Behavioral Interview"
                  time="1:30 PM"
                />
                <Interview
                  day="23"
                  name="Youssef Ahmed"
                  type="Technical Interview"
                  time="10:00 AM"
                />
              </AppCard>

              <AppCard className="p-6">
                <div className="flex gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--accent)]/25 text-[color:var(--primary)]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-black text-[color:var(--ink)]">
                      Add notes & feedback
                    </h2>

                    <p className="mt-1 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                      Collaborate with your team and track applicant feedback.
                    </p>

                    <AppButton
                      type="button"
                      onClick={() => setNotesOpen(true)}
                      className="mt-4 rounded-2xl border border-white/70 bg-white/60 px-5 font-black text-[color:var(--primary)]"
                    >
                      Open Notes
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            </aside>
          </div>
        </div>

        {notesOpen && (
          <AppModal
            title="Applicant Notes & Feedback"
            onClose={() => setNotesOpen(false)}
            maxWidth="max-w-xl"
          >
            <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
              Add internal notes for your hiring team.
            </p>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write feedback, interview comments, or next steps..."
              className="mt-5 min-h-[180px] w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white p-4 font-semibold text-[color:var(--ink)] outline-none focus:ring-4 focus:ring-[color:var(--accent)]/25"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="h-12 rounded-2xl border border-gray-200 bg-white px-6 font-black text-[color:var(--muted)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="h-12 rounded-2xl bg-[color:var(--primary)] px-6 font-black text-white"
              >
                Save Notes
              </button>
            </div>
          </AppModal>
        )}
      </main>
    </DashboardLayout>
  );
}

function StrengthBar({ strength }) {
  const count =
    strength === "Excellent"
      ? 5
      : strength === "Very Good"
      ? 4
      : strength === "Good"
      ? 3
      : 2;

  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <span
            key={item}
            className={`h-1.5 w-6 rounded-full ${
              item <= count ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
        {strength}
      </p>
    </div>
  );
}

function SideHeader({ title, action }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-xl font-black text-[color:var(--ink)]">{title}</h2>
      <button
        type="button"
        className="text-sm font-black text-[color:var(--primary)]"
      >
        {action}
      </button>
    </div>
  );
}

function CandidateMini({ candidate }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/70 bg-white/55 p-4 last:mb-0">
      <div className="flex items-center gap-3">
        <InitialsAvatar name={candidate.name} />
        <div>
          <p className="font-black text-[color:var(--ink)]">{candidate.name}</p>
          <p className="text-sm font-semibold text-[color:var(--muted)]">
            Match {candidate.score}%
          </p>
        </div>
      </div>

      <span className="rounded-xl bg-green-100 px-2.5 py-1 text-xs font-black text-green-700">
        {candidate.score}
      </span>
    </div>
  );
}

function Interview({ day, name, type, time }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 last:mb-0">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--accent)]/25 text-center">
        <div>
          <p className="text-xs font-black text-[color:var(--primary)]">MAY</p>
          <p className="text-lg font-black text-[color:var(--ink)]">{day}</p>
        </div>
      </div>

      <div className="flex-1">
        <p className="font-black text-[color:var(--ink)]">{name}</p>
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {type}
        </p>
      </div>

      <span className="text-xs font-bold text-[color:var(--muted)]">
        {time}
      </span>
    </div>
  );
}