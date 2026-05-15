const { 
  applyForLoan, 
  getLoansByUser, 
  approveLoan, 
  makeLoanPayment, 
  getLoanStatement 
} = require("../services/loanService");

const requestLoan = async (req, res) => {
  console.log(`[DEBUG] requestLoan hit. Method: ${req.method}, Path: ${req.path}`);
  try {
    const { bankAccountId, loanType, amount, interestRate, tenureMonths } = req.body;
    
    const loan = await applyForLoan({
      userId: req.user.id,
      bankAccountId,
      loanType,
      amount: Number(amount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
    });

    return res.status(201).json(loan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getUserLoans = async (req, res) => {
  try {
    const loans = await getLoansByUser(req.user.id);
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch loans" });
  }
};

const processLoanPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const loan = await makeLoanPayment(id, Number(amount));
    return res.status(200).json(loan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const fetchLoanStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const statement = await getLoanStatement(id);
    return res.status(200).json(statement);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch statement" });
  }
};

const adminApproveLoan = async (req, res) => {
  console.log(`[DEBUG] adminApproveLoan hit. ID: ${req.params.id}`);
  try {
    // Only admins should be able to call this (handled by middleware in routes)
    const { id } = req.params;
    const loan = await approveLoan(id);
    return res.status(200).json(loan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  requestLoan,
  getUserLoans,
  processLoanPayment,
  fetchLoanStatement,
  adminApproveLoan,
};
