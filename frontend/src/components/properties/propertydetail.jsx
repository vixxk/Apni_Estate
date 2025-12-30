import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
  Mail,
  Check,
  X,
  User,
  Loader2,
  ExternalLink,
  Home as HomeIcon,
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const normalizeAmenities = (raw) => {
    if (!raw) return [];

    let s = raw;

    if (Array.isArray(s)) {
      if (s.length === 0) return [];
      s = s[0];
    }

    if (typeof s !== "string") s = String(s);

    s = s.trim();
    if (
      (s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))
    ) {
      s = s.slice(1, -1);
    }

    for (let i = 0; i < 4; i++) {
      s = s.replace(/\\\\/g, "\\").replace(/\\"/g, '"').replace(/\\'/g, "'");
    }

    const trimmed = s.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const jsonLike = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(jsonLike);
        if (Array.isArray(parsed)) {
          return parsed.map((a) => String(a).trim()).filter(Boolean);
        }
        return [String(parsed).trim()];
      } catch {
        // ignore
      }
    }

    return trimmed
      .split(",")
      .map((a) =>
        a
          .replace(/[\[\]"']/g, "")
          .replace(/\\/g, "")
          .trim()
      )
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${Backendurl}/api/properties/${id}`);

        if (response.data.success) {
          const p =
            response.data.data?.property ||
            response.data.data ||
            response.data.property;

          if (!p) {
            setError("Property not found.");
            setProperty(null);
            return;
          }

          const toFullUrl = (val) => {
            if (!val) return null;
            if (/^https?:\/\//i.test(val)) return val;
            return `${Backendurl}${val.startsWith("/") ? val : `/${val}`}`;
          };

          let imagesArray = [];

          if (Array.isArray(p.images) && p.images.length > 0) {
            imagesArray = p.images
              .map((img) =>
                typeof img === "string" ? toFullUrl(img) : toFullUrl(img?.url)
              )
              .filter(Boolean);
          } else if (Array.isArray(p.image) && p.image.length > 0) {
            imagesArray = p.image.map((url) => toFullUrl(url)).filter(Boolean);
          } else if (typeof p.image === "string") {
            imagesArray = [toFullUrl(p.image)];
          }

          const firstImage = imagesArray[0] || null;

          const amenitiesSource =
            p.amenities ||
            p.Amenities ||
            p.features?.amenities ||
            p.features?.Amenities;

          const mapped = {
            _id: p._id,
            title: p.title,
            description: p.description,
            price: p.price,
            type: p.type || p.propertyType,
            location:
              typeof p.location === "string"
                ? p.location
                : p.location?.city ||
                  p.location?.address ||
                  p.location?.state ||
                  "",
            beds: p.features?.bedrooms ?? p.beds ?? 0,
            baths: p.features?.bathrooms ?? p.baths ?? 0,
            sqft: p.features?.area ?? p.sqft ?? 0,
            availability:
              p.availability ||
              p.category ||
              (p.status === "available" ? "sale" : "rent"),
            phone:
              p.contactInfo?.phone ||
              p.phone ||
              p.contactNumber ||
              p.contactInfo?.phoneNumber ||
              "",
            email:
              p.contactInfo?.email ||
              p.email ||
              p.contactEmail ||
              p.ownerEmail ||
              "",
            alternatePhone:
              p.contactInfo?.alternatePhone ||
              p.alternatePhone ||
              p.contactInfo?.alternatePhoneNumber ||
              "",
            amenities: normalizeAmenities(amenitiesSource),
            image: firstImage,
            images: imagesArray,
            owner: p.owner,
          };

          setProperty(mapped);
          setError(null);
        } else {
          setError(response.data.message || "Failed to load property details.");
          setProperty(null);
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const handleKeyNavigation = useCallback(
    (e) => {
      const images =
        Array.isArray(property?.images) && property.images.length > 0
          ? property.images
          : property?.image
          ? [property.image]
          : [];
      if (!images.length) return;

      if (e.key === "ArrowLeft") {
        setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape" && showSchedule) {
        setShowSchedule(false);
      }
    },
    [property, showSchedule]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type}: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // FIXED: Properly centered loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Animated loader */}
          <div className="relative mb-6 mx-auto w-32 h-32 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-blue-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
            </motion.div>

            {/* Middle rotating ring */}
            <motion.div
              className="absolute inset-3 rounded-full border-4 border-indigo-200"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
            </motion.div>

            {/* Center icon */}
            <motion.div
              className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <HomeIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              Loading Property
            </h3>
            <p className="text-gray-600 font-medium">Please wait a moment...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-100"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h3>
          <p className="text-red-600 font-medium mb-6">
            {error || "The property you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </button>
        </motion.div>
      </div>
    );
  }

  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : [];
  const hasImages = Array.isArray(images) && images.length > 0;

  const propertyFeatures = [
    {
      value: property.beds,
      label: "Bedrooms",
      icon: BedDouble,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: property.baths,
      label: "Bathrooms",
      icon: Bath,
      color: "from-emerald-500 to-teal-500",
    },
    {
      value: property.sqft,
      label: "sq ft",
      icon: Maximize,
      color: "from-purple-500 to-pink-500",
    },
  ].filter((feature) => feature.value > 0);

  const hasContactInfo =
    property.phone || property.email || property.alternatePhone;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 pt-20 pb-20 md:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Navigation Bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 md:mb-8"
        >
          <motion.button
            onClick={() => navigate("/properties")}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium"
          >
            <div className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg group-hover:bg-blue-50 transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Back to Properties</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <AnimatePresence mode="wait">
              {copySuccess ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-green-600 flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span className="hidden sm:inline">Copied!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="share"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Share</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Enhanced Image Gallery with gradient overlay for better text contrast */}
          <div className="relative h-[320px] sm:h-[450px] lg:h-[550px] bg-gray-900 rounded-t-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.a
                  key={activeImage}
                  href={images[activeImage]}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="block w-full h-full cursor-zoom-in"
                >
                  <img
                    src={images[activeImage]}
                    alt={`${property.title} - View ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.a>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                  <HomeIcon className="w-20 h-20 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No images available</p>
                </div>
              )}
            </AnimatePresence>

            {/* Gradient overlay for better contrast */}
            {hasImages && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
            )}

            {/* Navigation Controls - Enhanced */}
            {hasImages && images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full
                    bg-white/90 backdrop-blur-md hover:bg-white shadow-xl transition-all duration-300 z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full
                    bg-white/90 backdrop-blur-md hover:bg-white shadow-xl transition-all duration-300 z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                </motion.button>
              </>
            )}

            {/* Image Counter - Enhanced */}
            {hasImages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-2 md:bottom-4 left-[45%] -translate-x-1/2
  bg-black/75 backdrop-blur-md text-white px-4 py-2 md:px-5 md:py-2.5
  rounded-full text-sm md:text-base font-semibold shadow-lg z-10 border border-white/20
  lg:hidden"
              >
                {activeImage + 1} / {images.length}
              </motion.div>
            )}

            {/* Thumbnail Strip - Desktop Only */}
            {hasImages && images.length > 1 && (
              <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-10">
                {images.slice(0, 5).map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === idx
                        ? "border-white shadow-xl scale-105"
                        : "border-white/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
                {images.length > 5 && (
                  <div className="w-16 h-16 rounded-lg bg-black/70 backdrop-blur-md flex items-center justify-center text-white text-sm font-semibold border-2 border-white/50">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Property Content */}
          <div className="p-6 md:p-10 lg:p-12">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
                  >
                    {property.title}
                  </motion.h1>
                  {property.location && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span className="text-base md:text-lg">
                        {property.location}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Price Card - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="lg:min-w-[280px]"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Price
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-white text-sm font-semibold">
                        For {property.availability}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Property Type Badge */}
              {property.type && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200"
                >
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-900 font-semibold text-sm">
                    {property.type}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Features Grid - Enhanced */}
            {propertyFeatures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 md:gap-6 mb-8"
              >
                {propertyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 md:p-6 rounded-2xl text-center border-2 border-white shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                      >
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        {feature.value}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        {feature.label}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Left Column - CTA & Contact */}
              <div className="lg:col-span-1 space-y-6">
                {/* Schedule Viewing Button - Enhanced */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSchedule(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl 
                    hover:shadow-2xl transition-all duration-300 flex items-center 
                    justify-center gap-3 text-base md:text-lg font-semibold relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
                  <span className="relative z-10">Schedule Viewing</span>
                </motion.button>

                {/* Contact Card - Enhanced */}
                {hasContactInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-white shadow-lg"
                  >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      Contact Details
                    </h2>
                    <div className="space-y-3">
                      {property.phone && (
                        <a
                          href={`tel:${property.phone}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Primary
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {property.phone}
                            </p>
                          </div>
                        </a>
                      )}
                      {property.alternatePhone && (
                        <a
                          href={`tel:${property.alternatePhone}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                            <Phone className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Alternate
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {property.alternatePhone}
                            </p>
                          </div>
                        </a>
                      )}
                      {property.email && (
                        <a
                          href={`mailto:${property.email}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <Mail className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Email
                            </p>
                            <p className="text-gray-900 font-semibold truncate">
                              {property.email}
                            </p>
                          </div>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Owner Link - New Feature */}
                {/* {property.owner && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/vendor/${property.owner}`)}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      View Owner Profile
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </motion.button>
                )} */}
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {property.description}
                  </p>
                </motion.div>

                {/* Amenities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                    Amenities & Features
                  </h2>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm md:text-base font-semibold text-gray-800">
                            {amenity}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm md:text-base">
                        No amenities information available
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Card - Enhanced */}
        {property.location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Location</h3>
                <p className="text-gray-600">Find this property on the map</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-800 font-medium text-lg">
                  {property.location}
                </p>
              </div>
            </div>

            <motion.a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                property.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-base md:text-lg group"
            >
              <MapPin className="w-5 h-5 group-hover:animate-bounce" />
              View on Google Maps
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          </motion.div>
        )}

        {/* Schedule Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
