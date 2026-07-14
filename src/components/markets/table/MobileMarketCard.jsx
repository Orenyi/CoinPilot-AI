import React from "react";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import useCurrency from "../../../hooks/useCurrency";
import {
  formatCurrency,
  formatLargeCurrency,
} from "../../../utils/formatCurrency";

const MobileMarketCard = ({
  coin,
  index,
  onCoinClick,
  onWatchlistToggle,
  isInWatchlist,
}) => {
  const positive = coin.price_change_percentage_24h >= 0;

  const watched = isInWatchlist?.(coin.id);
  const { currency } = useCurrency();

  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-4
        transition-all
        duration-300
        hover:border-[var(--color-primary-2)]
      "
    >
      {/* Top */}

      <div className="flex items-start justify-between">
        <button
          onClick={() => onCoinClick?.(coin)}
          className="flex items-center gap-3 text-left"
        >
          <span className="w-6 text-xs font-semibold text-[var(--app-muted)]">
            #{index + 1}
          </span>

          <img
            src={coin.image}
            alt={coin.name}
            className="h-10 w-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[var(--app-text)]">
              {coin.name}
            </h3>

            <p className="text-xs uppercase text-[var(--app-muted)]">
              {coin.symbol}
            </p>
          </div>
        </button>

        <button
          onClick={() => onWatchlistToggle?.(coin.id)}
          className="
    rounded-xl
    p-2
    transition-all
    duration-300
    hover:scale-110
    hover:bg-[var(--app-bg)]
  "
        >
          {watched ? (
            <FaStar
              size={18}
              className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
            />
          ) : (
            <FiStar
              size={18}
              className="text-[var(--app-muted)] hover:text-yellow-400"
            />
          )}
        </button>
      </div>

      {/* Price */}

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--app-muted)]">Price</p>

          <h2 className="mt-1 text-xl font-bold text-[var(--app-text)]">
            {formatCurrency(coin.current_price, currency)}
          </h2>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
            positive
              ? "bg-green-500/10 text-[var(--color-success)]"
              : "bg-red-500/10 text-[var(--color-danger)]"
          }`}
        >
          {positive ? (
            <FiArrowUpRight size={16} />
          ) : (
            <FiArrowDownRight size={16} />
          )}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Stats */}

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs text-[var(--app-muted)]">Market Cap</p>

          <p className="mt-1 font-semibold text-[var(--app-text)]">
            {formatLargeCurrency(coin.market_cap, currency)}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--app-muted)]">Volume</p>

          <p className="mt-1 font-semibold text-[var(--app-text)]">
            {formatLargeCurrency(coin.total_volume, currency)}
          </p>
        </div>
      </div>

      {/* Bottom */}

      <div className="mt-5 flex items-center justify-between border-t border-[var(--app-border)] pt-4">
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
          AI Insight
        </span>

        <button
          onClick={() => onCoinClick?.(coin)}
          className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-[var(--color-primary-2)]
            transition
            hover:gap-2
          "
        >
          Details
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default MobileMarketCard;
