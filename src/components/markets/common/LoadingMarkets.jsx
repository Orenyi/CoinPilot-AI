import React from "react";

const LoadingMarkets = () => {
  return (
    <>
      {/* ================= Desktop Table ================= */}

      <div
        className="
          hidden
          overflow-hidden
          rounded-2xl
          border
          border-[var(--app-border)]
          bg-[var(--app-surface)]
          xl:block
        "
      >
        {/* Header */}

        <div className="grid grid-cols-9 gap-4 border-b border-[var(--app-border)] bg-[var(--app-bg)] px-6 py-5">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded bg-[var(--app-border)]"
            />
          ))}
        </div>

        {/* Rows */}

        {[...Array(10)].map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-9 items-center gap-4 border-b border-[var(--app-border)] px-6 py-5 last:border-none"
          >
            <div className="h-4 w-6 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--app-border)]" />

              <div>
                <div className="h-4 w-28 animate-pulse rounded bg-[var(--app-border)]" />
                <div className="mt-2 h-3 w-12 animate-pulse rounded bg-[var(--app-border)]" />
              </div>
            </div>

            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mx-auto h-10 w-28 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="ml-auto h-4 w-24 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mx-auto h-7 w-14 animate-pulse rounded-full bg-[var(--app-border)]" />

            <div className="mx-auto h-9 w-9 animate-pulse rounded-lg bg-[var(--app-border)]" />
          </div>
        ))}
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="grid gap-4 xl:hidden">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-4
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--app-border)]" />

                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-[var(--app-border)]" />
                  <div className="mt-2 h-3 w-14 animate-pulse rounded bg-[var(--app-border)]" />
                </div>
              </div>

              <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--app-border)]" />
            </div>

            <div className="mt-6 h-6 w-32 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mt-6 h-16 w-full animate-pulse rounded-xl bg-[var(--app-border)]" />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--app-border)]" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-[var(--app-border)]" />
              </div>

              <div>
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--app-border)]" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-[var(--app-border)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoadingMarkets;
