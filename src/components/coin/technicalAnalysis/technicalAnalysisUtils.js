// ==========================================
// TECHNICAL ANALYSIS UTILITIES
// ==========================================

/**
 * Calculate percentage returns.
 */
export const calculateReturns = (prices) => {
  if (!prices || prices.length < 2) {
    return [];
  }

  const returns = [];

  for (let i = 1; i < prices.length; i++) {
    const previous = prices[i - 1];

    const current = prices[i];

    if (!previous || !current) continue;

    returns.push(((current - previous) / previous) * 100);
  }

  return returns;
};

/**
 * Calculate standard deviation.
 */
export const calculateStandardDeviation = (values) => {
  if (!values.length) {
    return 0;
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  const variance =
    values.reduce((sum, value) => {
      return sum + Math.pow(value - mean, 2);
    }, 0) / values.length;

  return Math.sqrt(variance);
};

/**
 * Calculate historical volatility.
 *
 * Uses standard deviation of percentage returns.
 */
export const calculateVolatility = (prices) => {
  const returns = calculateReturns(prices);

  if (!returns.length) {
    return 0;
  }

  return calculateStandardDeviation(returns);
};

/**
 * Convert volatility number into a readable label.
 *
 * These are intentionally simple presentation bands,
 * not trading recommendations.
 */
export const getVolatilityLabel = (volatility) => {
  if (volatility < 2) {
    return "Low";
  }

  if (volatility < 5) {
    return "Moderate";
  }

  if (volatility < 8) {
    return "High";
  }

  return "Very High";
};

/**
 * Determine whether current price is above the moving average.
 */
export const getMovingAverageStatus = (currentPrice, movingAverage) => {
  if (
    currentPrice === null ||
    currentPrice === undefined ||
    movingAverage === null ||
    movingAverage === undefined
  ) {
    return null;
  }

  return currentPrice >= movingAverage ? "Bullish" : "Bearish";
};

/**
 * Generate points for a small sparkline.
 */
export const createSparklinePoints = (
  values,
  width = 110,
  height = 38,
  padding = 3,
) => {
  if (!values?.length) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x =
        padding +
        (index / Math.max(values.length - 1, 1)) * (width - padding * 2);

      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");
};
