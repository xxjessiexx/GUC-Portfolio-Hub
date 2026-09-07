import { useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import FilterSelect from "@/components/common/FilterSelect";
import FilterPanel from "@/components/common/FilterPanel";

export default function SearchFilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,

  showSort = false,
  sortValue,
  onSortChange,
  sortOptions = [],

  showFilters = false,
  filtersOpen = false,
  onToggleFilters,
  filterTitle = "Filters",
  onClearFilters,
  children,

  className = "",
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!filtersOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onToggleFilters?.();
    };

    const handleOutsideClick = (event) => {
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      if (!rootRef.current) return;

      const target = event.target;

      // Radix Select renders its menu in a Portal, outside rootRef.
      // Treat clicks inside that portal as part of this toolbar.
      // Otherwise the filter panel unmounts on pointerdown before
      // Radix can fire onValueChange, making every dropdown appear broken.
      const clickedInsideSelectPortal =
        target instanceof Element &&
        Boolean(
          target.closest(
            '[data-slot="select-content"], [data-slot="select-item"], [data-radix-popper-content-wrapper]'
          )
        );

      if (clickedInsideSelectPortal) return;
      if (rootRef.current.contains(target)) return;

      onToggleFilters?.();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [filtersOpen, onToggleFilters]);

  return (
    <section ref={rootRef} className={`relative z-30 ${className}`}>
      <div
        className="
          flex min-h-[64px] w-full items-stretch overflow-hidden
          rounded-[22px]
          border border-[#D5E3EA]
          bg-[#F4F9FC]
          shadow-[0_12px_30px_rgba(53,88,114,0.07)]

          dark:border-white/10
          dark:bg-[#102638]
          dark:shadow-[0_16px_36px_rgba(0,0,0,0.24)]
        "
      >
        {showSearch && (
          <div className="relative min-w-0 flex-1">
            <Search
              className="
                pointer-events-none absolute left-5 top-1/2
                h-4 w-4 -translate-y-1/2
                text-[#718796]
                dark:text-[#9CB2C1]
              "
            />

            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="
                h-full min-h-[64px] w-full rounded-none
                !border-0 !bg-transparent
                pl-12 pr-5
                text-[14px] font-semibold text-[color:var(--ink)]
                !shadow-none outline-none
                placeholder:text-[#8294A0]
                focus-visible:!ring-0

                dark:placeholder:text-[#8FA6B6]
              "
            />
          </div>
        )}

        {showSort && (
          <div
            className="
              hidden w-[250px] shrink-0 items-center
              border-l border-[#D8E6ED] px-3
              md:flex
              dark:border-white/10
            "
          >
            <FilterSelect
              value={sortValue}
              onChange={onSortChange}
              options={sortOptions}
              variant="toolbar"
            />
          </div>
        )}

        {showFilters && (
          <div
            className="
              hidden shrink-0 items-center
              border-l border-[#D8E6ED] px-3
              md:flex
              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={onToggleFilters}
              aria-expanded={filtersOpen}
              className={`
                inline-flex h-11 items-center justify-center gap-2
                rounded-[14px] px-4
                text-[13px] font-black
                transition

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#7AAACE]/20

                ${
                  filtersOpen
                    ? "bg-[#E8F3F9] text-[#294F69] ring-1 ring-[#BDD7E6] dark:bg-[#9CD5FF]/10 dark:text-[#CDEBFF] dark:ring-[#9CD5FF]/20"
                    : "text-[color:var(--ink)] hover:bg-[#EAF3F8] dark:hover:bg-white/[0.06]"
                }
              `}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        )}

        {showFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
            aria-label="Open filters"
            className="
              inline-flex w-14 shrink-0 items-center justify-center
              border-l border-[#D8E6ED]
              text-[color:var(--ink)]
              md:hidden
              dark:border-white/10
            "
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSort && (
        <div className="mt-2 md:hidden">
          <FilterSelect
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            variant="standalone"
          />
        </div>
      )}

      {showFilters && filtersOpen && (
        <>
          <div
            className="
              absolute right-0 top-[calc(100%+10px)] z-[999]
              hidden w-[400px] max-w-[calc(100vw-32px)]
              md:block
            "
          >
            <div
              className="
                overflow-hidden rounded-[20px]
                border border-[#D5E3EA]
                bg-[#F7FBFD]
                shadow-[0_24px_60px_rgba(31,59,78,0.18)]

                dark:border-white/10
                dark:bg-[#0A1926]
                dark:shadow-[0_28px_70px_rgba(0,0,0,0.42)]
              "
            >
              <div
                className="
                  flex items-center justify-between gap-4
                  border-b border-[#D8E6ED]
                  px-5 py-4
                  dark:border-white/10
                "
              >
                <div>
                  <p className="text-[15px] font-black text-[color:var(--ink)]">
                    {filterTitle || "Filters"}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[color:var(--muted)]">
                    Refine the results.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onToggleFilters}
                  aria-label="Close filters"
                  className="
                    inline-flex h-9 w-9 items-center justify-center
                    rounded-[11px]
                    text-[color:var(--muted)]
                    transition
                    hover:bg-[#EAF3F8]
                    hover:text-[#355872]

                    dark:hover:bg-white/[0.06]
                    dark:hover:text-[#9CD5FF]
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <FilterPanel
                title={filterTitle}
                onClear={onClearFilters}
                onDone={onToggleFilters}
              >
                {children}
              </FilterPanel>
            </div>
          </div>

          <div className="fixed inset-0 z-[1000] md:hidden">
            <button
              type="button"
              onClick={onToggleFilters}
              aria-label="Close filters"
              className="absolute inset-0 bg-black/45"
            />

            <div
              className="
                absolute inset-x-0 bottom-0 max-h-[78vh]
                overflow-hidden rounded-t-[26px]
                border-t border-[#D5E3EA]
                bg-[#F7FBFD]
                shadow-[0_-20px_60px_rgba(22,48,65,0.22)]

                dark:border-white/10
                dark:bg-[#0A1926]
                dark:shadow-[0_-24px_70px_rgba(0,0,0,0.45)]
              "
            >
              <div
                className="
                  flex items-center justify-between gap-4
                  border-b border-[#D8E6ED]
                  px-5 py-4
                  dark:border-white/10
                "
              >
                <div>
                  <p className="text-[16px] font-black text-[color:var(--ink)]">
                    {filterTitle || "Filters"}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[color:var(--muted)]">
                    Refine what you want to see.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onToggleFilters}
                  aria-label="Close filters"
                  className="
                    inline-flex h-9 w-9 items-center justify-center
                    rounded-[11px]
                    text-[color:var(--muted)]
                    hover:bg-[#EAF3F8]

                    dark:hover:bg-white/[0.06]
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[calc(78vh-72px)] overflow-y-auto">
                <FilterPanel
                  title={filterTitle}
                  onClear={onClearFilters}
                  onDone={onToggleFilters}
                >
                  {children}
                </FilterPanel>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
