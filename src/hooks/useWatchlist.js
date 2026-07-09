import { useCallback, useEffect, useState } from "react";

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getWatchlist();

      setWatchlist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCoin = async (coinId) => {
    await addToWatchlist(coinId);

    await loadWatchlist();
  };

  const removeCoin = async (coinId) => {
    await removeFromWatchlist(coinId);

    await loadWatchlist();
  };

  const isInWatchlist = (coinId) => {
    return watchlist.some((coin) => coin.coin_id === coinId);
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
