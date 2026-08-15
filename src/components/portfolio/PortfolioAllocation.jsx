import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#9333ea",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#64748b",
];

const PortfolioAllocation = ({ portfolio }) => {
  const { currency } = useCurrency();

  const chartData =
    portfolio?.assets?.map((asset) => ({
      name: asset.symbol?.toUpperCase(),
      value: asset.current_value,
      allocation: asset.allocation_percentage,
    })) ?? [];

  return (
    <section
      className="
        rounded-3xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-6
        shadow-[var(--shadow-card)]
      "
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--app-text)]">
          Portfolio Allocation
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
          Distribution of your portfolio by current market value.
        </p>
      </div>

      {/* Chart */}

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(value, currency)}
              contentStyle={{
                background: "var(--app-card)",
                border: "1px solid var(--app-border)",
                borderRadius: "16px",
                color: "var(--app-text)",
                boxShadow: "var(--shadow-card)",
              }}
              labelStyle={{
                color: "var(--app-text)",
              }}
              itemStyle={{
                color: "var(--app-text)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation List */}

      <div className="mt-8 space-y-3">
        {chartData.map((asset, index) => (
          <div
            key={asset.name}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-bg)]
              px-4
              py-3
              transition-all
              duration-300
              hover:border-[var(--color-primary-2)]/30
              hover:shadow-lg
            "
          >
            <div className="flex items-center gap-4">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />

              <div>
                <h4 className="font-semibold text-[var(--app-text)]">
                  {asset.name}
                </h4>

                <p className="text-sm text-[var(--app-muted)]">
                  {asset.allocation.toFixed(2)}%
                </p>
              </div>
            </div>

            <span className="font-semibold text-[var(--app-text)]">
              {formatCurrency(asset.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioAllocation;
