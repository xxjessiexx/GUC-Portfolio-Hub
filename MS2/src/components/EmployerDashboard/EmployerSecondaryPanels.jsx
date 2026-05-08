import { FileCheck2, Heart, MessageSquare, Star, TrendingUp } from "lucide-react";
import AppBadge from "@/components/ui/AppBadge";
import { AppButton } from "@/components/ui/AppButton";
import { DashboardPanel, SoftItem, ProgressBar } from "./EmployerDashboardShell";

export default function EmployerSecondaryPanels({
  employer,
  internshipStats,
  favoritePortfolios,
  recommendedProjects,
  notifications,
  messageThreads,
}) {
  const maxInternships = Math.max(...internshipStats.map((item) => item.internships));

  return (
    <>
      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <DashboardPanel title="Company Verification" subtitle="Documents and profile readiness.">
          <div className="space-y-3">
            {employer.documents.map((document) => (
              <SoftItem key={document.name} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black text-[var(--ink)]">{document.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Uploaded {document.date}</p>
                </div>
                <AppBadge tone="blue">
                  <FileCheck2 className="h-3.5 w-3.5" /> {document.status}
                </AppBadge>
              </SoftItem>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Internship Statistics" subtitle="Offered roles and completed students.">
          <div className="space-y-4">
            {internshipStats.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm font-bold text-[var(--ink)]">
                  <span>{item.label}</span>
                  <span>{item.students} students • {item.internships} roles</span>
                </div>
                <ProgressBar value={Math.round((item.internships / maxInternships) * 100)} />
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Messages" subtitle="Private conversations with students and instructors.">
          <div className="space-y-3">
            {messageThreads.map((thread) => (
              <SoftItem key={thread.name}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-[var(--ink)]">{thread.name}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-[var(--primary)] dark:text-[var(--accent)]">
                      {thread.context}
                    </p>
                  </div>
                  {thread.unread && <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{thread.preview}</p>
              </SoftItem>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardPanel title="Favorite Portfolios" subtitle="Saved student portfolios for suggested applications.">
          <div className="space-y-3">
            {favoritePortfolios.map((portfolio) => (
              <SoftItem key={portfolio.name}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-black text-[var(--ink)]">{portfolio.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {portfolio.major} • {portfolio.projects} projects
                    </p>
                  </div>
                  <AppBadge tone="gold">
                    <Heart className="h-3.5 w-3.5" /> Saved
                  </AppBadge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <AppBadge key={skill} tone="muted">{skill}</AppBadge>
                  ))}
                </div>
              </SoftItem>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Recommended Projects" subtitle="Project discovery for recruiting signals.">
          <div className="space-y-3">
            {recommendedProjects.map((project) => (
              <SoftItem key={project.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-[var(--ink)]">{project.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{project.course}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(230,199,123,0.2)] px-3 py-1 text-xs font-black text-[var(--primary)] dark:text-[var(--gold)]">
                    <Star className="h-3.5 w-3.5" /> {project.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{project.reason}</p>
                <div className="mt-3 flex justify-end">
                  <AppButton variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4" /> View Signal
                  </AppButton>
                </div>
              </SoftItem>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <section className="mt-6">
        <DashboardPanel title="Latest Notifications" subtitle="Applications, messages, verification, and internship status alerts.">
          <div className="grid gap-3 lg:grid-cols-3">
            {notifications.map((note) => (
              <SoftItem key={note.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-[var(--ink)]">{note.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{note.text}</p>
                  </div>
                  {note.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />}
                </div>
                <p className="mt-3 text-xs font-semibold text-[var(--muted)]">{note.time}</p>
              </SoftItem>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </>
  );
}
