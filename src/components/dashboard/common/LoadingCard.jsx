import React from "react";

const LoadingCard = () => {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-6
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[var(--app-bg)]" />

        <div className="h-7 w-20 animate-pulse rounded-full bg-[var(--app-bg)]" />
      </div>

      {/* Title */}

      <div className="mt-6 h-4 w-32 animate-pulse rounded bg-[var(--app-bg)]" />

      {/* Value */}

      <div className="mt-4 h-9 w-40 animate-pulse rounded bg-[var(--app-bg)]" />

      {/* Chart */}

      <div className="mt-6 h-16 animate-pulse rounded-xl bg-[var(--app-bg)]" />
    </div>
  );
};

export default LoadingCard;
