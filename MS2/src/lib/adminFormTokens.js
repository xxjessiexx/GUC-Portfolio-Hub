export const pageMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.055 } },
};

export const cardMotion = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

export const adminInputStyles = "min-h-11 rounded-2xl border border-white/70 bg-[var(--input-bg)] px-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.05)] placeholder:text-[color:var(--muted)]/65 transition focus-visible:border-[color:var(--accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring-soft)]";
