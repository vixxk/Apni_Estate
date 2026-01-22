import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ComingSoonPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center">
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
            className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-200 blur-3xl"
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [0, -30, 0, 30, 0],
              scale: [1, 1.1, 1, 0.9, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-200 blur-3xl"
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
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xl shadow-blue-100 mb-6 sm:mb-8"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 leading-tight">
            Coming <span className="text-blue-600">Soon</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto px-4">
            We're crafting something extraordinary. This feature is under active
            development and will be available soon.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-16">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold border border-blue-200">
              🤖 AI-Powered
            </span>
            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border border-indigo-200">
              ⚡ Lightning Fast
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold border border-purple-200">
              🎯 Highly Accurate
            </span>
          </div>

          {/* Development Progress */}
          <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-white shadow-lg shadow-blue-50 border border-blue-100 mb-8 sm:mb-12">
            <h3 className="text-slate-800 font-bold text-lg sm:text-xl mb-6">
              Development Progress
            </h3>
            <div className="space-y-6">
              {/* Design - 50% */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-600">Design</span>
                  <span className="text-emerald-600">50%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Development - 50% */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-600">Development</span>
                  <span className="text-blue-600">50%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Usefulness - 100% */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-600">Usefulness</span>
                  <span className="text-amber-500">100%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Explore Button */}
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explore Other Features
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
