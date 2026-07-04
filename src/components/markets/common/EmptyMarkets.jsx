import React from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const EmptyMarkets = ({
  title = "No cryptocurrencies found",
  description = "Try adjusting your search, filters or categories.",
  onReset,
}) => {
  return (
    <section
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        px-6
        py-20
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-[var(--color-primary-2)]/10
        "
      >
        <FiSearch size={36} className="text-[var(--color-primary-2)]" />
      </div>

      {/* Title */}

      <h2 className="mt-6 font-[var(--font-heading)] text-2xl font-bold text-[var(--app-text)]">
        {title}
      </h2>

      {/* Description */}

      <p className="mt-3 max-w-md text-sm leading-7 text-[var(--app-soft)]">
        {description}
      </p>

      {/* Reset */}

      {onReset && (
        <button
          onClick={onReset}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-[#2563eb]
            via-[#7c3aed]
            to-[#9333ea]
            px-6
            py-3
            font-medium
            text-white
            transition-all
            duration-300
            hover:scale-[1.03]
            hover:shadow-lg
          "
        >
          <FiRefreshCw size={18} />
          Reset Filters
        </button>
      )}
    </section>
  );
};

export default EmptyMarkets;
