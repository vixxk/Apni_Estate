import { validateAndNormalizeInput } from "./loanInputSchema.js";
import { interpretProfile } from "./profileInterpreter.js";
import { estimatePropertyCosts } from "./propertyEstimator.js";
import { resolveEligibility } from "./eligibilityResolver.js";
import { resolveApproval } from "./approvalResolver.js";
import { generateRuleBasedAdvisory } from "./ruleBasedAdvisory.js";

/*
  POST /api/loan/analyze
  Main orchestrator: validation → interpretation → calculations → AI advisory
 */
export async function analyzeLoan(req, res) {
  try {
    // Input validation & normalization
    const validation = validateAndNormalizeInput(req.body);
    if (!validation.ok) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const normalized = validation.data;
    const { financialProfile, loanPreferences, propertyDetails } = normalized;

    // Derive underwriting parameters (FOIR, risk, multipliers)
    const interpreted = interpretProfile(normalized);

    if (interpreted.rejected) {
      return res.json({
        success: true,
        data: {
          decision: {
            status: "REJECTED",
            reason: interpreted.rejectionReason,
          },
        },
      });
    }

    // Property cost estimation (construction + plot if included)
    const propertyCosts = estimatePropertyCosts(propertyDetails, {
      luxuryMultiplier: interpreted.luxuryMultiplier,
      locationMultiplier: interpreted.locationMultiplier,
    });

    // Final eligibility resolution (min(income, LTV))
    const coreResults = resolveEligibility({
      financialProfile,
      interpreted,
      propertyCosts,
    });

    const approval = resolveApproval({
      requestedLoan: loanPreferences.loanAmountRequested,
      eligibleLoan: coreResults.eligibleLoan,
      emi: coreResults.emi,
availableSurplus: coreResults.availableSurplus
    });
    

    const advisory = generateRuleBasedAdvisory(
      coreResults,
      financialProfile
    );    

    const totalProjectCost = propertyCosts.propertyValue;
    const downPaymentRequired = Math.max(
      totalProjectCost - coreResults.eligibleLoan,
      0
    );

    return res.json({
      success: true,
      data: {
        coreResults: {
          eligibleLoan: Math.round(coreResults.eligibleLoan),
          emi: Math.round(coreResults.emi),
          tenureYears: coreResults.tenureYears,
          interestRateAdjusted: coreResults.interestRateAdjusted,
          totalInterest: Math.round(coreResults.totalInterest),
          totalRepayment: Math.round(coreResults.totalRepayment),
        },
        costBreakdown: {
          plotCost: Math.round(propertyCosts.plotCost),
          constructionCost: Math.round(propertyCosts.constructionCost),
          totalProjectCost: Math.round(totalProjectCost),
          downPaymentRequired: Math.round(downPaymentRequired),
        },
        constraints: {
          incomeBasedLimit: Math.round(coreResults.incomeBasedLimit),
          ltvBasedLimit: Math.round(coreResults.ltvBasedLimit),
          limitingFactor: coreResults.limitingFactor,
        },
        advisory: {
          insights: advisory.insights || [],
          warnings: advisory.warnings || [],
          suggestions: advisory.suggestions || [],
        },
        debug: {
          foir: interpreted.foir,
          riskFactor: interpreted.riskFactor,
          luxuryMultiplier: interpreted.luxuryMultiplier,
          locationMultiplier: interpreted.locationMultiplier,
          maxTenureYears: interpreted.maxTenureYears,
          requestedTenureYears: interpreted.requestedTenureYears,
        },
      },
    });
  } catch (err) {
    console.error("Loan analysis error:", err);
    return res.status(500).json({
      success: false,
      error: {
        type: "INTERNAL_ERROR",
        message: "Something went wrong while analyzing the loan request.",
      },
    });
  }
}
