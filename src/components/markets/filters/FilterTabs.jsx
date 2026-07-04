import React from "react";
import {
  FiGrid,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
  FiStar,
} from "react-icons/fi";

const tabs = [
  {
    id: "all",
    label: "All",
    icon: FiGrid,
  },
  {
    id: "trending",
    label: "Trending",
    icon: FiTrendingUp,
  },
  {
    id: "gainers",
    label: "Top Gainers",
    icon: FiArrowUpRight,
  },
  {
    id: "losers",
    label: "Top Losers",
    icon: FiArrowDownRight,
  },
  {
    id: "new",
    label: "New Listings",
    icon: FiClock,
  },
  {
    id: "watchlist",
    label: "Watchlist",
    icon: FiStar,
  },
];

const FilterTabs = ({ activeTab = "all", onChange }) => {
  return (
    <section className="overflow-x-auto hide-scrollbar">
      <div className="flex min-w-max gap-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => onChange?.(id)}
              className={`
                flex
                items-center
                gap-2
                whitespace-nowrap
                rounded-xl
                border
                px-5
                py-3
                text-sm
                font-semibold
                transition-all
                duration-300
                ${
                  active
                    ? "border-transparent bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] text-white shadow-lg"
                    : "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-soft)] hover:border-[var(--color-primary-2)] hover:text-[var(--app-text)]"
                }
              `}
            >
              <Icon size={17} />

              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilterTabs;
