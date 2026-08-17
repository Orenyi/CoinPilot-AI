export const calculateSMA = (data, period = 20) => {
  if (data.length < period) return [];

  const result = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);

    const average = slice.reduce((sum, item) => sum + item.close, 0) / period;

    result.push({
      time: data[i].time,
      value: average,
    });
  }

  return result;
};

export const calculateEMA = (data, period = 20) => {
  if (data.length < period) return [];

  const multiplier = 2 / (period + 1);

  const firstSlice = data.slice(0, period);

  let previous = firstSlice.reduce((sum, item) => sum + item.close, 0) / period;

  const result = [
    {
      time: data[period - 1].time,
      value: previous,
    },
  ];

  for (let i = period; i < data.length; i++) {
    const current = (data[i].close - previous) * multiplier + previous;

    previous = current;

    result.push({
      time: data[i].time,
      value: current,
    });
  }

  return result;
};

export const calculateRSI = (data, period = 14) => {
  if (data.length <= period) return [];

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;

    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  const result = [];

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;

    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    averageGain = (averageGain * (period - 1) + gain) / period;

    averageLoss = (averageLoss * (period - 1) + loss) / period;

    const rs = averageLoss === 0 ? 100 : averageGain / averageLoss;

    const rsi = averageLoss === 0 ? 100 : 100 - 100 / (1 + rs);

    result.push({
      time: data[i].time,
      value: rsi,
    });
  }

  return result;
};

export const calculateBollingerBands = (data, period = 20, multiplier = 2) => {
  if (data.length < period) return [];

  return data.slice(period - 1).map((_, index) => {
    const end = period - 1 + index;

    const slice = data.slice(end - period + 1, end + 1);

    const mean = slice.reduce((sum, item) => sum + item.close, 0) / period;

    const variance =
      slice.reduce((sum, item) => sum + Math.pow(item.close - mean, 2), 0) /
      period;

    const standardDeviation = Math.sqrt(variance);

    return {
      time: data[end].time,
      middle: mean,
      upper: mean + multiplier * standardDeviation,
      lower: mean - multiplier * standardDeviation,
    };
  });
};

export const calculateVWAP = (data) => {
  let cumulativeVolume = 0;
  let cumulativeValue = 0;

  return data.map((item) => {
    const typicalPrice = (item.high + item.low + item.close) / 3;

    cumulativeValue += typicalPrice * item.volume;

    cumulativeVolume += item.volume;

    return {
      time: item.time,
      value:
        cumulativeVolume === 0
          ? typicalPrice
          : cumulativeValue / cumulativeVolume,
    };
  });
};
