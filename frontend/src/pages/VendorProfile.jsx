import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  ArrowLeft,
  Home,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Backendurl } from "../App";
import PropertyCard from "../components/properties/Propertycard";

const VendorProfile = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVendorData();
    fetchFavourites();
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);

      // Fetch vendor info
      const vendorRes = await axios.get(`${Backendurl}/api/users/vendor/${vendorId}`);
      
      // Fetch vendor's properties
      const propertiesRes = await axios.get(
        `${Backendurl}/api/properties?owner=${vendorId}`
      );

      // Helper: Convert location object to string
      const toFullUrl = (val) => {
        if (!val) return null;
        if (/^https?:\/\//i.test(val)) return val;
        return `${Backendurl}${val.startsWith("/") ? val : `/${val}`}`;
      };

      // Map properties to handle location object
      const mappedProperties = (propertiesRes.data.data || []).map((p) => {
        // Handle images
        let firstImage = null;
        if (Array.isArray(p.images) && p.images.length > 0) {
          firstImage = toFullUrl(p.images[0].url || p.images[0]);
        }

        // FIX: Handle location object properly - convert to string
        let locationString = "";
        if (typeof p.location === "string") {
          locationString = p.location;
        } else if (typeof p.location === "object" && p.location !== null) {
          const parts = [
            p.location.address,
            p.location.city,
            p.location.state,
            p.location.pincode
          ].filter(Boolean);
          locationString = parts.join(", ");
        }

        return {
          ...p,
          location: locationString || "Location not specified",
          beds: p.features?.bedrooms ?? 0,
          baths: p.features?.bathrooms ?? 0,
          sqft: p.features?.area ?? 0,
          availability: p.category || p.availability || p.status,
          images: Array.isArray(p.images)
            ? p.images.map((img) => toFullUrl(img.url || img))
            : firstImage
            ? [firstImage]
            : [],
          image: firstImage,
          owner: p.owner,
        };
      });

      setVendor(vendorRes.data.data);
      setProperties(mappedProperties);
      setError(null);
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setError("Failed to load vendor profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${Backendurl}/api/users/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedProps = data?.data?.properties || [];
      setFavourites(savedProps.map((p) => p._id));
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleFavouritesChange = (propertyId, action) => {
    setFavourites((prev) => {
      if (action === "add") {
        return prev.includes(propertyId) ? prev : [...prev, propertyId];
      }
      if (action === "remove") {
        return prev.filter((id) => id !== propertyId);
      }
      return prev;
    });
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
          {/* Animated loader with proper centering */}
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
              <User className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
              Loading Vendor Profile
            </h3>
            <p className="text-gray-600 font-medium">Please wait a moment...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-100"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-red-600 font-medium mb-6">{error || "Vendor not found"}</p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
          >
            Back to Properties
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate stats
  const stats = [
    {
      icon: Building2,
      label: "Properties",
      value: properties.length,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Active Listings",
      value: properties.filter(p => p.status === "active" || p.availability === "For Sale" || p.availability === "For Rent").length,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Award,
      label: "Member Since",
      value: vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : "2024",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 pt-20 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button - Improved */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-all duration-300 font-medium"
        >
          <motion.div
            className="p-2 rounded-xl bg-white shadow-md group-hover:shadow-lg group-hover:bg-blue-50 transition-all duration-300"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.div>
          <span>Back</span>
        </motion.button>

        {/* Vendor Header Card - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Decorative background gradient */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]"></div>
          </div>

          <div className="relative pt-32 pb-8 px-6 sm:px-8 lg:px-12">
            {/* Avatar - Centered on mobile, left on desktop */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative -mt-20 lg:-mt-16"
              >
                {vendor.avatar ? (
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-36 h-36 lg:w-40 lg:h-40 rounded-3xl object-cover border-8 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center border-8 border-white shadow-2xl">
                    <User className="w-20 h-20 text-white" />
                  </div>
                )}
                {/* Online status indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-white rounded-full"
                  ></motion.div>
                </motion.div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
                >
                  {vendor.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold text-sm shadow-lg mb-4"
                >
                  <Award className="w-4 h-4" />
                  {vendor.role === "vendor" ? "Verified Property Vendor" : vendor.role}
                </motion.div>

                {/* Contact Info Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
                >
                  {vendor.email && (
                    <a
                      href={`mailto:${vendor.email}`}
                      className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                          {vendor.email}
                        </p>
                      </div>
                    </a>
                  )}
                  {vendor.phone && (
                    <a
                      href={`tel:${vendor.phone}`}
                      className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{vendor.phone}</p>
                      </div>
                    </a>
                  )}
                  {vendor.location && (
                    <div className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                          {vendor.location || "Not specified"}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`${stat.bgColor} rounded-2xl p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Properties Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Listed Properties
                </h2>
                <p className="text-gray-600 font-medium">
                  {properties.length} {properties.length === 1 ? "property" : "properties"} available
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <PropertyCard
                    property={property}
                    viewType="grid"
                    favourites={favourites}
                    onFavouritesChange={handleFavouritesChange}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-gray-100"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Home className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Properties Listed Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                This vendor hasn't added any properties to their portfolio. Check back later for new listings!
              </p>
              <button
                onClick={() => navigate("/properties")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
              >
                Explore Other Properties
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VendorProfile;
