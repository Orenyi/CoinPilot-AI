import React from "react";
import {
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import MarketStatCard from "../components/dashboard/cards/MarketStatCard";
import TrendingCoinsCard from "../components/dashboard/cards/TrendingCoinsCard";

import CoinTable from "../components/dashboard/table/CoinTable";
import Sparkline from "../components/dashboard/charts/Sparkline";

import useCoins from "../hooks/useCoins";

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

  return `$${value.toLocaleString()}`;
};

const formatPercentage = (value) => {
  if (value == null) return "--";

  return `${value.toFixed(2)}%`;
};

const DashboardPage = () => {
  const { globalMarket, coins, trendingCoins, loading, error } = useCoins();

  // Temporary chart until live chart data is added
  const chartData = [
    { value: 20 },
    { value: 24 },
    { value: 22 },
    { value: 30 },
    { value: 27 },
    { value: 34 },
    { value: 39 },
    { value: 35 },
    { value: 45 },
  ];

  const mappedCoins = coins.map((coin) => ({
    id: coin.id,
    image: coin.image,
    name: coin.name,
    symbol: coin.symbol,

    price: coin.current_price.toLocaleString(),

    change: `${coin.price_change_percentage_24h?.toFixed(2)}%`,

    positive: coin.price_change_percentage_24h >= 0,

    marketCap: formatCurrency(coin.market_cap),

    volume: formatCurrency(coin.total_volume),

    chartData:
      coin.sparkline_in_7d?.price?.map((price) => ({
        value: price,
      })) || chartData,
  }));

  const mappedTrendingCoins = trendingCoins.map((coin) => ({
    id: coin.id,
    image: coin.image,
    name: coin.name,
    symbol: coin.symbol,

    price: coin.current_price.toLocaleString(),

    change: `${coin.price_change_percentage_24h?.toFixed(2)}%`,

    positive: coin.price_change_percentage_24h >= 0,

    chartData:
      coin.sparkline_in_7d?.price?.map((price) => ({
        value: price,
      })) || chartData,
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--app-border)] border-t-[var(--color-primary-2)]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <h2 className="text-xl font-bold text-red-500">
            Failed to load market data
          </h2>

          <p className="mt-2 text-[var(--app-soft)]">{error}</p>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      {/* ================= Market Stats ================= */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MarketStatCard
          icon={<FiDollarSign className="text-orange-500" />}
          title="Total Market Cap"
          value={formatCurrency(globalMarket?.total_market_cap?.usd)}
          change={formatPercentage(
            globalMarket?.market_cap_change_percentage_24h_usd,
          )}
          positive={globalMarket?.market_cap_change_percentage_24h_usd >= 0}
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiActivity className="text-blue-500" />}
          title="24h Volume"
          value={formatCurrency(globalMarket?.total_volume?.usd)}
          change={formatPercentage(
            globalMarket?.market_cap_change_percentage_24h_usd,
          )}
          positive={globalMarket?.market_cap_change_percentage_24h_usd >= 0}
          positive
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiPieChart className="text-purple-500" />}
          title="BTC Dominance"
          value={`${globalMarket?.market_cap_percentage?.btc?.toFixed(2)}%`}
          change={`${globalMarket?.market_cap_percentage?.btc?.toFixed(2)}% of market`}
          positive
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiTrendingUp className="text-amber-500" />}
          title="Trending Coins"
          value={globalMarket?.active_cryptocurrencies?.toLocaleString()}
          change={`${trendingCoins.length} Coins`}
          positive
          chart={<Sparkline data={chartData} positive />}
        />
      </section>

      {/* ================= Coin Table ================= */}

      <section className="mt-6">
        <CoinTable coins={mappedCoins} />
      </section>
      {/* ================= Trending Coins ================= */}

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--app-text)]">
              Trending Coins
            </h2>

            <p className="mt-1 text-sm text-[var(--app-soft)]">
              Live trending cryptocurrencies from CoinGecko
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {mappedTrendingCoins.map((coin) => (
            <TrendingCoinsCard key={coin.id} {...coin} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
