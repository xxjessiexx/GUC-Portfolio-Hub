import { ShieldCheck, UserPlus } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { AppButton } from "@/components/ui/AppButton";

export default function AdminHero({ admin }) {
  const firstName = admin.name.split(" ")[0];

  return (
    <AppCard className="overflow-hidden">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[var(--primary)]">
            Admin overview
          </p>

          <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">
            Welcome back, {firstName}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review platform access, approve employer applications, manage users
            and courses, handle flagged projects, and monitor usage from one
            controlled workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {["Employer approvals", "User access", "Course control", "Flag reviews"].map((item) => (
              <span
                key={item}
                className="inline-flex h-10 items-center rounded-full border border-[#7AAACE]/60 bg-[#5F86A3] px-4 text-xs font-black text-white shadow-[0_10px_24px_rgba(53,88,114,0.16)] dark:border-white/10 dark:bg-white/10 dark:text-[var(--accent)] dark:shadow-none"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-6 text-white shadow-[0_24px_65px_rgba(53,88,114,0.28)] dark:[background:var(--dashboard-hero-action-gradient)] dark:shadow-[0_24px_65px_rgba(0,0,0,0.28)]">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <ShieldCheck className="h-6 w-6 text-[color:var(--accent)]" />
          </div>

          <p className="mt-5 text-sm font-semibold text-white/70">Quick action</p>
          <h3 className="mt-2 text-2xl font-black">Create admin account</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Add another administrator using a username and password while keeping
            the system controlled by verified admins.
          </p>

          <AppButton variant="light" className="mt-5 bg-white text-[var(--primary)] hover:bg-white/90">
            <UserPlus className="h-4 w-4" />
            New Admin
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
