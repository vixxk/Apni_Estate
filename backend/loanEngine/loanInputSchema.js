import Joi from 'joi';

function deriveMaxTenureFromAge(age) {
  const retirementAge = 60;
  const maxTenureCap = 30;
  const yearsToRetirement = Math.max(retirementAge - age, 0);
  return Math.min(yearsToRetirement || 0, maxTenureCap);
}

export function validateAndNormalizeInput(payload) {
  const financialProfileSchema = Joi.object({
    monthlyIncome: Joi.number().min(0).required(),
    otherObligations: Joi.number().min(0).default(0),
    age: Joi.number().integer().min(18).max(70).required(),
    creditScore: Joi.number().integer().min(300).max(900).required(),
    employmentStabilityScore: Joi.number().min(0).max(1).required(),
    downPaymentAvailable: Joi.number().min(0).default(0)
  });

  const loanPreferencesSchema = Joi.object({
    desiredTenureYears: Joi.number().min(1).max(40).optional(),
    loanAmountRequested: Joi.number().min(0).required(),
    baseInterestRate: Joi.number().min(0).max(30).required(),
    ltvRatio: Joi.number().min(0).max(1).required()
  });

  const propertyDetailsSchema = Joi.object({
    includePlot: Joi.boolean().required(),
    plotPrice: Joi.number().min(0).default(0),
    plotSizeSqft: Joi.number().min(0).required(),
    floors: Joi.number().integer().min(1).required(),
    baseCostPerSqft: Joi.number().min(0).required(),
    luxuryLevel: Joi.number().min(0).max(1).required(),
    locationScore: Joi.number().min(0).max(1).required()
  });

  const rootSchema = Joi.object({
    financialProfile: financialProfileSchema.required(),
    loanPreferences: loanPreferencesSchema.required(),
    propertyDetails: propertyDetailsSchema.required()
  });

  const { error, value } = rootSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => ({
      message: d.message,
      path: d.path
    }));
    return {
      ok: false,
      error: {
        type: 'VALIDATION_ERROR',
        details
      }
    };
  }

  const normalized = { ...value };
  const age = normalized.financialProfile.age;
  const maxTenureFromAge = deriveMaxTenureFromAge(age);

  if (!normalized.loanPreferences.desiredTenureYears) {
    normalized.loanPreferences.desiredTenureYears = maxTenureFromAge;
  } else {
    normalized.loanPreferences.desiredTenureYears = Math.min(
      normalized.loanPreferences.desiredTenureYears,
      maxTenureFromAge
    );
  }

  if (!normalized.propertyDetails.includePlot) {
    normalized.propertyDetails.plotPrice = 0;
  }

  return {
    ok: true,
    data: {
      ...normalized,
      systemDerived: {
        maxTenureYears: maxTenureFromAge
      }
    }
  };
}
