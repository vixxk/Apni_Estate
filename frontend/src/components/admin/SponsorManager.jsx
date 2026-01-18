
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
    Image as ImageIcon
} from "lucide-react";
import { Backendurl } from "../../App";

const SponsorManager = ({ adminEmail, adminPassword }) => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Add Sponsor Form State
    const [newSponsorName, setNewSponsorName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!newSponsorName.trim() || !selectedImage) {
            setError("Please provide both name and logo");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // 1. Upload Image
            const formData = new FormData();
            formData.append("logo", selectedImage);

            const uploadRes = await axios.post(
                `${Backendurl}/api/sponsors/upload`,
                formData,
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
                    name: newSponsorName,
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
                setSuccess("Sponsor added successfully!");
                setNewSponsorName("");
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";

                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error adding sponsor:", err);
            setError(err.response?.data?.message || err.message || "Failed to add sponsor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSponsor = async (id) => {
        if (!window.confirm("Are you sure you want to remove this sponsor?")) return;

        try {
            await axios.delete(`${Backendurl}/api/sponsors/${id}`, {
                headers: {
                    email: adminEmail,
                    password: adminPassword,
                },
            });

            setSponsors(sponsors.filter((s) => s._id !== id));
            setSuccess("Sponsor removed");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Error deleting sponsor:", err);
            setError("Failed to delete sponsor");
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
                        Add or remove partner logos displayed on the home page
                    </p>
                </div>
            </div>

            {/* Messages */}
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

            {/* Add New Sponsor Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-indigo-400" />
                    Add New Partner
                </h3>

                <form onSubmit={handleAddSponsor} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={newSponsorName}
                                onChange={(e) => setNewSponsorName(e.target.value)}
                                placeholder="e.g. Google, Microsoft"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-indigo-200/70 mb-1.5">
                                Logo Image (White/Transparent preferred)
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
                                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10 cursor-pointer transition-colors border-dashed"
                                >
                                    {imagePreview ? (
                                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                            <Upload size={14} className="text-white/50" />
                                        </div>
                                    )}
                                    <span className="text-sm text-white/50 truncate">
                                        {selectedImage ? selectedImage.name : "Click to upload logo"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !newSponsorName || !selectedImage}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    Add Partner
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Sponsors List */}
            <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    Currently Active ({sponsors.length})
                </h3>

                {loading ? (
                    <div className="text-center py-8">
                        <Loader2 size={24} className="animate-spin text-indigo-400 mx-auto" />
                    </div>
                ) : sponsors.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-sm bg-white/5 rounded-xl border border-dashed border-white/10">
                        No sponsors added yet. The section will be hidden on the home page.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <AnimatePresence>
                            {sponsors.map((sponsor) => (
                                <motion.div
                                    key={sponsor._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 relative group hover:border-indigo-500/30 transition-colors"
                                >
                                    <div className="aspect-video bg-white/5 rounded-lg mb-2 flex items-center justify-center p-2">
                                        <img
                                            src={sponsor.logoUrl}
                                            alt={sponsor.name}
                                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                    <h4 className="text-white text-xs font-medium text-center truncate px-1">
                                        {sponsor.name}
                                    </h4>
                                    <button
                                        onClick={() => handleDeleteSponsor(sponsor._id)}
                                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SponsorManager;
