import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/ui/AppCard";

export default function DashboardHero({ student }) {
  return (
    <AppCard className="mb-6 overflow-hidden">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[var(--primary)]">
            Overview
          </p>

          <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">
            Welcome back, {student.name.split(" ")[0]}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Manage your portfolio, track project progress, review feedback, and
            keep your academic work ready for discovery.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {student.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[rgba(156,213,255,0.28)] px-4 py-2 text-xs font-black text-[var(--primary)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-6 text-white shadow-[0_24px_65px_rgba(53,88,114,0.28)]">
          <p className="text-sm font-semibold text-white/70">Quick action</p>
          <h3 className="mt-2 text-2xl font-black">Add your next project</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Create a project entry with demo, GitHub, collaborators, and
            visibility settings.
          </p>

          <Button className="mt-5 rounded-2xl bg-white px-5 font-black text-[var(--primary)] hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>
    </AppCard>
  );
}