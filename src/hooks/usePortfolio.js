import { useCallback, useEffect, useState } from "react";

import {
  addPortfolioAsset,
  deletePortfolioAsset,
  getPortfolio,
  updatePortfolioAsset,
} from "../services/portfolioService";

import { useCurrency } from "../context/CurrencyContext";

export const usePortfolio = () => {
  const { currency } = useCurrency();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPortfolio(currency);

      setPortfolio(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  const addAsset = async (asset) => {
    await addPortfolioAsset(asset);
    await refreshPortfolio();
  };

  const updateAsset = async (asset) => {
    await updatePortfolioAsset(asset);
    await refreshPortfolio();
  };

  const deleteAsset = async (assetId) => {
    await deletePortfolioAsset(assetId);
    await refreshPortfolio();
  };

  return {
    portfolio,
    loading,
    error,
    refreshPortfolio,
    addAsset,
    updateAsset,
    deleteAsset,
  };
};
