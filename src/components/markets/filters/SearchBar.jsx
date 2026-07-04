import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ value = "", onChange }) => {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange?.("");
  };

  return (
    <section>
      <div
        className={`
          flex
          items-center
          rounded-2xl
          border
          bg-[var(--app-surface)]
          transition-all
          duration-300
          ${
            focused
              ? "border-[var(--color-primary-2)] shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
              : "border-[var(--app-border)]"
          }
        `}
      >
        {/* Search Icon */}

        <div className="px-5 text-[var(--app-muted)]">
          <FiSearch size={20} />
        </div>

        {/* Input */}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search cryptocurrencies..."
          className="
            h-14
            flex-1
            bg-transparent
            text-sm
            text-[var(--app-text)]
            outline-none
            placeholder:text-[var(--app-muted)]
          "
        />

        {/* Clear */}

        {value && (
          <button
            onClick={handleClear}
            className="
              mr-3
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-[var(--app-muted)]
              transition
              hover:bg-[var(--app-bg)]
              hover:text-[var(--app-text)]
            "
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </section>
  );
};

export default SearchBar;
