const router = require("express").Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/add", authenticated, createDepartment);
router.get("/getall", authenticated, getAllDepartments);
router.get("/get/:id", authenticated, getDepartmentById);
router.put("/update/:id", authenticated, updateDepartment);
router.delete("/delete/:id", authenticated, deleteDepartment);

module.exports = router;
