import React from "react";
import {
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

const formatCurrency = (value) => {
  if (!value) return "--";

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  return `$${Number(value).toLocaleString()}`;
};

const MarketsStats = ({ globalMarket, trendingCoins, loading }) => {
  if (loading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
            rounded-2xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            p-5
          "
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-[var(--app-card)]" />

              <div className="h-4 w-10 animate-pulse rounded bg-[var(--app-card)]" />
            </div>

            <div className="mt-5 h-4 w-24 animate-pulse rounded bg-[var(--app-card)]" />

            <div className="mt-3 h-8 w-40 animate-pulse rounded bg-[var(--app-card)]" />
          </div>
        ))}
      </section>
    );
  }

  const stats = [
    {
      title: "Market Cap",
      value: formatCurrency(globalMarket?.total_market_cap?.usd),
      icon: <FiDollarSign size={20} />,
      color: "text-orange-500",
    },
    {
      title: "24h Volume",
      value: formatCurrency(globalMarket?.total_volume?.usd),
      icon: <FiActivity size={20} />,
      color: "text-blue-500",
    },
    {
      title: "BTC Dominance",
      value: `${globalMarket?.market_cap_percentage?.btc?.toFixed(2) ?? "--"}%`,
      icon: <FiPieChart size={20} />,
      color: "text-purple-500",
    },
    {
      title: "Trending",
      value: trendingCoins.length,
      icon: <FiTrendingUp size={20} />,
      color: "text-emerald-500",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
            rounded-2xl
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            p-5
            transition-all
            duration-300
            hover:border-[var(--color-primary-2)]
          "
        >
          <div className="flex items-center justify-between">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-[var(--app-card)]
              "
            >
              <span className={stat.color}>{stat.icon}</span>
            </div>

            <span className="text-xs font-medium text-[var(--app-muted)]">
              Live
            </span>
          </div>

          <h3 className="mt-5 text-sm font-medium text-[var(--app-soft)]">
            {stat.title}
          </h3>

          <p className="mt-2 text-2xl font-bold text-[var(--app-text)]">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
};

export default MarketsStats;
