import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Building2,
  ArrowLeft,
  Home,
  MapPin,
  Award,
  TrendingUp,
  MessageCircle,
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
  const [showCallRequest, setShowCallRequest] = useState(false);


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


        // Handle location object properly - convert to string
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


  const handleRequestCall = () => {
    setShowCallRequest(true);
    // Simulate request completion
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
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-sm md:text-base text-gray-600 font-medium">Loading vendor profile...</p>
        </div>
      </div>
    );
  }


  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
        <div className="text-center p-6 md:p-8 bg-white rounded-xl md:rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <User className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-sm md:text-base text-red-600 mb-4 md:mb-6">{error || "Vendor not found"}</p>
          <button
            onClick={() => navigate("/properties")}
            className="px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm md:text-base"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }


  // Calculate stats
  const stats = [
    {
      icon: Building2,
      label: "Properties",
      value: properties.length,
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Active Listings",
      value: properties.filter(p => p.status === "active" || p.availability === "For Sale" || p.availability === "For Rent").length,
      color: "bg-emerald-500",
    },
    {
      icon: Award,
      label: "Member Since",
      value: vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : "2024",
      color: "bg-purple-500",
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-16 md:pb-20 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        {/* <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 md:mb-6 transition-colors font-medium text-sm md:text-base"
        >
          <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white shadow hover:shadow-md transition-shadow">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span>Back</span>
        </button> */}


        {/* Vendor Header Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-6 md:mb-8">
          {/* Header Background */}
          <div className="h-24 md:h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>


          <div className="px-4 md:px-6 pb-6 md:pb-8">
            {/* Avatar */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 md:gap-6 -mt-12 md:-mt-16 lg:-mt-12">
              <div className="relative">
                {vendor.avatar ? (
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-green-500 w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-4 border-white"></div>
              </div>


              {/* Info */}
              <div className="flex-1 text-center lg:text-left lg:mt-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {vendor.name}
                </h1>
                <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs md:text-sm mb-3 md:mb-4">
                  <Award className="w-3 h-3 md:w-4 md:h-4" />
                  {vendor.role === "vendor" ? "Verified Property Vendor" : vendor.role}
                </div>


                {/* Contact Buttons Row */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6 mb-3 md:mb-4">
                  {/* Request Call Button */}
                  <button
                    onClick={handleRequestCall}
                    className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 hover:bg-blue-50 rounded-lg md:rounded-xl transition-colors"
                  >
                    <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-medium">Contact</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-900">
                        Request a Call
                      </p>
                    </div>
                  </button>


                  {/* Chat Button */}
                  <button
                    onClick={handleChatClick}
                    className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg md:rounded-xl transition-colors"
                  >
                    <div className="p-1.5 md:p-2 bg-emerald-100 rounded-lg">
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-medium">Message</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-900">Start Chat</p>
                    </div>
                  </button>
                </div>


                {/* Stats Cards Row */}
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-2 md:p-2.5 ${stat.color} rounded-lg md:rounded-xl shadow-sm mb-2`}>
                          <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <p className="text-lg md:text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Call Request Notification */}
        {showCallRequest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 md:top-20 right-4 bg-green-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl shadow-lg z-50 flex items-center gap-2 md:gap-3 text-sm md:text-base"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <p className="font-semibold">Call request sent successfully!</p>
          </motion.div>
        )}


        {/* Properties Section */}
        <div>
          {/* Section Header */}
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-blue-600 rounded-lg md:rounded-xl shadow-sm">
              <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Listed Properties
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {properties.length} {properties.length === 1 ? "property" : "properties"} available
              </p>
            </div>
          </div>


          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  viewType="grid"
                  favourites={favourites}
                  onFavouritesChange={handleFavouritesChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Home className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                No Properties Listed Yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto mb-4 md:mb-6 px-4">
                This vendor hasn't added any properties to their portfolio. Check back later for new listings!
              </p>
              <button
                onClick={() => navigate("/properties")}
                className="px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm md:text-base"
              >
                Explore Other Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default VendorProfile;
