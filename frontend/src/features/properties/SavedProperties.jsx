import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Bookmark, Search, Home, ArrowRight, LogIn } from "lucide-react";
import PropertyCard from "./components/Propertycard.jsx";
import { Backendurl } from "../../App.jsx";

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
            firstImage = toFullUrl(typeof img0 === "string" ? img0 : img0?.url);
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
            owner: p.owner,
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

  const handleFavouriteChange = (propertyId) => {
    setProperties((currentProperties) =>
      currentProperties.filter((p) => p._id !== propertyId)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            <motion.div
              className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/10"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bookmark className="w-10 h-10 text-blue-600" />
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold text-blue-800 mb-3">
            Loading Favorites
          </h3>

          <p className="text-gray-600 mb-5 max-w-xs text-center">
            Fetching your saved properties...
          </p>

          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
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
            <span>Retrieving your favorite properties</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2 sm:mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-blue-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
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
            className="relative inline-block mb-6 sm:mb-8"
          >
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10"
            >
              <Bookmark
                className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-3 sm:mb-4"
          >
            No Saved Properties Yet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-10 max-w-md mx-auto"
          >
            Start exploring and save your favorite properties by clicking the
            bookmark icon
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/properties")}
              className="relative group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 sm:gap-3"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {token ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-700 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Go Home</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sign In</span>
              </motion.button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 sm:mt-12 p-4 sm:p-6 glass-panel rounded-2xl max-w-md mx-auto"
          >
            <h3 className="text-xs sm:text-sm font-bold text-blue-700 mb-2 sm:mb-3 flex items-center justify-center gap-2">
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              Quick Tip
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Click the{" "}
              <Bookmark
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mx-1 text-blue-500"
                fill="currentColor"
              />{" "}
              icon on any property card to save it to your list. You can
              access them anytime here!
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .mobile-property-card {
            transform: scale(0.85);
            transform-origin: top center;
            margin-bottom: -40px;
          }
          .mobile-property-card:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 lg:mb-8"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
              >
                <Bookmark
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600"
                  fill="currentColor"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-900 truncate">
                  Saved Properties
                </h1>
                <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm">
                  {properties.length}{" "}
                  {properties.length === 1 ? "property" : "properties"} saved
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="mobile-property-card"
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
    </>
  );
};

export default SavedProperties;
