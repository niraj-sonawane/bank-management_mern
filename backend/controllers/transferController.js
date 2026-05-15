const BankAccount = require("../models/BankAccount");
const { getAccountById, getAccountByNumber, updateBalancesForTransfer } = require("../services/bankService");
const { createTransferTransactions } = require("../services/transactionService");
const { createNotification } = require("../services/notificationService");

const createTransfer = async (req, res) => {
  console.log(`[DEBUG] createTransfer hit. Method: ${req.method}, Path: ${req.path}, Body:`, req.body);
  try {
    const { senderAccountId, receiverAccountNumber, amount, description } = req.body;

    if (!senderAccountId || !receiverAccountNumber || !amount) {
      return res
        .status(400)
        .json({ message: "senderAccountId, receiverAccountNumber and amount are required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (numericAmount > 1000000) {
      return res.status(400).json({ message: "Transfer amount exceeds the maximum limit of ₹1,000,000" });
    }

    const senderAccount = await getAccountById(senderAccountId);
    const receiverAccount = await BankAccount.findOne({
      $or: [{ accountNumber: receiverAccountNumber }, { upiId: receiverAccountNumber }]
    });

    if (!senderAccount || !receiverAccount) {
      return res.status(404).json({ message: "Sender or receiver account not found" });
    }

    if (senderAccount.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only transfer from your own accounts" });
    }

    if (senderAccount._id.toString() === receiverAccount._id.toString()) {
      return res.status(400).json({ message: "Cannot transfer to the same account" });
    }

    const isHighValue = numericAmount > 500000;
    
    if (isHighValue) {
      await createTransferTransactions({
        senderUserId: senderAccount.userId,
        receiverUserId: receiverAccount.userId,
        senderAccountId: senderAccount._id,
        receiverAccountId: receiverAccount._id,
        amount: numericAmount,
        description: `[PENDING APPROVAL] ${description}`,
        status: "pending_approval",
      });

      await createNotification({
        userId: senderAccount.userId,
        message: `Your transfer of ₹${numericAmount.toLocaleString()} is pending manager approval due to high value.`,
        type: "transfer",
      });

      return res.status(202).json({
        message: "Transfer initiated and pending manager approval",
        status: "pending_approval",
      });
    }

    const { sender, receiver } = await updateBalancesForTransfer({
      senderAccountId: senderAccount._id,
      receiverAccountId: receiverAccount._id,
      amount: numericAmount,
    });

    await createTransferTransactions({
      senderUserId: sender.userId,
      receiverUserId: receiver.userId,
      senderAccountId: sender._id,
      receiverAccountId: receiver._id,
      amount: numericAmount,
      description,
    });

    // Create Notifications
    await createNotification({
      userId: sender.userId,
      message: `You transferred ₹${numericAmount.toLocaleString()} to account ${receiverAccount.accountNumber.slice(-4)}.`,
      type: "transfer",
    });

    await createNotification({
      userId: receiver.userId,
      message: `You received ₹${numericAmount.toLocaleString()} from ${senderAccount.bankName}.`,
      type: "transfer",
    });

    return res.status(201).json({
      message: "Transfer successful",
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Transfer failed" });
  }
};

module.exports = {
  createTransfer,
};

