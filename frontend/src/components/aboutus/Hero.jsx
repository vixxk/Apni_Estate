import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="mt-16">
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
            animate={{
              background: [
                "linear-gradient(to bottom right, rgba(37, 99, 235, 1), rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8))",
                "linear-gradient(to bottom right, rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1))",
                "linear-gradient(to bottom right, rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1), rgba(79, 70, 229, 1))",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Animated shapes */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-300"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                scale: [1, 1.1, 1, 0.9, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-300"
              animate={{
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
                scale: [1, 0.9, 1, 1.1, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-purple-300"
              animate={{
                x: [0, 50, 0, -50, 0],
                y: [0, -50, 0, 50, 0],
                scale: [1, 1.2, 1, 0.8, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Ik01IDEwQzMuODk1IDEwIDMgMTAuODk1IDMgMTJ2MzhjMCAxLjEwNS44OTUgMiAyIDJoMzh2LWE0MlMwIDEwIDV6bTM4LTJINUM2IC44MTAgMSA5LjgxIDEgMTJ2MzhjMCAyLjE5IDEuNzkgNCA0IDRoNDFjMS4xMDUgMCAyLS44OTUgMi0yVjEwYzAtMS4xMDUtLjg5NS0yLTItMmgtM3oiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative text-center text-white px-4 max-w-4xl mx-auto z-10"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 leading-tight">
            About <span className="text-yellow-300">ApniEstate</span>
          </h1>

          {/* Recognised By Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-sm sm:text-base text-gray-200">
              Recognised by the <span className="font-semibold text-white">Directorate of Information Technology,</span>
              <br />
              <span className="font-semibold text-white">Government of Tripura.</span>
            </p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className="w-24 h-1 bg-white mx-auto mb-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />

          <p className="text-xl md:text-2xl leading-relaxed font-light">
            ApniEstate is your trusted partner for finding verified homes and
            investment properties/services across India, with clear details and a smooth,
            modern experience.
          </p>

          {/* Decorative line */}
          <motion.div
            className="w-24 h-1 bg-white mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
