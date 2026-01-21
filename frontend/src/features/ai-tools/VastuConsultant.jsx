import React, { useState, useEffect, useRef } from "react";
import { Backendurl } from "../../App";
import { Compass, ArrowLeft, CheckCircle, AlertTriangle, XCircle, Home, Map } from "lucide-react";

const VastuConsultant = () => {
    const [formData, setFormData] = useState({
        facing: "North",
        road: "North",
        shape: "Regular",
        bedrooms: 2,
        toilets: 2,
        puja: true,
        stairs: true,
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

    const calculateVastu = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${Backendurl}/api/vastu/calculate`, {
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
                        <Compass className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-blue-700 mb-1 lg:mb-2 whitespace-nowrap">
                        AI Vastu Consultant
                    </h1>
                    <p className="text-base lg:text-lg text-slate-600 hidden lg:block max-w-2xl mx-auto">
                        Get personalized Vastu Shastra recommendations for your dream home using our AI-powered analysis.
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Input Form */}
                    <div className={`
                        bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full
                        ${result ? "hidden lg:block" : "block"}
                    `}>
                        <div className="p-5 lg:p-8">
                            <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-5 lg:mb-6 flex items-center gap-2">
                                <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs lg:text-sm font-bold">1</span>
                                Plot & Requirement Details
                            </h2>

                            <form onSubmit={calculateVastu} className="space-y-4 lg:space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Plot Facing</label>
                                        <select
                                            name="facing"
                                            value={formData.facing}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="North">North</option>
                                            <option value="East">East</option>
                                            <option value="South">South</option>
                                            <option value="West">West</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Road Position</label>
                                        <select
                                            name="road"
                                            value={formData.road}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="North">North</option>
                                            <option value="East">East</option>
                                            <option value="South">South</option>
                                            <option value="West">West</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Plot Shape</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { val: 'Regular', title: 'Square/Rectangular', sub: '(Best)' },
                                            { val: 'Irregular', title: 'Irregular', sub: '(Cut Corners)' },
                                            { val: 'Shermukhi', title: 'Shermukhi', sub: '(Front Wide)' },
                                            { val: 'Gaumukhi', title: 'Gaumukhi', sub: '(Back Wide)' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, shape: opt.val }))}
                                                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${formData.shape === opt.val
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{opt.title}</span>
                                                <span className={`text-[10px] sm:text-xs font-normal ${formData.shape === opt.val ? 'text-blue-100' : 'text-slate-400'}`}>{opt.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.bedrooms}
                                            onChange={handleChange}
                                            min="1"
                                            max="10"
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Toilets</label>
                                        <input
                                            type="number"
                                            name="toilets"
                                            value={formData.toilets}
                                            onChange={handleChange}
                                            min="1"
                                            max="10"
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="puja"
                                                checked={formData.puja}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                            />
                                        </div>
                                        <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">Include Puja Room</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="stairs"
                                                checked={formData.stairs}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                                            />
                                        </div>
                                        <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">Include Staircase</span>
                                    </label>
                                </div>

                                <div className="pt-2 lg:pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Analyzing..." : "Generate Vastu Report"}
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
                                <div className={`p-5 lg:p-8 text-white ${result.score >= 80 ? "bg-gradient-to-br from-emerald-500 to-green-600" :
                                    result.score >= 50 ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                                        "bg-gradient-to-br from-red-500 to-rose-600"
                                    }`}>
                                    <p className="opacity-90 text-xs sm:text-sm font-medium uppercase tracking-wide mb-1">Vastu Compliance Score</p>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{result.score}/100</h2>
                                    <div className="mt-3 flex flex-col gap-1">
                                        {result.reasons.map((reason, idx) => (
                                            <p key={idx} className="text-sm font-medium opacity-90">{reason}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 lg:p-8 space-y-6">
                                    {/* Layout Plan */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <Map className="w-5 h-5 text-blue-600" />
                                            Suggested Zonal Layout
                                        </h4>
                                        <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-200 space-y-3">
                                            {Object.entries(result.layout).map(([room, zone]) => (
                                                <div key={room} className="flex justify-between items-start text-sm border-b border-slate-200 last:border-0 pb-2 last:pb-0 border-dashed">
                                                    <span className="font-semibold text-slate-700 w-1/3">{room}</span>
                                                    <span className="text-slate-600 flex-1 text-right">{zone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Remedies */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            Remedial Measures
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.remedies.map((remedy, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                    {remedy}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Empty State
                            <div className="h-full bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[300px] lg:min-h-[400px]">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <Compass className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">Vastu Analysis</h3>
                                <p className="text-sm lg:text-base text-slate-500 max-w-xs mx-auto">
                                    Fill in your plot details on the left and click "Generate Vastu Report" to see compliance scores and layout suggestions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VastuConsultant;
