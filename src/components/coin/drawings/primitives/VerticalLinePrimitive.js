class VerticalLineRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { x, height } = this.source;

    if (x === null || x === undefined) {
      return;
    }

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const horizontalPixelRatio = scope.horizontalPixelRatio;
      const verticalPixelRatio = scope.verticalPixelRatio;

      const lineX = x * horizontalPixelRatio;
      const lineHeight = height * verticalPixelRatio;

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, lineHeight);

      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 1.5 * horizontalPixelRatio;

      ctx.setLineDash([6 * horizontalPixelRatio, 4 * horizontalPixelRatio]);

      ctx.stroke();

      ctx.setLineDash([]);

      ctx.fillStyle = "#8b5cf6";

      ctx.beginPath();

      ctx.arc(
        lineX,
        6 * verticalPixelRatio,
        4 * horizontalPixelRatio,
        0,
        Math.PI * 2,
      );

      ctx.fill();

      ctx.restore();
    });
  }
}

class VerticalLinePaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new VerticalLineRenderer(this.source);
  }
}

export class VerticalLinePrimitive {
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
    if (!this._chart || !this.point) {
      return [];
    }

    const x = this._chart.timeScale().timeToCoordinate(this.point.time);

    if (x === null || x === undefined) {
      return [];
    }

    return [
      new VerticalLinePaneView({
        x,
        height: this._chart.height(),
      }),
    ];
  }

  update(_start, end) {
    if (!end) {
      return;
    }

    this.point = end;

    this._requestUpdate?.();
  }
}
