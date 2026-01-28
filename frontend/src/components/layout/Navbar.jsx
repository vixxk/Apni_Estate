import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/apniestate-logo.png";
import { useMobileMenu } from "../../context/MobileMenuContext";
import NavLinks from "./navbar/NavLinks";
import NotificationBadge from "./navbar/NotificationBadge";
import ProfileDropdown from "./navbar/ProfileDropdown";
import MobileMenu from "./navbar/MobileMenu";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Backendurl } from "../../App";


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


    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isVendor]);

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


            <div className="hidden md:flex items-center space-x-8">
              <NavLinks
                currentPath={location.pathname}
                isAuthenticated={isAuthenticated}
              />

              <div className="flex items-center space-x-4">

                {isAuthenticated && isVendor && (
                  <NotificationBadge
                    onClick={handleNotificationClick}
                    count={pendingRequestsCount}
                  />
                )}

                {isAuthenticated ? (
                  <ProfileDropdown
                    user={user}
                    isVendor={isVendor}
                    isOpen={isDropdownOpen}
                    toggleOpen={toggleDropdown}
                    closeDropdown={() => setIsDropdownOpen(false)}
                    onLogout={handleLogout}
                    getInitials={getInitials}
                  />
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


            <div className="md:hidden flex items-center space-x-2">

              {isAuthenticated && isVendor && (
                <NotificationBadge
                  onClick={handleNotificationClick}
                  count={pendingRequestsCount}
                />
              )}


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

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        isVendor={isVendor}
        onLogout={handleLogout}
        getInitials={getInitials}
        currentPath={location.pathname}
      />
    </>
  );
};

export const useMobileMenuState = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return { isMobileMenuOpen, setIsMobileMenuOpen };
};

export default Navbar;
