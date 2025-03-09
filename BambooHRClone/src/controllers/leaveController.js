const LeaveRequest = require("../models/LeaveRequest");

// ✅ Employee Request Leave
exports.requestLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;

        const leave = new LeaveRequest({
            employee: req.user.userId,
            startDate,
            endDate,
            reason,
        });

        await leave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Leave Requests (Admin Only)
exports.getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find().populate("employee", "name email");
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Approve or Reject Leave (Admin Only)
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const leave = await LeaveRequest.findById(req.params.id);
        if (!leave) return res.status(404).json({ msg: "Leave request not found" });

        leave.status = status;
        await leave.save();
        res.json(leave);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};
