import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";
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

  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50"></div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-semibold tracking-wide mb-4 md:mb-6 shadow-sm border border-blue-200/50"
          >
            OUR PREMIUM FEATURES
          </motion.div>


          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-700 mb-4 md:mb-6 leading-tight">
            Why Choose{' '}
            <span className="text-blue-900">
              ApniEstate ?
            </span>
          </h2>


          <div className="flex justify-center mb-6 md:mb-8">
            <motion.div
              className="w-24 md:w-32 h-1 md:h-1.5 bg-blue-600 rounded-full shadow-lg"
            ></motion.div>
          </div>


          <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience unparalleled service with our innovative approach to finding your{' '}
            <span className="text-blue-700 font-semibold">perfect home</span>
          </p>


          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12 text-xs md:text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="font-medium">Award Winning Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >


              <div className="relative bg-white border border-gray-100 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:shadow-lg transition-all duration-300 h-full">
                {/* Icon with Styling */}
                <div
                  className="relative w-16 h-16 md:w-20 md:h-20 mb-6 md:mb-8"
                >
                  <div className="relative w-full h-full bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 group-hover:border-blue-200 transition-all duration-300">
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                </div>


                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>


                <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-sm">
                  {feature.description}
                </p>


                {/* Number indicator */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 w-7 h-7 md:w-8 md:h-8 bg-gray-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-all duration-300">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-12 md:mt-20"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-lg border border-blue-50">
            <div
              className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>


            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
              Ready to Find Your{' '}
              <span className="text-blue-900">
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl md:rounded-2xl shadow-lg transition-all text-base md:text-lg inline-flex items-center"
              >
                <span className="relative z-10 flex items-center">
                  Browse Properties
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </span>
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
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">10,000+ Happy Families</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">5-Star Average Rating</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
