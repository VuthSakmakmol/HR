const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    clockIn: { type: Date },
    clockOut: { type: Date },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
