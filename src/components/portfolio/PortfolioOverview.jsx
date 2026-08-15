import React from "react";

import {
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiPieChart,
  FiAward,
  FiAlertTriangle,
} from "react-icons/fi";

import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/formatCurrency";

const PortfolioOverview = ({ portfolio }) => {
  const { currency } = useCurrency();

  const cards = [
    {
      title: "Portfolio Value",
      value: formatCurrency(portfolio.portfolio_value, currency),
      subtitle: `${portfolio.total_profit_loss_percentage.toFixed(2)}% All Time`,
      icon: FiCreditCard,
      positive: portfolio.total_profit_loss >= 0,
    },
    {
      title: "Total Profit / Loss",
      value: `${portfolio.total_profit_loss >= 0 ? "+" : ""}${formatCurrency(
        portfolio.total_profit_loss,
        currency,
      )}`,
      subtitle: `${portfolio.total_profit_loss_percentage.toFixed(2)}% Return`,
      icon: portfolio.total_profit_loss >= 0 ? FiTrendingUp : FiTrendingDown,
      positive: portfolio.total_profit_loss >= 0,
    },
    {
      title: "Today's P / L",
      value: `${portfolio.top_gainer_24h?.price_change_percentage_24h?.toFixed(2) ?? 0}%`,
      subtitle: portfolio.top_gainer_24h?.name ?? "No data",
      icon: FiTrendingUp,
      positive: true,
    },
    {
      title: "Largest Holding",
      value: portfolio.largest_holding?.symbol?.toUpperCase() ?? "--",
      subtitle: `${portfolio.concentration_percentage.toFixed(2)}% Allocation`,
      icon: FiPieChart,
      positive: true,
    },
    {
      title: "Best Performer",
      value: portfolio.best_performer?.symbol?.toUpperCase() ?? "--",
      subtitle: `+${portfolio.best_performer?.profit_loss_percentage?.toFixed(2) ?? 0}%`,
      icon: FiAward,
      positive: true,
    },
    {
      title: "Worst Performer",
      value: portfolio.worst_performer?.symbol?.toUpperCase() ?? "--",
      subtitle: `${portfolio.worst_performer?.profit_loss_percentage?.toFixed(2) ?? 0}%`,
      icon: FiAlertTriangle,
      positive: false,
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              rounded-3xl
              border
              border-[var(--app-border)]
              bg-[var(--app-card)]
              p-6
              shadow-[var(--shadow-card)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[var(--color-primary)]/40
              hover:shadow-2xl
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--app-muted)]">{card.title}</p>

                <h3 className="mt-3 text-3xl font-bold text-[var(--app-text)]">
                  {card.value}
                </h3>

                <div
                  className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                    card.positive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {card.positive ? (
                    <FiTrendingUp className="h-4 w-4" />
                  ) : (
                    <FiTrendingDown className="h-4 w-4" />
                  )}

                  <span>{card.subtitle}</span>
                </div>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#2563eb]
                  via-[#7c3aed]
                  to-[#9333ea]
                  shadow-lg
                  shadow-violet-500/20
                  text-white
                "
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default PortfolioOverview;
