import React from "react";
import {
    Wrench,
    Zap,
    HardHat,
    Settings,
    Paintbrush,
} from "lucide-react";

const ManpowerTypeSelect = ({ form, setForm }) => {
    return (
        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">1.5</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Select Manpower Type
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {[
                    { value: "plumber", label: "Plumber", icon: Wrench },
                    { value: "electrician", label: "Electrician", icon: Zap },
                    { value: "construction worker", label: "Construction Worker", icon: HardHat },
                    { value: "technician", label: "Technician", icon: Settings },
                    { value: "painter", label: "Painter", icon: Paintbrush },
                ].map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setForm({ ...form, propertySubType: type.value })}
                            className={`p-1.5 md:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 md:gap-2 ${form.propertySubType === type.value
                                ? "border-indigo-600 bg-indigo-50 shadow-md scale-105"
                                : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                                }`}
                        >
                            <Icon
                                size={18}
                                className={`md:w-6 md:h-6 ${form.propertySubType === type.value
                                    ? "text-indigo-600"
                                    : "text-gray-400"
                                    }`}
                            />
                            <span
                                className={`text-[10px] md:text-sm font-semibold truncate w-full text-center ${form.propertySubType === type.value
                                    ? "text-indigo-600"
                                    : "text-gray-700"
                                    }`}
                            >
                                {type.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ManpowerTypeSelect;
