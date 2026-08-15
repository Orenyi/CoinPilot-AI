import { supabase } from "./supabase";

/**
 * Get user's portfolio
 */
export const getPortfolio = async (currency = "usd") => {
  const { data, error } = await supabase.functions.invoke("portfolio", {
    body: {
      action: "list",
      currency,
    },
  });

  if (error) throw error;

  return data.portfolio;
};

/**
 * Add portfolio asset
 */
export const addPortfolioAsset = async ({
  coinId,
  quantity,
  buyPrice,
  buyDate,
  buyCurrency,
}) => {
  const { data, error } = await supabase.functions.invoke("portfolio", {
    body: {
      action: "add",
      coinId,
      quantity,
      buyPrice,
      buyDate,
      buyCurrency,
    },
  });

  if (error) throw error;

  return data.asset;
};

/**
 * Update portfolio asset
 */
export const updatePortfolioAsset = async ({
  assetId,
  coinId,
  quantity,
  buyPrice,
  buyDate,
  buyCurrency,
}) => {
  const { data, error } = await supabase.functions.invoke("portfolio", {
    body: {
      action: "update",
      assetId,
      coinId,
      quantity,
      buyPrice,
      buyDate,
      buyCurrency,
    },
  });

  if (error) throw error;

  return data.asset;
};

/**
 * Delete portfolio asset
 */
export const deletePortfolioAsset = async (assetId) => {
  const { data, error } = await supabase.functions.invoke("portfolio", {
    body: {
      action: "delete",
      assetId,
    },
  });

  if (error) throw error;

  return data.asset;
};
