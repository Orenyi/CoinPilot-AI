import React from "react";

import MarketsRow from "./MarketsRow";
import MobileMarketCard from "./MobileMarketCard";

import EmptyMarkets from "../common/EmptyMarkets";
import LoadingMarkets from "../common/LoadingMarkets";

const MarketsTable = ({
  coins = [],
  loading = false,
  onCoinClick,
  onWatchlistToggle,
  isInWatchlist,
}) => {
  if (loading) {
    return <LoadingMarkets />;
  }

  if (!coins.length) {
    return (
      <EmptyMarkets
        title="No cryptocurrencies found"
        description="Try changing your search or filters."
      />
    );
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
                  24h
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Market Cap
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Volume
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  AI
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Watch
                </th>
              </tr>
            </thead>

            <tbody>
              {coins.map((coin, index) => (
                <MarketsRow
                  key={coin.id}
                  coin={coin}
                  index={index}
                  onCoinClick={onCoinClick}
                  onWatchlistToggle={onWatchlistToggle}
                  isInWatchlist={isInWatchlist}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Mobile ================= */}

      <div className="grid gap-4 xl:hidden">
        {coins.map((coin, index) => (
          <MobileMarketCard
            key={coin.id}
            coin={coin}
            index={index}
            onCoinClick={onCoinClick}
            onWatchlistToggle={onWatchlistToggle}
            isInWatchlist={isInWatchlist}
          />
        ))}
      </div>
    </>
  );
};

export default MarketsTable;
