import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Grid3x3,
    Home,
    Building2,
    Store,
    Package,
    Wrench,
} from "lucide-react";

const CategoryStats = ({
    categoryStats,
    categoryFilter,
    setCategoryFilter,
    totalCategoryCount,
}) => {
    if (!categoryStats) return null;

    const categoryIcons = {
        house: Home,
        apartment: Building2,
        villa: Home,
        commercial: Store,
        sell: Store,
        vastu: Home,
        "home loan": Building2,
        furniture: Package,
        "construction services": Wrench,
        others: Package,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-3 mb-4"
        >
            <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-bold text-white">Filter by Category</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {/* All Categories Button */}
                <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategoryFilter("all")}
                    className={`backdrop-blur-sm border-2 rounded-lg p-2 text-center transition-all ${categoryFilter === "all"
                        ? "bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/50"
                        : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50"
                        }`}
                >
                    <Grid3x3 className="w-4 h-4 text-blue-300 mx-auto mb-0.5" />
                    <div className="text-base sm:text-lg font-bold text-white">
                        {totalCategoryCount}
                    </div>
                    <p className="text-blue-200 text-[9px] sm:text-[10px] font-medium">
                        All Types
                    </p>
                </motion.button>

                {/* Individual Category Buttons */}
                {Object.entries(categoryStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => {
                        const Icon = categoryIcons[category.toLowerCase()] || Package;
                        return (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCategoryFilter(category)}
                                className={`backdrop-blur-sm border-2 rounded-lg p-2 text-center transition-all ${categoryFilter === category
                                    ? "bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/50"
                                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4 text-blue-300 mx-auto mb-0.5" />
                                <div className="text-base sm:text-lg font-bold text-white">
                                    {count}
                                </div>
                                <p className="text-blue-200 text-[9px] sm:text-[10px] capitalize truncate font-medium">
                                    {category}
                                </p>
                            </motion.button>
                        );
                    })}
            </div>
        </motion.div>
    );
};

export default CategoryStats;
