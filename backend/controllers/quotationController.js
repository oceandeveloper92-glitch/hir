const { Quotation, TourEnquiry } = require("../models");
const { sequelize } = require("../config/db");

exports.getAllQuotations = async (req, res) => {
  try {
    const whereClause = req.user.userType === "employee" ? { userId: req.user.id } : {};
    const quotations = await Quotation.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });
    if (!quotations || quotations.length === 0) {
      return res.status(200).json({ message: "No quotations found" });
    }
    res.status(200).json({ data: quotations, message: "Quotations fetched successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: { id: req.params.id },
      order: [["createdAt", "DESC"]],
      include: [{ model: TourEnquiry }]
    });
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res
      .status(200)
      .json({ data: quotation, message: "Quotation fetched successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQuotationByIdForPdf = async (quotationId) => {
  try {
    const quotation = await Quotation.findOne({
      where: { EnquiryId: quotationId },
      order: [["createdAt", "DESC"]],

    });
    if (!quotation) {
      throw new Error("Quotation not found");
    }
    return quotation;
  } catch (error) {

    throw error;
  }
};

exports.createQuotation = async (req, res) => {

  const transaction = await sequelize.transaction();
  try {
    const { EnquiryNo } = req.body;
    console.log("📝 Creating quotation - EnquiryNo:", EnquiryNo);

    const existingQuotation = await Quotation.findOne({
      where: { EnquiryNo: EnquiryNo }
    });

    if (existingQuotation) {
      return res
        .status(400)
        .json({ message: "A quotation already exists for this Enquiry." });
    }

    const existingEnquiry = await TourEnquiry.findOne({
      where: { EnquiryNo: EnquiryNo },
    });

    if (!existingEnquiry) {
      return res.status(400).json({ message: "Enquiry not found." });
    }

    const quotation = await Quotation.create(
      { ...req.body },
    );
    await TourEnquiry.update(
      { quotationSubmit: "submitted" },
      { where: { EnquiryNo: EnquiryNo } }
    );
    await transaction.commit();

    res.status(201).json({
      data: quotation,
      message: "Quotation created and Enquiry status updated to submitted",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating quotation:", error);
    res.status(400).json({ message: "Error creating quotation", error: error.message });
  }
};

exports.updateQuotation = async (req, res) => {

  const { id } = req.params;

  console.log(id)
  const quotation = await Quotation.findOne({ where: { id: id } });
  if (!quotation) {
    return res.status(404).json({ message: "Quotation not found" });
  }
  try {
    await quotation.update(req.body);
  } catch (error) {

    res.status(400).json({ message: "Update failed", error });
  }
  res.status(200).json({ message: "Quotation updated successfully" });
};

exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    await quotation.destroy();
    res.status(204).send();
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.copyQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the quotation to copy
    const quotationToCopy = await Quotation.findOne({ where: { id: id } });
    if (!quotationToCopy) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const EnquiryNo = quotationToCopy.EnquiryNo;

    // Verify enquiry exists
    const Enquiry = await TourEnquiry.findOne({ where: { EnquiryNo: EnquiryNo } });
    if (!Enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const latestQuotation = quotationToCopy;

    if (!latestQuotation) {
      return res.status(404).json({ message: "No existing quotation to copy from" });
    }
    if (latestQuotation.flightDetails === null) {
      latestQuotation.flightDetails = '{}';
    }
    if (typeof latestQuotation.flightDetails === 'string' && latestQuotation.flightDetails !== null) {
      latestQuotation.flightDetails = JSON.parse(latestQuotation.flightDetails);
    }
    if (typeof latestQuotation.accommodationOptions === 'string' && latestQuotation.accommodationOptions !== null) {
      latestQuotation.accommodationOptions = JSON.parse(latestQuotation.accommodationOptions);
    }
    const newQuotation = await Quotation.create({
      ...latestQuotation.get({ plain: true }),
      id: undefined, // Reset ID for new record
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      data: newQuotation,
      message: "Quotation copied successfully",
    });
  } catch (error) {
    console.error("Error copying quotation:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getQuotationByEnquiryNo = async (req, res) => {
  try {
    const { EnquiryNo } = req.params;
    const quotation = await Quotation.findAll({
      where: { EnquiryNo: EnquiryNo },
      order: [["createdAt", "DESC"]],
    });
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found for this Enquiry" });
    }
    res.status(200).json({ data: quotation, message: "Quotation fetched successfully" });
  } catch (error) {

    res.status(500).json({ message: "Internal server error", error });
  }
}