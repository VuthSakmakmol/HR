require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express(); // ✅ Declare app first

// Middleware
app.use(express.json());
app.use(cors());

// Fix: Move CORS headers setup here
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/employees", employeeRoutes);

console.log("🔹 Connecting to Database...");
connectDB().then(() => console.log("🔹 Database Connection Successful!"));

// API Test Route
app.get("/", (req, res) => {
  res.send("BambooHR Clone API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
