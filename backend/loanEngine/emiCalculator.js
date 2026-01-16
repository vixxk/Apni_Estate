export function annualRateToMonthly(rateAnnualPercent) {
  const r = rateAnnualPercent / 100;
  return r / 12;
}
export function computeEMI(principal, rateAnnualPercent, tenureYears) {
  if (principal <= 0) return 0;

  const r = annualRateToMonthly(rateAnnualPercent);
  const n = Math.round(tenureYears * 12);

  if (r === 0 || n === 0) {
    return principal / Math.max(n, 1);
  }

  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  return emi;
}

export function computePrincipalFromEmi(maxEmi, rateAnnualPercent, tenureYears) {
  const r = annualRateToMonthly(rateAnnualPercent);
  const n = Math.round(tenureYears * 12);

  if (r === 0 || n === 0) return maxEmi * n;

  const pow = Math.pow(1 + r, n);
  const principal = maxEmi * ((pow - 1) / (r * pow));
  return principal;
}

export function computeTotals(principal, emi, rateAnnualPercent, tenureYears) {
  const n = Math.round(tenureYears * 12);
  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - principal;
  return {
    totalRepayment,
    totalInterest
  };
}
