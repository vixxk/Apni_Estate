import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Home,
  MapPin,
  Calendar,
  Check,
  X,
  Clock,
  Filter,
  Search,
  Loader2,
  ChevronDown,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Backendurl } from "../../App";

const VendorContactRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const params = filter !== "all" ? { status: filter } : {};

      const response = await axios.get(
        `${Backendurl}/api/contact-requests/vendor/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      if (response.data.success) {
        setRequests(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(
        err.response?.data?.message || "Failed to load contact requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${Backendurl}/api/contact-requests/vendor/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStats({
          total: response.data.data.total,
          pending: response.data.data.byStatus.pending || 0,
          contacted: response.data.data.byStatus.contacted || 0,
          closed: response.data.data.byStatus.closed || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      setUpdatingStatus(requestId);
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${Backendurl}/api/contact-requests/vendor/${requestId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyInfo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
      }).format(date);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "contacted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "closed":
        return "bg-gray-50 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "contacted":
        return <Check className="w-3.5 h-3.5" />;
      case "closed":
        return <X className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // Handle stat card click
  const handleStatCardClick = (statType) => {
    setFilter(statType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-blue-400 rounded-3xl blur-xl opacity-30"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">
            Loading Requests
          </h3>
          <p className="text-gray-600 text-sm">Fetching your contact data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-Optimized Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 pt-6"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-2 leading-tight">
            Contact Requests
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Manage buyer & renter inquiries
          </p>
        </motion.div>

        {/* Compact Stats Cards - Clickable */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: MessageCircle,
              gradient: "from-blue-500 to-indigo-600",
              filterValue: "all",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: Clock,
              gradient: "from-amber-500 to-orange-600",
              filterValue: "pending",
            },
            {
              label: "Contacted",
              value: stats.contacted,
              icon: Check,
              gradient: "from-green-500 to-emerald-600",
              filterValue: "contacted",
            },
            {
              label: "Closed",
              value: stats.closed,
              icon: X,
              gradient: "from-gray-500 to-slate-600",
              filterValue: "closed",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const isActive = filter === stat.filterValue;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStatCardClick(stat.filterValue)}
                className={`relative bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-lg border-2 flex flex-col items-center justify-center text-center cursor-pointer ${isActive
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-100 hover:border-blue-300"
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-blue-50/50 pointer-events-none" />
                )}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.gradient
                    } rounded-lg sm:rounded-xl flex items-center justify-center shadow-md mb-2 relative z-10 ${isActive ? "scale-110" : ""
                    }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 relative z-10">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs font-medium text-gray-600 relative z-10">
                  {stat.label}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-lg"
            />
          </div>
        </motion.div>

        {/* Error State */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Error Loading
            </h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchRequests}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
            >
              Retry
            </button>
          </motion.div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Requests Found
            </h3>
            <p className="text-gray-600 text-sm">
              {searchTerm
                ? "Try adjusting your search"
                : filter !== "all"
                  ? `No ${filter} requests`
                  : "No contact requests yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredRequests.map((request, index) => {
                const hasPropertyInfo =
                  request.propertyInfo &&
                  (request.propertyInfo.title?.trim() ||
                    request.propertyInfo.location?.trim() ||
                    (typeof request.propertyInfo.price === "number" &&
                      request.propertyInfo.price > 0) ||
                    request.propertyInfo.type);

                return (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Card Content */}
                    <div className="p-3 sm:p-4">
                      {/* Property Header */}
                      {hasPropertyInfo && (
                        <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-1">
                              {request.propertyInfo.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-2">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {request.propertyInfo.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-blue-600">
                                ₹
                                {request.propertyInfo.price?.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                              <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] sm:text-xs font-semibold">
                                {request.propertyInfo.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status & Time */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100">
                        <div
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border ${getStatusColor(
                            request.status
                          )} font-semibold text-[10px] sm:text-xs`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{formatDate(request.createdAt)}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {request.userInfo.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              Interested Buyer
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <a
                            href={`mailto:${request.userInfo.email}`}
                            className="flex items-center gap-2 text-xs group"
                          >
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-700 group-hover:text-blue-600 transition-colors truncate flex-1">
                              {request.userInfo.email}
                            </span>
                            {/* <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" /> */}
                          </a>
                          <a
                            href={`tel:${request.userInfo.phone}`}
                            className="flex items-center gap-2 text-xs group"
                          >
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-700 group-hover:text-emerald-600 transition-colors">
                              {request.userInfo.phone}
                            </span>
                            {/* <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" /> */}
                          </a>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl">
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed line-clamp-3">
                              "{request.message}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {request.status === "pending" && (
                          <button
                            onClick={() =>
                              updateStatus(request._id, "contacted")
                            }
                            disabled={updatingStatus === request._id}
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg active:scale-95 transition-all font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                          >
                            {updatingStatus === request._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                <span>Updating...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Mark Contacted</span>
                              </>
                            )}
                          </button>
                        )}

                        {request.status === "contacted" && (
                          <button
                            onClick={() => updateStatus(request._id, "closed")}
                            disabled={updatingStatus === request._id}
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg active:scale-95 transition-all font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                          >
                            {updatingStatus === request._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                <span>Closing...</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Close</span>
                              </>
                            )}
                          </button>
                        )}

                        {request.status === "closed" && (
                          <div className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-500 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-center">
                            Request Closed
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorContactRequests;
