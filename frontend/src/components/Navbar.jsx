import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Bookmark,
  Building,
  Phone,
  MessageSquare,
  Home,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  Bell,
  Store,
  Crown,
  PlusCircle,
  UserCircle,
  BotMessageSquare,
  LogIn,
  Search,
  Users,
  MessageCircle
} from "lucide-react";
import logo from "../assets/images/apniestate-logo.png";
import govLogo from "../assets/gov.png";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { useMobileMenu } from "../context/MobileMenuContext";
import axios from "axios";
import { Backendurl } from "../App";

// Animation Variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 25,
    },
  },
};

const floatingAnimation = {
  y: [-2, 2, -2],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const glowAnimation = {
  boxShadow: [
    "0 0 20px rgba(59, 130, 246, 0.2)",
    "0 0 40px rgba(59, 130, 246, 0.4)",
    "0 0 20px rgba(59, 130, 246, 0.2)",
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.3, 1],
    rotate: [0, 180, 360],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Mobile Drawer Animation Variants (from right)
const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const dropdownRef = useRef(null);

  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isVendor = user?.role === "vendor";

  // Fetch pending requests count for vendors
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!isAuthenticated || !isVendor) {
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${Backendurl}/api/contact-requests/vendor/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const pendingCount = response.data.data.byStatus.pending || 0;
          setPendingRequestsCount(pendingCount);
        }
      } catch (err) {
        console.error("Error fetching pending requests count:", err);
      }
    };

    fetchPendingCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isVendor]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, setIsMobileMenuOpen]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleGoToProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleNotificationClick = () => {
    navigate("/vendor/contact-requests");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-white/95 shadow-md backdrop-blur-xl border-b border-gray-200"
          : "bg-white/90 backdrop-blur-lg border-b border-gray-100"
          }`}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600" />


        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                variants={logoVariants}
                initial="visible"
                className="relative w-10 h-10 flex items-center justify-center"
              >
                <img
                  src={logo}
                  alt="ApniEstate logo"
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                />
              </motion.div>


              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-700 transition-colors duration-300">
                  ApniEstate
                </span>
                <span className="text-xs text-slate-500 font-medium -mt-1 tracking-wide">
                  Premium Properties
                </span>
              </div>
            </Link>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks
                currentPath={location.pathname}
                isAuthenticated={isAuthenticated}
              />


              <div className="flex items-center space-x-4">
                {/* Bell icon - only visible if authenticated AND vendor */}
                {isAuthenticated && isVendor && (
                  <motion.button
                    onClick={handleNotificationClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />


                    {/* Notification badge */}
                    {pendingRequestsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow"
                      >
                        {pendingRequestsCount > 99
                          ? "99+"
                          : pendingRequestsCount}
                      </motion.span>
                    )}
                  </motion.button>
                )}


                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative" ref={dropdownRef}>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={toggleDropdown}
                        className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none"
                        aria-label="User menu"
                        aria-expanded={isDropdownOpen}
                      >
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
                          >
                            {getInitials(user?.name)}
                          </motion.div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                          <span className="text-sm font-semibold text-gray-700">
                            {user?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {isVendor ? "Vendor" : "Premium Member"}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </motion.button>


                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                          >
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                  {getInitials(user?.name)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900">
                                    {user?.name}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate">
                                    {user?.email}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {isVendor ? (
                                      <>
                                        <Store className="w-3 h-3 text-blue-600" />
                                        <span className="text-xs text-blue-700 font-medium">
                                          Vendor
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Crown className="w-3 h-3 text-orange-500" />
                                        <span className="text-xs text-orange-600 font-medium">
                                          Premium
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div className="py-2">
                              <motion.button
                                whileHover={{
                                  x: 4,
                                  backgroundColor: "rgb(243 244 246)",
                                }}
                                onClick={handleGoToProfile}
                                className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                              >
                                <UserCircle className="w-4 h-4" />
                                <span>My Profile</span>
                              </motion.button>


                              {isVendor && (
                                <motion.button
                                  whileHover={{
                                    x: 4,
                                    backgroundColor: "rgb(243 244 246)",
                                  }}
                                  onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate("/vendor/add-service");
                                  }}
                                  className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                                >
                                  <PlusCircle className="w-4 h-4" />
                                  <span>Add New Service</span>
                                </motion.button>
                              )}



                              <motion.button
                                whileHover={{
                                  x: 4,
                                  backgroundColor: "rgb(243 244 246)",
                                }}
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  navigate("/saved");
                                }}
                                className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                              >
                                <Bookmark className="w-4 h-4" />
                                <span>Favourite Properties</span>
                              </motion.button>



                              <div className="border-t border-gray-100 my-2" />
                              <motion.button
                                whileHover={{
                                  x: 4,
                                  backgroundColor: "rgb(254 242 242)",
                                }}
                                onClick={handleLogout}
                                className="w-full px-6 py-3 text-left text-sm text-red-600 hover:text-red-700 flex items-center space-x-3 transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Sign out</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                      >
                        Log in
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        className="relative bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold overflow-hidden"
                      >
                        <span className="relative z-10">Get Started</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>


            {/* Mobile: Bell icon (only for authenticated vendors) + Hamburger */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Bell icon - Mobile (only for authenticated vendors) */}
              {isAuthenticated && isVendor && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNotificationClick}
                  className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 hover:bg-white/80 transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700" />


                  {/* Notification badge */}
                  {pendingRequestsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow"
                    >
                      {pendingRequestsCount > 99 ? "99+" : pendingRequestsCount}
                    </motion.span>
                  )}
                </motion.button>
              )}


              {/* Hamburger Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="relative p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 hover:bg-white/80 transition-colors focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>


      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleMobileMenu}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>


      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed right-0 top-0 h-full w-72 bg-white z-50 overflow-y-auto shadow-2xl"
          >
            {/* Drawer Header */}
            <div
              className={`relative bg-blue-600 transition-all ${isAuthenticated ? "p-4 pb-6" : "p-3"
                }`}
            >
              {/* Close Button */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>


              {/* Logo & Brand */}
              <div
                className={`flex items-center space-x-2 ${isAuthenticated ? "mb-4" : "mb-2"
                  }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white overflow-hidden shadow-sm">
                  <img
                    src={logo}
                    alt="ApniEstate logo"
                    className="w-full h-full object-cover"
                  />
                </div>


                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    ApniEstate
                  </span>
                  <span className="text-xs text-white/80">
                    Premium Properties
                  </span>
                </div>
              </div>


              {/* User Info */}
              {isAuthenticated ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-white/80 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isVendor ? (
                          <>
                            <Store className="w-3 h-3 text-white" />
                            <span className="text-xs text-white font-medium">
                              Vendor
                            </span>
                          </>
                        ) : (
                          <>
                            <Crown className="w-3 h-3 text-yellow-300" />
                            <span className="text-xs text-white font-medium">
                              Premium
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>


            {/* Navigation Links */}
            <div className="px-3 py-4">
              {/* Special Feature */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  AI Feature
                </div>
                <Link
                  to="/ai-features"
                  onClick={toggleMobileMenu}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all border ${location.pathname.startsWith("/ai-property-hub")
                    ? "bg-blue-600 text-white shadow-lg border-transparent"
                    : "bg-blue-50 text-blue-800 border-blue-200 hover:shadow-md"
                    }`}
                >
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <BotMessageSquare className="w-6 h-6 text-blue-600" />
                  </div>


                  {/* Text */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold truncate">
                      AI Property Hub
                    </span>
                    <span className="text-xs opacity-80 truncate">
                      Smart recommendations
                    </span>
                  </div>


                  {/* NEW badge */}
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
                    NEW
                  </span>
                </Link>
              </div>

              {/* Navigation Section */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Navigation
                </div>
                <MobileNavItem
                  icon={Home}
                  label="Home"
                  path="/"
                  currentPath={location.pathname}
                  onClick={toggleMobileMenu}
                  description="Welcome home"
                />
                <MobileNavItem
                  icon={Search}
                  label="Properties"
                  path="/properties"
                  currentPath={location.pathname}
                  onClick={toggleMobileMenu}
                  description="Find your dream"
                />
                <MobileNavItem
                  icon={Users}
                  label="About Us"
                  path="/about"
                  currentPath={location.pathname}
                  onClick={toggleMobileMenu}
                  description="Our story"
                />
                <MobileNavItem
                  icon={MessageCircle}
                  label="Contact"
                  path="/contact"
                  currentPath={location.pathname}
                  onClick={toggleMobileMenu}
                  description="Get in touch"
                />
              </div>

              {/* Register Button */}
              {!isAuthenticated && (
                <div className="mb-4 space-y-2 mt-3">
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">Register</span>
                  </Link>
                </div>
              )}

              {/* Account Section - When Authenticated */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Account
                  </div>
                  <MobileNavItem
                    icon={UserCircle}
                    label="My Profile"
                    path="/profile"
                    currentPath={location.pathname}
                    onClick={toggleMobileMenu}
                  />
                  {isVendor && (
                    <MobileNavItem
                      icon={PlusCircle}
                      label="Add New Service"
                      path="/vendor/add-service"
                      currentPath={location.pathname}
                      onClick={toggleMobileMenu}
                    />
                  )}
                  {isVendor ? (
                    <MobileNavItem
                      icon={MessageSquare}
                      label="Chat"
                      path="/messages"
                      currentPath={location.pathname}
                      onClick={toggleMobileMenu}
                    />
                  ) : (
                    <MobileNavItem
                      icon={Bookmark}
                      label="Favourite Properties"
                      path="/saved"
                      currentPath={location.pathname}
                      onClick={toggleMobileMenu}
                    />
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              )}

              {/* Account Section - When Not Authenticated */}
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Account
                  </div>
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all mb-2 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <LogIn className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-semibold">Log In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Bookmark className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">Create account</span>
                    <motion.div
                      animate={{
                        x: [0, 100, 100, 0],
                        opacity: [0, 0.5, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLinks = ({ currentPath, isAuthenticated }) => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const links = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "About Us",
      path: "/about",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "AI Features",
      path: "/ai-features",
      icon: BotMessageSquare,
      color: "from-indigo-600 to-purple-600",
    },
    {
      name: "Properties",
      path: "/properties",
      icon: Search,
      color: "from-green-500 to-emerald-500",
      hasDropdown: true,
      dropdownItems: [
        { label: "Apartments", value: "apartment" },
        { label: "Houses", value: "house" },
        { label: "Villas", value: "villa" },
        { label: "Plots", value: "plot" },
        { label: "Commercial", value: "commercial" },
      ]
    },
    {
      name: "Contact",
      path: "/contact",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500",
    },
    ...(isAuthenticated
      ? [
        {
          name: "Chat",
          path: "/messages",
          icon: MessageCircle,
          color: "from-indigo-500 to-blue-500",
        },
      ]
      : []),
  ];

  return (
    <div className="flex items-center space-x-2">
      {links.map(({ name, path, icon: Icon, color, hasDropdown, dropdownItems }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <div
            key={name}
            className="relative"
            onMouseEnter={() => hasDropdown && setHoveredLink(name)}
            onMouseLeave={() => hasDropdown && setHoveredLink(null)}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all z-10 relative
                  ${isActive
                    ? `text-white bg-gradient-to-r ${color} shadow-lg`
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
                {hasDropdown && <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />}
              </Link>
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {hasDropdown && hoveredLink === name && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 p-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.value}
                      to={`${path}?type=${item.value}`}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const MobileNavItem = ({
  icon: Icon,
  label,
  path,
  currentPath,
  onClick,
  description,
}) => {
  const isActive =
    path === "/" ? currentPath === path : currentPath.startsWith(path);

  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all mb-1 ${isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <Icon className="w-4 h-4" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium truncate block">{label}</span>
        {description && !isActive && (
          <span className="block text-xs text-gray-500 truncate">
            {description}
          </span>
        )}
      </div>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
};

MobileNavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  description: PropTypes.string,
};

export const useMobileMenuState = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return { isMobileMenuOpen, setIsMobileMenuOpen };
};

export default Navbar;
