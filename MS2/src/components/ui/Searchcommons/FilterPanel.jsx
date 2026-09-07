import { Children, cloneElement, isValidElement } from "react";

export default function FilterPanel({
  title = "Filters",
  children,
  onClear,
  clearLabel = "Clear all",
  onDone,
  doneLabel = "Done",
}) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <div aria-label={title}>
      <span className="sr-only">{title}</span>

      <div className="grid gap-3 px-5 py-5">
        {items.map((child, index) => {
          if (!isValidElement(child)) {
            return <div key={index}>{child}</div>;
          }

          return (
            <div key={index} className="min-w-0">
              {cloneElement(child, {
                className: `
                  !h-11 !min-h-11 !w-full
                  !rounded-[13px]
                  !border-[#D5E3EA]
                  !bg-[#F9FCFE]
                  !shadow-none
                  focus-within:!border-[#7AAACE]
                  dark:!border-white/10
                  dark:!bg-[#102638]
                  ${child.props.className || ""}
                `,
                contentClassName: `
                  !border-[#D5E3EA]
                  !bg-[#F7FBFD]
                  !backdrop-blur-none
                  dark:!border-white/10
                  dark:!bg-[#102638]
                  ${child.props.contentClassName || ""}
                `,
              })}
            </div>
          );
        })}
      </div>

      {(onClear || onDone) && (
        <div
          className="
            flex items-center justify-between gap-3
            border-t border-[#D8E6ED] px-5 py-3.5
            dark:border-white/10
          "
        >
          <div>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="
                  inline-flex h-10 items-center justify-center rounded-[12px] px-2
                  text-[12px] font-black text-[color:var(--muted)] transition
                  hover:text-[#355872]
                  dark:hover:text-[#9CD5FF]
                "
              >
                {clearLabel}
              </button>
            )}
          </div>

          {onDone && (
            <button
              type="button"
              onClick={onDone}
              className="
                inline-flex h-10 items-center justify-center rounded-[12px]
                bg-[#355872] px-5
                text-[12px] font-black text-white
                shadow-[0_10px_24px_rgba(53,88,114,0.16)]
                transition hover:bg-[#294C64]
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7AAACE]/20
                dark:bg-[#9CD5FF] dark:text-[#071521] dark:hover:bg-[#7AAACE]
              "
            >
              {doneLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
