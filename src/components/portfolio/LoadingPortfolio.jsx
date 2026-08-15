import React from "react";

const stats = Array.from({ length: 6 });
const rows = Array.from({ length: 5 });

const LoadingPortfolio = () => {
  return (
    <div className="space-y-8">
      {/* ================= Overview Cards ================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((_, index) => (
          <div
            key={index}
            className="
              rounded-3xl
              border
              border-[var(--app-border)]
              bg-[var(--app-card)]
              p-6
              shadow-[var(--shadow-card)]
            "
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 w-28 animate-pulse rounded bg-[var(--app-card-2)]" />

                <div className="mt-5 h-8 w-40 animate-pulse rounded bg-[var(--app-card-2)]" />

                <div className="mt-5 h-4 w-24 animate-pulse rounded bg-[var(--app-card-2)]" />
              </div>

              <div className="h-14 w-14 animate-pulse rounded-2xl bg-[var(--app-card-2)]" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= Insights + Allocation ================= */}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Insights */}

        <div
          className="
            rounded-3xl
            border
            border-[var(--app-border)]
            bg-[var(--app-card)]
            p-6
            shadow-[var(--shadow-card)]
          "
        >
          <div className="h-6 w-48 animate-pulse rounded bg-[var(--app-card-2)]" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-[var(--app-border)]
                  bg-[var(--app-bg)]
                  p-4
                "
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-24 animate-pulse rounded bg-[var(--app-card-2)]" />

                    <div className="h-5 w-32 animate-pulse rounded bg-[var(--app-card-2)]" />

                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--app-card-2)]" />
                  </div>

                  <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--app-card-2)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation */}

        <div
          className="
            rounded-3xl
            border
            border-[var(--app-border)]
            bg-[var(--app-card)]
            p-6
            shadow-[var(--shadow-card)]
          "
        >
          <div className="h-6 w-40 animate-pulse rounded bg-[var(--app-card-2)]" />

          <div className="mx-auto mt-8 h-56 w-56 animate-pulse rounded-full border-8 border-[var(--app-card-2)]" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--app-card-2)]" />

                  <div className="space-y-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--app-card-2)]" />

                    <div className="h-3 w-12 animate-pulse rounded bg-[var(--app-card-2)]" />
                  </div>
                </div>

                <div className="h-4 w-20 animate-pulse rounded bg-[var(--app-card-2)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Portfolio Table ================= */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-[var(--app-border)]
          bg-[var(--app-card)]
          shadow-[var(--shadow-card)]
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[var(--app-border)] bg-[var(--app-bg)]">
              <tr>
                {[
                  "Asset",
                  "Holdings",
                  "Price",
                  "Value",
                  "Profit",
                  "24H",
                  "Allocation",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="
                      px-6
                      py-5
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-[var(--app-muted)]
                    "
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((_, index) => (
                <tr key={index} className="border-b border-[var(--app-border)]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--app-card-2)]" />

                      <div className="space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-[var(--app-card-2)]" />

                        <div className="h-3 w-16 animate-pulse rounded bg-[var(--app-card-2)]" />
                      </div>
                    </div>
                  </td>

                  {Array.from({ length: 6 }).map((_, i) => (
                    <td key={i} className="px-6 py-5">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--app-card-2)]" />
                    </td>
                  ))}

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--app-card-2)]" />

                      <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--app-card-2)]" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoadingPortfolio;
