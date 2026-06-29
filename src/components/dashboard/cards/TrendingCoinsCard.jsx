import React from "react";

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
    <div
      className="
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_12px_30px_rgba(124,58,237,0.12)]
      "
    >
      {/* Header */}

      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--app-text)]">
            {name}
          </h3>

          <p className="uppercase text-xs text-[var(--app-muted)]">{symbol}</p>
        </div>
      </div>

      {/* Price */}

      <div className="mt-4">
        <h2 className="text-2xl font-bold text-[var(--app-text)]">${price}</h2>

        <p
          className={`mt-1 text-sm font-medium ${
            positive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </p>
      </div>

      {/* Chart */}

      <div className="mt-5 h-14">
        <Sparkline data={chartData} positive={positive} />
      </div>
    </div>
  );
};

export default TrendingCoinsCard;
