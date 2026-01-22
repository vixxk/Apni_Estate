export const calculateVastu = async (req, res) => {
    try {
        const {
            facing,
            road,
            shape,
            bedrooms,
            toilets,
            puja,
            stairs,
            // New Inputs
            plotArea,
            soilType,
            slopeDirection,
            surroundings = [] // Array of strings e.g., ['Temple nearby', 'Water body in North']
        } = req.body;

        // --- 1. VASTU KNOWLEDGE BASE & ZONES ---
        const ideal_zones = {
            'Master Bedroom': ['South-West (Nairutya)', 'South'],
            'Kitchen': ['South-East (Agni)', 'North-West (Vayu)'],
            'Living Room': ['North', 'North-East', 'East'],
            'Kids Bedroom': ['West', 'North-West'],
            'Guest Room': ['North-West'],
            'Toilet': ['North-West', 'West', 'South'],
            'Puja Room': ['North-East (Ishanya)', 'North', 'East'],
            'Staircase': ['South', 'South-West', 'West'],
            'Main Entrance': [], // Dynamic
            'Borewell/Water': ['North-East'],
            'Septic Tank': ['North-West', 'West']
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

        // --- CALCULATION LOGIC & DETAILED ANALYSIS ---
        let score = 100;
        let detailedAnalysis = [];

        // Helper to add analysis
        const addAnalysis = (category, observation, status, description, impact, remedy) => {
            detailedAnalysis.push({
                category,
                observation,
                status, // 'positive', 'neutral', 'negative'
                description,
                impact,
                remedy
            });
        };

        // 1. Orientation Analysis
        if (['North', 'East'].includes(facing)) {
            addAnalysis(
                "Plot Orientation",
                `${facing} Facing`,
                "positive",
                "North and East facing plots allow positive solar and magnetic energies to enter the home.",
                "Promotes health, wealth, and overall prosperity for the inhabitants.",
                null
            );
        } else if (facing === 'South') {
            score -= 10;
            addAnalysis(
                "Plot Orientation",
                "South Facing",
                "negative",
                "South facing plots are ruled by Yama and can bring strong energies that need managing.",
                "If not balanced, it may lead to health issues for women or financial instability.",
                "Place a silver Swastik or Panchmukhi Hanuman image above the main door. Ensure the entrance is in the 4th Pada (positive zone)."
            );
        } else if (facing === 'West') {
            addAnalysis(
                "Plot Orientation",
                "West Facing",
                "neutral",
                "West facing plots are ruled by Varuna and are good for business/commercial success.",
                "Can bring material gains but might lead to less social interaction.",
                "Ensure the main door is in the North-West or West-Central zone (Sugreev/Pushpadanta)."
            );
        } else {
             // Fallback for other cardinal directions if any
             addAnalysis("Plot Orientation", `${facing} Facing`, "neutral", "Standard orientation.", "Neutral impact.", null);
        }

        // 2. Shape Analysis
        if (shape === 'Regular') {
            addAnalysis(
                "Plot Shape",
                "Regular (Square/Rectangular)",
                "positive",
                "A regular shape ensures all elemental zones are balanced significantly.",
                "Provides stability, mental peace, and financial growth.",
                null
            );
        } else if (shape === 'Gaumukhi') {
            addAnalysis(
                "Plot Shape",
                "Gaumukhi (Cow Face)",
                "positive",
                "Narrow at front, broad at back. Considered very auspicious for residential use.",
                "Accumulates wealth and brings good fortune to the residents.",
                null
            );
        } else if (shape === 'Shermukhi') {
            score -= 15;
            addAnalysis(
                "Plot Shape",
                "Shermukhi (Lion Face)",
                "neutral",
                "Broad at front, narrow at back. Excellent for commercial but aggressive for homes.",
                "May lead to high expenses or aggressive behavior if used for residence.",
                "Use mirrors or plants to visually correct the narrowing back. Ideally, use for business."
            );
        } else {
            score -= 20;
            addAnalysis(
                "Plot Shape",
                "Irregular",
                "negative",
                "Irregular shapes often result in cut or extended corners, causing 'Vastu Dosha'.",
                "Can lead to health problems, legal issues, or financial losses depending on the missing corner.",
                "Install Vastu Pyramids or Copper Helix in the missing zones to balance energy."
            );
        }

        // 3. Slope Analysis
        if (slopeDirection) {
            if (['North', 'East', 'North-East'].includes(slopeDirection)) {
                addAnalysis(
                    "Land Slope",
                    `Slope towards ${slopeDirection}`,
                    "positive",
                    "Slope towards North/East allows heavy negative energy to flow out and light positive energy to settle.",
                    "Enhances wealth accumulation and health.",
                    null
                );
            } else if (['South', 'West', 'South-West'].includes(slopeDirection)) {
                score -= 15;
                addAnalysis(
                    "Land Slope",
                    `Slope towards ${slopeDirection}`,
                    "negative",
                    "Slope towards South/West traps negative energy and drains positive energy.",
                    "May cause financial drainage, health issues, or lack of recognition.",
                    "Raise the floor level in the South/West or place heavy rocks/statues in that corner to block energy drainage."
                );
            } else if (slopeDirection === 'unknown') {
                score -= 5;
                addAnalysis(
                    "Land Slope",
                    "Unknown Slope Direction",
                    "neutral",
                    "Slope direction not specified. Slope plays a crucial role in energy flow.",
                    "Unable to determine impact. Incorrect slope can lead to energy drainage.",
                    "Verify the slope physically. North/East slope is auspicious; South/West slope needs correction."
                );
            } else {
                 addAnalysis("Land Slope", `Slope towards ${slopeDirection}`, "neutral", "Neutral slope.", "Minimal impact.", null);
            }
        }

        // 4. Soil Analysis
        if (soilType) {
            if (['White', 'Yellow', 'Red'].includes(soilType)) {
                addAnalysis(
                    "Soil Quality",
                    `${soilType} Soil`,
                    "positive",
                    "Good quality soil (White/Yellow/Red) with pleasant smell represents abundance.",
                    "Provides a strong foundation for happiness and prosperity.",
                    null
                );
            } else if (['Black', 'Rocky', 'Mixed'].includes(soilType)) {
                score -= 5;
                addAnalysis(
                    "Soil Quality",
                    `${soilType} Soil`,
                    "negative",
                    "Black, Rocky, or Swampy soil is considered tampering or weak.",
                    "May lead to delays in construction or instability in life.",
                    "Perform 'Bhu-Shuddhi' (Earth Purification) ritual before construction. Replace topsoil if possible."
                );
            } else if (soilType === 'unknown') {
                score -= 5;
                addAnalysis(
                    "Soil Quality",
                    "Unknown Soil Type",
                    "neutral",
                    "Soil type not specified. Quality of soil affects the foundation's energy.",
                    "Unable to assess stability. Poor soil can affect longevity of construction.",
                    "Get a soil test done. Remove any debris, bones, or coal from the site before building."
                );
            }
        }

        // 5. Surroundings Analysis
        if (surroundings && surroundings.length > 0) {
            surroundings.forEach(item => {
                if (item.includes('Temple')) {
                    score -= 5;
                    addAnalysis(
                        "Surroundings",
                        "Temple Nearby",
                        "negative",
                        "Temple shadows falling on the house are inauspicious. Temples have high concentrated energy.",
                        "Can cause peace of mind issues or energetic disturbances.",
                        "Install a Pakua Mirror facing the temple to reflect the energy back."
                    );
                }
                if (item.includes('Water Body')) {
                    if (item.includes('North') || item.includes('East')) {
                        addAnalysis(
                            "Surroundings",
                            "Water Body in North/East",
                            "positive",
                            "Water element in the proper zone (NE/N) is highly beneficial.",
                            "Significantly boosts wealth and career opportunities.",
                            null
                        );
                    } else {
                        score -= 10;
                        addAnalysis(
                            "Surroundings",
                            "Water Body in South/West",
                            "negative",
                            "Water in Earth zones (SW) or Fire/Air zones causes elemental conflict.",
                            "Can lead to health issues or financial instability.",
                            "Build a high boundary wall or plant tall trees between the house and the water body."
                        );
                    }
                }
                if (item.includes('High Tension') || item.includes('Transformer')) {
                    score -= 15;
                    addAnalysis(
                        "Surroundings",
                        "High Tension Wire/Transformer",
                        "negative",
                        "Creates strong electromagnetic stress fields.",
                        "Harmful for physical health and causes mental stress.",
                        "Use energy neutralizing crystals (like Tourmaline) or lead strips near the affected wall."
                    );
                }
                 if (item.includes('T-Junction')) {
                    score -= 15; // Vithi Shoola
                    addAnalysis(
                        "Surroundings",
                        "T-Junction (Vithi Shoola)",
                        "negative",
                        "A road hitting the plot directly acts like an arrow of energy.",
                        "Can cause accidents or sudden losses if hitting the wrong zone.",
                        "Install a Bagua Mirror or a convex mirror facing the road."
                    );
                }
            });
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

        // Cap score
        score = Math.max(0, Math.min(100, score));

        // --- RESPONSE ---
        res.status(200).json({
            success: true,
            data: {
                score,
                detailedAnalysis, // Replaces simple reasons/remedies arrays
                layout: layout_plan,
                zone_details,
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
