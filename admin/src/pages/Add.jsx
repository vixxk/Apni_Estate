// admin/src/pages/add.jsx

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendurl } from "../config/constants";

const PROPERTY_TYPES = ["house", "apartment", "office", "villa"];
const AVAILABILITY_TYPES = ["rent", "sell"]; // matches schema category

const Add = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    category: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    beds: "",
    baths: "",
    sqft: "",
    phone: "",
    amenities: [],
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity("");
    }
  };

  // pick up to 4 images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Admin token missing. Please log in again.");
        setLoading(false);
        return;
      }

      // 1) upload image files to backend
      let images = [];
      if (imageFiles.length > 0) {
        const fd = new FormData();
        imageFiles.forEach((file) => fd.append("images", file));

        const uploadRes = await axios.post(
          `${backendurl}/api/upload/property-images`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const uploaded = uploadRes.data?.data?.images || [];
        if (!uploaded.length) {
          toast.error("Image upload failed");
          setLoading(false);
          return;
        }

        images = uploaded.map((img, idx) => ({
          url: img.url,
          isPrimary: idx === 0,
        }));
      } else {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      // 2) create property with image URLs
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type.toLowerCase(),
        category: formData.category.toLowerCase(), // rent/sell
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        features: {
          bedrooms: Number(formData.beds) || 0,
          bathrooms: Number(formData.baths) || 0,
          area: Number(formData.sqft) || 0,
          amenities: formData.amenities,
        },
        contactInfo: { phone: formData.phone },
        images,
      };

      const res = await axios.post(
        `${backendurl}/api/properties`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Property created successfully");
        // reset
        setFormData({
          title: "",
          description: "",
          price: "",
          type: "",
          category: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          beds: "",
          baths: "",
          sqft: "",
          phone: "",
          amenities: [],
        });
        setImageFiles([]);
        setPreviewUrls([]);
      } else {
        toast.error(res.data.message || "Failed to create property");
      }
    } catch (err) {
      console.error("Create property error:", err);
      toast.error(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select</option>
                {AVAILABILITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Beds</label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Baths</label>
              <input
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sqft</label>
              <input
                type="number"
                name="sqft"
                value={formData.sqft}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images (max 4)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              First image will be used as primary.
            </p>

            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {previewUrls.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
