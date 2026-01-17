import React, { useState, useRef, useEffect } from "react";
import { Backendurl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, CheckCircle, AlertTriangle, XCircle, Calculator, ArrowLeft, RefreshCw, Sliders } from "lucide-react";

const LoanAnalysisPage = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    existingEmis: "",
    creditScore: "",
    age: "",
    loanAmountRequested: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  // Simulator State
  const [simulator, setSimulator] = useState({
    tenure: 20,
    rate: 8.5,
  });

  // Calculate Metrics based on Simulator State
  const calculateMetrics = () => {
    if (!result) return { emi: 0, maxLoan: 0 };

    const principal = result.details.requestedLoan;
    const r = simulator.rate / 12 / 100;
    const n = simulator.tenure * 12;

    // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
    let emi = 0;
    if (principal > 0 && r > 0 && n > 0) {
      emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    // Max Loan Calculation based on Net Surplus (Capacity)
    // Assuming NetSurplus is the max EMI capacity the user can afford.
    // MaxLoan = (NetSurplus * ((1+r)^n - 1)) / (r * (1+r)^n)
    let maxLoan = 0;
    const netSurplus = result.details.netSurplus; // This comes from backend based on FOIR
    if (netSurplus > 0 && r > 0 && n > 0) {
      maxLoan = Math.round((netSurplus * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
    }

    return { emi, maxLoan };
  };

  const metrics = calculateMetrics();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${Backendurl}/api/loan/analyze`, {
        monthlyIncome: Number(formData.monthlyIncome),
        existingEmis: Number(formData.existingEmis),
        creditScore: Number(formData.creditScore),
        age: Number(formData.age),
        loanAmountRequested: Number(formData.loanAmountRequested),
      });

      if (response.data.success) {
        const data = response.data.data;
        setResult(data);
        // Initialize simulator with backend results
        if (data.details) {
          setSimulator({
            tenure: data.details.maxTenure || 20,
            rate: data.details.assignedRate || 9.0,
          });
        }
        toast.success("Analysis Complete!");
      } else {
        toast.error("Analysis failed. Please check your inputs.");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error.response?.data?.error || "Failed to analyze loan.");
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
      <div className="max-w-4xl mx-auto py-6 lg:py-10">
        <div className="text-center mb-6 lg:mb-10">
          <div className="inline-flex items-center justify-center p-2 lg:p-3 bg-indigo-600 rounded-2xl shadow-lg mb-3 lg:mb-4">
            <Calculator className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
            AI Home Loan Assistant
          </h1>
          <p className="text-base lg:text-lg text-slate-600 hidden lg:block">
            Get an instant AI-powered assessment of your loan eligibility.
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
                <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs lg:text-sm font-bold">1</span>
                Applicant Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly In-hand Income (₹)</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 50000"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Existing Monthly EMIs (₹)</label>
                  <input
                    type="number"
                    name="existingEmis"
                    value={formData.existingEmis}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credit Score</label>
                    <input
                      type="number"
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleChange}
                      required
                      placeholder="300-900"
                      min="300"
                      max="900"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 30"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount Required (₹)</label>
                  <input
                    type="number"
                    name="loanAmountRequested"
                    value={formData.loanAmountRequested}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 5000000"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  />
                </div>

                <div className="pt-2 lg:pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 lg:py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Running Analysis...
                      </>
                    ) : (
                      <>
                        Analyze Loan Eligibility
                      </>
                    )}
                  </button>
                </div>
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
                className="lg:hidden mb-4 flex items-center text-slate-600 font-bold hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </button>
            )}

            {result ? (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header based on Status */}
                <div className={`p-5 lg:p-8 text-white ${result.status === "APPROVED" ? "bg-gradient-to-br from-emerald-500 to-green-600" :
                  result.status === "REJECTED" ? "bg-gradient-to-br from-rose-500 to-red-600" :
                    "bg-gradient-to-br from-amber-500 to-orange-600"
                  }`}>
                  <div className="flex items-center gap-3 lg:gap-4 mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      {result.status === "APPROVED" && <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7" />}
                      {result.status === "REJECTED" && <XCircle className="w-6 h-6 lg:w-7 lg:h-7" />}
                      {result.status === "MODIFIED APPROVAL" && <AlertTriangle className="w-6 h-6 lg:w-7 lg:h-7" />}
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold leading-tight">{result.status.replace("_", " ")}</h3>
                      <p className="text-white/90 text-sm lg:text-base font-medium opacity-90">AI Assessment Report</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <p className="text-base lg:text-lg font-medium leading-relaxed">
                      "{result.reason}"
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 lg:p-8 space-y-5 lg:space-y-6">

                  {/* Smart Simulator */}
                  {result.status !== "REJECTED" && (
                    <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Sliders className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold text-slate-800">Smart Simulator</h4>
                      </div>

                      {/* Tenure Slider */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600 font-medium">Tenure</span>
                          <span className="text-indigo-600 font-bold">{simulator.tenure} Years</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max={30} // Could cap at 60 - Age
                          step="1"
                          value={simulator.tenure}
                          onChange={(e) => setSimulator(prev => ({ ...prev, tenure: Number(e.target.value) }))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>5 Yrs</span>
                          <span>30 Yrs</span>
                        </div>
                      </div>

                      {/* Interest Rate Slider */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600 font-medium">Interest Rate</span>
                          <span className="text-indigo-600 font-bold">{simulator.rate}%</span>
                        </div>
                        <input
                          type="range"
                          min="7"
                          max="15"
                          step="0.25"
                          value={simulator.rate}
                          onChange={(e) => setSimulator(prev => ({ ...prev, rate: Number(e.target.value) }))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>7%</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Metrics */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="p-3 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] lg:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated EMI</p>
                      <p className="text-lg lg:text-xl font-bold text-slate-800">
                        ₹{result.status === "REJECTED" ? "0" : metrics.emi.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-3 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] lg:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Max Capacity</p>
                      <p className="text-lg lg:text-xl font-bold text-indigo-600">
                        ₹{result.status === "REJECTED" ? "0" : metrics.maxLoan.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {result.status !== "REJECTED" && (
                    <div className="space-y-3 lg:space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center py-2 text-sm lg:text-base">
                        <span className="text-slate-500">Credit Score</span>
                        <span className="text-slate-700 font-bold">{result.details.creditScore}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 text-sm lg:text-base">
                        <span className="text-slate-500">Requested Loan</span>
                        <span className="text-slate-700 font-bold">₹{result.details.requestedLoan?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 text-sm lg:text-base">
                        <span className="text-slate-500">Original Max Tenure</span>
                        <span className="text-slate-700 font-semibold">{result.details.maxTenure} Years</span>
                      </div>
                      <div className="flex justify-between items-center py-2 text-sm lg:text-base">
                        <span className="text-slate-500">Net Surplus</span>
                        <span className="text-emerald-600 font-semibold">₹{result.details.netSurplus?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              // Empty State / Placeholder
              <div className="h-full bg-white rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[300px] lg:min-h-[400px]">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Calculator className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">Ready to Analyze</h3>
                <p className="text-sm lg:text-base text-slate-500 max-w-xs mx-auto">
                  Fill in your details on the left and click "Analyze Loan Eligibility" to see your personalized AI report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAnalysisPage;
