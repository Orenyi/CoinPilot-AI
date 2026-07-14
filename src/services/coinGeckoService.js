import { supabase } from "./supabase";

/**
 * Fetch market data via the Supabase Edge Function.
 */

export const getMarketData = async ({
  currency = "usd",
  search = "",
  category = "",
  sort = "market_cap_desc",
  page = 1,
  perPage = 50,
} = {}) => {
  const { data, error } = await supabase.functions.invoke("coin-market-data", {
    body: {
      currency,
      search,
      category,
      sort,
      page,
      perPage,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message || "Failed to fetch market data.");
  }

  return data;
};

/**
 * Global Market
 */

export const getGlobalMarket = async () => {
  const data = await getMarketData();
  return data.global;
};

/**
 * Top Coins
 */

export const getTopCoins = async () => {
  const data = await getMarketData();
  return data.coins;
};

/**
 * Trending Coins
 */

export const getTrendingCoins = async () => {
  const data = await getMarketData();
  return data.trending;
};

export const getCoinsByIds = async (ids = [], currency = "usd") => {
  if (!ids.length) return [];

  const { data, error } = await supabase.functions.invoke("coin-market-data", {
    body: {
      ids,
      currency,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message || "Failed to fetch watchlist coins.");
  }

  return data.coins;
};

export const searchCoins = async (query = "", currency = "usd") => {
  const { data, error } = await supabase.functions.invoke("coin-market-data", {
    body: {
      currency,
      search: query,
      page: 1,
      perPage: 20,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message || "Failed to search coins.");
  }

  return data.coins ?? [];
};
