const Employee = require("../models/employeeModel");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const employeeId = req.employee.id;
      const employee = await Employee.findByPk(employeeId);
      console.log(employee);
      if (!employee) {
        return res.status(404).json({ error: "employee not found" });
      }

      if (!roles.includes(employee.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden. You do not have access." });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = { checkRole };
