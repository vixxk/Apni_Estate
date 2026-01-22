import React from "react";
import { Check, Building } from "lucide-react";

const PropertyDescription = ({ property }) => {
    return (
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {/* Description */}
            <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5">
                <h2 className="text-sm md:text-lg font-bold mb-2 md:mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 md:h-6 bg-blue-600 rounded-full"></div>
                    Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-xs md:text-base">
                    {property.description}
                </p>
            </div>

            {/* Amenities */}
            <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5">
                <h2 className="text-sm md:text-lg font-bold mb-2 md:mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 md:h-6 bg-emerald-600 rounded-full"></div>
                    Amenities & Features
                </h2>
                {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
                        {property.amenities.map((amenity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-blue-50 rounded-md md:rounded-lg border border-blue-100"
                            >
                                <div className="p-1 bg-blue-600 rounded-sm flex-shrink-0">
                                    <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                                </div>
                                <span className="text-[10px] md:text-sm font-semibold text-gray-800 leading-tight">
                                    {amenity}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 md:py-6 text-gray-400">
                        <Building className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-xs md:text-sm">
                            No amenities information available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDescription;
