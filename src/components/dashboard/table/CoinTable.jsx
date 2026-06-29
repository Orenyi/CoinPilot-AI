import React from "react";

import CoinTableRow from "./CoinTableRow";

const CoinTable = ({ coins }) => {
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

      <div className="border-b border-[var(--app-border)] px-6 py-5">
        <h2 className="text-xl font-bold text-[var(--app-text)]">
          Top Cryptocurrencies
        </h2>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
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
              <th className="px-5 py-4">Coin</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">24h</th>
              <th className="px-5 py-4">Market Cap</th>
              <th className="px-5 py-4">Volume</th>
              <th className="px-5 py-4">Chart</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {coins.map((coin) => (
              <CoinTableRow key={coin.id} {...coin} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CoinTable;
