import React from "react";
import { IndianRupee, AlertCircle } from "lucide-react";

const BasicInfoForm = ({ form, handleInputChange, fieldErrors }) => {
    return (
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
                        className={`w-full px-3 py-2.5 md:py-3 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.title
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
                            className={`w-full pl-10 pr-3 py-2.5 md:py-3 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.price
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${fieldErrors.description
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
    );
};

export default BasicInfoForm;
