import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Bookmark,
  User,
  LogIn,
  MessageCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMobileMenu } from "../context/MobileMenuContext";
import axios from "axios";
import { Backendurl } from "../App";
import { useState } from "react";

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { isMobileMenuOpen } = useMobileMenu();
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Customer navigation (default)
  const customerNavItems = [
    { path: "/", icon: Home },
    { path: "/properties", icon: Search },
    { path: "/messages", icon: MessageCircle },
    { path: "/saved", icon: Bookmark },
    { path: "/profile", icon: User },
  ];

  // Vendor navigation (No chat)
  const vendorNavItems = [
    { path: "/", icon: Home },
    { path: "/properties", icon: Search },
    {
      path: "/vendor/add-service",
      icon: Plus,
      isVendorAction: true,
    },
    { path: "/saved", icon: Bookmark },
    { path: "/profile", icon: User },
  ];

  const navItems =
    isAuthenticated && user?.role === "vendor"
      ? vendorNavItems
      : customerNavItems;

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;

    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${Backendurl}/api/chats/my/conversations/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!isMounted) return;

        const total = (data.data.conversations || []).reduce(
          (sum, c) => sum + (c.unreadCount || 0),
          0
        );

        setUnreadTotal(total);
      } catch (err) {
        console.error("Unread count error (mobile nav)", err);
      }
    };

    fetchUnread();

    // poll every 2 seconds
    const interval = setInterval(fetchUnread, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

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
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-xl border border-white/20">
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
                className={`p-2.5 rounded-full transition ${item.isVendorAction
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : isActive
                    ? "bg-violet-100 text-violet-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </motion.div>

              {item.path === "/messages" &&
                unreadTotal > 0 &&
                isAuthenticated && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadTotal}
                  </span>
                )}

              {/* Active dot */}
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
