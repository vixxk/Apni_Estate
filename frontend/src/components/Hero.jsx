import { motion } from "framer-motion";
import {
  Shield,
  Sparkles,
  Users,
  Home,
  Star,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import heroimage from "../assets/images/heroimage.png";
import tsLogo from "../assets/tsLogo.jpg";
import { RadialGradient } from "react-text-gradients";
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
import houses from "../assets/houses.png";
import sell from "../assets/sell.png";
import rent from "../assets/rent.png";
import furniture from "../assets/furniture.png";
import decoratives from "../assets/decoratives.png";
import others from "../assets/others.png";

/* ================= DATA ================= */
const services = [
  { title: "Buy", img: sell },
  { title: "Sell", img: sell },
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
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Home,
    value: "5K+",
    label: "Properties Listed",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Properties",
    color: "from-purple-500 to-pink-500",
  },
];

/* ================= ANIMATIONS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

const sparkleAnimation = {
  scale: [1, 1.2, 1],
  rotate: [0, 180, 360],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

/* ================= COMPONENT ================= */
const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showButton, setShowButton] = useState(true);
  const { isMobileMenuOpen } = useMobileMenu();

  // ROLE-BASED VISIBILITY
  const visibleServices = services.filter((service) => {
    if (service.title === "Sell") {
      return isAuthenticated && user?.role === "vendor";
    }
    if (service.title === "Buy") {
      return !isAuthenticated || user?.role !== "vendor";
    }
    return true;
  });

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

  const handleServiceClick = (serviceTitle) => {
    const title = serviceTitle.toLowerCase();

    // Properties (Buy, Sell, Rent)
    if (title === "buy" || title === "sell") {
      navigate("/properties", {
        state: { filterType: "buy-sell" },
      });
    } else if (title === "rent") {
      navigate("/properties", {
        state: { filterType: "rent" },
      });
    }
    // Services
    else if (
      title === "construction services" ||
      title === "legal service" ||
      title === "vastu" ||
      title === "construction consulting" ||
      title === "home loan"
    ) {
      navigate("/services", {
        state: { filterType: title },
      });
    }
    // Sales Items - NORMALIZE "Interior Designing" to "interior"
    else if (title === "interior designing") {
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
    }
    // Others - show everything
    else if (title === "others") {
      navigate("/everything");
    }
    // Default - properties
    else {
      navigate("/properties");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" />

        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
        </motion.div>

        {/* Floating blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [10, -10, 10],
              transition: { duration: 8, repeat: Infinity },
            }}
            className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={sparkleAnimation}
              className="absolute text-yellow-400/60"
              style={{ top: `${20 + i * 10}%`, left: `${15 + i * 12}%` }}
            >
              <Sparkles />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= TRIPURA STARTUP BADGE ================= */}
      <div className="absolute top-2 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            {/* Modern Badge Card */}
            <div className="relative group">
              {/* Subtle gradient glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>

              {/* Main Card */}
              <div className="relative flex items-center gap-3 md:gap-4 px-3 py-2 md:px-4 md:py-2.5 rounded-xl overflow-visible bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Logo */}
                <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12">
  <img
    src={tsLogo}
    alt="Tripura Startup"
    className="
      absolute inset-0
      w-full h-full object-contain
      scale-[1.6] md:scale-[1.8]
      group-hover:scale-[1.9]
      transition-transform duration-300
    "
  />
</div>

                {/* Divider Line */}
                <div className="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

                {/* Text Content */}
                <div className="pr-1">
                  <p className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                    Registered Startup For
                  </p>
                  <h3 className="text-xs md:text-sm lg:text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Startup Tripura
                  </h3>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-60"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 min-h-screen flex items-center px-4 py-4 pt-20 md:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4">
                <RadialGradient gradient={["circle, #3f5efb 0%, #fc466b 100%"]}>
                  Find Your Perfect
                </RadialGradient>
                <br />
                <span className="text-gray-900">Dream Home</span>
              </h1>

              <p className="hidden sm:block text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
                All property services you need — buying, construction & more
              </p>
            </motion.div>

            {/* ================= SERVICES GRID ================= */}
            <motion.div
              variants={itemVariants}
              className="max-w-6xl mx-auto mb-8"
            >
              <div className="bg-white/95 rounded-3xl p-4 sm:p-8 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-10">
                  All Your <span className="text-purple-600">Real Estate</span>{" "}
                  Needs In One Place
                </h2>

                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                  {visibleServices.map((service, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -6, scale: 1.05 }}
                      onClick={() => handleServiceClick(service.title)}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl cursor-pointer group overflow-hidden"
                    >
                      <div className="w-12 h-12 sm:w-24 sm:h-24 mx-auto rounded-lg sm:rounded-2xl overflow-hidden">
                        <img
                          src={service.img}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="font-semibold text-gray-800 text-center text-[10px] sm:text-base leading-tight p-2">
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
              className="grid grid-cols-4 gap-3 sm:gap-6 lg:gap-10 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/90 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow text-center hover:shadow-xl transition-all"
                >
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-11 mx-auto mb-1 sm:mb-3 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-600 leading-tight">
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
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/chat")}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-yellow-400 p-3 md:p-4 rounded-full shadow-xl z-[9999]"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
              3
            </span>
          </motion.button>
        )}
    </div>
  );
};

export default Hero;
