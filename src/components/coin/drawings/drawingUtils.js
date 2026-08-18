export const getDrawingPoint = (param, series) => {
  if (!param?.point || param.time === undefined || !series) {
    return null;
  }

  const price = series.coordinateToPrice(param.point.y);

  if (price === null || price === undefined) {
    return null;
  }

  return {
    time: param.time,
    price,
  };
};

export const isDrawingTool = (tool) => {
  return Boolean(tool);
};

export const requiresTwoPoints = (tool) => {
  return [
    "Trend Line",
    "Support / Resistance",
    "Fibonacci Retracement",
    "Fibonacci Extension",
    "Price Range",
  ].includes(tool);
};

export const requiresOnePoint = (tool) => {
  return ["Horizontal Line", "Vertical Line"].includes(tool);
};
