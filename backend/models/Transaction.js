const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional: link to specific bank accounts for more detailed history
    senderAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
    receiverAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["debit", "credit", "transfer"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["success", "pending_approval", "rejected"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for Performance
transactionSchema.index({ senderId: 1, receiverId: 1 });
transactionSchema.index({ senderAccountId: 1, receiverAccountId: 1 });
transactionSchema.index({ date: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

