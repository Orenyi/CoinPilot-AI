import { CURRENCIES } from "../constants/currencies";

export const formatCurrency = (value, currency = "USD", options = {}) => {
  if (value == null) return "--";

  const selectedCurrency =
    CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: selectedCurrency.code,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits:
      options.maximumFractionDigits ?? (value >= 1 ? 2 : 6),
  }).format(value);
};

export const formatLargeCurrency = (value, currency = "USD") => {
  if (value == null) return "--";

  const selectedCurrency =
    CURRENCIES.find((item) => item.code === currency) ?? CURRENCIES[0];

  const symbol = selectedCurrency.symbol;

  if (value >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  }

  return formatCurrency(value, currency);
};
