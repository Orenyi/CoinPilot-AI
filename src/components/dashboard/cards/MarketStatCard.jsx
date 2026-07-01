import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const MarketStatCard = ({
  icon,
  title,
  value,
  change,
  positive = true,
  chart,
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
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_20px_45px_rgba(37,99,235,0.08)]
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-10
          -top-10
          h-40
          w-40
          rounded-full
          bg-gradient-to-br
          from-[var(--color-primary-2)]/10
          to-transparent
          blur-3xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Header */}

      <div className="relative flex items-center justify-between">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-[#2563eb]/15
            via-[#7c3aed]/15
            to-[#9333ea]/15
            text-xl
          "
        >
          {icon}
        </div>

        <div
          className={`
            flex
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

      {/* Content */}

      <div className="relative mt-6">
        <p className="text-sm font-medium text-[var(--app-muted)]">{title}</p>

        <h2
          className="
            mt-2
            text-3xl
            font-bold
            tracking-tight
            text-[var(--app-text)]
          "
        >
          {value}
        </h2>
      </div>

      {/* Chart */}

      <div className="mt-6 h-16">{chart}</div>
    </article>
  );
};

export default MarketStatCard;
