import React from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import Sparkline from "../charts/Sparkline";

import useCurrency from "../../../hooks/useCurrency";
import {
  formatCurrency,
  formatLargeCurrency,
} from "../../../utils/formatCurrency";

const CoinTableRow = ({
  id,
  index,
  image,
  name,
  symbol,
  price,
  change,
  marketCap,
  volume,
  chartData,
  positive = true,
  onWatchlistToggle,
  isInWatchlist,
}) => {
  const { currency } = useCurrency();
  const watched = isInWatchlist?.(id);

  return (
    <tr
      className="
        border-b
        border-[var(--app-border)]
        transition
        hover:bg-[var(--app-bg)]
      "
    >
      {/* Number */}

      <td className="px-5 py-4 text-sm font-medium text-[var(--app-soft)]">
        {index}
      </td>
      {/* Coin */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <h4 className="font-medium text-[var(--app-text)]">{name}</h4>

            <p className="text-xs uppercase text-[var(--app-muted)]">
              {symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}

      <td className="px-5 py-4 font-medium text-[var(--app-text)]">
        {formatCurrency(price, currency)}
      </td>

      {/* Change */}

      <td
        className={`px-5 py-4 font-semibold ${
          positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </td>

      {/* Market Cap */}

      <td className="px-5 py-4 text-[var(--app-text)]">
        {formatLargeCurrency(marketCap, currency)}
      </td>

      {/* Volume */}

      <td className="px-5 py-4 text-[var(--app-text)]">
        {" "}
        {formatLargeCurrency(volume, currency)}
      </td>

      {/* Chart */}

      <td className="w-[130px] px-5 py-4">
        <div className="h-10">
          <Sparkline data={chartData} positive={positive} />
        </div>
      </td>

      {/* Actions */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
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

          <button
            className="
              flex
              h-8
              w-8
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
      </td>
    </tr>
  );
};

export default CoinTableRow;
