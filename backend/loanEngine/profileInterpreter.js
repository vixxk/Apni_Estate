function deriveFOIR(financialProfile) {
  const { monthlyIncome, creditScore, employmentStabilityScore } = financialProfile;

  let baseFOIR;
  if (monthlyIncome < 25000) baseFOIR = 0.42;
  else if (monthlyIncome < 50000) baseFOIR = 0.47;
  else baseFOIR = 0.52;

  let creditAdj = 0;
  if (creditScore >= 800) creditAdj += 0.03;
  else if (creditScore >= 750) creditAdj += 0.02;
  else if (creditScore >= 700) creditAdj += 0.0;
  else if (creditScore >= 650) creditAdj -= 0.02;
  else creditAdj -= 0.05;

  const stabilityAdj = (employmentStabilityScore - 0.5) * 0.1;

  let foir = baseFOIR + creditAdj + stabilityAdj;
  foir = Math.max(0.3, Math.min(0.6, foir));

  return foir;
}

function deriveRiskFactor(financialProfile) {
  const { creditScore, employmentStabilityScore } = financialProfile;

  let risk = 0.9;
  if (creditScore >= 820) risk = 1.05;
  else if (creditScore >= 760) risk = 1.0;
  else if (creditScore >= 700) risk = 0.9;
  else if (creditScore >= 650) risk = 0.8;
  else risk = 0.7;

  const stabilityAdj = (employmentStabilityScore - 0.5) * 0.6;
  risk += stabilityAdj;
  risk = Math.max(0.6, Math.min(1.1, risk));

  return risk;
}

function deriveAdjustedInterestRate(baseInterestRate, financialProfile) {
  const { creditScore, employmentStabilityScore } = financialProfile;

  let spread = 0;
  if (creditScore >= 820) spread -= 0.3;
  else if (creditScore >= 760) spread -= 0.1;
  else if (creditScore >= 700) spread += 0.1;
  else if (creditScore >= 650) spread += 0.3;
  else spread += 0.6;

  const stabilityAdj = (0.5 - employmentStabilityScore) * 0.6;
  spread += stabilityAdj;

  const adjusted = Math.max(5, baseInterestRate + spread);
  return adjusted;
}

function deriveLuxuryMultiplier(luxuryLevel) {
  const min = 0.8;
  const max = 1.4;
  return min + (max - min) * luxuryLevel;
}

function deriveLocationMultiplier(locationScore) {
  const min = 0.9;
  const max = 1.5;
  return min + (max - min) * locationScore;
}

export function interpretProfile(input) {
  const { financialProfile, loanPreferences, propertyDetails, systemDerived } = input;

  if (financialProfile.creditScore < 650) {
    return {
      rejected: true,
      rejectionReason: "Credit score below minimum threshold"
    };
  }

  const foir = deriveFOIR(financialProfile);
  const riskFactor = deriveRiskFactor(financialProfile);
  const adjustedInterestRate = deriveAdjustedInterestRate(
    loanPreferences.baseInterestRate,
    financialProfile
  );
  const luxuryMultiplier = deriveLuxuryMultiplier(propertyDetails.luxuryLevel);
  const locationMultiplier = deriveLocationMultiplier(propertyDetails.locationScore);

  return {
    foir,
    riskFactor,
    adjustedInterestRate,
    luxuryMultiplier,
    locationMultiplier,
    maxTenureYears: systemDerived.maxTenureYears,
    requestedTenureYears: loanPreferences.desiredTenureYears,
    ltvRatio: loanPreferences.ltvRatio
  };
}
