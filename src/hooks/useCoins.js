import { useCallback, useEffect, useRef, useState } from "react";

import { getMarketData } from "../services/coinGeckoService";

const useCoins = () => {
  const [globalMarket, setGlobalMarket] = useState(null);
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchMarketData = useCallback(async (showLoader = true) => {
    const startTime = Date.now();

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
      setTrendingCoins(data.trending ?? []);
    } catch (err) {
      console.error(err);

      setError(err.message || "Failed to load market data.");
    } finally {
      // Keep the spinner visible for at least 500ms
      const elapsed = Date.now() - startTime;

      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }

      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    fetchMarketData(false);
  }, [fetchMarketData]);

  useEffect(() => {
    // Initial fetch
    fetchMarketData(true);

    const startAutoRefresh = () => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
        if (!document.hidden) {
          fetchMarketData(false);
        }
      }, 60000); // 60 seconds
    };

    const stopAutoRefresh = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        fetchMarketData(false);
        startAutoRefresh();
      }
    };

    startAutoRefresh();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopAutoRefresh();

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMarketData]);

  return {
    globalMarket,
    coins,
    trendingCoins,

    loading,
    refreshing,
    error,

    refresh,
  };
};

export default useCoins;
