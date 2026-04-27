import { Star } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ProjectPreview({ project }) {
  return (
    <AppCard className="p-6">
      <SectionHeader
        title="Project Preview"
        subtitle="Selected project details and feedback."
      />

      <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">{project.title}</h3>
            <p className="mt-1 text-sm text-white/70">{project.type}</p>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
            <Star className="h-4 w-4 text-[var(--gold)]" />
            {project.rating}
          </span>
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <Info label="Status" value={project.status} />
          <Info label="GitHub" value={project.github} />
          <Info label="Demo" value={project.demo} />
          {project.thesis && <Info label="Thesis" value={project.thesis} />}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[rgba(53,88,114,0.1)] bg-white/60 p-5">
        <h3 className="font-black text-[var(--ink)]">Instructor Feedback</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {project.feedback}
        </p>
      </div>
    </AppCard>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/15 pb-2">
      <span className="text-white/60">{label}</span>
      <span className="max-w-[220px] truncate font-bold">{value}</span>
    </div>
  );
}