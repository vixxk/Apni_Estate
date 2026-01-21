import React from "react";
import { motion } from "framer-motion";

const TabNavigation = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
            <button
                onClick={() => setActiveTab("properties")}
                className={`pb-2 px-1 text-sm font-medium transition-all relative ${activeTab === "properties"
                    ? "text-blue-400"
                    : "text-white/60 hover:text-white"
                    }`}
            >
                Properties Management
                {activeTab === "properties" && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"
                    />
                )}
            </button>
            <button
                onClick={() => setActiveTab("sponsors")}
                className={`pb-2 px-1 text-sm font-medium transition-all relative ${activeTab === "sponsors"
                    ? "text-indigo-400"
                    : "text-white/60 hover:text-white"
                    }`}
            >
                Brands (CMS)
                {activeTab === "sponsors" && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
                    />
                )}
            </button>
            <button
                onClick={() => setActiveTab("testimonials")}
                className={`pb-2 px-1 text-sm font-medium transition-all relative ${activeTab === "testimonials"
                    ? "text-green-400"
                    : "text-white/60 hover:text-white"
                    }`}
            >
                Client Reviews
                {activeTab === "testimonials" && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full"
                    />
                )}
            </button>
        </div>
    );
};

export default TabNavigation;
