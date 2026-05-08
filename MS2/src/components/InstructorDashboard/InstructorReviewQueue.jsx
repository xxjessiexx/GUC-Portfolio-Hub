import { Flag, MessageSquare, Star } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const priorityClasses = {
  High: "bg-red-50 text-red-600 border-red-100",
  Medium: "bg-[color:var(--gold)]/20 text-[color:var(--primary)] border-[color:var(--gold)]/30",
  Low: "bg-[color:var(--accent)]/20 text-[color:var(--primary)] border-[color:var(--accent)]/30",
};

export default function InstructorReviewQueue({ items = [] }) {
  return (
    <AppCard padding="lg">
      <SectionHeader
        eyebrow="Feedback workspace"
        title="Review queue"
        subtitle="Comment on projects, task updates and thesis drafts; rate projects out of 5 or flag inappropriate work."
      />

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 rounded-3xl border border-[color:var(--border-blue)] bg-[color:var(--surface-soft)] p-4 lg:grid-cols-[1fr_auto] lg:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-[color:var(--ink)]">{item.title}</h3>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${priorityClasses[item.priority] || priorityClasses.Low}`}>
                  {item.priority}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                {item.student} • {item.course} • {item.type} • Due {item.due}
              </p>

              <p className="mt-3 text-sm font-bold text-[color:var(--primary)]">
                {item.action}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <AppButton variant="glass" size="sm">
                <MessageSquare className="h-4 w-4" />
                Comment
              </AppButton>
              <AppButton variant="outline" size="sm">
                <Star className="h-4 w-4" />
                Rate
              </AppButton>
              <AppButton variant="ghost" size="sm">
                <Flag className="h-4 w-4" />
                Flag
              </AppButton>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
