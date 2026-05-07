const { LayoutSetting } = require("../models");

const getLayoutSetting = async (req, res) => {
  const { role, page, userId } = req.query;
  console.log('GET LayoutSetting:', { role, page, userId });

  if (!page || (!role && !userId)) {
    return res.status(400).json({ message: "Role/UserId and page are required" });
  }

  try {
    let setting = null;
    if (userId) {
      setting = await LayoutSetting.findOne({ where: { userId, page } });
    }
    
    if (!setting && role) {
      setting = await LayoutSetting.findOne({ where: { role, page } });
    }

    console.log('Found setting:', setting ? 'YES' : 'NO');
    if (!setting) {
      return res.status(200).json({ settings: null });
    }
    res.status(200).json(setting);
  } catch (error) {
    console.error('GET LayoutSetting Error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const saveLayoutSetting = async (req, res) => {
  const { role, page, settings, userId } = req.body;
  console.log('SAVE LayoutSetting:', { role, page, settings, userId });

  if (!page || !settings || (!role && !userId)) {
    return res.status(400).json({ message: "Role/UserId, page, and settings are required" });
  }

  try {
    let setting = null;
    if (userId) {
      setting = await LayoutSetting.findOne({ where: { userId, page } });
    } else {
      setting = await LayoutSetting.findOne({ where: { role, page } });
    }

    if (setting) {
      setting.settings = settings;
      await setting.save();
      console.log('Updated existing setting');
    } else {
      setting = await LayoutSetting.create({ role, userId, page, settings });
      console.log('Created new setting');
    }

    res.status(200).json(setting);
  } catch (error) {
    console.error('SAVE LayoutSetting Error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getLayoutSetting,
  saveLayoutSetting,
};
