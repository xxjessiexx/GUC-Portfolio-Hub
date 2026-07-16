import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex items-center gap-3">

      {/* PREV */}
      <button
        onClick={() =>
          currentPage > 1 &&
          onPageChange(currentPage - 1)
        }
        className="
  w-11 h-11
  rounded-2xl

  border border-gray-100
  dark:border-[var(--card-border)]

  bg-white
  dark:bg-[var(--surface)]

  text-[#16253A]
  dark:text-[var(--ink)]

  flex items-center justify-center

  shadow-sm
  dark:shadow-[var(--shadow-soft)]

  transition-all

  hover:bg-gray-50
  dark:hover:bg-[var(--surface-elevated)]
"
      >
        <ChevronLeft size={18} />
      </button>

      {/* PAGE NUMBERS */}
      {totalPages <= 5 ? (
  Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).map((page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`
        w-11 h-11
        rounded-2xl
        font-semibold
        transition
        shadow-sm
        ${
          currentPage === page
            ? "bg-[#EAF3FF] text-[#69A7FF] dark:bg-[var(--surface-soft)] dark:text-[var(--primary)] dark:border dark:border-[var(--border-blue)] "
            : "bg-white dark:bg-[var(--surface)] border border-gray-100 dark:border-[var(--card-border)] text-[#16253A] dark:text-[var(--ink)] hover:bg-gray-50 dark:hover:bg-[var(--surface-elevated)]"
        
        }
      `}
    >
      {page}
    </button>
  ))
) : (
  <>
    {[1, 2, 3].map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`
          w-11 h-11
          rounded-2xl
          font-semibold
          transition
          shadow-sm
          ${
            currentPage === page
              ? "bg-[#EAF3FF] text-[#69A7FF] dark:bg-[var(--surface-soft)] dark:text-[var(--primary)] dark:border dark:border-[var(--border-blue)] "
              : "bg-white dark:bg-[var(--surface)] border border-gray-100 dark:border-[var(--card-border)] text-[#16253A] dark:text-[var(--ink)] hover:bg-gray-50 dark:hover:bg-[var(--surface-elevated)]"
          }
        `}
      >
        {page}
      </button>
    ))}

    {/* DOTS */}
    <div
      className="
       bg-white
dark:bg-[var(--surface)]

border-gray-100
dark:border-[var(--card-border)]

text-gray-400
dark:text-[var(--muted)]
      "
    >
      ...
    </div>

    {/* LAST PAGE */}
    <button
      onClick={() => onPageChange(totalPages)}
      className={`
        w-11 h-11
        rounded-2xl
        font-semibold
        transition
        shadow-sm
        ${
          currentPage === totalPages
            ? "bg-[#EAF3FF] text-[#69A7FF] dark:bg-[var(--surface-soft)] dark:text-[var(--primary)] dark:border dark:border-[var(--border-blue)] "
            : "bg-white dark:bg-[var(--surface)] border border-gray-100 dark:border-[var(--card-border)] text-[#16253A] dark:text-[var(--ink)] hover:bg-gray-50 dark:hover:bg-[var(--surface-elevated)]"
        }
      `}
    >
      {totalPages}
    </button>
  </>
)}

      {/* NEXT */}
      <button
        onClick={() =>
          currentPage < totalPages &&
          onPageChange(currentPage + 1)
        }
        className="
         w-11 h-11
  rounded-2xl

  border border-gray-100
  dark:border-[var(--card-border)]

  bg-white
  dark:bg-[var(--surface)]

  text-[#16253A]
  dark:text-[var(--ink)]

  flex items-center justify-center

  shadow-sm
  dark:shadow-[var(--shadow-soft)]

  transition-all

  hover:bg-gray-50
  dark:hover:bg-[var(--surface-elevated)]
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}