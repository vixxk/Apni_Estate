import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote, TrendingUp, Users, Award, MessageSquare, Star, X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Backendurl } from '../App';
import tsLogo from "../assets/tsLogo.jpg";
import recognitionLogo from '../assets/gov.png';
import PropTypes from 'prop-types';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const TestimonialCard = ({ testimonial, index, direction }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative glass-card p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      style={{
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote Icon with Design */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="w-12 h-12 md:w-16 md:h-16 text-blue-500 transform group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Testimonial Content */}
      <div className="relative z-10 mt-10 md:mt-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-medium relative"
        >
          <span className="text-3xl md:text-4xl text-blue-400 font-serif absolute -top-2 -left-2 opacity-50">&ldquo;</span>
          <span className="ml-3 md:ml-4">{testimonial.text}</span>
          <span className="text-3xl md:text-4xl text-blue-400 font-serif absolute -bottom-4 md:-bottom-6 right-0 opacity-50">&rdquo;</span>
        </motion.p>
      </div>

      {/* Client Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between mt-6 md:mt-8"
      >
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Profile Image or Initials */}
          <div className="relative group/avatar">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover/avatar:shadow-lg transition-shadow duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white shadow-md group-hover/avatar:shadow-lg transition-shadow duration-300">
                  <span className="text-white font-bold text-2xl">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Client Details */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
              {testimonial.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 flex items-center mb-1 md:mb-2">
              <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-1.5 md:mr-2 animate-pulse" />
              {testimonial.location}
            </p>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 md:w-4 md:h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
};

const Testimonials = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Data state
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ text: '', rating: 5 });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(`${Backendurl}/api/testimonials/public`);
      if (data.success && data.data.length > 0) {
        setTestimonials(data.data);
      } else {
        // Fallback to empty array logic or skeleton
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to submit a review.");
      navigate("/login");
      return;
    }

    try {
      setSubmitLoading(true);
      const { data } = await axios.post(
        `${Backendurl}/api/testimonials`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        alert(data.message);
        setShowModal(false);
        setFormData({ text: '', rating: 5 });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay || isHovered || testimonials.length === 0) return;

    const interval = setInterval(() => {
      handleNext(); // Reuse handleNext logic
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, isHovered, testimonials]); // Added testimonials dependency


  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 'right' : 'left');
    setActiveIndex(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  // Stats
  const stats = [
    { icon: Users, value: "100+", label: "Happy Clients", color: "from-blue-500 to-cyan-500" },
    { icon: Award, value: "4.9/5", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
    { icon: Award, value: "5+", label: "Awards Won", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, value: "85%", label: "Success Rate", color: "from-green-500 to-emerald-500" }
  ];

  if (loading) {
    return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
  }

  return (
    <section className="relative py-16 md:py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-1.5 md:space-x-2 bg-blue-100 text-blue-800 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 shadow-sm"
          >
            <span>Client Testimonials</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6"
          >
            What Our Clients
            <span className="block text-blue-800">Are Saying</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover why thousands of homeowners trust ApniEstate to find their perfect property.
            Our commitment to excellence speaks through their experiences.
          </motion.p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="text-center p-4 md:p-6 bg-white border border-gray-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`inline-flex p-2 md:p-3 rounded-lg md:rounded-xl bg-blue-600 text-white mb-3 md:mb-4 shadow-md`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="font-bold text-xl md:text-2xl lg:text-3xl text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {testimonials.length > 0 ? (
          <>
            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {testimonials.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} index={0} direction="right" />
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="lg:hidden relative">
              <div
                className="overflow-hidden px-2 md:px-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <TestimonialCard
                    testimonial={testimonials[activeIndex]}
                    index={activeIndex}
                    direction={direction}
                    key={activeIndex}
                  />
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center mt-10 md:mt-12 space-x-4 md:space-x-6">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-white rounded-full shadow hover:bg-blue-50 transition"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, i) => (
                    <div key={i} className={`h-2 w-2 rounded-full ${i === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="p-3 bg-white rounded-full shadow hover:bg-blue-50 transition"
                >
                  <ArrowRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-2xl mb-12">
            <p className="text-gray-500">No approved reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-20 text-center"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => setShowModal(true)}
              className="group inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            >
              <MessageSquare className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-blue-200 transition-colors duration-200" />
              Share Your Experience
              <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                  <p className="text-sm text-gray-500">Your review helps others find their dream home.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreateTestimonial} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                    placeholder="Tell us about your experience..."
                    required
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {formData.text.length}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for Review"}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Reviews are reviewed by admins before appearing on the site.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Testimonials;
