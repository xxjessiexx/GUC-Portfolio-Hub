import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SecondaryPanels({
  project,
  notifications,
  languageCounts,
  recommendedProjects,
  internships,
}) {
  return (
    <>
      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Task List" subtitle="Current project tasks">
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <MiniItem key={task.title}>
                <div className="flex justify-between gap-4">
                  <p className="font-bold text-[var(--ink)]">{task.title}</p>
                  <span className="text-xs font-black text-[var(--primary)]">
                    {task.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {task.assignee} • Due {task.deadline}
                </p>
              </MiniItem>
            ))}
          </div>
        </Panel>

        <Panel title="Notifications" subtitle="Latest updates">
          <div className="space-y-3">
            {notifications.map((note) => (
              <MiniItem key={note.title}>
                <p className="font-bold text-[var(--ink)]">{note.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{note.text}</p>
              </MiniItem>
            ))}
          </div>
        </Panel>

        <Panel title="Language Stats" subtitle="Used across your projects">
          <div className="space-y-4">
            {Object.entries(languageCounts).map(([lang, count]) => (
              <div key={lang}>
                <div className="mb-1 flex justify-between text-sm font-bold">
                  <span>{lang}</span>
                  <span>{count}</span>
                </div>

                <div className="h-3 rounded-full bg-[rgba(156,213,255,0.2)]">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
                    style={{ width: `${Math.min(count * 35, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Recommended Projects" subtitle="Based on your interests">
          <div className="space-y-3">
            {recommendedProjects.map((project) => (
              <MiniItem
                key={project}
                className="flex items-center justify-between"
              >
                <span className="font-bold text-[var(--ink)]">{project}</span>
                <Button variant="outline" className="rounded-xl">
                  Save
                </Button>
              </MiniItem>
            ))}
          </div>
        </Panel>

        <Panel title="Internships" subtitle="Saved and applied opportunities">
          <div className="space-y-3">
            {internships.map((internship) => (
              <MiniItem key={internship.title}>
                <div className="flex justify-between gap-4">
                  <p className="font-bold text-[var(--ink)]">
                    {internship.title}
                  </p>

                  <span className="text-xs font-black text-[var(--primary)]">
                    {internship.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {internship.company} • Deadline {internship.deadline}
                </p>
              </MiniItem>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <AppCard className="p-6">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="mt-5">{children}</div>
    </AppCard>
  );
}

function MiniItem({ children, className = "" }) {
  return (
    <div
      className={`rounded-[22px] border border-white/70 bg-white/60 p-4 ${className}`}
    >
      {children}
    </div>
  );
}