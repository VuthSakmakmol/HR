const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Register User (Admin or Employee)
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getAdminDashboard = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    res.json({ msg: "Welcome to the Admin Dashboard", user: req.user });
};


