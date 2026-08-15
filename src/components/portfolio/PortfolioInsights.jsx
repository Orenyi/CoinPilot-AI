import React from "react";

import {
  FiTrendingUp,
  FiTrendingDown,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";

const PortfolioInsights = ({ portfolio }) => {
  const insightCards = [
    {
      title: "Best Performer",
      icon: FiTrendingUp,
      color: "emerald",
      coin: portfolio.best_performer,
      value: portfolio.best_performer?.profit_loss_percentage,
    },
    {
      title: "Worst Performer",
      icon: FiTrendingDown,
      color: "red",
      coin: portfolio.worst_performer,
      value: portfolio.worst_performer?.profit_loss_percentage,
    },
    {
      title: "Top Gainer (24h)",
      icon: FiTrendingUp,
      color: "emerald",
      coin: portfolio.top_gainer_24h,
      value: portfolio.top_gainer_24h?.price_change_percentage_24h,
    },
    {
      title: "Top Loser (24h)",
      icon: FiTrendingDown,
      color: "red",
      coin: portfolio.top_loser_24h,
      value: portfolio.top_loser_24h?.price_change_percentage_24h,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div
        className="
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-6
        shadow-[var(--shadow-card)]
        transition-all
        duration-300
        "
      >
        <h2 className="mb-6 text-lg font-semibold text-[var(--app-text)]">
          Portfolio Insights
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {insightCards.map((item) => {
            const Icon = item.icon;

            const positive = item.color === "emerald";

            return (
              <div
                key={item.title}
                className="
                group
                rounded-2xl
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[var(--color-primary)]/30
                hover:shadow-lg
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--app-muted)]">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[var(--app-text)]">
                      {item.coin?.name ?? "--"}
                    </h3>

                    <p className="text-sm text-[var(--app-muted)]">
                      {item.coin?.symbol?.toUpperCase() ?? ""}
                    </p>

                    <div
                      className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
                        positive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.value?.toFixed(2) ?? "0.00"}%
                    </div>
                  </div>

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      ${
                        positive
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }
                      transition-all
                      duration-300
                      group-hover:scale-110
                    `}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Health */}
      <div
        className="
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-6
        shadow-[var(--shadow-card)]
        "
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
            <FiShield className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Portfolio Health
            </h2>

            <p className="text-sm text-[var(--app-muted)]">
              Diversification & concentration analysis
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[var(--app-muted)]">
                Diversification Score
              </span>

              <span className="font-semibold text-[var(--app-text)]">
                {portfolio.diversification_score}/100
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                style={{
                  width: `${portfolio.diversification_score}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[var(--app-muted)]">
                Portfolio Concentration
              </span>

              <span className="font-semibold text-[var(--app-text)]">
                {portfolio.concentration_percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[var(--app-card-2)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                style={{
                  width: `${portfolio.concentration_percentage}%`,
                }}
              />
            </div>
          </div>

          <div
            className="
rounded-2xl
border
border-[var(--app-border)]
bg-[var(--app-card-2)]
p-5
transition-all
duration-300
hover:border-[var(--color-primary)]/20
"
          >
            <div className="flex items-center gap-3">
              <FiBarChart2 className="h-6 w-6 text-blue-500" />

              <div>
                <p className="font-semibold text-[var(--app-text)]">
                  Largest Holding
                </p>

                <p className="text-sm text-[var(--app-muted)]">
                  {portfolio.largest_holding?.name ?? "--"} •{" "}
                  {portfolio.concentration_percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div
            className="
            rounded-2xl
            border
            border-emerald-500/20
            bg-gradient-to-r
            from-emerald-500/10
            to-emerald-400/5
            p-5
            "
          >
            <p className="text-sm font-medium text-emerald-500">
              {portfolio.diversification_score >= 80
                ? "Excellent diversification. Your portfolio is well balanced."
                : portfolio.diversification_score >= 60
                  ? "Good diversification. Consider reducing concentration in your largest holding."
                  : "Your portfolio is highly concentrated. Consider diversifying across more assets."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInsights;
