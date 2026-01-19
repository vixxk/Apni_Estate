import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Award, Shield, Star, Users } from "lucide-react";
import { features } from "../assets/featuredata";
import { useNavigate } from "react-router-dom";


// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  },
};

const statsItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const floatingAnimation = {
  y: [-3, 3, -3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const Features = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    { icon: Users, value: "20+", label: "Trusted Partners" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Award, value: "5K+", label: "Properties Listed" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];

  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Trusted By Section (New) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 md:mb-32 text-center"
        >
          <motion.div
            variants={statsItemVariants}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6"
          >
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            Trusted Worldwide
          </motion.div>

          <motion.h2
            variants={statsItemVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4"
          >
            Trusted by{" "}
            <span className="text-blue-700">
              Industry Leaders
            </span>
          </motion.h2>

          <motion.p
            variants={statsItemVariants}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 md:mb-16"
          >
            Join thousands of successful companies that rely on our platform for
            their real estate needs
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statsItemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs md:text-sm font-semibold tracking-wide mb-4 md:mb-6 shadow-lg border border-blue-200/50"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            OUR PREMIUM FEATURES
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
            Why Choose{' '}
            <span className="text-blue-700">
              ApniEstate?
            </span>
          </h2>

          <div className="flex justify-center mb-6 md:mb-8">
            <motion.div
              className="w-24 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-lg"
              animate={pulseAnimation}
            ></motion.div>
          </div>

          <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience unparalleled service with our innovative approach to finding your{' '}
            <span className="text-blue-600 font-semibold">perfect home</span>
          </p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12 text-xs md:text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span className="font-medium">Award Winning Service</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              <span className="font-medium">98% Success Rate</span>
            </div> */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Trusted by 10K+ Families</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{
                y: -15,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

              <div className="relative bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 hover:border-blue-200/50 transition-all duration-500 h-full">
                {/* Icon with Styling */}
                <motion.div
                  className="relative w-16 h-16 md:w-20 md:h-20 mb-6 md:mb-8"
                  animate={hoveredCard === index ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-30"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 group-hover:border-blue-300 transition-all duration-300">
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300" />
                  </div>

                  {/* Floating elements */}
                  <AnimatePresence>
                    {hoveredCard === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                      >
                        <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-sm">
                  {feature.description}
                </p>

                {/* Number indicator */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 w-7 h-7 md:w-8 md:h-8 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-all duration-300">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-12 md:mt-20"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-2xl">
            <motion.div
              animate={floatingAnimation}
              className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              Ready to Find Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dream Home?
              </span>
            </h3>

            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who found their perfect home with our premium features and personalized service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                onClick={() => {
                  navigate("/properties");
                  window.scrollTo(0, 0);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl md:rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all text-base md:text-lg inline-flex items-center group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Browse Properties
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200"
            >
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">10,000+ Happy Families</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">5-Star Average Rating</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="font-medium">24/7 Premium Support</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
