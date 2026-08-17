import { supabase } from "./supabase";

/**
 * Fetch detailed information for a single coin.
 *
 * The Edge Function handles:
 * - CoinGecko API request
 * - PostgreSQL caching
 * - Rate-limit fallback
 *
 * This service is responsible for normalizing the
 * CoinGecko response into a frontend-friendly shape.
 */
export const getCoinDetails = async (coinId) => {
  if (!coinId) {
    throw new Error("Coin ID is required.");
  }

  const { data, error } = await supabase.functions.invoke("coin-details", {
    body: {
      id: coinId,
    },
  });

  if (error) {
    console.error("[coinDetailsService] Edge Function error:", error);

    throw new Error(error.message || "Failed to fetch coin details.");
  }

  if (!data?.success || !data?.coin) {
    throw new Error(data?.message || "Failed to load coin details.");
  }

  return normalizeCoinDetails(data.coin);
};

/**
 * Normalize CoinGecko's detailed coin response.
 *
 * CoinGecko returns market data like:
 *
 * coin.market_data.current_price.usd
 *
 * The UI receives:
 *
 * coin.current_price
 */
const normalizeCoinDetails = (coin) => {
  const marketData = coin.market_data ?? {};

  return {
    // -----------------------------------------
    // Basic information
    // -----------------------------------------

    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,

    image: coin.image?.large || coin.image?.small || coin.image?.thumb || "",

    description: coin.description?.en || "",

    market_cap_rank: coin.market_cap_rank ?? null,

    // -----------------------------------------
    // Current price
    // -----------------------------------------

    current_price: marketData.current_price?.usd ?? null,

    // -----------------------------------------
    // 24h price movement
    // -----------------------------------------

    price_change_24h:
      marketData.price_change_24h_in_currency?.usd ??
      marketData.price_change_24h ??
      null,

    price_change_percentage_24h:
      marketData.price_change_percentage_24h_in_currency?.usd ??
      marketData.price_change_percentage_24h ??
      null,

    // -----------------------------------------
    // Market statistics
    // -----------------------------------------

    market_cap: marketData.market_cap?.usd ?? null,

    total_volume: marketData.total_volume?.usd ?? null,

    circulating_supply: marketData.circulating_supply ?? null,

    total_supply: marketData.total_supply ?? null,

    max_supply: marketData.max_supply ?? null,

    // -----------------------------------------
    // Market dominance
    // -----------------------------------------

    market_cap_percentage: marketData.market_cap_percentage ?? {},

    // -----------------------------------------
    // Historical prices
    // Useful later for the chart
    // -----------------------------------------

    ath: marketData.ath?.usd ?? null,

    ath_change_percentage: marketData.ath_change_percentage?.usd ?? null,

    ath_date: marketData.ath_date?.usd ?? null,

    atl: marketData.atl?.usd ?? null,

    atl_change_percentage: marketData.atl_change_percentage?.usd ?? null,

    atl_date: marketData.atl_date?.usd ?? null,

    // -----------------------------------------
    // Metadata
    // -----------------------------------------

    last_updated: coin.last_updated ?? null,

    homepage: coin.links?.homepage?.filter(Boolean) ?? [],

    categories: coin.categories ?? [],

    // Keep the original response available.
    // This prevents us from losing CoinGecko data
    // that we may need later.
    raw: coin,
  };
};
