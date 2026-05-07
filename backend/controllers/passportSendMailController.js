
const nodemailer = require('nodemailer');
const { Passport } = require('../models');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const dayjs = require('dayjs');
const axios = require('axios');

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

module.exports.sendPassportMailToUser = async (req, res) => {
    const passportId = req.params.passportId;
    let passportDetails;
    try {
        passportDetails = await Passport.findOne({
            where: { id: passportId }
        });

        if (!passportDetails) {
            return res.status(404).json({ message: 'Passport not found' });
        }

        passportDetails.dataValues.issueDate = dayjs(passportDetails.dataValues.issueDate).format('DD/MMMM/YYYY');
        passportDetails.dataValues.expiryDate = dayjs(passportDetails.dataValues.expiryDate).format('DD/MMMM/YYYY');
        passportDetails.dataValues.renewProcess = passportDetails.dataValues.renewProcess;
        const templatePath = path.join(__dirname, '../email-templates/passport-new.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateSource);

        const emailContent = template(passportDetails.dataValues);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: passportDetails.email,
            subject: 'Passport Notification',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports.sendPassportMailToUserRenewal = async (req, res) => {
    const passportId = req.params.passportId;
    let passportDetails;
    try {
        passportDetails = await Passport.findOne({
            where: { id: passportId }
        });


        if (!passportDetails) {
            return res.status(404).json({ message: 'Passport not found' });
        }

        passportDetails.dataValues.issueDate = dayjs(passportDetails.dataValues.issueDate).format('DD/MM/YYYY').locale('en');
        passportDetails.dataValues.expiryDate = dayjs(passportDetails.dataValues.expiryDate).format('DD/MM/YYYY').locale('en');
        passportDetails.dataValues.renewProcess = passportDetails.dataValues.renewProcess;
        const templatePath = path.join(__dirname, '../email-templates/passport-renewal.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateSource);

        const emailContent = template(passportDetails.dataValues);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: passportDetails.email,
            subject: 'Passport Renewal Notification',
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);


        res.status(200).json({ message: 'Renewal email sent successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
}



