import React from "react";

const LoadingTable = () => {
  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
      "
    >
      {/* Header */}

      <div className="border-b border-[var(--app-border)] p-6">
        <div className="h-7 w-52 animate-pulse rounded bg-[var(--app-bg)]" />

        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[var(--app-bg)]" />
      </div>

      {/* Rows */}

      <div className="divide-y divide-[var(--app-border)]">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-6
              px-6
              py-5
            "
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--app-bg)]" />

            <div className="flex-1">
              <div className="h-4 w-40 animate-pulse rounded bg-[var(--app-bg)]" />

              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-[var(--app-bg)]" />
            </div>

            <div className="h-4 w-24 animate-pulse rounded bg-[var(--app-bg)]" />

            <div className="h-4 w-20 animate-pulse rounded bg-[var(--app-bg)]" />

            <div className="h-10 w-28 animate-pulse rounded-xl bg-[var(--app-bg)]" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoadingTable;
