require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const reportsRoutes = require("./routes/reportsRoutes");



const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/employees", require("./routes/employeeRoutes"));



console.log("🔹 Connecting to Database...");
connectDB().then(() => console.log("🔹 Database Connection Successful!"));

// API Routes
app.get("/", (req, res) => {
    res.send("BambooHR Clone API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
