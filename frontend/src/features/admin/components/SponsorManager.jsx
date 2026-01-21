import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    X,
    Loader2,
    Trash2,
    Plus,
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon,
    MapPin,
    Calendar,
    Phone,
    Mail,
    Globe,
    Eye
} from "lucide-react";
import { Backendurl } from "../../../App";

const SponsorManager = ({ adminEmail, adminPassword }) => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Add Sponsor Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        launchDate: "",
        contactPhone: "",
        contactEmail: "",
        website: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Popup State
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const { data } = await axios.get(`${Backendurl}/api/sponsors`);
            if (data.success) {
                setSponsors(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch sponsors:", err);
            setError("Failed to load sponsors");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleAddSponsor = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !selectedImage) {
            setError("Please provide name and image");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // 1. Upload Image
            const uploadData = new FormData();
            uploadData.append("logo", selectedImage);

            const uploadRes = await axios.post(
                `${Backendurl}/api/sponsors/upload`,
                uploadData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        email: adminEmail,
                        password: adminPassword,
                    },
                }
            );

            if (!uploadRes.data.success) {
                throw new Error(uploadRes.data.message || "Image upload failed");
            }

            const logoUrl = uploadRes.data.url;

            // 2. Add Sponsor
            const addRes = await axios.post(
                `${Backendurl}/api/sponsors/add`,
                {
                    ...formData,
                    logoUrl: logoUrl,
                },
                {
                    headers: {
                        email: adminEmail,
                        password: adminPassword,
                    },
                }
            );

            if (addRes.data.success) {
                setSponsors([addRes.data.data, ...sponsors]);
                setSuccess("Brand added successfully!");

                // Reset form
                setFormData({
                    name: "",
                    description: "",
                    location: "",
                    launchDate: "",
                    contactPhone: "",
                    contactEmail: "",
                    website: ""
                });
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";

                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error adding sponsor:", err);
            setError(err.response?.data?.message || err.message || "Failed to add brand");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSponsor = async (id, e) => {
        e.stopPropagation(); // Prevent opening modal
        if (!window.confirm("Are you sure you want to remove this brand?")) return;

        try {
            await axios.delete(`${Backendurl}/api/sponsors/${id}`, {
                headers: {
                    email: adminEmail,
                    password: adminPassword,
                },
            });

            setSponsors(sponsors.filter((s) => s._id !== id));
            setSuccess("Brand removed");
            setTimeout(() => setSuccess(""), 3000);
            if (selectedSponsor?._id === id) setSelectedSponsor(null);
        } catch (err) {
            console.error("Error deleting sponsor:", err);
            setError("Failed to delete brand");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <ImageIcon className="text-indigo-400" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Manage Brands</h2>
                    <p className="text-sm text-indigo-200/70">
                        Add partner brands & projects
                    </p>
                </div>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-200 text-sm"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 flex items-center gap-2 text-green-200 text-sm"
                    >
                        <CheckCircle2 size={16} />
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add New Brand Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-indigo-400" />
                    Add New Brand
                </h3>

                <form onSubmit={handleAddSponsor} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Brand Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Prestige Group"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Bangalore, India"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Launch Date / Status
                                </label>
                                <input
                                    type="text"
                                    name="launchDate"
                                    value={formData.launchDate}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Coming Soon or 2024"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description about the brand or project..."
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20 resize-none"
                                />
                            </div>
                        </div>

                        {/* Right Column: Contact & Image */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Contact Details (Optional)
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                    />
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                    />
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="Website URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                    Cover Image * (Landscape preferred)
                                </label>
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg h-32 hover:bg-white/10 cursor-pointer transition-colors border-dashed"
                                    >
                                        {imagePreview ? (
                                            <div className="w-full h-full rounded-lg overflow-hidden p-1">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={20} className="text-white/50" />
                                                <span className="text-xs text-white/50">Click to upload image</span>
                                            </>
                                        )}
                                    </div>
                                    {selectedImage && (
                                        <p className="text-xs text-indigo-300 mt-1 truncate text-center">
                                            {selectedImage.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name || !selectedImage}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Add Brand
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Brands List (Display) */}
            <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    Active Brands ({sponsors.length})
                </h3>

                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 size={32} className="animate-spin text-indigo-400 mx-auto" />
                    </div>
                ) : sponsors.length === 0 ? (
                    <div className="text-center py-12 text-white/30 text-sm bg-white/5 rounded-xl border border-dashed border-white/10">
                        No brands added yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                        <div className="flex gap-4">
                            <AnimatePresence>
                                {sponsors.map((sponsor) => (
                                    <motion.div
                                        key={sponsor._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        layout
                                        className="min-w-[280px] w-[280px] bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative group flex flex-col flex-shrink-0"
                                    >
                                        {/* Image Section */}
                                        <div className="h-44 bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={sponsor.logoUrl}
                                                alt={sponsor.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4 flex flex-col flex-grow">

                                            {/* Tag Section (Date/Coming Soon) - Purple Pill */}
                                            <div className="mb-2">
                                                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                                    {sponsor.launchDate || "Coming Soon"}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-slate-900 font-bold text-lg mb-1 truncate">
                                                {sponsor.name}
                                            </h4>

                                            {/* Location */}
                                            <div className="flex items-center text-slate-500 text-sm mb-4">
                                                <MapPin size={14} className="mr-1 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{sponsor.location || "Location N/A"}</span>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px bg-slate-100 w-full mb-3"></div>

                                            {/* Description Button */}
                                            <button
                                                onClick={() => setSelectedSponsor(sponsor)}
                                                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-lg transition-colors"
                                            >
                                                View Description
                                            </button>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDeleteSponsor(sponsor._id, e)}
                                            className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 text-slate-400 hover:text-white p-1.5 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Brand"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Popup Modal */}
            <AnimatePresence>
                {selectedSponsor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSponsor(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-md relative"
                        >
                            <button
                                onClick={() => setSelectedSponsor(null)}
                                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="h-56 bg-slate-100 relative">
                                <img
                                    src={selectedSponsor.logoUrl}
                                    alt={selectedSponsor.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 text-white">
                                    <h3 className="text-2xl font-bold mb-0.5">{selectedSponsor.name}</h3>
                                    {selectedSponsor.location && (
                                        <p className="flex items-center text-sm text-white/80">
                                            <MapPin size={14} className="mr-1" />
                                            {selectedSponsor.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6 space-y-3">
                                    {selectedSponsor.description ? (
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {selectedSponsor.description}
                                        </p>
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">No description provided.</p>
                                    )}
                                </div>

                                <div className="space-y-3 border-t border-slate-100 pt-5">
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Information</h5>

                                    {selectedSponsor.launchDate && (
                                        <div className="flex items-center text-slate-700 text-sm">
                                            <Calendar size={16} className="mr-3 text-indigo-500" />
                                            <span>Launch: {selectedSponsor.launchDate}</span>
                                        </div>
                                    )}
                                    {selectedSponsor.contactPhone && (
                                        <div className="flex items-center text-slate-700 text-sm">
                                            <Phone size={16} className="mr-3 text-indigo-500" />
                                            <span>{selectedSponsor.contactPhone}</span>
                                        </div>
                                    )}
                                    {selectedSponsor.contactEmail && (
                                        <div className="flex items-center text-slate-700 text-sm">
                                            <Mail size={16} className="mr-3 text-indigo-500" />
                                            <span>{selectedSponsor.contactEmail}</span>
                                        </div>
                                    )}
                                    {selectedSponsor.website && (
                                        <div className="flex items-center text-slate-700 text-sm">
                                            <Globe size={16} className="mr-3 text-indigo-500" />
                                            <a
                                                href={selectedSponsor.website.startsWith('http') ? selectedSponsor.website : `https://${selectedSponsor.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:underline truncate"
                                            >
                                                {selectedSponsor.website}
                                            </a>
                                        </div>
                                    )}

                                    {!selectedSponsor.contactPhone && !selectedSponsor.contactEmail && !selectedSponsor.website && (
                                        <p className="text-sm text-slate-400">No contact details added.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SponsorManager;
