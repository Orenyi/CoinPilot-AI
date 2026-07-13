import React from "react";

const rows = Array.from({ length: 6 });

const LoadingWatchlist = () => {
  return (
    <>
      {/* ================= Desktop ================= */}

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[var(--app-border)] bg-[var(--app-bg)]">
              <tr>
                {[
                  "#",
                  "Coin",
                  "Price",
                  "24H",
                  "Market Cap",
                  "Volume",
                  "Action",
                ].map((item) => (
                  <th
                    key={item}
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
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
                    <div className="h-4 w-4 animate-pulse rounded bg-[var(--app-card)]" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--app-card)]" />

                      <div className="space-y-2">
                        <div className="h-4 w-28 animate-pulse rounded bg-[var(--app-card)]" />
                        <div className="h-3 w-14 animate-pulse rounded bg-[var(--app-card)]" />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="ml-auto h-4 w-24 animate-pulse rounded bg-[var(--app-card)]" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-[var(--app-card)]" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="ml-auto h-4 w-28 animate-pulse rounded bg-[var(--app-card)]" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="ml-auto h-4 w-24 animate-pulse rounded bg-[var(--app-card)]" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--app-card)]" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Mobile ================= */}

      <div className="grid gap-4 xl:hidden">
        {rows.map((_, index) => (
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
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-[var(--app-card)]" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--app-card)]" />
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--app-card)]" />
              </div>

              <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--app-card)]" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--app-card)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--app-card)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--app-card)]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LoadingWatchlist;
