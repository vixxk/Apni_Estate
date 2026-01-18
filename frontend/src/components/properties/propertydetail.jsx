import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Compass,
  Check,
  X,
  ExternalLink,
  Home as HomeIcon,
  MessageCircle,
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
  const [showCallRequest, setShowCallRequest] = useState(false);
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    "I am interested in this property. Please contact me."
  );

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

  const formatAvailability = (availability) => {
    if (!availability) return "";
    const av = availability.toLowerCase();
    if (av === "sell") return "For Sale";
    if (av === "sale") return "For Sale";
    if (av === "rent") return "For Rent";
    return availability.charAt(0).toUpperCase() + availability.slice(1);
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
      } else if (e.key === "Escape" && showMessageModal) {
        setShowMessageModal(false);
      }
    },
    [property, showSchedule, showMessageModal]
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

  const handleRequestCall = () => {
    setShowMessageModal(true);
  };

  const handleChatClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!property?.owner?._id) {
      alert("Vendor information not available");
      return;
    }

    navigate(`/chat/${property.owner._id}`, {
      state: {
        vendorName: property.owner.name,
        vendorAvatar: property.owner.avatar || null,
      },
    });

  };

  const handleContactVendor = () => {
    setShowMessageModal(true);
  };

  const submitContactRequest = async () => {
    try {
      setContactLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to contact vendor");
        setShowMessageModal(false);
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${Backendurl}/api/contact-requests/create`,
        {
          propertyId: property._id,
          message: customMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowContactSuccess(true);
        setShowMessageModal(false);
        setCustomMessage(
          "I am interested in this property. Please contact me."
        );
        setTimeout(() => setShowContactSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error contacting vendor:", error);
      alert(error.response?.data?.message || "Failed to send contact request");
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/30"
              animate={{
                rotate: [0, 0, 360, 360, 0],
                scale: [1, 0.9, 0.9, 1, 1],
                borderRadius: ["16%", "50%", "50%", "16%", "16%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <HomeIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>

            <motion.div
              className="absolute w-3 h-3 bg-blue-300 rounded-full right-4 bottom-10"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [-30, 0, 30, 0, -30],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute w-2 h-2 bg-indigo-400 rounded-full"
              animate={{
                x: [0, -30, 0, 30, 0],
                y: [30, 0, -30, 0, 30],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            <div
              className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading Property
          </h3>

          <p className="text-sm md:text-base text-gray-600 mb-5 max-w-xs text-center">
            Fetching property details...
          </p>

          <div className="w-48 md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-size-200 absolute top-0 left-0 right-0"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              style={{ backgroundSize: "200% 100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="flex items-center mt-4 text-xs text-blue-600">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"
            />
            <span>Please wait while we load the details</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
        <div className="text-center p-6 md:p-8 glass-panel rounded-xl md:rounded-2xl max-w-md w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h3>
          <p className="text-sm md:text-base text-red-600 mb-6">
            {error || "The property you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back to Properties
          </button>
        </div>
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
      color: "bg-blue-500",
    },
    {
      value: property.baths,
      label: "Bathrooms",
      icon: Bath,
      color: "bg-emerald-500",
    },
    {
      value: property.sqft,
      label: "sq ft",
      icon: Maximize,
      color: "bg-purple-500",
    },
  ].filter((feature) => feature.value > 0);

  const hasContactInfo =
    property.phone || property.email || property.alternatePhone || true;

  return (
    <div className="min-h-screen bg-gray-50 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Call Request Notification */}
        <AnimatePresence>
          {showCallRequest && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 md:top-20 right-3 md:right-4 bg-green-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm md:text-base max-w-[calc(100vw-24px)] md:max-w-md"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="font-semibold">Call request sent!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Success Notification */}
        <AnimatePresence>
          {showContactSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 md:top-20 right-3 md:right-4 bg-green-500 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg z-50 flex items-center gap-2 text-sm md:text-base max-w-[calc(100vw-24px)] md:max-w-md"
            >
              <Check className="w-4 h-4 md:w-5 md:h-5" />
              <p className="font-semibold">
                Contact request sent successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Card */}
        <div className="glass-panel rounded-xl md:rounded-2xl overflow-hidden p-0 border-0">
          {/* Image Gallery */}
          <div className="relative h-[200px] sm:h-[280px] md:h-[400px] lg:h-[500px] bg-gray-900">
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.a
                  key={activeImage}
                  href={images[activeImage]}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-full h-full"
                >
                  <img
                    src={images[activeImage]}
                    alt={`${property.title} - View ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.a>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800">
                  <HomeIcon className="w-10 h-10 md:w-20 md:h-20 mb-2 md:mb-4 opacity-30" />
                  <p className="text-xs md:text-lg font-medium">
                    No images available
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* Gradient overlay */}
            {hasImages && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
            )}

            {/* Share Button - Top Right */}
            <button
              onClick={handleShare}
              className="absolute top-2 md:top-4 right-2 md:right-4 p-2 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all z-10"
            >
              {copySuccess ? (
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              ) : (
                <Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
              )}
            </button>

            {/* Navigation Controls */}
            {hasImages && images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {hasImages && (
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-2.5 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold z-10 border border-white/20">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Property Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-3 md:mb-5">
              {/* Title */}
              <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {property.title}
              </h1>

              {/* Location */}
              {property.location && (
                <div className="flex items-start gap-1.5 md:gap-2 text-gray-600 mb-3">
                  <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-xs sm:text-sm md:text-base">
                    {property.location}
                  </span>
                </div>
              )}

              {/* Mobile: Price*/}
              <div className="lg:hidden mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 shadow-md w-full">
                  <p className="text-white/80 text-[10px] font-medium mb-0.5">
                    Price
                  </p>
                  <p className="text-xl font-bold text-white">
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Mobile: Property Type Badge */}
              {property.type && (
                <div className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-100 rounded-lg border border-purple-200 mb-3">
                  <Building className="w-3 h-3 text-purple-600 flex-shrink-0" />
                  <span className="text-purple-900 font-semibold text-xs">
                    {property.type}
                  </span>
                </div>
              )}

              {/* Desktop: Price and Type */}
              <div className="hidden lg:flex lg:items-center lg:justify-between lg:mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 shadow-lg min-w-[240px]">
                  <p className="text-white/80 text-xs font-medium mb-1">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-white">
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </p>
                </div>

                {property.type && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl border border-purple-200">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-900 font-semibold text-sm">
                      {property.type}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features Grid */}
            {propertyFeatures.length > 0 && (
              <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-5">
                {propertyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 p-2.5 md:p-4 rounded-lg md:rounded-xl text-center border border-gray-200"
                    >
                      <div
                        className={`w-7 h-7 md:w-10 md:h-10 ${feature.color} rounded-md md:rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2`}
                      >
                        <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                      </div>
                      <p className="text-base md:text-2xl font-bold text-gray-900 mb-0.5">
                        {feature.value}
                      </p>
                      <p className="text-[10px] md:text-sm text-gray-600 font-medium">
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
              {/* Left Column - CTA & Contact */}
              <div className="lg:col-span-1 space-y-3">
                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-1 lg:gap-3">
                  {/* Contact Vendor Button */}
                  {/* <button
                    onClick={handleContactVendor}
                    disabled={contactLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-1.5 text-sm md:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Contact</span>
                  </button> */}

                  {/* Schedule Viewing Button */}
                  <button
                    onClick={() => setShowSchedule(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-1.5 text-sm md:text-base font-semibold"
                  >
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Schedule</span>
                  </button>
                </div>

                {/* Contact Card */}
                {hasContactInfo && (
                  <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-4">
                    <h2 className="text-sm md:text-base font-bold mb-2 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-600 rounded-md">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      Contact Details
                    </h2>
                    <div className="space-y-2">
                      {/* Request Call Button */}
                      <button
                        onClick={handleRequestCall}
                        className="w-full flex items-center gap-2 p-2.5 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="p-1.5 bg-blue-100 rounded-md">
                          <Phone className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] md:text-xs text-gray-500 font-medium">
                            Contact
                          </p>
                          <p className="text-xs md:text-sm text-gray-900 font-semibold">
                            Request a Call
                          </p>
                        </div>
                      </button>

                      {/* Chat Button */}
                      <button
                        onClick={handleChatClick}
                        className="w-full flex items-center gap-2 p-2.5 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="p-1.5 bg-emerald-100 rounded-md">
                          <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] md:text-xs text-gray-500 font-medium">
                            Message
                          </p>
                          <p className="text-xs md:text-sm text-gray-900 font-semibold">
                            Start Chat
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-3 md:space-y-4">
                {/* Description */}
                <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5">
                  <h2 className="text-sm md:text-lg font-bold mb-2 md:mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 md:h-6 bg-blue-600 rounded-full"></div>
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-xs md:text-base">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5">
                  <h2 className="text-sm md:text-lg font-bold mb-2 md:mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 md:h-6 bg-emerald-600 rounded-full"></div>
                    Amenities & Features
                  </h2>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-blue-50 rounded-md md:rounded-lg border border-blue-100"
                        >
                          <div className="p-1 bg-blue-600 rounded-sm flex-shrink-0">
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                          </div>
                          <span className="text-[10px] md:text-sm font-semibold text-gray-800 leading-tight">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 md:py-6 text-gray-400">
                      <Building className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs md:text-sm">
                        No amenities information available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Card */}
        {property.location && (
          <div className="mt-3 md:mt-5 bg-white rounded-lg md:rounded-xl p-3 md:p-5 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 md:p-2 bg-red-500 rounded-md md:rounded-lg">
                <Compass className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900">
                  Location
                </h3>
                <p className="text-[10px] md:text-sm text-gray-600">
                  Find this property on the map
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md md:rounded-lg p-2.5 md:p-4 mb-3 border border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-800 font-medium text-xs md:text-base">
                  {property.location}
                </p>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                property.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xs md:text-base"
            >
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              View on Google Maps
              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </a>
          </div>
        )}

        {/* Message Modal */}
        <AnimatePresence>
          {showMessageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3"
              onClick={() => setShowMessageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[85vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 md:p-5 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-xl font-bold text-white">
                          Contact Vendor
                        </h3>
                        <p className="text-[10px] md:text-sm text-white/80">
                          Send your message to the property owner
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-3 md:p-5">
                  {/* Property Info */}
                  <div className="bg-gray-50 rounded-lg p-2.5 md:p-4 mb-3 md:mb-4 border border-gray-200">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HomeIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-base font-bold text-gray-900 mb-1 truncate">
                          {property.title}
                        </h4>
                        <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 text-[10px] md:text-sm">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <p className="text-blue-600 font-semibold text-xs md:text-base mt-1">
                          ₹{Number(property.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="mb-3 md:mb-4">
                    <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write your message to the vendor..."
                      maxLength={500}
                      rows={4}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-base resize-none"
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-[10px] md:text-xs text-gray-500">
                        Maximum 500 characters
                      </p>
                      <p className="text-[10px] md:text-xs font-semibold text-gray-700">
                        {customMessage.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Quick Templates */}
                  <div className="mb-3 md:mb-4">
                    <p className="text-[10px] md:text-xs font-semibold text-gray-700 mb-1.5">
                      Quick Templates:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "I am interested in this property. Please contact me.",
                        "I would like to schedule a viewing. When is convenient?",
                        "Is this property still available? I'm very interested.",
                        "Can you provide more details about this property?",
                      ].map((template, index) => (
                        <button
                          key={index}
                          onClick={() => setCustomMessage(template)}
                          className="px-2.5 py-1.5 text-[10px] md:text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                          {template.length > 35
                            ? template.substring(0, 32) + "..."
                            : template}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={() => setShowMessageModal(false)}
                      disabled={contactLoading}
                      className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs md:text-base transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitContactRequest}
                      disabled={contactLoading || !customMessage.trim()}
                      className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg text-white rounded-lg font-semibold text-xs md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {contactLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
};

export default PropertyDetails;
