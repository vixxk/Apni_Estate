import React from "react";
import { motion } from "framer-motion";
import { Shield, LogOut } from "lucide-react";

const DashboardHeader = ({ handleLogout }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 mb-6 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5" />
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                    >
                        <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-blue-200/80 hidden sm:block">
                            Property Management System
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/30 text-sm backdrop-blur-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardHeader;
