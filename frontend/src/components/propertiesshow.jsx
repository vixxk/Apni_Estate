import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  Eye,
  ArrowRight,
  Building,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Backendurl } from '../App';
import PropTypes from "prop-types";


const PropertyCard = ({ property, index, isMobile }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);


  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };


  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="glass-card rounded-xl overflow-hidden cursor-pointer flex-shrink-0 w-full h-full"
      onClick={handleNavigate}
    >
      {/* Property Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={property.images[0]?.url}
          alt={property.images[0]?.alt || property.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Property Content */}
      <div className="p-4 md:p-5">
        {/* Property badges */}
        <div className="flex gap-2 mb-3">
          <span className="bg-purple-600 text-white text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full capitalize">
            {property.type}
          </span>
          {/* <span className={`text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full capitalize
            ${property.category === 'rent' 
              ? 'bg-green-600 text-white' 
              : 'bg-purple-600 text-white'}`}>
            For {property.category}
          </span> */}
        </div>

        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 flex-shrink-0 text-blue-500" />
          <span className="line-clamp-1 text-xs md:text-sm">{property.location?.city}, {property.location?.state}</span>
        </div>

        {/* Property Features */}
        <div className="flex justify-between items-center py-2 md:py-2.5 border-y border-gray-100 mb-3">
          <div className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
            <span className="text-xs md:text-sm text-gray-600">{property.features?.bedrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
            <span className="text-xs md:text-sm text-gray-600">{property.features?.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
            <span className="text-xs md:text-sm text-gray-600">{property.features?.area || 0} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 font-bold">
            <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <span className="text-base md:text-lg">{Number(property.price).toLocaleString('en-IN')}</span>
          </div>

          <div className="text-xs md:text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center capitalize">
            <Building className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" />
            {property.category}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const PropertiesShow = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();


  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/properties?limit=6`);

        if (response.data.success) {
          setProperties(response.data.data);
        } else {
          setError('Failed to fetch properties');
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);


  // Auto-slide for mobile only
  useEffect(() => {
    if (isMobile && properties.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % properties.length);
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isMobile, properties.length, currentSlide]);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length);
  };


  const viewAllProperties = () => {
    navigate('/properties');
    window.scrollTo(0, 0);
  };


  if (loading) {
    return (
      <div className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 md:h-10 bg-gray-200 rounded w-1/2 md:w-1/3 mx-auto mb-3 md:mb-4"></div>
            <div className="h-4 md:h-5 bg-gray-200 rounded w-1/3 md:w-1/4 mx-auto mb-10 md:mb-16"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow h-80 md:h-96">
                  <div className="h-48 md:h-56 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-600 font-semibold tracking-wide uppercase text-xs md:text-sm"
          >
            Explore Properties
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-3 md:mb-4"
          >
            Featured Properties
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isMobile ? 80 : 96 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-0.5 md:h-1 bg-blue-600 mx-auto mb-4 md:mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium properties designed to match your lifestyle needs
          </motion.p>
        </motion.div>


        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-700 bg-red-50 p-3 md:p-4 rounded-lg border border-red-200 mb-6 md:mb-8 max-w-md mx-auto text-center text-sm md:text-base"
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}


        {properties.length > 0 ? (
          <>
            {/* Mobile: Auto-sliding Carousel */}
            <div className="md:hidden relative">
              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex"
                >
                  {properties.map((property, index) => (
                    <div key={property._id} className="w-full flex-shrink-0 px-4">
                      <PropertyCard
                        property={property}
                        index={index}
                        isMobile={true}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Mobile Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-600 text-gray-700 hover:text-white p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous property"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-600 text-gray-700 hover:text-white p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next property"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Mobile Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-blue-600 w-6'
                      : 'bg-gray-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Simple Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  index={index}
                  isMobile={false}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel text-center py-8 md:py-10 rounded-xl"
          >
            <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">No properties available</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">No properties found.</p>
          </motion.div>
        )}


        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={viewAllProperties}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 font-medium text-sm md:text-base"
          >
            Browse All Properties
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.div>
          </motion.button>
          <p className="text-gray-600 mt-3 md:mt-4 text-xs md:text-sm">
            Discover our complete collection of premium properties
          </p>
        </motion.div>
      </div>
    </section>
  );
};


PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired
};


export default PropertiesShow;
