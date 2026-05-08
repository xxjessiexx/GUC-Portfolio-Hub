import { motion } from "framer-motion";
import { Activity, AlertTriangle, BookOpen, Users } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { easeOutExpo } from "@/lib/motionVariants";

const icons = [Users, Activity, BookOpen, AlertTriangle];

export default function AdminStatsGrid({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] || Activity;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35, ease: easeOutExpo }}
          >
            <AppCard className="group h-full p-5 transition duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-black text-[color:var(--ink)]">
                    {stat.value}
                  </p>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#7AAACE]/30 bg-[#D8ECF8]/60 text-[color:var(--primary)] shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-[color:var(--accent)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                {stat.detail}
              </p>
            </AppCard>
          </motion.div>
        );
      })}
    </section>
  );
}
