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

  const getCurrencySymbol = (code) => {
    const symbols = {
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

    return symbols[code] || code;
  };

  const currencySymbol = getCurrencySymbol(currencyCode);

  const price = Number(coin.current_price ?? 0);
  const priceChange = Number(coin.price_change_24h ?? 0);
  const priceChangePercentage = Number(coin.price_change_percentage_24h ?? 0);

  const isPositive = priceChangePercentage >= 0;

  const formatPrice = (value) => {
    if (value === null || value === undefined) {
      return "--";
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCompactNumber = (value) => {
    if (value === null || value === undefined) {
      return "--";
    }

    if (value >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(2)}T`;
    }

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }

    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const marketCap = coin.market_cap;
  const volume = coin.total_volume;
  const circulatingSupply = coin.circulating_supply;

  /*
   * CoinGecko's /coins/markets response does not normally
   * contain market dominance.
   *
   * We allow the parent page to provide it when using the
   * detailed coin endpoint.
   */
  const dominance =
    coin.market_cap_percentage?.usd ??
    coin.market_cap_percentage?.[currency.toLowerCase()] ??
    coin.market_dominance ??
    null;

  const stats = [
    {
      label: "Market Cap",
      value:
        marketCap !== undefined && marketCap !== null
          ? `$${formatCompactNumber(marketCap)}`
          : "--",
    },
    {
      label: "24h Volume",
      value:
        volume !== undefined && volume !== null
          ? `$${formatCompactNumber(volume)}`
          : "--",
    },
    {
      label: "Circulating Supply",
      value:
        circulatingSupply !== undefined && circulatingSupply !== null
          ? `${formatCompactNumber(circulatingSupply)} ${
              coin.symbol?.toUpperCase() || ""
            }`
          : "--",
    },
    {
      label: "Dominance",
      value: dominance !== null ? `${Number(dominance).toFixed(2)}%` : "--",
    },
  ];

  return (
    <section className="w-full">
      {/* =========================================
          BACK / MOBILE ACTIONS
      ========================================== */}
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
            transition-colors
            duration-200
            hover:text-[var(--color-primary-2)]
          "
        >
          <FiArrowLeft size={17} />

          <span className="hidden sm:inline">Back to Markets</span>

          <span className="sm:hidden">Back</span>
        </button>

        {/* Mobile */}
        <div className="flex items-center gap-5 sm:hidden">
          <button
            type="button"
            onClick={onToggleWatchlist}
            aria-label="Toggle watchlist"
            className="
              text-[var(--app-text)]
              transition-colors
              duration-200
              hover:text-yellow-500
            "
          >
            <FiStar
              size={20}
              className={isWatchlisted ? "fill-yellow-400 text-yellow-400" : ""}
            />
          </button>

          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className="
              text-[var(--app-text)]
              transition-colors
              duration-200
              hover:text-[var(--color-primary-2)]
            "
          >
            <FiShare2 size={19} />
          </button>
        </div>
      </div>

      {/* =========================================
          DESKTOP HEADER
      ========================================== */}
      <div
        className="
          mt-6
          hidden
          items-start
          justify-between
          gap-8
          lg:flex
        "
      >
        {/* Coin Information */}
        <div className="flex min-w-0 items-start gap-5">
          <img
            src={coin.image}
            alt={coin.name}
            className="
              h-[68px]
              w-[68px]
              shrink-0
              rounded-full
              object-cover
            "
          />

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[var(--app-text)]
                "
                style={{
                  fontFamily: "var(--font-heading)",
                }}
              >
                {coin.name}
              </h1>
            </div>

            <p
              className="
                mt-1
                text-sm
                font-medium
                text-[var(--app-muted)]
              "
            >
              {coin.symbol?.toUpperCase()} · Rank #
              {coin.market_cap_rank ?? "--"}
            </p>

            <div className="mt-3">
              <p
                className="
                  text-[34px]
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
                  {formatPrice(Math.abs(priceChange))}
                </span>

                <span>
                  {isPositive ? "+" : ""}
                  {priceChangePercentage.toFixed(2)}%
                </span>

                <span className="text-[var(--app-text)]">(24h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-5">
          <button
            type="button"
            onClick={onToggleWatchlist}
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-[var(--app-border)]
              bg-[var(--app-card)]
              px-4
              text-sm
              font-medium
              text-[var(--app-text)]
              transition-all
              duration-200
              hover:border-[var(--color-primary-2)]
              hover:bg-[var(--app-card-2)]
            "
          >
            <FiStar
              size={16}
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
                  min-w-[125px]
                  rounded-xl
                  border
                  border-[var(--app-border)]
                  bg-[var(--app-card)]
                  px-3
                  py-3
                "
              >
                <p
                  className="
                    text-[11px]
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
                    text-sm
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

      {/* =========================================
          MOBILE HEADER
      ========================================== */}
      <div className="mt-5 sm:mt-6 lg:hidden">
        {/* Coin Name */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="
                h-12
                w-12
                shrink-0
                rounded-full
                object-cover
              "
            />

            <div>
              <h1
                className="
                  text-2xl
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
                  text-xs
                  font-medium
                  text-[var(--app-muted)]
                "
              >
                {coin.symbol?.toUpperCase()} · Rank #
                {coin.market_cap_rank ?? "--"}
              </p>
            </div>
          </div>

          {/* Mobile Watchlist */}
          <button
            type="button"
            onClick={onToggleWatchlist}
            aria-label="Toggle watchlist"
            className="
              mt-1
              text-yellow-500
              transition-colors
              duration-200
            "
          >
            <FiStar
              size={22}
              className={isWatchlisted ? "fill-yellow-400 text-yellow-400" : ""}
            />
          </button>
        </div>

        {/* Price */}
        <div className="mt-4">
          <p
            className="
              text-[30px]
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
              {formatPrice(Math.abs(priceChange))}
            </span>

            <span>
              {isPositive ? "+" : ""}
              {priceChangePercentage.toFixed(2)}%
            </span>

            <span className="text-[var(--app-text)]">(24h)</span>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                rounded-xl
                border
                border-[var(--app-border)]
                bg-[var(--app-card)]
                px-3
                py-3
              "
            >
              <p
                className="
                  text-[11px]
                  font-medium
                  text-[var(--app-muted)]
                "
              >
                {stat.label}
              </p>

              <p
                className="
                  mt-1
                  text-sm
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
    </section>
  );
};

export default CoinHeader;
