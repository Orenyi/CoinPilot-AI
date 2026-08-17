import { useCallback, useEffect, useState } from "react";

import { getCoinChart } from "../services/coinChartService";

import {
  normalizeMarketChart,
  normalizeOHLC,
  buildOHLCFromPrices,
} from "../utils/chart/chartFormatters";

const useCoinChart = ({
  coinId,
  currency = "usd",
  days = "1",
  chartType = "candles",
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const isOHLC = chartType === "candles" || chartType === "ohlc";

      const response = await getCoinChart({
        coinId,
        currency,
        days,
        type: isOHLC ? "ohlc" : "market",
      });

      if (isOHLC) {
        setData(normalizeOHLC(response));
      } else {
        setData(normalizeMarketChart(response));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load chart data.");
    } finally {
      setLoading(false);
    }
  }, [coinId, currency, days, chartType]);

  useEffect(() => {
    if (coinId) {
      fetchChart();
    }
  }, [coinId, fetchChart]);

  return {
    data,
    loading,
    error,
    refetch: fetchChart,
  };
};

export default useCoinChart;
