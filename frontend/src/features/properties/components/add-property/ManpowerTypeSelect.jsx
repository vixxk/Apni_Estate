import {
    Wrench,
    Zap,
    HardHat,
    Settings,
    Paintbrush,
    Hammer,
    BrickWall,
    Users
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
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                {[
                    { value: "carpenter", label: "Carpenter", icon: Hammer },
                    { value: "painter", label: "Painter", icon: Paintbrush },
                    { value: "plumber", label: "Plumber", icon: Wrench },
                    { value: "electrician", label: "Electrician", icon: Zap },
                    { value: "mason", label: "Mason (Construction Worker)", icon: BrickWall },
                    { value: "general labour", label: "General Labour", icon: Users },
                ].map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setForm({ ...form, propertySubType: type.value })}
                            className={`p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${form.propertySubType === type.value
                                ? "border-indigo-600 bg-indigo-50 shadow-md scale-105"
                                : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`mx-auto mb-1 md:mb-2 ${form.propertySubType === type.value
                                    ? "text-indigo-600"
                                    : "text-gray-400"
                                    }`}
                            />
                            <p
                                className={`text-[10px] md:text-xs font-semibold text-center leading-tight ${form.propertySubType === type.value
                                    ? "text-indigo-600"
                                    : "text-gray-700"
                                    }`}
                            >
                                {type.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ManpowerTypeSelect;
