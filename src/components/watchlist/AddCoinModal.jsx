import React, { useEffect, useState } from "react";
import { FiSearch, FiX, FiPlus } from "react-icons/fi";
import { searchCoins } from "../../services/coinGeckoService";

const AddCoinModal = ({ open, onClose, onAddCoin }) => {
  const [search, setSearch] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        // If search is empty, show popular coins
        const results = await searchCoins(search || "");

        setFilteredCoins(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="
          w-full
          max-w-2xl
          rounded-3xl
          border
          border-[var(--app-border)]
          bg-[var(--app-surface)]
          shadow-2xl
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-[var(--app-border)] p-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--app-text)]">
              Add Coin
            </h2>

            <p className="mt-1 text-sm text-[var(--app-muted)]">
              Search and add cryptocurrencies to your watchlist.
            </p>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setFilteredCoins([]);
              onClose();
            }}
            className="
              rounded-xl
              p-2
              text-[var(--app-muted)]
              transition
              hover:bg-[var(--app-bg)]
            "
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Search */}

        <div className="p-6">
          <div className="relative">
            <FiSearch
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />

            <input
              type="text"
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[var(--app-border)]
                bg-[var(--app-bg)]
                pl-11
                pr-4
                text-[var(--app-text)]
                outline-none
                transition
                focus:border-[var(--color-primary-2)]
              "
            />
          </div>
        </div>

        {/* Coin List */}

        <div
          className="
            max-h-[420px]
            overflow-y-auto
            coinpilot-scrollbar
            px-6
            pb-6
        "
        >
          {loading ? (
            <p className="py-10 text-center text-[var(--app-muted)]">
              Loading coins...
            </p>
          ) : filteredCoins.length === 0 ? (
            <p className="py-10 text-center text-[var(--app-muted)]">
              No coins found.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-[var(--app-border)]
                    p-4
                    transition
                    hover:border-[var(--color-primary-2)]
                  "
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-10 w-10 rounded-full"
                    />

                    <div>
                      <h3 className="font-semibold text-[var(--app-text)]">
                        {coin.name}
                      </h3>

                      <p className="text-xs uppercase text-[var(--app-muted)]">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await onAddCoin?.(coin.id);
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-[#2563eb]
                      via-[#7c3aed]
                      to-[#9333ea]
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                    "
                  >
                    <FiPlus size={16} />
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCoinModal;
