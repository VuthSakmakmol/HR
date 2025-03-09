const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Employee = require("../models/Employee");

const router = express.Router();

// ✅ Get all employees (Admin only)
router.get("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const employees = await Employee.find();
    res.json(employees);
});

// ✅ Add a new employee (Admin only)
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const { name, email, position, department, salary } = req.body;
    const employee = new Employee({ name, email, position, department, salary });
    await employee.save();
    res.json({ msg: "Employee added successfully", employee });
});

// ✅ Update employee details (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Employee updated", updatedEmployee });
});

// ✅ Delete an employee (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ msg: "Employee deleted" });
});

module.exports = router;
