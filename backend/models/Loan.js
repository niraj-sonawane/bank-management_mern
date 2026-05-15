const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    loanType: {
      type: String,
      enum: ["personal", "home", "auto", "education"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number, // Annual percentage rate
      required: true,
    },
    tenureMonths: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "active", "rejected", "closed"],
      default: "pending",
    },
    emiAmount: {
      type: Number,
    },
    outstandingBalance: {
      type: Number,
    },
    disbursementDate: Date,
    nextPaymentDate: Date,
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
