import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

import LoadingState from "./property-details/LoadingState";
import ErrorState from "./property-details/ErrorState";
import ImageGallery from "./property-details/ImageGallery";
import PropertyHeader from "./property-details/PropertyHeader";
import FeaturesGrid from "./property-details/FeaturesGrid";
import ContactCard from "./property-details/ContactCard";
import PropertyDescription from "./property-details/PropertyDescription";
import LocationCard from "./property-details/LocationCard";
import MessageModal from "./property-details/MessageModal";
import { Backendurl } from "../../../App.jsx";
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
      // If we have multiple items, assume it's a valid list already
      if (s.length > 1) {
        return s.map(item => String(item).trim()).filter(Boolean);
      }
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
    return <LoadingState />;
  }

  if (error || !property) {
    return <ErrorState error={error} />;
  }

  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : [];
  const hasImages = Array.isArray(images) && images.length > 0;

  // Features calculation moved to FeaturesGrid component

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
          <ImageGallery
            images={images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            property={property}
            handleShare={handleShare}
            copySuccess={copySuccess}
          />

          {/* Property Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <PropertyHeader property={property} />

            {/* Features Grid */}
            <FeaturesGrid property={property} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5">
              <ContactCard
                hasContactInfo={hasContactInfo}
                setShowSchedule={setShowSchedule}
                handleRequestCall={handleRequestCall}
                handleChatClick={handleChatClick}
              />

              <PropertyDescription property={property} />
            </div>
          </div>
        </div>

        {/* Location Card */}
        <LocationCard property={property} />

        {/* Message Modal */}
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          property={property}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
          submitContactRequest={submitContactRequest}
          contactLoading={contactLoading}
        />

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
