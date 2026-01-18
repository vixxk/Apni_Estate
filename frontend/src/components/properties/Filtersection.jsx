import { Home, IndianRupee, Filter } from "lucide-react";
import { motion } from "framer-motion";

const propertyTypes = ["House", "Apartment", "Villa", "Plot", "Commercial"];
const availabilityTypes = ["Rent", "Buy"];
const priceRanges = [
  { min: 0, max: 5000000, label: "Under ₹50L" },
  { min: 5000000, max: 10000000, label: "₹50L - ₹1Cr" },
  { min: 10000000, max: 20000000, label: "₹1Cr - ₹2Cr" },
  { min: 20000000, max: Number.MAX_SAFE_INTEGER, label: "Above ₹2Cr" }
];

const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleReset = () => {
    setFilters({
      propertyType: "",
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      bedrooms: "0",
      bathrooms: "0",
      availability: "",
      searchQuery: "",
      sortBy: ""
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass-panel p-4 sm:p-6 rounded-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Property Type */}
        <div className="filter-group">
          <label className="filter-label text-sm sm:text-base mb-2 block font-medium text-gray-700">
            <Home className="w-4 h-4 mr-2 inline" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange({
                  target: { name: "propertyType", value: type.toLowerCase() }
                })}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${filters.propertyType === type.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-100"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="filter-group">
          <label className="filter-label text-sm sm:text-base mb-2 block font-medium text-gray-700">
            <Filter className="w-4 h-4 mr-2 inline" />
            Availability
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availabilityTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange({
                  target: { name: "availability", value: type.toLowerCase() }
                })}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${filters.availability === type.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-100"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label text-sm sm:text-base mb-2 block font-medium text-gray-700">
            <IndianRupee className="w-4 h-4 mr-2 inline" />
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priceRanges.map(({ min, max, label }) => (
              <button
                key={label}
                onClick={() => handlePriceRangeChange(min, max)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                  ${filters.priceRange[0] === min && filters.priceRange[1] === max
                    ? "bg-blue-600 text-white"
                    : "bg-white/50 text-gray-700 hover:bg-white/80 border border-gray-100"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-6 sm:mt-8 pt-2 sm:pt-4 border-t border-gray-100">
          <button
            onClick={() => onApplyFilters(filters)}
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 
              transition-colors font-medium text-sm sm:text-base shadow-lg shadow-blue-500/30"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;