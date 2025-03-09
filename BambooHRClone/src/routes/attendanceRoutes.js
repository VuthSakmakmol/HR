const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { clockIn, clockOut, getAttendance } = require("../controllers/attendanceController");

const router = express.Router();

// ✅ Employee Clock In
router.post("/clock-in", authMiddleware, roleMiddleware(["employee"]), clockIn);

// ✅ Employee Clock Out
router.post("/clock-out", authMiddleware, roleMiddleware(["employee"]), clockOut);

// ✅ Get Attendance (Admin or Employee)
router.get("/", authMiddleware, getAttendance);

module.exports = router;
