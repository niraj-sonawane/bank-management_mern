const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");
const User = require("../models/User");
const BankAccount = require("../models/BankAccount");
const { updateBalancesForTransfer } = require("../services/bankService");
const { createNotification } = require("../services/notificationService");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const [userCount, accountCount, transactionCount, loanCount] = await Promise.all([
      User.countDocuments(),
      BankAccount.countDocuments(),
      Transaction.countDocuments(),
      Loan.countDocuments(),
    ]);

    const totalBalance = await BankAccount.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ]);

    return res.status(200).json({
      userCount,
      accountCount,
      transactionCount,
      loanCount,
      totalSystemLiquidity: totalBalance[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
};

const getGlobalTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "name email")
      .sort({ date: -1 })
      .limit(100);
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

const getAllPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" })
      .populate("userId", "name email")
      .populate("bankAccountId");
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pending loans" });
  }
};

const getPendingTransfers = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: "pending_approval" })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch pending transfers" });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    if (!tx || tx.status !== "pending_approval") {
      return res.status(404).json({ message: "Pending transaction not found" });
    }

    // Process the balance update
    await updateBalancesForTransfer({
      senderAccountId: tx.senderAccountId,
      receiverAccountId: tx.receiverAccountId,
      amount: tx.amount,
    });

    tx.status = "success";
    tx.description = tx.description.replace("[PENDING APPROVAL] ", "");
    await tx.save();

    await createNotification({
      userId: tx.senderId,
      message: `Your high-value transfer of ₹${tx.amount.toLocaleString()} has been approved by a manager.`,
      type: "transfer",
    });

    return res.status(200).json(tx);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getGlobalStats,
  getGlobalTransactions,
  getAllPendingLoans,
  getPendingTransfers,
  approveTransaction,
};
