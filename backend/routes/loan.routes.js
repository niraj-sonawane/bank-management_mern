const express = require("express");
const router = express.Router();
const { 
  requestLoan, 
  getUserLoans, 
  processLoanPayment, 
  fetchLoanStatement,
  adminApproveLoan 
} = require("../controllers/loanController");
const auth = require("../middlewares/authMiddleware");

router.post("/apply", auth, requestLoan);
router.get("/", auth, getUserLoans);
router.post("/:id/pay", auth, processLoanPayment);
router.get("/:id/statement", auth, fetchLoanStatement);
router.patch("/:id/approve", auth, adminApproveLoan); // This should be protected by isAdmin later

module.exports = router;
