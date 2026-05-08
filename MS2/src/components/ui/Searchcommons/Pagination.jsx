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
          bg-white
          flex items-center justify-center
          shadow-sm
          hover:bg-gray-50
          transition
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
            ? "bg-[#EAF3FF] text-[#69A7FF]"
            : "bg-white border border-gray-100 text-[#16253A] hover:bg-gray-50"
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
              ? "bg-[#EAF3FF] text-[#69A7FF]"
              : "bg-white border border-gray-100 text-[#16253A] hover:bg-gray-50"
          }
        `}
      >
        {page}
      </button>
    ))}

    {/* DOTS */}
    <div
      className="
        w-11 h-11
        rounded-2xl
        border border-gray-100
        bg-white
        flex items-center justify-center
        text-gray-400
        shadow-sm
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
            ? "bg-[#EAF3FF] text-[#69A7FF]"
            : "bg-white border border-gray-100 text-[#16253A] hover:bg-gray-50"
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
          bg-white
          flex items-center justify-center
          shadow-sm
          hover:bg-gray-50
          transition
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}