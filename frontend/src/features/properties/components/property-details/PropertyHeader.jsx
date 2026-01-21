import React from "react";
import { MapPin, Building } from "lucide-react";

const PropertyHeader = ({ property }) => {
    return (
        <div className="mb-3 md:mb-5">
            {/* Title */}
            <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {property.title}
            </h1>

            {/* Location */}
            {property.location && (
                <div className="flex items-start gap-1.5 md:gap-2 text-gray-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span className="text-xs sm:text-sm md:text-base">
                        {property.location}
                    </span>
                </div>
            )}

            {/* Mobile: Price*/}
            <div className="lg:hidden mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 shadow-md w-full">
                    <p className="text-white/80 text-[10px] font-medium mb-0.5">Price</p>
                    <p className="text-xl font-bold text-white">
                        ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                </div>
            </div>

            {/* Mobile: Property Type Badge */}
            {property.type && (
                <div className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-100 rounded-lg border border-purple-200 mb-3">
                    <Building className="w-3 h-3 text-purple-600 flex-shrink-0" />
                    <span className="text-purple-900 font-semibold text-xs">
                        {property.type}
                    </span>
                </div>
            )}

            {/* Desktop: Price and Type */}
            <div className="hidden lg:flex lg:items-center lg:justify-between lg:mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 shadow-lg min-w-[240px]">
                    <p className="text-white/80 text-xs font-medium mb-1">Price</p>
                    <p className="text-3xl font-bold text-white">
                        ₹{Number(property.price).toLocaleString("en-IN")}
                    </p>
                </div>

                {property.type && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl border border-purple-200">
                        <Building className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-900 font-semibold text-sm">
                            {property.type}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyHeader;
