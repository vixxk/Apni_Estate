import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div>
      <div className="relative min-h-[40vh] py-12 flex items-center justify-center overflow-hidden bg-gray-50">
        {/* Animated gradient background - Lighter theme */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            animate={{
              background: [
                "linear-gradient(to bottom right, rgba(239, 246, 255, 1), rgba(238, 242, 255, 1), rgba(250, 245, 255, 1))",
                "linear-gradient(to bottom right, rgba(238, 242, 255, 1), rgba(250, 245, 255, 1), rgba(239, 246, 255, 1))",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Animated shapes - Subtler colors */}
          <div className="absolute inset-0 opacity-40">
            <motion.div
              className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-200 blur-3xl"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                scale: [1, 1.1, 1, 0.9, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-indigo-200 blur-3xl"
              animate={{
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
                scale: [1, 0.9, 1, 1.1, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-center px-4 max-w-4xl mx-auto z-10"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-blue-900">
            About <span className="text-blue-600">ApniEstate</span>
          </h1>

          {/* Recognised By Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold">
              Recognised by the Directorate of Information Technology,
              <br />
              Government of Tripura
            </p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 64, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />

          <p className="text-base sm:text-xl md:text-2xl leading-relaxed font-light text-gray-700 max-w-2xl mx-auto">
            ApniEstate is your trusted partner for finding verified homes and
            investment properties across India, with clear details and a smooth,
            modern experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
