import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing";

const PropertyDetails = () => {
  const { id } = useParams();
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
      s = s
        .replace(/\\\\/g, "\\")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");
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
          };

          setProperty(mapped);
          setError(null);
        } else {
          setError(
            response.data.message || "Failed to load property details."
          );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Property not found."}</p>
          <Link
            to="/properties"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
          </Link>
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
    { value: property.beds, label: "Beds", icon: BedDouble },
    { value: property.baths, label: "Baths", icon: Bath },
    { value: property.sqft, label: "sqft", icon: Maximize },
  ].filter((feature) => feature.value > 0);

  const hasContactInfo =
    property.phone || property.email || property.alternatePhone;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <nav className="flex items-center justify-between mb-3 md:mb-8">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600 flex items-center gap-1">
                <Copy className="w-5 h-5" />
                <span className="hidden sm:inline">Copied!</span>
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-[280px] sm:h-[400px] md:h-[500px] bg-gray-100 rounded-t-xl overflow-hidden mb-0">
            <AnimatePresence mode="wait">
              {hasImages ? (
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${property.title} - View ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No images available
                </div>
              )}
            </AnimatePresence>

            {hasImages && images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </>
            )}

            {hasImages && (
              <div
                className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 
              bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm"
              >
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>

          <div className="p-4 md:p-8">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className="flex-1 pr-2">
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                  {property.title}
                </h1>
                {property.location && (
                  <div className="flex items-center text-gray-600 text-sm md:text-base">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{property.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <div className="bg-blue-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    Available for {property.availability}
                  </p>
                </div>

                {propertyFeatures.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                    {propertyFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 md:p-4 rounded-lg text-center"
                        >
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mx-auto mb-1 md:mb-2" />
                          <p className="text-xs md:text-sm text-gray-600">
                            {feature.value}{" "}
                            {feature.label === "sqft"
                              ? feature.label
                              : feature.value > 1
                              ? feature.label
                              : feature.label.slice(0, -1)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => setShowSchedule(true)}
                  className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg 
                    hover:bg-blue-700 transition-colors flex items-center 
                    justify-center gap-2 text-sm md:text-base mb-4 md:mb-6"
                >
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  Schedule Viewing
                </button>

                {hasContactInfo && (
                  <div className="mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                      Contact Details
                    </h2>
                    <div className="space-y-2 md:space-y-3">
                      {property.phone && (
                        <div className="flex items-center text-gray-600 text-sm md:text-base">
                          <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                          <a
                            href={`tel:${property.phone}`}
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {property.phone}
                          </a>
                        </div>
                      )}
                      {property.alternatePhone && (
                        <div className="flex items-center text-gray-600 text-sm md:text-base">
                          <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                          <a
                            href={`tel:${property.alternatePhone}`}
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {property.alternatePhone}
                          </a>
                        </div>
                      )}
                      {property.email && (
                        <div className="flex items-center text-gray-600 text-sm md:text-base">
                          <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-blue-600 flex-shrink-0" />
                          <a
                            href={`mailto:${property.email}`}
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {property.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {property.description}
                  </p>
                </div>

                <div className="mb-0 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Amenities</h2>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 md:px-3 md:py-1 rounded-full
                            bg-blue-50 text-blue-700 text-xs md:text-sm border border-blue-100"
                        >
                          <Building className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-blue-500" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm">
                      No amenities information available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {property.location && (
          <div className="mt-4 md:mt-8 p-4 md:p-6 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2 md:mb-4">
              <Compass className="w-4 h-4 md:w-5 md:h-5" />
              <h3 className="text-base md:text-lg font-semibold">Location</h3>
            </div>
            <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">{property.location}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                property.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm md:text-base"
            >
              <MapPin className="w-4 h-4" />
              View on Google Maps
            </a>
          </div>
        )}

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
