const express = require("express");
const {
  createAccount,
  getAccountsForUser,
  getSingleAccount,
  getBankByAccountNumber,
  depositToAccount,
} = require("../controllers/bankController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createAccount);
router.post("/connect", createAccount); // alias for academic spec
router.post("/deposit", depositToAccount);
router.get("/accounts", getAccountsForUser);
router.get("/account/:id", getSingleAccount);
router.get("/account-number/:accountNumber", getBankByAccountNumber);

module.exports = router;

