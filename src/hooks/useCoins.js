import { useCallback, useEffect, useState } from "react";

import { getMarketData } from "../services/coinGeckoService";

const useCoins = () => {
  const [globalMarket, setGlobalMarket] = useState(null);
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchMarketData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      const data = await getMarketData();

      setGlobalMarket(data.global);
      setCoins(data.coins);

      // Edge Function currently returns the raw trending response
      setTrendingCoins(data.trending ?? []);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to load market data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return {
    globalMarket,
    coins,
    trendingCoins,

    loading,
    refreshing,
    error,

    refresh: () => fetchMarketData(false),
  };
};

export default useCoins;
