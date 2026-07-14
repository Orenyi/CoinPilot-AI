import React from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import Sparkline from "../charts/Sparkline";

import useCurrency from "../../../hooks/useCurrency";
import { formatCurrency } from "../../../utils/formatCurrency";

const MobileCoinCard = ({
  id,
  image,
  name,
  symbol,
  price,
  change,
  chartData,
  positive = true,
  onWatchlistToggle,
  isInWatchlist,
}) => {
  const watched = isInWatchlist?.(id);
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
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-[var(--app-text)]">{name}</h3>

            <p className="text-xs uppercase text-[var(--app-muted)]">
              {symbol}
            </p>
          </div>
        </div>

        <button
          onClick={() => onWatchlistToggle?.(id)}
          className="
          rounded-xl
          p-2
          transition-all
          duration-300
          hover:scale-110
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

      <div className="mt-5">
        <h2 className="text-2xl font-bold text-[var(--app-text)]">
          {formatCurrency(price, currency)}
        </h2>

        <p
          className={`mt-1 text-sm font-semibold ${
            positive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </p>
      </div>

      {/* Bottom */}

      <div className="mt-4 flex items-center justify-between">
        <div className="h-12 w-28">
          <Sparkline data={chartData} positive={positive} />
        </div>

        <button
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
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MobileCoinCard;
