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
import { Backendurl } from "../../../App";
import PropertyReviewCard from "./PropertyReviewCard";
import SponsorManager from "./SponsorManager";
import TestimonialManager from "./TestimonialManager";
import TelecallerManager from "./TelecallerManager";

// Dashboard Components
import LoadingState from "./dashboard/LoadingState";
import DashboardHeader from "./dashboard/DashboardHeader";
import TabNavigation from "./dashboard/TabNavigation";
import FilterStats from "./dashboard/FilterStats";
import CategoryStats from "./dashboard/CategoryStats";
import SearchFilter from "./dashboard/SearchFilter";
import EmptyState from "./dashboard/EmptyState";
import Pagination from "./dashboard/Pagination";

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

  // Tabs
  const [activeTab, setActiveTab] = useState("properties");

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


    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Apply filters and update category stats
  const applyFilters = () => {
    let baseProperties = [...allProperties];

    // 1. First apply status filter to get the "current set" for category counting
    let statusFiltered = baseProperties;
    if (statusFilter !== "all") {
      statusFiltered = baseProperties.filter(
        (property) => property.status === statusFilter
      );
    }

    // Update category stats based on the status-filtered list
    const newCategoryStats = {};
    statusFiltered.forEach((property) => {
      const type = (property.type || "others").toLowerCase();
      newCategoryStats[type] = (newCategoryStats[type] || 0) + 1;
    });
    setCategoryStats(newCategoryStats);

    // 2. Now apply category filter and search query for the display list
    let finalFiltered = statusFiltered;

    if (categoryFilter !== "all") {
      finalFiltered = finalFiltered.filter(
        (property) => (property.type || "others").toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      finalFiltered = finalFiltered.filter((property) =>
        property.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log("Applied filters:", {
      statusFilter,
      categoryFilter,
      searchQuery,
      originalCount: allProperties.length,
      filteredCount: finalFiltered.length,
    });

    setDisplayedProperties(finalFiltered);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const handleApprove = async (propertyId, notes) => {
    const originalProperties = [...allProperties];
    setAllProperties(prev =>
      prev.map(p =>
        p._id === propertyId
          ? { ...p, status: "approved", reviewNotes: notes }
          : p
      )
    );
    setStats(prev => prev ? {
      ...prev,
      approvedProperties: prev.approvedProperties + 1,
      pendingProperties: prev.pendingProperties - 1
    } : prev);

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
      setAllProperties(originalProperties);
      console.error("Failed to approve property:", error);
      alert(error.response?.data?.message || "Failed to approve property");
      await loadAllData();
    }
  };

  const handleReject = async (propertyId, reason, notes) => {
    const originalProperties = [...allProperties];
    setAllProperties(prev =>
      prev.map(p =>
        p._id === propertyId
          ? { ...p, status: "rejected", rejectionReason: reason, reviewNotes: notes }
          : p
      )
    );
    setStats(prev => prev ? {
      ...prev,
      rejectedProperties: prev.rejectedProperties + 1,
      pendingProperties: prev.pendingProperties - 1
    } : prev);

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
      // Revert on error
      setAllProperties(originalProperties);
      console.error("Failed to reject property:", error);
      alert(error.response?.data?.message || "Failed to reject property");
      await loadAllData();
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    const originalProperties = [...allProperties];
    const deletedProperty = allProperties.find(p => p._id === propertyId);

    setAllProperties(prev => prev.filter(p => p._id !== propertyId));
    setStats(prev => {
      if (!prev || !deletedProperty) return prev;
      const updates = { totalProperties: prev.totalProperties - 1 };
      if (deletedProperty.status === 'pending') updates.pendingProperties = prev.pendingProperties - 1;
      if (deletedProperty.status === 'approved') updates.approvedProperties = prev.approvedProperties - 1;
      if (deletedProperty.status === 'rejected') updates.rejectedProperties = prev.rejectedProperties - 1;
      return { ...prev, ...updates };
    });
    setCategoryStats(prev => {
      if (!prev || !deletedProperty?.type) return prev;
      const newStats = { ...prev };
      if (newStats[deletedProperty.type] > 1) {
        newStats[deletedProperty.type]--;
      } else {
        delete newStats[deletedProperty.type];
      }
      return newStats;
    });

    try {
      await axios.delete(`${Backendurl}/api/admin/properties/${propertyId}`, {
        headers: {
          email: adminEmail,
          password: adminPassword,
        },
      });
      await loadAllData();
    } catch (error) {
      setAllProperties(originalProperties);
      console.error("Failed to delete property:", error);
      alert(error.response?.data?.message || "Failed to delete property");
      await loadAllData();
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
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-6 px-3 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <DashboardHeader handleLogout={handleLogout} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "sponsors" ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SponsorManager adminEmail={adminEmail} adminPassword={adminPassword} />
          </motion.div>
        ) : activeTab === "testimonials" ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TestimonialManager adminEmail={adminEmail} adminPassword={adminPassword} />
          </motion.div>
        ) : activeTab === "telecallers" ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TelecallerManager />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Status Stats Cards */}
            <FilterStats
              stats={stats}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Category Distribution */}
            <CategoryStats
              categoryStats={categoryStats}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              totalCategoryCount={totalCategoryCount}
            />

            {/* Search and Active Filters */}
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              displayedCount={displayedProperties.length}
            />

            {/* Properties List */}
            <div className="space-y-4">
              {paginatedProperties.length === 0 ? (
                <EmptyState
                  searchQuery={searchQuery}
                  categoryFilter={categoryFilter}
                  statusFilter={statusFilter}
                  clearFilters={() => {
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setSearchQuery("");
                  }}
                />
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </motion.div>
        )
        }
      </div >
    </div >
  );
};

export default AdminDashboard;