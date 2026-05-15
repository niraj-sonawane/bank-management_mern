const express = require("express");
const { getTransactionsForUser } = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTransactionsForUser);

module.exports = router;

