const mongoose = require("mongoose");
const User = require("./models/User");
const BankAccount = require("./models/BankAccount");
require("dotenv").config();

async function seedReceiver() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/banking_sim");
  
  const email = "receiver123@example.com";
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "Receiver Test",
      firstName: "Receiver",
      lastName: "Test",
      email: email,
      password: "Password123!"
    });
  }

  let bank = await BankAccount.findOne({ accountNumber: email });
  if (!bank) {
    bank = await BankAccount.create({
      userId: user._id,
      bankName: "Receiver Bank",
      accountNumber: email,
      balance: 1000
    });
  }

  console.log("Receiver seeded successfully!");
  console.log("Sharable ID to use:", Buffer.from(email).toString("base64"));
  process.exit(0);
}

seedReceiver();
