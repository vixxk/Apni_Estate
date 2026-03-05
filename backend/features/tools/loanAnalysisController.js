import { asyncHandler } from '../../middleware/asyncHandler.js';

export const analyzeLoan = asyncHandler(async (req, res) => {
  const { monthlyIncome, existingEmis, creditScore, age, loanAmountRequested } = req.body;

  if (!monthlyIncome || !creditScore || !age || !loanAmountRequested) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const netIncome = monthlyIncome - (existingEmis || 0);
  const netSurplus = netIncome * 0.5;

  let status = 'APPROVED';
  let reason = 'Congratulations! You meet the criteria for the requested loan amount.';
  let assignedRate = 8.5;

  if (creditScore >= 750) assignedRate = 8.0;
  else if (creditScore >= 700) assignedRate = 8.5;
  else if (creditScore >= 650) assignedRate = 9.5;
  else assignedRate = 11.0;

  if (creditScore < 600) {
    status = 'REJECTED';
    reason = 'Your credit score is too low for a loan approval.';
  } else if (netIncome < 15000) {
    status = 'REJECTED';
    reason = 'Your net income does not meet the minimum requirements.';
  }

  let maxTenure = 60 - age;
  if (maxTenure > 30) maxTenure = 30;
  if (maxTenure < 5 && status !== 'REJECTED') {
     status = 'REJECTED';
     reason = 'Age does not permit sufficient loan tenure.';
  }

  const r = assignedRate / 12 / 100;
  const n = maxTenure * 12;
  let emiForRequested = 0;
  
  if (r > 0 && n > 0 && status !== 'REJECTED') {
      emiForRequested = Math.round((loanAmountRequested * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      if (emiForRequested > netSurplus) {
        status = 'MODIFIED APPROVAL';
        reason = 'Based on your income and existing obligations, we can offer a lower loan amount than requested.';
      }
  }

  res.json({
    success: true,
    data: {
      status,
      reason,
      details: {
        maxTenure,
        assignedRate,
        creditScore,
        requestedLoan: loanAmountRequested,
        netSurplus
      }
    }
  });
});
