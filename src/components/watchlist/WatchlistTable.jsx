import React from "react";

import WatchlistRow from "./WatchlistRow";
import MobileWatchlistCard from "./MobileWatchlistCard";

import EmptyWatchlist from "./EmptyWatchlist";

const WatchlistTable = ({ coins = [], loading = false, onRemove }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
        <p className="text-[var(--app-muted)]">Loading watchlist...</p>
      </div>
    );
  }

  if (!coins.length) {
    return <EmptyWatchlist />;
  }

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
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Coin
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Price
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  24h Change
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Market Cap
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  7D Chart
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {coins.map((coin, index) => (
                <WatchlistRow
                  key={coin.id}
                  coin={coin}
                  index={index}
                  onRemove={onRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Mobile ================= */}

      <div className="grid gap-4 xl:hidden">
        {coins.map((coin, index) => (
          <MobileWatchlistCard
            key={coin.id}
            coin={coin}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  );
};

export default WatchlistTable;
