const nodemailer = require('nodemailer');
const { Visa } = require('../models');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const dayjs = require('dayjs');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || "kiran@hirinternational.com",
        pass: process.env.EMAIL_PASSWORD || "jcgd rasp rfka kjax",
    },
    tls: {
        rejectUnauthorized: false,
    },
    port: process.env.EMAIL_PORT || 465,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
});

module.exports.sendVisaMailToUser = async (req, res) => {
    const visaId = req.params.visaId;
    let visaDetails;
    try {
        visaDetails = await Visa.findOne({
            where: { id: visaId }
        });

        if (!visaDetails) {
            return res.status(404).json({ message: 'Visa not found' });
        }



        visaDetails.dataValues.issueDate = dayjs(visaDetails.dataValues.issueDate).format('DD/MM/YYYY');
        visaDetails.dataValues.expiryDate = dayjs(visaDetails.dataValues.expiryDate).format('DD/MM/YYYY');
        visaDetails.dataValues.timeLine = visaDetails.dataValues.timeLine;
        const templatePath = path.join(__dirname, '../email-templates/visa-summary.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateSource);

        const emailContent = template(visaDetails.dataValues);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: visaDetails.email,
            subject: 'Visa Notification',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);


        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
}
