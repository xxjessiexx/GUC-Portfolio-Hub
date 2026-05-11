export default function ProjectPageVideo({ src }) {
  if (!src) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-white/50 text-sm font-bold text-[var(--muted)]">
          No demo video added yet.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <video
        controls
        className="aspect-video w-full rounded-2xl border border-[color:var(--primary)]/10 bg-black object-contain shadow-md"
      >
        <source src={src} type="video/mp4" />
      </video>
    </section>
  );
}
