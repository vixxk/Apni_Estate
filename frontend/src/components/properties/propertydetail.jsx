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

  const handleRequestCall = () => {
    setShowCallRequest(true);
    setTimeout(() => {
      setShowCallRequest(false);
    }, 3000);
  };

  const handleChatClick = () => {
    navigate("/chat");
  };

  // Simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h3>
          <p className="text-red-600 mb-6">
            {error || "The property you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
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
    property.phone || property.email || property.alternatePhone;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/properties")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <div className="p-2 rounded-xl bg-white shadow hover:shadow-md transition-shadow">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Back to Properties</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow hover:shadow-md transition-shadow font-medium"
          >
            {copySuccess ? (
              <span className="text-green-600 flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span className="hidden sm:inline">Copied!</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 text-gray-700">
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </span>
            )}
          </button>
        </nav>

        {/* Call Request Notification */}
        {showCallRequest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <p className="font-semibold">Call request sent successfully!</p>
          </motion.div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[320px] sm:h-[450px] lg:h-[550px] bg-gray-900">
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
                  <HomeIcon className="w-20 h-20 mb-4 opacity-30" />
                  <p className="text-lg font-medium">No images available</p>
                </div>
              )}
            </AnimatePresence>

            {/* Gradient overlay */}
            {hasImages && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
            )}

            {/* Navigation Controls */}
            {hasImages && images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {hasImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-5 py-2.5 rounded-full font-semibold z-10 border border-white/20">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Property Content */}
          <div className="p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {property.title}
                  </h1>
                  {property.location && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-6 h-6 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  )}
                </div>

                {/* Price Card */}
                <div className="lg:min-w-[280px]">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg">
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Price
                    </p>
                    <p className="text-4xl font-bold text-white mb-2">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-white text-sm font-semibold">
                        For {property.availability}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Type Badge */}
              {property.type && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl border border-purple-200">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-900 font-semibold text-sm">
                    {property.type}
                  </span>
                </div>
              )}
            </div>

            {/* Features Grid */}
            {propertyFeatures.length > 0 && (
              <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
                {propertyFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-50 p-5 md:p-6 rounded-2xl text-center border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        {feature.value}
                      </p>
                      <p className="text-sm md:text-base text-gray-600 font-medium">
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - CTA & Contact */}
              <div className="lg:col-span-1 space-y-6">
                {/* Schedule Viewing Button */}
                <button
                  onClick={() => setShowSchedule(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-3 text-lg font-semibold"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Schedule Viewing</span>
                </button>

                {/* Contact Card */}
                {hasContactInfo && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      Contact Details
                    </h2>
                    <div className="space-y-3">
                      {/* Request Call Button */}
                      <button
                        onClick={handleRequestCall}
                        className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500 font-medium">
                            Contact
                          </p>
                          <p className="text-gray-900 font-semibold">
                            Request a Call
                          </p>
                        </div>
                      </button>

                      {/* Chat Button */}
                      <button
                        onClick={handleChatClick}
                        className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500 font-medium">
                            Message
                          </p>
                          <p className="text-gray-900 font-semibold">Start Chat</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {property.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-8 bg-emerald-600 rounded-full"></div>
                    Amenities & Features
                  </h2>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow"
                        >
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm md:text-base font-semibold text-gray-800">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No amenities information available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Card */}
        {property.location && (
          <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500 rounded-xl">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Location</h3>
                <p className="text-gray-600">Find this property on the map</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-800 font-medium text-lg">
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
              className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              <MapPin className="w-5 h-5" />
              View on Google Maps
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
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
    </div>
  );
};

export default PropertyDetails;
