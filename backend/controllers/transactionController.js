const { getUserTransactions } = require("../services/transactionService");

const getTransactionsForUser = async (req, res) => {
  try {
    const transactions = await getUserTransactions(req.user.id);

    const mapped = transactions.map((tx) => ({
      id: tx._id,
      name: tx.description || "Transfer",
      amount: tx.amount,
      date: tx.date,
      paymentChannel: "online",
      category: "Transfer",
      type: tx.type === "debit" ? "debit" : "credit",
    }));

    return res.status(200).json(mapped);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load transactions" });
  }
};

module.exports = {
  getTransactionsForUser,
};

