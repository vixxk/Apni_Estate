import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Home,
  Building2,
  Hammer,
  MapPin,
  Phone,
  Mail,
  Tag,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  IndianRupee,
  Store,
  Scale,
  Compass,
  CreditCard,
  Package,
  Sofa,
  Palette,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const VendorAddProperty = () => {
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  // All Categories (matching your image exactly)
  const allCategories = [
    { value: "sell", label: "Sell", icon: Store },
    { value: "rent", label: "Rent", icon: Home },
    { value: "construction services", label: "Construction Services", icon: Hammer },
    { value: "interior", label: "Interior Designing", icon: Palette },
    { value: "legal service", label: "Legal Service", icon: Scale },
    { value: "vastu", label: "Vastu", icon: Compass },
    { value: "construction consulting", label: "Construction Consulting", icon: Building2 },
    { value: "home loan", label: "Home Loan", icon: CreditCard },
    { value: "construction materials", label: "Construction Materials", icon: Package },
    { value: "furniture", label: "Furniture", icon: Sofa },
    { value: "decoratives", label: "Decoratives", icon: Sparkles },
    { value: "others", label: "Others", icon: Building2 },
  ];

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "sell",
    category: "none",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: { latitude: null, longitude: null },
    },
    features: {
      bedrooms: "",
      bathrooms: "",
      area: "",
      floor: "",
      totalFloors: "",
      parking: false,
      furnished: "unfurnished",
      amenities: [],
    },
    contactInfo: {
      phone: "",
      email: "",
      alternatePhone: "",
    },
    metadata: {
      yearBuilt: "",
      propertyTax: "",
      maintenanceCharges: "",
      securityDeposit: "",
      noticePeriod: "",
    },
    tags: [],
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
  const propertyAmenities = [
    "Swimming Pool",
    "Gym",
    "Garden",
    "Security",
    "Lift",
    "Balcony",
    "Modular Kitchen",
    "Power Backup",
    "Water Supply",
    "CCTV",
    "Club House",
    "Play Area",
  ];

  // Determine if property fields are needed 
  const needsPropertyDetails = ["sell", "rent"].includes(form.type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [name]: value,
      },
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      features: {
        ...form.features,
        [name]: checked,
      },
    });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be less than 10MB");
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        amenities: prev.features.amenities.includes(amenity)
          ? prev.features.amenities.filter((a) => a !== amenity)
          : [...prev.features.amenities, amenity],
      },
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();
      if (!form.tags.includes(newTag) && form.tags.length < 10) {
        setForm({
          ...form,
          tags: [...form.tags, newTag],
        });
        e.target.value = "";
      }
    }
  };

  const removeTag = (index) => {
    setForm({
      ...form,
      tags: form.tags.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.description.trim())
      errors.description = "Description is required";
    if (!form.price || form.price <= 0) errors.price = "Valid price is required";
    if (images.length === 0) errors.images = "At least one image is required";

    // Property-specific validation (for Sell/Rent only)
    if (needsPropertyDetails) {
      if (!form.location.address.trim())
        errors.address = "Address is required";
      if (!form.location.city.trim())
        errors.city = "City is required";
      if (!form.location.state.trim())
        errors.state = "State is required";
      if (!form.location.pincode.trim()) {
        errors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(form.location.pincode)) {
        errors.pincode = "Enter a valid 6-digit pincode";
      }
    }

    if (form.contactInfo.phone && !/^\d{10}$/.test(form.contactInfo.phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (
      form.contactInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactInfo.email)
    ) {
      errors.email = "Enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix all errors before submitting");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      setUploadingImages(true);
      const uploadRes = await fetch(`${API}/api/properties/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || "Image upload failed");
      }

      const uploadData = await uploadRes.json();
      const uploadedImages = uploadData.data.images;
      setUploadingImages(false);

      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        type: form.type.toLowerCase(),
        category: "none",
        location: {
          address: form.location.address.trim() || "",
          city: form.location.city.trim() || "",
          state: form.location.state.trim() || "",
          pincode: form.location.pincode.trim() || "",
          coordinates: {
            latitude: form.location.coordinates.latitude || null,
            longitude: form.location.coordinates.longitude || null,
          },
        },
        features: {
          bedrooms: form.features.bedrooms
            ? Number(form.features.bedrooms)
            : 0,
          bathrooms: form.features.bathrooms
            ? Number(form.features.bathrooms)
            : 0,
          area: form.features.area ? Number(form.features.area) : null,
          floor: form.features.floor ? Number(form.features.floor) : null,
          totalFloors: form.features.totalFloors
            ? Number(form.features.totalFloors)
            : null,
          parking: form.features.parking,
          furnished: form.features.furnished,
          amenities: form.features.amenities,
        },
        contactInfo: {
          phone: form.contactInfo.phone || "",
          email: form.contactInfo.email || "",
          alternatePhone: form.contactInfo.alternatePhone || "",
        },
        metadata: {
          yearBuilt: form.metadata.yearBuilt
            ? Number(form.metadata.yearBuilt)
            : null,
          propertyTax: form.metadata.propertyTax
            ? Number(form.metadata.propertyTax)
            : null,
          maintenanceCharges: form.metadata.maintenanceCharges
            ? Number(form.metadata.maintenanceCharges)
            : null,
          securityDeposit: form.metadata.securityDeposit
            ? Number(form.metadata.securityDeposit)
            : null,
          noticePeriod: form.metadata.noticePeriod || null,
        },
        images: uploadedImages,
        tags: form.tags,
        status: "available",
      };

      const propertyRes = await fetch(`${API}/api/properties/vendor-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!propertyRes.ok) {
        const errorData = await propertyRes.json();
        throw new Error(errorData.message || "Failed to create listing");
      }

      // Scroll to top immediately on success
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      setSuccess("Listing submitted for admin review! You'll be notified once approved. 🎉");

      setTimeout(() => {
        resetForm();
      }, 4000);
    } catch (err) {
      setError(err.message || "An error occurred");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      type: "sell",
      category: "none",
      location: {
        address: "",
        city: "",
        state: "",
        pincode: "",
        coordinates: { latitude: null, longitude: null },
      },
      features: {
        bedrooms: "",
        bathrooms: "",
        area: "",
        floor: "",
        totalFloors: "",
        parking: false,
        furnished: "unfurnished",
        amenities: [],
      },
      contactInfo: {
        phone: "",
        email: "",
        alternatePhone: "",
      },
      metadata: {
        yearBuilt: "",
        propertyTax: "",
        maintenanceCharges: "",
        securityDeposit: "",
        noticePeriod: "",
      },
      tags: [],
    });
    setImages([]);
    setImagePreviews([]);
    setFieldErrors({});
    setSuccess("");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20 pb-8 px-3 sm:px-4 lg:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-indigo-600" size={24} />
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Listing
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            List your property or service and reach thousands of customers
          </p>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <AlertCircle className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 text-white">Error Occurred</h3>
                    <p className="text-red-50 text-sm leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError("")}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="mb-4"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 text-white">Success!</h3>
                    <p className="text-green-50 text-sm leading-relaxed">
                      {success}
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess("")}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Category Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Select Category
                </h2>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                {allCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: cat.value })}
                      className={`p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                        form.type === cat.value
                          ? "border-indigo-600 bg-indigo-50 shadow-md scale-105"
                          : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        className={`mx-auto mb-1 md:mb-2 ${
                          form.type === cat.value
                            ? "text-indigo-600"
                            : "text-gray-400"
                        }`}
                        size={20}
                      />
                      <p
                        className={`text-[10px] md:text-xs font-semibold text-center leading-tight ${
                          form.type === cat.value
                            ? "text-indigo-600"
                            : "text-gray-700"
                        }`}
                      >
                        {cat.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Spacious 3BHK Apartment"
                    value={form.title}
                    onChange={handleInputChange}
                    maxLength="100"
                    className={`w-full px-3 py-2.5 md:py-3 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.title
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    }`}
                  />
                  {fieldErrors.title && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {fieldErrors.title}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {form.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="number"
                      name="price"
                      placeholder="Enter amount"
                      value={form.price}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full pl-10 pr-3 py-2.5 md:py-3 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.price
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                  {fieldErrors.price && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {fieldErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your listing in detail..."
                    value={form.description}
                    onChange={handleInputChange}
                    maxLength="2000"
                    rows="4"
                    className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      fieldErrors.description
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    }`}
                  />
                  {fieldErrors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {fieldErrors.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {form.description.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            {needsPropertyDetails && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="text-green-600" size={16} />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Location Details *
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter complete address"
                      value={form.location.address}
                      onChange={(e) => handleNestedChange(e, "location")}
                      rows="2"
                      className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                        fieldErrors.address
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={form.location.city}
                      onChange={(e) => handleNestedChange(e, "location")}
                      className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.city
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={form.location.state}
                      onChange={(e) => handleNestedChange(e, "location")}
                      className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.state
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                    />
                    {fieldErrors.state && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={form.location.pincode}
                      onChange={(e) => handleNestedChange(e, "location")}
                      maxLength="6"
                      className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.pincode
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                    />
                    {fieldErrors.pincode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {fieldErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Property Features */}
            {needsPropertyDetails && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="text-blue-600" size={16} />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Property Features (Optional)
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      placeholder="0"
                      value={form.features.bedrooms}
                      onChange={(e) => handleNestedChange(e, "features")}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="0"
                      value={form.features.bathrooms}
                      onChange={(e) => handleNestedChange(e, "features")}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      name="area"
                      placeholder="0"
                      value={form.features.area}
                      onChange={(e) => handleNestedChange(e, "features")}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Floor
                    </label>
                    <input
                      type="number"
                      name="floor"
                      placeholder="0"
                      value={form.features.floor}
                      onChange={(e) => handleNestedChange(e, "features")}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Total Floors
                    </label>
                    <input
                      type="number"
                      name="totalFloors"
                      placeholder="0"
                      value={form.features.totalFloors}
                      onChange={(e) => handleNestedChange(e, "features")}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                      Furnishing
                    </label>
                    <select
                      name="furnished"
                      value={form.features.furnished}
                      onChange={(e) => handleNestedChange(e, "features")}
                      className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      {furnishedOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="parking"
                        checked={form.features.parking}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
                      Parking Available
                    </span>
                  </label>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {propertyAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all ${
                          form.features.amenities.includes(amenity)
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm"
                            : "border-gray-200 text-gray-700 hover:border-indigo-300"
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <Phone className="text-pink-600" size={16} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Contact (Optional)
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    value={form.contactInfo.phone}
                    onChange={(e) => handleNestedChange(e, "contactInfo")}
                    maxLength="10"
                    className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.phone
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.contactInfo.email}
                    onChange={(e) => handleNestedChange(e, "contactInfo")}
                    className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Tag className="text-yellow-600" size={16} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Tags (Optional)
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {form.tags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
                    >
                      <span className="text-xs font-medium">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <input
                type="text"
                placeholder="Type a tag and press Enter (max 10)"
                onKeyPress={handleAddTag}
                disabled={form.tags.length >= 10}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">
                Examples: luxury, near metro, etc.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <ImageIcon className="text-rose-600" size={16} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Upload Images *
                </h2>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 rounded-lg md:rounded-xl p-4 md:p-6 text-center bg-indigo-50/50 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                <Upload className="mx-auto mb-2 text-indigo-600" size={24} />
                <p className="text-indigo-600 font-bold text-sm md:text-base hover:text-indigo-700 mb-1">
                  Click to upload
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Max 5 images, 10MB each
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {images.length}/5 selected
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {fieldErrors.images && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {fieldErrors.images}
                </p>
              )}

              {imagePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3"
                >
                  <AnimatePresence>
                    {imagePreviews.map((preview, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="relative group"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 md:h-28 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
                            Primary
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3.5 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {uploadingImages
                    ? "Uploading..."
                    : "Publishing..."}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Publish Listing
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 text-gray-600"
        >
          <p className="text-xs md:text-sm">
            By publishing, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VendorAddProperty;
