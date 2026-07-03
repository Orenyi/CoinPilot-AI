import React, { useEffect, useState } from "react";
import { FiBarChart2, FiDatabase, FiLock, FiZap, FiSend } from "react-icons/fi";
import useCoins from "../../hooks/useCoins";

const ranges = {
  "1H": "1",
  "1D": "1",
  "1W": "7",
  "1M": "30",
  "1Y": "365",
};

const fallbackChartData = [40, 42, 41, 44, 48, 45, 51, 54, 50, 57, 61, 66];

const Hero = () => {
  const [activeRange, setActiveRange] = useState("1D");
  const [chartPoints, setChartPoints] = useState(fallbackChartData);
  const [loadingChart, setLoadingChart] = useState(false);

  const { coins } = useCoins();

  useEffect(() => {
    const getChartData = async () => {
      try {
        setLoadingChart(true);

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${ranges[activeRange]}`,
        );

        const data = await res.json();

        if (data?.prices?.length) {
          const prices = data.prices.map((item) => item[1]);

          const reduced = prices.filter((_, index) => {
            const step = Math.ceil(prices.length / 24);
            return index % step === 0;
          });

          setChartPoints(reduced.slice(-24));
        }
      } catch (error) {
        console.log("Using fallback BTC chart data");
        setChartPoints(fallbackChartData);
      } finally {
        setLoadingChart(false);
      }
    };

    getChartData();
  }, [activeRange]);

  const bitcoin = coins.find((coin) => coin.id === "bitcoin");

  const btc = {
    price: bitcoin?.current_price ?? 67892.44,
    change: bitcoin?.price_change_percentage_24h ?? 2.45,
  };

  const max = Math.max(...chartPoints);
  const min = Math.min(...chartPoints);

  const svgPoints = chartPoints
    .map((value, index) => {
      const x = (index / (chartPoints.length - 1)) * 100;
      const y = 100 - ((value - min) / (max - min || 1)) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const formattedPrice = btc.price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const stars = [
    "left-[5%] top-[12%]",
    "left-[12%] top-[78%]",
    "left-[20%] top-[35%]",
    "left-[28%] top-[15%]",
    "left-[35%] top-[68%]",
    "left-[42%] top-[28%]",
    "left-[50%] top-[10%]",
    "left-[58%] top-[80%]",
    "left-[65%] top-[36%]",
    "left-[72%] top-[16%]",
    "left-[80%] top-[72%]",
    "left-[88%] top-[28%]",
    "left-[94%] top-[55%]",
    "left-[10%] top-[50%]",
    "left-[46%] top-[55%]",
    "left-[76%] top-[48%]",
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--app-bg)] px-4 py-14 text-[var(--app-text)] sm:px-6 lg:px-8 lg:py-20">
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((position, index) => (
          <span
            key={index}
            className={`absolute ${position} ${
              index % 3 === 0 ? "h-2 w-2" : "h-1 w-1"
            } rounded-full bg-[var(--color-primary-2)] opacity-80 shadow-[0_0_18px_#7c3aed]`}
          />
        ))}

        <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-[var(--color-primary-2)]/10 blur-[100px]" />
        <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-[var(--color-accent)]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-[var(--container-width)] items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <div>
          <div className="mb-5 inline-flex rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-2 text-xs font-bold text-[var(--color-primary-2)] shadow-[var(--shadow-card)]">
            AI-Powered Crypto Intelligence
          </div>

          <h1 className="[font-family:var(--font-heading)] max-w-3xl text-4xl font-bold leading-tight text-[var(--app-text)] sm:text-5xl lg:text-6xl">
            Track crypto smarter with{" "}
            <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            insights
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--app-soft)] sm:text-lg">
            CoinPilot AI helps you monitor live crypto prices, charts,
            watchlists, and market summaries in one clean dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] px-8 py-4 font-medium text-white shadow-[0_0_28px_rgba(124,58,237,0.35)] transition hover:-translate-y-1">
              Get Started
            </button>

            <button className="rounded-xl border border-[var(--app-border)] px-8 py-4 font-medium text-[var(--app-text)] transition hover:border-[var(--color-primary-2)]">
              Explore Market
            </button>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 text-sm text-[var(--app-soft)] sm:grid-cols-4">
            <span className="flex items-center gap-2">
              <FiDatabase /> Real-time Data
            </span>
            <span className="flex items-center gap-2">
              <FiZap /> AI Insights
            </span>
            <span className="flex items-center gap-2">
              <FiLock /> Secure & Private
            </span>
            <span className="flex items-center gap-2">
              <FiBarChart2 /> Built for Traders
            </span>
          </div>
        </div>

        {/* BTC Card */}
        <div className="relative">
          <div className="rounded-[28px] border border-[var(--app-border)] bg-[var(--app-card)] p-4 shadow-[var(--shadow-card)] sm:p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                  ₿
                </div>

                <div>
                  <h3 className="font-bold text-[var(--app-text)]">Bitcoin</h3>
                  <p className="text-xs font-semibold text-[var(--app-muted)]">
                    BTC
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold text-[var(--app-muted)]">
                {Object.keys(ranges).map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`rounded-lg px-3 py-2 transition ${
                      activeRange === range
                        ? "bg-[var(--color-primary-2)] text-white"
                        : "hover:text-[var(--app-text)]"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="[font-family:var(--font-heading)] text-3xl font-bold text-[var(--app-text)]">
              {formattedPrice}
            </h2>

            <p
              className={`mt-1 text-sm font-bold ${
                btc.change >= 0 ? "text-[var(--color-success)]" : "text-red-500"
              }`}
            >
              {btc.change >= 0 ? "+" : ""}
              {btc.change.toFixed(2)}% (24h)
            </p>

            <svg viewBox="0 0 100 100" className="mt-5 h-36 w-full sm:h-40">
              <polyline
                fill="none"
                stroke={btc.change >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
                className={loadingChart ? "opacity-40" : "opacity-100"}
              />
            </svg>

            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg-2)] p-4">
              <div className="mb-3 flex items-center gap-2">
                <h4 className="font-bold text-[var(--app-text)]">
                  AI Assistant
                </h4>

                <span className="rounded-full bg-[var(--color-primary-2)]/20 px-2 py-1 text-[10px] font-bold text-[var(--color-primary-2)]">
                  BETA
                </span>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-2)] text-xs font-bold text-white">
                  AI
                </div>

                <p className="text-sm leading-6 text-[var(--app-soft)]">
                  Bitcoin is {btc.change >= 0 ? "up" : "down"}{" "}
                  {Math.abs(btc.change).toFixed(2)}% today. The chart updates
                  based on the selected market range.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
                <span className="text-sm text-[var(--app-muted)]">
                  Ask AI anything about crypto...
                </span>

                <FiSend className="text-[var(--color-primary-2)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
