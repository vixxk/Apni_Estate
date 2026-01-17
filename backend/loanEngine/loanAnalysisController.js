class AILoanAssistant {
  constructor(income, existingEmis, creditScore, age, loanAmountRequested) {
    this.income = income;
    this.existingEmis = existingEmis;
    this.creditScore = creditScore;
    this.age = age;
    this.loanAmountRequested = loanAmountRequested;

    // Standard Market Base Rate (e.g., Repo Rate + Spread)
    this.baseRate = 8.50;
  }

  determineInterestRate() {
    /*
      AI Logic: Adjusts interest rate based on risk (Credit Score).
      Low Score = Higher Rate.
    */
    if (this.creditScore >= 800) {
      return this.baseRate - 0.20; // Excellent score discount
    } else if (this.creditScore >= 750) {
      return this.baseRate;        // Standard Prime Rate
    } else if (this.creditScore >= 700) {
      return this.baseRate + 0.50; // Moderate Risk
    } else if (this.creditScore >= 650) {
      return this.baseRate + 2.00; // High Risk
    } else {
      return null;  // Rejected: Score too low
    }
  }

  calculateMaxTenure() {
    /*
      Logic: Loan must be repaid by retirement (Age 60).
    */
    const retirementAge = 60;
    const maxTenure = retirementAge - this.age;

    // Cap tenure between 5 and 30 years
    if (maxTenure > 30) return 30;
    if (maxTenure < 5) return 0;
    return maxTenure;
  }

  calculateFoirLimit() {
    /*
      Logic: Higher income earners are allowed a higher EMI burden.
      FOIR = Fixed Obligation to Income Ratio.
    */
    if (this.income < 25000) {
      return 0.40; // Max 40% of income for EMI
    } else if (this.income < 50000) {
      return 0.50; // Max 50% of income for EMI
    } else {
      return 0.60; // Max 60% of income for EMI
    }
  }

  calculateEmi(principal, annualRate, tenureYears) {
    const r = annualRate / (12 * 100); // Monthly rate
    const n = tenureYears * 12;        // Total months

    if (n === 0) return 0;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi * 100) / 100; 
  }

  calculateMaxLoanCapacity(maxMonthlyPayment, annualRate, tenureYears) {
    /*
      Reverse Engineer: Calculates how much Loan Principal fits into the monthly payment.
    */
    const r = annualRate / (12 * 100);
    const n = tenureYears * 12;

    // Formula: P = (E * ((1+r)^n - 1)) / (r * (1+r)^n)
    const principal = (maxMonthlyPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    return Math.round(principal);
  }

  runAnalysis() {
    // 1. RISK CHECK (Credit Score)
    const rate = this.determineInterestRate();
    if (rate === null) {
      return {
        status: "REJECTED",
        reason: "Credit Score below 650 is too risky.",
        details: {}
      };
    }

    // 2. TENURE CHECK (Age)
    const tenure = this.calculateMaxTenure();
    if (tenure === 0) {
      return {
        status: "REJECTED",
        reason: `Based on age ${this.age}, tenure is insufficient (< 5 years).`,
        details: {}
      };
    }

    // 3. FINANCIAL CHECK (Income & Capacity)
    const foirPercent = this.calculateFoirLimit();
    const maxAllowedTotalEmi = this.income * foirPercent;

    // Subtract existing EMIs (Car loan, etc) to find surplus for Home Loan
    const availableSurplus = maxAllowedTotalEmi - this.existingEmis;

    if (availableSurplus <= 0) {
      return {
        status: "REJECTED",
        reason: "Existing debts (EMIs) consume all your eligibility.",
        details: {}
      };
    }

    // 4. CALCULATIONS
    // Calculate EMI for the requested amount
    const requestedEmi = this.calculateEmi(this.loanAmountRequested, rate, tenure);

    // Calculate the absolute maximum loan the user can get based on surplus
    const maxEligibleLoan = this.calculateMaxLoanCapacity(availableSurplus, rate, tenure);

    const result = {
      status: "APPROVED",
      reason: "Congratulations! You can comfortably afford this loan.",
      details: {
        creditScore: this.creditScore,
        assignedRate: rate,
        maxTenure: tenure,
        requestedLoan: this.loanAmountRequested,
        requestedEmi: requestedEmi,
        netSurplus: availableSurplus,
        maxEligibleLoan: maxEligibleLoan
      }
    };

    // 5. FINAL DECISION
    if (requestedEmi > availableSurplus) {
      result.status = "MODIFIED APPROVAL";
      result.reason = `The requested loan is too high for your income. We can offer a maximum of ₹${maxEligibleLoan.toLocaleString('en-IN')}`;
    }

    return result;
  }
}

/*
  POST /api/loan/analyze
*/
export async function analyzeLoan(req, res) {
  try {
    const {
      monthlyIncome,
      existingEmis, 
      creditScore,
      age,
      loanAmountRequested
    } = req.body;

    // Basic Validation
    if (!monthlyIncome || !creditScore || !age || !loanAmountRequested) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: monthlyIncome, creditScore, age, loanAmountRequested"
      });
    }

    const app = new AILoanAssistant(
      Number(monthlyIncome),
      Number(existingEmis || 0),
      Number(creditScore),
      Number(age),
      Number(loanAmountRequested)
    );

    const analysisResult = app.runAnalysis();

    return res.json({
      success: true,
      data: analysisResult
    });

  } catch (err) {
    console.error("Loan analysis error:", err);
    return res.status(500).json({
      success: false,
      error: {
        type: "INTERNAL_ERROR",
        message: "Something went wrong while analyzing the loan request.",
      }
    });
  }
}
