const router = require("express").Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  getEmployeeByEmail,
  employeeLogin,
  getEmployeeByToken,
} = require("../controllers/employeeController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/add", authenticated, createEmployee);
router.get("/getall", authenticated, getAllEmployees);
router.get("/get/:id",  getEmployeeById);
router.get("/getbyemail/:email", getEmployeeByEmail);
router.put("/update/:id", authenticated, updateEmployee);
router.delete("/delete/:id", authenticated, deleteEmployee);
router.post("/login", employeeLogin);
router.get("/getbytoken", authenticated, getEmployeeByToken);

module.exports = router;
