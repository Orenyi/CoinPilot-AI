import React, { useMemo, useState } from "react";

import CoinTableRow from "./CoinTableRow";
import CoinSearch from "./CoinSearch";
import TableTabs from "./TableTabs";
import MobileCoinCard from "./MobileCoinCard";
import useWatchlist from "../../../hooks/useWatchlist";

const CoinTable = ({ coins = [] }) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredCoins = useMemo(() => {
    let data = [...coins];

    if (activeTab === "Top Gainers") {
      data = data.filter((coin) => coin.positive);
    }

    if (activeTab === "Top Losers") {
      data = data.filter((coin) => !coin.positive);
    }

    if (search.trim()) {
      data = data.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return data;
  }, [coins, search, activeTab]);

  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
      "
    >
      {/* Header */}

      <div className="border-b border-[var(--app-border)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left */}

          <div className="flex flex-wrap items-center gap-y-6 gap-x-16">
            <h2 className="text-xl font-bold text-[var(--app-text)]">
              Top Cryptocurrencies
            </h2>

            <TableTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Search */}

          <CoinSearch
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full">
          <thead>
            <tr
              className="
                border-b
                border-[var(--app-border)]
                text-left
                text-sm
                text-[var(--app-muted)]
              "
            >
              <th className="w-12 px-5 py-4">#</th>
              <th className="px-5 py-4">Coin</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">24h Change</th>
              <th className="px-5 py-4">Market Cap</th>
              <th className="px-5 py-4">Volume (24h)</th>
              <th className="px-5 py-4"></th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCoins.map((coin, index) => (
              <CoinTableRow
                key={coin.id}
                index={index + 1}
                {...coin}
                onWatchlistToggle={toggleWatchlist}
                isInWatchlist={isInWatchlist}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div
        className="
    grid
    grid-cols-1
    gap-4
    p-4
    sm:grid-cols-2
    lg:hidden
  "
      >
        {filteredCoins.map((coin) => (
          <MobileCoinCard
            key={coin.id}
            {...coin}
            onWatchlistToggle={toggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        ))}
      </div>
    </section>
  );
};

export default CoinTable;
