const { SiteScene } = require("../models");

// Create a new SiteScene
const createSiteScene = async (req, res) => {
  
  try {
    const { scenes, siteName, ...rest } = req.body;
    const userId = req.user.id;
    const siteScene = await SiteScene.create({
      userId,
      name: siteName,
      sceneName: scenes,
      ...rest,
    });
    res
      .status(201)
      .json({ data: siteScene, message: "Site scene created successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Error creating site scene", error });
  }
};

// Get all SiteScenes
const getAllSiteScenes = async (req, res) => {
  try {
    const siteScenes = await SiteScene.findAll();
    res
      .status(200)
      .json({ data: siteScenes, message: "Site scenes fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching site scenes", error });
  }
};



// Get a SiteScene by ID
const getSiteSceneById = async (req, res) => {
  try {
    const siteScene = await SiteScene.findByPk(req.params.id);
    if (!siteScene) {
      return res.status(404).json({ message: "Site scene not found" });
    }
    res
      .status(200)
      .json({ data: siteScene, message: "Site scene fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching site scene", error });
  }
};

const getSiteSceneByIdsForPdf = async (ids) => {
  // If ids is a stringified array, parse it
  if (typeof ids === 'string') {
    try {
      ids = JSON.parse(ids);
    } catch (e) {
      throw new Error("IDs must be an array or a valid JSON array string");
    }
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid or empty IDs array provided");
  }
  // Sequelize expects an array for Op.in
  try {
    const siteScenes = await SiteScene.findAll({
      where: {
        id: ids.length === 1 ? ids[0] : ids,
      },
    });
    return siteScenes;
  } catch (error) {
    
    throw error;
  }
}

// Update a SiteScene by ID
const updateSiteScene = async (req, res) => {
  
  try {
    const { scenes, siteName, ...rest } = req.body;
    const userId = req.user.id;
    
    const updateData = {
      name: req.body.city,
      siteType: req.body.siteType,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      sceneName: req.body.scenes,
      userId,
    };
    
    const [updated] = await SiteScene.update(updateData, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: "Site scene not found" });
    }
    const updatedScene = await SiteScene.findByPk(req.params.id);
    res
      .status(200)
      .json({ data: updatedScene, message: "Site scene updated successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Error updating site scene", error });
  }
};

// Delete a SiteScene by ID
const deleteSiteScene = async (req, res) => {
  try {
    const deleted = await SiteScene.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Site scene not found" });
    }
    res.status(200).json({ message: "Site scene deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting site scene", error });
  }
};

module.exports = {
  createSiteScene,
  getAllSiteScenes,
  getSiteSceneById,
  updateSiteScene,
  deleteSiteScene,
  getSiteSceneByIdsForPdf
};
