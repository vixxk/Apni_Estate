export function generateRuleBasedAdvisory(coreResults, financialProfile) {
    const insights = [];
    const warnings = [];
    const suggestions = [];
  
    const {
      emi,
      eligibleLoan,
      incomeBasedLimit,
      ltvBasedLimit,
      limitingFactor,
      tenureYears
    } = coreResults;
  
    const { monthlyIncome, otherObligations } = financialProfile;
  
    const freeCash = Math.max(monthlyIncome - otherObligations, 0);
    const emiRatio = freeCash > 0 ? emi / freeCash : 1;
  
    /* ---------- INSIGHTS ---------- */
    insights.push(
      `Loan eligibility capped by ${limitingFactor.toLowerCase()} constraints`
    );
  
    insights.push(
      `Tenure of ${tenureYears} years maximizes eligibility under retirement rules`
    );
  
    /* ---------- WARNINGS ---------- */
    if (emiRatio > 0.7) {
      warnings.push(
        `EMI consumes ${(emiRatio * 100).toFixed(0)}% of free cash`
      );
    }
  
    if (limitingFactor === "LTV") {
      warnings.push(
        `Property value limits loan despite income capacity`
      );
    }
  
    /* ---------- SUGGESTIONS ---------- */
    if (limitingFactor === "INCOME") {
      const gap = Math.round(ltvBasedLimit - incomeBasedLimit);
      if (gap > 0) {
        suggestions.push(
          `Increase income or reduce obligations to unlock ₹${gap.toLocaleString("en-IN")}`
        );
      }
    }
  
    if (emiRatio > 0.6) {
      suggestions.push(
        `Consider reducing loan amount to improve monthly cash flow`
      );
    }
  
    return {
      insights,
      warnings,
      suggestions
    };
  }
  