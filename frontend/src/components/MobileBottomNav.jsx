import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Heart,
  User,
  LogIn,
  MessageCircle,
  Plus, // Add this import
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMobileMenu } from "../context/MobileMenuContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth(); // Add user to get role
  const { isMobileMenuOpen } = useMobileMenu();

  // Base navigation items
  const baseNavItems = [
    { path: "/", icon: Home },
    { path: "/properties", icon: Search },
    { path: "/saved", icon: Heart },
    { path: "/profile", icon: User },
  ];

  // Add vendor-specific item if user role is vendor
  const navItems = 
    isAuthenticated && user?.role === "vendor"
      ? [
          ...baseNavItems.slice(0, 2), // Home and Search
          { path: "/vendor/add-service", icon: Plus, isVendorAction: true }, // Vendor add button
          ...baseNavItems.slice(2), // Saved and Profile
        ]
      : baseNavItems;

  if (isMobileMenuOpen) return null;

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Floating pill */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-xl shadow-lg border border-gray-200">
        {navItems.map((item, index) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          const Icon = item.icon;

          return (
            <Link key={index} to={item.path} className="relative">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`p-2.5 rounded-full transition ${
                  item.isVendorAction
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : isActive
                    ? "bg-violet-100 text-violet-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </motion.div>

              {/* Active dot - not shown for vendor action button */}
              {isActive && !item.isVendorAction && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-500"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
