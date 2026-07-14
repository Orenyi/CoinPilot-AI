import React, { useEffect, useRef, useState } from "react";
import useCurrency from "../../../hooks/useCurrency";
import { FiSearch, FiBell, FiRefreshCw, FiChevronDown } from "react-icons/fi";

import ThemeToggle from "../../layout/ThemeToggle";

const Topbar = ({ title, subtitle, onRefresh, refreshing }) => {
  const { currency, currencies, setCurrency } = useCurrency();
  const [showCurrencies, setShowCurrencies] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCurrencies(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-[77px] items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left */}

      <div className="min-w-0">
        <h1 className="truncate font-[var(--font-heading)] text-2xl font-bold text-[var(--app-text)] lg:text-[30px]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 hidden text-sm text-[var(--app-soft)] sm:block">
            {subtitle}
          </p>
        )}
      </div>
      {/* Right */}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}

        {/* Currency */}

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowCurrencies((prev) => !prev)}
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
            {currency}
            <FiChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                showCurrencies ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCurrencies && (
            <div
              className="
                absolute
                right-0
                mt-2
                w-56
                overflow-hidden
                rounded-2xl
                border
                border-[var(--app-border)]
                bg-[var(--app-card)]
                shadow-xl
                ring-1
                ring-[var(--app-border)]
                backdrop-blur-xl
                z-[999]
              "
            >
              {currencies.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setCurrency(item.code);
                    setShowCurrencies(false);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-[var(--app-bg)]
                    ${
                      currency === item.code
                        ? "bg-[var(--color-primary-2)]/10 text-[var(--color-primary-2)]"
                        : "text-[var(--app-text)]"
                    }
                  `}
                >
                  <div>
                    <p className="font-medium">{item.code}</p>
                  </div>

                  <span className="text-sm font-semibold">{item.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
          onClick={onRefresh}
          disabled={refreshing}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <FiRefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
