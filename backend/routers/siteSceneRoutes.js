const express = require("express");
const router = express.Router();
const {
  createSiteScene,
  getAllSiteScenes,
  getSiteSceneById,
  updateSiteScene,
  deleteSiteScene,
} = require("../controllers/siteSceneController");
const { authenticated } = require("../middleware/authMiddleware");

router.post("/add", authenticated, createSiteScene);
router.get("/getall", authenticated, getAllSiteScenes);
router.get("/get/:id", authenticated, getSiteSceneById);
router.put("/update/:id", authenticated, updateSiteScene);
router.delete("/delete/:id", authenticated, deleteSiteScene);

module.exports = router;
