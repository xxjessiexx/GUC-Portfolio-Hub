import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppButton } from "@/components/ui/AppButton";

import StatusBadge from "@/components/common/StatusBadge";

import { notifications } from "@/data/studentDashboardData";
import { internshipsData } from "@/data/internshipsData";

const SAVED_INTERNSHIPS_KEY = "guc-saved-internships";
const APPLIED_INTERNSHIPS_KEY = "guc-applied-internships";

function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export default function Internships() {
  const [activeTab, setActiveTab] = useState("all");

  const savedIds = getStoredIds(SAVED_INTERNSHIPS_KEY);
  const appliedIds = getStoredIds(APPLIED_INTERNSHIPS_KEY);

  const tabs = [
    { key: "all", label: "All", count: internshipsData.length },
    { key: "saved", label: "Saved", count: savedIds.length },
    { key: "applied", label: "Applied", count: appliedIds.length },
  ];

  const filteredInternships = useMemo(() => {
    if (activeTab === "saved") {
      return internshipsData.filter((internship) =>
        savedIds.includes(internship.id)
      );
    }

    if (activeTab === "applied") {
      return internshipsData.filter((internship) =>
        appliedIds.includes(internship.id)
      );
    }

    return internshipsData;
  }, [activeTab, savedIds, appliedIds]);

  const emptyMessage =
    activeTab === "saved"
      ? "You have not saved any internships yet."
      : activeTab === "applied"
      ? "You have not applied to any internships yet."
      : "No internships are available right now.";

  return (
    <DashboardLayout notifications={notifications}>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <SectionHeader
            title="Internships"
            subtitle="Browse opportunities, view saved internships, and track applications."
          />

          <AppCard className="p-4">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.key}
                  label={tab.label}
                  count={tab.count}
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                />
              ))}
            </div>
          </AppCard>

          {filteredInternships.length === 0 ? (
            <EmptyInternshipsState message={emptyMessage} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {filteredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  isSaved={savedIds.includes(internship.id)}
                  isApplied={appliedIds.includes(internship.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}

function TabButton({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
        active
          ? "bg-[color:var(--primary)] text-white shadow-[var(--shadow-soft)]"
          : "bg-white/60 text-[color:var(--primary)] hover:bg-white/80"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active
            ? "bg-white/20 text-white"
            : "bg-[color:var(--accent)]/25 text-[color:var(--primary)]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function InternshipCard({ internship, isSaved, isApplied }) {
  return (
    <AppCard className="flex h-full flex-col p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--accent)]/30 text-[color:var(--primary)]">
          <Briefcase className="h-6 w-6" />
        </div>

        <div className="flex items-center gap-2">
          {isApplied && (
            <StatusBadge
              status="Applied"
              className="inline-flex items-center gap-1 bg-green-100 text-green-700"
            />
          )}

          {isSaved && (
            <Bookmark className="h-5 w-5 fill-[color:var(--primary)] text-[color:var(--primary)]" />
          )}
        </div>
      </div>

      {internship.featured && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-[color:var(--accent)]/25 px-3 py-1 text-xs font-black text-[color:var(--primary)]">
          Featured
        </span>
      )}

      <h2 className="text-xl font-black text-[color:var(--ink)]">
        {internship.title}
      </h2>

      <p className="mt-1 text-sm font-bold text-[color:var(--primary)]">
        {internship.company}
      </p>

      <div className="mt-4 space-y-2 text-sm font-semibold text-[color:var(--muted)]">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {internship.location}
        </p>

        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Deadline: {internship.deadline}
        </p>

        <p>
          {internship.duration} • {internship.workMode}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {internship.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[color:var(--accent)]/25 px-3 py-1 text-xs font-black text-[color:var(--primary)]"
          >
            {skill}
          </span>
        ))}
      </div>

      <Link to={`/internships/${internship.id}`} className="mt-auto">
        <AppButton className="mt-6 min-h-11 w-full rounded-2xl bg-[color:var(--primary)] font-black text-white hover:bg-[color:var(--dark)]">
          View Details
        </AppButton>
      </Link>
    </AppCard>
  );
}

function EmptyInternshipsState({ message }) {
  return (
    <AppCard className="p-10 text-center">
      <h2 className="text-2xl font-black text-[color:var(--ink)]">
        No internships found
      </h2>

      <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
        {message}
      </p>
    </AppCard>
  );
}