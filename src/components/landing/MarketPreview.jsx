import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import CoinMiniCard from "./CoinMiniCard";

const coinIds = ["bitcoin", "ethereum", "binancecoin", "solana", "ripple"];

// keep your fallbackCoins array unchanged

const fallbackCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67892.44,
    price_change_percentage_24h: 2.45,
    sparkline_in_7d: {
      price: [40, 42, 41, 45, 44, 49, 52, 57, 55, 61],
    },
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3245.67,
    price_change_percentage_24h: 1.82,
    sparkline_in_7d: {
      price: [30, 31, 33, 32, 36, 35, 39, 42, 41, 45],
    },
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 589.14,
    price_change_percentage_24h: 1.15,
    sparkline_in_7d: {
      price: [20, 22, 21, 25, 27, 26, 30, 31, 34, 36],
    },
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 164.32,
    price_change_percentage_24h: 3.41,
    sparkline_in_7d: {
      price: [22, 24, 25, 28, 32, 30, 34, 36, 35, 39],
    },
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.54,
    price_change_percentage_24h: 0.98,
    sparkline_in_7d: {
      price: [12, 14, 13, 16, 15, 18, 17, 20, 21, 24],
    },
  },
];

const MarketPreview = () => {
  const [coins, setCoins] = useState(fallbackCoins);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
            ",",
          )}&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h`,
        );

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setCoins(data);
        }
      } catch (error) {
        console.log("Using fallback market data");
      }
    };

    fetchCoins();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--app-bg)] px-4 py-20 sm:px-6 lg:px-8">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[var(--color-primary-2)]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[var(--container-width)]">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-2)]">
              Markets
            </p>

            <h2 className="[font-family:var(--font-heading)] text-3xl font-bold text-[var(--app-text)] sm:text-4xl">
              Top Market Overview
            </h2>
          </div>

          <button className="hidden items-center gap-2 text-sm font-semibold text-[var(--color-primary-2)] transition hover:gap-3 sm:flex">
            View All Markets
            <FiArrowRight />
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden gap-5 md:grid md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-5">
          {coins.map((coin) => (
            <CoinMiniCard key={coin.id} coin={coin} variant="card" />
          ))}
        </div>

        {/* Mobile */}
        <div className="grid gap-4 md:hidden">
          {coins.map((coin) => (
            <CoinMiniCard key={coin.id} coin={coin} variant="list" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketPreview;
