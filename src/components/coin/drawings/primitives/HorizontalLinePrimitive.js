class HorizontalLineRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { x1, x2, y } = this.source;

    if (x1 === null || x2 === null || y === null) {
      return;
    }

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const horizontalPixelRatio = scope.horizontalPixelRatio;
      const verticalPixelRatio = scope.verticalPixelRatio;

      const startX = x1 * horizontalPixelRatio;
      const endX = x2 * horizontalPixelRatio;
      const lineY = y * verticalPixelRatio;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(startX, lineY);
      ctx.lineTo(endX, lineY);

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2 * horizontalPixelRatio;

      ctx.stroke();

      // Endpoint markers
      ctx.fillStyle = "#06b6d4";

      ctx.beginPath();
      ctx.arc(startX, lineY, 4 * horizontalPixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(endX, lineY, 4 * horizontalPixelRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }
}

class HorizontalLinePaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new HorizontalLineRenderer(this.source);
  }
}

export class HorizontalLinePrimitive {
  constructor(point) {
    this.point = point;

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
    if (!this._chart || !this._series || !this.point) {
      return [];
    }

    const timeScale = this._chart.timeScale();

    const x1 = timeScale.timeToCoordinate(this.point.time);

    const x2 = this._chart.width();

    const y = this._series.priceToCoordinate(this.point.price);

    if (x1 === null || x2 === null || y === null) {
      return [];
    }

    return [
      new HorizontalLinePaneView({
        x1,
        x2,
        y,
      }),
    ];
  }

  /*
   * ==========================================
   * UPDATE
   * ==========================================
   *
   * Horizontal Line is a one-point drawing.
   * The price determines the Y position.
   * The line extends across the chart.
   */

  update(_start, end) {
    this.point = end;

    this._requestUpdate?.();
  }
}
