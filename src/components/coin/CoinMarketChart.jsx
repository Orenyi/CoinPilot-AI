import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";

import { TIMEFRAMES } from "../../utils/chart/chartConstants";

import {
  calculateEMA,
  calculateSMA,
  calculateBollingerBands,
  calculateVWAP,
  calculateRSI,
  calculateMACD,
  calculateStochastic,
} from "../../utils/chart/indicators";

import useCoinChart from "../../hooks/useCoinChart";

import ChartToolbar from "./ChartToolbar";

import { getCoinChart } from "../../services/coinChartService";

import { normalizeMarketChart } from "../../utils/chart/chartFormatters";

import CompareCoinModal from "./CompareCoinModal";

const CoinMarketChart = ({ coin, currency = "usd" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef([]);
  const volumeSeriesRef = useRef(null);

  const [chartType, setChartType] = useState("candles");

  const [timeframe, setTimeframe] = useState("1D");

  const [showVolume, setShowVolume] = useState(true);

  const [indicator, setIndicator] = useState(null);

  const [drawingTool, setDrawingTool] = useState(null);

  const comparisonSeriesRef = useRef(null);

  const [compareCoin, setCompareCoin] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [compareData, setCompareData] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const timeframeConfig = TIMEFRAMES.find((item) => item.label === timeframe);

  const { data, loading, error } = useCoinChart({
    coinId: coin?.id,
    currency,
    days: timeframeConfig?.days ?? "1",
    chartType,
  });

  const ohlcData = useMemo(() => {
    if (!data.length) return [];

    return data.map((item, index) => ({
      ...item,

      open: item.open ?? data[index - 1]?.close ?? item.close,

      high:
        item.high ?? Math.max(data[index - 1]?.close ?? item.close, item.close),

      low:
        item.low ?? Math.min(data[index - 1]?.close ?? item.close, item.close),

      close: item.close,
    }));
  }, [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 390,

      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },

        textColor: "var(--chart-text)",
        fontFamily: "Poppins, sans-serif",
      },

      grid: {
        vertLines: {
          color: "rgba(148,163,184,0.08)",
        },

        horzLines: {
          color: "rgba(148,163,184,0.08)",
        },
      },

      crosshair: {
        vertLine: {
          color: "rgba(124,58,237,0.45)",
          width: 1,
          style: 2,
        },

        horzLine: {
          color: "rgba(124,58,237,0.45)",
          width: 1,
          style: 2,
        },
      },

      rightPriceScale: {
        borderVisible: false,

        scaleMargins: {
          top: 0.08,
          bottom: 0.18,
        },
      },

      timeScale: {
        borderColor: "rgba(148,163,184,0.12)",

        timeVisible: true,

        secondsVisible: false,

        rightOffset: 3,

        barSpacing: 7,
      },

      localization: {
        priceFormatter: (price) =>
          new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
          }).format(price),
      },
    });

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !ohlcData.length) return;

    if (mainSeriesRef.current) {
      chart.removeSeries(mainSeriesRef.current);

      mainSeriesRef.current = null;
    }

    let series;

    if (chartType === "candles") {
      series = chart.addSeries(CandlestickSeries, {
        upColor: "#16a34a",
        downColor: "#ef4444",
        borderUpColor: "#16a34a",
        borderDownColor: "#ef4444",
        wickUpColor: "#16a34a",
        wickDownColor: "#ef4444",
      });

      series.setData(
        ohlcData.map((item) => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })),
      );
    }

    if (chartType === "ohlc") {
      series = chart.addSeries(CandlestickSeries, {
        upColor: "transparent",
        downColor: "transparent",
        borderUpColor: "#16a34a",
        borderDownColor: "#ef4444",
        wickUpColor: "#16a34a",
        wickDownColor: "#ef4444",
      });

      series.setData(
        ohlcData.map((item) => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })),
      );
    }

    if (chartType === "line") {
      series = chart.addSeries(LineSeries, {
        color: "#22c55e",
        lineWidth: 2,
      });

      series.setData(
        ohlcData.map((item) => ({
          time: item.time,
          value: item.close,
        })),
      );
    }

    if (chartType === "area") {
      series = chart.addSeries(AreaSeries, {
        lineColor: "#22c55e",
        topColor: "rgba(34,197,94,0.25)",
        bottomColor: "rgba(34,197,94,0.02)",
        lineWidth: 2,
      });

      series.setData(
        ohlcData.map((item) => ({
          time: item.time,
          value: item.close,
        })),
      );
    }

    mainSeriesRef.current = series;
    // ==========================================
    // VOLUME
    // ==========================================

    if (volumeSeriesRef.current) {
      try {
        chart.removeSeries(volumeSeriesRef.current);
      } catch {
        // Series may already have been removed.
      }

      volumeSeriesRef.current = null;
    }

    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: "volume",
        },

        priceScaleId: "volume",

        color: "rgba(34,197,94,0.55)",
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0,
        },
      });

      volumeSeries.setData(
        ohlcData.map((item, index) => {
          const previous = ohlcData[index - 1]?.close ?? item.close;

          return {
            time: item.time,

            value: Number(item.volume ?? 0),

            color:
              item.close >= previous
                ? "rgba(34,197,94,0.55)"
                : "rgba(239,68,68,0.55)",
          };
        }),
      );

      volumeSeriesRef.current = volumeSeries;
    }

    chart.timeScale().fitContent();
  }, [chartType, ohlcData, showVolume]);

  // ==========================================
  // INDICATORS
  // ==========================================

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !mainSeriesRef.current) return;

    // Remove previous indicator series
    indicatorSeriesRef.current.forEach((series) => {
      try {
        chart.removeSeries(series);
      } catch {
        // Series may already have been removed.
      }
    });

    indicatorSeriesRef.current = [];

    if (!indicator || !ohlcData.length) return;

    const addIndicatorSeries = (options, paneIndex = 0) => {
      const series = chart.addSeries(LineSeries, options, paneIndex);

      indicatorSeriesRef.current.push(series);

      return series;
    };

    // ==========================================
    // SMA
    // ==========================================

    if (indicator === "SMA" || indicator === "Moving Average") {
      const series = addIndicatorSeries({
        color: "#8b5cf6",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      series.setData(calculateSMA(ohlcData, 20));
    }

    // ==========================================
    // EMA
    // ==========================================

    if (indicator === "EMA") {
      const series = addIndicatorSeries({
        color: "#f59e0b",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      series.setData(calculateEMA(ohlcData, 20));
    }

    // ==========================================
    // VWAP
    // ==========================================

    if (indicator === "VWAP") {
      const series = addIndicatorSeries({
        color: "#06b6d4",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      series.setData(calculateVWAP(ohlcData));
    }

    // ==========================================
    // BOLLINGER BANDS
    // ==========================================

    if (indicator === "Bollinger Bands") {
      const bands = calculateBollingerBands(ohlcData, 20, 2);

      const upper = addIndicatorSeries({
        color: "#8b5cf6",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const middle = addIndicatorSeries({
        color: "rgba(139,92,246,0.5)",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const lower = addIndicatorSeries({
        color: "#8b5cf6",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      upper.setData(
        bands.map((item) => ({
          time: item.time,
          value: item.upper,
        })),
      );

      middle.setData(
        bands.map((item) => ({
          time: item.time,
          value: item.middle,
        })),
      );

      lower.setData(
        bands.map((item) => ({
          time: item.time,
          value: item.lower,
        })),
      );
    }

    // ==========================================
    // RSI
    // ==========================================

    if (indicator === "RSI") {
      const series = addIndicatorSeries(
        {
          color: "#a855f7",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        },
        1,
      );

      series.setData(calculateRSI(ohlcData, 14));

      series.createPriceLine({
        price: 70,
        color: "#ef4444",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
        title: "70",
      });

      series.createPriceLine({
        price: 30,
        color: "#22c55e",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
        title: "30",
      });

      chart.panes()[1]?.setHeight(120);
    }

    // ==========================================
    // STOCHASTIC
    // ==========================================

    if (indicator === "Stochastic") {
      const series = addIndicatorSeries(
        {
          color: "#06b6d4",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        },
        1,
      );

      series.setData(calculateStochastic(ohlcData, 14));

      series.createPriceLine({
        price: 80,
        color: "#ef4444",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
        title: "80",
      });

      series.createPriceLine({
        price: 20,
        color: "#22c55e",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: false,
        title: "20",
      });

      chart.panes()[1]?.setHeight(120);
    }

    // ==========================================
    // MACD
    // ==========================================

    if (indicator === "MACD") {
      const macdData = calculateMACD(ohlcData, 12, 26, 9);

      const macdSeries = addIndicatorSeries(
        {
          color: "#8b5cf6",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        },
        1,
      );

      const signalSeries = addIndicatorSeries(
        {
          color: "#f59e0b",
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: true,
        },
        1,
      );

      macdSeries.setData(
        macdData.map((item) => ({
          time: item.time,
          value: item.macd,
        })),
      );

      signalSeries.setData(
        macdData.map((item) => ({
          time: item.time,
          value: item.signal,
        })),
      );

      chart.panes()[1]?.setHeight(140);
    }

    return () => {
      indicatorSeriesRef.current.forEach((series) => {
        try {
          chart.removeSeries(series);
        } catch {
          // Ignore already removed series.
        }
      });

      indicatorSeriesRef.current = [];
    };
  }, [indicator, ohlcData, chartType]);

  // ==========================================
  // COMPARE COIN DATA
  // ==========================================

  useEffect(() => {
    const fetchComparison = async () => {
      if (!compareCoin?.id) {
        setCompareData([]);
        return;
      }

      try {
        setCompareLoading(true);

        const response = await getCoinChart({
          coinId: compareCoin.id,
          currency,
          days: timeframeConfig?.days ?? "1",
          type: "market",
        });

        const normalized = normalizeMarketChart(response);

        setCompareData(normalized);
      } catch (error) {
        console.error("[CoinMarketChart] Compare error:", error);
        setCompareData([]);
      } finally {
        setCompareLoading(false);
      }
    };

    fetchComparison();
  }, [compareCoin?.id, currency, timeframeConfig?.days]);

  // ==========================================
  // COMPARISON SERIES
  // ==========================================

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    // Remove previous comparison line
    if (comparisonSeriesRef.current) {
      try {
        chart.removeSeries(comparisonSeriesRef.current);
      } catch {
        // Already removed
      }

      comparisonSeriesRef.current = null;
    }

    if (!compareCoin || !compareData.length) return;

    const firstPrice = compareData[0]?.close;

    if (!firstPrice) return;

    // Normalize comparison to percentage performance
    // so Bitcoin vs Ethereum is meaningful regardless
    // of their different absolute prices.
    const normalizedComparison = compareData.map((item) => ({
      time: item.time,
      value: ((item.close - firstPrice) / firstPrice) * 100,
    }));

    const series = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      title: compareCoin.symbol?.toUpperCase() || "COMPARE",
    });

    series.setData(normalizedComparison);

    comparisonSeriesRef.current = series;

    return () => {
      if (comparisonSeriesRef.current) {
        try {
          chart.removeSeries(comparisonSeriesRef.current);
        } catch {
          // Ignore
        }

        comparisonSeriesRef.current = null;
      }
    };
  }, [compareCoin, compareData]);

  if (!coin) return null;

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border
        border-[var(--app-border)]
        bg-[var(--app-card)]
      "
    >
      <ChartToolbar
        chartType={chartType}
        setChartType={setChartType}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        indicator={indicator}
        setIndicator={setIndicator}
        drawingTool={drawingTool}
        setDrawingTool={setDrawingTool}
        showVolume={showVolume}
        setShowVolume={setShowVolume}
        onCompare={() => {
          setShowCompareModal(true);
        }}
        onSettings={() => {
          console.log("Chart settings clicked");
        }}
      />

      {/* ======================================
          CHART
      ======================================= */}

      <div className="relative px-1">
        {loading && (
          <div
            className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              bg-[var(--app-card)]
            "
          >
            <span className="text-xs text-[var(--app-muted)]">
              Loading chart...
            </span>
          </div>
        )}

        {error && (
          <div
            className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              bg-[var(--app-card)]
            "
          >
            <span className="text-xs text-red-400">{error}</span>
          </div>
        )}

        <div
          ref={chartContainerRef}
          className="
            h-[280px]
            w-full
            sm:h-[390px]
          "
        />
      </div>
      {showCompareModal && (
        <CompareCoinModal
          currentCoin={coin}
          onSelect={(selectedCoin) => {
            setCompareCoin(selectedCoin);
            setShowCompareModal(false);
          }}
          onClose={() => {
            setShowCompareModal(false);
          }}
        />
      )}
    </section>
  );
};

export default CoinMarketChart;
