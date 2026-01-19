import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, MapPin, Home, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import SearchBar from "../properties/Searchbar.jsx";
import FilterSection from "../properties/Filtersection.jsx";
import PropertyCard from "../properties/Propertycard.jsx";
import { Backendurl } from "../../App.jsx";

const PropertiesPage = () => {
  const location = useLocation();
  const filterType = location.state?.filterType;

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
    propertyType: filterType || "",
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    bedrooms: "0",
    bathrooms: "0",
    availability: "",
    searchQuery: "",
    sortBy: "",
  });

  const [favourites, setFavourites] = useState([]);

  // Refs for outside click detection
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const token = localStorage.getItem("token");

  // Update filter when navigating from Hero page or Navbar (query param)
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type');

  useEffect(() => {
    // Priority: Location State > Query Param
    const filterToApply = location.state?.filterType || typeParam;

    if (filterToApply) {
      const isAvailability = ["buy", "sell", "rent"].includes(filterToApply.toLowerCase());
      const cleanFilter = filterToApply.toLowerCase();

      setFilters(prev => ({
        ...prev,
        availability: isAvailability ? cleanFilter : "",
        propertyType: isAvailability ? "" : cleanFilter,
        searchQuery: ""
      }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, typeParam]);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        viewState.showFilters &&
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setViewState((prev) => ({ ...prev, showFilters: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewState.showFilters]);

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));

      // Fetch more properties to ensure client-side search works effectively
      const response = await axios.get(`${Backendurl}/api/properties?limit=100`);

      if (response.data.success) {
        const rawList = response.data.data || [];

        const toFullUrl = (val) => {
          if (!val) return null;
          if (/^https?:\/\//i.test(val)) return val;
          return `${Backendurl}${val.startsWith("/") ? val : `/${val}`}`;
        };

        const mapped = rawList.map((p) => {
          let firstImage = null;
          if (Array.isArray(p.images) && p.images.length > 0) {
            firstImage = toFullUrl(p.images[0].url || p.images[0]);
          } else if (p.primaryImage?.url) {
            firstImage = toFullUrl(p.primaryImage.url);
          } else if (Array.isArray(p.image) && p.image.length > 0) {
            firstImage = toFullUrl(p.image[0]);
          }

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
            category: p.category || p.type || p.propertyType, // Ensure category is available
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
            owner: p.owner,
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

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    fetchFavourites();
  }, [token]);

  const filteredProperties = useMemo(() => {
    return propertyState.properties
      .filter((property) => {

        const searchMatch =
          !filters.searchQuery ||
          [property.title, property.description, property.location].some(
            (field) =>
              field?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );

        let typeMatch = true;
        if (filters.propertyType) {
          const targetType = filters.propertyType.toLowerCase();
          const pType = (property.type || "").toLowerCase();
          typeMatch = pType === targetType || pType.includes(targetType);
        }

        let availabilityMatch = true;

        const SALES_CATEGORIES = [
          "construction materials",
          "furniture",
          "decoratives",
          "interior",
          "interior designing"
        ];

        if (filters.availability) {
          const targetAvail = filters.availability.toLowerCase();
          const checkAvail = targetAvail === 'buy' ? 'sell' : targetAvail;

          const pCategory = (property.category || "").toLowerCase();
          const pAvail = (property.availability || "").toLowerCase();
          const pType = (property.type || "").toLowerCase();

          const isCategoryMatch =
            pCategory === checkAvail ||
            pAvail === checkAvail ||
            pCategory === 'both' ||
            pAvail === 'both';

          const isSalesItemMatch = checkAvail === 'sell' && SALES_CATEGORIES.some(cat => pType.includes(cat) || pCategory.includes(cat));

          availabilityMatch = isCategoryMatch || isSalesItemMatch;
        }


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

        return (
          searchMatch &&
          typeMatch &&
          availabilityMatch &&
          priceMatch &&
          bedroomsMatch &&
          bathroomsMatch
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
            return (a.location || "")
              .toLowerCase()
              .localeCompare((b.location || "").toLowerCase());
          case "location-desc":
            return (b.location || "")
              .toLowerCase()
              .localeCompare((a.location || "").toLowerCase());
          default:
            return 0;
        }
      });
  }, [propertyState.properties, filters]);


  const handleFilterChange = (newFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Close sidebar on mobile/tablet when filters are applied
    setViewState((prev) => ({ ...prev, showFilters: false }));
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
            We're finding the best properties for you...
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
            <span>Curating the best listings for you</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 -mt-20">
        <p className="text-red-600 font-medium">{propertyState.error}</p>
        <button
          onClick={fetchProperties}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-2 sm:mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated list of premium properties available for buy & rent
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredProperties.length} properties found
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <AnimatePresence mode="wait">
            {viewState.showFilters && (
              <motion.aside
                ref={filterRef}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="lg:col-span-1"
              >
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  onApplyFilters={handleFilterChange}
                  typeOptions={["House", "Apartment", "Villa", "Plot", "Commercial"]}
                  availabilityOptions={["Rent", "Buy"]}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          <div
            className={`${viewState.showFilters ? "lg:col-span-3" : "lg:col-span-4"
              }`}
          >
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <SearchBar
                    onSearch={(query) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: query,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2 w-full">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="location-asc">Location: A to Z</option>
                    <option value="location-desc">Location: Z to A</option>
                  </select>

                  <div className="flex items-center gap-1">
                    {/* Toggle Filters Button */}
                    <button
                      ref={filterButtonRef}
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          showFilters: !prev.showFilters,
                        }))
                      }
                      className={`p-2 rounded-lg transition ${viewState.showFilters
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                        }`}
                      title="Toggle Filters"
                    >
                      <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Grid View Button */}
                    <button
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          isGridView: true,
                        }))
                      }
                      className={`p-2 rounded-lg transition ${viewState.isGridView
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                        }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* List View Button */}
                    <button
                      onClick={() =>
                        setViewState((prev) => ({
                          ...prev,
                          isGridView: false,
                        }))
                      }
                      className={`p-2 rounded-lg transition ${!viewState.isGridView
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                        }`}
                      title="List View"
                    >
                      <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Display */}
        <motion.div
          layout
          className={`grid gap-1.5 sm:gap-4 md:gap-6 ${viewState.isGridView
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
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
                className="col-span-full text-center py-12 sm:py-16 glass-panel rounded-lg"
              >
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
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
                  className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertiesPage;
