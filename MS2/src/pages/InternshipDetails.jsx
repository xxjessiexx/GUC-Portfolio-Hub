import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Send,
  Star,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import StatusBadge from "@/components/common/StatusBadge";

import { notifications } from "@/data/studentDashboardData";
import { internshipsData } from "@/data/internshipsData";

import { useUserProfile } from "@/context/UserProfileContext";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SAVED_INTERNSHIPS_KEY = "guc-saved-internships";
const APPLIED_INTERNSHIPS_KEY = "guc-applied-internships";

function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStoredIds(key, ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export default function InternshipDetails() {
  const { internshipId } = useParams();
  const internship = internshipsData.find((item) => item.id === internshipId);
  const { profile } = useUserProfile();

  const currentUser =
    profile || JSON.parse(sessionStorage.getItem("currentUser") || "null");

  const userRole =
    currentUser?.role ||
    currentUser?.systemRole ||
    currentUser?.accountRole ||
    "student";

  const isStudent = userRole === "student";

  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterError, setCoverLetterError] = useState("");
  const [savedIds, setSavedIds] = useState(() =>
    getStoredIds(SAVED_INTERNSHIPS_KEY)
  );
  const [appliedIds, setAppliedIds] = useState(() =>
    getStoredIds(APPLIED_INTERNSHIPS_KEY)
  );

  const relatedInternships = useMemo(() => {
    if (!internship) return [];

    return internshipsData
      .filter((item) => item.id !== internship.id)
      .slice(0, 3);
  }, [internship]);

  if (!internship) {
    return (
      <DashboardLayout notifications={notifications}>
        <main className="px-6 py-10">
          <AppCard className="p-8">
            <h1 className="text-3xl font-black text-[color:var(--ink)]">
              Internship not found
            </h1>

            <Link
              to="/internships"
              className="mt-4 inline-block font-bold text-[color:var(--primary)]"
            >
              Back to internships
            </Link>
          </AppCard>
        </main>
      </DashboardLayout>
    );
  }

  const isSaved = savedIds.includes(internship.id);
  const isApplied = appliedIds.includes(internship.id);

  const toggleSave = () => {
    const updated = isSaved
      ? savedIds.filter((id) => id !== internship.id)
      : [...savedIds, internship.id];

    setSavedIds(updated);
    saveStoredIds(SAVED_INTERNSHIPS_KEY, updated);
  };

   const confirmApply = () => {
      if (!isStudent) return;
      if (isApplied) return;

      if (!coverLetter.trim()) {
        setCoverLetterError("Cover letter is required before applying.");
        setApplyDialogOpen(false);
        return;
      }

      const updated = [...appliedIds, internship.id];
      setAppliedIds(updated);
      saveStoredIds(APPLIED_INTERNSHIPS_KEY, updated);
      setApplyDialogOpen(false);
    };

  return (
    <DashboardLayout notifications={notifications}>
      <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>

              <h1 className="text-4xl font-black tracking-tight text-[color:var(--ink)] sm:text-5xl">
                Internship Details
              </h1>

              <p className="mt-3 text-base font-semibold text-[color:var(--muted)]">
                Discover the details and apply for this opportunity.
              </p>
            </div>
            {isStudent && (
            <div className="flex flex-wrap gap-3">
              <AppButton
                type="button"
                onClick={toggleSave}
                className="min-h-12 rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-6 font-black text-[color:var(--primary)] hover:bg-[var(--surface-elevated)]"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaved ? "Saved" : "Save Internship"}
              </AppButton>

              <AppButton
                type="button"
                onClick={() => setApplyDialogOpen(true)}
                disabled={isApplied}
                className="min-h-12 rounded-2xl bg-[color:var(--primary)] px-8 font-black text-white hover:bg-[color:var(--dark)] disabled:opacity-60"
              >
                <Send className="mr-2 h-4 w-4" />
                {isApplied ? "Applied" : "Apply Now"}
              </AppButton>
            </div>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
            <div className="space-y-6">
              <AppCard className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="grid h-28 w-28 shrink-0 place-items-center rounded-[28px] bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-white shadow-[var(--shadow-soft)]">
                    <Briefcase className="h-12 w-12" />
                  </div>

                  <div className="flex-1">
                    {internship.featured && (
                      <StatusBadge status="Featured" />
                    )}

                    <h2 className="mt-4 text-3xl font-black text-[color:var(--ink)]">
                      {internship.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-bold text-[color:var(--muted)]">
                      <span className="text-[color:var(--primary)]">
                        {internship.company}
                      </span>

                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-[color:var(--gold)]" />
                        {internship.rating} ({internship.reviews} reviews)
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-[color:var(--muted)]">
                      <InfoPill icon={MapPin} text={internship.location} />
                      <InfoPill icon={Clock} text={internship.duration} />
                      <InfoPill icon={Briefcase} text={internship.workMode} />
                      <InfoPill icon={CalendarDays} text={internship.postedAt} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {internship.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[color:var(--accent)]/25 px-3 py-1 text-xs font-black text-[color:var(--primary)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AppCard>

              <AppCard className="p-6 sm:p-8">
                <div className="space-y-8">
                  <ContentSection title="Overview">
                    <p className="mt-3 text-sm font-semibold leading-7 text-[color:var(--muted)]">
                      {internship.overview}
                    </p>
                  </ContentSection>

                  <ContentSection title="Responsibilities">
                    <BulletList items={internship.responsibilities} />
                  </ContentSection>

                  <ContentSection title="Requirements">
                    <BulletList items={internship.requirements} />
                  </ContentSection>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <AppCard className="p-5">
                      <h3 className="text-xl font-black text-[color:var(--ink)]">
                        About the Company
                      </h3>

                      <p className="mt-3 text-sm font-semibold leading-7 text-[color:var(--muted)]">
                        {internship.companyAbout}
                      </p>
                    </AppCard>

                    <AppCard className="p-5">
                      <h3 className="text-xl font-black text-[color:var(--ink)]">
                        Perks & Benefits
                      </h3>

                      <div className="mt-3 space-y-2">
                        {internship.benefits.map((item) => (
                          <CheckItem key={item} text={item} />
                        ))}
                      </div>
                    </AppCard>
                  </div>
                </div>
              </AppCard>

              <AppCard className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-black text-[color:var(--ink)]">
                    Related Internships
                  </h3>

                  <Link
                    to="/internships"
                    className="text-sm font-black text-[color:var(--primary)]"
                  >
                    View all →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {relatedInternships.map((item) => (
                    <RelatedInternshipCard key={item.id} internship={item} />
                  ))}
                </div>
              </AppCard>
            </div>

            <aside className="space-y-6">
              <AppCard className="p-6">
                <h3 className="text-xl font-black text-[color:var(--ink)]">
                  Application Summary
                </h3>

                <div className="mt-5 space-y-4">
                  <SummaryRow label="Deadline" value={internship.deadline} />
                  <SummaryRow label="Duration" value={internship.duration} />
                  <SummaryRow label="Work Mode" value={internship.workMode} />
                  <SummaryRow label="Stipend" value={internship.stipend} />
                  <SummaryRow label="Start Date" value={internship.startDate} />
                  <SummaryRow label="Application Type" value="Individual" />
                </div>

                <div className="mt-6">
                  <h4 className="mb-3 font-black text-[color:var(--ink)]">
                    Eligibility
                  </h4>

                  <div className="space-y-2">
                    {internship.eligibility.map((item) => (
                      <CheckItem key={item} text={item} />
                    ))}
                  </div>
                </div>
              </AppCard>
              
              {isStudent && (
              <AppCard className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-[color:var(--ink)]">
                    Apply with Cover Letter <span className="ml-1 text-red-500">*</span>
                  </h3>

                  <StatusBadge status="Required" />
                </div>

                <p className="text-sm font-semibold leading-6 text-[color:var(--muted)]">
                  Write a short cover letter before submitting your application.
                </p>
                <div className="mt-5 rounded-2xl border border-white/70 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[color:var(--primary)]" />
                    <p className="text-sm font-black text-[color:var(--ink)]">
                      Cover Letter
                    </p>
                  </div>

                  <textarea
                    value={coverLetter}
                    onChange={(event) => {
                      setCoverLetter(event.target.value);
                      setCoverLetterError("");
                    }}
                    placeholder="Write a short message to the employer..."
                    maxLength={700}
                    className="min-h-36 w-full resize-none rounded-2xl border border-[color:var(--primary)]/10 bg-white/70 px-4 py-3 text-sm font-semibold leading-6 text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]/70 focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--ring-soft)] dark:border-white/10 dark:bg-white/[0.06]"
                  />

                  <p className="mt-2 text-xs font-bold text-[color:var(--muted)]">
                    {coverLetter.length}/700 characters
                  </p>
                  {coverLetterError && (
                    <p className="mt-2 text-xs font-black text-red-500">
                      {coverLetterError}
                    </p>
                  )}
                </div>

                <AppButton
                  type="button"
                  onClick={() => setApplyDialogOpen(true)}
                  disabled={isApplied}
                  className="mt-5 min-h-12 w-full rounded-2xl bg-[color:var(--primary)] font-black text-white hover:bg-[color:var(--dark)] disabled:opacity-60"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isApplied ? "Applied" : "Apply Now"}
                </AppButton>

                {isApplied && (
                  <p className="mt-3 text-center text-sm font-black text-[color:var(--primary)]">
                    Application submitted successfully.
                  </p>
                )}
              </AppCard>
              )}
            </aside>
          </div>
        </div>
      </main>

      <AlertDialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <AlertDialogContent className="z-[9999] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(44,57,71,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#102030]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[color:var(--ink)]">
              Apply to this internship?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base leading-7 text-[color:var(--muted)]">
              Are you sure you want to apply to "{internship.title}" at{" "}
              {internship.company}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmApply}
              className="rounded-2xl bg-[color:var(--primary)] font-bold text-white hover:bg-[color:var(--dark)]"
            >
              Yes, Apply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

function InfoPill({ icon: Icon, text }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );
}

function ContentSection({ title, children }) {
  return (
    <section>
      <h3 className="text-2xl font-black text-[color:var(--ink)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-semibold leading-7 text-[color:var(--muted)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function CheckItem({ text }) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)]">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      {text}
    </p>
  );
}

function RelatedInternshipCard({ internship }) {
  return (
    <Link to={`/internships/${internship.id}`}>
      <div className="rounded-2xl border border-white/70 bg-white/55 p-4 transition hover:-translate-y-1 hover:bg-white/75">
        <h4 className="font-black text-[color:var(--ink)]">
          {internship.title}
        </h4>

        <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
          {internship.company}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {internship.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[color:var(--accent)]/25 px-2 py-1 text-xs font-black text-[color:var(--primary)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--primary)]/10 pb-3 text-sm">
      <span className="font-black text-[color:var(--dark)]">{label}</span>
      <span className="text-right font-semibold text-[color:var(--muted)]">
        {value}
      </span>
    </div>
  );
}