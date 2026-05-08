import { Download, FileText } from "lucide-react";
import { AdminActionPair, AdminBadge, AdminSection, AdminMiniButton } from "./AdminDashboardPrimitives";

export default function EmployerApprovalsPanel({ applications }) {
  return (
    <AdminSection
      title="Employer applications"
      subtitle="Review companies applying to use the platform, inspect uploaded verification documents, then accept or reject access."
      action={<AdminMiniButton variant="outline" icon={FileText}>View all</AdminMiniButton>}
    >
      <div className="space-y-3">
        {applications.map((application) => (
          <article
            key={application.id}
            className="rounded-[24px] border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-[color:var(--ink)]">{application.company}</h3>
                  <AdminBadge tone={application.status === "Ready to approve" ? "gold" : "blue"}>
                    {application.status}
                  </AdminBadge>
                </div>
                <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">{application.contact}</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{application.focus}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {application.documents.map((document) => (
                    <button
                      key={document}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#7AAACE]/30 bg-white/55 px-3 py-2 text-xs font-black text-[color:var(--primary)] shadow-sm transition hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-[color:var(--accent)]"
                    >
                      <FileText className="h-4 w-4" />
                      {document}
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {application.submitted}
                </span>
                <AdminActionPair />
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminSection>
  );
}
