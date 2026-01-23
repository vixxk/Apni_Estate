import React from "react";
import { motion } from "framer-motion";

const LoadingSplash = ({
    icon: Icon,
    title,
    subtitle,
    theme = "blue"
}) => {
    // Define theme colors map
    const themes = {
        blue: {
            gradient: "from-blue-500 to-indigo-600",
            shadow: "shadow-blue-500/30",
            dot1: "bg-blue-300",
            dot2: "bg-indigo-400",
            ping: "bg-blue-500/10",
            textGradient: "from-blue-600 to-indigo-600",
            barGradient: "from-blue-600 via-indigo-500 to-blue-600",
            dotColor: "bg-blue-600",
            textColor: "text-blue-600"
        },
        green: {
            gradient: "from-green-500 to-teal-600",
            shadow: "shadow-green-500/30",
            dot1: "bg-green-300",
            dot2: "bg-teal-400",
            ping: "bg-green-500/10",
            textGradient: "from-green-600 to-teal-600",
            barGradient: "from-green-600 via-teal-500 to-green-600",
            dotColor: "bg-green-600",
            textColor: "text-green-600"
        },
        purple: {
            gradient: "from-purple-500 to-pink-600",
            shadow: "shadow-purple-500/30",
            dot1: "bg-purple-300",
            dot2: "bg-pink-400",
            ping: "bg-purple-500/10",
            textGradient: "from-purple-600 to-pink-600",
            barGradient: "from-purple-600 via-pink-500 to-purple-600",
            dotColor: "bg-purple-600",
            textColor: "text-purple-600"
        }
    };

    const colors = themes[theme] || themes.blue;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <motion.div
                        className={`w-24 h-24 bg-gradient-to-r ${colors.gradient} rounded-2xl flex items-center justify-center relative shadow-lg ${colors.shadow}`}
                        animate={{
                            rotate: [0, 0, 360, 360, 0],
                            scale: [1, 0.9, 0.9, 1, 1],
                            borderRadius: ["16%", "50%", "50%", "16%", "16%"],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {Icon && <Icon className="w-12 h-12 text-white" />}
                    </motion.div>

                    <motion.div
                        className={`absolute w-3 h-3 ${colors.dot1} rounded-full right-4 bottom-10`}
                        animate={{
                            x: [0, 30, 0, -30, 0],
                            y: [-30, 0, 30, 0, -30],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    <motion.div
                        className={`absolute w-2 h-2 ${colors.dot2} rounded-full`}
                        animate={{
                            x: [0, -30, 0, 30, 0],
                            y: [30, 0, -30, 0, 30],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />

                    <div
                        className={`absolute inset-0 ${colors.ping} rounded-full animate-ping`}
                        style={{ animationDuration: "3s" }}
                    ></div>
                </div>

                <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>
                    {title}
                </h3>

                <p className="text-gray-600 mb-5 max-w-xs text-center">
                    {subtitle}
                </p>

                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                    <motion.div
                        className={`h-full bg-gradient-to-r ${colors.barGradient} bg-size-200 absolute top-0 left-0 right-0`}
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

                <div className={`flex items-center mt-4 text-xs ${colors.textColor}`}>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-1.5 h-1.5 ${colors.dotColor} rounded-full mr-2`}
                    />
                    <span>Curating the best listings for you</span>
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingSplash;
