const Employee = require("../models/Employee");

// ✅ Create Employee (Admin Only)
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, position, department, salary } = req.body;
        
        let employee = await Employee.findOne({ email });
        if (employee) return res.status(400).json({ msg: "Employee already exists" });

        employee = new Employee({
            name,
            email,
            position,
            department,
            salary,
            createdBy: req.user.userId, // Logged-in admin
        });

        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get All Employees (Admin Only)
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate("createdBy", "name email");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Get Single Employee (Admin or Employee)
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        // Employee can only view their own data unless admin
        if (req.user.role !== "admin" && req.user.userId !== employee._id.toString()) {
            return res.status(403).json({ msg: "Access denied" });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Update Employee (Admin Only)
exports.updateEmployee = async (req, res) => {
    try {
        const { name, position, department, salary } = req.body;

        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        employee.name = name || employee.name;
        employee.position = position || employee.position;
        employee.department = department || employee.department;
        employee.salary = salary || employee.salary;

        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// ✅ Delete Employee (Admin Only)
exports.deleteEmployee = async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: "Employee not found" });

        await employee.deleteOne();
        res.json({ msg: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};
