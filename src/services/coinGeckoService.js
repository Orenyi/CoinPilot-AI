import { supabase } from "./supabase";

/**
 * Fetch all dashboard market data
 * via the Supabase Edge Function.
 */

export const getMarketData = async () => {
  const { data, error } = await supabase.functions.invoke("coin-market-data");

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
