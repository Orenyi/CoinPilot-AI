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

// ---------- loading imports ----------------------
import LoadingCard from "../components/dashboard/common/LoadingCard";
import LoadingTable from "../components/dashboard/common/LoadingTable";
import LoadingTrending from "../components/dashboard/common/LoadingTrending";

import ErrorState from "../components/dashboard/common/ErrorState";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import useCurrency from "../hooks/useCurrency";
import { formatLargeCurrency } from "../utils/formatCurrency";

const formatPercentage = (value) => {
  if (value == null) return "--";

  return `${value.toFixed(2)}%`;
};

const DashboardPage = () => {
  const {
    globalMarket,
    coins,
    trendingCoins,
    loading,
    error,
    refreshing,
    refresh,
  } = useCoins();

  const { currency } = useCurrency();

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

    price: coin.current_price,

    change: `${coin.price_change_percentage_24h?.toFixed(2)}%`,

    positive: coin.price_change_percentage_24h >= 0,

    marketCap: coin.market_cap,

    volume: coin.total_volume,

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

    price: coin.current_price,

    change: `${coin.price_change_percentage_24h?.toFixed(2)}%`,

    positive: coin.price_change_percentage_24h >= 0,

    chartData:
      coin.sparkline_in_7d?.price?.map((price) => ({
        value: price,
      })) || chartData,
  }));

  if (loading) {
    return (
      <DashboardLayout
        title="Dashboard"
        subtitle="Track live cryptocurrency prices and market movements."
        onRefresh={refresh}
        refreshing={refreshing}
      >
        {/* Market Stats */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </section>

        {/* Coin Table */}

        <section className="mt-6">
          <LoadingTable />
        </section>

        {/* Trending Coins */}

        <section className="mt-8">
          <div className="mb-5">
            <div className="h-7 w-48 animate-pulse rounded bg-[var(--app-bg)]" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[var(--app-bg)]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <LoadingTrending key={index} />
            ))}
          </div>
        </section>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        title="Dashboard"
        subtitle="Track live cryptocurrency prices and market movements."
        onRefresh={refresh}
        refreshing={refreshing}
      >
        <ErrorState title="Failed to load market data" message={error} />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Track live cryptocurrency prices and market movements."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {/* ================= Market Stats ================= */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MarketStatCard
          icon={<FiDollarSign className="text-orange-500" />}
          title="Total Market Cap"
          value={formatLargeCurrency(
            globalMarket?.total_market_cap?.[currency.toLowerCase()],
            currency,
          )}
          change={formatPercentage(
            globalMarket?.market_cap_change_percentage_24h_usd,
          )}
          positive={globalMarket?.market_cap_change_percentage_24h_usd >= 0}
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiActivity className="text-blue-500" />}
          title="24h Volume"
          value={formatLargeCurrency(
            globalMarket?.total_volume?.[currency.toLowerCase()],
            currency,
          )}
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
          value={trendingCoins.length}
          change={`${trendingCoins.length} Coins`}
          positive
          chart={<Sparkline data={chartData} positive />}
        />
      </section>

      {/* ================= Coin Table ================= */}

      <section className="mt-6">
        <CoinTable coins={mappedCoins.slice(0, 10)} />

        <div className="mt-6 flex justify-center">
          <Link
            to="/markets"
            className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        px-5
        py-3
        text-sm
        font-semibold
        text-[var(--app-text)]
        transition-all
        duration-300
        hover:border-[var(--color-primary-2)]
        hover:text-[var(--color-primary-2)]
      "
          >
            View All Markets
            <FiArrowRight />
          </Link>
        </div>
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
          {mappedTrendingCoins.slice(0, 5).map((coin) => (
            <TrendingCoinsCard key={coin.id} {...coin} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            to="/markets?filter=trending"
            className="
      inline-flex
      items-center
      gap-2
      rounded-xl
      border
      border-[var(--app-border)]
      bg-[var(--app-surface)]
      px-5
      py-3
      text-sm
      font-semibold
      text-[var(--app-text)]
      transition-all
      duration-300
      hover:border-[var(--color-primary-2)]
      hover:text-[var(--color-primary-2)]
    "
          >
            View All Trending
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
