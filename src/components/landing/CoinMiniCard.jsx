import React from "react";

const CoinMiniCard = ({ coin, variant = "card" }) => {
  const prices = coin?.sparkline_in_7d?.price?.slice(-20) || [];
  const change = coin.price_change_percentage_24h || 0;
  const isPositive = change >= 0;

  const max = Math.max(...prices);
  const min = Math.min(...prices);

  const points = prices
    .map((price, index) => {
      const x = (index / (prices.length - 1 || 1)) * 100;
      const y = 45 - ((price - min) / (max - min || 1)) * 35;
      return `${x},${y}`;
    })
    .join(" ");

  const price =
    coin.current_price < 1
      ? `$${coin.current_price.toFixed(2)}`
      : coin.current_price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        });

  // =========================
  // MOBILE CARD
  // =========================

  if (variant === "list") {
    return (
      <article className="group rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 transition-all duration-300 hover:border-[var(--color-primary-2)]">
        <div className="grid grid-cols-[1fr_90px_auto] items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="h-10 w-10 rounded-full"
            />

            <div>
              <h3 className="font-semibold text-[var(--app-text)]">
                {coin.name}
              </h3>

              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-muted)]">
                {coin.symbol}
              </p>
            </div>
          </div>

          <svg viewBox="0 0 100 45" className="h-10 w-full">
            <polyline
              fill="none"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>

          <div className="text-right">
            <p className="text-sm font-bold text-[var(--app-text)]">{price}</p>

            <p
              className={`text-xs font-semibold ${
                isPositive
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </p>
          </div>
        </div>
      </article>
    );
  }

  // =========================
  // DESKTOP CARD
  // =========================

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-5
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-[var(--color-primary-2)]
        hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]
      "
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[var(--color-primary-2)]/5 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Coin Info */}
        <div className="mb-6 flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="h-11 w-11 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-[var(--app-text)]">
              {coin.name}
            </h3>

            <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-muted)]">
              {coin.symbol}
            </p>
          </div>
        </div>

        {/* Price + Chart */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="[font-family:var(--font-heading)] text-2xl font-bold text-[var(--app-text)]">
              {price}
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                isPositive
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </p>
          </div>

          <svg viewBox="0 0 100 45" className="h-14 w-28 shrink-0">
            <polyline
              fill="none"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default CoinMiniCard;
