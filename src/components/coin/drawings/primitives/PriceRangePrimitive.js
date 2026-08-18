class PriceRangeRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { x1, y1, x2, y2 } = this.source;

    if (x1 === null || y1 === null || x2 === null || y2 === null) {
      return;
    }

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const horizontalPixelRatio = scope.horizontalPixelRatio;

      const verticalPixelRatio = scope.verticalPixelRatio;

      const startX = x1 * horizontalPixelRatio;

      const startY = y1 * verticalPixelRatio;

      const endX = x2 * horizontalPixelRatio;

      const endY = y2 * verticalPixelRatio;

      const left = Math.min(startX, endX);

      const right = Math.max(startX, endX);

      const top = Math.min(startY, endY);

      const bottom = Math.max(startY, endY);

      const width = right - left;
      const height = bottom - top;

      ctx.save();

      // ==========================================
      // RANGE AREA
      // ==========================================

      ctx.fillStyle = "rgba(139,92,246,0.08)";

      ctx.fillRect(left, top, width, height);

      // ==========================================
      // RANGE BORDER
      // ==========================================

      ctx.strokeStyle = "#8b5cf6";

      ctx.lineWidth = 1.5 * horizontalPixelRatio;

      ctx.setLineDash([5 * horizontalPixelRatio, 4 * horizontalPixelRatio]);

      ctx.strokeRect(left, top, width, height);

      ctx.setLineDash([]);

      // ==========================================
      // ENDPOINTS
      // ==========================================

      ctx.fillStyle = "#8b5cf6";

      ctx.beginPath();

      ctx.arc(startX, startY, 4 * horizontalPixelRatio, 0, Math.PI * 2);

      ctx.fill();

      ctx.beginPath();

      ctx.arc(endX, endY, 4 * horizontalPixelRatio, 0, Math.PI * 2);

      ctx.fill();

      // ==========================================
      // RANGE LABEL
      // ==========================================

      ctx.font = `${10 * horizontalPixelRatio}px Poppins, sans-serif`;

      ctx.fillStyle = "#8b5cf6";

      ctx.fillText(
        "Price Range",
        left + 6 * horizontalPixelRatio,
        top + 14 * verticalPixelRatio,
      );

      ctx.restore();
    });
  }
}

class PriceRangePaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new PriceRangeRenderer(this.source);
  }
}

export class PriceRangePrimitive {
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this._chart = null;
    this._series = null;
    this._requestUpdate = null;
  }

  attached({ chart, series, requestUpdate }) {
    this._chart = chart;
    this._series = series;
    this._requestUpdate = requestUpdate;
  }

  detached() {
    this._chart = null;
    this._series = null;
    this._requestUpdate = null;
  }

  paneViews() {
    if (!this._chart || !this._series || !this.start || !this.end) {
      return [];
    }

    const timeScale = this._chart.timeScale();

    const x1 = timeScale.timeToCoordinate(this.start.time);

    const x2 = timeScale.timeToCoordinate(this.end.time);

    const y1 = this._series.priceToCoordinate(this.start.price);

    const y2 = this._series.priceToCoordinate(this.end.price);

    if (x1 === null || x2 === null || y1 === null || y2 === null) {
      return [];
    }

    return [
      new PriceRangePaneView({
        x1,
        y1,
        x2,
        y2,
      }),
    ];
  }

  update(start, end) {
    this.start = start;
    this.end = end;

    this._requestUpdate?.();
  }
}
