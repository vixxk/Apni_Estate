import React from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon } from "lucide-react";

const LoadingState = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <motion.div
                        className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/30"
                        animate={{
                            rotate: [0, 0, 360, 360, 0],
                            scale: [1, 0.9, 0.9, 1, 1],
                            borderRadius: ["16%", "50%", "50%", "16%", "16%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <HomeIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </motion.div>

                    <motion.div
                        className="absolute w-3 h-3 bg-blue-300 rounded-full right-4 bottom-10"
                        animate={{
                            x: [0, 30, 0, -30, 0],
                            y: [-30, 0, 30, 0, -30],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div
                        className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                        animate={{
                            x: [0, -30, 0, 30, 0],
                            y: [30, 0, -30, 0, 30],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />

                    <div
                        className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"
                        style={{ animationDuration: "3s" }}
                    ></div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Loading Property
                </h3>

                <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xs text-center">
                    Fetching property details...
                </p>

                <div className="w-48 md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-size-200 absolute top-0 left-0 right-0"
                        animate={{
                            backgroundPosition: ["0% center", "100% center", "0% center"],
                        }}
                        style={{ backgroundSize: "200% 100%" }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>

                <div className="flex items-center mt-4 text-xs text-blue-600">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"
                    />
                    <span>Please wait while we load the details</span>
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingState;
