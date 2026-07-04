import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage = 1, totalPages = 10, onPageChange }) => {
  const pages = [];

  let start = Math.max(currentPage - 2, 1);
  let end = Math.min(start + 4, totalPages);

  if (end - start < 4) {
    start = Math.max(end - 4, 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 md:flex-row">
      {/* Left */}

      <p className="text-sm text-[var(--app-soft)]">
        Page{" "}
        <span className="font-semibold text-[var(--app-text)]">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--app-text)]">
          {totalPages}
        </span>
      </p>

      {/* Controls */}

      <div className="flex items-center gap-2">
        {/* Previous */}

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            text-[var(--app-text)]
            transition
            hover:border-[var(--color-primary-2)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <FiChevronLeft />
        </button>

        {/* Page Numbers */}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`
              h-10
              min-w-[40px]
              rounded-xl
              border
              text-sm
              font-semibold
              transition-all
              duration-300
              ${
                page === currentPage
                  ? "border-transparent bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] text-white shadow-lg"
                  : "border-[var(--app-border)] bg-[var(--app-bg)] text-[var(--app-soft)] hover:border-[var(--color-primary-2)] hover:text-[var(--app-text)]"
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Next */}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-bg)]
            text-[var(--app-text)]
            transition
            hover:border-[var(--color-primary-2)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
