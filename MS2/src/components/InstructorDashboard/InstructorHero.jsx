import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, MessageSquare, ShieldCheck } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { easeOutExpo } from "@/lib/motionVariants";

export default function InstructorHero({ profile, dashboard }) {
  return (
    <AppCard variant="dark" padding="xl" className="isolate overflow-hidden text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#9CD5FF]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#E6C77B]/10 blur-3xl" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr] xl:items-end">
        <div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#9CD5FF]"
          >
            <ShieldCheck className="h-4 w-4" />
            Instructor control room
          </motion.div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white xl:text-5xl">
            Welcome back, {profile?.name || "Instructor"}.
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/68">
            Review project invitations, supervise course projects, comment on tasks and thesis drafts, rate student work, and keep feedback moving from one workspace.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <AppButton variant="light" size="lg">
              Review queue
              <ArrowRight className="h-4 w-4" />
            </AppButton>
            <AppButton variant="navDark" size="lg">
              <MessageSquare className="h-4 w-4" />
              Open messages
            </AppButton>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-white/70">Linked course coverage</p>
              <BookOpenCheck className="h-5 w-5 text-[#E6C77B]" />
            </div>
            <p className="mt-3 text-4xl font-black text-white">{dashboard.courses.length}</p>
            <p className="mt-1 text-sm font-semibold text-white/55">Courses and bachelor project tracks</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-white/70">Review capacity</p>
              <span className="rounded-full bg-[#E6C77B]/15 px-3 py-1 text-xs font-black text-[#E6C77B]">
                {dashboard.reviewCapacity}%
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#E6C77B,#9CD5FF)]"
                style={{ width: `${dashboard.reviewCapacity}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-white/55">Balanced across active project reviews</p>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
