export default function AdminSnapshotCard({
  label,
  value,
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[color:var(--ink)]">
        {value}
      </p>
    </div>
  );
}