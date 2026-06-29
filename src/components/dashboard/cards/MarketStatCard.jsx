import React from "react";

const MarketStatCard = ({
  icon,
  title,
  value,
  change,
  positive = true,
  chart,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_12px_30px_rgba(124,58,237,0.12)]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[var(--app-bg)]
            "
          >
            {icon}
          </div>

          <div>
            <p className="text-xs text-[var(--app-muted)]">{title}</p>

            <h3 className="mt-1 text-2xl font-bold text-[var(--app-text)]">
              {value}
            </h3>
          </div>
        </div>
      </div>

      {/* Change */}

      <p
        className={`mt-3 text-sm font-medium ${
          positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </p>

      {/* Chart */}

      <div className="mt-4 h-12 overflow-hidden rounded-lg">{chart}</div>
    </div>
  );
};

export default MarketStatCard;
