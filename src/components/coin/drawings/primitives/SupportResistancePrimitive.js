class SupportResistanceRenderer {
  constructor(source) {
    this.source = source;
  }

  draw(target) {
    const { top, bottom, width, label, color } = this.source;

    if (
      top === null ||
      top === undefined ||
      bottom === null ||
      bottom === undefined
    ) {
      return;
    }

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;

      const horizontalPixelRatio = scope.horizontalPixelRatio;
      const verticalPixelRatio = scope.verticalPixelRatio;

      const topY = top * verticalPixelRatio;
      const bottomY = bottom * verticalPixelRatio;

      const chartWidth = width * horizontalPixelRatio;

      const zoneTop = Math.min(topY, bottomY);
      const zoneBottom = Math.max(topY, bottomY);
      const zoneHeight = zoneBottom - zoneTop;

      ctx.save();

      // ==========================================
      // PRICE ZONE
      // ==========================================

      ctx.fillStyle =
        color === "support" ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)";

      ctx.fillRect(0, zoneTop, chartWidth, zoneHeight);

      // ==========================================
      // TOP BORDER
      // ==========================================

      ctx.beginPath();

      ctx.moveTo(0, zoneTop);
      ctx.lineTo(chartWidth, zoneTop);

      ctx.strokeStyle =
        color === "support" ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.75)";

      ctx.lineWidth = 1.5 * horizontalPixelRatio;

      ctx.stroke();

      // ==========================================
      // BOTTOM BORDER
      // ==========================================

      ctx.beginPath();

      ctx.moveTo(0, zoneBottom);
      ctx.lineTo(chartWidth, zoneBottom);

      ctx.stroke();

      // ==========================================
      // LABEL
      // ==========================================

      ctx.font = `${10 * horizontalPixelRatio}px Poppins, sans-serif`;

      ctx.fillStyle = color === "support" ? "#22c55e" : "#ef4444";

      ctx.fillText(
        label,
        8 * horizontalPixelRatio,
        zoneTop + 14 * verticalPixelRatio,
      );

      ctx.restore();
    });
  }
}

class SupportResistancePaneView {
  constructor(source) {
    this.source = source;
  }

  zOrder() {
    return "top";
  }

  renderer() {
    return new SupportResistanceRenderer(this.source);
  }
}

export class SupportResistancePrimitive {
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

    const top = this._series.priceToCoordinate(
      Math.max(this.start.price, this.end.price),
    );

    const bottom = this._series.priceToCoordinate(
      Math.min(this.start.price, this.end.price),
    );

    if (top === null || bottom === null) {
      return [];
    }

    const isSupport = this.end.price >= this.start.price;

    return [
      new SupportResistancePaneView({
        top,
        bottom,
        width: this._chart.width(),
        label: isSupport ? "Support" : "Resistance",
        color: isSupport ? "support" : "resistance",
      }),
    ];
  }

  update(start, end) {
    this.start = start;
    this.end = end;

    this._requestUpdate?.();
  }
}
