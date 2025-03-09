const Attendance = require("../models/Attendance");

// ✅ Employee Clock In
exports.clockIn = async (req, res) => {
    try {
        const existingRecord = await Attendance.findOne({ employee: req.user.userId, date: new Date().toISOString().split("T")[0] });

        if (existingRecord) {
            return res.status(400).json({ msg: "Already clocked in today" });
        }

        const attendance = new Attendance({
            employee: req.user.userId,
            clockIn: new Date(),
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Employee Clock Out
exports.clockOut = async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ employee: req.user.userId, date: new Date().toISOString().split("T")[0] });

        if (!attendance || attendance.clockOut) {
            return res.status(400).json({ msg: "No clock-in record found or already clocked out" });
        }

        attendance.clockOut = new Date();
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Employee Attendance (Admin or Employee)
exports.getAttendance = async (req, res) => {
    try {
        const attendance = req.user.role === "admin"
            ? await Attendance.find().populate("employee", "name email")
            : await Attendance.find({ employee: req.user.userId });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};
