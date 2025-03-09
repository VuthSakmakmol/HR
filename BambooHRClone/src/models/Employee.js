const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
  department: String,
  salary: Number,
  workStartTime: String, // New field (e.g., "09:00")
});

module.exports = mongoose.model("Employee", EmployeeSchema);
