import React from "react";
import {
    Store,
    Home,
    Hammer,
    Palette,
    Scale,
    Compass,
    Building2,
    CreditCard,
    Package,
    Sofa,
    Sparkles,
} from "lucide-react";

const CategorySelect = ({ form, setForm }) => {
    const allCategories = [
        { value: "sell", label: "Sell Property", icon: Store },
        { value: "rent", label: "Rent/Lease", icon: Home },
        { value: "construction services", label: "Construction Services", icon: Hammer },
        { value: "interior", label: "Interior Designing", icon: Palette },
        { value: "legal service", label: "Legal Service", icon: Scale },
        { value: "vastu", label: "Vastu", icon: Compass },
        { value: "construction consulting", label: "Construction Consulting", icon: Building2 },
        { value: "home loan", label: "Home Loan", icon: CreditCard },
        { value: "construction materials", label: "Construction Materials", icon: Package },
        { value: "furniture", label: "Furniture", icon: Sofa },
        { value: "decoratives", label: "Decoratives", icon: Sparkles },
        { value: "others", label: "Others", icon: Building2 },
    ];

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Select Category
                </h2>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                {allCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => setForm({ ...form, type: cat.value })}
                            className={`p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${form.type === cat.value
                                    ? "border-indigo-600 bg-indigo-50 shadow-md scale-105"
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                                }`}
                        >
                            <Icon
                                className={`mx-auto mb-1 md:mb-2 ${form.type === cat.value ? "text-indigo-600" : "text-gray-400"
                                    }`}
                                size={20}
                            />
                            <p
                                className={`text-[10px] md:text-xs font-semibold text-center leading-tight ${form.type === cat.value ? "text-indigo-600" : "text-gray-700"
                                    }`}
                            >
                                {cat.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelect;
