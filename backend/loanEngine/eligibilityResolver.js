import {
  computeEMI,
  computePrincipalFromEmi,
  computeTotals
} from './emiCalculator.js';

export function computeIncomeBasedCapacity(financialProfile, interpreted) {
  const { monthlyIncome, otherObligations } = financialProfile;
  const { foir, riskFactor, adjustedInterestRate, requestedTenureYears } = interpreted;

  const maxAllowedTotalEmi = monthlyIncome * foir;
  const availableSurplus = Math.max(
    maxAllowedTotalEmi - otherObligations,
    0
  );

  const maxEmi = availableSurplus * riskFactor;

  const incomeBasedLoan = computePrincipalFromEmi(
    maxEmi,
    adjustedInterestRate,
    requestedTenureYears
  );

  return {
    maxAllowedTotalEmi,
    availableSurplus,
    maxEmi,
    incomeBasedLoan
  };
}


export function computeLtvBasedCapacity(propertyValue, ltvRatio) {
  const ltvLoan = propertyValue * ltvRatio;
  return {
    ltvLoan
  };
}

export function resolveEligibility(context) {
  const { financialProfile, interpreted, propertyCosts } = context;

  const incomeSide = computeIncomeBasedCapacity(financialProfile, interpreted);
  const ltvSide = computeLtvBasedCapacity(propertyCosts.propertyValue, interpreted.ltvRatio);

  const incomeBasedLimit = incomeSide.incomeBasedLoan;
  const ltvBasedLimit = ltvSide.ltvLoan;

  const eligibleLoan = Math.min(incomeBasedLimit, ltvBasedLimit);
  const limitingFactor =
    eligibleLoan === incomeBasedLimit
      ? 'INCOME'
      : 'LTV';

  const emi = computeEMI(
    eligibleLoan,
    interpreted.adjustedInterestRate,
    interpreted.requestedTenureYears
  );
  const totals = computeTotals(
    eligibleLoan,
    emi,
    interpreted.adjustedInterestRate,
    interpreted.requestedTenureYears
  );

  return {
    incomeBasedLimit,
    ltvBasedLimit,
    limitingFactor,
    eligibleLoan,
    emi,
    availableSurplus: incomeSide.availableSurplus, 
    tenureYears: interpreted.requestedTenureYears,
    interestRateAdjusted: interpreted.adjustedInterestRate,
    totalInterest: totals.totalInterest,
    totalRepayment: totals.totalRepayment
  }; 
}
