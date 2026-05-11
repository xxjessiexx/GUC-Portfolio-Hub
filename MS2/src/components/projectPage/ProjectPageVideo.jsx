export default function ProjectPageVideo({ src }) {
  if (!src) {
    return (
      <div className="flex justify-center">
        <div className="flex h-[360px] w-full max-w-3xl items-center justify-center rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-white/50 text-sm font-bold text-[var(--muted)]">
          No demo video added yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl">
        <video
          controls
          className="h-[500px] w-full rounded-2xl border border-[color:var(--primary)]/10 object-cover shadow-md"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}