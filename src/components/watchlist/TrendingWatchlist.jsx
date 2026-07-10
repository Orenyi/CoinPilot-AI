import React from "react";
import { FiTrendingUp, FiArrowUpRight } from "react-icons/fi";

const formatCurrency = (value) => {
  if (value == null) return "--";

  return `$${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: value >= 1 ? 2 : 6,
  })}`;
};

const TrendingWatchlist = ({ coins = [], onCoinClick }) => {
  if (!coins.length) return null;

  return (
    <section
      className="
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-6
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--app-text)]">
            <FiTrendingUp className="text-[var(--color-primary-2)]" />
            Trending In Your Watchlist
          </h2>

          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Top performing assets from your saved coins.
          </p>
        </div>
      </div>

      {/* Grid */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coins.map((coin) => {
          const positive = coin.price_change_percentage_24h >= 0;

          return (
            <button
              key={coin.id}
              onClick={() => onCoinClick?.(coin)}
              className="
                group
                rounded-2xl
                border
                border-[var(--app-border)]
                bg-[var(--app-bg)]
                p-5
                text-left
                transition-all
                duration-300
                hover:border-[var(--color-primary-2)]
                hover:-translate-y-1
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-11 w-11 rounded-full"
                  />

                  <div>
                    <h3 className="font-semibold text-[var(--app-text)]">
                      {coin.name}
                    </h3>

                    <p className="text-xs uppercase text-[var(--app-muted)]">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                <FiArrowUpRight
                  className="
                    text-[var(--app-muted)]
                    transition
                    group-hover:text-[var(--color-primary-2)]
                  "
                />
              </div>

              <div className="mt-5">
                <h4 className="text-lg font-bold text-[var(--app-text)]">
                  {formatCurrency(coin.current_price)}
                </h4>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    positive
                      ? "bg-green-500/10 text-[var(--color-success)]"
                      : "bg-red-500/10 text-[var(--color-danger)]"
                  }`}
                >
                  {positive ? "+" : ""}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingWatchlist;
