import React from "react";
import { FiChevronDown } from "react-icons/fi";

const sortOptions = [
  {
    value: "market_cap_desc",
    label: "Market Cap",
  },
  {
    value: "volume_desc",
    label: "Volume",
  },
  {
    value: "price_desc",
    label: "Price",
  },
  {
    value: "price_change_percentage_24h_desc",
    label: "24h Change",
  },
  {
    value: "name_asc",
    label: "Name (A-Z)",
  },
];

const SortDropdown = ({ value = "market_cap_desc", onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-medium text-[var(--app-soft)] sm:block">
        Sort By
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            h-11
            appearance-none
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            px-4
            pr-10
            text-sm
            font-medium
            text-[var(--app-text)]
            outline-none
            transition-all
            duration-300
            hover:border-[var(--color-primary-2)]
            focus:border-[var(--color-primary-2)]
            focus:ring-2
            focus:ring-[var(--color-primary-2)]/20
          "
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[var(--app-muted)]
          "
        />
      </div>
    </div>
  );
};

export default SortDropdown;
