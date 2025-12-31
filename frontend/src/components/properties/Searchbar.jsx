import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ onSearch, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  // Refs for click outside detection
  const searchContainerRef = useRef(null);
  const locationContainerRef = useRef(null);

  // Popular locations
  const popularLocations = [
    'Tripura', 'Goa', 'Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    const savedLocations = localStorage.getItem('recentLocations');
    
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    if (savedLocations) {
      setRecentLocations(JSON.parse(savedLocations));
    }
  }, []);

  // Handle click outside for main search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Handle click outside for location dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    if (showLocationSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationSuggestions]);

  // Combined search function
  const performSearch = (search = searchQuery, location = locationQuery) => {
    const searchText = search.trim();
    const locationText = location.trim();
    
    // Combine both queries
    const combinedQuery = [searchText, locationText].filter(Boolean).join(' ');

    // Save to recent searches if there's a search query
    if (searchText) {
      const updatedSearches = [
        searchText,
        ...recentSearches.filter(item => item !== searchText)
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }

    // Save to recent locations if there's a location query
    if (locationText) {
      const updatedLocations = [
        locationText,
        ...recentLocations.filter(item => item !== locationText)
      ].slice(0, 5);
      setRecentLocations(updatedLocations);
      localStorage.setItem('recentLocations', JSON.stringify(updatedLocations));
    }
    
    // Trigger parent search with combined query
    onSearch(combinedQuery);
    setShowSuggestions(false);
    setShowLocationSuggestions(false);
  };

  // Main search handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery, locationQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    performSearch('', locationQuery);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Location search handlers
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    performSearch(searchQuery, locationQuery);
  };

  const clearLocation = () => {
    setLocationQuery('');
    performSearch(searchQuery, '');
  };

  const handleLocationKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowLocationSuggestions(false);
    }
  };

  const selectRecentSearch = (query) => {
    setSearchQuery(query);
    performSearch(query, locationQuery);
  };

  const selectRecentLocation = (location) => {
    setLocationQuery(location);
    performSearch(searchQuery, location);
  };

  const selectPopularLocation = (location) => {
    setLocationQuery(location);
    performSearch(searchQuery, location);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ==================== MAIN SEARCH BAR ==================== */}
      <div ref={searchContainerRef} className="relative flex-[2]">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-12 pr-20 py-3 rounded-lg border border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all text-gray-800 placeholder-gray-400"
          />
          
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 
              text-gray-400 h-5 w-5 pointer-events-none" 
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 
                    hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <button 
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg 
                hover:bg-blue-700 transition-colors"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
                shadow-lg border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Recent Searches
                </h3>
                {recentSearches.map((query, index) => (
                  <button
                    key={`search-${index}`}
                    onClick={() => selectRecentSearch(query)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{query}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== LOCATION SEARCH BAR ==================== */}
      <div ref={locationContainerRef} className="relative flex-[0.7] min-w-[180px]">
        <form onSubmit={handleLocationSubmit} className="relative">
          <input
            type="text"
            placeholder="Location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onFocus={() => setShowLocationSuggestions(true)}
            onKeyDown={handleLocationKeyDown}
            className="w-full pl-9 pr-9 py-3 rounded-lg border border-gray-200 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
              transition-all text-gray-800 placeholder-gray-400 text-sm"
          />
          
          <MapPin 
            className="absolute left-2.5 top-1/2 -translate-y-1/2 
              text-gray-400 h-4 w-4 pointer-events-none" 
          />
          
          <AnimatePresence>
            {locationQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                type="button"
                onClick={clearLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2
                  p-1 rounded-full hover:bg-gray-100 text-gray-400 
                  hover:text-gray-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>

        {/* Location Suggestions Dropdown */}
        <AnimatePresence>
          {showLocationSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
                shadow-lg border border-gray-100 overflow-hidden z-50"
            >
              {/* Recent Locations */}
              {recentLocations.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                    Recent Locations
                  </h3>
                  {recentLocations.map((location, index) => (
                    <button
                      key={`recent-loc-${index}`}
                      onClick={() => selectRecentLocation(location)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 
                        rounded-md flex items-center gap-2 text-gray-700 text-sm"
                    >
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Locations */}
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-500 px-3 mb-2">
                  Popular Locations
                </h3>
                {popularLocations.map((location, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => selectPopularLocation(location)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 
                      rounded-md flex items-center gap-2 text-gray-700 text-sm"
                  >
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
