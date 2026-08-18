import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

import { searchCoins } from "../../services/coinGeckoService";

const CompareCoinModal = ({ currentCoin, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setCoins([]);
        return;
      }

      try {
        setLoading(true);

        const results = await searchCoins(query);

        setCoins(results.filter((item) => item.id !== currentCoin?.id));
      } catch (error) {
        console.error("[CompareCoinModal]", error);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(search, 350);

    return () => clearTimeout(timeout);
  }, [query, currentCoin?.id]);

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-[var(--app-border)]
          bg-[var(--app-card)]
          shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--app-border)]
            px-4
            py-4
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-semibold
                text-[var(--app-text)]
              "
            >
              Compare Coins
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-[var(--app-muted)]
              "
            >
              Select another coin to compare with {currentCoin?.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-[var(--app-muted)]
              transition-colors
              hover:bg-[var(--app-card-2)]
              hover:text-[var(--app-text)]
            "
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Search */}

        <div className="p-4">
          <div className="relative">
            <FiSearch
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search Bitcoin, Ethereum..."
              className="
                h-10
                w-full
                rounded-lg
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                pl-9
                pr-3
                text-sm
                text-[var(--app-text)]
                outline-none
                placeholder:text-[var(--app-muted)]
                focus:border-[var(--color-primary-2)]
              "
            />
          </div>

          {/* Results */}

          <div className="mt-3 max-h-[320px] overflow-y-auto">
            {loading && (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-[var(--app-muted)]">Searching...</p>
              </div>
            )}

            {!loading && query.trim() && coins.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-[var(--app-muted)]">
                  No coins found.
                </p>
              </div>
            )}

            {!query.trim() && (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-[var(--app-muted)]">
                  Search for a coin to compare.
                </p>
              </div>
            )}

            <div className="space-y-1">
              {coins.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    transition-colors
                    hover:bg-[var(--app-card-2)]
                  "
                >
                  <img
                    src={item.image}
                    alt=""
                    className="
                      h-8
                      w-8
                      shrink-0
                      rounded-full
                    "
                  />

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                        text-[var(--app-text)]
                      "
                    >
                      {item.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        uppercase
                        text-[var(--app-muted)]
                      "
                    >
                      {item.symbol}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareCoinModal;
