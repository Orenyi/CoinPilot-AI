export const TIMEFRAMES = [
  { label: "1H", days: "1" },
  { label: "4H", days: "1" },
  { label: "1D", days: "1" },
  { label: "7D", days: "7" },
  { label: "1M", days: "30" },
  { label: "3M", days: "90" },
  { label: "6M", days: "180" },
  { label: "1Y", days: "365" },
  { label: "MAX", days: "max" },
];

export const CHART_TYPES = [
  {
    id: "candles",
    label: "Candles",
  },
  {
    id: "line",
    label: "Line",
  },
  {
    id: "area",
    label: "Area",
  },
  {
    id: "ohlc",
    label: "OHLC",
  },
];

export const INDICATORS = [
  "Moving Average",
  "EMA",
  "SMA",
  "RSI",
  "MACD",
  "Bollinger Bands",
  "Volume",
  "VWAP",
  "Stochastic",
];

export const DRAWING_TOOLS = [
  "Trend Line",
  "Horizontal Line",
  "Vertical Line",
  "Support / Resistance",
  "Fibonacci Retracement",
  "Fibonacci Extension",
  "Price Range",
];
