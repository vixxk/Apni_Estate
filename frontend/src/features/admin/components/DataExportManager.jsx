import { useState } from "react";
import axios from "axios";
import { Backendurl } from "../../../App";
import { toast } from "react-toastify";
import { Download, FileSpreadsheet, Calendar, Users, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DataExportManager = ({ adminEmail, adminPassword }) => {
    const [exportType, setExportType] = useState('all'); // 'daily', 'monthly', 'all'
    const [selectedDate, setSelectedDate] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'user', 'vendor'
    const [isDownloading, setIsDownloading] = useState(false);

    // Config for admin-protected routes - reusing similar auth headers pattern
    // Note: Ideally this should use the token from auth state, but following existing patterns in AdminDashboard
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Assuming standard Bearer token for 'protect' middleware which usually expects token
        },
    };



    const token = localStorage.getItem("userToken"); // Common key

    const downloadReport = async () => {
        try {
            setIsDownloading(true);
            let query = `filterType=${exportType}&role=${roleFilter}`;
            if (exportType !== 'all' && selectedDate) {
                query += `&date=${selectedDate}`;
            }

            const response = await axios.get(`${Backendurl}/api/users/export?${query}`, {
                headers: {
                    email: adminEmail,
                    password: adminPassword
                },
                responseType: 'blob',
            });

            let filePrefix = 'users_report';
            if (roleFilter === 'vendor') {
                filePrefix = 'vendors_report';
            } else if (roleFilter === 'all') {
                filePrefix = 'users_and_vendors_report';
            }

            const fileName = `${filePrefix}_${exportType}.xlsx`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download report");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="p-2 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Data Export Center</h1>
                    <p className="text-xs sm:text-sm text-indigo-200/70 mt-1">Download comprehensive reports for users and vendors</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Export Card */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl col-span-1 md:col-span-2 lg:col-span-2">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <FileSpreadsheet className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">User & Vendor Data</h3>
                            <p className="text-sm text-indigo-200/60 mt-1">
                                Export detailed lists of registered users and vendors including contact info and join dates.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Filters Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Role Filter */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-indigo-200/70">
                                    <Users className="w-4 h-4 text-indigo-400" />
                                    <span>Select User Type</span>
                                </label>
                                <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/10">
                                    {['all', 'user', 'vendor'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setRoleFilter(type)}
                                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md capitalize transition-all ${roleFilter === type
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'text-indigo-200/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Period Filter */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-indigo-200/70">
                                    <Filter className="w-4 h-4 text-indigo-400" />
                                    <span>Time Period</span>
                                </label>
                                <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/10">
                                    {['all', 'daily', 'monthly'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setExportType(type);
                                                setSelectedDate('');
                                            }}
                                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md capitalize transition-all ${exportType === type
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'text-indigo-200/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Date Picker (Conditional) */}
                        <AnimatePresence>
                            {exportType !== 'all' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2"
                                >
                                    <label className="block text-sm font-medium text-indigo-200/70 mb-2">
                                        Select {exportType === 'daily' ? 'Date' : 'Month'}
                                    </label>
                                    <div className="relative max-w-sm">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                                        <input
                                            type={exportType === 'daily' ? 'date' : 'month'}
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-white [color-scheme:dark]"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Download Button */}
                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={downloadReport}
                                disabled={(exportType !== 'all' && !selectedDate) || isDownloading}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Generating Report...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span>Download Report Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataExportManager;
