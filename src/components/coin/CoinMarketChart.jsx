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
} from "../../utils/chart/indicators";

import useCoinChart from "../../hooks/useCoinChart";

import ChartToolbar from "./ChartToolbar";

const CoinMarketChart = ({ coin, currency = "usd" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const mainSeriesRef = useRef(null);

  const [chartType, setChartType] = useState("candles");

  const [timeframe, setTimeframe] = useState("1D");

  const [showVolume, setShowVolume] = useState(true);

  const [indicator, setIndicator] = useState(null);

  const [drawingTool, setDrawingTool] = useState(null);

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

            value: item.volume ?? 0,

            color:
              item.close >= previous
                ? "rgba(34,197,94,0.55)"
                : "rgba(239,68,68,0.55)",
          };
        }),
      );
    }

    chart.timeScale().fitContent();
  }, [chartType, ohlcData, showVolume]);

  // ==========================================
  // INDICATORS
  // ==========================================

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !mainSeriesRef.current) {
      return;
    }

    if (!indicator) return;

    let indicatorSeries;

    if (indicator === "Moving Average" || indicator === "SMA") {
      indicatorSeries = chart.addSeries(LineSeries, {
        color: "#8b5cf6",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      indicatorSeries.setData(calculateSMA(ohlcData, 20));
    }

    if (indicator === "EMA") {
      indicatorSeries = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      indicatorSeries.setData(calculateEMA(ohlcData, 20));
    }

    if (indicator === "VWAP") {
      indicatorSeries = chart.addSeries(LineSeries, {
        color: "#06b6d4",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      indicatorSeries.setData(calculateVWAP(ohlcData));
    }

    if (indicator === "Bollinger Bands") {
      const bands = calculateBollingerBands(ohlcData, 20, 2);

      const upper = chart.addSeries(LineSeries, {
        color: "#8b5cf6",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const lower = chart.addSeries(LineSeries, {
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

      lower.setData(
        bands.map((item) => ({
          time: item.time,
          value: item.lower,
        })),
      );
    }

    return () => {
      if (indicatorSeries) {
        chart.removeSeries(indicatorSeries);
      }
    };
  }, [indicator, ohlcData]);

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
          console.log("Compare clicked");
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
    </section>
  );
};

export default CoinMarketChart;
