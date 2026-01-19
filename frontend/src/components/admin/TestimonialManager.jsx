import React, { useState, useEffect } from "react";
import axios from "axios";
import { Backendurl } from "../../App";
import {
    CheckCircle,
    XCircle,
    Trash2,
    Loader2,
    Quote,
    Star,
    User,
    AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialManager = ({ adminEmail, adminPassword }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${Backendurl}/api/testimonials/admin/all`, {
                headers: {
                    email: adminEmail,
                    password: adminPassword,
                },
            });
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            alert("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setActionLoading(id);
            const { data } = await axios.put(
                `${Backendurl}/api/testimonials/admin/${id}/status`,
                { status },
                {
                    headers: {
                        email: adminEmail,
                        password: adminPassword,
                    },
                }
            );

            if (data.success) {
                setTestimonials((prev) =>
                    prev.map((t) =>
                        t._id === id ? { ...t, status: data.data.status } : t
                    )
                );
            }
        } catch (error) {
            console.error(`Error updating status to ${status}:`, error);
            alert("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteTestimonial = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            setActionLoading(id);
            const { data } = await axios.delete(
                `${Backendurl}/api/testimonials/admin/${id}`,
                {
                    headers: {
                        email: adminEmail,
                        password: adminPassword,
                    },
                }
            );

            if (data.success) {
                setTestimonials((prev) => prev.filter((t) => t._id !== id));
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            alert("Failed to delete testimonial");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredTestimonials = testimonials.filter((t) =>
        filter === "all" ? true : t.status === filter
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Quote className="w-5 h-5 text-blue-400" />
                    Testimonial Management
                </h2>
                <div className="flex flex-wrap gap-2">
                    {["all", "pending", "approved", "rejected"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                        >
                            {f}
                            <span className="ml-2 opacity-60 text-xs">
                                {testimonials.filter(t => f === 'all' ? true : t.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredTestimonials.length > 0 ? (
                        filteredTestimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 flex flex-col shadow-lg relative overflow-hidden group"
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider border ${getStatusColor(testimonial.status)}`}>
                                    {testimonial.status}
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    {testimonial.user?.avatar ? (
                                        <img
                                            src={testimonial.user.avatar}
                                            alt={testimonial.user.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-white/20">
                                            <User className="w-5 h-5 text-blue-300" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">
                                            {testimonial.user?.name || "Unknown User"}
                                        </h3>
                                        <p className="text-blue-200/60 text-xs">
                                            {testimonial.user?.email || "No Email"}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="flex-1 mb-4 relative">
                                    <Quote className="w-8 h-8 text-white/5 absolute -top-2 -left-2" />
                                    <p className="text-gray-300 text-sm italic relative z-10 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                </div>

                                {/* Date */}
                                <p className="text-xs text-gray-500 mb-4 border-t border-white/5 pt-2">
                                    Submitted: {new Date(testimonial.createdAt).toLocaleDateString()}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-auto">
                                    {testimonial.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(testimonial._id, 'approved')}
                                                disabled={actionLoading === testimonial._id}
                                                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium hover:scale-[1.02]"
                                            >
                                                {actionLoading === testimonial._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(testimonial._id, 'rejected')}
                                                disabled={actionLoading === testimonial._id}
                                                className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium hover:scale-[1.02]"
                                            >
                                                {actionLoading === testimonial._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {testimonial.status !== 'pending' && (
                                        <button
                                            onClick={() => updateStatus(testimonial._id, 'pending')}
                                            disabled={actionLoading === testimonial._id}
                                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium hover:scale-[1.02]"
                                        >
                                            Re-Review
                                        </button>
                                    )}

                                    <button
                                        onClick={() => deleteTestimonial(testimonial._id)}
                                        disabled={actionLoading === testimonial._id}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all hover:scale-110"
                                        title="Delete Permanently"
                                    >
                                        {actionLoading === testimonial._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>

                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-white/5 rounded-xl border border-white/10 border-dashed">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No testimonials found in this category.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TestimonialManager;
