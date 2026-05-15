const Transaction = require("../models/Transaction");

const createTransferTransactions = async ({
  senderUserId,
  receiverUserId,
  senderAccountId,
  receiverAccountId,
  amount,
  description,
}) => {
  const value = Number(amount);

  const [debitTx, creditTx] = await Transaction.create([
    {
      senderId: senderUserId,
      receiverId: receiverUserId,
      senderAccountId,
      receiverAccountId,
      amount: value,
      type: "debit",
      description,
    },
    {
      senderId: senderUserId,
      receiverId: receiverUserId,
      senderAccountId,
      receiverAccountId,
      amount: value,
      type: "credit",
      description,
    },
  ]);

  return { debitTx, creditTx };
};

const createDepositTransaction = async ({ userId, accountId, amount, description }) => {
  const tx = await Transaction.create({
    senderId: userId,
    receiverId: userId,
    senderAccountId: accountId,
    receiverAccountId: accountId,
    amount: Number(amount),
    type: "credit",
    description: description || "Deposit",
  });
  return tx;
};

const getUserTransactions = async (userId) => {
  return Transaction.find({
    $or: [
      { senderId: userId, type: "debit" },
      { receiverId: userId, type: "credit" }
    ],
  })
    .sort({ date: -1 })
    .populate("senderAccountId receiverAccountId");
};

const getTransactionsByAccountId = async (accountId) => {
  return Transaction.find({
    $or: [
      { senderAccountId: accountId, type: "debit" },
      { receiverAccountId: accountId, type: "credit" }
    ],
  }).sort({ date: -1 });
};

module.exports = {
  createTransferTransactions,
  createDepositTransaction,
  getUserTransactions,
  getTransactionsByAccountId,
};

