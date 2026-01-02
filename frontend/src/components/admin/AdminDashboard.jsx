import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  TrendingUp,
  Package,
  AlertTriangle,
  Search,
  Home,
  Building2,
  Store,
  Wrench,
  BarChart3,
  Grid3x3,
} from "lucide-react";
import { Backendurl } from "../../App";
import PropertyReviewCard from "../admin/PropertyReviewCard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [allProperties, setAllProperties] = useState([]); 
  const [displayedProperties, setDisplayedProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("pending");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const adminEmail = localStorage.getItem("adminEmail");
  const adminPassword = localStorage.getItem("adminPassword");

  // Auth check
  useEffect(() => {
    if (!adminEmail || !adminPassword) {
      navigate("/admin/login");
      return;
    }
    loadAllData();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (!initialLoad) {
      applyFilters();
    }
  }, [statusFilter, categoryFilter, searchQuery, allProperties]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchQuery]);

  // Load all data once
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchAllProperties(),
      ]);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${Backendurl}/api/admin/stats`, {
        headers: {
          email: adminEmail,
          password: adminPassword,
        },
      });
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch ALL properties at once
  const fetchAllProperties = async () => {
    try {
      const { data } = await axios.get(
        `${Backendurl}/api/admin/properties/all`,
        {
          headers: {
            email: adminEmail,
            password: adminPassword,
          },
          params: {
            limit: 10000, 
          },
        }
      );

      setAllProperties(data.data || []);
      
      const categories = {};
      data.data.forEach((property) => {
        const type = property.type || "others";
        categories[type] = (categories[type] || 0) + 1;
      });
      setCategoryStats(categories);
      
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Apply filters to properties (client-side filtering)
  const applyFilters = () => {
    let filtered = [...allProperties];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.status === statusFilter
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.type === categoryFilter
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((property) =>
        property.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log("Applied filters:", {
      statusFilter,
      categoryFilter,
      searchQuery,
      originalCount: allProperties.length,
      filteredCount: filtered.length,
    });

    setDisplayedProperties(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const handleApprove = async (propertyId, notes) => {
    try {
      await axios.put(
        `${Backendurl}/api/admin/properties/${propertyId}/approve`,
        { notes },
        {
          headers: {
            email: adminEmail,
            password: adminPassword,
          },
        }
      );
      await loadAllData(); 
    } catch (error) {
      console.error("Failed to approve property:", error);
      alert(error.response?.data?.message || "Failed to approve property");
    }
  };

  const handleReject = async (propertyId, reason, notes) => {
    try {
      await axios.put(
        `${Backendurl}/api/admin/properties/${propertyId}/reject`,
        { reason, notes },
        {
          headers: {
            email: adminEmail,
            password: adminPassword,
          },
        }
      );
      await loadAllData(); 
    } catch (error) {
      console.error("Failed to reject property:", error);
      alert(error.response?.data?.message || "Failed to reject property");
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await axios.delete(`${Backendurl}/api/admin/properties/${propertyId}`, {
        headers: {
          email: adminEmail,
          password: adminPassword,
        },
      });
      await loadAllData(); 
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert(error.response?.data?.message || "Failed to delete property");
    }
  };

  // Pagination
  const totalPages = Math.ceil(displayedProperties.length / itemsPerPage);
  const paginatedProperties = displayedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Category icons mapping
  const categoryIcons = {
    house: Home,
    apartment: Building2,
    villa: Home,
    commercial: Store,
    sell: Store,
    vastu: Home,
    "home loan": Building2,
    furniture: Package,
    "construction services": Wrench,
    others: Package,
  };

  const totalCategoryCount = categoryStats
    ? Object.values(categoryStats).reduce((sum, count) => sum + count, 0)
    : 0;

  if (loading && initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white font-semibold text-lg"
          >
            Loading Dashboard...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-200 text-sm mt-2"
          >
            Please wait while we fetch the data
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-6 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-blue-200 hidden sm:block">
                  Property Management System
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-lg text-sm backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Status Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter("all")}
              className={`bg-white/10 backdrop-blur-xl border-2 rounded-xl p-2.5 sm:p-3 shadow-lg transition-all text-left ${
                statusFilter === "all"
                  ? "border-blue-400 ring-2 ring-blue-400/30"
                  : "border-white/20 hover:border-blue-400/50"
              }`}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stats.totalProperties}
              </div>
              <p className="text-blue-200 text-[10px] sm:text-xs font-medium">
                Total Properties
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter("pending")}
              className={`bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-2.5 sm:p-3 shadow-lg transition-all text-left border-2 ${
                statusFilter === "pending"
                  ? "border-yellow-300 ring-2 ring-yellow-400/30"
                  : "border-transparent hover:border-yellow-300/50"
              }`}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stats.pendingProperties}
              </div>
              <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                Pending Review
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter("approved")}
              className={`bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2.5 sm:p-3 shadow-lg transition-all text-left border-2 ${
                statusFilter === "approved"
                  ? "border-green-300 ring-2 ring-green-400/30"
                  : "border-transparent hover:border-green-300/50"
              }`}
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stats.approvedProperties}
              </div>
              <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                Approved
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter("rejected")}
              className={`bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-2.5 sm:p-3 shadow-lg transition-all text-left border-2 ${
                statusFilter === "rejected"
                  ? "border-red-300 ring-2 ring-red-400/30"
                  : "border-transparent hover:border-red-300/50"
              }`}
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stats.rejectedProperties}
              </div>
              <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                Rejected
              </p>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2.5 sm:p-3 shadow-lg col-span-2 sm:col-span-1"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">
                {stats.todaySubmissions}
              </div>
              <p className="text-white/90 text-[10px] sm:text-xs font-medium">
                Today's Submissions
              </p>
            </motion.div>
          </div>
        )}

        {/* Category Distribution */}
        {categoryStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-3 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-bold text-white">
                Filter by Category
              </h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {/* All Categories Button */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCategoryFilter("all")}
                className={`backdrop-blur-sm border-2 rounded-lg p-2 text-center transition-all ${
                  categoryFilter === "all"
                    ? "bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/50"
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50"
                }`}
              >
                <Grid3x3 className="w-4 h-4 text-blue-300 mx-auto mb-0.5" />
                <div className="text-base sm:text-lg font-bold text-white">
                  {totalCategoryCount}
                </div>
                <p className="text-blue-200 text-[9px] sm:text-[10px] font-medium">
                  All Types
                </p>
              </motion.button>

              {/* Individual Category Buttons */}
              {Object.entries(categoryStats)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const Icon =
                    categoryIcons[category.toLowerCase()] || Package;
                  return (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategoryFilter(category)}
                      className={`backdrop-blur-sm border-2 rounded-lg p-2 text-center transition-all ${
                        categoryFilter === category
                          ? "bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/50"
                          : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-blue-400/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-blue-300 mx-auto mb-0.5" />
                      <div className="text-base sm:text-lg font-bold text-white">
                        {count}
                      </div>
                      <p className="text-blue-200 text-[9px] sm:text-[10px] capitalize truncate font-medium">
                        {category}
                      </p>
                    </motion.button>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Active Filters Display */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/70 text-sm font-medium">
              Active Filters:
            </span>
            <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/50 rounded-lg text-white text-sm font-semibold capitalize">
              Status: {statusFilter}
            </span>
            <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/50 rounded-lg text-white text-sm font-semibold capitalize">
              Category: {categoryFilter}
            </span>
            <span className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-lg text-white text-sm font-semibold">
              Showing: {displayedProperties.length} properties
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by title..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {paginatedProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center"
            >
              <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Properties Found
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                {searchQuery
                  ? "No properties match your search criteria."
                  : `No ${categoryFilter !== "all" ? categoryFilter : ""} properties with ${statusFilter} status.`}
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <PropertyReviewCard
                    property={property}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
              Prev
            </button>

            <div className="flex gap-2">
              {totalPages <= 5 ? (
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 text-sm rounded-xl font-semibold transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  {currentPage > 2 && (
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="w-10 h-10 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20"
                    >
                      1
                    </button>
                  )}
                  {currentPage > 3 && (
                    <span className="flex items-center px-2 text-white/70 text-sm">
                      ...
                    </span>
                  )}
                  {[...Array(3)].map((_, i) => {
                    const pageNum = currentPage - 1 + i;
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-sm rounded-xl font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                            : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {currentPage < totalPages - 2 && (
                    <span className="flex items-center px-2 text-white/70 text-sm">
                      ...
                    </span>
                  )}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10 h-10 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20"
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
