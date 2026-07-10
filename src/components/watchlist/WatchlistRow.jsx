import React from "react";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";

import Sparkline from "../dashboard/charts/Sparkline";

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

const WatchlistRow = ({ coin, index, onRemove, onCoinClick }) => {
  const positive = coin.price_change_percentage_24h >= 0;

  const chartData =
    coin.sparkline_in_7d?.price?.map((price) => ({
      value: price,
    })) ?? [];

  return (
    <tr
      className="
        border-b
        border-[var(--app-border)]
        transition
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

      {/* Market Cap */}

      <td className="px-6 py-5 text-right text-[var(--app-text)]">
        {formatLargeNumber(coin.market_cap)}
      </td>

      {/* 7D Chart */}

      <td className="w-[140px] px-4 py-5">
        <Sparkline data={chartData} positive={positive} />
      </td>

      {/* Actions */}

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onRemove?.(coin.id)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[var(--app-bg)]
              text-[var(--app-muted)]
              transition
              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <FiTrash2 size={17} />
          </button>

          <button
            onClick={() => onCoinClick?.(coin)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[var(--app-bg)]
              text-[var(--app-text)]
              transition
              hover:bg-[var(--color-primary-2)]
              hover:text-white
            "
          >
            <FiArrowRight size={17} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WatchlistRow;
