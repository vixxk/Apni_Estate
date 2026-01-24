import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, Wrench, Users, SlidersHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";
import SearchBar from "../properties/components/Searchbar.jsx";
import FilterSection from "../properties/components/Filtersection.jsx";
import PropertyCard from "../properties/components/Propertycard.jsx";

import { Backendurl } from "../../App.jsx";
import LoadingSplash from "../../components/common/LoadingSplash.jsx";

const ManpowerPage = () => {
    const location = useLocation();
    const filterType = location.state?.filterType;

    const MANPOWER_CATEGORIES = [
        "Carpenter",
        "Painter",
        "Plumber",
        "Electrician",
        { label: "Mason (Construction Worker)", value: "Mason" },
        "General Labour"
    ];

    const [viewState, setViewState] = useState({
        isGridView: true,
        showFilters: false,
    });

    const [propertyState, setPropertyState] = useState({
        properties: [],
        loading: true,
        error: null,
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

    const filterRef = useRef(null);
    const filterButtonRef = useRef(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (location.state?.filterType) {
            setFilters((prev) => ({
                ...prev,
                propertyType: location.state.filterType,
                searchQuery: "",
            }));
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

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
                        category: p.category || p.type || p.propertyType,
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
                error: "Failed to fetch manpower listings. Please try again later.",
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
                // FILTER ONLY MANPOWER CATEGORY
                if (property.category?.toLowerCase() !== 'manpower') return false;

                const searchMatch =
                    !filters.searchQuery ||
                    [property.title, property.description, property.location].some(
                        (field) =>
                            field?.toLowerCase().includes(filters.searchQuery.toLowerCase())
                    );

                let typeMatch = true;
                if (filters.propertyType) {
                    typeMatch =
                        property.type?.toLowerCase() === filters.propertyType.toLowerCase();
                }

                const priceMatch =
                    property.price >= filters.priceRange[0] &&
                    property.price <= filters.priceRange[1];

                // Manpower usually doesn't have bedrooms/bathrooms, but keeping for compatibility if reused
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

    if (propertyState.loading) {
        return (
            <LoadingSplash
                icon={Users}
                title="Loading Manpower"
                subtitle="Finding skilled professionals for you..."
                theme="blue"
            />
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
                        Find Skilled Manpower
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                        Connect with expert plumbers, electricians, technicians, and more
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                        {filteredProperties.length} professionals found
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
                                    typeOptions={MANPOWER_CATEGORIES}
                                    availabilityOptions={[]}
                                    typeLabel="Role / Profession"
                                    priceRanges={[
                                        { min: 0, max: 500, label: "Under ₹500" },
                                        { min: 500, max: 1000, label: "₹500 - ₹1000" },
                                        { min: 1000, max: 5000, label: "₹1000 - ₹5000" },
                                        { min: 5000, max: Number.MAX_SAFE_INTEGER, label: "Above ₹5000" }
                                    ]}
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
                                        className="col-span-full text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm"
                                    >
                                        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            No professionals found
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                                            Try adjusting your filters or search criteria
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

export default ManpowerPage;
