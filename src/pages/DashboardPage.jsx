import React, { useState } from "react";
import {
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

import MarketStatCard from "../components/dashboard/cards/MarketStatCard";
import TrendingCoinsCard from "../components/dashboard/cards/TrendingCoinsCard";

import Sparkline from "../components/dashboard/charts/Sparkline";

import CoinTable from "../components/dashboard/table/CoinTable";

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

const coins = [
  {
    id: 1,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    name: "Bitcoin",
    symbol: "BTC",
    price: "67,892.44",
    change: "+2.45%",
    positive: true,
    marketCap: "$1.34T",
    volume: "$28.74B",
    chartData,
  },
  {
    id: 2,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    name: "Ethereum",
    symbol: "ETH",
    price: "3,245.67",
    change: "+1.82%",
    positive: true,
    marketCap: "$389.21B",
    volume: "$15.63B",
    chartData,
  },
  {
    id: 3,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    name: "Solana",
    symbol: "SOL",
    price: "164.32",
    change: "+3.41%",
    positive: true,
    marketCap: "$76.85B",
    volume: "$5.29B",
    chartData,
  },
  {
    id: 4,
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    name: "BNB",
    symbol: "BNB",
    price: "592.18",
    change: "+1.15%",
    positive: true,
    marketCap: "$86.24B",
    volume: "$1.89B",
    chartData,
  },
  {
    id: 5,
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    name: "XRP",
    symbol: "XRP",
    price: "0.54",
    change: "+0.98%",
    positive: true,
    marketCap: "$29.73B",
    volume: "$1.21B",
    chartData,
  },
];

const trendingCoins = [
  {
    id: 1,
    image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png",
    name: "Render",
    symbol: "RNDR",
    price: "8.23",
    change: "+12.41%",
    positive: true,
  },
  {
    id: 2,
    image:
      "https://assets.coingecko.com/coins/images/12882/large/Secondary_Symbol.png",
    name: "Injective",
    symbol: "INJ",
    price: "28.47",
    change: "+9.21%",
    positive: true,
  },
  {
    id: 3,
    image:
      "https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg",
    name: "Sui",
    symbol: "SUI",
    price: "1.64",
    change: "+8.35%",
    positive: true,
  },
  {
    id: 4,
    image:
      "https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png",
    name: "Sei",
    symbol: "SEI",
    price: "0.72",
    change: "+7.89%",
    positive: true,
  },
  {
    id: 5,
    image: "https://assets.coingecko.com/coins/images/16547/large/arb.jpg",
    name: "Arbitrum",
    symbol: "ARB",
    price: "1.32",
    change: "+6.71%",
    positive: true,
  },
];

const DashboardPage = () => {
  const [filteredCoins] = useState(coins);

  return (
    <DashboardLayout>
      {/* Market Stats */}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MarketStatCard
          icon={<FiDollarSign className="text-orange-500" />}
          title="Total Market Cap"
          value="$2.45T"
          change="+2.35%"
          positive
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiActivity className="text-blue-500" />}
          title="24h Volume"
          value="$98.47B"
          change="+4.12%"
          positive
          chart={<Sparkline data={chartData} positive />}
        />

        <MarketStatCard
          icon={<FiPieChart className="text-purple-500" />}
          title="BTC Dominance"
          value="52.41%"
          change="-0.68%"
          positive={false}
          chart={<Sparkline data={chartData} positive={false} />}
        />

        <MarketStatCard
          icon={<FiTrendingUp className="text-amber-500" />}
          title="Trending Coins"
          value="25"
          change="+3 New"
          positive
          chart={<Sparkline data={chartData} positive />}
        />
      </section>

      {/* Coin Table */}

      <section className="mt-6">
        <CoinTable coins={filteredCoins} />
      </section>

      {/* Trending Coins */}

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--app-text)]">
            Trending Coins
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {trendingCoins.map((coin) => (
            <TrendingCoinsCard key={coin.id} {...coin} chartData={chartData} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
