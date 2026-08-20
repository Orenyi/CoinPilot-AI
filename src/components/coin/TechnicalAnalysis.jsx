import React, { useMemo } from "react";

import { createSparklinePoints } from "./technicalAnalysis/technicalAnalysisUtils";

/*
 * ==========================================
 * TECHNICAL SPARKLINE
 * ==========================================
 */

const TechnicalSparkline = ({
  values = [],
  color = "#8b5cf6",
  secondaryValues = null,
}) => {
  const primaryPoints = useMemo(
    () => createSparklinePoints(values, 110, 38, 3),
    [values],
  );

  const secondaryPoints = useMemo(
    () =>
      secondaryValues?.length
        ? createSparklinePoints(secondaryValues, 110, 38, 3)
        : "",
    [secondaryValues],
  );

  if (!primaryPoints) {
    return (
      <div className="h-10 w-full" aria-hidden="true">
        <div className="h-px w-full bg-[var(--app-border)]" />
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 110 38"
      className="h-10 w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {secondaryPoints && (
        <polyline
          points={secondaryPoints}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      )}

      <polyline
        points={primaryPoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/*
 * ==========================================
 * TECHNICAL CARD
 * ==========================================
 */

const TechnicalCard = ({
  title,
  value,
  description,
  values = [],
  color,
  secondaryValues = null,
}) => {
  const isBullish = value === "Bullish";
  const isBearish = value === "Bearish";

  return (
    <article
      className="
        min-w-0
        rounded-lg
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        px-3
        py-2.5
        transition
        hover:border-[var(--color-primary)]/30
      "
    >
      <p className="text-[10px] font-medium text-[var(--app-muted)]">{title}</p>

      <p
        className={`
          mt-0.5
          text-sm
          font-semibold
          ${
            isBullish
              ? "text-emerald-500"
              : isBearish
                ? "text-red-500"
                : "text-[var(--app-text)]"
          }
        `}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[9px] leading-3 text-[var(--app-muted)]">
        {description}
      </p>

      <div className="mt-1.5">
        <TechnicalSparkline
          values={values}
          color={color}
          secondaryValues={secondaryValues}
        />
      </div>
    </article>
  );
};

/*
 * ==========================================
 * LOADING STATE
 * ==========================================
 */

const TechnicalAnalysisSkeleton = () => {
  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
        p-3
        sm:p-4
      "
    >
      <div className="mb-2.5">
        <div className="h-3 w-32 animate-pulse rounded bg-[var(--app-border)]" />
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-2
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {[1, 2, 3, 4].map((item) => (
          <article
            key={item}
            className="
              rounded-lg
              border
              border-[var(--app-border)]
              bg-[var(--app-card)]
              px-3
              py-2.5
            "
          >
            <div className="h-2.5 w-10 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mt-2 h-2 w-24 animate-pulse rounded bg-[var(--app-border)]" />

            <div className="mt-3 h-10 w-full animate-pulse rounded bg-[var(--app-border)]" />
          </article>
        ))}
      </div>
    </section>
  );
};

/*
 * ==========================================
 * TECHNICAL ANALYSIS
 * ==========================================
 *
 * `analysis` comes from the backend.
 *
 * Expected structure:
 *
 * {
 *   currentPrice,
 *   rsi,
 *   rsiValues,
 *   macd,
 *   signal,
 *   macdValues,
 *   signalValues,
 *   movingAverage,
 *   movingAverageStatus,
 *   movingAverageValues,
 *   volatility,
 *   volatilityLabel,
 *   priceValues
 * }
 */

const TechnicalAnalysis = ({
  coin,
  analysis = null,
  loading = false,
  error = null,
}) => {
  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return <TechnicalAnalysisSkeleton />;
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <section
        className="
          rounded-xl
          border
          border-[var(--app-border)]
          bg-[var(--app-card)]
          p-3
          sm:p-4
        "
      >
        <h2
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            text-[var(--app-text)]
          "
        >
          Technical Analysis
        </h2>

        <p className="mt-2 text-[10px] text-[var(--app-muted)]">
          Technical analysis is temporarily unavailable.
        </p>
      </section>
    );
  }

  if (!coin || !analysis) {
    return null;
  }

  const symbol = coin.symbol?.toUpperCase() || coin.name || "Coin";

  /*
   * ==========================================
   * RSI
   * ==========================================
   */

  const rsi = Number.isFinite(Number(analysis.rsi))
    ? Number(analysis.rsi)
    : null;

  const rsiDescription =
    rsi === null
      ? "Insufficient data"
      : rsi >= 70
        ? "Overbought"
        : rsi <= 30
          ? "Oversold"
          : rsi >= 50
            ? "Neutral → Bullish"
            : "Neutral → Bearish";

  /*
   * ==========================================
   * MACD
   * ==========================================
   */

  const macd = Number.isFinite(Number(analysis.macd))
    ? Number(analysis.macd)
    : null;

  const signal = Number.isFinite(Number(analysis.signal))
    ? Number(analysis.signal)
    : null;

  const macdBullish = macd !== null && signal !== null ? macd >= signal : null;

  const macdDescription =
    macd === null || signal === null
      ? "Insufficient data"
      : macdBullish
        ? "Above signal line"
        : "Below signal line";

  /*
   * ==========================================
   * MOVING AVERAGE
   * ==========================================
   */

  const movingAverageStatus = analysis.movingAverageStatus;

  const movingAverageDescription =
    movingAverageStatus === "Bullish"
      ? `${symbol} above 50D MA`
      : movingAverageStatus === "Bearish"
        ? `${symbol} below 50D MA`
        : "Insufficient data";

  /*
   * ==========================================
   * VOLATILITY
   * ==========================================
   */

  const volatility = Number.isFinite(Number(analysis.volatility))
    ? Number(analysis.volatility)
    : null;

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--app-border)]
        bg-slate-950
        p-3
        sm:p-4
      "
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <h2
        className="
          mb-2.5
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-[var(--app-text)]
        "
      >
        Technical Analysis
      </h2>

      {/* ==========================================
          CARDS
      ========================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-2
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* ==========================================
            RSI
        ========================================== */}

        <TechnicalCard
          title="RSI"
          value={rsi !== null ? rsi.toFixed(1) : "--"}
          description={rsiDescription}
          values={analysis.rsiValues}
          color="#a855f7"
        />

        {/* ==========================================
            MACD
        ========================================== */}

        <TechnicalCard
          title="MACD"
          value={
            macdBullish === null ? "--" : macdBullish ? "Bullish" : "Bearish"
          }
          description={macdDescription}
          values={analysis.macdValues}
          secondaryValues={analysis.signalValues}
          color="#60a5fa"
        />

        {/* ==========================================
            MOVING AVERAGE
        ========================================== */}

        <TechnicalCard
          title="Moving Average"
          value={
            movingAverageStatus === "Bullish"
              ? "Bullish"
              : movingAverageStatus === "Bearish"
                ? "Bearish"
                : "--"
          }
          description={movingAverageDescription}
          values={analysis.movingAverageValues}
          color="#22c55e"
        />

        {/* ==========================================
            VOLATILITY
        ========================================== */}

        <TechnicalCard
          title="Volatility"
          value={analysis.volatilityLabel || "--"}
          description={
            volatility !== null
              ? `${volatility.toFixed(2)}% daily volatility`
              : "Insufficient data"
          }
          values={analysis.priceValues}
          color="#38bdf8"
        />
      </div>
    </section>
  );
};

export default TechnicalAnalysis;
