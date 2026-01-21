import { logos } from "../../../assets/logo";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../../../App";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};


const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
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


const Companies = () => {
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data } = await axios.get(`${Backendurl}/api/sponsors`);
        if (data.success) {
          setSponsors(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);


  const stats = [
    { icon: Users, value: "20+", label: "Trusted Partners" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Award, value: "5K+", label: "Properties Listed" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
  ];


  if (loading) return null; // or a skeleton
  if (sponsors.length === 0) return null;


  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6"
          >
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            Trusted Worldwide
          </motion.div>


          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4"
          >
            Trusted by{" "}
            <span className="text-blue-900">
              Industry Leaders
            </span>
          </motion.h2>


          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of successful companies that rely on our platform for
            their real estate needs
          </motion.p>
        </motion.div>


        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-blue-600 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* Companies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 mb-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
              Powering Success for Brands
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {`From startups to Market Leaders, we're the trusted choice
`}{" "}
            </p>
          </motion.div>


          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 items-center"
          >
            {sponsors.map((logo, index) => (
              <motion.div
                key={logo._id || index}
                variants={logoVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm group-hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-full flex items-center justify-center p-2 rounded-xl bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
                    <img
                      className="h-full w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                      src={logo.logoUrl}
                      alt={logo.name}
                      width="158"
                      height="48"
                    />
                  </div>

                  {/* Optional Description */}
                  {logo.description && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      whileInView={{ opacity: 1, height: "auto" }}
                      className="text-xs text-center text-gray-500 font-medium px-2 leading-relaxed border-t border-gray-100 pt-3 w-full"
                    >
                      {logo.description}
                    </motion.p>
                  )}

                  {/* Tooltip for Name if no description, or just extra context */}
                  {!logo.description && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0 shadow-lg">
                      {logo.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>


          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200"
          >
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium">GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </motion.div>


        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 md:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate("/register");
              window.scrollTo(0, 0);
            }}
            className="px-6 md:px-8 py-3 md:py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl md:rounded-2xl 
    shadow-lg hover:shadow-xl transition-all font-bold text-base md:text-lg inline-flex items-center group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Join Our Network
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>


          <p className="text-gray-500 mt-3 md:mt-4 text-xs md:text-sm">
            Start your journey with industry-leading companies today
          </p>
        </motion.div>
      </div>
    </section>
  );
};


export default Companies;
