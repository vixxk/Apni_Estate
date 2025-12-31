import React from "react";
import { motion } from "framer-motion";
import tsLogo from "../assets/tsLogo.jpg";

const TripuraStartup = () => {
  return (
    <div className="py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {/* Modern Badge Card */}
          <div className="relative group">
            {/* Subtle gradient glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>

            {/* Main Card */}
            <div
              className="relative flex items-center gap-4 md:gap-5 px-4 py-3 md:px-5 md:py-3.5 rounded-2xl
              bg-white/80 backdrop-blur-xl 
              border border-gray-200/60 
              shadow-sm hover:shadow-md 
              transition-all duration-300"
            >
              {/* Logo - No border/box, just the image */}
              <div className="flex-shrink-0">
                <img
                  src={tsLogo}
                  alt="Tripura Startup"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain
    scale-125 md:scale-130
    group-hover:scale-140
    transition-transform duration-300"
                />
              </div>

              {/* Divider Line */}
              <div className="h-12 md:h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              {/* Text Content */}
              <div className="pr-2">
                <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                  Registered Startup For
                </p>
                <h3 className="text-sm md:text-base lg:text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Startup Tripura
                </h3>
              </div>

              {/* Corner Accent - Top Right */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-60"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripuraStartup;
