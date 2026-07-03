import React from "react";

const LoadingTrending = () => {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        p-5
      "
    >
      {/* Coin */}

      <div className="flex items-center gap-3">
        <div className="h-14 w-14 animate-pulse rounded-full bg-[var(--app-bg)]" />

        <div className="flex-1">
          <div className="h-5 w-28 animate-pulse rounded bg-[var(--app-bg)]" />

          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-[var(--app-bg)]" />
        </div>
      </div>

      {/* Price */}

      <div className="mt-6 h-8 w-32 animate-pulse rounded bg-[var(--app-bg)]" />

      {/* Badge */}

      <div className="mt-4 h-7 w-20 animate-pulse rounded-full bg-[var(--app-bg)]" />

      {/* Chart */}

      <div className="mt-6 h-16 animate-pulse rounded-xl bg-[var(--app-bg)]" />
    </div>
  );
};

export default LoadingTrending;
