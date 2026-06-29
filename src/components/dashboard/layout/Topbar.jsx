import React from "react";
import { FiSearch, FiBell, FiRefreshCw, FiChevronDown } from "react-icons/fi";

import ThemeToggle from "../../layout/ThemeToggle";

const Topbar = () => {
  return (
    <div className="flex h-[77px] items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left */}

      <div className="min-w-0">
        <h1 className="truncate font-[var(--font-heading)] text-2xl font-bold text-[var(--app-text)] lg:text-[30px]">
          Market Dashboard
        </h1>

        <p className="mt-1 hidden text-sm text-[var(--app-soft)] sm:block">
          Track live cryptocurrency prices and market movements.
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}

        {/* Currency */}

        <button
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            px-4
            text-sm
            font-medium
            text-[var(--app-text)]
            transition
            hover:border-[var(--color-primary-2)]
          "
        >
          USD
          <FiChevronDown size={16} />
        </button>

        {/* Theme */}

        <ThemeToggle />

        {/* Notifications */}

        <button
          className="
            hidden
            sm:flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            text-[var(--app-text)]
            transition
            hover:border-[var(--color-primary-2)]
          "
        >
          <FiBell size={18} />
        </button>

        {/* Refresh */}

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            text-[var(--app-text)]
            transition
            hover:border-[var(--color-primary-2)]
          "
        >
          <FiRefreshCw size={18} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
