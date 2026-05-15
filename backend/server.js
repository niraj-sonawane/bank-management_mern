const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Security: HTTP Headers
app.use(helmet());

// Security: Global Rate Limiting (100 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/bank", require("./routes/bank.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));
app.use("/api/transfer", require("./routes/transfer.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/loans", require("./routes/loan.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.get("/", (_req, res) => {
  res.json({ message: "Banking simulation API is running" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
});

