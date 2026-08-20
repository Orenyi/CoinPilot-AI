class HorizontalLineRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { y, width } = this.source;

    if (y === null || y === undefined) {
      return;
    }

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const horizontalPixelRatio = scope.horizontalPixelRatio;
      const verticalPixelRatio = scope.verticalPixelRatio;

      const lineY = y * verticalPixelRatio;

      const startX = 0;
      const endX = width * horizontalPixelRatio;

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(startX, lineY);
      ctx.lineTo(endX, lineY);

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2 * horizontalPixelRatio;

      ctx.stroke();

      // Left endpoint
      ctx.fillStyle = "#06b6d4";

      ctx.beginPath();

      ctx.arc(
        6 * horizontalPixelRatio,
        lineY,
        4 * horizontalPixelRatio,
        0,
        Math.PI * 2,
      );

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

    const y = this._series.priceToCoordinate(this.point.price);

    if (y === null) {
      return [];
    }

    return [
      new HorizontalLinePaneView({
        y,
        width: this._chart.width(),
      }),
    ];
  }

  update(_start, end) {
    this.point = end;

    this._requestUpdate?.();
  }
}
