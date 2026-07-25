const Employee = require("../models/Employee");

// GET /api/employees?search=&department=
exports.getEmployees = async (req, res) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: "Active" });
    const inactive = await Employee.countDocuments({ status: "Inactive" });

    res.json({
      employees,
      stats: { total, active, inactive },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ message: "Employee added", employee });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: err.message, error: err.message });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated", employee });
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
