const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getAttendanceReport, getLeaveReport, getPayrollReport } = require("../controllers/reportsController");

const router = express.Router();

// ✅ Attendance Report (Admin Only)
router.get("/attendance", authMiddleware, roleMiddleware(["admin"]), getAttendanceReport);

// ✅ Leave Report (Admin Only)
router.get("/leaves", authMiddleware, roleMiddleware(["admin"]), getLeaveReport);

// ✅ Payroll Report (Admin Only)
router.get("/payroll", authMiddleware, roleMiddleware(["admin"]), getPayrollReport);

module.exports = router;
