import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Calculate construction cost estimation
// @route   POST /api/estimator/calculate
// @access  Public
export const calculateEstimation = asyncHandler(async (req, res) => {
  const {
    location,
    tier = 'Tier 2',
    plotSize,
    floors = 1,
    quality = 'Standard',
    inc_labor,
    inc_plumbing,
    inc_electrical,
    inc_waterproof,
    inc_architect,
  } = req.body;

  // --- 1. MARKET DATA ---
  const rates = {
    cement: { 'Tier 1': 415, 'Tier 2': 395, 'Tier 3': 385 },
    steel: { 'Tier 1': 72.5, 'Tier 2': 67.5, 'Tier 3': 65 },
    sand: { 'Tier 1': 55, 'Tier 2': 48, 'Tier 3': 42 },
    aggregate: { 'Tier 1': 50, 'Tier 2': 45, 'Tier 3': 42 },
    bricks: { 'Tier 1': 9, 'Tier 2': 8, 'Tier 3': 7 },
    flooring: 150,
    paint_liter: 250,
    door_main: 35000,
    door_internal: 10000,
    window_sqft: 650,
    labor: { 'Tier 1': 400, 'Tier 2': 350, 'Tier 3': 300 },
    plumbing: 120,
    electrical: 110,
    waterproofing: 32,
    architect: 60,
  };

  // --- 2. CONSUMPTION RULES ---
  const constants = {
    cement: 0.45,
    steel: 4.0,
    sand: 1.3,
    aggregate: 1.4,
    bricks: 7.5,
    paint: 0.045,
    flooring: 1.05,
    window_ratio: 0.12,
    door_ratio: 225,
  };

  const quality_multipliers = {
    Basic: 0.9,
    Standard: 1.0,
    Premium: 1.3,
  };

  // Default values and corrections
  const safePlotSize = parseFloat(plotSize) || 1000;
  const safeFloors = parseInt(floors) || 1;

  const coveragePercent = 1.0;
  const area = safePlotSize * coveragePercent * safeFloors;

  const qMult = quality_multipliers[quality] || 1.0;
  const currentTier = ['Tier 1', 'Tier 2', 'Tier 3'].includes(tier)
    ? tier
    : 'Tier 2';

  // Rate helper
  const getRate = (item) =>
    typeof rates[item] === 'object' ? rates[item][currentTier] : rates[item];

  // Materials
  const qty_cement = area * constants.cement;
  const cost_cement = qty_cement * getRate('cement');

  const qty_steel = area * constants.steel;
  const cost_steel = qty_steel * getRate('steel');

  const qty_sand = area * constants.sand;
  const cost_sand = qty_sand * getRate('sand');

  const qty_agg = area * constants.aggregate;
  const cost_agg = qty_agg * getRate('aggregate');

  const qty_bricks = area * constants.bricks;
  const cost_bricks = qty_bricks * getRate('bricks');

  // Finishing
  const qty_floor = area * constants.flooring;
  const cost_floor = qty_floor * rates.flooring * qMult;

  const qty_paint = area * constants.paint;
  const cost_paint = qty_paint * rates.paint_liter * qMult;

  const num_doors = Math.ceil(area / constants.door_ratio);
  const cost_doors =
    (rates.door_main + (num_doors - 1) * rates.door_internal) * qMult;

  const qty_window = area * constants.window_ratio;
  const cost_window = qty_window * rates.window_sqft * qMult;

  const total_material =
    cost_cement +
    cost_steel +
    cost_sand +
    cost_agg +
    cost_bricks +
    cost_floor +
    cost_paint +
    cost_doors +
    cost_window;

  // Services
  let services_total = 0;
  const service_breakdown = {};

  if (inc_labor) {
    const cost = area * getRate('labor');
    services_total += cost;
    service_breakdown['Civil Labor'] = cost;
  }
  if (inc_plumbing) {
    const cost = area * rates.plumbing;
    services_total += cost;
    service_breakdown['Plumbing'] = cost;
  }
  if (inc_electrical) {
    const cost = area * rates.electrical;
    services_total += cost;
    service_breakdown['Electrical'] = cost;
  }
  if (inc_waterproof) {
    const cost = area * rates.waterproofing;
    services_total += cost;
    service_breakdown['Waterproofing'] = cost;
  }
  if (inc_architect) {
    const cost = area * rates.architect;
    services_total += cost;
    service_breakdown['Architect'] = cost;
  }

  // Totals
  const subtotal = total_material + services_total;
  const gst = subtotal * 0.18;

  // contingency
  const cont_percent =
    currentTier === 'Tier 1' || quality === 'Premium' ? 0.1 : 0.05;
  const contingency = subtotal * cont_percent;

  const final_budget = subtotal + gst + contingency;
  const cost_sqft = final_budget / area;

  res.status(200).json({
    success: true,
    data: {
      materials: {
        Cement: { q: `${qty_cement.toFixed(0)} Bags`, c: cost_cement },
        Steel: { q: `${qty_steel.toFixed(0)} Kg`, c: cost_steel },
        Sand: { q: `${qty_sand.toFixed(0)} cft`, c: cost_sand },
        Aggregates: { q: `${qty_agg.toFixed(0)} cft`, c: cost_agg },
        Bricks: { q: `${qty_bricks.toFixed(0)} Pcs`, c: cost_bricks },
        Flooring: { q: `${qty_floor.toFixed(0)} sq.ft`, c: cost_floor },
        'Paint (Mat)': { q: `${qty_paint.toFixed(0)} Ltr`, c: cost_paint },
        'Doors/Windows': { q: 'Lump Sum', c: cost_doors + cost_window },
      },
      services: service_breakdown,
      total_material,
      total_services: services_total,
      gst,
      contingency,
      final_budget,
      cost_sqft,
      area,
    },
  });
});
