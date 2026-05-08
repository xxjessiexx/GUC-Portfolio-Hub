import { Bell, Lightbulb, MessageSquare } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function InstructorSidePanels({ notifications = [], recommendedProjects = [] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AppCard padding="lg">
        <SectionHeader
          eyebrow="Notifications"
          title="Recent alerts"
          subtitle="Invitations, private messages, feedback requests and moderation alerts."
        />

        <div className="mt-6 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--accent)]/20 text-[color:var(--primary)]">
                {item.type === "message" ? <MessageSquare className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-black text-[color:var(--ink)]">{item.title}</h3>
                  {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--gold)]" />}
                </div>
                <p className="mt-1 text-sm font-semibold leading-6 text-[color:var(--muted)]">{item.text}</p>
                <p className="mt-2 text-xs font-bold text-[color:var(--secondary)]">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      <AppCard padding="lg">
        <SectionHeader
          eyebrow="Recommended"
          title="Projects to discover"
          subtitle="Recommended project list for instructors based on linked courses and supervision activity."
        />

        <div className="mt-6 space-y-3">
          {recommendedProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--gold)]/20 text-[color:var(--primary)]">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[color:var(--ink)]">{project.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[color:var(--muted)]">{project.reason}</p>
                  <span className="mt-3 inline-flex rounded-full bg-[color:var(--accent)]/20 px-3 py-1 text-xs font-black text-[color:var(--primary)]">
                    {project.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AppButton variant="outline" fullWidth className="mt-5">
          View recommended projects
        </AppButton>
      </AppCard>
    </div>
  );
}
