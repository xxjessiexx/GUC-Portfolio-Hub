export default function ProjectPageVideo({ src }) {
  if (!src) {
    return (
      <section className="w-full">
        <div className="flex aspect-video w-full items-center justify-center rounded-[22px] border border-dashed border-[#355872]/18 bg-[#F4F8FA] px-6 text-center text-sm font-bold text-[#7890A0]">
          No demo video added yet.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        className="aspect-video w-full rounded-[22px] border border-[#355872]/10 bg-[#101820] object-contain shadow-[0_18px_42px_rgba(38,72,95,0.16)]"
      />
    </section>
  );
}
