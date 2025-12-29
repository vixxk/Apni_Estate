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
          activeColor: "text-blue-600",
        },
        {
          name: "Search",
          path: "/properties",
          icon: Search,
          color: "from-green-500 to-emerald-500",
          activeColor: "text-green-600",
        },
        {
          name: "AI Assistant",
          path: "/ai-property-hub",
          icon: MessageCircle,
          color: "from-purple-500 to-pink-500",
          activeColor: "text-purple-600",
          badge: true,
        },
        {
          name: "Favorites",
          path: "/saved",
          icon: Heart,
          color: "from-pink-500 to-red-500",
          activeColor: "text-pink-600",
        },
        {
          name: "Profile",
          path: "/profile",
          icon: User,
          color: "from-indigo-500 to-purple-500",
          activeColor: "text-indigo-600",
        },
      ]
    : [
        {
          name: "Home",
          path: "/",
          icon: Home,
          color: "from-blue-500 to-cyan-500",
          activeColor: "text-blue-600",
        },
        {
          name: "Search",
          path: "/properties",
          icon: Search,
          color: "from-green-500 to-emerald-500",
          activeColor: "text-green-600",
        },
        {
          name: "Register",
          path: "/register",
          icon: User,
          color: "from-purple-500 to-pink-500",
          activeColor: "text-purple-600",
        },
        {
          name: "Login",
          path: "/login",
          icon: LogIn,
          color: "from-indigo-500 to-purple-500",
          activeColor: "text-indigo-600",
        },
      ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Gradient border top */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Background with blur */}
          <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
            {/* Grid background effect */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative px-2 py-2">
              <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="relative flex flex-col items-center justify-center flex-1 py-2 px-1 group"
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveTab"
                          className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-2xl`}
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Icon container */}
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className="relative"
                      >
                        <div
                          className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-br ${item.color} shadow-lg`
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 transition-colors duration-300 ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}
                          />
                          
                          {/* Badge for Chat */}
                          {/* {item.badge && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <span className="text-white text-[10px] font-bold">1</span>
                            </motion.div>
                          )} */}
                        </div>

                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        )}
                      </motion.div>

                      {/* Label */}
                      <motion.span
                        className={`text-[11px] font-medium mt-1 transition-colors duration-300 ${
                          isActive
                            ? item.activeColor
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                        initial={false}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomNav;