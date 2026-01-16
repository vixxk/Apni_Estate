export function resolveApproval({
    requestedLoan,
    eligibleLoan,
    emi,
    availableSurplus
  }) {
    if (eligibleLoan <= 0) {
      return { status: "REJECTED" };
    }
  
    if (requestedLoan <= eligibleLoan && emi <= availableSurplus) {
      return { status: "APPROVED" };
    }
  
    return {
      status: "MODIFIED",
      approvedLoan: eligibleLoan
    };
  }
  