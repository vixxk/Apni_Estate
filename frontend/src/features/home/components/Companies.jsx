import { logos } from "../../../assets/logo";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, Star, Users, Award, X, MapPin, Calendar, Phone, Mail, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [autoplay, setAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Responsive itemsPerPage
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoplay || sponsors.length === 0) return;
    const totalPages = Math.ceil(sponsors.length / itemsPerPage);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, sponsors.length, itemsPerPage]);

  // Touch Handlers for Swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const totalPages = Math.ceil(sponsors.length / itemsPerPage);

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % totalPages);
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    }
    // reset
    setTouchStart(null);
    setTouchEnd(null);
  };

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
              className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
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


        {/* Companies Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 relative px-4"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Powering Success for <span className="text-blue-600">Brands</span>
            </h3>
            <p className="text-slate-500 text-sm md:text-base">
              From startups to Market Leaders, we're the trusted choice
            </p>
          </motion.div>

          {/* Carousel Container */}
          <div
            className="relative max-w-7xl mx-auto"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center gap-6"
                >
                  {sponsors
                    .slice(activeIndex * itemsPerPage, (activeIndex + 1) * itemsPerPage)
                    .map((sponsor, index) => (
                      <motion.div
                        key={`${sponsor._id}-${index}`}
                        whileHover={{ y: -8 }}
                        onClick={() => setSelectedSponsor(sponsor)}
                        className="w-full max-w-[300px] md:max-w-[340px] bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-100 relative group flex flex-col flex-shrink-0 cursor-pointer transition-all duration-300"
                      >
                        {/* Image Section */}
                        <div className="h-48 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow text-left items-start">
                          <div className="mb-3">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-wide shadow-sm">
                              {sponsor.launchDate || "Coming Soon"}
                            </span>
                          </div>

                          <h4 className="text-slate-900 font-bold text-xl mb-1 w-full truncate group-hover:text-indigo-700 transition-colors">
                            {sponsor.name}
                          </h4>

                          {sponsor.location && (
                            <div className="flex items-center text-slate-500 text-sm mb-5 w-full">
                              <MapPin size={14} className="mr-1.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{sponsor.location}</span>
                            </div>
                          )}

                          <div className="w-full h-px bg-slate-100 mb-4"></div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSponsor(sponsor);
                            }}
                            className="w-full py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 mt-auto transition-all duration-300"
                          >
                            View Description
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(sponsors.length / itemsPerPage) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detail Popup Modal */}
        <AnimatePresence>
          {selectedSponsor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSponsor(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-y-auto relative custom-scrollbar"
              >
                <button
                  onClick={() => setSelectedSponsor(null)}
                  className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={20} />
                </button>

                <div
                  className="h-56 bg-slate-100 relative cursor-pointer group"
                  onClick={() => window.open(selectedSponsor.logoUrl, '_blank')}
                  title="Click to view image"
                >
                  <img
                    src={selectedSponsor.logoUrl}
                    alt={selectedSponsor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm p-2 rounded-full text-white">
                    <div className="text-[10px] font-medium flex items-center gap-1">Open Image</div>
                  </div>
                  <div className="absolute bottom-4 left-6 text-white pointer-events-none">
                    <h3 className="text-2xl font-bold mb-0.5">{selectedSponsor.name}</h3>
                    {selectedSponsor.location && (
                      <p className="flex items-center text-sm text-white/80">
                        <MapPin size={14} className="mr-1" />
                        {selectedSponsor.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 space-y-3">
                    {selectedSponsor.description ? (
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {selectedSponsor.description}
                      </p>
                    ) : (
                      <p className="text-slate-400 text-sm italic">No description provided.</p>
                    )}
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-5 text-left">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Information</h5>

                    {selectedSponsor.launchDate && (
                      <div className="flex items-center text-slate-700 text-sm">
                        <Calendar size={16} className="mr-3 text-indigo-500" />
                        <span>Launch: {selectedSponsor.launchDate}</span>
                      </div>
                    )}
                    {selectedSponsor.contactPhone && (
                      <div className="flex items-center text-slate-700 text-sm">
                        <Phone size={16} className="mr-3 text-indigo-500" />
                        <span>{selectedSponsor.contactPhone}</span>
                      </div>
                    )}
                    {selectedSponsor.contactEmail && (
                      <div className="flex items-center text-slate-700 text-sm">
                        <Mail size={16} className="mr-3 text-indigo-500" />
                        <span>{selectedSponsor.contactEmail}</span>
                      </div>
                    )}
                    {selectedSponsor.website && (
                      <div className="flex items-center text-slate-700 text-sm">
                        <Globe size={16} className="mr-3 text-indigo-500" />
                        <a
                          href={selectedSponsor.website.startsWith('http') ? selectedSponsor.website : `https://${selectedSponsor.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline truncate"
                        >
                          {selectedSponsor.website}
                        </a>
                      </div>
                    )}

                    {!selectedSponsor.contactPhone && !selectedSponsor.contactEmail && !selectedSponsor.website && (
                      <p className="text-sm text-slate-400">No contact details added.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


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
            className="px-6 md:px-8 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-base md:text-lg inline-flex items-center group relative overflow-hidden"
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
