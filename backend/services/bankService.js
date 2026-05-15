const BankAccount = require("../models/BankAccount");

const createBankAccount = async ({ userId, bankName, accountNumber, startingBalance }) => {
  const existing = await BankAccount.findOne({ accountNumber });
  if (existing) {
    throw new Error("Bank account with this number already exists");
  }

  const upiId = `${accountNumber}@horizon`;

  const bankAccount = await BankAccount.create({
    userId,
    bankName,
    accountNumber,
    upiId,
    balance: Number(startingBalance) || 0,
  });

  return bankAccount;
};

const getUserAccounts = async (userId) => {
  return BankAccount.find({ userId }).sort({ createdAt: -1 });
};

const getAccountById = async (id) => {
  return BankAccount.findById(id);
};

const getAccountByNumber = async (accountNumber) => {
  return BankAccount.findOne({ accountNumber });
};

const updateBalancesForTransfer = async ({ senderAccountId, receiverAccountId, amount }) => {
  const sender = await BankAccount.findById(senderAccountId);
  const receiver = await BankAccount.findById(receiverAccountId);

  if (!sender || !receiver) {
    throw new Error("Sender or receiver account not found");
  }

  if (sender.balance < amount) {
    throw new Error("Insufficient balance");
  }

  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  return { sender, receiver };
};

const depositBalance = async ({ accountId, amount }) => {
  const account = await BankAccount.findById(accountId);
  if (!account) throw new Error("Account not found");
  account.balance += amount;
  await account.save();
  return account;
};

module.exports = {
  createBankAccount,
  getUserAccounts,
  getAccountById,
  getAccountByNumber,
  updateBalancesForTransfer,
  depositBalance,
};

