import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  User,
} from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios";
import { Backendurl } from "../../App";

const PropertyCard = ({ property, viewType, favourites, onFavouritesChange }) => {
  const isGrid = viewType === "grid";
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const token = localStorage.getItem("token");
  const isFavourite = favourites?.some((p) => p === property._id);

  let imagesArray = [];

  if (Array.isArray(property.images) && property.images.length > 0) {
    imagesArray = property.images
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean);
  } else if (property.image) {
    imagesArray = [property.image];
  }

  const images = imagesArray;
  const mainImage = images[currentImageIndex] || images[0] || "/no-image.png";
  const imagesCount = images.length;

  const vendorName = property.owner?.name || "Unknown Vendor";
  const vendorAvatar = property.owner?.avatar || null;
  const vendorId = property.owner?._id || property.owner;

  const handleNavigateToDetails = () => {
    navigate(`/properties/single/${property._id}`);
  };

  const handleNavigateToVendorProfile = (e) => {
    e.stopPropagation();
    if (vendorId) {
      navigate(`/vendor/${vendorId}`);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/properties/single/${property._id}`;
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    if (imagesCount === 0) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    }
  };
  const handleToggleFavourite = async (e) => {
    e.stopPropagation();
    if (!token) {
      alert("Please sign in to save properties.");
      return;
    }

    // Determine action before API call
    const action = isFavourite ? "remove" : "add";

    onFavouritesChange?.(property._id, action);

    try {
      const { data } = await axios.post(
        `${Backendurl}/api/users/saved/toggle`,
        { propertyId: property._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const serverAction = data?.message?.includes("removed") ? "remove" : "add";

      // If server response differs from optimistic update, revert
      if (serverAction !== action) {
        onFavouritesChange?.(property._id, serverAction);
      }
    } catch (err) {
      console.error("Toggle favourite error:", err);

      const revertAction = action === "remove" ? "add" : "remove";
      onFavouritesChange?.(property._id, revertAction);

      alert("Failed to update favourites");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group glass-card rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300
        ${isGrid ? "flex flex-col" : "flex flex-col sm:flex-row gap-4 sm:gap-6"}`}
      onClick={handleNavigateToDetails}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* IMAGE SECTION - Compact on mobile */}
      <div className={`relative ${isGrid ? "h-40 sm:h-48 md:h-64" : "h-40 sm:h-auto sm:w-80"}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={mainImage}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Image navigation controls */}
        {showControls && imagesCount > 1 && (
          <div className="hidden sm:flex absolute inset-0 items-center justify-between px-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => handleImageNavigation(e, "prev")}
              className="p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => handleImageNavigation(e, "next")}
              className="p-1 rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </motion.button>
          </div>
        )}

        {/* Image indicators */}
        {imagesCount > 1 && (
          <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 sm:gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300
                  ${index === currentImageIndex ? "bg-white w-1.5 sm:w-3" : "bg-white/60"}`}
              />
            ))}
          </div>
        )}

        {/* Favourite & share buttons -   on mobile */}
        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-col gap-1 sm:gap-1.5 md:gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleToggleFavourite}
            className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-blue-50 
              transition-colors shadow-lg"
          >
            <Bookmark
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavourite ? "text-blue-600 fill-blue-600" : "text-gray-700"
                }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleShare}
            className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-blue-50 
              transition-colors shadow-lg"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
          </motion.button>
        </div>

        {/* Property tags  */}
        {/* <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex flex-col gap-1 sm:gap-1.5 md:gap-2 max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)]">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white 
              px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold shadow-lg inline-block w-fit max-w-full truncate"
          >
            {property.type}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white 
              px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold shadow-lg inline-block w-fit max-w-full truncate"
          >
            {property.availability}
          </motion.span>
        </div> */}

        {/* Vendor Avatar -   on mobile */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          onClick={handleNavigateToVendorProfile}
          className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 cursor-pointer"
          title={`View ${vendorName}'s profile`}
        >
          <div className="relative">
            {vendorAvatar ? (
              <img
                src={vendorAvatar}
                alt={vendorName}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg bg-blue-600 flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </motion.div>
      </div>

      {/* CONTENT SECTION - Compact on mobile */}
      <div className={`flex-1 p-2.5 sm:p-4 md:p-6 ${isGrid ? "" : "flex flex-col justify-between"}`}>
        <div className="space-y-1 sm:space-y-2 md:space-y-4">
          {/* Vendor name */}
          <div className="hidden sm:flex items-center justify-between">
            <div
              className="flex items-center text-gray-500 text-xs sm:text-sm hover:text-blue-600 cursor-pointer transition-colors"
              onClick={handleNavigateToVendorProfile}
            >
              <span className="font-medium truncate">{vendorName}</span>
            </div>
          </div>

          {/* Location -   text on mobile */}
          <div className="flex items-center text-gray-500 text-[10px] sm:text-xs md:text-sm">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <h3
            className="text-sm sm:text-base md:text-xl font-semibold text-gray-900 line-clamp-2
            group-hover:text-blue-600 transition-colors leading-tight pr-2"
          >
            {property.title}
          </h3>

          {/* Price - Compact on mobile */}
          <div className="flex items-center gap-1">
            <div className="flex-1">
              <p className="text-[9px] sm:text-xs md:text-sm text-gray-500 mb-0.5 hidden sm:block">Price</p>
              <div className="flex items-center gap-0.5">
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="text-sm sm:text-lg md:text-2xl font-bold text-blue-600">
                  {Number(property.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features - HIDDEN ON MOBILE, VISIBLE ON SM+ */}
        <div className="hidden sm:grid grid-cols-3 gap-2 md:gap-3 mt-3 md:mt-6">
          <div className="flex flex-col items-center gap-0.5 bg-blue-50 p-1.5 md:p-2 rounded-lg">
            <BedDouble className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <span className="text-xs md:text-sm font-medium text-gray-600 text-center leading-tight">
              {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 bg-blue-50 p-1.5 md:p-2 rounded-lg">
            <Bath className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <span className="text-xs md:text-sm font-medium text-gray-600 text-center leading-tight">
              {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 bg-blue-50 p-1.5 md:p-2 rounded-lg">
            <Maximize className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <span className="text-xs md:text-sm font-medium text-gray-600 text-center leading-tight">
              {property.sqft} sqft
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  viewType: PropTypes.string.isRequired,
  favourites: PropTypes.array,
  onFavouritesChange: PropTypes.func,
};

export default PropertyCard;
