import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import CategorySelect from "./components/add-property/CategorySelect";
import PropertyTypeSelect from "./components/add-property/PropertyTypeSelect";
import ManpowerTypeSelect from "./components/add-property/ManpowerTypeSelect";
import BasicInfoForm from "./components/add-property/BasicInfoForm";
import LocationForm from "./components/add-property/LocationForm";
import FeaturesForm from "./components/add-property/FeaturesForm";
import ContactForm from "./components/add-property/ContactForm";
import TagInput from "./components/add-property/TagInput";
import ImageUpload from "./components/add-property/ImageUpload";

const API = import.meta.env.VITE_API_BASE_URL;

const VendorAddProperty = () => {
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  // All Categories (matching original UI but keeping logic)
  // Constants moved to sub-components

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "sell", // This tracks the high-level intent (sell/rent) OR the service type
    propertySubType: "apartment", // Only for real estate
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

  // Options constants moved to FeaturesForm

  // Determine if property fields are needed 
  // We check if the selected 'type' is one of our Listing Goals (sell/rent)
  const isRealEstateListing = ["sell", "rent"].includes(form.type);
  const needsPropertyDetails = isRealEstateListing;

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

      let finalType = form.type.toLowerCase();
      let finalCategory = "none";

      if (["sell", "rent"].includes(finalType)) {
        finalCategory = finalType;
        finalType = form.propertySubType || "others"; // This seems correct as a fallback, but for Manpower we want one of the 5 specific types
      } else if (finalType === "manpower") {
        finalCategory = "manpower";
        finalType = form.propertySubType;
      } else if (finalType.includes("construction") || finalType === "contractor") {
      }

      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        type: finalType,
        category: finalCategory,
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
          // ... existings
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
        status: "pending",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-8 px-3 sm:px-4 lg:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto pt-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-indigo-600" size={24} />
            <h1 className="text-2xl md:text-4xl font-bold text-blue-700">
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
            <CategorySelect form={form} setForm={setForm} />

            {/* Property Type Selection (Only for Sell/Rent) */}
            {isRealEstateListing && (
              <PropertyTypeSelect form={form} setForm={setForm} />
            )}

            {form.type === "manpower" && (
              <ManpowerTypeSelect form={form} setForm={setForm} />
            )}

            {/* Basic Information */}
            <BasicInfoForm
              form={form}
              handleInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />

            {/* Location Section */}
            {needsPropertyDetails && (
              <LocationForm
                form={form}
                handleNestedChange={handleNestedChange}
                fieldErrors={fieldErrors}
              />
            )}

            {/* Property Features */}
            {needsPropertyDetails && (
              <FeaturesForm
                form={form}
                handleNestedChange={handleNestedChange}
                handleCheckboxChange={handleCheckboxChange}
                toggleAmenity={toggleAmenity}
              />
            )}

            {/* Contact Information */}
            <ContactForm
              form={form}
              handleNestedChange={handleNestedChange}
              fieldErrors={fieldErrors}
            />

            {/* Tags */}
            <TagInput
              form={form}
              removeTag={removeTag}
              handleAddTag={handleAddTag}
            />

            {/* Image Upload */}
            <ImageUpload
              images={images}
              fieldErrors={fieldErrors}
              fileInputRef={fileInputRef}
              handleImageSelect={handleImageSelect}
              imagePreviews={imagePreviews}
              removeImage={removeImage}
            />

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
    </div >
  );
};

export default VendorAddProperty;
