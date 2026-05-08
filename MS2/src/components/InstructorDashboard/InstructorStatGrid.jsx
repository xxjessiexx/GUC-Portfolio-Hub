import { motion } from "framer-motion";
import { BookOpenCheck, ClipboardCheck, Star, Users } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";
import { easeOutExpo } from "@/lib/motionVariants";

const icons = [BookOpenCheck, ClipboardCheck, Users, Star];

export default function InstructorStatGrid({ stats = [] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] || ClipboardCheck;

        return (
          <motion.div
            key={stat.label}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.42, ease: easeOutExpo }}
          >
            <AppCard padding="md" hover className="min-h-[142px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-[color:var(--muted)]">{stat.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-[color:var(--ink)]">
                    {stat.value}
                  </p>
                </div>

                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--border-blue)] bg-[color:var(--accent)]/20 text-[color:var(--primary)] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-[color:var(--muted)]">{stat.helper}</p>
            </AppCard>
          </motion.div>
        );
      })}
    </section>
  );
}
