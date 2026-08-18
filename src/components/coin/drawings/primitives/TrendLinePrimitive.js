class TrendLineRenderer {
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

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);

      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2 * horizontalPixelRatio;

      ctx.stroke();

      // Draw endpoint circles
      ctx.fillStyle = "#8b5cf6";

      ctx.beginPath();
      ctx.arc(startX, startY, 4 * horizontalPixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(endX, endY, 4 * horizontalPixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }
}

class TrendLinePaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new TrendLineRenderer(this.source);
  }
}

export class TrendLinePrimitive {
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this._requestUpdate = null;
    this._chart = null;
    this._series = null;
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
    if (!this._chart || !this._series) {
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

    const source = {
      x1,
      y1,
      x2,
      y2,
    };

    return [new TrendLinePaneView(source)];
  }

  update(start, end) {
    this.start = start;
    this.end = end;

    this._requestUpdate?.();
  }
}
