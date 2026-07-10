import React, { useState } from "react";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import WatchlistTable from "../components/watchlist/WatchlistTable";
import TrendingWatchlist from "../components/watchlist/TrendingWatchlist";
import EmptyWatchlist from "../components/watchlist/EmptyWatchlist";
import AddCoinModal from "../components/watchlist/AddCoinModal";

import useWatchlist from "../hooks/useWatchlist";

const WatchlistPage = () => {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <DashboardLayout
      title="Your Watchlist"
      subtitle="Track coins you care about most."
    >
      <section className="mt-8 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
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
            transition
            hover:opacity-90
          "
        >
          + Add Coin
        </button>
      </section>

      <section className="mt-8">
        {watchlist.length === 0 ? (
          <EmptyWatchlist />
        ) : (
          <>
            <WatchlistTable
              coins={watchlist}
              loading={loading}
              onRemove={removeFromWatchlist}
            />

            <div className="mt-8">
              <TrendingWatchlist coins={watchlist.slice(0, 5)} />
            </div>
          </>
        )}
      </section>

      <AddCoinModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </DashboardLayout>
  );
};

export default WatchlistPage;
