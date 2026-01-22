import React, { useState, useEffect, useRef } from "react";
import { Backendurl } from "../../App";
import { Compass, ArrowLeft, CheckCircle, AlertTriangle, XCircle, Home, Map, DoorOpen, BedDouble, Utensils, Sparkles, Bath, TrendingUp, Users, LayoutDashboard, Sofa } from "lucide-react";

const VastuConsultant = () => {
    const [formData, setFormData] = useState({
        facing: "North",
        road: "North",
        shape: "Regular",
        bedrooms: 2,
        toilets: 2,
        puja: true,
        stairs: true,
        // New Inputs
        plotArea: "",
        soilType: "unknown",
        slopeDirection: "unknown",
        surroundings: [],
        // Layout Inputs
        masterBedroom: "South-West",
        kitchen: "South-East",
        toilet: "North-West",
        staircaseLocation: "South",
        pujaLocation: "North-East",
        waterTank: "South-West"
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const resultRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'surroundings') {
            // Handle surroundings checkbox array
            const updatedSurroundings = checked
                ? [...formData.surroundings, value]
                : formData.surroundings.filter(item => item !== value);

            setFormData(prev => ({
                ...prev,
                surroundings: updatedSurroundings
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
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

                                {/* Plot Details: Area, Slope, Soil */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Plot Area (sq.ft) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            name="plotArea"
                                            value={formData.plotArea}
                                            onChange={handleChange}
                                            placeholder="e.g. 1200"
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Slope Direction</label>
                                        <select
                                            name="slopeDirection"
                                            value={formData.slopeDirection}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="unknown">Don't Know</option>
                                            <option value="North">North (Down)</option>
                                            <option value="East">East (Down)</option>
                                            <option value="South">South (Down)</option>
                                            <option value="West">West (Down)</option>
                                            <option value="North-East">North-East (Down)</option>
                                            <option value="South-West">South-West (Down)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Soil Type</label>
                                        <select
                                            name="soilType"
                                            value={formData.soilType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        >
                                            <option value="unknown">Don't Know</option>
                                            <option value="White">White/Clay</option>
                                            <option value="Red">Red Soil</option>
                                            <option value="Yellow">Yellow Soil</option>
                                            <option value="Black">Black/Cotton</option>
                                            <option value="Rocky">Rocky</option>
                                            <option value="Mixed">Mixed/Sandy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Surroundings Checklist */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Surroundings (Select if applicable)</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            'Temple nearby',
                                            'Water Body in North/East',
                                            'Water Body in South/West',
                                            'High Tension Wire/Transformer',
                                            'Tall Building in North/East',
                                            'Tall Building in South/West',
                                            'Graveyard/Hospital nearby',
                                            'T-Junction (Veethi Shoola)'
                                        ].map((item) => (
                                            <label key={item} className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="surroundings"
                                                    value={item}
                                                    checked={formData.surroundings.includes(item)}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="text-sm text-slate-600">{item}</span>
                                            </label>
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

                                {/* Layout / Room Locations DO NOT REMOVE */}
                                <div>
                                    <h3 className="text-md font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <LayoutDashboard className="w-4 h-4 text-blue-500" />
                                        Room Locations (For Advanced Analysis)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Master Bedroom Location</label>
                                            <select
                                                name="masterBedroom"
                                                value={formData.masterBedroom}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            >
                                                {["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West", "Center"].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Kitchen Location</label>
                                            <select
                                                name="kitchen"
                                                value={formData.kitchen}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            >
                                                {["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West", "Center"].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Toilet Location</label>
                                            <select
                                                name="toilet"
                                                value={formData.toilet}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            >
                                                {["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West", "Center"].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Overhead Water Tank</label>
                                            <select
                                                name="waterTank"
                                                value={formData.waterTank}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            >
                                                {["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West", "Center"].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.stairs && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Staircase Location</label>
                                                <select
                                                    name="staircaseLocation"
                                                    value={formData.staircaseLocation}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                                >
                                                    {["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West", "Center"].map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
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
                                {/* Result Header - Blue Theme */}
                                <div className="p-6 lg:p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                                    <div className="relative z-10 text-center">
                                        <p className="inline-block px-2 py-1 lg:px-3 rounded-full bg-white/10 text-blue-50 text-[10px] lg:text-xs font-semibold tracking-wider uppercase mb-2 lg:mb-3 backdrop-blur-sm border border-white/20">
                                            Vastu Compliance Score
                                        </p>
                                        <div className="flex items-center justify-center mb-2">
                                            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                                {result.score}
                                            </span>
                                            <span className="text-xl sm:text-2xl lg:text-3xl text-blue-200 font-medium ml-1">/100</span>
                                        </div>

                                        <div className="space-y-3 lg:space-y-4">
                                            <div className="w-full max-w-xs mx-auto bg-blue-900/30 rounded-full h-2 lg:h-3 backdrop-blur-sm overflow-hidden border border-white/10">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${result.score >= 80 ? "bg-emerald-400" :
                                                        result.score >= 50 ? "bg-amber-400" :
                                                            "bg-rose-400"
                                                        }`}
                                                    style={{ width: `${result.score}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-blue-100 text-xs sm:text-sm lg:text-base font-medium px-4">
                                                {result.score >= 80 ? "Excellent! Your plot has great potential." :
                                                    result.score >= 50 ? "Good. Some corrections are recommended." :
                                                        "Critical corrections needed for better Vastu."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 lg:p-8 space-y-8 bg-slate-50/50">
                                    {/* Detailed Analysis Cards */}
                                    <div className="space-y-5">
                                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            Detailed Analysis
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {result.detailedAnalysis && result.detailedAnalysis.map((item, idx) => (
                                                <div key={idx} className={`
                                                    rounded-xl lg:rounded-2xl p-4 lg:p-5 border shadow-sm transition-all hover:shadow-md bg-white
                                                    ${item.status === 'positive' ? 'border-emerald-100 border-l-[4px] lg:border-l-[6px] border-l-emerald-500' :
                                                        item.status === 'negative' ? 'border-red-100 border-l-[4px] lg:border-l-[6px] border-l-red-500' :
                                                            'border-slate-100 border-l-[4px] lg:border-l-[6px] border-l-slate-400'}
                                                `}>
                                                    <div className="flex justify-between items-start mb-2 lg:mb-3">
                                                        <div className="flex-1 pr-3 lg:pr-4">
                                                            <span className={`
                                                                text-[9px] lg:text-[10px] font-bold uppercase tracking-wider py-0.5 px-1.5 lg:py-1 lg:px-2 rounded-md mb-1 lg:mb-2 inline-block
                                                                ${item.status === 'positive' ? 'bg-emerald-50 text-emerald-700' :
                                                                    item.status === 'negative' ? 'bg-red-50 text-red-700' :
                                                                        'bg-slate-100 text-slate-600'}
                                                            `}>
                                                                {item.category}
                                                            </span>
                                                            <h5 className="font-bold text-slate-800 text-base lg:text-lg leading-tight">{item.observation}</h5>
                                                        </div>
                                                        <div className="mt-0.5 lg:mt-1">
                                                            {item.status === 'positive' ? <div className="p-1.5 lg:p-2 bg-emerald-50 rounded-full"><CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" /></div> :
                                                                item.status === 'negative' ? <div className="p-1.5 lg:p-2 bg-red-50 rounded-full"><XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" /></div> :
                                                                    <div className="p-1.5 lg:p-2 bg-slate-100 rounded-full"><AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-slate-500" /></div>}
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-600 text-xs lg:text-sm leading-relaxed mb-3 lg:mb-4">{item.description}</p>

                                                    {/* Impact & Remedy for non-positive items */}
                                                    {item.status !== 'positive' && (
                                                        <div className="space-y-3 pt-4 border-t border-dashed border-slate-200">
                                                            {item.impact && (
                                                                <div className="flex gap-3 items-start group">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-0.5">Impact</span>
                                                                        <p className="text-sm text-slate-700 font-medium">{item.impact}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.remedy && (
                                                                <div className="flex gap-3 items-start bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                                                                    <div className="bg-white p-1 rounded-full shadow-sm">
                                                                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block mb-0.5">Recommended Remedy</span>
                                                                        <p className="text-sm text-slate-800 font-medium">{item.remedy}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Layout Plan */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200">
                                            <Map className="w-5 h-5 text-blue-600" />
                                            Suggested Zonal Layout
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {Object.entries(result.layout).map(([room, zone]) => {
                                                let Icon = LayoutDashboard;
                                                const lowerRoom = room.toLowerCase();
                                                if (lowerRoom.includes('bedroom')) Icon = BedDouble;
                                                if (lowerRoom.includes('kitchen')) Icon = Utensils;
                                                if (lowerRoom.includes('toilet') || lowerRoom.includes('bath')) Icon = Bath;
                                                if (lowerRoom.includes('puja')) Icon = Sparkles;
                                                if (lowerRoom.includes('stair')) Icon = TrendingUp;
                                                if (lowerRoom.includes('entrance') || lowerRoom.includes('main')) Icon = DoorOpen;
                                                if (lowerRoom.includes('guest')) Icon = Users;
                                                if (lowerRoom.includes('living') || lowerRoom.includes('hall')) Icon = Sofa;

                                                return (
                                                    <div key={room} className="flex items-start p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors mr-3 shrink-0">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-slate-800 text-sm mb-1">{room}</h5>
                                                            <p className="text-sm font-medium text-slate-500 leading-snug">
                                                                {zone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
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
                                    Fill in your plot details on the left and click "Generate Vastu Report" to see detailed remedial measures and layout suggestions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default VastuConsultant;
