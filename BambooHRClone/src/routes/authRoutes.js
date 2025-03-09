const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authController");
const { getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/authController");

const router = express.Router();

// Register Route
router.post("/register", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role must be either 'admin' or 'employee'").isIn(["admin", "employee"])
], register);

// Login Route
router.post("/login", [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists()
], login);

router.get("/profile", authMiddleware, getUserProfile);

router.get("/admin/dashboard", authMiddleware, getAdminDashboard);



module.exports = router;
