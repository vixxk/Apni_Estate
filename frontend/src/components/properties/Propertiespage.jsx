import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, MapPin, Home } from "lucide-react";
import SearchBar from "../properties/Searchbar.jsx";
import FilterSection from "../properties/Filtersection.jsx";
import PropertyCard from "../properties/Propertycard.jsx";
import { Backendurl } from "../../App.jsx";

const PropertiesPage = () => {
  const [viewState, setViewState] = useState({
    isGridView: true,
    showFilters: false,
    showMap: false,
  });

  const [propertyState, setPropertyState] = useState({
    properties: [],
    loading: true,
    error: null,
    selectedProperty: null,
  });

  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    bedrooms: "0",
    bathrooms: "0",
    availability: "",
    searchQuery: "",
    sortBy: "",
  });

  const [favourites, setFavourites] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));

      const response = await axios.get(`${Backendurl}/api/properties`);

      if (response.data.success) {
        const rawList = response.data.data || [];

        // Helper: always return full URL for images
        const toFullUrl = (val) => {
          if (!val) return null;
          if (/^https?:\/\//i.test(val)) return val;
          return `${Backendurl}${val.startsWith("/") ? val : `/${val}`}`;
        };

        // Map properties from backend schema
        const mapped = rawList.map((p) => {
          // Handle images from new Property schema
          let firstImage = null;
          if (Array.isArray(p.images) && p.images.length > 0) {
            firstImage = toFullUrl(p.images[0].url || p.images[0]);
          } else if (p.primaryImage?.url) {
            firstImage = toFullUrl(p.primaryImage.url);
          } else if (Array.isArray(p.image) && p.image.length > 0) {
            firstImage = toFullUrl(p.image[0]);
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
              p.location.pincode,
            ].filter(Boolean);
            locationString = parts.join(", ");
          }

          return {
            _id: p._id,
            title: p.title,
            description: p.description,
            price: p.price,
            type: p.type || p.propertyType,
            location: locationString || "Location not specified",
            beds: p.features?.bedrooms ?? 0,
            baths: p.features?.bathrooms ?? 0,
            sqft: p.features?.area ?? 0,
            availability:
              p.category ||
              p.availability ||
              (p.status === "available" ? "sale" : "rent"),
            amenities: Array.isArray(p.features?.amenities)
              ? p.features.amenities
              : [],
            images: Array.isArray(p.images)
              ? p.images.map((img) => toFullUrl(img.url || img))
              : firstImage
              ? [firstImage]
              : [],
            image: firstImage,
            owner: p.owner, // Already populated with {_id, name, email, phone, avatar}
            status: p.status,
            views: p.views || 0,
            createdAt: p.createdAt,
            furnished: p.features?.furnished || "unfurnished",
            parking: p.features?.parking || false,
            contactInfo: p.contactInfo || {},
          };
        });

        setPropertyState((prev) => ({
          ...prev,
          properties: mapped,
          error: null,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || "Failed to fetch properties");
      }
    } catch (err) {
      setPropertyState((prev) => ({
        ...prev,
        error: "Failed to fetch properties. Please try again later.",
        loading: false,
      }));
      console.error("Error fetching properties:", err);
    }
  };

  // Fetch user's favourite properties
  const fetchFavourites = async () => {
    if (!token) {
      setFavourites([]);
      return;
    }
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

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch favourites when token changes
  useEffect(() => {
    fetchFavourites();
  }, [token]);

  // In the filteredProperties useMemo, update the sort section:
  const filteredProperties = useMemo(() => {
    return propertyState.properties
      .filter((property) => {
        const searchMatch =
          !filters.searchQuery ||
          [property.title, property.description, property.location].some(
            (field) =>
              field?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );

        const typeMatch =
          !filters.propertyType ||
          property.type?.toLowerCase() === filters.propertyType.toLowerCase();

        const priceMatch =
          property.price >= filters.priceRange[0] &&
          property.price <= filters.priceRange[1];

        const bedroomsMatch =
          !filters.bedrooms ||
          filters.bedrooms === "0" ||
          property.beds >= parseInt(filters.bedrooms);

        const bathroomsMatch =
          !filters.bathrooms ||
          filters.bathrooms === "0" ||
          property.baths >= parseInt(filters.bathrooms);

        const availabilityMatch =
          !filters.availability ||
          property.availability?.toLowerCase() ===
            filters.availability.toLowerCase();

        return (
          searchMatch &&
          typeMatch &&
          priceMatch &&
          bedroomsMatch &&
          bathroomsMatch &&
          availabilityMatch
        );
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "newest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case "location-asc":
            // Sort alphabetically A-Z (case-insensitive)
            return (a.location || "")
              .toLowerCase()
              .localeCompare((b.location || "").toLowerCase());
          case "location-desc":
            // Sort alphabetically Z-A (case-insensitive)
            return (b.location || "")
              .toLowerCase()
              .localeCompare((a.location || "").toLowerCase());
          default:
            return 0;
        }
      });
  }, [propertyState.properties, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleFavouritesChange = (propertyId, action) => {
    setFavourites((prev) => {
      if (action === "add") {
        if (prev.includes(propertyId)) return prev;
        return [...prev, propertyId];
      }
      if (action === "remove") {
        return prev.filter((id) => id !== propertyId);
      }
      return prev;
    });
  };

  // Loading State
  if (propertyState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-500/30"
              animate={{
                rotate: [0, 0, 360, 360, 0],
                scale: [1, 0.9, 0.9, 1, 1],
                borderRadius: ["16%", "50%", "50%", "16%", "16%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Home className="w-12 h-12 text-white" />
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

          <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading Properties
          </h3>

          <p className="text-gray-600 mb-5 max-w-xs text-center">
            We're finding the perfect homes that match your preferences...
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
            <span>Please wait while we curate properties for you</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md"
        >
          <p className="font-medium mb-4">{propertyState.error}</p>
          <button
            onClick={fetchProperties}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Main Content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a curated collection of premium properties in your desired
            location
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredProperties.length} properties found
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence mode="wait">
            {viewState.showFilters && (
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="lg:col-span-1"
              >
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleFilterChange}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Properties Grid/List */}
          <div
            className={`${
              viewState.showFilters ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            {/* Search and View Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Search Bar */}
                <SearchBar
                  onSearch={(query) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: query,
                    }))
                  }
                  className="flex-1 w-full"
                />

                {/* Sort and View Controls */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="location-asc">Location: A to Z</option>
                    <option value="location-desc">Location: Z to A</option>
                  </select>

                  {/* View Controls */}
                  <div className="flex items-center gap-2">
                    {/* Toggle Filters Button */}
                    <button
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          showFilters: !prev.showFilters,
                        }))
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                      title="Toggle Filters"
                    >
                      <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Grid View Button */}
                    <button
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          isGridView: true,
                        }))
                      }
                      className={`p-2 rounded-lg transition ${
                        viewState.isGridView
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-5 h-5" />
                    </button>

                    {/* List View Button */}
                    <button
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          isGridView: false,
                        }))
                      }
                      className={`p-2 rounded-lg transition ${
                        !viewState.isGridView
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Display */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewState.isGridView
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      viewType={viewState.isGridView ? "grid" : "list"}
                      favourites={favourites}
                      onFavouritesChange={handleFavouritesChange}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm"
                  >
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search criteria to find what
                      you're looking for
                    </p>
                    <button
                      onClick={() => {
                        setFilters({
                          propertyType: "",
                          priceRange: [0, Number.MAX_SAFE_INTEGER],
                          bedrooms: "0",
                          bathrooms: "0",
                          availability: "",
                          searchQuery: "",
                          sortBy: "",
                        });
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertiesPage;
