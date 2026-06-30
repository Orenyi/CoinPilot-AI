import React from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";

import Sparkline from "../charts/Sparkline";

const CoinTableRow = ({
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
}) => {
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

      <td className="px-5 py-4 font-medium text-[var(--app-text)]">${price}</td>

      {/* Change */}

      <td
        className={`px-5 py-4 font-semibold ${
          positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </td>

      {/* Market Cap */}

      <td className="px-5 py-4 text-[var(--app-text)]">{marketCap}</td>

      {/* Volume */}

      <td className="px-5 py-4 text-[var(--app-text)]">{volume}</td>

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
            className="
              text-[var(--app-muted)]
              transition
              hover:text-yellow-400
            "
          >
            <FiStar size={18} />
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
