import { Users, Star, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

const statusMeta = {
  nominated: {
    label: "Nominated",
    icon: Clock,
    className:
      "bg-[color:var(--gold)]/15 text-[color:var(--primary)] ring-[color:var(--gold)]/30",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300",
  },
};

function ApplicantStatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.nominated;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export default function EmployerApplicantsPanel({
  applicants = [],
  onStatusChange,
}) {
  return (
    <AppCard className="p-6">
      <SectionHeader
        eyebrow="Applications"
        title="Applicant review"
        subtitle="Review internship applicants, compare contribution scores, and update their hiring status."
      />

      <div className="mt-6 space-y-4">
        {applicants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-soft)] p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--accent)]/15 text-[color:var(--primary)]">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-black text-[color:var(--ink)]">
              No applicants yet
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--muted)]">
              Applications will appear here once students apply.
            </p>
          </div>
        ) : (
          applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-[color:var(--ink)]">
                      {applicant.name}
                    </h3>
                    <ApplicantStatusBadge status={applicant.status} />
                  </div>

                  <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                    {applicant.major || "Student"} ·{" "}
                    {applicant.internshipTitle || applicant.role || "Internship applicant"}
                  </p>

                  {applicant.email && (
                    <p className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[color:var(--muted)]">
                      <Mail className="h-3.5 w-3.5" />
                      {applicant.email}
                    </p>
                  )}

                  {applicant.coverLetter && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                      {applicant.coverLetter}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-2xl bg-[color:var(--surface-soft)] px-4 py-3 text-center ring-1 ring-[color:var(--border-soft)]">
                    <div className="flex items-center justify-center gap-1 text-[color:var(--gold)]">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-lg font-black">
                        {applicant.contributionScore ?? applicant.score ?? 0}
                      </span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      Score
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <AppButton
                      size="sm"
                      variant="glass"
                      onClick={() => onStatusChange?.(applicant.id, "nominated")}
                    >
                      Nominate
                    </AppButton>

                    <AppButton
                      size="sm"
                      variant="primary"
                      onClick={() => onStatusChange?.(applicant.id, "accepted")}
                    >
                      Accept
                    </AppButton>

                    <AppButton
                      size="sm"
                      variant="danger"
                      onClick={() => onStatusChange?.(applicant.id, "rejected")}
                    >
                      Reject
                    </AppButton>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AppCard>
  );
}