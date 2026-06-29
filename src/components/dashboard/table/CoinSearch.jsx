import React from "react";
import { FiSearch } from "react-icons/fi";

const CoinSearch = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-[280px]">
      <FiSearch
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-[var(--app-muted)]
        "
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search cryptocurrency..."
        className="
          h-11
          w-full
          rounded-xl
          border
          border-[var(--app-border)]
          bg-[var(--app-bg)]
          pl-11
          pr-4
          text-sm
          text-[var(--app-text)]
          placeholder:text-[var(--app-muted)]
          outline-none
          transition-all
          duration-300
          focus:border-[var(--color-primary-2)]
          focus:shadow-[0_0_0_4px_rgba(124,58,237,.08)]
        "
      />
    </div>
  );
};

export default CoinSearch;
