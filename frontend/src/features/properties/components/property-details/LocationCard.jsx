import React from "react";
import { Compass, MapPin, ExternalLink } from "lucide-react";

const LocationCard = ({ property }) => {
    if (!property.location) return null;

    return (
        <div className="mt-3 md:mt-5 bg-white rounded-lg md:rounded-xl p-3 md:p-5 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 md:p-2 bg-red-500 rounded-md md:rounded-lg">
                    <Compass className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm md:text-lg font-bold text-gray-900">
                        Location
                    </h3>
                    <p className="text-[10px] md:text-sm text-gray-600">
                        Find this property on the map
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-md md:rounded-lg p-2.5 md:p-4 mb-3 border border-gray-200">
                <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800 font-medium text-xs md:text-base">
                        {property.location}
                    </p>
                </div>
            </div>

            <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                    property.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xs md:text-base"
            >
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                View on Google Maps
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </a>
        </div>
    );
};

export default LocationCard;
