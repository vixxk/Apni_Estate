import React from "react";
import { motion } from "framer-motion";
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
} from "lucide-react";

const FilterStats = ({ stats, statusFilter, setStatusFilter }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-4">
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatusFilter("all")}
                className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 rounded-xl p-2.5 sm:p-3 shadow-lg transition-all text-left relative overflow-hidden group ${statusFilter === "all"
                    ? "border-blue-400 ring-2 ring-blue-400/40 bg-blue-500/20"
                    : "border-white/20 hover:border-blue-400/50"
                    }`}
            >
                {statusFilter === "all" && (
                    <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <div className="relative z-10">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                        {stats.totalProperties}
                    </div>
                    <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                        Total Services
                    </p>
                </div>
            </motion.button>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 10px 40px rgba(251, 146, 60, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatusFilter("pending")}
                className={`bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-2.5 sm:p-3 shadow-lg shadow-orange-500/30 transition-all text-left border-2 relative overflow-hidden group ${statusFilter === "pending"
                    ? "border-yellow-300 ring-2 ring-yellow-400/40 scale-105"
                    : "border-transparent hover:border-yellow-300/50"
                    }`}
            >
                {statusFilter === "pending" && (
                    <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                <div className="relative z-10">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                        {stats.pendingProperties}
                    </div>
                    <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                        Pending Review
                    </p>
                </div>
            </motion.button>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 10px 40px rgba(34, 197, 94, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatusFilter("approved")}
                className={`bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2.5 sm:p-3 shadow-lg shadow-green-500/30 transition-all text-left border-2 relative overflow-hidden group ${statusFilter === "approved"
                    ? "border-green-300 ring-2 ring-green-400/40 scale-105"
                    : "border-transparent hover:border-green-300/50"
                    }`}
            >
                {statusFilter === "approved" && (
                    <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                <div className="relative z-10">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                        {stats.approvedProperties}
                    </div>
                    <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                        Approved
                    </p>
                </div>
            </motion.button>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: "0 10px 40px rgba(239, 68, 68, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatusFilter("rejected")}
                className={`bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-2.5 sm:p-3 shadow-lg shadow-red-500/30 transition-all text-left border-2 relative overflow-hidden group ${statusFilter === "rejected"
                    ? "border-red-300 ring-2 ring-red-400/40 scale-105"
                    : "border-transparent hover:border-red-300/50"
                    }`}
            >
                {statusFilter === "rejected" && (
                    <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                <div className="relative z-10">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                        {stats.rejectedProperties}
                    </div>
                    <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                        Rejected
                    </p>
                </div>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2.5 sm:p-3 shadow-lg shadow-purple-500/30 col-span-2 sm:col-span-1 relative overflow-hidden group"
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1 group-hover:scale-110 transition-transform" />
                    <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                        {stats.todaySubmissions}
                    </div>
                    <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                        Today's Submissions
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default FilterStats;
