import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { easeOutExpo, tapScale } from "@/lib/motionVariants";
import { AppCard } from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppButton } from "@/components/ui/AppButton";

export function EmployerHero({ employer }) {
  const navigate = useNavigate();

  const initials = employer.companyName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <AppCard className="mb-6 overflow-hidden">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-[var(--primary)]">
            Employer Overview
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[26px] border border-white/60 bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] text-2xl font-black text-white shadow-[0_18px_45px_rgba(53,88,114,0.2)] dark:border-white/10">
              {employer.companyLogo ? (
                <img
                  src={employer.companyLogo}
                  alt={employer.companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">
                {employer.companyName}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                {employer.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <AppBadge tone="blue">{employer.industry}</AppBadge>
                <AppBadge tone="gold">{employer.verificationStatus}</AppBadge>
                <AppBadge tone="muted">{employer.location}</AppBadge>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(135deg,var(--dark),var(--primary)_55%,var(--secondary))] p-6 text-white shadow-[0_24px_65px_rgba(53,88,114,0.28)] dark:[background:var(--dashboard-hero-action-gradient)] dark:shadow-[0_24px_65px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold text-white/70">Quick action</p>

          <h3 className="mt-2 text-2xl font-black">Post an internship</h3>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Add responsibilities, skills, duration, deadline, and languages for
            the next role your company is hiring for.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <AppButton
              type="button"
              variant="light"
              onClick={() => navigate("/create-internship")}
              className="bg-white text-[var(--primary)] hover:bg-white/90"
            >
              Add Internship
            </AppButton>

            <AppButton
              type="button"
              variant="navDark"
              onClick={() => navigate("/manage-applicants/emp-int-1")}
            >
              View Applicants
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
  );
}

export function EmployerStatsGrid({ stats }) {
  return (
    <section className="mb-6 grid gap-5 md:grid-cols-4">
      {stats.map(({ title, value, icon: Icon }) => (
        <AppCard key={title} className="p-5">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(156,213,255,0.3)]">
            <Icon className="h-5 w-5 text-[var(--primary)]" />
          </div>

          <p className="text-3xl font-black text-[var(--ink)]">{value}</p>

          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
            {title}
          </p>
        </AppCard>
      ))}
    </section>
  );
}

export function DashboardPanel({
  title,
  subtitle,
  action,
  onAction,
  children,
  className = "",
}) {
  return (
    <AppCard className={`p-6 ${className}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <SectionHeader title={title} subtitle={subtitle} />

        {action && (
          <AppButton
            type="button"
            onClick={onAction}
            className="rounded-2xl border border-white/70 bg-[var(--surface-strong)] px-5 font-black text-[color:var(--primary)] hover:bg-[var(--surface-elevated)]"
          >
            {action}
          </AppButton>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </AppCard>
  );
}

export function SoftItem({
  children,
  selected = false,
  className = "",
  onClick,
}) {
  const Comp = onClick ? motion.button : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? tapScale : undefined}
      transition={onClick ? { duration: 0.22, ease: easeOutExpo } : undefined}
      className={`w-full rounded-[24px] border p-4 text-left transition ${
        selected
          ? "border-[var(--gold)] bg-[rgba(156,213,255,0.2)] shadow-[0_18px_45px_rgba(53,88,114,0.12)] dark:bg-[rgba(120,173,210,0.16)]"
          : "border-white/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.045] dark:hover:bg-white/[0.07]"
      } ${className}`}
    >
      {children}
    </Comp>
  );
}

export function ProgressBar({ value, tone = "blue" }) {
  const fill =
    tone === "gold"
      ? "bg-[linear-gradient(90deg,var(--gold),var(--accent))]"
      : "bg-[linear-gradient(90deg,var(--primary),var(--secondary))] dark:bg-[linear-gradient(90deg,var(--accent),var(--secondary))]";

  return (
    <div className="h-3 rounded-full bg-[rgba(156,213,255,0.2)] dark:bg-white/10">
      <div
        className={`h-3 rounded-full ${fill}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}