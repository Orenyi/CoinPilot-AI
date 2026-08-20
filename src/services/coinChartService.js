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

export const getTechnicalAnalysis = async ({ coinId, currency = "usd" }) => {
  if (!coinId) {
    throw new Error("Coin ID is required.");
  }

  const { data, error } = await supabase.functions.invoke("coin-chart", {
    body: {
      id: coinId,
      currency,
      days: "365",
      type: "technical-analysis",
    },
  });

  if (error) {
    console.error("[coinChartService] Technical Analysis:", error);

    throw new Error(
      error.message || "Failed to fetch technical analysis data.",
    );
  }

  if (!data?.success) {
    throw new Error(data?.message || "Failed to load technical analysis data.");
  }

  return data.data;
};
