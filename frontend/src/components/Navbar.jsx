import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  Search,
  Users,
  MessageCircle,
  Sparkles,
  BotMessageSquare,
  UserCircle,
  Heart,
  Crown,
  PlusCircle,
  Store,
  LogIn,
} from "lucide-react";
import logo from "../assets/images/apniestate-logo.png";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

// Enhanced Animation Variants
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isVendor = user?.role === "vendor";

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
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 shadow-xl backdrop-blur-xl border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-lg border-b border-gray-100/80"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                variants={logoVariants}
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1,
                }}
                transition={{ duration: 0.5 }}
                className="relative w-12 h-12 flex items-center justify-center"
              >
                <img
                  src={logo}
                  alt="ApniEstate logo"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />

                <motion.div
                  animate={floatingAnimation}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              </motion.div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-500">
                  ApniEstate
                </span>
                <span className="text-xs text-gray-500 font-medium -mt-1">
                  Premium Properties
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <NavLinks currentPath={location.pathname} isVendor={isVendor} />

              <div className="flex items-center space-x-4">
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
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30"
                          >
                            {getInitials(user?.name)}
                          </motion.div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
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
                            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                          >
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
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
                                        <Store className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs text-blue-600 font-medium">
                                          Vendor
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Crown className="w-3 h-3 text-yellow-500" />
                                        <span className="text-xs text-yellow-600 font-medium">
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
                                <Heart className="w-4 h-4" />
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
                        Sign in
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, ...glowAnimation }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/30 font-semibold overflow-hidden"
                      >
                        <span className="relative z-10">Get Started</span>
                        <motion.div
                          animate={sparkleVariants.animate}
                          className="absolute top-1 right-1"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-300" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="md:hidden relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
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
            className="md:hidden fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Drawer Header */}
            <div
              className={`relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 transition-all ${
                isAuthenticated ? "p-6 pb-8" : "p-4"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Logo & Brand */}
              <div
                className={`flex items-center space-x-3 ${
                  isAuthenticated ? "mb-6" : "mb-2"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-lg">
                  <img
                    src={logo}
                    alt="ApniEstate logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">
                    ApniEstate
                  </span>
                  <span className="text-xs text-white/80">
                    Premium Properties
                  </span>
                </div>
              </div>

              {/* User Info */}
              {isAuthenticated ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-lg shadow-lg">
                      {getInitials(user?.name)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-white/80 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
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
            <div className="px-4 py-6">
              {/* Special Feature */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  AI Feature
                </div>
                <Link
                  to="/ai-property-hub"
                  onClick={toggleMobileMenu}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                    location.pathname.startsWith("/ai-property-hub")
                      ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl border-transparent"
                      : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-indigo-800 border-indigo-200 hover:shadow-lg"
                  }`}
                >
                  {/* Icon Box */}
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <BotMessageSquare className="w-8 h-8 text-indigo-600" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="text-base font-bold">AI Property Hub</span>
                    <span className="text-xs opacity-80">
                      Smart property recommendations
                    </span>
                  </div>

                  {/* NEW badge */}
                  <span className="ml-auto h-fit text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow">
                    NEW
                  </span>
                </Link>
              </div>

              {/* Navigation Section */}
              <div className="mb-4">
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

              {/* Account Section */}
              {isAuthenticated && (
                <div className="border-t border-gray-200 pt-4">
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
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mb-6 space-y-3">
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Register</span>
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

const NavLinks = ({ currentPath, isVendor }) => {
  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      description: "Welcome home",
    },
    {
      name: "Properties",
      path: "/properties",
      icon: Search,
      color: "from-green-500 to-emerald-500",
      description: "Find your dream",
    },
    {
      name: "About Us",
      path: "/about",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      description: "Our story",
    },
    {
      name: "Contact",
      path: "/contact",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500",
      description: "Get in touch",
    },
  ];

  const [sparkleKey, setSparkleKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleKey((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isAIHubActive = currentPath.startsWith("/ai-property-hub");

  return (
    <div className="flex space-x-2 items-center">
      {navLinks.map(({ name, path, icon: Icon, color, description }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        return (
          <motion.div
            key={name}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={path}
              className={`relative group font-medium transition-all duration-300 flex items-center gap-2 px-4 py-2.5 rounded-xl
                ${
                  isActive
                    ? `text-white bg-gradient-to-r ${color} shadow-lg shadow-blue-500/30`
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/80"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-blue-600"
                }`}
              />
              <span className="font-semibold">{name}</span>

              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                  {description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 border border-white/20"
                  initial={false}
                />
              )}
            </Link>
          </motion.div>
        );
      })}

      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/ai-property-hub"
          className={`relative group font-semibold transition-all duration-300 flex items-center gap-2.5 px-5 py-2.5 rounded-xl overflow-hidden ${
            isAIHubActive
              ? "text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl shadow-purple-500/40"
              : "text-indigo-700 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:text-white border border-indigo-200 hover:border-transparent"
          }`}
        >
          <div className="relative">
            <BotMessageSquare
              className={`w-5 h-5 ${
                isAIHubActive
                  ? "text-white"
                  : "text-indigo-600 group-hover:text-white"
              }`}
            />
            <motion.div
              key={sparkleKey}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          </div>
          <span>AI Property Hub</span>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={isAIHubActive ? { x: [-100, 100] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {isAIHubActive && (
            <motion.div
              layoutId="aiActiveIndicator"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 border border-white/30"
              initial={false}
            />
          )}

          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              AI-powered property recommendations
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

// Mobile NavItem Component
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
      <div className="flex-1">
        <span className="font-medium">{label}</span>
        {description && !isActive && (
          <span className="block text-xs text-gray-500">{description}</span>
        )}
      </div>
      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
    </Link>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
  isVendor: PropTypes.bool,
};

MobileNavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  description: PropTypes.string,
};

export default Navbar;
