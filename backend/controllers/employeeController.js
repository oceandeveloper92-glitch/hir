const { Employee, Department } = require("../models");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const createEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json({
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ include: ["Department"] });
    res.status(200).json({ data: employees, message: "Employees fetched successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id, { include: ["Department"] });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ data: employee, message: "Employee fetched successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployeeByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ data: employee, message: "Employee fetched successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  try {
    const [updated] = await Employee.update(updatedData, {
      where: { id },
      returning: true,
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const updatedEmployee = await Employee.findByPk(id);
    res.status(200).json({ data: updatedEmployee, message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await employee.destroy();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const employeeLogin = async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();
  const normalizedEmail = email?.toLowerCase();
  try {
    const employee = await Employee.findOne({ where: { email: normalizedEmail } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (employee.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const employeeDepartment = await Department.findByPk(employee.departmentId);
    const permissions = {
      isMaster: employee.isMaster,
      hasPackageAccess: employee.hasPackageAccess,
      hasVisaAccess: employee.hasVisaAccess,
      hasPassportAccess: employee.hasPassportAccess,
      hasAirTicketAccess: employee.hasAirTicketAccess,
      isVendorMaster: employee.isVendorMaster,
      isSiteSceneMaster: employee.isSiteSceneMaster,
      hasEmployeeAccess: employee.hasEmployeeAccess,
      hasDepartmentAccess: employee.hasDepartmentAccess,
      hasCampaignAccess: employee.hasCampaignAccess,
    };
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        userType: employee.isMaster ? 'master' : 'employee',
        department: employeeDepartment,
        permissions: permissions,
      },
      "123456789_apple_banana",
      { expiresIn: "1d" }
    );
    res.status(200).json({
      token,
      message: "Login successful",
      userType: employee.isMaster ? 'master' : 'employee',
      userId: employee.id,
      department: employeeDepartment,
      name: employee.name,
      email: employee.email,
      permissions: permissions,
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployeeByToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const isValidToken = jwt.verify(authHeader && authHeader.split(" ")[1], "123456789_apple_banana");
  const employee = await Employee.findByPk(isValidToken.id, { include: ["Department"] });
  const emp = {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    userType: employee.isMaster ? 'master' : 'employee',
    department : {
      id: employee.Department.id,
      name: employee.Department.name,
      description: employee.Department.description,
      remarks: employee.Department.remarks
    },
    permissions: {
      isMaster: employee.isMaster,
      hasPackageAccess: employee.hasPackageAccess,
      hasVisaAccess: employee.hasVisaAccess,
      hasPassportAccess: employee.hasPassportAccess,
      hasAirTicketAccess: employee.hasAirTicketAccess,
      isVendorMaster: employee.isVendorMaster,
      isSiteSceneMaster: employee.isSiteSceneMaster,
      hasEmployeeAccess: employee.hasEmployeeAccess,
      hasDepartmentAccess: employee.hasDepartmentAccess,
      hasCampaignAccess: employee.hasCampaignAccess,
    }
  }
  if (!isValidToken) {
    return res.status(401).json({ message: "Invalid token" });
  } else {
    return res.status(200).json(emp);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByEmail,
  employeeLogin,
  getEmployeeByToken,
};
