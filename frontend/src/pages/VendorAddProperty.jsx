import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const VendorAddProperty = () => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "Construction Services",
    category: "sell",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    "Buy",
    "Rent",
    "Sell",
    "Construction Services",
    "Interior",
    "Legal Service",
    "Vastu",
    "Construction Consulting",
    "Home Loan",
    "Construction Materials",
  ];

  const categories = ["rent", "sell", "buy","N/A-"];

  // Determine what fields to show based on service type
  const isPropertyType = ["Houses", "Apartments", "Shops", "Commercial Plots", "Farm House"].includes(form.type);
  const isServiceType = ["Construction Services", "Interior", "Legal Service", "Vastu", "Construction Consulting", "Home Loan", "Construction Materials"].includes(form.type);
  const needsPropertyDetails = ["Houses", "Apartments", "Shops"].includes(form.type);
  const needsPlotDetails = ["Commercial Plots", "Farm House"].includes(form.type);

  const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
  const propertyAmenities = [
    "Swimming Pool",
    "Gym",
    "Garden",
    "Parking",
    "Security",
    "Lift",
    "Balcony",
    "Kitchen",
    "AC",
    "Balcony with View",
    "Attached Bathrooms",
    "Modular Kitchen",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setImages([...images, ...files]);

    files.forEach((file) => {
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
      if (!form.tags.includes(newTag)) {
        setForm({
          ...form,
          tags: [...form.tags, newTag],
        });
      }
      e.target.value = "";
    }
  };

  const removeTag = (index) => {
    setForm({
      ...form,
      tags: form.tags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!form.title || !form.description || !form.price || images.length === 0) {
      setError("Please fill all required fields and upload at least one image");
      return;
    }

    // Location validation only for properties
    if (isPropertyType && (!form.location.address || !form.location.city || !form.location.state || !form.location.pincode)) {
      setError("Please fill all location details");
      return;
    }

    // Validate pincode if provided
    if (form.location.pincode && !/^\d{6}$/.test(form.location.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

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

      // Prepare property data
      const propertyData = {
        ...form,
        price: Number(form.price),
        features: {
          ...form.features,
          bedrooms: form.features.bedrooms ? Number(form.features.bedrooms) : null,
          bathrooms: form.features.bathrooms ? Number(form.features.bathrooms) : null,
          area: form.features.area ? Number(form.features.area) : null,
          floor: form.features.floor ? Number(form.features.floor) : null,
          totalFloors: form.features.totalFloors ? Number(form.features.totalFloors) : null,
        },
        metadata: {
          yearBuilt: form.metadata.yearBuilt ? Number(form.metadata.yearBuilt) : null,
          propertyTax: form.metadata.propertyTax ? Number(form.metadata.propertyTax) : null,
          maintenanceCharges: form.metadata.maintenanceCharges ? Number(form.metadata.maintenanceCharges) : null,
          securityDeposit: form.metadata.securityDeposit ? Number(form.metadata.securityDeposit) : null,
          noticePeriod: form.metadata.noticePeriod || null,
        },
        images: uploadedImages,
        status: "available",
      };

      // Create property
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
        throw new Error(errorData.message || "Failed to create property");
      }

      setSuccess("Listing created successfully!");
      
      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        type: "Construction Services",
        category: "sell",
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

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          {isPropertyType ? "List Your Property" : "List Your Service"}
        </h1>
        <p className="text-gray-600 mb-8">
          {isPropertyType 
            ? "Add detailed information about your property" 
            : "Add information about your service offering"}
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded"
          >
            <p className="text-green-700">{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder={`${isPropertyType ? 'Property' : 'Service'} Title *`}
                value={form.title}
                onChange={handleInputChange}
                maxLength="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price (₹) *"
                value={form.price}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              name="description"
              placeholder={`${isPropertyType ? 'Property' : 'Service'} Description *`}
              value={form.description}
              onChange={handleInputChange}
              maxLength="2000"
              rows="4"
              className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location - Only for Properties */}
          {isPropertyType && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Location Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  name="address"
                  placeholder="Full Address *"
                  value={form.location.address}
                  onChange={(e) => handleNestedChange(e, "location")}
                  rows="2"
                  className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={form.location.city}
                  onChange={(e) => handleNestedChange(e, "location")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={form.location.state}
                  onChange={(e) => handleNestedChange(e, "location")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode (6 digits) *"
                  value={form.location.pincode}
                  onChange={(e) => handleNestedChange(e, "location")}
                  maxLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Service Area - For Services */}
          {isServiceType && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Service Area (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City/Area you serve"
                  value={form.location.city}
                  onChange={(e) => handleNestedChange(e, "location")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.location.state}
                  onChange={(e) => handleNestedChange(e, "location")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Property Features - Only for Houses, Apartments, Shops */}
          {needsPropertyDetails && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Property Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Bedrooms"
                  value={form.features.bedrooms}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Bathrooms"
                  value={form.features.bathrooms}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="area"
                  placeholder="Area (sq.ft)"
                  value={form.features.area}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="floor"
                  placeholder="Floor Number"
                  value={form.features.floor}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  name="totalFloors"
                  placeholder="Total Floors"
                  value={form.features.totalFloors}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  name="furnished"
                  value={form.features.furnished}
                  onChange={(e) => handleNestedChange(e, "features")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {furnishedOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>

                <label className="flex items-center space-x-3 py-3">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={form.features.parking}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="text-gray-700">Parking Available</span>
                </label>
              </div>

              {/* Amenities for Properties */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`py-2 px-3 rounded-lg border-2 transition text-sm ${
                        form.features.amenities.includes(amenity)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 text-gray-700 hover:border-blue-500"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Plot Details - For Commercial Plots and Farm House */}
          {needsPlotDetails && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Plot Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="area"
                  placeholder="Plot Area (sq.ft) *"
                  value={form.features.area}
                  onChange={(e) => handleNestedChange(e, "features")}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="flex items-center space-x-3 py-3">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={form.features.parking}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="text-gray-700">Road Access Available</span>
                </label>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={form.contactInfo.phone}
                onChange={(e) => handleNestedChange(e, "contactInfo")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.contactInfo.email}
                onChange={(e) => handleNestedChange(e, "contactInfo")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Tags (Optional)
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="text-white hover:text-gray-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              onKeyPress={handleAddTag}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Upload Images (Max 5) *
            </h2>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition">
              <Upload className="mx-auto mb-3 text-blue-500" size={32} />
              <label className="cursor-pointer">
                <span className="text-blue-600 font-semibold">Click to upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <p className="text-gray-600 text-sm mt-2">
                PNG, JPG, JPEG up to 10MB each
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {images.length}/5 images selected
              </p>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-lg"
          >
            {loading ? "Publishing..." : `Publish ${isPropertyType ? 'Property' : 'Service'}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorAddProperty;
