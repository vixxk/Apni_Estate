import React from "react";
import { BedDouble, Bath, Maximize } from "lucide-react";

const FeaturesGrid = ({ property }) => {
    const propertyFeatures = [
        {
            value: property.beds,
            label: "Bedrooms",
            icon: BedDouble,
            color: "bg-blue-500",
        },
        {
            value: property.baths,
            label: "Bathrooms",
            icon: Bath,
            color: "bg-emerald-500",
        },
        {
            value: property.sqft,
            label: "sq ft",
            icon: Maximize,
            color: "bg-purple-500",
        },
    ].filter((feature) => feature.value > 0);

    if (propertyFeatures.length === 0) return null;

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-5">
            {propertyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div
                        key={index}
                        className="bg-gray-50 p-2.5 md:p-4 rounded-lg md:rounded-xl text-center border border-gray-200"
                    >
                        <div
                            className={`w-7 h-7 md:w-10 md:h-10 ${feature.color} rounded-md md:rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2`}
                        >
                            <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                        </div>
                        <p className="text-base md:text-2xl font-bold text-gray-900 mb-0.5">
                            {feature.value}
                        </p>
                        <p className="text-[10px] md:text-sm text-gray-600 font-medium">
                            {feature.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default FeaturesGrid;
