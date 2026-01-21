export const calculateVastu = async (req, res) => {
    try {
        const { facing, road, shape, bedrooms, toilets, puja, stairs } = req.body;

        // --- 1. VASTU KNOWLEDGE BASE ---
        const ideal_zones = {
            'Master Bedroom': ['South-West (Nairutya)', 'South'],
            'Kitchen': ['South-East (Agni)', 'North-West (Vayu)'],
            'Living Room': ['North', 'North-East', 'East'],
            'Kids Bedroom': ['West', 'North-West'],
            'Guest Room': ['North-West'],
            'Toilet': ['North-West', 'West', 'South'],
            'Puja Room': ['North-East (Ishanya)', 'North', 'East'],
            'Staircase': ['South', 'South-West', 'West'],
            'Main Entrance': [], // Dynamic based on road
            'Borewell/Water': ['North-East'],
            'Septic Tank': ['North-West']
        };

        const zone_details = {
            'North': { element: 'Water', color: 'Green', deity: 'Kubera (Wealth)' },
            'North-East': { element: 'Water', color: 'White/Light Blue', deity: 'Ishanya (Prosperity)' },
            'East': { element: 'Air/Wood', color: 'White', deity: 'Indra (Growth)' },
            'South-East': { element: 'Fire', color: 'Red/Orange', deity: 'Agni (Energy)' },
            'South': { element: 'Earth', color: 'Red/Yellow', deity: 'Yama (Stability)' },
            'South-West': { element: 'Earth', color: 'Beige/Brown', deity: 'Nairutya (Strength)' },
            'West': { element: 'Space/Metal', color: 'Blue/Grey', deity: 'Varuna (Gains)' },
            'North-West': { element: 'Air', color: 'White/Cream', deity: 'Vayu (Support)' },
            'Center': { element: 'Space', color: 'White/Gold', deity: 'Brahma (Creator)' }
        };

        // --- CALCULATION LOGIC ---
        let score = 100;
        let reasons = [];

        // 1. Orientation Score
        if (['North', 'East'].includes(facing)) {
            reasons.push("✅ Favorable Facing (North/East): Excellent for energy flow.");
        } else if (facing === 'South') {
            score -= 10;
            reasons.push("⚠️ South Facing: Requires strict Main Door placement (3rd/4th Pada).");
        } else {
            reasons.push("ℹ️ West Facing: Good for commercial/gains, strictly requires NW/Mid-West door.");
        }

        // 2. Shape Score
        if (shape === 'Regular') {
            reasons.push("✅ Regular Shape: 100% Stability.");
        } else if (shape === 'Gaumukhi') {
            reasons.push("✅ Gaumukhi: Good for Residential use.");
        } else if (shape === 'Shermukhi') {
            score -= 15;
            reasons.push("⚠️ Shermukhi: Better for Commercial, avoid for Residential.");
        } else {
            score -= 20;
            reasons.push("❌ Irregular Shape: Creates missing zones (Dosha). Needs Copper Helix remedy.");
        }

        // --- LAYOUT DETERMINATION ---
        let entrance = "";
        if (road === 'North') {
            entrance = "North-East (Positive) or North-Center (Mukhya)";
        } else if (road === 'East') {
            entrance = "East-North-East (Jayanta) or East-Center (Indra)";
        } else if (road === 'South') {
            entrance = "South-South-East (Pusha/Vitatha) - AVOID SW Corner!";
        } else { // West
            entrance = "West-North-West (Sugreev) or West-Center (Pushpadanta)";
        }

        const layout_plan = {
            'Main Entrance': entrance,
            'Master Bedroom': ideal_zones['Master Bedroom'][0],
            'Kitchen': ideal_zones['Kitchen'][0],
            'Puja Room': puja ? ideal_zones['Puja Room'][0] : "N/A",
            'Toilets': `Avoid NE/SW. Best in ${ideal_zones['Toilet'][0]}`,
            'Staircase': stairs ? ideal_zones['Staircase'][0] : "N/A"
        };

        if (bedrooms > 1) {
            layout_plan['Bedroom 2 (Kids)'] = ideal_zones['Kids Bedroom'][0];
        }
        if (bedrooms > 2) {
            layout_plan['Bedroom 3 (Guest)'] = ideal_zones['Guest Room'][0];
        }

        // --- RESPONSE ---
        res.status(200).json({
            success: true,
            data: {
                score,
                reasons,
                layout: layout_plan,
                zone_details, // Sending back for potential UI usage
                remedies: [
                    "If Kitchen is not in SE: Place a Green Marble under the gas stove.",
                    "If Toilet is in wrong zone: Use Vastu tape (Metal strip) around commode.",
                    "Entrance Defect: Hang a Swastik or Om symbol above the main door.",
                    "Irregular Shape: Buried Copper/Lead Helix at missing corners."
                ],
                brahmasthan: [
                    "Keep the exact center of the house empty and well-lit.",
                    "No pillars, staircase, or heavy furniture in the center."
                ]
            }
        });

    } catch (error) {
        console.error("Vastu Calculation Error:", error);
        res.status(500).json({ success: false, message: "Failed to calculate Vastu score" });
    }
};
