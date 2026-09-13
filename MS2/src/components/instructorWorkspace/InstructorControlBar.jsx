import { cn } from "@/lib/utils";

export default function InstructorControlBar({
  tabs,
  controls,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-[#D9E4E9] pb-2 dark:border-white/10 xl:flex-row xl:items-end xl:justify-between xl:gap-6",
        className
      )}
    >
      <div className="min-w-0">{tabs}</div>
      {controls ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-2.5 xl:justify-end">
          {controls}
        </div>
      ) : null}
    </div>
  );
}
