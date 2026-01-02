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
} from "lucide-react";
import { Backendurl } from "../../App";
import PropertyReviewCard from "../admin/PropertyReviewCard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const adminEmail = localStorage.getItem("adminEmail");
  const adminPassword = localStorage.getItem("adminPassword");

  useEffect(() => {
    if (!adminEmail || !adminPassword) {
      navigate("/admin/login");
      return;
    }

    fetchStats();
    fetchProperties();
  }, [activeTab, currentPage]);

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

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "pending"
          ? `${Backendurl}/api/admin/properties/pending`
          : `${Backendurl}/api/admin/properties/all`;

      const { data } = await axios.get(endpoint, {
        headers: {
          email: adminEmail,
          password: adminPassword,
        },
        params: {
          status: activeTab === "all" ? undefined : activeTab,
          page: currentPage,
          limit: 20,
        },
      });

      setProperties(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
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

      fetchStats();
      fetchProperties();
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

      fetchStats();
      fetchProperties();
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

      fetchStats();
      fetchProperties();
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert(error.response?.data?.message || "Failed to delete property");
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "pending", label: "Pending", icon: Clock, color: "yellow" },
    { id: "approved", label: "Approved", icon: CheckCircle, color: "green" },
    { id: "rejected", label: "Rejected", icon: XCircle, color: "red" },
    { id: "all", label: "All", icon: Package, color: "blue" },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Property Management
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-xs sm:text-sm"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("all");
                setCurrentPage(1);
              }}
              className={`bg-white rounded-lg p-3 shadow-md border-2 transition-all text-left ${
                activeTab === "all"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-col">
                <Package className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.totalProperties}
                </span>
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium">
                  Total Properties
                </p>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("pending");
                setCurrentPage(1);
              }}
              className={`rounded-lg p-3 shadow-md transition-all text-left border-2 ${
                activeTab === "pending"
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-600 ring-2 ring-yellow-200"
                  : "bg-gradient-to-br from-yellow-500 to-orange-500 border-transparent hover:border-yellow-600"
              }`}
            >
              <div className="flex flex-col">
                <Clock className="w-5 h-5 text-white mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {stats.pendingProperties}
                </span>
                <p className="text-white text-[10px] sm:text-xs font-medium">
                  Pending Review
                </p>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("approved");
                setCurrentPage(1);
              }}
              className={`rounded-lg p-3 shadow-md transition-all text-left border-2 ${
                activeTab === "approved"
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 border-green-600 ring-2 ring-green-200"
                  : "bg-gradient-to-br from-green-500 to-emerald-500 border-transparent hover:border-green-600"
              }`}
            >
              <div className="flex flex-col">
                <CheckCircle className="w-5 h-5 text-white mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {stats.approvedProperties}
                </span>
                <p className="text-white text-[10px] sm:text-xs font-medium">
                  Approved
                </p>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab("rejected");
                setCurrentPage(1);
              }}
              className={`rounded-lg p-3 shadow-md transition-all text-left border-2 ${
                activeTab === "rejected"
                  ? "bg-gradient-to-br from-red-500 to-pink-500 border-red-600 ring-2 ring-red-200"
                  : "bg-gradient-to-br from-red-500 to-pink-500 border-transparent hover:border-red-600"
              }`}
            >
              <div className="flex flex-col">
                <XCircle className="w-5 h-5 text-white mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {stats.rejectedProperties}
                </span>
                <p className="text-white text-[10px] sm:text-xs font-medium">
                  Rejected
                </p>
              </div>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg p-3 shadow-md col-span-2 sm:col-span-1"
            >
              <div className="flex flex-col">
                <TrendingUp className="w-5 h-5 text-white mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {stats.todaySubmissions}
                </span>
                <p className="text-white text-[10px] sm:text-xs font-medium">
                  Today's Submissions
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tabs - Desktop Only */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md p-2 mb-4">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.id === "pending"
                  ? stats?.pendingProperties
                  : tab.id === "approved"
                  ? stats?.approvedProperties
                  : tab.id === "rejected"
                  ? stats?.rejectedProperties
                  : stats?.totalProperties;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Tab Indicator (Mobile Only) */}
        <div className="lg:hidden bg-white rounded-lg shadow-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                if (tab.id === activeTab) {
                  const Icon = tab.icon;
                  const count =
                    tab.id === "pending"
                      ? stats?.pendingProperties
                      : tab.id === "approved"
                      ? stats?.approvedProperties
                      : tab.id === "rejected"
                      ? stats?.rejectedProperties
                      : stats?.totalProperties;

                  return (
                    <div
                      key={tab.id}
                      className="flex items-center gap-2 text-gray-900"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">
                        {tab.label}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                        {count}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-2.5 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by title..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-1">
                No Properties Found
              </h3>
              <p className="text-gray-600 text-sm">
                {searchQuery
                  ? "No properties match your search."
                  : `No ${activeTab} properties at the moment.`}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.02 }}
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
        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Prev
            </button>

            <div className="flex gap-1.5">
              {pagination.pages <= 5 ? (
                [...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-sm rounded-lg font-semibold transition-all ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
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
                      className="w-8 h-8 text-sm bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      1
                    </button>
                  )}
                  {currentPage > 3 && (
                    <span className="flex items-center px-2 text-gray-500 text-sm">
                      ...
                    </span>
                  )}
                  {[...Array(3)].map((_, i) => {
                    const pageNum = currentPage - 1 + i;
                    if (pageNum < 1 || pageNum > pagination.pages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-sm rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {currentPage < pagination.pages - 2 && (
                    <span className="flex items-center px-2 text-gray-500 text-sm">
                      ...
                    </span>
                  )}
                  {currentPage < pagination.pages - 1 && (
                    <button
                      onClick={() => setCurrentPage(pagination.pages)}
                      className="w-8 h-8 text-sm bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      {pagination.pages}
                    </button>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.pages, p + 1))
              }
              disabled={currentPage === pagination.pages}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
