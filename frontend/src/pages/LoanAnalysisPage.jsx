import React, { useState, useCallback, useRef, useEffect } from "react";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const FIELD_LABELS = {
  "financialProfile.monthlyIncome": "Monthly Income",
  "financialProfile.otherObligations": "Other Monthly Obligations",
  "financialProfile.age": "Age",
  "financialProfile.creditScore": "Credit Score",
  "financialProfile.downPaymentAvailable": "Down Payment Available",

  "loanPreferences.loanAmountRequested": "Loan Amount Requested",
  "loanPreferences.desiredTenureYears": "Desired Loan Tenure",
  "loanPreferences.baseInterestRate": "Interest Rate",
  "loanPreferences.ltvRatio": "Loan to Value (LTV) Ratio",

  "propertyDetails.plotPrice": "Plot Price",
  "propertyDetails.plotSizeSqft": "Plot Size",
  "propertyDetails.floors": "Number of Floors",
  "propertyDetails.baseCostPerSqft": "Construction Cost per Sq Ft",
};

const formatValidationError = (err) => {
  const path = err.path?.join(".");
  const label = FIELD_LABELS[path] || path?.split(".").pop();

  return `${label} ${err.message
    .replace(/".*?"/g, "")
    .replace("is required", "is required")}`;
};

const initialFinancialProfile = {
  monthlyIncome: "",
  otherObligations: "",
  age: "",
  creditScore: "",
  employmentStabilityScore: 0.7,
  downPaymentAvailable: "",
};

const initialLoanPreferences = {
  desiredTenureYears: "",
  loanAmountRequested: "",
  baseInterestRate: 8.5,
  ltvRatio: 0.8,
};

const initialPropertyDetails = {
  includePlot: true,
  plotPrice: "",
  plotSizeSqft: "",
  floors: 2,
  baseCostPerSqft: "",
  luxuryLevel: 0.5,
  locationScore: 0.5,
};

const numberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "number",
  placeholder,
  required,
  hint,
  step,
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
    />
    {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const SliderField = ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  color = "indigo",
}) => {
  const safeValue = typeof value === "number" ? value : Number(value) || min;
  const percentage = ((safeValue - min) / (max - min)) * 100;
  const displayValue =
    step < 1
      ? safeValue.toFixed(2).replace(/\.?0+$/, "")
      : safeValue.toFixed(0);

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={safeValue}
          onChange={onChange}
          className={`w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-${color}-600`}
          style={{
            background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`,
          }}
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-slate-500">{min}</span>
        <span className="text-sm font-semibold text-indigo-700">
          {displayValue}
        </span>
        <span className="text-xs text-slate-500">{max}</span>
      </div>
    </div>
  );
};

const StepPill = ({ index, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
        active
          ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg scale-110"
          : done
          ? "bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-md"
          : "bg-slate-200 text-slate-500"
      }`}
    >
      {done ? "✓" : index}
    </div>
    <span
      className={`hidden sm:inline text-sm font-medium transition-colors ${
        active ? "text-slate-900" : "text-slate-500"
      }`}
    >
      {label}
    </span>
  </div>
);

const Step1 = ({ financialProfile, onChange }) => (
  <div className="space-y-6">
    <div className="text-center pb-4 border-b border-slate-100">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 mb-3">
        <svg
          className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Financial Profile</h2>
      <p className="hidden sm:block text-sm text-slate-600 mt-1">
        Tell us about your income and financial standing
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
      <InputField
        label="Monthly Income"
        name="monthlyIncome"
        value={financialProfile.monthlyIncome}
        onChange={onChange}
        placeholder="₹ 50,000"
        required
        hint="Your gross monthly income"
      />
      <InputField
        label="Other Monthly Obligations"
        name="otherObligations"
        value={financialProfile.otherObligations}
        onChange={onChange}
        placeholder="₹ 10,000"
        hint="Existing EMIs, rent, etc."
      />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
      <InputField
        label="Age"
        name="age"
        value={financialProfile.age}
        onChange={onChange}
        placeholder="35"
        required
        hint="Your current age in years"
      />
      <InputField
        label="Credit Score"
        name="creditScore"
        value={financialProfile.creditScore}
        onChange={onChange}
        placeholder="750"
        required
        hint="CIBIL or equivalent score"
      />
    </div>

    <SliderField
      label="Employment Stability Score"
      name="employmentStabilityScore"
      value={financialProfile.employmentStabilityScore}
      onChange={onChange}
      min={0}
      max={1}
      step={0.05}
    />

    <InputField
      label="Down Payment Available"
      name="downPaymentAvailable"
      value={financialProfile.downPaymentAvailable}
      onChange={onChange}
      placeholder="₹ 5,00,000"
      hint="Amount you can pay upfront"
    />
  </div>
);

const Step2 = ({ loanPreferences, onChange }) => (
  <div className="space-y-6">
    <div className="text-center pb-4 border-b border-slate-100">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-3">
        <svg
          className="w-7 h-7 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Loan Preferences</h2>
      <p className="hidden sm:block text-sm text-slate-600 mt-1">
        Configure your desired loan terms
      </p>
    </div>

    <InputField
      label="Loan Amount Requested"
      name="loanAmountRequested"
      value={loanPreferences.loanAmountRequested}
      onChange={onChange}
      placeholder="₹ 50,00,000"
      hint="Optional: Specific amount you want to borrow"
    />

    <InputField
      label="Desired Tenure"
      name="desiredTenureYears"
      value={loanPreferences.desiredTenureYears}
      onChange={onChange}
      placeholder="20"
      hint="Leave blank for automatic calculation"
    />

    <InputField
      label="Base Interest Rate (% p.a.)"
      name="baseInterestRate"
      value={loanPreferences.baseInterestRate}
      onChange={onChange}
      step="0.1"
      required
      hint="Annual interest rate percentage"
    />

    <SliderField
      label="Loan-to-Value (LTV) Ratio"
      name="ltvRatio"
      value={loanPreferences.ltvRatio}
      onChange={onChange}
      min={0.5}
      max={0.9}
      step={0.05}
      color="emerald"
    />
  </div>
);

const Step3 = ({ propertyDetails, onChange, loading, onAnalyze }) => (
  <div className="space-y-6">
    <div className="text-center pb-4 border-b border-slate-100">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 mb-3">
        <svg
          className="w-7 h-7 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Property Details</h2>
      <p className="hidden sm:block text-sm text-slate-600 mt-1">
        Describe your construction project
      </p>
    </div>

    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-100">
      <input
        type="checkbox"
        id="includePlot"
        name="includePlot"
        checked={propertyDetails.includePlot}
        onChange={onChange}
        className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
      />
      <label
        htmlFor="includePlot"
        className="text-sm font-medium text-slate-800 cursor-pointer flex-1"
      >
        Include plot cost in loan calculation
      </label>
    </div>

    {propertyDetails.includePlot && (
      <InputField
        label="Plot Price"
        name="plotPrice"
        value={propertyDetails.plotPrice}
        onChange={onChange}
        placeholder="₹ 30,00,000"
        hint="Total cost of the land"
      />
    )}

    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
      <InputField
        label="Plot Size (sq ft)"
        name="plotSizeSqft"
        value={propertyDetails.plotSizeSqft}
        onChange={onChange}
        placeholder="2000"
        required
        hint="Area of the plot"
      />
      <InputField
        label="Number of Floors"
        name="floors"
        value={propertyDetails.floors}
        onChange={onChange}
        placeholder="2"
        required
        hint="Total floors to construct"
      />
    </div>

    <InputField
      label="Base Construction Cost per sq ft"
      name="baseCostPerSqft"
      value={propertyDetails.baseCostPerSqft}
      onChange={onChange}
      placeholder="₹ 1,500"
      required
      hint="Basic construction rate"
    />

    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
      <SliderField
        label="Luxury Level"
        name="luxuryLevel"
        value={propertyDetails.luxuryLevel}
        onChange={onChange}
        min={0}
        max={1}
        step={0.05}
        color="pink"
      />
      <SliderField
        label="Location Premium"
        name="locationScore"
        value={propertyDetails.locationScore}
        onChange={onChange}
        min={0}
        max={1}
        step={0.05}
        color="violet"
      />
    </div>
  </div>
);

const Step4 = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl mb-6 animate-pulse">
      <svg
        className="w-12 h-12 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Analyze</h3>
    <p className="text-sm text-slate-600 max-w-md text-center mb-6">
      All your information has been collected. Click the button below to
      generate a comprehensive loan analysis report.
    </p>
    <div className="flex flex-wrap gap-3 justify-center">
      <div className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
        ✓ Financial Profile
      </div>
      <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
        ✓ Loan Preferences
      </div>
      <div className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
        ✓ Property Details
      </div>
    </div>
  </div>
);

// Results Panel Component - Mobile Optimized
const ResultsPanel = ({ result }) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="text-center pb-3 sm:pb-4 border-b border-slate-100">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 mb-2 sm:mb-3">
        <svg
          className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
        Analysis Complete!
      </h2>
      <p className="hidden sm:block text-sm text-slate-600 mt-1">
        Your comprehensive loan analysis report
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Core Results */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl shadow-md border border-indigo-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Core Results
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-indigo-200">
            <div className="text-[10px] sm:text-xs font-semibold text-indigo-700 mb-0.5 sm:mb-1">
              Eligible Loan Amount
            </div>
            <div className="text-xl sm:text-3xl font-bold text-indigo-900">
              ₹{result.coreResults.eligibleLoan.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border border-emerald-100 text-center">
              <div className="text-lg sm:text-2xl font-bold text-emerald-700">
                ₹{result.coreResults.emi.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-emerald-800 mt-0.5 sm:mt-1">
                Monthly EMI
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border border-purple-100 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-700">
                {result.coreResults.tenureYears} yrs
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-purple-800 mt-0.5 sm:mt-1">
                Tenure
              </div>
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t border-indigo-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600">Interest Rate</span>
              <span className="font-semibold text-slate-900">
                {result.coreResults.interestRateAdjusted.toFixed(2)}% p.a.
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600">Total Interest</span>
              <span className="font-semibold text-red-600">
                ₹{result.coreResults.totalInterest.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600">Total Repayment</span>
              <span className="font-semibold text-slate-900">
                ₹{result.coreResults.totalRepayment.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg sm:rounded-xl shadow-md border border-orange-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Cost Breakdown
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-amber-200">
            <div className="text-[10px] sm:text-xs font-semibold text-amber-800 mb-0.5 sm:mb-1">
              Total Cost
            </div>
            <div className="text-xl sm:text-3xl font-bold text-amber-900">
              ₹{result.costBreakdown.totalProjectCost.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-xs sm:text-sm text-slate-600">Plot</span>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                ₹{result.costBreakdown.plotCost.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-xs sm:text-sm text-slate-600">
                Construction
              </span>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                ₹{result.costBreakdown.constructionCost.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-emerald-200 mt-3 sm:mt-4">
            <div className="text-[10px] sm:text-xs font-semibold text-emerald-800 mb-0.5 sm:mb-1">
              Down Payment
            </div>
            <div className="text-lg sm:text-2xl font-bold text-emerald-900">
              ₹
              {result.costBreakdown.downPaymentRequired.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Constraints & Advisory */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl shadow-md border border-purple-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Analysis
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-blue-100">
              <div className="text-[10px] sm:text-xs text-blue-700 mb-0.5 sm:mb-1">
                Income Limit
              </div>
              <div className="text-xs sm:text-sm font-bold text-blue-900">
                ₹{result.constraints.incomeBasedLimit.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-violet-100">
              <div className="text-[10px] sm:text-xs text-violet-700 mb-0.5 sm:mb-1">
                LTV Limit
              </div>
              <div className="text-xs sm:text-sm font-bold text-violet-900">
                ₹{result.constraints.ltvBasedLimit.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-lg bg-white border border-indigo-100">
            <div className="text-[10px] sm:text-xs text-indigo-700 mb-0.5 sm:mb-1">
              Limiting Factor
            </div>
            <div className="text-xs sm:text-sm font-bold text-indigo-900 uppercase">
              {result.constraints.limitingFactor}
            </div>
          </div>

          {result.advisory.insights.length > 0 && (
            <div className="pt-2 sm:pt-3 border-t border-purple-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs font-bold text-blue-900">
                  Insights
                </span>
              </div>
              <ul className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-slate-700">
                {result.advisory.insights.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span className="flex-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.advisory.warnings.length > 0 && (
            <div className="pt-2 sm:pt-3 border-t border-purple-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs font-bold text-amber-900">
                  Warnings
                </span>
              </div>
              <ul className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-slate-700">
                {result.advisory.warnings.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span className="flex-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.advisory.suggestions.length > 0 && (
            <div className="pt-2 sm:pt-3 border-t border-purple-200">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-900">
                  Suggestions
                </span>
              </div>
              <ul className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-slate-700">
                {result.advisory.suggestions.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span className="flex-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Animated Panel Wrapper
const AnimatedPanelWrapper = ({ children, currentStep, direction }) => {
  const panels = React.Children.toArray(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${(currentStep - 1) * 100}%)`,
        }}
      >
        {panels.map((panel, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ minWidth: "100%" }}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoanAnalysisPage = () => {
  const [financialProfile, setFinancialProfile] = useState(
    initialFinancialProfile
  );
  const [loanPreferences, setLoanPreferences] = useState(
    initialLoanPreferences
  );
  const [propertyDetails, setPropertyDetails] = useState(
    initialPropertyDetails
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");

  const totalSteps = result ? 5 : 4;

  const handleFinancialChange = useCallback((e) => {
    const { name, value } = e.target;
    setFinancialProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLoanPrefChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoanPreferences((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePropertyChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const buildPayload = () => {
    return {
      financialProfile: {
        monthlyIncome: numberOrNull(financialProfile.monthlyIncome),
        otherObligations: numberOrNull(financialProfile.otherObligations),
        age: numberOrNull(financialProfile.age),
        creditScore: numberOrNull(financialProfile.creditScore),
        employmentStabilityScore: Number(
          financialProfile.employmentStabilityScore
        ),
        downPaymentAvailable: numberOrNull(
          financialProfile.downPaymentAvailable
        ),
      },
      loanPreferences: {
        desiredTenureYears:
          loanPreferences.desiredTenureYears === ""
            ? undefined
            : numberOrNull(loanPreferences.desiredTenureYears),
        loanAmountRequested: numberOrNull(loanPreferences.loanAmountRequested),
        baseInterestRate: Number(loanPreferences.baseInterestRate),
        ltvRatio: Number(loanPreferences.ltvRatio),
      },
      propertyDetails: {
        includePlot: Boolean(propertyDetails.includePlot),
        plotPrice: propertyDetails.includePlot
          ? numberOrNull(propertyDetails.plotPrice)
          : 0,
        plotSizeSqft: numberOrNull(propertyDetails.plotSizeSqft),
        floors: numberOrNull(propertyDetails.floors),
        baseCostPerSqft: numberOrNull(propertyDetails.baseCostPerSqft),
        luxuryLevel: Number(propertyDetails.luxuryLevel),
        locationScore: Number(propertyDetails.locationScore),
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    setValidationErrors([]);

    try {
      const payload = buildPayload();

      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_BASE}/api/loan/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        scrollToTop();
        setServerError(
          data?.error?.message || "Failed to analyze loan request."
        );
        return;
      }

      if (!data?.success) {
        scrollToTop();
        setServerError("Loan analysis failed.");
        return;
      }

      setResult(data.data);
      setDirection("forward");
      setTimeout(() => setCurrentStep(5), 100);
    } catch (err) {
      console.error(err);
      setServerError("Network error while contacting analysis service.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    scrollToTop();
    setFinancialProfile(initialFinancialProfile);
    setLoanPreferences(initialLoanPreferences);
    setPropertyDetails(initialPropertyDetails);
    setResult(null);
    setServerError(null);
    setValidationErrors([]);
    setDirection("backward");
    setCurrentStep(1);
  };

  const handleNext = () => {
    setDirection("forward");
    setCurrentStep((s) => Math.min(totalSteps, s + 1));
  };

  const handlePrevious = () => {
    setDirection("backward");
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const isLastStep = currentStep === totalSteps;
  const isAnalyzeStep = currentStep === 3;
  const isResultsStep = currentStep === 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-2 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3 leading-tight">
            Home Loan Analyzer
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <StepPill
              index={1}
              label="Financial"
              active={currentStep === 1}
              done={currentStep > 1}
            />
            <div className="flex-1 h-1 mx-2 sm:mx-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ${
                  currentStep > 1 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <StepPill
              index={2}
              label="Loan"
              active={currentStep === 2}
              done={currentStep > 2}
            />
            <div className="flex-1 h-1 mx-2 sm:mx-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-500 ${
                  currentStep > 2 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <StepPill
              index={3}
              label="Property"
              active={currentStep === 3}
              done={currentStep > 3}
            />
            <div className="flex-1 h-1 mx-2 sm:mx-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ${
                  currentStep > 3 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <StepPill
              index={4}
              label="Review"
              active={currentStep === 4}
              done={currentStep > 4}
            />
            {result && (
              <>
                <div className="flex-1 h-1 mx-2 sm:mx-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-pink-500 to-emerald-500 transition-all duration-500 ${
                      currentStep > 4 ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                <StepPill
                  index="✓"
                  label="Results"
                  active={currentStep === 5}
                  done={false}
                />
              </>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-600">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 sm:w-32 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {serverError && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800 font-medium">{serverError}</p>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mb-6 p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-amber-800 font-medium mb-2">
                  Please fix the following errors:
                </p>
                <ul className="space-y-2 text-sm text-amber-800">
                  {validationErrors.map((err, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span>{formatValidationError(err)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card with Animated Panels */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-8 mb-6">
            <AnimatedPanelWrapper
              currentStep={currentStep}
              direction={direction}
            >
              <Step1
                financialProfile={financialProfile}
                onChange={handleFinancialChange}
              />
              <Step2
                loanPreferences={loanPreferences}
                onChange={handleLoanPrefChange}
              />
              <Step3
                propertyDetails={propertyDetails}
                onChange={handlePropertyChange}
                loading={loading}
                onAnalyze={handleSubmit}
              />
              <Step4 />
              {result && <ResultsPanel result={result} />}
            </AnimatedPanelWrapper>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-slate-500 sm:text-slate-700 hover:bg-slate-100 sm:bg-white sm:border-2 sm:border-slate-300 font-medium text-sm sm:text-base whitespace-nowrap transition-all"
              >
                Reset
              </button>

              {isResultsStep ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Start New Analysis
                </button>
              ) : isAnalyzeStep ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      Analyze Loan
                    </>
                  )}
                </button>
              ) : !isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  Next Step
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanAnalysisPage;
