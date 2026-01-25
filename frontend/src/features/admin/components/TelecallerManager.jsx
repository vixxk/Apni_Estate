// ... imports
import { useState, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../../../App";
import { toast } from "react-toastify";
import {
    Users,
    Plus,
    Download,
    Search,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TelecallerManager = () => {
    const [telecallers, setTelecallers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Export Report State
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState('all'); // 'all', 'daily', 'monthly'
    const [selectedDate, setSelectedDate] = useState('');
    const [exportPromoCode, setExportPromoCode] = useState(''); // New state for promo code

    const [newTelecaller, setNewTelecaller] = useState({ name: "", phone: "", email: "" });
    const [creating, setCreating] = useState(false);
    const [filter, setFilter] = useState("");

    const adminEmail = localStorage.getItem("adminEmail");
    const adminPassword = localStorage.getItem("adminPassword");

    // Config for admin-protected routes
    const config = {
        headers: {
            email: adminEmail,
            password: adminPassword
        },
    };

    const fetchTelecallers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${Backendurl}/api/telecallers`, config);
            if (data.success) {
                setTelecallers(data.data);
            }
        } catch {
            toast.error("Failed to load telecallers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!adminEmail || !adminPassword) {
            toast.error("Admin credentials not found. Please log in again.");
            return;
        }
        fetchTelecallers();
    }, [adminEmail, adminPassword]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTelecaller.name || !newTelecaller.phone) {
            toast.error("Name and Phone are required");
            return;
        }

        try {
            setCreating(true);
            const { data } = await axios.post(`${Backendurl}/api/telecallers`, newTelecaller, config);
            if (data.success) {
                toast.success("Telecaller added successfully");
                setTelecallers([data.data, ...telecallers]);
                setShowAddModal(false);
                setNewTelecaller({ name: "", phone: "", email: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add telecaller");
        } finally {
            setCreating(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        // Optimistic update
        const newStatus = !currentStatus;

        // Update main list
        setTelecallers(prev => prev.map(t =>
            t._id === id ? { ...t, active: newStatus } : t
        ));

        // Update selected item if it matches
        if (selectedTelecaller && selectedTelecaller._id === id) {
            setSelectedTelecaller(prev => ({ ...prev, active: newStatus }));
        }

        try {
            const { data } = await axios.put(`${Backendurl}/api/telecallers/${id}/status`, {}, config);
            if (data.success) {
                toast.success(`Telecaller ${newStatus ? 'activated' : 'deactivated'}`);
            } else {
                // Revert on API failure (soft failure)
                revertStatus(id, currentStatus);
                toast.error("Failed to update status");
            }
        } catch {
            // Revert on Network/Server failure
            revertStatus(id, currentStatus);
            toast.error("Failed to update status");
        }
    };

    const revertStatus = (id, oldStatus) => {
        setTelecallers(prev => prev.map(t =>
            t._id === id ? { ...t, active: oldStatus } : t
        ));
        if (selectedTelecaller && selectedTelecaller._id === id) {
            setSelectedTelecaller(prev => ({ ...prev, active: oldStatus }));
        }
    };

    const downloadReport = async () => {
        try {
            let query = `filterType=${exportType}`;
            if (exportType !== 'all' && selectedDate) {
                query += `&date=${selectedDate}`;
            }
            if (exportPromoCode) {
                query += `&promoCode=${exportPromoCode}`;
            }

            const response = await axios.get(`${Backendurl}/api/telecallers/export?${query}`, {
                ...config,
                responseType: 'blob',
            });

            const fileName = exportPromoCode
                ? `telecaller_report_${exportPromoCode}_${exportType}.xlsx`
                : `telecaller_report_${exportType}.xlsx`;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setShowExportModal(false);
            setExportPromoCode(''); // Reset after download
            toast.success("Report downloaded successfully");
        } catch {
            toast.error("Failed to download report");
        }
    };

    const filteredTelecallers = telecallers.filter(t =>
        t.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.referralId.toLowerCase().includes(filter.toLowerCase()) ||
        t.phone.includes(filter)
    );

    const [selectedTelecaller, setSelectedTelecaller] = useState(null);

    // ... existing functions ...

    return (
        <div className="p-2 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Telecaller Management</h1>
                    <p className="text-xs sm:text-sm text-indigo-200/70 mt-1">Manage team members and track performance</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm font-medium backdrop-blur-sm"
                    >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Export</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-xs sm:text-sm font-medium shadow-lg shadow-indigo-500/30"
                    >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add Telecaller</span>
                        <span className="sm:hidden">Add New</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards Overview - Compact on Mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/5 p-3 sm:p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <p className="text-[10px] sm:text-sm font-medium text-indigo-200/70">Total</p>
                            <h3 className="text-lg sm:text-3xl font-bold text-white mt-1 sm:mt-2">{telecallers.length}</h3>
                        </div>
                        <div className="p-1.5 sm:p-3 bg-blue-500/20 rounded-lg hidden sm:block">
                            <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 p-3 sm:p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <p className="text-[10px] sm:text-sm font-medium text-indigo-200/70">Active</p>
                            <h3 className="text-lg sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                                {telecallers.filter(t => t.active).length}
                            </h3>
                        </div>
                        <div className="p-1.5 sm:p-3 bg-green-500/20 rounded-lg hidden sm:block">
                            <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 p-3 sm:p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <p className="text-[10px] sm:text-sm font-medium text-indigo-200/70">Onboardings</p>
                            <h3 className="text-lg sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                                {telecallers.reduce((sum, t) => sum + (t.onboardings?.length || 0), 0)}
                            </h3>
                        </div>
                        <div className="p-1.5 sm:p-3 bg-purple-500/20 rounded-lg hidden sm:block">
                            <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and List */}
            <div className="bg-white/5 rounded-xl shadow-lg border border-white/10 overflow-hidden backdrop-blur-sm">
                <div className="p-3 sm:p-4 border-b border-white/10 bg-white/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-indigo-200 uppercase text-[10px] sm:text-xs font-semibold tracking-wider border-b border-white/10">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center">ID</th>
                                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center">Onboardings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-indigo-200/60 font-medium text-sm">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredTelecallers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-indigo-200/60 font-medium text-sm">
                                        No telecallers found
                                    </td>
                                </tr>
                            ) : (
                                filteredTelecallers.map((t) => (
                                    <tr
                                        key={t._id}
                                        onClick={() => setSelectedTelecaller(t)}
                                        className="hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                                                <span className="font-semibold text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                                    {t.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                {t.referralId}
                                            </span>
                                        </td>
                                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center">
                                            <span className="font-semibold text-white text-xs sm:text-sm">{t.onboardings?.length || 0}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedTelecaller && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0f172a] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedTelecaller.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${selectedTelecaller.active
                                        ? 'bg-green-500/10 text-green-400'
                                        : 'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${selectedTelecaller.active ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        {selectedTelecaller.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedTelecaller(null)}
                                    className="p-2 -mr-2 text-indigo-200/60 hover:text-white rounded-full hover:bg-white/10"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-center">
                                        <p className="text-xs text-indigo-300 font-medium uppercase tracking-wide">Referral ID</p>
                                        <p className="text-2xl font-bold text-indigo-400 mt-1">{selectedTelecaller.referralId}</p>
                                    </div>
                                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 text-center">
                                        <p className="text-xs text-purple-300 font-medium uppercase tracking-wide">Onboardings</p>
                                        <p className="text-2xl font-bold text-purple-400 mt-1">{selectedTelecaller.onboardings?.length || 0}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="p-2 bg-white/10 rounded-lg shadow-sm">
                                            <Phone className="w-5 h-5 text-indigo-300" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-200/60">Phone Number</p>
                                            <p className="text-sm font-medium text-white">{selectedTelecaller.phone}</p>
                                        </div>
                                    </div>
                                    {selectedTelecaller.email && (
                                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                            <div className="p-2 bg-white/10 rounded-lg shadow-sm">
                                                <Mail className="w-5 h-5 text-indigo-300" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-indigo-200/60">Email Address</p>
                                                <p className="text-sm font-medium text-white break-all">{selectedTelecaller.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => toggleStatus(selectedTelecaller._id, selectedTelecaller.active)}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${selectedTelecaller.active
                                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                        : "bg-green-600 text-white hover:bg-green-700 shadow-green-500/25"
                                        }`}
                                >
                                    {selectedTelecaller.active ? (
                                        <>Deactivate Account</>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Activate Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0f172a] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/10"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-lg font-semibold text-white">Add New Telecaller</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-indigo-200/60 hover:text-white"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-indigo-200/70 mb-1">Full Name</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white placeholder-white/20"
                                            placeholder="e.g. Rahul Kumar"
                                            value={newTelecaller.name}
                                            onChange={e => setNewTelecaller({ ...newTelecaller, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-indigo-200/70 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                        <input
                                            type="tel"
                                            className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white placeholder-white/20"
                                            placeholder="e.g. 9876543210"
                                            value={newTelecaller.phone}
                                            onChange={e => setNewTelecaller({ ...newTelecaller, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-indigo-200/70 mb-1">Email Address (Optional)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                        <input
                                            type="email"
                                            className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white placeholder-white/20"
                                            placeholder="e.g. rahul@example.com"
                                            value={newTelecaller.email}
                                            onChange={e => setNewTelecaller({ ...newTelecaller, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-2.5 text-sm font-medium text-indigo-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {creating ? "Adding..." : "Create Telecaller"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Export Report Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0f172a] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-white/10"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-lg font-semibold text-white">Export Report</h3>
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="text-indigo-200/60 hover:text-white"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-indigo-200/70">Filter Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['all', 'daily', 'monthly'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setExportType(type);
                                                    setSelectedDate('');
                                                }}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors border ${exportType === type
                                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                                    : 'bg-white/5 border-white/10 text-indigo-200/60 hover:bg-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {exportType !== 'all' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2"
                                    >
                                        <label className="block text-sm font-medium text-indigo-200/70">
                                            Select {exportType === 'daily' ? 'Date' : 'Month'}
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                            <input
                                                type={exportType === 'daily' ? 'date' : 'month'}
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white [color-scheme:dark]"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-indigo-200/70">
                                        Promo Code Filter (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. AE05"
                                            value={exportPromoCode}
                                            onChange={(e) => setExportPromoCode(e.target.value.toUpperCase())}
                                            className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white placeholder-white/20 uppercase"
                                        />
                                    </div>
                                    <p className="text-xs text-indigo-200/50">Leave empty to export for all telecallers</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setShowExportModal(false)}
                                        className="flex-1 py-2.5 text-sm font-medium text-indigo-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={downloadReport}
                                        disabled={exportType !== 'all' && !selectedDate}
                                        className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TelecallerManager;
