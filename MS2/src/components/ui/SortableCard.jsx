import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableCard({
  id,
  left,
  updated,
  middle,
  right,
  variant = "default",
  dragDisabled = false,
  children,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const projectVariant = variant === "project";
  const taskVariant = variant === "task";

  if (taskVariant) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative flex min-w-0 items-stretch border-b border-[#355872]/10 bg-white transition-all duration-200 last:border-b-0 hover:bg-[#FBFDFE] ${
          isDragging
            ? "z-50 scale-[1.008] rounded-[20px] border border-[#7AAACE]/30 bg-white shadow-[0_22px_55px_rgba(53,88,114,0.18)]"
            : ""
        }`}
      >
        <div className="flex w-10 shrink-0 items-start justify-center pt-6 sm:w-12">
          <button
            type="button"
            {...(!dragDisabled ? listeners : {})}
            {...(!dragDisabled ? attributes : {})}
            tabIndex={dragDisabled ? -1 : 0}
            aria-label={dragDisabled ? undefined : "Reorder task"}
            className={`grid grid-cols-2 gap-[3px] rounded-lg p-2 transition ${
              dragDisabled
                ? "cursor-default opacity-0"
                : "cursor-grab opacity-0 group-hover:opacity-45 hover:bg-[#EAF3F8] hover:opacity-90 active:cursor-grabbing"
            }`}
          >
            {[...Array(6)].map((_, index) => (
              <span
                key={index}
                className="h-[3px] w-[3px] rounded-full bg-[#557C97]"
              />
            ))}
          </button>
        </div>

        <div className="min-w-0 flex-1 pr-4 sm:pr-6">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        projectVariant
          ? `group grid cursor-pointer grid-cols-[minmax(0,2.5fr)_0.9fr_1.05fr_0.85fr_0.8fr] items-center gap-5 rounded-[24px] border border-white/70 bg-white/68 px-5 py-4 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(53,88,114,0.07)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7AAACE]/25 hover:bg-white/82 hover:shadow-[0_18px_42px_rgba(53,88,114,0.13)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.055] ${
              isDragging
                ? "z-50 scale-[1.01] shadow-[0_24px_60px_rgba(53,88,114,0.2)]"
                : ""
            }`
          : `grid cursor-pointer grid-cols-[2.4fr_1fr_1.4fr_0.8fr_1.2fr_1fr] items-center gap-6 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--card-bg-strong)] px-6 py-5 text-[color:var(--ink)] shadow-[var(--shadow-soft)] ${
              isDragging ? "scale-[1.02] shadow-xl" : ""
            }`
      }
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          {...(!dragDisabled ? listeners : {})}
          {...(!dragDisabled ? attributes : {})}
          className={
            projectVariant
              ? `mr-1 grid shrink-0 grid-cols-2 gap-[3px] rounded-xl p-2 transition ${
                  dragDisabled
                    ? "cursor-default opacity-0"
                    : "cursor-grab opacity-35 hover:bg-[color:var(--accent)]/15 hover:opacity-80 active:cursor-grabbing"
                }`
              : `mr-2 grid grid-cols-2 gap-[4px] ${
                  dragDisabled
                    ? "cursor-default opacity-0"
                    : "cursor-grab opacity-70 hover:opacity-100 active:cursor-grabbing"
                }`
          }
        >
          {[...Array(6)].map((_, index) => (
            <span
              key={index}
              className={
                projectVariant
                  ? "h-[3px] w-[3px] rounded-full bg-[color:var(--primary)]"
                  : "h-[4px] w-[4px] rounded-full bg-[color:var(--muted)]"
              }
            />
          ))}
        </div>

        {left}
      </div>

      <div
        className={
          projectVariant
            ? "text-sm font-bold text-[color:var(--muted)]"
            : "text-sm font-medium text-[color:var(--muted)]"
        }
      >
        {updated}
      </div>

      {middle}

      <div className="flex justify-end gap-2">{right}</div>
    </div>
  );
}
