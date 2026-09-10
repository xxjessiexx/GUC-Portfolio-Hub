import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Star,
  Users,
  Pencil,
} from "lucide-react";

import { AdminActionDialog } from "@/components/adminModule/AdminActionDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppButton } from "@/components/ui/AppButton";
import NotificationToast from "@/components/notificationPage/notificationsToast";
import { useUserProfile } from "@/context/UserProfileContext";

import {
  getCurrentUser,
  getInternshipById,
  getInternships,
  applyToInternship,
  toggleSavedInternship,
} from "@/data/demoStore";

function getLocationLabel(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value.label ||
      value.name ||
      value.address ||
      value.city ||
      fallback
    );
  }

  return String(value);
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  return [];
}

function normalizeInternshipDetails(internship) {
  if (!internship) return null;

  const responsibilities = normalizeArray(internship.responsibilities);
  const requirements = normalizeArray(internship.requirements);
  const benefits = normalizeArray(internship.benefits);
  const eligibility = normalizeArray(internship.eligibility);

  return {
    ...internship,
    company:
      internship.company ||
      internship.companyName ||
      internship.employer?.companyName ||
      internship.employer?.name ||
      "Company",
    rating: internship.rating || internship.companyRating || 4.5,
    reviews:
      internship.reviews ||
      Math.max(18, normalizeArray(internship.applications).length * 8),
    skills: normalizeArray(
      internship.skills ||
        internship.requiredSkills ||
        internship.tags ||
        internship.technologies
    ),
    overview:
      internship.overview ||
      internship.description ||
      internship.summary ||
      "This internship provides hands-on experience, mentorship, and exposure to real project work.",
    responsibilities: responsibilities.length
      ? responsibilities
      : normalizeArray(internship.tasks).length
      ? normalizeArray(internship.tasks)
      : [
          "Contribute to real team projects and product features.",
          "Collaborate with mentors and team members.",
          "Document progress and communicate clearly.",
          "Participate in reviews, feedback sessions, and technical discussions.",
        ],
    requirements: requirements.length
      ? requirements
      : normalizeArray(internship.qualifications).length
      ? normalizeArray(internship.qualifications)
      : [
          "Strong interest in the internship field.",
          "Good communication and teamwork skills.",
          "Ability to learn independently and ask clear questions.",
          "Basic knowledge of the tools or technologies listed.",
        ],
    benefits: benefits.length
      ? benefits
      : [
          "Mentorship from experienced team members",
          "Hands-on project experience",
          "Portfolio-ready work",
          "Certificate or recommendation based on performance",
        ],
    eligibility: eligibility.length
      ? eligibility
      : [
          "GUC student or recent graduate",
          "Relevant academic or project background",
          "Availability during the internship duration",
        ],
    companyAbout:
      internship.companyAbout ||
      internship.companyDescription ||
      internship.employer?.bio ||
      internship.employer?.companyBio ||
      `${
        internship.company || internship.companyName || "The company"
      } offers practical internship opportunities for students to gain real-world experience.`,
    deadline:
      internship.deadline ||
      internship.applicationDeadline ||
      internship.closesAt ||
      "Not specified",
    stipend: internship.stipend || "Undisclosed",
    startDate: internship.startDate || "Flexible",
    workMode: internship.workMode || internship.mode || "Not specified",
    duration: internship.duration || internship.period || "Not specified",
    location: getLocationLabel(internship.location || internship.workLocation, "Not specified"),
    postedAt: internship.postedAt || internship.createdAt || "Posted recently",
  };
}

function userAppliedToInternship(internship, user) {
  if (!internship || !user?.id) return false;

  return normalizeArray(internship.applications).some((application) => {
    if (typeof application === "string") {
      return application === user.id || application === user.email;
    }

    return (
      application.studentId === user.id ||
      application.applicantId === user.id ||
      application.userId === user.id ||
      application.studentEmail === user.email ||
      application.applicantEmail === user.email
    );
  });
}

function MetaItem({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#6F8290] dark:text-[#9BB0BE]">
      <Icon className="h-3.5 w-3.5 text-[#55758B] dark:text-[#9CD5FF]" />
      {children}
    </span>
  );
}

function EditorialList({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="grid grid-cols-[14px_minmax(0,1fr)] gap-3 text-[13.5px] font-semibold leading-6 text-[#586F7E] dark:text-[#B2C1CA]"
        >
          <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[#7AAACE]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function QuietLabel({ children }) {
  return (
    <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#B18C2E] dark:text-[#E7C66B]">
      {children}
    </span>
  );
}

function RelatedOpportunity({ internship }) {
  return (
    <Link
      to={`/internships/${internship.id}`}
      className="
        group block overflow-hidden rounded-[16px]
        border border-[#C9DBE4]
        bg-[#F8FBFC] p-4
        transition
        hover:-translate-y-[2px]
        hover:border-[#9AB9CB]
        hover:shadow-[0_12px_26px_rgba(53,88,114,0.09)]
        dark:border-white/10
        dark:bg-white/[0.035]
        dark:hover:border-[#7AAACE]/45
      "
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6F8391] dark:text-[#8FA5B4]">
        {internship.company}
      </p>

      <h3 className="mt-1.5 line-clamp-2 text-[15px] font-black leading-5 tracking-[-0.025em] text-[color:var(--ink)] transition group-hover:text-[#355872] dark:group-hover:text-[#9CD5FF]">
        {internship.title}
      </h3>

      <p className="mt-2 text-[10.5px] font-semibold text-[color:var(--muted)]">
        {getLocationLabel(internship.location, "Not specified")} · {internship.workMode} · {internship.duration}
      </p>

      <span className="mt-3 inline-flex text-[10.5px] font-black text-[#55758B] transition group-hover:translate-x-1 dark:text-[#9CD5FF]">
        Open opportunity →
      </span>
    </Link>
  );
}

export default function InternshipDetails() {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const { profile } = useUserProfile();

  const [internship, setInternship] = useState(null);
  const [allInternships, setAllInternships] = useState([]);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterError, setCoverLetterError] = useState("");
  const [feedbackToast, setFeedbackToast] = useState(null);

  const currentUser =
    getCurrentUser() ||
    profile ||
    JSON.parse(sessionStorage.getItem("currentUser") || "null");

  const userRole =
    currentUser?.role ||
    currentUser?.systemRole ||
    currentUser?.accountRole ||
    "student";

  const isStudent = userRole === "student";
  const isEmployer = userRole === "employer";

  const isOwner =
    isEmployer &&
    internship &&
    String(internship.employerId || "") === String(currentUser?.id || "");

  const refreshDetails = () => {
    setInternship(
      normalizeInternshipDetails(getInternshipById(internshipId))
    );
    setAllInternships(
      getInternships().map(normalizeInternshipDetails)
    );
  };

  useEffect(() => {
    refreshDetails();
  }, [internshipId]);

  const relatedInternships = useMemo(() => {
    if (!internship) return [];

    const sameCompany = allInternships.filter(
      (item) =>
        item.id !== internship.id &&
        item.company === internship.company
    );

    const others = allInternships.filter(
      (item) =>
        item.id !== internship.id &&
        item.company !== internship.company
    );

    return [...sameCompany, ...others].slice(0, 3);
  }, [allInternships, internship]);

  const showFeedback = (title, message, type = "info") => {
    setFeedbackToast({
      id: `feedback-${Date.now()}`,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
    });
  };

  if (!internship) {
    return (
      <DashboardLayout>
        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1480px]">
            <h1 className="text-3xl font-black text-[color:var(--ink)]">
              Internship not found
            </h1>
            <Link
              to={isEmployer ? "/manage-internships" : "/internships"}
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#355872] dark:text-[#9CD5FF]"
            >
              <ArrowLeft className="h-4 w-4" />
              {isEmployer ? "Back to manage internships" : "Back to internships"}
            </Link>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  const isSaved = Boolean(
    currentUser?.savedInternshipIds?.includes(internship.id) ||
      currentUser?.bookmarkedInternshipIds?.includes(internship.id) ||
      currentUser?.savedInternships?.includes(internship.id)
  );

  const isApplied = userAppliedToInternship(
    internship,
    currentUser
  );

  const toggleSave = () => {
    const wasSaved = isSaved;
    toggleSavedInternship(internship.id);
    refreshDetails();

    showFeedback(
      wasSaved ? "Removed from saved internships" : "Internship saved",
      wasSaved
        ? `${internship.title} was removed from your saved internships.`
        : `${internship.title} was added to your saved internships.`,
      "internship"
    );
  };

  const openApplyConfirmation = () => {
    if (!isStudent || isApplied) return;

    if (!coverLetter.trim()) {
      setCoverLetterError(
        "Add a short cover letter before applying."
      );
      return;
    }

    setCoverLetterError("");
    setApplyDialogOpen(true);
  };

  const confirmApply = () => {
    if (!isStudent || isApplied || !coverLetter.trim()) return;

    const created = applyToInternship(internship.id, coverLetter.trim());
    setApplyDialogOpen(false);

    if (!created) {
      showFeedback(
        "Application not submitted",
        "Something went wrong while submitting your application.",
        "application-error"
      );
      return;
    }

    setCoverLetter("");
    setCoverLetterError("");
    refreshDetails();

    showFeedback(
      "Application submitted",
      `Your application for ${internship.title} was sent successfully.`,
      "application"
    );
  };

  return (
    <DashboardLayout>
      <main className="px-4 py-5 pb-20 sm:px-6 lg:px-7 xl:px-8">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="mb-5 flex items-center justify-between gap-4">
            

            {isStudent ? (
              <button
                type="button"
                onClick={toggleSave}
                className={`
                  inline-flex h-9 items-center gap-2 rounded-[10px]
                  border px-3 text-[11px] font-black transition
                  ${
                    isSaved
                      ? "border-[#D6B75C] bg-[#FFF8E2] text-[#8A6C16] dark:border-[#E5C66D]/35 dark:bg-[#E5C66D]/10 dark:text-[#E5C66D]"
                      : "border-[#C3D5DE] bg-[#F5F9FB] text-[#355872] hover:border-[#7AAACE] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#BBDFF5]"
                  }
                `}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </button>
            ) : null}
          </div>

          <header className="mb-6">
            <div className="mb-3 h-[3px] w-10 rounded-full bg-[var(--gold)]" />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#5F7D90] dark:text-[#8DA8B8]">
                {internship.company}
              </p>

              {internship.featured ? (
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B18C2E] dark:text-[#E7C66B]">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-2 max-w-[980px] text-[42px] font-black leading-[1.02] tracking-[-0.05em] text-[color:var(--ink)] sm:text-[52px]">
              {internship.title}
            </h1>

            <p className="mt-4 max-w-4xl text-[14px] font-semibold leading-7 text-[color:var(--muted)]">
              {internship.overview}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <MetaItem icon={MapPin}>{getLocationLabel(internship.location, "Not specified")}</MetaItem>
              <MetaItem icon={BriefcaseBusiness}>{internship.workMode}</MetaItem>
              <MetaItem icon={Clock3}>{internship.duration}</MetaItem>
              <MetaItem icon={CalendarDays}>{internship.postedAt}</MetaItem>
              <MetaItem icon={Star}>
                {internship.rating} ({internship.reviews})
              </MetaItem>
            </div>

            {internship.skills.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {internship.skills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full border border-[#C6D8E1]
                      bg-[#EEF4F7] px-3 py-1.5
                      text-[10.5px] font-black text-[#355872]
                      dark:border-white/10 dark:bg-white/[0.045]
                      dark:text-[#9CD5FF]
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <section
            className="
              overflow-hidden rounded-[24px]
              border border-[#C9DBE4]
              bg-[#F3F7F9]
              shadow-[0_16px_38px_rgba(53,88,114,0.09)]
              dark:border-white/10
              dark:bg-[#0D2130]
            "
          >
            <div className="grid xl:grid-cols-[minmax(0,1fr)_370px]">
              <div className="min-w-0">
                <section className="px-6 py-6 sm:px-7 lg:px-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <h2 className="text-[26px] font-black tracking-[-0.038em] text-[color:var(--ink)]">
                        What you’ll do
                      </h2>
                      <div className="mt-2 h-[2px] w-8 rounded-full bg-[#D6B65A]" />
                      <EditorialList items={internship.responsibilities} />
                    </div>

                    <div className="border-t border-[#D1DFE6] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-white/10">
                      <h2 className="text-[26px] font-black tracking-[-0.038em] text-[color:var(--ink)]">
                        What we’re looking for
                      </h2>
                      <div className="mt-2 h-[2px] w-8 rounded-full bg-[#D6B65A]" />
                      <EditorialList items={internship.requirements} />
                    </div>
                  </div>
                </section>

                <section className="border-t border-[#D1DFE6] bg-[#EAF1F5]/70 px-6 py-6 sm:px-7 lg:px-8 dark:border-white/10 dark:bg-white/[0.02]">
                  <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6B8291] dark:text-[#8FA5B4]">
                        About the company
                      </p>
                      <h2 className="mt-2 text-[21px] font-black tracking-[-0.03em] text-[color:var(--ink)]">
                        {internship.company}
                      </h2>
                      <p className="mt-3 max-w-3xl text-[13px] font-semibold leading-7 text-[#617887] dark:text-[#A8BAC5]">
                        {internship.companyAbout}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6B8291] dark:text-[#8FA5B4]">
                        What you’ll get
                      </p>

                      <div className="mt-3 grid gap-2.5">
                        {internship.benefits.map((item) => (
                          <div
                            key={item}
                            className="flex gap-2.5 text-[12.5px] font-semibold leading-5 text-[#617887] dark:text-[#A8BAC5]"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6F9D82]" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {!isOwner && relatedInternships.length ? (
                  <section className="border-t border-[#D1DFE6] px-6 py-5 sm:px-7 lg:px-8 dark:border-white/10">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h2 className="text-[21px] font-black tracking-[-0.03em] text-[color:var(--ink)]">
                          Related opportunities
                        </h2>
                        <p className="mt-1 text-[11px] font-semibold text-[color:var(--muted)]">
                          Similar roles you may want to explore next.
                        </p>
                      </div>

                      <Link
                        to="/internships"
                        className="text-[11px] font-black text-[#55758B] hover:text-[#294F69] dark:text-[#9CD5FF]"
                      >
                        All internships →
                      </Link>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {relatedInternships.map((item) => (
                        <RelatedOpportunity
                          key={item.id}
                          internship={item}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside
                className="
                  border-t border-[#CADAE2]
                  bg-[#E8F0F4]
                  xl:border-l xl:border-t-0
                  dark:border-white/10
                  dark:bg-[#102636]
                "
              >
                <div className="sticky top-24">
                  {isOwner ? (
                    <div className="px-6 py-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6E8391] dark:text-[#8FA6B5]">
                            Your posting
                          </p>
                          <h2 className="mt-1.5 text-[24px] font-black tracking-[-0.035em] text-[color:var(--ink)]">
                            Manage this role
                          </h2>
                          <p className="mt-1.5 text-[11px] font-semibold leading-5 text-[color:var(--muted)]">
                            Review hiring activity or update the internship details.
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-[#D8BF69] bg-[#F8EDC4] px-3 py-1.5 text-[10px] font-black text-[#7B6324]">
                          {internship.status || "Active"}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-[13px] border border-[#C8D8E0] bg-[#F2F7F9] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#7A8E9A] dark:text-[#8FA4B2]">
                            Applicants
                          </p>
                          <p className="mt-1 text-[24px] font-black tracking-[-0.04em] text-[color:var(--ink)]">
                            {normalizeArray(internship.applications).length}
                          </p>
                        </div>

                        <div className="rounded-[13px] border border-[#C8D8E0] bg-[#F2F7F9] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-[9px] font-black uppercase tracking-[0.13em] text-[#7A8E9A] dark:text-[#8FA4B2]">
                            Deadline
                          </p>
                          <p className="mt-1 text-[11.5px] font-black leading-5 text-[color:var(--ink)]">
                            {internship.deadline}
                          </p>
                        </div>
                      </div>

                      <AppButton
                        type="button"
                        onClick={() =>
                          navigate(`/manage-applicants/${encodeURIComponent(internship.id)}`)
                        }
                        className="mt-5 min-h-11 w-full rounded-[11px] bg-[#355872] text-[11.5px] font-black text-white shadow-none hover:bg-[#294C64] dark:bg-[#9CD5FF] dark:text-[#071521]"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Review applicants
                      </AppButton>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/edit-internship/${encodeURIComponent(internship.id)}`)
                        }
                        className="mt-2.5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[11px] border border-[#BDD0DA] bg-[#F5F9FB] px-4 text-[11px] font-black text-[#355872] transition hover:border-[#7AAACE] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#BBDFF5]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit internship
                      </button>

                      <div className="mt-5 border-t border-[#CADAE2] pt-5 dark:border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6E8391] dark:text-[#8FA6B5]">
                          Posting details
                        </p>

                        <div className="mt-3 space-y-2.5 text-[11px] font-semibold text-[color:var(--muted)]">
                          <div className="flex items-center justify-between gap-4">
                            <span>Work mode</span>
                            <strong className="font-black text-[color:var(--ink)]">
                              {internship.workMode}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span>Duration</span>
                            <strong className="font-black text-[color:var(--ink)]">
                              {internship.duration}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span>Openings</span>
                            <strong className="font-black text-[color:var(--ink)]">
                              {internship.openings || 1}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6E8391] dark:text-[#8FA6B5]">
                          Application
                        </p>
                        <h2 className="mt-1.5 text-[24px] font-black tracking-[-0.035em] text-[color:var(--ink)]">
                          Apply for this role
                        </h2>
                        <p className="mt-1.5 text-[11px] font-semibold leading-5 text-[color:var(--muted)]">
                          Add a short cover letter and submit when you’re ready.
                        </p>
                      </div>

                      <div className="shrink-0 rounded-[11px] border border-[#C4D5DE] bg-[#F5F9FB] px-3 py-2 text-right dark:border-white/10 dark:bg-white/[0.035]">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.13em] text-[#7A8E9A] dark:text-[#8FA4B2]">
                          Deadline
                        </p>
                        <p className="mt-0.5 text-[11.5px] font-black text-[color:var(--ink)]">
                          {internship.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[13px] border border-[#C8D8E0] bg-[#F2F7F9] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[11.5px] font-black text-[color:var(--ink)]">
                        Eligibility
                      </p>

                      <ul className="mt-3 space-y-2.5">
                        {internship.eligibility.slice(0, 3).map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-[11px] font-semibold leading-5 text-[color:var(--muted)]"
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6F9D82]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isStudent ? (
                      <div className="mt-5 border-t border-[#CADAE2] pt-5 dark:border-white/10">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor="internship-cover-letter"
                            className="text-[11.5px] font-black text-[color:var(--ink)]"
                          >
                            Cover letter
                          </label>

                          <span className="text-[9.5px] font-black text-[#B18C2E] dark:text-[#E7C66B]">
                            Required
                          </span>
                        </div>

                        <p className="mt-1.5 text-[10.5px] font-semibold leading-5 text-[color:var(--muted)]">
                          Keep it short and explain why your work fits the role.
                        </p>

                        <textarea
                          id="internship-cover-letter"
                          value={coverLetter}
                          onChange={(event) => {
                            setCoverLetter(event.target.value);
                            setCoverLetterError("");
                          }}
                          placeholder="Why does this role fit your work?"
                          maxLength={700}
                          disabled={isApplied}
                          className="
                            mt-3 min-h-[124px] w-full resize-none
                            rounded-[12px] border border-[#BFD2DC]
                            bg-[#F7FAFB] px-3 py-2.5
                            text-[11.5px] font-semibold leading-5
                            text-[color:var(--ink)] outline-none
                            placeholder:text-[#92A4AE]
                            focus:border-[#7AAACE]
                            focus:ring-4 focus:ring-[#7AAACE]/15
                            disabled:cursor-not-allowed disabled:opacity-60
                            dark:border-white/10 dark:bg-[#0B1D2A]
                          "
                        />

                        <div className="mt-1.5 flex items-center justify-between gap-3">
                          {coverLetterError ? (
                            <p className="text-[10px] font-black text-[#C65D64]">
                              {coverLetterError}
                            </p>
                          ) : (
                            <span />
                          )}

                          <p className="text-[9.5px] font-bold text-[color:var(--muted)]">
                            {coverLetter.length}/700
                          </p>
                        </div>

                        <AppButton
                          type="button"
                          onClick={openApplyConfirmation}
                          disabled={isApplied}
                          className="
                            mt-3 min-h-10 w-full rounded-[10px]
                            bg-[#355872]
                            text-[11.5px] font-black text-white
                            shadow-none hover:bg-[#294C64]
                            disabled:opacity-55
                            dark:bg-[#9CD5FF]
                            dark:text-[#071521]
                            dark:hover:bg-[#7AAACE]
                          "
                        >
                          <Send className="mr-2 h-4 w-4" />
                          {isApplied
                            ? "Application submitted"
                            : "Submit application"}
                        </AppButton>

                        {isApplied ? (
                          <p className="mt-2.5 text-center text-[10px] font-black text-[#628D73] dark:text-[#83C49B]">
                            This role is now in My Applications.
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <NotificationToast
        toast={feedbackToast}
        onClose={() => setFeedbackToast(null)}
      />

      <AdminActionDialog
        open={applyDialogOpen}
        title="Submit application?"
        description={`Send your application for "${internship.title}" at ${internship.company}?`}
        confirmLabel="Submit"
        cancelLabel="Cancel"
        tone="brand"
        headerIcon={<Send className="size-5" />}
        dialogClassName="max-w-md"
        onCancel={() => setApplyDialogOpen(false)}
        onConfirm={confirmApply}
      />
    </DashboardLayout>
  );
}
