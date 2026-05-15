const {
  createBankAccount,
  getUserAccounts,
  getAccountById,
  getAccountByNumber,
  depositBalance,
} = require("../services/bankService");
const { getTransactionsByAccountId, createDepositTransaction } = require("../services/transactionService");
const { createNotification } = require("../services/notificationService");

// Map BankAccount + Transactions into the shape expected by the Next.js UI
const buildAccountViewModel = (bank, transactions = []) => {
  const mask = bank.accountNumber.slice(-4);

  const mappedTransactions = transactions.map((tx) => ({
    id: tx._id,
    name: tx.description || "Transfer",
    amount: tx.amount,
    date: tx.date,
    paymentChannel: "online",
    category: "Transfer",
    type: tx.type === "debit" ? "debit" : "credit",
  }));

  return {
    account: {
      id: bank._id.toString(),
      availableBalance: bank.balance,
      currentBalance: bank.balance,
      institutionId: bank.bankName,
      name: bank.bankName,
      officialName: bank.bankName,
      mask,
      type: "depository",
      subtype: "checking",
      appwriteItemId: bank._id.toString(),
      shareableId: Buffer.from(bank.accountNumber).toString("base64"),
      upiId: bank.upiId,
    },
    transactions: mappedTransactions,
  };
};

const createAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, startingBalance } = req.body;

    if (!bankName || !accountNumber) {
      return res.status(400).json({ message: "bankName and accountNumber are required" });
    }

    const bank = await createBankAccount({
      userId: req.user.id,
      bankName,
      accountNumber,
      startingBalance,
    });

    const view = buildAccountViewModel(bank, []);
    return res.status(201).json(view.account);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to create bank account" });
  }
};

const getAccountsForUser = async (req, res) => {
  try {
    const banks = await getUserAccounts(req.user.id);

    const accounts = banks.map((bank) =>
      buildAccountViewModel(bank, []).account
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce(
      (sum, acc) => sum + (acc.currentBalance || 0),
      0
    );

    return res.status(200).json({
      data: accounts,
      totalBanks,
      totalCurrentBalance,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load accounts" });
  }
};

const getSingleAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await getAccountById(id);

    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    if (bank.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const transactions = await getTransactionsByAccountId(bank._id);
    const view = buildAccountViewModel(bank, transactions);

    return res.status(200).json({
      data: view.account,
      transactions: view.transactions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load account" });
  }
};

const getBankByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const bank = await getAccountByNumber(accountNumber);

    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    return res.status(200).json(bank);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load account" });
  }
};

const depositToAccount = async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;
    if (!accountId || !amount) {
      return res.status(400).json({ message: "accountId and amount are required" });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const bank = await getAccountById(accountId);
    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    if (bank.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await depositBalance({ accountId, amount: numericAmount });
    await createDepositTransaction({ 
      userId: req.user.id, 
      accountId, 
      amount: numericAmount, 
      description: description || "Deposit"
    });

    // Create Notification
    await createNotification({
      userId: req.user.id,
      message: `Direct deposit of ₹${numericAmount.toLocaleString()} successful.`,
      type: "deposit",
    });

    return res.status(200).json({ message: "Deposit successful" });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to process deposit" });
  }
};

module.exports = {
  createAccount,
  getAccountsForUser,
  getSingleAccount,
  getBankByAccountNumber,
  depositToAccount,
};

