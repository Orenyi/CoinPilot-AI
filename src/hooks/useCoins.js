import { useCallback, useEffect, useRef, useState } from "react";
import useCurrency from "./useCurrency";

import { getMarketData } from "../services/coinGeckoService";
import useDebounce from "./useDebounce";

const useCoins = () => {
  const [globalMarket, setGlobalMarket] = useState(null);
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // ---------------- Markets State ----------------

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const [filter, setFilter] = useState("all");

  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("market_cap_desc");

  const [page, setPage] = useState(1);

  const [perPage] = useState(50);
  const [initialized, setInitialized] = useState(false);

  const { currency } = useCurrency();

  const fetchMarketData = useCallback(
    async (showLoader = true) => {
      const startTime = Date.now();

      try {
        if (showLoader && !initialized) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError(null);

        const data = await getMarketData({
          currency: currency.toLowerCase(),
          search: debouncedSearch,
          category,
          sort,
          page,
          perPage,
        });

        setGlobalMarket(data.global);
        setCoins(data.coins);
        setTrendingCoins(data.trending ?? []);
        setCategories(data.categories ?? []);
        setPagination(data.pagination);
        setInitialized(true);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load market data.");
      } finally {
        const elapsed = Date.now() - startTime;

        if (elapsed < 500) {
          await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
        }

        if (showLoader && !initialized) {
          setLoading(false);
        }

        setRefreshing(false);
      }
    },
    [currency, debouncedSearch, category, sort, page, perPage],
  );

  const refresh = useCallback(() => {
    fetchMarketData(false);
  }, [fetchMarketData]);

  useEffect(() => {
    fetchMarketData(true);
  }, [fetchMarketData]);

  useEffect(() => {
    const startAutoRefresh = () => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
        if (!document.hidden) {
          fetchMarketData(false);
        }
      }, 60000);
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

    refresh: () => fetchMarketData(false),

    search,
    setSearch,

    filter,
    setFilter,

    category,
    setCategory,

    sort,
    setSort,

    page,
    setPage,

    perPage,

    categories,
    setCategories,
    pagination,
  };
};

export default useCoins;
