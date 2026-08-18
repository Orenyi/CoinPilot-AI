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

export const calculateMACD = (
  data,
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
) => {
  if (data.length < slowPeriod + signalPeriod) return [];

  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  const fastMap = new Map(fastEMA.map((item) => [item.time, item.value]));
  const slowMap = new Map(slowEMA.map((item) => [item.time, item.value]));

  const macd = [];

  for (const item of data) {
    const fast = fastMap.get(item.time);
    const slow = slowMap.get(item.time);

    if (fast === undefined || slow === undefined) continue;

    macd.push({
      time: item.time,
      value: fast - slow,
    });
  }

  if (macd.length < signalPeriod) return [];

  const signalValues = [];

  const multiplier = 2 / (signalPeriod + 1);

  let previous =
    macd.slice(0, signalPeriod).reduce((sum, item) => sum + item.value, 0) /
    signalPeriod;

  signalValues.push({
    time: macd[signalPeriod - 1].time,
    value: previous,
  });

  for (let i = signalPeriod; i < macd.length; i++) {
    previous = (macd[i].value - previous) * multiplier + previous;

    signalValues.push({
      time: macd[i].time,
      value: previous,
    });
  }

  const signalMap = new Map(
    signalValues.map((item) => [item.time, item.value]),
  );

  return macd
    .filter((item) => signalMap.has(item.time))
    .map((item) => ({
      time: item.time,
      macd: item.value,
      signal: signalMap.get(item.time),
      histogram: item.value - signalMap.get(item.time),
    }));
};

export const calculateStochastic = (data, period = 14) => {
  if (data.length < period) return [];

  return data.slice(period - 1).map((_, index) => {
    const end = period - 1 + index;

    const slice = data.slice(end - period + 1, end + 1);

    const highestHigh = Math.max(...slice.map((item) => item.high));

    const lowestLow = Math.min(...slice.map((item) => item.low));

    const range = highestHigh - lowestLow;

    const k = range === 0 ? 50 : ((data[end].close - lowestLow) / range) * 100;

    return {
      time: data[end].time,
      value: k,
    };
  });
};
