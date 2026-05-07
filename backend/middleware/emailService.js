const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,  // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,      // Your Gmail address
    pass: process.env.EMAIL_PASSWORD,  // Your Gmail App Password or Gmail password (if 2FA disabled)
  },
  tls: {
    rejectUnauthorized: false,        // Important for Gmail's SSL/TLS
  },
  port: process.env.EMAIL_PORT || 465,  // Port 465 for Gmail with SSL
  host: process.env.EMAIL_HOST || "smtp.gmail.com", // SMTP server for Gmail
});

const sendEnquiryEmail = async (to, htmlContent, cc = [], subject = "Enquiry Summary") => {


  try {
    // Send email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,   // Sender email
      to: to,                        // Recipient email(s) (primary)
      cc: cc.length > 0 ? cc : undefined,  // Only include CC if there are any
      subject: subject || "Enquiry Summary", // Email subject
      html: htmlContent,              // Rendered HTML from Handlebars
    };

    await transporter.sendMail(mailOptions);


  } catch (error) {

    throw new Error("Failed to send email");
  }
};

module.exports = { sendEnquiryEmail };
