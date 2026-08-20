import { getCoinChart } from "./coinChartService";

const cache = new Map();

const CACHE_DURATION = 5 * 60 * 1000;

const getCacheKey = (coinId, currency) =>
  `${coinId}:${currency}:technical-analysis`;

export const getTechnicalAnalysisData = async ({
  coinId,
  currency = "usd",
}) => {
  if (!coinId) {
    return [];
  }

  const key = getCacheKey(coinId, currency);

  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await getCoinChart({
    coinId,
    currency,
    days: "90",
    type: "market",
  });

  cache.set(key, {
    data,
    timestamp: Date.now(),
  });

  return data;
};
