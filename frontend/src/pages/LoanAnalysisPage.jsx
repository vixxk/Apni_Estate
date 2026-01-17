import React, { useState, useRef, useEffect } from "react";
import { Backendurl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, CheckCircle, AlertTriangle, XCircle, Calculator, ArrowLeft } from "lucide-react";

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
        setResult(response.data.data);
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
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-6 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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

        <div className="relative lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Input Form */}
          <div className={`
              bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden
              transition-all duration-500 ease-in-out w-full
              ${result ? "absolute top-0 opacity-0 -translate-x-full lg:opacity-100 lg:static lg:transform-none" : "relative opacity-100 translate-x-0"}
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
          <div
            ref={resultRef}
            className={`
              flex flex-col h-full w-full
              transition-all duration-500 ease-in-out
              ${result ? "relative opacity-100 translate-x-0" : "absolute top-0 opacity-0 translate-x-full lg:static lg:opacity-100 lg:transform-none"}
          `}>
            {/* Back Button for Mobile */}
            {result && (
              <button
                onClick={() => {
                  setResult(null);
                }}
                className="lg:hidden mb-4 flex items-center text-slate-600 font-bold hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
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
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="p-3 lg:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] lg:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Credit Score</p>
                      <p className="text-xl lg:text-2xl font-bold text-slate-800">{result.details.creditScore || "N/A"}</p>
                    </div>
                    <div className="p-3 lg:p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] lg:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Rate</p>
                      <p className="text-xl lg:text-2xl font-bold text-indigo-600">{result.details.assignedRate ? `${result.details.assignedRate}%` : "N/A"}</p>
                    </div>
                  </div>

                  {result.status !== "REJECTED" && (
                    <>
                      <div className="space-y-3 lg:space-y-4 pt-2">
                        <div className="flex justify-between items-center py-2 lg:py-3 border-b border-slate-100 text-sm lg:text-base">
                          <span className="text-slate-600 font-medium">Max Tenure</span>
                          <span className="text-slate-900 font-bold">{result.details.maxTenure} Years</span>
                        </div>
                        <div className="flex justify-between items-center py-2 lg:py-3 border-b border-slate-100 text-sm lg:text-base">
                          <span className="text-slate-600 font-medium">Requested Loan</span>
                          <span className="text-slate-900 font-bold">₹{result.details.requestedLoan?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 lg:py-3 border-b border-slate-100 text-sm lg:text-base">
                          <span className="text-slate-600 font-medium">Calculated EMI</span>
                          <span className="text-slate-900 font-bold">₹{result.details.requestedEmi?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 lg:py-3 border-b border-slate-100 text-sm lg:text-base">
                          <span className="text-slate-600 font-medium">Net Surplus (Capacity)</span>
                          <span className="text-emerald-600 font-bold">₹{result.details.netSurplus?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Final Eligible Amount Highlight */}
                      <div className="bg-indigo-50 rounded-2xl p-5 lg:p-6 border border-indigo-100 text-center mt-4 lg:mt-6">
                        <p className="text-xs lg:text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1 lg:mb-2">Max Eligible Loan Amount</p>
                        <p className="text-2xl lg:text-3xl sm:text-4xl font-black text-indigo-900">
                          ₹{result.details.maxEligibleLoan?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </>
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
