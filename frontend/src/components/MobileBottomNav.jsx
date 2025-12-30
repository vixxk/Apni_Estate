import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Heart,
  User,
  LogIn,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide nav on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = isAuthenticated
    ? [
        {
          name: "Home",
          path: "/",
          icon: Home,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-gradient-to-br from-blue-100/80 to-cyan-100/80",
          activeColor: "text-blue-600",
          shadowColor: "shadow-blue-400/30",
        },
        {
          name: "Search",
          path: "/properties",
          icon: Search,
          color: "from-emerald-500 to-teal-500",
          bgColor: "bg-gradient-to-br from-emerald-100/80 to-teal-100/80",
          activeColor: "text-emerald-600",
          shadowColor: "shadow-emerald-400/30",
        },
        {
          name: "AI Assistant",
          path: "/ai-property-hub",
          icon: MessageCircle,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-gradient-to-br from-purple-100/80 to-pink-100/80",
          activeColor: "text-purple-600",
          shadowColor: "shadow-purple-400/30",
          badge: true,
        },
        {
          name: "Favorites",
          path: "/saved",
          icon: Heart,
          color: "from-rose-500 to-pink-500",
          bgColor: "bg-gradient-to-br from-rose-100/80 to-pink-100/80",
          activeColor: "text-rose-600",
          shadowColor: "shadow-rose-400/30",
        },
        {
          name: "Profile",
          path: "/profile",
          icon: User,
          color: "from-indigo-500 to-violet-500",
          bgColor: "bg-gradient-to-br from-indigo-100/80 to-violet-100/80",
          activeColor: "text-indigo-600",
          shadowColor: "shadow-indigo-400/30",
        },
      ]
    : [
        {
          name: "Home",
          path: "/",
          icon: Home,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-gradient-to-br from-blue-100/80 to-cyan-100/80",
          activeColor: "text-blue-600",
          shadowColor: "shadow-blue-400/30",
        },
        {
          name: "Search",
          path: "/properties",
          icon: Search,
          color: "from-emerald-500 to-teal-500",
          bgColor: "bg-gradient-to-br from-emerald-100/80 to-teal-100/80",
          activeColor: "text-emerald-600",
          shadowColor: "shadow-emerald-400/30",
        },
        {
          name: "AI Assistant",
          path: "/ai-property-hub",
          icon: MessageCircle,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-gradient-to-br from-purple-100/80 to-pink-100/80",
          activeColor: "text-purple-600",
          shadowColor: "shadow-purple-400/30",
          badge: true,
        },
        {
          name: "Login",
          path: "/login",
          icon: LogIn,
          color: "from-indigo-500 to-violet-500",
          bgColor: "bg-gradient-to-br from-indigo-100/80 to-violet-100/80",
          activeColor: "text-indigo-600",
          shadowColor: "shadow-indigo-400/30",
        },
      ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30 
          }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Floating container */}
          <div className="px-5 pb-5 pointer-events-none">
            <motion.div 
              className="relative max-w-md mx-auto pointer-events-auto"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              {/* Colorful glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-pink-200/40 rounded-[32px] blur-2xl"></div>
              
              {/* Main navigation card - soft gradient background */}
              <div className="relative bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-purple-50/95 backdrop-blur-2xl rounded-[28px] shadow-[0_10px_40px_rgba(99,102,241,0.12)] border border-white/60 overflow-hidden">
                
                {/* Ambient gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.05),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.05),transparent_50%)]"></div>
                
                {/* Top glass reflection */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/40 to-transparent"></div>

                {/* Animated shimmer effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  style={{ width: '50%' }}
                />

                {/* Navigation items */}
                <div className="relative flex items-center justify-around px-4 py-4">
                  {navItems.map((item) => {
                    const isActive =
                      item.path === "/"
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 group"
                      >
                        {/* Active indicator background - soft gradient pill */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              layoutId="floatingActiveTab"
                              className={`absolute inset-0 ${item.bgColor} rounded-[20px] shadow-lg`}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            >
                              {/* Inner glow */}
                              <div className="absolute inset-0 rounded-[20px] bg-white/30"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Icon container */}
                        <motion.div
                          whileTap={{ scale: 0.88 }}
                          className="relative z-10"
                        >
                          <motion.div
                            animate={
                              isActive
                                ? {
                                    y: [-3, 0],
                                    transition: { 
                                      duration: 0.4,
                                      type: "spring",
                                      stiffness: 300
                                    },
                                  }
                                : {}
                            }
                            className={`relative p-2.5 rounded-[18px] transition-all duration-300 ${
                              isActive
                                ? `bg-gradient-to-br ${item.color} shadow-lg ${item.shadowColor}`
                                : "bg-white/60 group-hover:bg-white/90 group-hover:scale-110 shadow-sm"
                            }`}
                          >
                            <item.icon
                              className={`w-[22px] h-[22px] transition-all duration-300 ${
                                isActive
                                  ? "text-white drop-shadow-sm"
                                  : "text-slate-600 group-hover:text-slate-800"
                              }`}
                              strokeWidth={isActive ? 2.5 : 2}
                            />

                            {/* Pulsing ring for active state */}
                            {isActive && (
                              <motion.div
                                className={`absolute inset-0 rounded-[18px] bg-gradient-to-br ${item.color}`}
                                animate={{
                                  scale: [1, 1.15, 1],
                                  opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                          </motion.div>

                          {/* Active dot indicator */}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`}
                            >
                              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} blur-[2px]`}></div>
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Label */}
                        <motion.span
                          className={`text-[10px] font-semibold mt-1.5 transition-all duration-300 tracking-wide ${
                            isActive
                              ? item.activeColor
                              : "text-slate-500 group-hover:text-slate-700"
                          }`}
                          initial={false}
                          animate={{
                            scale: isActive ? 1.02 : 0.96,
                            y: isActive ? -1 : 0,
                          }}
                        >
                          {item.name}
                        </motion.span>
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom shine line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent"></div>
              </div>

              {/* Floating shadow base */}
              <div className="absolute inset-x-4 -bottom-2 h-4 bg-gradient-to-b from-indigo-200/20 to-transparent rounded-b-[28px] blur-xl"></div>
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomNav;
