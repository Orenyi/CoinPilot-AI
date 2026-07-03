import React from "react";
import { FiArrowRight } from "react-icons/fi";
import CoinMiniCard from "./CoinMiniCard";
import useCoins from "../../hooks/useCoins";

const MarketPreview = () => {
  const { coins, loading } = useCoins();
  const previewCoins = coins.slice(0, 5);
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
          {previewCoins.map((coin) => (
            <CoinMiniCard key={coin.id} coin={coin} variant="card" />
          ))}
        </div>

        {/* Mobile */}
        <div className="grid gap-4 md:hidden">
          {previewCoins.map((coin) => (
            <CoinMiniCard key={coin.id} coin={coin} variant="card" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketPreview;
