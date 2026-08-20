import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  LineSeries,
  PriceScaleMode,
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
import DrawingManager from "./drawings/DrawingManager";

import { getCoinChart } from "../../services/coinChartService";

import { normalizeMarketChart } from "../../utils/chart/chartFormatters";

import CompareCoinModal from "./CompareCoinModal";

const CoinMarketChart = ({ coin, currency = "usd" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const mainSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef([]);
  const volumeSeriesRef = useRef(null);

  const settingsRef = useRef(null);

  const [chartType, setChartType] = useState("candles");

  const [timeframe, setTimeframe] = useState("1D");

  const [showVolume, setShowVolume] = useState(true);

  const [indicator, setIndicator] = useState(null);

  const [drawingTool, setDrawingTool] = useState(null);

  const [showChartSettings, setShowChartSettings] = useState(false);

  const [chartSettings, setChartSettings] = useState({
    scale: "price",
    logScale: false,
    autoScale: true,
    appearance: "dark",
  });

  const comparisonSeriesRef = useRef(null);

  const [compareCoin, setCompareCoin] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [compareData, setCompareData] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const [drawingApi, setDrawingApi] = useState(null);

  const [chartInstance, setChartInstance] = useState(null);
  const [mainSeries, setMainSeries] = useState(null);

  // ==========================================
  // CLOSE SETTINGS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    if (!showChartSettings) return;

    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowChartSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChartSettings]);

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

        textColor: "#e5e7eb",
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
    setChartInstance(chart);

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

  // ==========================================
  // CHART SETTINGS
  // ==========================================

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    const rightPriceScale = chart.priceScale("right");

    rightPriceScale.applyOptions({
      mode: chartSettings.logScale
        ? PriceScaleMode.Logarithmic
        : chartSettings.scale === "percentage"
          ? PriceScaleMode.Percentage
          : PriceScaleMode.Normal,

      autoScale: chartSettings.autoScale,
    });

    chart.applyOptions({
      layout: {
        background: {
          type: ColorType.Solid,
          color:
            chartSettings.appearance === "dark" ? "transparent" : "#ffffff",
        },

        textColor: chartSettings.appearance === "dark" ? "#e5e7eb" : "#1f2937",
      },

      grid: {
        vertLines: {
          color:
            chartSettings.appearance === "dark"
              ? "rgba(148,163,184,0.08)"
              : "rgba(15,23,42,0.08)",
        },

        horzLines: {
          color:
            chartSettings.appearance === "dark"
              ? "rgba(148,163,184,0.08)"
              : "rgba(15,23,42,0.08)",
        },
      },
    });
  }, [chartSettings]);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart || !ohlcData.length) return;

    if (mainSeriesRef.current) {
      chart.removeSeries(mainSeriesRef.current);

      mainSeriesRef.current = null;

      setMainSeries(null);
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

    setChartInstance(chart);
    setMainSeries(series);
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
    relative
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
          setShowChartSettings((prev) => !prev);
        }}
        onClearDrawings={() => drawingApi?.clear()}
        hasDrawings={Boolean(drawingApi?.drawings?.length)}
      />

      {showChartSettings && (
        <div
          ref={settingsRef}
          className="
          absolute
          right-4
          top-[62px]
          z-30
          w-72
          rounded-xl
          border
          border-[var(--app-border)]
          bg-[var(--app-card)]
          p-4
          shadow-2xl
        "
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[var(--app-text)]">
              Chart Settings
            </h3>

            <p className="mt-1 text-[11px] text-[var(--app-muted)]">
              Customize how the chart is displayed.
            </p>
          </div>

          {/* VOLUME */}

          <div className="flex items-center justify-between border-b border-[var(--app-border)] py-3">
            <div>
              <p className="text-xs font-medium text-[var(--app-text)]">
                Volume
              </p>

              <p className="text-[10px] text-[var(--app-muted)]">
                Show volume bars
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowVolume((prev) => !prev)}
              className={`
          relative
          h-5
          w-9
          rounded-full
          transition
          ${showVolume ? "bg-[var(--color-primary)]" : "bg-slate-600"}
        `}
            >
              <span
                className={`
            absolute
            top-0.5
            h-4
            w-4
            rounded-full
            bg-white
            transition
            ${showVolume ? "left-4" : "left-0.5"}
          `}
              />
            </button>
          </div>

          {/* SCALE */}

          <div className="border-b border-[var(--app-border)] py-3">
            <p className="mb-2 text-xs font-medium text-[var(--app-text)]">
              Price Scale
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setChartSettings((prev) => ({
                    ...prev,
                    scale: "price",
                    logScale: false,
                  }))
                }
                className={`
            rounded-lg
            border
            px-3
            py-2
            text-xs
            transition
            ${
              chartSettings.scale === "price" && !chartSettings.logScale
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--app-border)] text-[var(--app-muted)]"
            }
          `}
              >
                Price
              </button>

              <button
                type="button"
                onClick={() =>
                  setChartSettings((prev) => ({
                    ...prev,
                    scale: "percentage",
                    logScale: false,
                  }))
                }
                className={`
            rounded-lg
            border
            px-3
            py-2
            text-xs
            transition
            ${
              chartSettings.scale === "percentage" && !chartSettings.logScale
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--app-border)] text-[var(--app-muted)]"
            }
          `}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* LOG SCALE */}

          <div className="flex items-center justify-between border-b border-[var(--app-border)] py-3">
            <div>
              <p className="text-xs font-medium text-[var(--app-text)]">
                Log Scale
              </p>

              <p className="text-[10px] text-[var(--app-muted)]">
                Use logarithmic pricing
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setChartSettings((prev) => ({
                  ...prev,
                  logScale: !prev.logScale,
                }))
              }
              className={`
          relative
          h-5
          w-9
          rounded-full
          transition
          ${
            chartSettings.logScale
              ? "bg-[var(--color-primary)]"
              : "bg-slate-600"
          }
        `}
            >
              <span
                className={`
            absolute
            top-0.5
            h-4
            w-4
            rounded-full
            bg-white
            transition
            ${chartSettings.logScale ? "left-4" : "left-0.5"}
          `}
              />
            </button>
          </div>

          {/* AUTO SCALE */}

          <div className="flex items-center justify-between border-b border-[var(--app-border)] py-3">
            <div>
              <p className="text-xs font-medium text-[var(--app-text)]">
                Auto Scale
              </p>

              <p className="text-[10px] text-[var(--app-muted)]">
                Automatically fit prices
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setChartSettings((prev) => ({
                  ...prev,
                  autoScale: !prev.autoScale,
                }))
              }
              className={`
          relative
          h-5
          w-9
          rounded-full
          transition
          ${
            chartSettings.autoScale
              ? "bg-[var(--color-primary)]"
              : "bg-slate-600"
          }
        `}
            >
              <span
                className={`
            absolute
            top-0.5
            h-4
            w-4
            rounded-full
            bg-white
            transition
            ${chartSettings.autoScale ? "left-4" : "left-0.5"}
          `}
              />
            </button>
          </div>

          {/* APPEARANCE */}

          <div className="py-3">
            <p className="mb-2 text-xs font-medium text-[var(--app-text)]">
              Chart Appearance
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setChartSettings((prev) => ({
                    ...prev,
                    appearance: "dark",
                  }))
                }
                className={`
            rounded-lg
            border
            px-3
            py-2
            text-xs
            transition
            ${
              chartSettings.appearance === "dark"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--app-border)] text-[var(--app-muted)]"
            }
          `}
              >
                Dark
              </button>

              <button
                type="button"
                onClick={() =>
                  setChartSettings((prev) => ({
                    ...prev,
                    appearance: "light",
                  }))
                }
                className={`
            rounded-lg
            border
            px-3
            py-2
            text-xs
            transition
            ${
              chartSettings.appearance === "light"
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                : "border-[var(--app-border)] text-[var(--app-muted)]"
            }
          `}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      )}

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

        {chartInstance && mainSeries && (
          <DrawingManager
            chart={chartInstance}
            series={mainSeries}
            drawingTool={drawingTool}
            onDrawingsChange={setDrawingApi}
          />
        )}
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
