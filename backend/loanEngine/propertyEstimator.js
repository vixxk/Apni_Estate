function computeBuiltUpArea(plotSizeSqft, floors) {
  return plotSizeSqft * floors;
}

function computeCostPerSqft(baseCostPerSqft, luxuryMultiplier, locationMultiplier) {
  return baseCostPerSqft * luxuryMultiplier * locationMultiplier;
}

function computeConstructionCost(builtUpArea, costPerSqft) {
  return builtUpArea * costPerSqft;
}

export function estimatePropertyCosts(propertyDetails, multipliers) {
  const { includePlot, plotPrice, plotSizeSqft, floors, baseCostPerSqft } = propertyDetails;
  const { luxuryMultiplier, locationMultiplier } = multipliers;

  const builtUpArea = computeBuiltUpArea(plotSizeSqft, floors);
  const costPerSqft = computeCostPerSqft(
    baseCostPerSqft,
    luxuryMultiplier,
    locationMultiplier
  );
  const constructionCost = computeConstructionCost(builtUpArea, costPerSqft);

  let propertyValue = constructionCost;
  let plotCost = 0;

  if (includePlot) {
    plotCost = plotPrice;
    propertyValue = plotPrice + constructionCost;
  }

  return {
    builtUpArea,
    costPerSqft,
    constructionCost,
    plotCost,
    propertyValue
  };
}
