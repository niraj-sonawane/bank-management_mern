const express = require("express");
const router = express.Router();
const { 
  getAllUsers, 
  getGlobalStats, 
  getGlobalTransactions,
  getAllPendingLoans,
  getPendingTransfers,
  approveTransaction
} = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

router.get("/stats", auth, isAdmin, getGlobalStats);
router.get("/users", auth, isAdmin, getAllUsers);
router.get("/transactions", auth, isAdmin, getGlobalTransactions);
router.get("/transactions/pending", auth, isAdmin, getPendingTransfers);
router.patch("/transactions/:id/approve", auth, isAdmin, approveTransaction);
router.get("/loans/pending", auth, isAdmin, getAllPendingLoans);

module.exports = router;
