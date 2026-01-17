import { useState, useEffect } from 'react';
import { Star, ArrowLeft, ArrowRight, Quote, Heart, Sparkles, TrendingUp, Users, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../assets/testimonialdata';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import tsLogo from "../assets/tsLogo.jpg";
import recognitionLogo from '../assets/gov.png';


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


const floatingAnimation = {
  y: [-5, 5, -5],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};


const sparkleAnimation = {
  scale: [1, 1.3, 1],
  rotate: [0, 180, 360],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};


const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
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

      {/* Floating Sparkles */}
      <motion.div
        animate={sparkleAnimation}
        className="absolute top-4 md:top-6 right-4 md:right-6 text-blue-400 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
      >
        <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
      </motion.div>


      {/* Quote Icon with Design */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="w-12 h-12 md:w-16 md:h-16 text-blue-500 transform group-hover:scale-110 transition-transform duration-300" />
      </div>


      {/* Premium Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="absolute top-3 md:top-4 left-3 md:left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg"
      >
        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
        <span>Verified</span>
      </motion.div>


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
          {/* Profile Image */}
          <div className="relative group/avatar">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover/avatar:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
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

            {/* Star Rating */}
            <div className="flex items-center space-x-0.5 md:space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Star
                    className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-200 ${i < testimonial.rating
                      ? 'text-yellow-400 fill-current drop-shadow-sm'
                      : 'text-gray-300'
                      }`}
                  />
                </motion.div>
              ))}
              <span className="ml-1 md:ml-2 text-xs text-gray-500 font-medium">
                {testimonial.rating}.0
              </span>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Position Indicators for Mobile */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:hidden">
        {testimonials.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.05 }}
            className={`rounded-full transition-all duration-300 ${i === index
              ? 'w-6 h-2 bg-blue-600 shadow-md'
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>


      {/* Hover Effect Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl md:rounded-3xl pointer-events-none"
      />
    </motion.div>
  );
};


const Testimonials = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);


  // Statistics for visual appeal
  const stats = [
    { icon: Users, value: "100+", label: "Happy Clients", color: "from-blue-500 to-cyan-500" },
    { icon: Star, value: "4.9", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
    { icon: Award, value: "5+", label: "Awards Won", color: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, value: "85%", label: "Success Rate", color: "from-green-500 to-emerald-500" }
  ];


  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay || isHovered) return;

    const interval = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, isHovered]);


  const handlePrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };


  const handleNext = () => {
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


  return (
    <section className="relative py-16 md:py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
      </div>


      {/* Floating Decorative Elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-12 md:top-20 left-6 md:left-10 text-blue-400/30"
      >
        <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
        className="absolute top-24 md:top-40 right-12 md:right-20 text-purple-400/30"
      >
        <Heart className="w-5 h-5 md:w-6 md:h-6" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
        className="absolute bottom-20 md:bottom-32 left-12 md:left-20 text-indigo-400/30"
      >
        <Zap className="w-5 h-5 md:w-7 md:h-7" />
      </motion.div>


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
            className="inline-flex items-center space-x-1.5 md:space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 shadow-lg"
          >
            <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
            <span>Client Testimonials</span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </motion.div>


          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 md:mb-6"
          >
            What Our Clients
            <span className="block text-blue-600">Are Saying</span>
          </motion.h2>


          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-24 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 md:mb-8 rounded-full"
          />


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
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="text-center p-4 md:p-6 glass-panel rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                animate={pulseAnimation}
                className={`inline-flex p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r ${stat.color} text-white mb-3 md:mb-4 shadow-lg`}
              >
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <div className="font-bold text-xl md:text-2xl lg:text-3xl text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* Desktop Testimonials Grid */}
        <div className="hidden lg:block">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative glass-card p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Premium Badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg"
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Verified</span>
                </motion.div>


                {/* Quote decoration */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-16 h-16 text-blue-500 transform group-hover:scale-110 transition-transform duration-300" />
                </div>


                {/* Testimonial content */}
                <div className="relative z-10 mt-12">
                  <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium relative">
                    <span className="text-4xl text-blue-400 font-serif absolute -top-2 -left-2 opacity-50">&ldquo;</span>
                    <span className="ml-4">{testimonial.text}</span>
                    <span className="text-4xl text-blue-400 font-serif absolute -bottom-6 right-0 opacity-50">&rdquo;</span>
                  </p>
                </div>


                {/* Client information */}
                <div className="flex items-center space-x-4">
                  <div className="relative group/avatar">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover/avatar:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-400/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>


                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mb-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-2 animate-pulse" />
                      {testimonial.location}
                    </p>

                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 transition-all duration-200 ${i < testimonial.rating
                            ? 'text-yellow-400 fill-current drop-shadow-sm'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500 font-medium">
                        {testimonial.rating}.0
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Mobile/Tablet Testimonial Carousel */}
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


          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-10 md:mt-12 space-x-4 md:space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="group p-3 md:p-4 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
            </motion.button>


            {/* Dot Indicators */}
            <div className="flex space-x-1.5 md:space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDotClick(index)}
                  className={`rounded-full transition-all duration-300 ${index === activeIndex
                    ? 'w-6 md:w-8 h-2.5 md:h-3 bg-blue-600 shadow-lg'
                    : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>


            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="group p-3 md:p-4 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>


        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-20 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              onClick={() => {
                navigate("/contact");
                window.scrollTo(0, 0);
              }}
              className="group inline-flex items-center bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
              style={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
            >
              <Heart className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-pink-300 group-hover:text-pink-200 transition-colors duration-200" />
              Share Your Experience
              <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-3 md:mt-4 text-sm md:text-base text-gray-600"
          >
            Join thousands of satisfied clients in our growing community
          </motion.p>
        </motion.div>


        {/* Recognition Section - Two Logos */}
        {/* <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-20 border-t border-gray-200 pt-8 md:pt-12"
        >
          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-xl opacity-30 animate-pulse" />
                    <img
                      src={tsLogo}
                      alt="Startup Tripura Logo"
                      className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain rounded-full bg-white p-2 shadow-md"
                    />
                  </div>
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-center md:text-left"
                >
                  <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed">
                    <span className="font-semibold text-gray-800">Registered Startup under </span>
                    <span className="font-bold text-orange-600">Startup Tripura</span>
                    <span className="text-gray-600">, Government of Tripura.</span>
                  </p>
                </motion.div>


                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs font-bold uppercase">Registered</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>


            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse" />
                    <img
                      src={recognitionLogo}
                      alt="Government Recognition Logo"
                      className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain rounded-full bg-white p-2 shadow-md"
                    />
                  </div>
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center md:text-left"
                >
                  <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed">
                    <span className="font-semibold text-gray-800">Recognised by the </span>
                    <span className="font-bold text-blue-600">Directorate of Information Technology</span>
                    <span className="text-gray-600">, Government of Tripura.</span>
                  </p>
                </motion.div>


                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-gradient-to-r from-blue-400 to-blue-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                    <span className="text-xs font-bold uppercase">Certified</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};


TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
};


export default Testimonials;
