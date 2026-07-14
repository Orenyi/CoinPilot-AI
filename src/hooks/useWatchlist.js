import { useCallback, useEffect, useState } from "react";
import useCurrency from "./useCurrency";

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";

import { getCoinsByIds } from "../services/coinGeckoService";

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);

      // Get saved watchlist from Supabase
      const savedCoins = await getWatchlist();

      // Extract coin IDs
      const ids = savedCoins.map((coin) => coin.coin_id);

      if (!ids.length) {
        setWatchlist([]);
        return;
      }

      // Fetch live market data from CoinGecko
      const marketCoins = await getCoinsByIds(ids, currency.toLowerCase());

      // Preserve watchlist record id if needed later
      const merged = marketCoins.map((coin) => {
        const saved = savedCoins.find((item) => item.coin_id === coin.id);

        return {
          ...coin,
          watchlist_id: saved?.id,
        };
      });

      setWatchlist(merged);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  const addCoin = async (coinId) => {
    await addToWatchlist(coinId);

    await loadWatchlist();
  };

  const removeCoin = async (coinId) => {
    await removeFromWatchlist(coinId);

    await loadWatchlist();
  };

  const isInWatchlist = (coinId) => {
    return watchlist.some((coin) => coin.id === coinId);
  };

  const toggleWatchlist = async (coinId) => {
    if (isInWatchlist(coinId)) {
      await removeCoin(coinId);
    } else {
      await addCoin(coinId);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  return {
    watchlist,
    loading,
    addCoin,
    removeCoin,
    toggleWatchlist,
    isInWatchlist,
    refresh: loadWatchlist,
  };
};

export default useWatchlist;
