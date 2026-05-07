const {
  Lead,
  Employee,
  User,
  TourEnquiry,
  Quotation,
} = require("../models");
const dayjs = require("dayjs");
// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    // Filter by userId if user is not master
    // Check if user has master permissions
    const isMaster = req.user?.permissions?.isMaster === true;
    const whereClause = isMaster ? {} : { userId: req.user.id };

    const leads = await Lead.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
        },
        // ORDER by date in descending order
      ],
      order: [["createdAt", "DESC"]],
    });
    res
      .status(200)
      .json({ data: leads, message: "All Leads fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.createLead = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by authentication middleware
  try {
    const {
      name,
      email,
      phone,
      source,
      status,
      remarks,
      date,
      assignedTo,
      userId,
      leadType,
      referenceBy,
    } = req.body;

    req.body.date = date
      ? dayjs(date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    req.body.userId = req.user.id;

    const newLead = await Lead.create(req.body);

    if (leadType && leadType.toLowerCase() === "passport") {
      const { Passport } = require("../models");
      await Passport.create({
        email: req.body.email || "",
        passport_number: req.body.passportNumber || "",
        type: req.body.passportType == "Reissue Passport" ? "Reissue" : "New",
        passportCategory: req.body.passportCategory || "",
        country: req.body.passportCountry || "",
        issueDate: req.body.passportIssueDate || null,
        expiryDate: req.body.passportExpiryDate || null,
        name: name,
        referenceBy: req.body.referenceBy || "",
        status: "Under Processing",
        userId: req.user.id,
      });
    }
    if (leadType && leadType.toLowerCase() === "air ticket") {
      const { AirTicketModal } = require("../models");
      await AirTicketModal.create({
        name,
        email,
        phone,
        userId: req.user.id,
      });
    }
    if (leadType && leadType.toLowerCase() === "visa") {
      const { Visa } = require("../models");
      await Visa.create({
        fullName: name,
        passportNumber: req.body.passportNumber,
        email: email,
        phone: phone,
        countryName: req.body.country || "",
        referenceBy: req.body.referenceBy || "",
        userId: req.user.id,
        // [{"key":1757705139535,"name":"Bhavy","passportNumber":"sdjljsdf","phoneNumber":"6355577329","status":"Pending"}]
        travelers: [
          {
            key: Date.now(),
            name,
            passportNumber: req.body.passportNumber || "",
            phoneNumber: phone,
            status: "Pending",
          },
        ],
      });
    }

    if (leadType && leadType.toLowerCase() === "package") {
      const tourEnquiry = await TourEnquiry.create({
        name,
        email,
        contactNumber: phone,
        country: req.body.country || "",
        referenceBy: req.body.referenceBy || "",
        leadId: newLead.id,
        userId: req.user.id,
      });
      const quotation = await Quotation.create({
        id: tourEnquiry.id,
        EnquiryNo: tourEnquiry.EnquiryNo,
        name: tourEnquiry.name,
        contactNumber: tourEnquiry.contactNumber,
        userId: req.user.id,
        leadId: newLead.id,
      });
      if (!quotation) {
        return res
          .status(400)
          .json({ message: "Failed to create quotation for tour Enquiry" });
      }
    }
    res
      .status(201)
      .json({ data: newLead, message: "Lead created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getLeadById = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findOne({
      where: { id },
      include: [
        {
          model: Employee,
          as: "assignedTo",
        },
        {
          model: User,
          as: "userId",
        },
      ],
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ data: lead, message: "Lead fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.reassignLead = async (req, res) => {
  const { id } = req.params;
  const { assignedTo, leadType } = req.body;
  try {
    const lead = await Lead.findOne({ where: { id } });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    lead.assignedTo = assignedTo;
    await lead.save();

    if (leadType && leadType.toLowerCase() === "passport") {
      const { Passport } = require("../models");
      await Passport.update({ userId: assignedTo }, { where: { leadId: id } });
    }
    if (leadType && leadType.toLowerCase() === "air ticket") {
      const { AirTicketModal } = require("../models");
      await AirTicketModal.update(
        { userId: assignedTo },
        { where: { leadId: id } }
      );
    }
    if (leadType && leadType.toLowerCase() === "visa") {
      const { Visa } = require("../models");
      await Visa.update({ userId: assignedTo }, { where: { leadId: id } });
    }
    if (leadType && leadType.toLowerCase() === "package") {
      const { TourEnquiry, Quotation } = require("../models");
      await TourEnquiry.update(
        { userId: assignedTo },
        { where: { leadId: id } }
      );
      await Quotation.update({ userId: assignedTo }, { where: { leadId: id } });
    }

    res
      .status(200)
      .json({ data: lead, message: "Lead reassigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.updateLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findOne({ where: { id } });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    await lead.update(req.body);
    res.status(200).json({ data: lead, message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findOne({ where: { id } });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.destroy();
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
