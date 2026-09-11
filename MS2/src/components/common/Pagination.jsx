function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageStartIndex,
  pageSize,
  onPageChange,
  ariaLabel = "Results pagination",
  showWhenSinglePage = false,
}) {
  if (!totalItems) return null;
  if (!showWhenSinglePage && totalPages <= 1) return null;

  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const pages = getVisiblePages(safePage, totalPages);
  const endIndex = Math.min(pageStartIndex + pageSize, totalItems);

  return (
    <nav
      className="mt-8 flex flex-col gap-3 border-t border-[#355872]/10 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
      aria-label={ariaLabel}
    >
      <p className="text-[12px] font-semibold text-[color:var(--muted)]">
        Showing {pageStartIndex + 1}–{endIndex} of {totalItems}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage === 1}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
        >
          Previous
        </button>

        {pages.map((page) => {
          if (typeof page === "string") {
            return (
              <span
                key={page}
                className="inline-flex h-10 min-w-8 items-center justify-center px-1 text-[12px] font-black text-[#8A9AA4]"
              >
                …
              </span>
            );
          }

          const active = page === safePage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-[12px] border px-3 text-[12px] font-black transition ${
                active
                  ? "border-[#355872] bg-[#355872] text-white shadow-[0_8px_18px_rgba(53,88,114,0.18)] dark:border-[#9CD5FF] dark:bg-[#9CD5FF] dark:text-[#071521]"
                  : "border-[#355872]/12 bg-white/70 text-[#355872] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#355872]/14 bg-white/75 px-4 text-[12px] font-black text-[#355872] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-[#9CD5FF] dark:hover:bg-white/[0.07]"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
