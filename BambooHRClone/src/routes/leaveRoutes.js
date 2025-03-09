const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { requestLeave, getLeaveRequests, updateLeaveStatus } = require("../controllers/leaveController");

const router = express.Router();

// ✅ Employee Request Leave
router.post("/", authMiddleware, roleMiddleware(["employee"]), requestLeave);

// ✅ Get All Leave Requests (Admin Only)
router.get("/", authMiddleware, roleMiddleware(["admin"]), getLeaveRequests);

// ✅ Approve or Reject Leave (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateLeaveStatus);

module.exports = router;
