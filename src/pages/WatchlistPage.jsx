import React, { useState } from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import WatchlistTable from "../components/watchlist/WatchlistTable";
import TrendingWatchlist from "../components/watchlist/TrendingWatchlist";
import EmptyWatchlist from "../components/watchlist/EmptyWatchlist";
import AddCoinModal from "../components/watchlist/AddCoinModal";

import useWatchlist from "../hooks/useWatchlist";
import useCoins from "../hooks/useCoins";

const WatchlistPage = () => {
  const { watchlist, loading, removeCoin, addCoin } = useWatchlist();

  const { coins } = useCoins();

  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout
      title="Watchlist"
      subtitle="Track and monitor your favorite cryptocurrencies."
    >
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="
            rounded-xl
            bg-gradient-to-r
            from-[#2563eb]
            via-[#7c3aed]
            to-[#9333ea]
            px-5
            py-3
            font-semibold
            text-white
          "
        >
          + Add Coin
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <WatchlistTable loading={true} coins={[]} onRemove={removeCoin} />
        ) : watchlist.length === 0 ? (
          <EmptyWatchlist onAddCoin={() => setShowModal(true)} />
        ) : (
          <>
            <WatchlistTable
              coins={watchlist}
              loading={false}
              onRemove={removeCoin}
            />

            <div className="mt-8">
              <TrendingWatchlist coins={watchlist.slice(0, 6)} />
            </div>
          </>
        )}
      </div>

      <AddCoinModal
        open={showModal}
        onClose={() => setShowModal(false)}
        coins={coins}
        onAddCoin={async (coinId) => {
          await addCoin(coinId);
          setShowModal(false);
        }}
      />
    </DashboardLayout>
  );
};

export default WatchlistPage;
