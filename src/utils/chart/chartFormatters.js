export const normalizeMarketChart = (data) => {
  const prices = data?.prices ?? [];
  const volumes = data?.total_volumes ?? [];

  return prices.map(([timestamp, price], index) => ({
    time: Math.floor(timestamp / 1000),
    close: Number(price),
    volume: Number(volumes[index]?.[1] ?? 0),
  }));
};

export const normalizeOHLC = (data) => {
  return (data ?? [])
    .map(([timestamp, open, high, low, close]) => ({
      time: Math.floor(timestamp / 1000),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: 0,
    }))
    .filter(
      (item) =>
        Number.isFinite(item.open) &&
        Number.isFinite(item.high) &&
        Number.isFinite(item.low) &&
        Number.isFinite(item.close),
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
      volume: item.volume,
    };
  });
};
