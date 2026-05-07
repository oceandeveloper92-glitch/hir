const { Vendor } = require("../models"); // Import the Vendor model

// Create a new Vendor
const createVendor = async (req, res) => {
  try {
    const {
      name,
      destination,
      state,
      country,
      status,
      email,
      phone,
      city,
      contactPerson,
      contacts,
      isHotelVendor,
    } = req.body;

    // Convert isHotelVendor to 1/0 for MySQL TINYINT(1)
    let isHotelVendorValue = 0; // Default to 0 (false)
    // console.log("isHotelVendor", isHotelVendor);
    if (isHotelVendor !== undefined && isHotelVendor !== null) {
      // Handle boolean, string "true"/"false", number 1/0
      if (
        isHotelVendor === true ||
        isHotelVendor === "true" ||
        isHotelVendor === 1 ||
        isHotelVendor === "1"
      ) {
        isHotelVendorValue = 1; // Explicitly set to 1 for MySQL
      } else {
        isHotelVendorValue = 0; // Explicitly set to 0 for MySQL
      }
    }

    // console.log(
    //   "Received isHotelVendor:",
    //   isHotelVendor,
    //   "Type:",
    //   typeof isHotelVendor,
    //   "Converted to:",
    //   isHotelVendorValue
    // );

    const newVendor = await Vendor.create({
      name,
      destination,
      country,
      state,
      city,
      status,
      email,
      phone,
      contactPerson,
      contacts,
      isHotelVendor: isHotelVendorValue,
    });

    res.status(201).json({
      message: "Vendor created successfully!",
      data: newVendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating vendor", error });
  }
};

// Get all Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res
      .status(200)
      .json({ data: vendors, message: "All Vendors fetched successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error });
  }
};

// Get a Vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res
      .status(200)
      .json({ data: vendor, message: "Vendor fetched successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor", error });
  }
};

// Update a Vendor
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      destination,
      city,
      state,
      country,
      status,
      email,
      phone,
      contactPerson,
      contacts,
      isHotelVendor,
    } = req.body;

    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Update the Vendor
    vendor.name = name || vendor.name;
    vendor.destination = destination || vendor.destination;
    vendor.state = state || vendor.state;
    vendor.country = country || vendor.country;
    vendor.city = city || vendor.city;
    vendor.status = status || vendor.status;
    vendor.email = email || vendor.email;
    vendor.phone = phone || vendor.phone;
    vendor.contactPerson = contactPerson || vendor.contactPerson;
    vendor.contacts = contacts || vendor.contacts;
    // Handle isHotelVendor - convert to 1/0 for MySQL TINYINT(1)
    if (isHotelVendor !== undefined && isHotelVendor !== null) {
      // Handle boolean, string "true"/"false", number 1/0
      if (
        isHotelVendor === true ||
        isHotelVendor === "true" ||
        isHotelVendor === 1 ||
        isHotelVendor === "1"
      ) {
        vendor.isHotelVendor = 1; // Explicitly set to 1 for MySQL
      } else {
        vendor.isHotelVendor = 0; // Explicitly set to 0 for MySQL
      }
      console.log(
        "Updating isHotelVendor:",
        isHotelVendor,
        "Type:",
        typeof isHotelVendor,
        "Setting to:",
        vendor.isHotelVendor
      );
    }

    await vendor.save();

    res.status(200).json({
      message: "Vendor updated successfully!",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating vendor", error });
  }
};

// Delete a Vendor
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Delete the Vendor
    await vendor.destroy();

    res.status(200).json({ message: "Vendor deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vendor", error });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
