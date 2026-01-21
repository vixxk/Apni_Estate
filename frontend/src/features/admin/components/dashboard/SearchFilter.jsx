import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SearchFilter = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    categoryFilter,
    displayedCount,
}) => {
    return (
        <>
            {/* Active Filters Display */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-3 mb-4 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                <div className="flex flex-wrap items-center gap-2 relative z-10">
                    <span className="text-white/70 text-sm font-medium flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Search className="w-4 h-4" />
                        </motion.div>
                        Active Filters:
                    </span>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/50 rounded-lg text-white text-sm font-semibold capitalize shadow-lg"
                    >
                        Status: {statusFilter}
                    </motion.span>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg text-white text-sm font-semibold capitalize shadow-lg"
                    >
                        Category: {categoryFilter}
                    </motion.span>
                    <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/50 rounded-lg text-white text-sm font-semibold shadow-lg"
                    >
                        Showing: {displayedCount} properties
                    </motion.span>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 mb-4 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search properties by title..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/15 transition-all"
                    />
                </div>
            </motion.div>
        </>
    );
};

export default SearchFilter;
