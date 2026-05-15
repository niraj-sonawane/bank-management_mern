const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.email;

  const user = await User.create({
    name,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    address1: data.address1,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    dateOfBirth: data.dateOfBirth,
    ssn: data.ssn,
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserById,
};

