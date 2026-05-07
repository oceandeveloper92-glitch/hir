const { Visa } = require("../models");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer")


handlebars.registerHelper('multiply', function (a, b) {
  return (a * b).toFixed(2);
});

const createVisa = async (req, res) => {
  try {
    const data = req.body;
    const now = moment();

    const statusEntry = {
      status: data.status || "Pending",
      date: now.format("DD-MM-YYYY"),
      time: now.format("hh:mm:ss A"),
      remark: data.remarks || "",
    };

    const newVisa = await Visa.create({
      ...data,
      userId: data.userId || req.user?.id,
      status: statusEntry.status,
      statusHistory: [statusEntry],
    });

    res.status(201).json({ message: "Visa created", data: newVisa });
  } catch (err) {

    res.status(500).json({ message: "Failed to create visa" });
  }
};

const getAllVisas = async (req, res) => {
  try {
    const { VisaTravellers } = require("../models");
    const { sequelize } = require("../config/db");

    const visas = await Visa.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM visa_travellers
              WHERE visa_travellers.visaId = Visa.id
            )`),
            'travellerCount'
          ]
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: "Visa applications retrieved successfully",
      data: visas,
    });
  } catch (error) {
    console.error("Error fetching visa applications:", error);
    res.status(500).json({ message: "Error fetching visa applications" });
  }
};

const getVisaById = async (req, res) => {
  const { id } = req.params;

  try {
    const { sequelize } = require("../config/db");

    const visa = await Visa.findByPk(id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM visa_travellers
              WHERE visa_travellers.visaId = Visa.id
            )`),
            'travellerCount'
          ]
        ]
      }
    });

    if (!visa) {
      return res.status(404).json({ message: "Visa application not found" });
    }
    res.status(200).json({
      message: "Visa application found",
      data: visa,
    });
  } catch (error) {
    console.error("Error fetching visa application:", error);
    res.status(500).json({ message: "Error fetching visa application" });
  }
};

const updateVisa = async (req, res) => {
  const { id } = req.params;


  try {

    const visa = await Visa.findByPk(id);
    if (!visa) {
      return res.status(404).json({ message: "Visa application not found." });
    }

    visa.update(req.body);
    await visa.save();
    return res.status(200).json({
      message: "Visa updated successfully.",
      data: visa,
    });
  } catch (err) {

    return res.status(500).json({
      message: "Failed to update visa. Please try again later.",
    });
  }
};

const deleteVisa = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the visa application by ID
    const visa = await Visa.findByPk(id);

    if (!visa) {
      return res.status(404).json({ message: "Visa application not found" });
    }

    // Delete the visa application
    await visa.destroy();

    res.status(200).json({
      message: "Visa application deleted successfully",
    });
  } catch (error) {

    res.status(500).json({ message: "Error deleting visa application" });
  }
};

const sendEmailToClient = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await Visa.findOne({ where: { id } });
    if (!visa) {
      return res.status(404).json({ message: "Visa application not found." });
    }

    const gst = (parseFloat(visa.serviceCharge) * 0.18).toFixed(2);

    const templatePath = path.join(__dirname, '../email-templates/visa-summary.handlebars');
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSource);

    const html = template({
      fullName: visa.fullName,
      passportNumber: visa.passportNumber,
      email: visa.email,
      phone: visa.phone,
      referenceBy: visa.referenceBy,
      countryName: visa.countryName,
      visaType: visa.visaType,
      visaMode: visa.visaMode,
      category: visa.category,
      vfsPayment: visa.vfsPayment,
      visaFees: visa.visaFees,
      serviceCharge: visa.serviceCharge,
      gst: gst,
      total: visa.total,
      companyName: visa.companyName,
      remark: visa.remark,
      timeLine: JSON.parse(visa.timeLine || "[]"),
      courierCharge: visa.courierCharge,
      travelers: JSON.parse(visa.travelers || "[]"),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // ✅ Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: visa.email,
      subject: `Visa Application Summary - ${visa.countryName}`,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {

    return res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
};

const sendWhatsappMessageLink = async (req, res) => {
  console.log("Generating Visa WhatsApp message link...");
  try {
    const visa = await Visa.findOne({ where: { id: req.params.id } });
    if (!visa) {
      return res.status(404).json({ message: "Visa application not found." });
    }
    console.log("Visa application found:", visa);
    // ✅ Parse travelers and timeline
    const travelers = JSON.parse(visa.travelers || "[]");
    const timeLine = JSON.parse(visa.timeLine || "[]");

    // ✅ Format Travelers List
    // ✅ Format Travelers List (pretty print)
    const travelerDetails = travelers.map((t, index) => {
      return `${index + 1}. ${t.name}\n   - Passport: ${t.passportNumber}\n   - Phone: ${t.phoneNumber}\n`;
    }).join("\n");


    // ✅ Format Timeline
    const timelineDetails = timeLine.map((t, index) => {
      return `${index + 1}. ${t.date} - ${t.status} ${t.remark}`;
    }).join("\n");

    // ✅ Build WhatsApp message
    const whatsappMessage = `
Hello ${visa.fullName},

Here are your visa application details:

📌 *Basic Info*
- Country: ${visa.countryName}
- Visa Type: ${visa.visaType} (${visa.visaMode})
- Category: ${visa.category} ${visa.remark ? `\n- Remark: ${visa.remark}` : ""}
- Passport Number: ${visa.passportNumber}
${travelers.length > 0 ? `\n🧍 *Applicants* \n` : ""}${travelers.length > 0 ? travelerDetails : ""}
${timeLine.length > 0 ? `🕒 *Application Timeline* \n` : ""}${timeLine.length > 0 ? timelineDetails : ""}

📄 *Bill To*
- Email: ${visa.email}
- Phone: ${visa.phone}
- Company: ${visa.companyName}
- City: ${visa.cityName}
- GST Number: ${visa.gstNumber || 'N/A'}

💰 *Charges (Per Person)*
- VFS Payment: ${visa.vfsPayment} INR
- Visa Charges (approx value): ${visa.visaFees} INR
- Service Charge: ${visa.serviceCharge} INR
- Courier Charge: ${visa.courierCharge} INR
- Total: ${visa.total} INR

If you have any questions, feel free to reach out to us.

Thank you,
Visa Support Team`;

    // ✅ Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://web.whatsapp.com/send/?phone=${visa.phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    return res.status(200).json({
      message: "WhatsApp message link generated successfully",
      link: whatsappLink
    });
  } catch (error) {

    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



module.exports = {
  createVisa,
  getAllVisas,
  getVisaById,
  updateVisa,
  deleteVisa,
  sendEmailToClient,
  sendWhatsappMessageLink
};
