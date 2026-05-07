const { Department, User, Employee } = require("../models");

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, remarks } = req.body;
    const userId = req.user.id;

    const department = await Department.create({
      name,
      description,
      remarks,
      userId,
    });

    res.status(201).json({
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Error creating department",
      error: error.message,
    });
  }
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      
    });

    res.status(200).json({
      message: "Departments fetched successfully",
      data: departments,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message,
    });
  }
};

// Get a department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findOne({
      where: { id },
      
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json({
      message: "Department fetched successfully",
      data: department,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Error fetching department",
      error: error.message,
    });
  }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, remarks } = req.body;
    const userId = req.user.id;

    const department = await Department.findOne({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    department.name = name || department.name;
    department.description = description || department.description;
    department.remarks = remarks || department.remark;
    department.userId = userId || department.userId;

    await department.save();

    res.status(200).json({
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Error updating department",
      error: error.message,
    });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findOne({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    await department.destroy();

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Error deleting department",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
