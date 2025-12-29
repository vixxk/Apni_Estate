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
      console.error("Error fetching favourites:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 0.9, 1],
                borderRadius: ["16%", "50%", "16%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <User className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Loading Vendor Profile
          </h3>
          <p className="text-gray-600">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-red-50 rounded-lg max-w-md"
        >
          <p className="text-red-600 font-medium mb-4">{error || "Vendor not found"}</p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Properties
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Vendor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {vendor.avatar ? (
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
              <p className="text-blue-600 font-medium mb-4">
                {vendor.role === "vendor" ? "Property Vendor" : vendor.role}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vendor.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">{vendor.email}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">{vendor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">{properties.length} Properties</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            Listed Properties ({properties.length})
          </h2>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Properties Listed
              </h3>
              <p className="text-gray-600">
                This vendor hasn't listed any properties yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
