import React from "react";
import { MapPin, AlertCircle } from "lucide-react";

const LocationForm = ({ form, handleNestedChange, fieldErrors }) => {
    return (
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${fieldErrors.address
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.city
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.state
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.pincode
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
    );
};

export default LocationForm;
