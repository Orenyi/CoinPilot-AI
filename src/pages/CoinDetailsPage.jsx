import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CoinHeader from "../components/coin/CoinHeader";
import CoinMarketChart from "../components/coin/CoinMarketChart";
import MarketStatistics from "../components/coin/MarketStatistics";
import PricePerformance from "../components/coin/PricePerformance";
import TechnicalAnalysis from "../components/coin/TechnicalAnalysis";
import AboutCoin from "../components/coin/AboutCoin";
import AIMarketInsight from "../components/coin/AIMarketInsight";
import MarketNews from "../components/coin/MarketNews";
import SimilarCoins from "../components/coin/SimilarCoins";
import PortfolioExposure from "../components/coin/PortfolioExposure";

import { getCoinDetails } from "../services/coinDetailsService";
import useCurrency from "../hooks/useCurrency";

const CoinDetailsPage = () => {
  const { id } = useParams();
  const { currency } = useCurrency();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCoin = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCoinDetails(id);

        if (!cancelled) {
          setCoin(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err.message || "Failed to load coin details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCoin();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* =========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--app-bg)]">
        <div
          className="
            mx-auto
            max-w-[1350px]
            px-4
            py-8
            sm:px-6
            lg:px-8
            lg:pl-[150px]
          "
        >
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-[var(--app-card)]" />

            <div className="h-32 rounded-2xl bg-[var(--app-card)]" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-xl bg-[var(--app-card)]"
                />
              ))}
            </div>

            <div className="h-[420px] rounded-2xl bg-[var(--app-card)]" />
          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--app-bg)]">
        <div
          className="
            mx-auto
            flex
            min-h-screen
            max-w-[1350px]
            items-center
            justify-center
            px-4
            sm:px-6
            lg:px-8
            lg:pl-[150px]
          "
        >
          <div className="text-center">
            <h1 className="text-xl font-bold text-[var(--app-text)]">
              Unable to load coin
            </h1>

            <p className="mt-2 text-sm text-[var(--app-muted)]">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================== */

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div
        className="
          mx-auto
          max-w-[1350px]
          px-4
          py-5
          sm:px-6
          lg:px-8
          lg:pl-[120px]
        "
      >
        {/* =====================================
            HEADER
        ====================================== */}

        <CoinHeader coin={coin} currency={currency.toLowerCase()} />

        {/* =====================================
            MAIN CONTENT
        ====================================== */}

        <div className="mt-8">
          <div
            className="
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-[minmax(0,1.85fr)_minmax(300px,1fr)]
            "
          >
            {/* =================================
                LEFT COLUMN
            ================================== */}

            <div className="min-w-0 space-y-6">
              {/* Chart */}

              <CoinMarketChart coin={coin} currency={currency.toLowerCase()} />

              {/* Technical Analysis */}

              <TechnicalAnalysis coin={coin} />

              {/* About + AI */}

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AboutCoin coin={coin} />

                <AIMarketInsight coin={coin} />
              </div>

              {/* Market News + Similar Coins */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]
                "
              >
                <MarketNews coin={coin} />

                <SimilarCoins coin={coin} />
              </div>
            </div>

            {/* =================================
                RIGHT COLUMN
            ================================== */}

            <aside className="min-w-0 space-y-6">
              <MarketStatistics coin={coin} currency={currency.toLowerCase()} />

              <PricePerformance coin={coin} currency={currency.toLowerCase()} />

              <PortfolioExposure
                coin={coin}
                currency={currency.toLowerCase()}
              />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoinDetailsPage;
