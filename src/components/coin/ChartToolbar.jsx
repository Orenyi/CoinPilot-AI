import React from "react";
import {
  FiBarChart2,
  FiChevronDown,
  FiGitMerge,
  FiMoreHorizontal,
  FiSettings,
  FiTool,
} from "react-icons/fi";

import {
  CHART_TYPES,
  TIMEFRAMES,
  INDICATORS,
  DRAWING_TOOLS,
} from "../../utils/chart/chartConstants";

const ChartToolbar = ({
  chartType,
  setChartType,

  timeframe,
  setTimeframe,

  indicator,
  setIndicator,

  drawingTool,
  setDrawingTool,

  onCompare,
  onSettings,

  showVolume,
  setShowVolume,

  onClearDrawings,
  hasDrawings,
}) => {
  return (
    <div
      className="
        border-b
        border-[var(--app-border)]
        bg-[var(--app-card)]
      "
    >
      {/* =========================================
          TOP TOOLBAR
      ========================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-2
          px-3
          py-2.5
          sm:px-4
        "
      >
        {/* LEFT CONTROLS */}

        <div className="flex min-w-0 items-center gap-1.5">
          {/* Chart Type */}

          <div className="relative">
            <FiBarChart2
              size={14}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />

            <select
              value={chartType}
              onChange={(event) => setChartType(event.target.value)}
              className="
                h-8
                appearance-none
                rounded-md
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                pl-8
                pr-7
                text-[11px]
                font-medium
                text-[var(--app-text)]
                outline-none
                transition-colors
                hover:border-[var(--color-primary-2)]
                focus:border-[var(--color-primary-2)]
              "
              aria-label="Chart type"
            >
              {CHART_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>

            <FiChevronDown
              size={12}
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />
          </div>

          {/* Indicators */}

          <div className="relative hidden sm:block">
            <select
              value={indicator || ""}
              onChange={(event) => setIndicator(event.target.value || null)}
              className="
                h-8
                appearance-none
                rounded-md
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                px-2.5
                pr-7
                text-[11px]
                font-medium
                text-[var(--app-text)]
                outline-none
                transition-colors
                hover:border-[var(--color-primary-2)]
                focus:border-[var(--color-primary-2)]
              "
              aria-label="Indicators"
            >
              <option value="">Indicators</option>

              {INDICATORS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <FiChevronDown
              size={12}
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />
          </div>

          {/* Compare */}

          <button
            type="button"
            onClick={onCompare}
            className="
              hidden
              h-8
              items-center
              gap-1.5
              rounded-md
              border
              border-[var(--app-border)]
              bg-[var(--app-card-2)]
              px-2.5
              text-[11px]
              font-medium
              text-[var(--app-text)]
              transition-all
              hover:border-[var(--color-primary-2)]
              hover:text-[var(--color-primary-2)]
              sm:flex
            "
          >
            <FiGitMerge size={13} />
            Compare
          </button>

          {/* Drawing */}

          <div className="relative hidden sm:block">
            <FiTool
              size={13}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />

            <select
              value={drawingTool || ""}
              onChange={(event) => setDrawingTool(event.target.value || null)}
              className="
                h-8
                appearance-none
                rounded-md
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                pl-8
                pr-7
                text-[11px]
                font-medium
                text-[var(--app-text)]
                outline-none
                transition-colors
                hover:border-[var(--color-primary-2)]
                focus:border-[var(--color-primary-2)]
              "
              aria-label="Drawing tools"
            >
              <option value="">Drawing</option>

              {DRAWING_TOOLS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>

            <FiChevronDown
              size={12}
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-[var(--app-muted)]
              "
            />
          </div>
        </div>
        {/* Clear Drawings */}

        <button
          type="button"
          onClick={onClearDrawings}
          disabled={!hasDrawings}
          className="
                hidden
                h-8
                items-center
                rounded-md
                border
                border-[var(--app-border)]
                bg-[var(--app-card-2)]
                px-2.5
                text-[11px]
                font-medium
                text-[var(--app-text)]
                transition-all
                hover:border-red-500
                hover:text-red-400
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:flex
              "
        >
          Clear
        </button>

        {/* RIGHT CONTROLS */}

        <div className="flex items-center gap-1.5">
          {/* Volume */}

          <button
            type="button"
            onClick={() => setShowVolume((value) => !value)}
            className={`
              hidden
              h-8
              items-center
              gap-1.5
              rounded-md
              border
              px-2.5
              text-[11px]
              font-medium
              transition-all
              sm:flex
              ${
                showVolume
                  ? "border-[var(--color-primary-2)] text-[var(--color-primary-2)]"
                  : "border-[var(--app-border)] text-[var(--app-muted)] hover:text-[var(--app-text)]"
              }
            `}
          >
            Volume
          </button>

          {/* Settings */}

          <button
            type="button"
            onClick={onSettings}
            aria-label="Chart settings"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              border-[var(--app-border)]
              bg-[var(--app-card-2)]
              text-[var(--app-muted)]
              transition-all
              hover:border-[var(--color-primary-2)]
              hover:text-[var(--color-primary-2)]
            "
          >
            <FiSettings size={14} />
          </button>

          {/* More */}

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              border-[var(--app-border)]
              bg-[var(--app-card-2)]
              text-[var(--app-muted)]
              transition-all
              hover:border-[var(--color-primary-2)]
              hover:text-[var(--color-primary-2)]
              sm:hidden
            "
          >
            <FiMoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* =========================================
          TIMEFRAMES
      ========================================== */}

      <div
        className="
          hide-scrollbar
          flex
          items-center
          gap-1
          overflow-x-auto
          border-t
          border-[var(--app-border)]
          px-3
          py-2
          sm:px-4
        "
      >
        {TIMEFRAMES.map((item) => {
          const active = timeframe === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setTimeframe(item.label)}
              className={`
                shrink-0
                rounded-md
                px-2.5
                py-1.5
                text-[10px]
                font-medium
                transition-all
                sm:text-xs
                ${
                  active
                    ? "bg-[var(--color-primary-2)]/10 text-[var(--color-primary-2)]"
                    : "text-[var(--app-muted)] hover:bg-[var(--app-card-2)] hover:text-[var(--app-text)]"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartToolbar;
