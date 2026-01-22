import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorState = ({ error }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
            <div className="text-center p-6 md:p-8 glass-panel rounded-xl md:rounded-2xl max-w-md w-full">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Property Not Found
                </h3>
                <p className="text-sm md:text-base text-red-600 mb-6">
                    {error || "The property you're looking for doesn't exist."}
                </p>
                <button
                    onClick={() => navigate("/properties")}
                    className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto text-sm md:text-base"
                >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    Back to Properties
                </button>
            </div>
        </div>
    );
};

export default ErrorState;
