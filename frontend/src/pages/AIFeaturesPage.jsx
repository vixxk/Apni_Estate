import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({
  title,
  description,
  icon,
  gradient,
  link,
  available,
  index
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (available) {
      navigate(link);
    } else {
      navigate("/coming-soon");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "slideUp 0.6s ease-out forwards",
      }}
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
          {/* Icon Container */}
          <div
            className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            {icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-white transition-colors duration-300 leading-tight">
                {title}
              </h3>
              {available ? (
                <span className="flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-semibold group-hover:bg-white/20 group-hover:text-white transition-all duration-300 whitespace-nowrap">
                  Available
                </span>
              ) : (
                <span className="flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-semibold group-hover:bg-white/20 group-hover:text-white transition-all duration-300 whitespace-nowrap">
                  Soon
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed pr-6 sm:pr-0">
              {description}
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 flex-shrink-0 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  );
};

const AIFeaturesPage = () => {
  const features = [
    {
      title: "AI Home Loan Assistant",
      description:
        "An intelligent tool that evaluates loan eligibility, EMI options, and repayment scenarios based on user income, property value, and financial profile.",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      link: "/loan-analyzer",
      available: true,
    },
    {
      title: "AI Construction Budget Planner",
      description:
        "Provides accurate, location-based cost estimates for construction or renovation projects, helping users plan expenses and avoid cost overruns.",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
      link: "/coming-soon",
      available: false,
    },
    {
      title: "Vastu Shastra Helper",
      description:
        "Intelligent Vastu analysis tool that provides personalized recommendations for optimal energy flow, room placement, and directional alignment in your property.",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
      link: "/coming-soon",
      available: false,
    },
    {
      title: "AI Legal Property Guide",
      description:
        "Assists users in understanding property-related legal documents, approvals, and compliance requirements, reducing legal risks and confusion.",
      icon: (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
      link: "/coming-soon",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      {/* Header */}
      <div className="relative overflow-hidden bg-gray-50 py-8 sm:py-12 md:py-16">
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white shadow-lg shadow-blue-100 mb-4 sm:mb-6">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-700 mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            AI-Powered Property Tools
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Transform your property journey with cutting-edge artificial intelligence.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center px-2">
          <div className="inline-block p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 shadow-lg max-w-md">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                More Features Coming Soon
              </h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">
              We're constantly developing new AI tools to make your property
              experience seamless.
            </p>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AIFeaturesPage;
