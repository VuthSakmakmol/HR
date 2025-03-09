const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    baseSalary: { type: Number, required: true },
    daysWorked: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "paid"], default: "pending" }
});

module.exports = mongoose.model("Payroll", PayrollSchema);
