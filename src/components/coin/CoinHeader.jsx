import React from "react";
import { FiArrowLeft, FiShare2, FiStar } from "react-icons/fi";

const CoinHeader = ({
  coin,
  currency = "usd",
  isWatchlisted = false,
  onBack,
  onToggleWatchlist,
  onShare,
}) => {
  if (!coin) return null;

  const currencyCode = currency.toUpperCase();

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    CAD: "CA$",
    AUD: "A$",
    JPY: "¥",
    INR: "₹",
    CNY: "¥",
  };

  const currencySymbol = currencySymbols[currencyCode] || currencyCode;

  const price = coin.current_price;
  const priceChange = coin.price_change_24h;
  const priceChangePercentage = coin.price_change_percentage_24h;

  const isPositive = Number(priceChangePercentage ?? 0) >= 0;

  const formatPrice = (value) => {
    if (value === null || value === undefined) return "--";

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const formatCompactNumber = (value) => {
    if (value === null || value === undefined) return "--";

    const number = Number(value);

    if (number >= 1_000_000_000_000) {
      return `${(number / 1_000_000_000_000).toFixed(2)}T`;
    }

    if (number >= 1_000_000_000) {
      return `${(number / 1_000_000_000).toFixed(2)}B`;
    }

    if (number >= 1_000_000) {
      return `${(number / 1_000_000).toFixed(2)}M`;
    }

    if (number >= 1_000) {
      return `${(number / 1_000).toFixed(2)}K`;
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(number);
  };

  const dominance =
    coin.market_cap_percentage?.[currencyCode.toLowerCase()] ??
    coin.market_cap_percentage?.usd ??
    coin.market_dominance ??
    null;

  const stats = [
    {
      label: "Market Cap",
      value:
        coin.market_cap !== null && coin.market_cap !== undefined
          ? `$${formatCompactNumber(coin.market_cap)}`
          : "--",
    },
    {
      label: "24h Volume",
      value:
        coin.total_volume !== null && coin.total_volume !== undefined
          ? `$${formatCompactNumber(coin.total_volume)}`
          : "--",
    },
    {
      label: "Circulating Supply",
      value:
        coin.circulating_supply !== null &&
        coin.circulating_supply !== undefined
          ? `${formatCompactNumber(coin.circulating_supply)} ${
              coin.symbol?.toUpperCase() || ""
            }`
          : "--",
    },
    {
      label: "Dominance",
      value:
        dominance !== null && dominance !== undefined
          ? `${Number(dominance).toFixed(2)}%`
          : "--",
    },
  ];

  return (
    <section className="w-full">
      {/* =====================================================
          DESKTOP
          Sidebar space is intentionally preserved.
      ====================================================== */}

      <div className="hidden lg:block">
        <div className="">
          {/* Back */}
          <div className="pt-6">
            <button
              type="button"
              onClick={onBack}
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-medium
                text-[var(--app-text)]
                transition-colors
                duration-200
                hover:text-[var(--color-primary-2)]
              "
            >
              <FiArrowLeft size={14} />
              <span>Back to Markets</span>
            </button>
          </div>

          {/* Main Header */}
          <div
            className="
              mt-5
              flex
              items-start
              justify-between
              gap-8
            "
          >
            {/* Coin Information */}
            <div className="flex min-w-0 items-start gap-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="
                  h-[60px]
                  w-[60px]
                  shrink-0
                  rounded-full
                  object-cover
                "
              />

              <div className="min-w-0">
                <h1
                  className="
                    text-[28px]
                    font-bold
                    leading-none
                    tracking-tight
                    text-[var(--app-text)]
                  "
                  style={{
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {coin.name}
                </h1>

                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-[var(--app-muted)]
                  "
                >
                  {coin.symbol?.toUpperCase()} · Rank #
                  {coin.market_cap_rank ?? "--"}
                </p>

                {/* Price */}
                <div className="mt-3">
                  <p
                    className="
                      text-[32px]
                      font-medium
                      leading-none
                      tracking-tight
                      text-[var(--app-text)]
                    "
                    style={{
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {currencySymbol}
                    {formatPrice(price)}
                  </p>

                  <div
                    className={`
                      mt-2
                      flex
                      items-center
                      gap-3
                      text-sm
                      font-medium
                      ${
                        isPositive
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-danger)]"
                      }
                    `}
                  >
                    <span>
                      {isPositive ? "+" : "-"}
                      {currencySymbol}
                      {formatPrice(Math.abs(Number(priceChange ?? 0)))}
                    </span>

                    <span>
                      {isPositive ? "+" : ""}
                      {Number(priceChangePercentage ?? 0).toFixed(2)}%
                    </span>

                    <span className="text-[var(--app-text)]">(24h)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end gap-6">
              {/* Watchlist */}
              <button
                type="button"
                onClick={onToggleWatchlist}
                className="
                  flex
                  h-9
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[var(--app-border)]
                  bg-[var(--app-card)]
                  px-4
                  text-xs
                  font-semibold
                  text-[var(--app-text)]
                  transition-all
                  duration-200
                  hover:border-[var(--color-primary-2)]
                  hover:bg-[var(--app-card-2)]
                "
              >
                <FiStar
                  size={14}
                  className={
                    isWatchlisted
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-yellow-500"
                  }
                />

                {isWatchlisted ? "Added to Watchlist" : "Add to Watchlist"}
              </button>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="
                      h-[58px]
                      w-[126px]
                      rounded-xl
                      border
                      border-[var(--app-border)]
                      bg-[var(--app-card)]
                      px-3
                      py-2.5
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-medium
                        text-[var(--app-muted)]
                      "
                    >
                      {stat.label}
                    </p>

                    <p
                      className="
                        mt-1
                        whitespace-nowrap
                        text-xs
                        font-semibold
                        text-[var(--app-text)]
                      "
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE
      ====================================================== */}

      <div className="lg:hidden">
        <div className="px-4 pb-1 pt-4 sm:px-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[var(--app-text)]
              "
            >
              <FiArrowLeft size={17} />
              <span>Back</span>
            </button>
          </div>

          {/* Coin */}
          <div className="mt-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="
                  h-10
                  w-10
                  shrink-0
                  rounded-full
                  object-cover
                "
              />

              <div>
                <h1
                  className="
                    text-[20px]
                    font-bold
                    leading-tight
                    text-[var(--app-text)]
                  "
                  style={{
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {coin.name}
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    font-medium
                    text-[var(--app-muted)]
                  "
                >
                  {coin.symbol?.toUpperCase()} · Rank #
                  {coin.market_cap_rank ?? "--"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleWatchlist}
              aria-label="Toggle watchlist"
              className="mt-1 text-yellow-500"
            >
              <FiStar
                size={21}
                className={
                  isWatchlisted ? "fill-yellow-400 text-yellow-400" : ""
                }
              />
            </button>
          </div>

          {/* Price */}
          <div className="mt-4">
            <p
              className="
                text-[28px]
                font-medium
                leading-none
                tracking-tight
                text-[var(--app-text)]
              "
              style={{
                fontFamily: "var(--font-heading)",
              }}
            >
              {currencySymbol}
              {formatPrice(price)}
            </p>

            <div
              className={`
                mt-2
                flex
                items-center
                gap-3
                text-xs
                font-medium
                ${
                  isPositive
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-danger)]"
                }
              `}
            >
              <span>
                {isPositive ? "+" : "-"}
                {currencySymbol}
                {formatPrice(Math.abs(Number(priceChange ?? 0)))}
              </span>

              <span>
                {isPositive ? "+" : ""}
                {Number(priceChangePercentage ?? 0).toFixed(2)}%
              </span>

              <span className="text-[var(--app-text)]">(24h)</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  min-h-[57px]
                  rounded-xl
                  border
                  border-[var(--app-border)]
                  bg-[var(--app-card)]
                  px-3
                  py-2.5
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    text-[var(--app-muted)]
                  "
                >
                  {stat.label}
                </p>

                <p
                  className="
                    mt-1
                    whitespace-nowrap
                    text-xs
                    font-semibold
                    text-[var(--app-text)]
                  "
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoinHeader;
