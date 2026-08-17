import { supabase } from "./supabase";

export const getCoinChart = async ({
  coinId,
  currency = "usd",
  days = "1",
  type = "market",
}) => {
  if (!coinId) {
    throw new Error("Coin ID is required.");
  }

  const { data, error } = await supabase.functions.invoke("coin-chart", {
    body: {
      id: coinId,
      currency,
      days,
      type,
    },
  });

  if (error) {
    console.error("[coinChartService]", error);
    throw new Error(error.message || "Failed to fetch chart data.");
  }

  if (!data?.success) {
    throw new Error(data?.message || "Failed to load chart data.");
  }

  return data.data;
};
