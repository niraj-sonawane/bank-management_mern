const express = require("express");
const { createTransfer } = require("../controllers/transferController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTransfer);

module.exports = router;

