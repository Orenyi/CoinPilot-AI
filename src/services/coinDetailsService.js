import { supabase } from "./supabase";

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
    console.error("Coin details error:", error);
    throw new Error(error.message || "Failed to fetch coin details.");
  }

  if (!data?.coin) {
    throw new Error("Coin details were not returned.");
  }

  return data.coin;
};
