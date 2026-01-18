import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Home,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import heroimage from "../assets/images/heroimage.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMobileMenu } from "../context/MobileMenuContext";

/* ================= IMAGE IMPORTS ================= */
import constructionServices from "../assets/construction.png";
import interior from "../assets/interior.png";
import legal from "../assets/legal.png";
import vastu from "../assets/vastu.png";
import consulting from "../assets/consulting.png";
import loan from "../assets/loan.png";
import constructionMaterials from "../assets/construction materials.jpeg";
import sell from "../assets/sell.png";
import rent from "../assets/rent.png";
import furniture from "../assets/furniture.png";
import decoratives from "../assets/decoratives.png";
import others from "../assets/others.png";
import axios from "axios";
import { Backendurl } from "../App";

/* ================= DATA ================= */
const services = [
  { title: "Buy", img: sell },
  // { title: "Sell", img: sell },
  { title: "Rent", img: rent },
  { title: "Construction Services", img: constructionServices },
  { title: "Interior Designing", img: interior },
  { title: "Legal Service", img: legal },
  { title: "Vastu", img: vastu },
  { title: "Construction Consulting", img: consulting },
  { title: "Home Loan", img: loan },
  { title: "Construction Materials", img: constructionMaterials },
  { title: "Furniture", img: furniture },
  { title: "Decoratives", img: decoratives },
  { title: "Others", img: others },
];

const stats = [
  {
    icon: Users,
    value: "100+",
    label: "Happy Customers",
    color: "bg-blue-600",
  },
  {
    icon: Home,
    value: "5K+",
    label: "Properties Listed",
    color: "bg-blue-700",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Properties",
    color: "bg-blue-800",
  },
];

/* ================= ANIMATIONS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ================= COMPONENT ================= */
const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showButton, setShowButton] = useState(true);
  const { isMobileMenuOpen } = useMobileMenu();
  const [unreadTotal, setUnreadTotal] = useState(0);

  const visibleServices = services;

  // Hide button on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "vendor") return;

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
        console.error("Unread count error (hero)", err);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

  const handleServiceClick = (serviceTitle) => {
    const title = serviceTitle.toLowerCase();

    if (title === "buy") {
      navigate("/properties", {
        state: { filterType: "buy-sell" },
      });
    } else if (title === "sell") {
      navigate("/vendor/add-service");
    } else if (title === "rent") {
      navigate("/properties", {
        state: { filterType: "rent" },
      });
    } else if (
      title === "construction services" ||
      title === "legal service" ||
      title === "vastu" ||
      title === "construction consulting" ||
      title === "home loan"
    ) {
      navigate("/services", {
        state: { filterType: title },
      });
    } else if (title === "interior designing") {
      navigate("/sales-items", {
        state: { filterType: "interior" },
      });
    } else if (
      title === "construction materials" ||
      title === "furniture" ||
      title === "decoratives"
    ) {
      navigate("/sales-items", {
        state: { filterType: title },
      });
    } else if (title === "others") {
      navigate("/everything");
    } else {
      navigate("/properties");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-70" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-100/20 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 min-h-screen flex flex-col justify-start px-4 pt-20 md:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-10 md:mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-black-700">
                Find Your Perfect <br className="hidden sm:block" />
                <span className="text-blue-700 relative inline-block">
                  Dream Home
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="hidden sm:block text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                All property services you need — buying, construction & more
              </p>
            </motion.div>

            {/* ================= SERVICES GRID ================= */}
            <motion.div
              variants={itemVariants}
              className="max-w-6xl mx-auto mb-12"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 sm:p-10 border border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10 text-slate-800">
                  All Your Real Estate Needs
                </h2>

                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                  {visibleServices.map((service, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      onClick={() => handleServiceClick(service.title)}
                      className="cursor-pointer group flex flex-col items-center gap-3"
                    >
                      <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-600 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        <img
                          src={service.img}
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <p className="font-semibold text-slate-600 text-center text-xs sm:text-sm leading-tight group-hover:text-blue-700 transition-colors">
                        {service.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ================= STATS ================= */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-3 sm:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center shadow-lg shadow-blue-900/5 border border-slate-100"
                >
                  <div
                    className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center"
                  >
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-lg sm:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wide leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ================= MESSAGE BUTTON ================= */}
      {isAuthenticated &&
        user?.role === "vendor" &&
        showButton &&
        !isMobileMenuOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/messages")}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg shadow-blue-600/30 z-[9999] transition-colors"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />

            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border-2 border-white">
                {unreadTotal}
              </span>
            )}
          </motion.button>
        )}
    </div>
  );
};

export default Hero;
