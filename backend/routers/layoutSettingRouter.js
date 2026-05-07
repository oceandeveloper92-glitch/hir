const express = require("express");
const router = express.Router();
const { getLayoutSetting, saveLayoutSetting } = require("../controllers/layoutSettingController");

router.get("/", getLayoutSetting);
router.post("/", saveLayoutSetting);

module.exports = router;
