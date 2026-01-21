import React from "react";
import { Building2 } from "lucide-react";

const FeaturesForm = ({
    form,
    handleNestedChange,
    handleCheckboxChange,
    toggleAmenity,
}) => {
    const furnishedOptions = ["furnished", "semi-furnished", "unfurnished"];
    const propertyAmenities = [
        "24/7 Security",
        "Power Backup",
        "Car Parking",
        "Lift",
        "Swimming Pool",
        "Gym",
        "Garden / Park",
        "Club House",
        "CCTV",
        "Water Supply",
        "Balcony",
        "Modular Kitchen",
        "Vastu Compliant",
        "Intercom",
        "Fire Safety",
        "Wi-Fi/Internet",
        "Maintenance Staff",
        "Visitor Parking",
    ];

    return (
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
                            className={`py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all ${form.features.amenities.includes(amenity)
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
    );
};

export default FeaturesForm;
