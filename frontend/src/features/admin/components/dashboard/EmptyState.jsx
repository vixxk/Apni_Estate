import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const EmptyState = ({
    searchQuery,
    categoryFilter,
    statusFilter,
    clearFilters,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center"
        >
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
            <p className="text-blue-200 text-sm mb-4">
                {searchQuery
                    ? "No properties match your search criteria."
                    : `No ${categoryFilter !== "all" ? categoryFilter : ""} properties with ${statusFilter} status.`}
            </p>
            <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
                Clear All Filters
            </button>
        </motion.div>
    );
};

export default EmptyState;
