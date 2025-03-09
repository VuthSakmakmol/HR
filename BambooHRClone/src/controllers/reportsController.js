const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const Payroll = require("../models/Payroll");

// ✅ Get Attendance Report (Admin Only)
exports.getAttendanceReport = async (req, res) => {
    try {
        const report = await Attendance.find().populate("employee", "name email");
        res.json(report);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Leave Report (Admin Only)
exports.getLeaveReport = async (req, res) => {
    try {
        const report = await LeaveRequest.find().populate("employee", "name email");
        res.json(report);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Payroll Report (Admin Only)
exports.getPayrollReport = async (req, res) => {
    try {
        const report = await Payroll.find().populate("employee", "name email");
        res.json(report);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};
