import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, SlidersHorizontal, MapPin, Home } from "lucide-react";
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
      setFilters(prev => ({
        ...prev,
        propertyType: filterToApply,
        searchQuery: "" // Keep search bar empty
      }));
      // Clear the navigation state to prevent reapplying on refresh, but keep URL param valid for deep linking
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

      const response = await axios.get(`${Backendurl}/api/properties`);

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
    // Define allowed property types
    return propertyState.properties
      .filter((property) => {
        // Broad filter: We generally want to show properties that are either
        // categorized as sell/rent OR have specific types we support.
        // Let's rely on the specific filters below instead of a hard 'allowedTypes' check that might miss new types.
        // But if we must filter out 'services', we can check that.

        // For now, let's consider everything valid unless filtered out by user filters.
        // If we want to exclude Services from 'Properties' page, we can check category/type.

        // Example: Exclude 'construction services' etc if we only want 'Real Estate'
        // const isRealEstate = ['apartment','house','villa','plot','commercial','flat','shop'].includes(property.type) || ['sell','rent'].includes(property.category);
        // if (!isRealEstate) return false;

        const searchMatch =
          !filters.searchQuery ||
          [property.title, property.description, property.location].some(
            (field) =>
              field?.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );

        // Type Check
        // If filters.propertyType is set (e.g. from navbar dropdown 'apartment', 'house'),
        // we check if property.type matches that.
        // OR if filter is 'buy-sell'/'rent', we check category.

        let typeMatch = true;
        if (filters.propertyType) {
          const fType = filters.propertyType.toLowerCase();

          if (fType === 'buy' || fType === 'sell') {
            // Check category for buy/sell
            typeMatch = (property.category === 'sell' || property.category === 'buy');
            typeMatch = (property.category === 'rent');
          } else {
            // It's a specific property type like 'apartment', 'house', 'villa'
            // Ensure robust comparison (handle plural/singular mismatch if any)
            const pType = property.type?.toLowerCase() || "";
            const targetType = fType; // already lowercased above

            // Simple exact match or "contains" if we want to be lenient with "apartments" vs "apartment"
            typeMatch = pType === targetType || pType.includes(targetType) || targetType.includes(pType);
          }
        } else {
          // Default view: Show everything relevant?
          // Or maybe restrict to Buy/Rent/Sell categories by default if no type selected?
          // For now, let's allow all.
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
      <div className="min-h-screen flex flex-col items-center justify-center pb-32 md:pb-0 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Loading Properties
          </h3>

          <p className="text-gray-600 max-w-xs text-center text-sm md:text-base">
            Finding the perfect homes for you...
          </p>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md w-full"
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-2 sm:mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Discover a curated collection of premium properties in your desired
            location
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {filteredProperties.length} properties found
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Filters Sidebar */}
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
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Properties Grid/List */}
          <div
            className={`${viewState.showFilters ? "lg:col-span-3" : "lg:col-span-4"
              }`}
          >
            {/* Search and View Controls */}
            <div className="glass-panel p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <div className="flex flex-col gap-3">
                {/* Search Bar */}
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

                {/* Sort and View Controls */}
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
        </div>
      </div>
    </motion.div>
  );
};

export default PropertiesPage;
