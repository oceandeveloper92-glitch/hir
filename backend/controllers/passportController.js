const { Passport } = require("../models");

// Create a new Passport
const createPassport = async (req, res) => {

  try {
    const userId = req.user.id;

    // Create passport with all fields from request body
    const newPassport = await Passport.create({
      ...req.body,
      userId,
      renewProcess: req.body.renewProcess || [], // Ensure renewProcess defaults to empty array
    });

    res.status(201).json({
      message: "Passport created successfully",
      data: newPassport,
    });
  } catch (error) {

    res.status(500).json({
      message: "An error occurred while creating the passport",
      error: error.message,
    });
  }
};

// Get all Passports
const getAllPassports = async (req, res) => {
  const whereClause = req.user.userType === 'master' ? {} : { userId: req.user.id };
  try {
    const passports = await Passport.findAll({
      where: whereClause,
    });
    res
      .status(200)
      .json({ data: passports, message: "All Passports fetched successfully" });
  } catch (error) {

    res.status(500).json({
      message: "An error occurred while fetching the passports",
      error: error.message,
    });
  }
};

// Get a single Passport by ID
const getPassportById = async (req, res) => {
  const { id } = req.params;
  try {
    const passport = await Passport.findByPk(id);
    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }
    res
      .status(200)
      .json({ data: passport, message: "Passport fetched successfully" });
  } catch (error) {

    res.status(500).json({
      message: "An error occurred while fetching the passport",
      error: error.message,
    });
  }
};

// Update a Passport
const updatePassport = async (req, res) => {
  const { id } = req.params;

  try {
    const passport = await Passport.findByPk(id);
    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }

    await passport.update(req.body);

    await passport.save();

    res.status(200).json({
      message: "Passport updated successfully",
      passport,
    });
  } catch (error) {

    res.status(500).json({
      message: "An error occurred while updating the passport",
      error: error.message,
    });
  }
};

// Delete a Passport
const deletePassport = async (req, res) => {
  const { id } = req.params;
  try {
    const passport = await Passport.findByPk(id);
    if (!passport) {
      return res.status(404).json({ message: "Passport not found" });
    }

    await passport.destroy();
    res.status(200).json({ message: "Passport deleted successfully" });
  } catch (error) {

    res.status(500).json({
      message: "An error occurred while deleting the passport",
      error: error.message,
    });
  }
};

module.exports = {
  createPassport,
  getAllPassports,
  getPassportById,
  updatePassport,
  deletePassport,
};
