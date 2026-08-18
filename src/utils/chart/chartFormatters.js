export const normalizeMarketChart = (data) => {
  const prices = data?.prices ?? [];
  const volumes = data?.total_volumes ?? [];

  return prices
    .map(([timestamp, price], index) => ({
      time: Math.floor(timestamp / 1000),
      close: Number(price),
      volume: Number(volumes[index]?.[1] ?? 0),
    }))
    .filter(
      (item) => Number.isFinite(item.time) && Number.isFinite(item.close),
    );
};

/**
 * Coin-chart backend OHLC format:
 *
 * [
 *   timestamp,
 *   open,
 *   high,
 *   low,
 *   close,
 *   volume
 * ]
 */
export const normalizeOHLC = (data) => {
  // Backend now returns:
  // { ohlc: [...] }

  const ohlc = data?.ohlc ?? data ?? [];

  return ohlc
    .map(([timestamp, open, high, low, close, volume]) => ({
      time: Math.floor(timestamp / 1000),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume ?? 0),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.time) &&
        Number.isFinite(item.open) &&
        Number.isFinite(item.high) &&
        Number.isFinite(item.low) &&
        Number.isFinite(item.close) &&
        Number.isFinite(item.volume),
    );
};

export const buildOHLCFromPrices = (data) => {
  if (!data.length) return [];

  return data.map((item, index) => {
    const previous = data[index - 1]?.close ?? item.close;

    return {
      time: item.time,
      open: previous,
      high: Math.max(previous, item.close),
      low: Math.min(previous, item.close),
      close: item.close,

      // Preserve the REAL volume from market-chart data.
      volume: Number(item.volume ?? 0),
    };
  });
};
