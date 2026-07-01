import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

import Sparkline from "../charts/Sparkline";

const TrendingCoinsCard = ({
  image,
  name,
  symbol,
  price,
  change,
  positive = true,
  chartData,
}) => {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)]
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          -top-12
          -right-12
          h-40
          w-40
          rounded-full
          bg-gradient-to-br
          from-[#2563eb]/10
          via-[#7c3aed]/10
          to-transparent
          blur-3xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Coin */}

      <div className="relative flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="
            h-14
            w-14
            rounded-full
            border
            border-[var(--app-border)]
            object-cover
            shadow-md
          "
        />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-[var(--app-text)]">
            {name}
          </h3>

          <p className="text-sm uppercase tracking-wide text-[var(--app-muted)]">
            {symbol}
          </p>
        </div>
      </div>

      {/* Price */}

      <div className="relative mt-6">
        <h2 className="text-2xl font-bold text-[var(--app-text)]">${price}</h2>

        <div
          className={`
            mt-3
            inline-flex
            items-center
            gap-1
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${
              positive
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }
          `}
        >
          {positive ? (
            <FiArrowUpRight size={14} />
          ) : (
            <FiArrowDownRight size={14} />
          )}

          {change}
        </div>
      </div>

      {/* Chart */}

      <div className="mt-6 h-16">
        <Sparkline data={chartData} positive={positive} />
      </div>
    </article>
  );
};

export default TrendingCoinsCard;
