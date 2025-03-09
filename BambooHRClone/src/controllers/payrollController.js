const Payroll = require("../models/Payroll");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// ✅ Generate Payroll (Admin Only)
exports.generatePayroll = async (req, res) => {
    try {
        const { employeeId, baseSalary, deductions, bonuses } = req.body;
        
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        const attendanceRecords = await Attendance.find({ employee: employeeId });
        const daysWorked = attendanceRecords.length;

        const netSalary = baseSalary + bonuses - deductions;

        const payroll = new Payroll({
            employee: employeeId,
            baseSalary,
            daysWorked,
            deductions,
            bonuses,
            netSalary,
        });

        await payroll.save();
        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Payroll for an Employee (Admin or Employee)
exports.getPayroll = async (req, res) => {
    try {
        const payrollRecords = req.user.role === "admin"
            ? await Payroll.find().populate("employee", "name email")
            : await Payroll.find({ employee: req.user.userId });

        res.json(payrollRecords);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Update Payroll Status (Admin Only)
exports.updatePayrollStatus = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) return res.status(404).json({ msg: "Payroll record not found" });

        payroll.status = "paid";
        await payroll.save();
        res.json({ msg: "Payroll marked as paid" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};
