const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { generatePayroll, getPayroll, updatePayrollStatus } = require("../controllers/payrollController");

const router = express.Router();

// ✅ Generate Payroll (Admin Only)
router.post("/", authMiddleware, roleMiddleware(["admin"]), generatePayroll);

// ✅ Get Payroll (Admin or Employee)
router.get("/", authMiddleware, getPayroll);

// ✅ Update Payroll Status to "Paid" (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updatePayrollStatus);

module.exports = router;
