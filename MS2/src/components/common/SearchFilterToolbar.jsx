import { Search, SlidersHorizontal } from "lucide-react";

import { AppCard } from "@/components/ui/AppCard";
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
  return (
    <AppCard className={`p-5 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {showSearch && (
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 rounded-2xl border border-white/70 bg-[var(--input-bg)] pl-11 font-semibold text-[color:var(--ink)]"
            />
          </div>
        )}

        {showSort && (
          <div className="w-[15rem]">
            <FilterSelect
              value={sortValue}
              onChange={onSortChange}
              options={sortOptions}
            />
          </div>
        )}

        {showFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-5 text-sm font-black text-[color:var(--primary)] shadow-sm transition hover:bg-white/80"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        )}
      </div>

      {showFilters && filtersOpen && (
        <FilterPanel title={filterTitle} onClear={onClearFilters}>
          {children}
        </FilterPanel>
      )}
    </AppCard>
  );
}