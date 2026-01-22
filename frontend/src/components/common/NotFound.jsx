import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};


const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};


const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};





const glowAnimation = {
  boxShadow: [
    "0 0 40px rgba(59, 130, 246, 0.3)",
    "0 0 80px rgba(59, 130, 246, 0.5)",
    "0 0 40px rgba(59, 130, 246, 0.3)"
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};


export default function NotFoundPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };


    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const suggestions = [
    { icon: Home, text: "Browse Properties", path: "/properties" },
    { icon: Search, text: "Search Listings", path: "/everything" },
    // { icon: MapPin, text: "Explore Areas", path: "/locations" },
    // { icon: Shield, text: "Learn About Us", path: "/about" }
  ];


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>


      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed pointer-events-none z-10 w-32 h-32 rounded-full opacity-20 hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />


      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20 md:py-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto w-full"
        >
          {/* Animated 404 */}
          <motion.div className="relative mb-8 md:mb-12">
            <motion.div
              variants={itemVariants}
              animate={glowAnimation}
              className="text-7xl sm:text-8xl md:text-9xl font-black mb-4 relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              404
            </motion.div>


          </motion.div>


          {/* Error Message */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-blue-700">
              Oops! Page Not Found
            </h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed text-gray-600"
              animate={floatingAnimation}
            >
              The page you're looking for seems to have taken a vacation!
              Don't worry, we'll help you find your way back home.
            </motion.p>
          </motion.div>


          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4"
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto group relative overflow-hidden px-6 md:px-8 py-3 md:py-4 rounded-xl bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Go Back
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <Link to="/" className="w-full sm:w-auto">
              <motion.div
                className="group relative overflow-hidden px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Home className="w-4 h-4 md:w-5 md:h-5 mr-2 transition-transform group-hover:scale-110" />
                  Return Home
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            </Link>
          </motion.div>


          {/* Quick Suggestions */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8 px-2">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">
              Or explore these popular sections:
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
              {suggestions.map((item, index) => (
                <Link key={index} to={item.path}>
                  <motion.div
                    className="group p-3 md:p-4 rounded-xl bg-white/60 hover:bg-white/80 border border-gray-200/50 shadow-md transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <item.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all duration-300" />
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                      {item.text}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>


          {/* Fun Stats */}
          <motion.div
            variants={itemVariants}
            className="text-xs md:text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 px-4"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span>Time wasted: 0.5 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Recovery speed: Lightning fast</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
