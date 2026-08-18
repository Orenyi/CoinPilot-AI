class FibonacciRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { x1, y1, x2, y2, extension } = this.source;

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

      const levels = extension
        ? [
            { value: 0, label: "0%" },
            { value: 0.382, label: "38.2%" },
            { value: 0.5, label: "50%" },
            { value: 0.618, label: "61.8%" },
            { value: 1, label: "100%" },
            { value: 1.272, label: "127.2%" },
            { value: 1.618, label: "161.8%" },
            { value: 2.618, label: "261.8%" },
          ]
        : [
            { value: 0, label: "0%" },
            { value: 0.236, label: "23.6%" },
            { value: 0.382, label: "38.2%" },
            { value: 0.5, label: "50%" },
            { value: 0.618, label: "61.8%" },
            { value: 0.786, label: "78.6%" },
            { value: 1, label: "100%" },
          ];

      const priceDistance = endY - startY;

      ctx.save();

      // Anchor line
      ctx.strokeStyle = "rgba(139,92,246,0.45)";
      ctx.lineWidth = 1 * horizontalPixelRatio;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Fibonacci levels
      levels.forEach((level) => {
        const y = startY + priceDistance * level.value;

        ctx.beginPath();

        ctx.moveTo(Math.min(startX, endX), y);

        ctx.lineTo(Math.max(startX, endX), y);

        ctx.strokeStyle =
          level.value === 0 || level.value === 1
            ? "rgba(139,92,246,0.8)"
            : "rgba(139,92,246,0.45)";

        ctx.lineWidth = 1 * horizontalPixelRatio;

        ctx.setLineDash(
          level.value === 0 || level.value === 1
            ? []
            : [4 * horizontalPixelRatio, 4 * horizontalPixelRatio],
        );

        ctx.stroke();

        ctx.setLineDash([]);

        // Level label
        ctx.font = `${9 * horizontalPixelRatio}px Poppins, sans-serif`;

        ctx.fillStyle = "#8b5cf6";

        ctx.fillText(
          level.label,
          Math.max(startX, endX) + 6 * horizontalPixelRatio,
          y - 4 * verticalPixelRatio,
        );
      });

      // Endpoints
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

class FibonacciPaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new FibonacciRenderer(this.source);
  }
}

export class FibonacciPrimitive {
  constructor(start, end, extension = false) {
    this.start = start;
    this.end = end;
    this.extension = extension;

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
      new FibonacciPaneView({
        x1,
        y1,
        x2,
        y2,
        extension: this.extension,
      }),
    ];
  }

  update(start, end) {
    this.start = start;
    this.end = end;

    this._requestUpdate?.();
  }
}
