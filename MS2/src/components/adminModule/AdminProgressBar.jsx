import { motion } from "framer-motion";

export default function AdminProgressBar({
  label,
  value,
  max,
}) {
  const width = Math.max(
    8,
    Math.round((value / Math.max(max, 1)) * 100)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-[color:var(--ink)]">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[color:var(--accent)]/15">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-[var(--gradient-brand)]"
        />
      </div>
    </div>
  );
}