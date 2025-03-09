const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Example Protected Route
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ msg: `Welcome ${req.user.role}, you are authenticated!` });
});

// Admin-Only Route
router.get("/admin-dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({ msg: `Welcome Admin ${req.user.userId}, you have full access.` });
});

// Employee-Only Route
router.get("/employee-dashboard", authMiddleware, roleMiddleware(["employee"]), (req, res) => {
    res.json({ msg: `Welcome Employee ${req.user.userId}, you have limited access.` });
});

// Open to Both Admin & Employees
router.get("/common-dashboard", authMiddleware, roleMiddleware(["admin", "employee"]), (req, res) => {
    res.json({ msg: "Welcome to the common dashboard for all users." });
});

module.exports = router;
