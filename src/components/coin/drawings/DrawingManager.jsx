import { useCallback, useEffect, useRef } from "react";

import { TrendLinePrimitive } from "./primitives/TrendLinePrimitive";
import { HorizontalLinePrimitive } from "./primitives/HorizontalLinePrimitive";
import { VerticalLinePrimitive } from "./primitives/VerticalLinePrimitive";
import { PriceRangePrimitive } from "./primitives/PriceRangePrimitive";
import { FibonacciPrimitive } from "./primitives/FibonacciPrimitive";

import {
  getDrawingPoint,
  requiresOnePoint,
  requiresTwoPoints,
} from "./DrawingUtils";

import { SupportResistancePrimitive } from "./primitives/SupportResistancePrimitive";

const DrawingManager = ({ chart, series, drawingTool, onDrawingsChange }) => {
  const drawingsRef = useRef([]);

  const stateRef = useRef({
    active: false,
    start: null,
    preview: null,
    previewPrimitive: null,
  });

  /*
   * ==========================================
   * CREATE PRIMITIVE
   * ==========================================
   */

  const createPrimitive = useCallback((tool, start, end) => {
    switch (tool) {
      case "Trend Line":
        return new TrendLinePrimitive(start, end);

      case "Horizontal Line":
        return new HorizontalLinePrimitive(start);

      case "Vertical Line":
        return new VerticalLinePrimitive(start);

      case "Support / Resistance":
        return new SupportResistancePrimitive(start, end);

      case "Price Range":
        return new PriceRangePrimitive(start, end);

      case "Fibonacci Retracement":
        return new FibonacciPrimitive(start, end, false);

      case "Fibonacci Extension":
        return new FibonacciPrimitive(start, end, true);

      default:
        return null;
    }
  }, []);

  /*
   * ==========================================
   * NOTIFY PARENT
   * ==========================================
   */

  const notifyDrawingsChange = useCallback(() => {
    onDrawingsChange?.({
      drawings: [...drawingsRef.current],
      clear: clearDrawings,
    });
  }, [onDrawingsChange]);

  /*
   * ==========================================
   * REMOVE PREVIEW
   * ==========================================
   */

  const removePreview = useCallback(() => {
    const state = stateRef.current;

    if (state.previewPrimitive && series) {
      try {
        series.detachPrimitive(state.previewPrimitive);
      } catch {
        // Already detached.
      }
    }

    state.previewPrimitive = null;
    state.preview = null;
  }, [series]);

  /*
   * ==========================================
   * REMOVE INDIVIDUAL DRAWING
   * ==========================================
   */

  const removeDrawing = useCallback(
    (drawingId) => {
      if (!series || !drawingId) return;

      const drawing = drawingsRef.current.find((item) => item.id === drawingId);

      if (!drawing) return;

      try {
        series.detachPrimitive(drawing.primitive);
      } catch {
        // Already detached.
      }

      drawingsRef.current = drawingsRef.current.filter(
        (item) => item.id !== drawingId,
      );

      notifyDrawingsChange();
    },
    [series, notifyDrawingsChange],
  );

  /*
   * ==========================================
   * CLEAR ALL DRAWINGS
   * ==========================================
   */

  const clearDrawings = useCallback(() => {
    if (series) {
      drawingsRef.current.forEach(({ primitive }) => {
        try {
          series.detachPrimitive(primitive);
        } catch {
          // Already detached.
        }
      });
    }

    drawingsRef.current = [];

    stateRef.current.active = false;
    stateRef.current.start = null;

    removePreview();

    notifyDrawingsChange();
  }, [series, removePreview, notifyDrawingsChange]);

  /*
   * ==========================================
   * RESET ACTIVE DRAWING
   * ==========================================
   */

  const resetDrawingState = useCallback(() => {
    const state = stateRef.current;

    removePreview();

    state.active = false;
    state.start = null;
  }, [removePreview]);

  /*
   * ==========================================
   * RESET WHEN DRAWING TOOL CHANGES
   * ==========================================
   */

  useEffect(() => {
    resetDrawingState();
  }, [drawingTool, resetDrawingState]);

  /*
   * ==========================================
   * DRAWING INTERACTION
   * ==========================================
   */

  useEffect(() => {
    if (!chart || !series || !drawingTool) {
      return;
    }

    const state = stateRef.current;

    const handleClick = (param) => {
      const point = getDrawingPoint(param, series);

      if (!point) return;

      /*
       * --------------------------------------
       * ONE-POINT TOOLS
       * --------------------------------------
       */

      if (requiresOnePoint(drawingTool)) {
        const primitive = createPrimitive(drawingTool, point, point);

        if (!primitive) return;

        series.attachPrimitive(primitive);

        drawingsRef.current = [
          ...drawingsRef.current,
          {
            id: crypto.randomUUID(),
            type: drawingTool,
            start: point,
            end: point,
            primitive,
          },
        ];

        notifyDrawingsChange();

        return;
      }

      /*
       * --------------------------------------
       * FIRST CLICK
       * --------------------------------------
       */

      if (!state.active) {
        state.active = true;
        state.start = point;

        return;
      }

      /*
       * --------------------------------------
       * SECOND CLICK
       * --------------------------------------
       */

      if (requiresTwoPoints(drawingTool)) {
        const primitive = createPrimitive(drawingTool, state.start, point);

        if (!primitive) {
          resetDrawingState();
          return;
        }

        removePreview();

        series.attachPrimitive(primitive);

        drawingsRef.current = [
          ...drawingsRef.current,
          {
            id: crypto.randomUUID(),
            type: drawingTool,
            start: state.start,
            end: point,
            primitive,
          },
        ];

        notifyDrawingsChange();

        state.active = false;
        state.start = null;
      }
    };

    /*
     * ==========================================
     * CROSSHAIR PREVIEW
     * ==========================================
     */

    const handleCrosshairMove = (param) => {
      if (!state.active || !state.start) {
        return;
      }

      const point = getDrawingPoint(param, series);

      if (!point) return;

      state.preview = point;

      /*
       * ==========================================
       * UPDATE EXISTING PREVIEW
       * ==========================================
       */

      if (state.previewPrimitive) {
        if (typeof state.previewPrimitive.update === "function") {
          state.previewPrimitive.update(state.start, point);
        }

        return;
      }

      /*
       * ==========================================
       * CREATE PREVIEW ON FIRST MOVE
       * ==========================================
       */

      const previewPrimitive = createPrimitive(drawingTool, state.start, point);

      if (!previewPrimitive) return;

      series.attachPrimitive(previewPrimitive);

      state.previewPrimitive = previewPrimitive;
    };

    chart.subscribeClick(handleClick);
    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeClick(handleClick);
      chart.unsubscribeCrosshairMove(handleCrosshairMove);

      removePreview();
    };
  }, [
    chart,
    series,
    drawingTool,
    createPrimitive,
    notifyDrawingsChange,
    removePreview,
    resetDrawingState,
  ]);

  /*
   * ==========================================
   * EXPOSE DRAWING API
   * ==========================================
   */

  useEffect(() => {
    if (!onDrawingsChange) return;

    onDrawingsChange({
      drawings: [...drawingsRef.current],
      remove: removeDrawing,
      clear: clearDrawings,
    });
  }, [onDrawingsChange, removeDrawing, clearDrawings]);
  return null;
};

export default DrawingManager;
