import React, { useState, useEffect, useRef } from "react";
import { Backendurl } from "../App";
import { motion } from "framer-motion";
import { Hammer, Calculator, CheckCircle, ArrowLeft, Building2 } from "lucide-react";

const ConstructionEstimator = () => {
    const [formData, setFormData] = useState({
        location: "",
        tier: "Tier 2",
        plotSize: 1000,
        floors: 1,
        quality: "Standard",
        inc_labor: true,
        inc_plumbing: true,
        inc_electrical: true,
        inc_waterproof: false,
        inc_architect: false,
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const resultRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const calculateEstimate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${Backendurl}/api/estimator/calculate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to calculate");

            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (result && resultRef.current) {
            setTimeout(() => {
                resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [result]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-[calc(100vh-5rem)]">
            <div className="max-w-7xl mx-auto py-6 lg:py-10">
                <div className="text-center mb-6 lg:mb-10">
                    <div className="inline-flex items-center justify-center p-2 lg:p-3 bg-blue-600 rounded-2xl shadow-lg mb-3 lg:mb-4">
                        <Hammer className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-blue-700 mb-1 lg:mb-2 whitespace-nowrap">
                        Construction Budget Planner
                    </h1>
                    <p className="text-base lg:text-lg text-slate-600 hidden lg:block max-w-2xl mx-auto">
                        Get a professional cost estimate for your dream project using our advanced AI-powered tool.
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Input Form - Hidden on mobile if result is shown */}
                    <div className={`
                        bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full
                        ${result ? "hidden lg:block" : "block"}
                    `}>
                        <div className="p-5 lg:p-8">
                            <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-5 lg:mb-6 flex items-center gap-2">
                                <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs lg:text-sm font-bold">1</span>
                                Project Details
                            </h2>

                            <form onSubmit={calculateEstimate} className="space-y-4 lg:space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Location / City</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. New Delhi"
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">City Tier</label>
                                        <select
                                            name="tier"
                                            value={formData.tier}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="Tier 1">Tier 1 (Metro)</option>
                                            <option value="Tier 2">Tier 2 (City)</option>
                                            <option value="Tier 3">Tier 3 (Town)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Plot Size (sq.ft)</label>
                                        <input
                                            type="number"
                                            name="plotSize"
                                            value={formData.plotSize}
                                            onChange={handleChange}
                                            placeholder="1000"
                                            min="100"
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Number of Floors</label>
                                        <select
                                            name="floors"
                                            value={formData.floors}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <option key={n} value={n}>{n} (G + {n - 1})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Construction Quality</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Basic', 'Standard', 'Premium'].map((q) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, quality: q }))}
                                                className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${formData.quality === q
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Additional Services</label>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                        {[
                                            { key: 'inc_labor', label: 'Civil Labor' },
                                            { key: 'inc_plumbing', label: 'Plumbing' },
                                            { key: 'inc_electrical', label: 'Electrical' },
                                            { key: 'inc_waterproof', label: 'Waterproofing' },
                                            { key: 'inc_architect', label: 'Architect / Design' },
                                        ].map(({ key, label }) => (
                                            <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name={key}
                                                        checked={formData[key]}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                                    />
                                                </div>
                                                <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2 lg:pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Calculating..." : "Calculate Estimate"}
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div ref={resultRef} className={`flex flex-col h-full w-full ${!result ? "hidden lg:flex" : "flex"}`}>
                        {/* Back Button for Mobile */}
                        {result && (
                            <button
                                onClick={() => {
                                    setResult(null);
                                }}
                                className="lg:hidden mb-4 flex items-center text-slate-600 font-bold hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Details
                            </button>
                        )}

                        {result ? (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 lg:p-8 text-white text-center">
                                    <p className="opacity-90 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1">Total Estimated Budget</p>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">₹ {result.final_budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h2>
                                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                                        <p className="text-sm font-medium">₹ {result.cost_sqft.toLocaleString('en-IN', { maximumFractionDigits: 0 })} per sq.ft</p>
                                    </div>
                                </div>

                                <div className="p-5 lg:p-8 space-y-6">
                                    {/* Material Breakdown */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            Material Breakdown
                                        </h4>
                                        <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-200 space-y-3">
                                            {Object.entries(result.materials).map(([key, val]) => (
                                                <div key={key} className="flex justify-between items-start text-sm">
                                                    <div className="flex-1 pr-4">
                                                        <span className="font-medium text-slate-700 block">{key}</span>
                                                        <span className="text-xs text-slate-500">{val.q}</span>
                                                    </div>
                                                    <span className="font-bold text-slate-900 whitespace-nowrap">₹ {val.c.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200 border-dashed">
                                                <span className="font-bold text-slate-800">Total Materials</span>
                                                <span className="font-bold text-blue-600">₹ {result.total_material.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-4">Services & Labor</h4>
                                        <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-200 space-y-3">
                                            {Object.keys(result.services).length > 0 ? (
                                                Object.entries(result.services).map(([key, val]) => (
                                                    <div key={key} className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-700 font-medium">{key}</span>
                                                        <span className="font-bold text-slate-900">₹ {val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 italic text-center py-2">No additional services selected</p>
                                            )}
                                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200 border-dashed">
                                                <span className="font-bold text-slate-800">Total Services</span>
                                                <span className="font-bold text-blue-600">₹ {result.total_services.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-blue-50/50 rounded-2xl p-4 space-y-2 border border-blue-100">
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium">₹ {(result.total_material + result.total_services).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>GST (18%)</span>
                                            <span className="font-medium">₹ {result.gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <span>Contingency</span>
                                            <span className="font-medium">₹ {result.contingency.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Empty State
                            <div className="h-full bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[300px] lg:min-h-[400px]">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <Calculator className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">Ready to Estimate</h3>
                                <p className="text-sm lg:text-base text-slate-500 max-w-xs mx-auto">
                                    Fill in your project details on the left and click "Calculate Estimate" to generate a comprehensive cost breakdown.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConstructionEstimator;
