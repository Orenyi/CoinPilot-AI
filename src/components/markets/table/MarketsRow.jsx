import React from "react";
import { FiArrowUpRight, FiArrowDownRight, FiStar } from "react-icons/fi";

import Sparkline from "../../dashboard/charts/Sparkline";

const formatCurrency = (value) => {
  if (value == null) return "--";

  return `$${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: value >= 1 ? 2 : 6,
  })}`;
};

const formatLargeNumber = (value) => {
  if (!value) return "--";

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  return `$${Number(value).toLocaleString()}`;
};

const MarketsRow = ({ coin, index, onCoinClick, onWatchlistToggle }) => {
  const positive = coin.price_change_percentage_24h >= 0;

  const sparkline =
    coin.sparkline_in_7d?.price?.map((price) => ({
      value: price,
    })) ?? [];

  return (
    <tr
      className="
        border-b
        border-[var(--app-border)]
        transition-colors
        duration-300
        hover:bg-[var(--app-bg)]
      "
    >
      {/* Rank */}

      <td className="px-6 py-5 text-sm font-medium text-[var(--app-soft)]">
        {index + 1}
      </td>

      {/* Coin */}

      <td className="px-6 py-5">
        <button
          onClick={() => onCoinClick?.(coin)}
          className="flex items-center gap-4 text-left"
        >
          <img
            src={coin.image}
            alt={coin.name}
            className="h-11 w-11 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[var(--app-text)]">
              {coin.name}
            </h3>

            <p className="mt-1 text-xs uppercase text-[var(--app-muted)]">
              {coin.symbol}
            </p>
          </div>
        </button>
      </td>

      {/* Price */}

      <td className="px-6 py-5 text-right font-semibold text-[var(--app-text)]">
        {formatCurrency(coin.current_price)}
      </td>

      {/* 24h */}

      <td
        className={`px-6 py-5 text-right font-semibold ${
          positive
            ? "text-[var(--color-success)]"
            : "text-[var(--color-danger)]"
        }`}
      >
        <div className="flex items-center justify-end gap-1">
          {positive ? (
            <FiArrowUpRight size={16} />
          ) : (
            <FiArrowDownRight size={16} />
          )}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </td>

      {/* Sparkline */}

      <td className="w-[140px] px-4 py-5">
        <Sparkline data={sparkline} positive={positive} />
      </td>

      {/* Market Cap */}

      <td className="px-6 py-5 text-right text-[var(--app-text)]">
        {formatLargeNumber(coin.market_cap)}
      </td>

      {/* Volume */}

      <td className="px-6 py-5 text-right text-[var(--app-soft)]">
        {formatLargeNumber(coin.total_volume)}
      </td>

      {/* AI Score */}

      <td className="px-6 py-5 text-center">
        <span
          className="
            rounded-full
            bg-[var(--color-primary-2)]/10
            px-3
            py-1
            text-xs
            font-semibold
            text-[var(--color-primary-2)]
          "
        >
          Soon
        </span>
      </td>

      {/* Watchlist */}

      <td className="px-6 py-5 text-center">
        <button
          onClick={() => onWatchlistToggle?.(coin)}
          className="
            rounded-lg
            p-2
            text-[var(--app-muted)]
            transition
            hover:bg-[var(--app-card)]
            hover:text-yellow-400
          "
        >
          <FiStar size={18} />
        </button>
      </td>
    </tr>
  );
};

export default MarketsRow;
