const Loan = require("../models/Loan");
const LoanPayment = require("../models/LoanPayment");
const { depositBalance } = require("./bankService");
const { createNotification } = require("./notificationService");

/**
 * Calculate Equated Monthly Installment (EMI)
 * Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * p = principal, r = monthly interest rate, n = tenure in months
 */
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / (12 * 100);
  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

const applyForLoan = async ({ userId, bankAccountId, loanType, amount, interestRate, tenureMonths }) => {
  const emiAmount = calculateEMI(amount, interestRate, tenureMonths);
  
  const loan = await Loan.create({
    userId,
    bankAccountId,
    loanType,
    amount,
    interestRate,
    tenureMonths,
    emiAmount,
    outstandingBalance: amount,
    status: "pending",
  });

  await createNotification({
    userId,
    message: `Your ${loanType} loan application for ₹${amount.toLocaleString()} is under review.`,
    type: "loan",
  });

  return loan;
};

const getLoansByUser = async (userId) => {
  return Loan.find({ userId }).populate("bankAccountId").sort({ createdAt: -1 });
};

const approveLoan = async (loanId) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new Error("Loan not found");
  if (loan.status !== "pending") throw new Error("Loan is already " + loan.status);

  loan.status = "approved";
  loan.disbursementDate = new Date();
  
  // Set first payment date to 1 month from now
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  loan.nextPaymentDate = nextDate;

  await loan.save();

  // Disburse funds to bank account
  await depositBalance({ accountId: loan.bankAccountId, amount: loan.amount });

  await createNotification({
    userId: loan.userId,
    message: `Congratulations! Your loan of ₹${loan.amount.toLocaleString()} has been approved and disbursed.`,
    type: "loan",
  });

  return loan;
};

const makeLoanPayment = async (loanId, amount) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new Error("Loan not found");

  loan.outstandingBalance -= amount;
  if (loan.outstandingBalance <= 0) {
    loan.status = "closed";
    loan.outstandingBalance = 0;
  }

  // Update next payment date
  const nextDate = new Date(loan.nextPaymentDate);
  nextDate.setMonth(nextDate.getMonth() + 1);
  loan.nextPaymentDate = nextDate;

  await loan.save();

  await LoanPayment.create({
    loanId,
    amount,
    status: "success",
  });

  await createNotification({
    userId: loan.userId,
    message: `EMI payment of ₹${amount.toLocaleString()} processed successfully.`,
    type: "loan",
  });

  return loan;
};

const getLoanStatement = async (loanId) => {
  const payments = await LoanPayment.find({ loanId }).sort({ paymentDate: -1 });
  return payments;
};

module.exports = {
  applyForLoan,
  getLoansByUser,
  approveLoan,
  makeLoanPayment,
  getLoanStatement,
};
