import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative min-h-[35vh] md:min-h-[40vh] flex items-center justify-center my-4 md:my-6 mx-4 md:mx-6 rounded-2xl overflow-hidden bg-gray-50 py-8 md:py-12">
      {/* Animated gradient background - Lighter theme */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgba(239, 246, 255, 1), rgba(238, 242, 255, 1), rgba(250, 245, 255, 1))',
              'linear-gradient(to bottom right, rgba(238, 242, 255, 1), rgba(250, 245, 255, 1), rgba(239, 246, 255, 1))',
              'linear-gradient(to bottom right, rgba(250, 245, 255, 1), rgba(239, 246, 255, 1), rgba(238, 242, 255, 1))'
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated shapes */}
        <div className="absolute inset-0 opacity-40">
          <motion.div
            className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-200 blur-3xl"
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [0, -30, 0, 30, 0],
              scale: [1, 1.1, 1, 0.9, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-indigo-200 blur-3xl"
            animate={{
              x: [0, -40, 0, 40, 0],
              y: [0, 40, 0, -40, 0],
              scale: [1, 0.9, 1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative text-center px-4 max-w-4xl mx-auto z-10"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight text-blue-900">
          Get in Touch <span className="text-blue-600">With Us</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed font-light text-gray-700 max-w-2xl mx-auto">
          Have questions about our properties? Need assistance with finding your perfect home?
          Our team is here to help you every step of the way.
        </p>

        {/* Decorative line */}
        <motion.div
          className="w-16 h-1 bg-blue-600 mx-auto mt-6 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}