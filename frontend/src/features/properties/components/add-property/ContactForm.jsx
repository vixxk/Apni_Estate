import React from "react";
import { Phone, AlertCircle } from "lucide-react";

const ContactForm = ({ form, handleNestedChange, fieldErrors }) => {
    return (
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.phone
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
                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 transition-all ${fieldErrors.email
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
    );
};

export default ContactForm;
