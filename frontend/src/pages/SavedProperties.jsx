// SavedProperties.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Search, Home, ArrowRight, Sparkles } from "lucide-react";
import PropertyCard from "../components/properties/Propertycard.jsx";
import { Backendurl } from "../App.jsx";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) {
        setLoading(false);
        setProperties([]);
        return;
      }

      try {
        const { data } = await axios.get(`${Backendurl}/api/users/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawList = data?.data?.properties || [];

        const toFullUrl = (val) => {
          if (!val || typeof val !== "string") return null;
          if (val.startsWith("/no-image")) return val;
          if (/^https?:\/\//i.test(val)) return val;
          return `${Backendurl}${val.startsWith("/") ? val : `/${val}`}`;
        };

        const mapped = rawList.map((p) => {
          let firstImage = null;

          if (Array.isArray(p.images) && p.images.length > 0) {
            const img0 = p.images[0];
            firstImage = toFullUrl(
              typeof img0 === "string" ? img0 : img0?.url
            );
          }

          if (!firstImage && p.primaryImage?.url) {
            firstImage = toFullUrl(p.primaryImage.url);
          }

          if (!firstImage && p.image) {
            const val = Array.isArray(p.image) ? p.image[0] : p.image;
            firstImage = toFullUrl(val);
          }

          const displayImage = firstImage || "/no-image.png";

          return {
            _id: p._id,
            title: p.title,
            description: p.description || "",
            price: p.price,
            type: p.type || p.propertyType,
            location:
              typeof p.location === "string"
                ? p.location
                : p.location?.city ||
                  p.location?.address ||
                  p.location?.state ||
                  "",
            beds: p.beds ?? p.features?.bedrooms ?? 0,
            baths: p.baths ?? p.features?.bathrooms ?? 0,
            sqft: p.sqft ?? p.features?.area ?? 0,
            availability:
              p.availability ||
              p.category ||
              (p.status === "available" ? "sale" : "rent"),
            amenities: Array.isArray(p.features?.amenities)
              ? p.features.amenities
              : [],
            image: displayImage,
            images: firstImage ? [firstImage] : [],
            createdAt: p.createdAt,
          };
        });

        setProperties(mapped);
        setError(null);
      } catch (err) {
        console.error("Error loading saved properties:", err);
        setError("Failed to load saved properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token]);

  // Handle removing a property from favorites
  const handleFavouriteChange = (propertyId) => {
    // Optimistically update UI immediately
    setProperties((currentProperties) =>
      currentProperties.filter((p) => p._id !== propertyId)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="text-gray-600 font-medium">Loading your saved properties...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>

            <motion.div
              animate={{
                y: [10, -10, 10],
                x: [5, -5, 5],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-2 -left-2"
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            No Saved Properties Yet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg mb-10 max-w-md mx-auto"
          >
            Start exploring and save your favorite properties by clicking the heart icon
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/properties")}
              className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex items-center gap-3"
            >
              <Search className="w-5 h-5" />
              <span>Browse Properties</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 max-w-md mx-auto"
          >
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Quick Tip
            </h3>
            <p className="text-sm text-gray-600">
              Click the <Heart className="w-4 h-4 inline mx-1 text-red-500" fill="currentColor" /> icon on any property card to save it to your favorites. You can access them anytime here!
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="w-6 h-6 text-white" fill="white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Saved Properties
              </h1>
              <p className="text-gray-600 mt-1">
                {properties.length} {properties.length === 1 ? "property" : "properties"} saved
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {properties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <PropertyCard
                property={property}
                viewType="grid"
                favourites={properties.map((p) => p._id)}
                onFavouritesChange={handleFavouriteChange}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedProperties;
