const nodemailer = require('nodemailer');
const { TourEnquiry, Vendor, Quotation } = require('../models');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const dayjs = require('dayjs');
const axios = require('axios');
const { htmlToText } = require('html-to-text');
const cheerio = require("cheerio");

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || "kiran@hirinternational.com",
        pass: process.env.EMAIL_PASSWORD || "jcgd rasp rfka kjax"
    },
    tls: {
        rejectUnauthorized: false,
    },
    port: process.env.EMAIL_PORT || 465,
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
});

function hasQuillText(html) {
    if (!html) return false;
    const $ = cheerio.load(html);
    const text = $.text().trim();
    return text.length > 0;
}

module.exports.sendPackageEnquiryMailToVendor = async (req, res) => {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASSWORD)
    const EnquiryNo = req.params.EnquiryNo;
    let EnquiryDetails;
    try {
        EnquiryDetails = await TourEnquiry.findOne({
            where: { EnquiryNo }
        });

        if (!EnquiryDetails) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        EnquiryDetails.dataValues.revisionNotesShow = hasQuillText(EnquiryDetails.dataValues.revisionNotes);
        EnquiryDetails.dataValues.pickupDate = dayjs(EnquiryDetails.dataValues.pickupDate).format('DD/MM/YYYY');
        EnquiryDetails.dataValues.dropDate = dayjs(EnquiryDetails.dataValues.dropDate).format('DD/MM/YYYY');
        EnquiryDetails.dataValues.hotelDetails = EnquiryDetails.dataValues.hotelDetails || '[]';
        if (typeof EnquiryDetails.dataValues.hotelDetails === 'string') {
            EnquiryDetails.dataValues.hotelDetails = JSON.parse(EnquiryDetails.dataValues.hotelDetails);
        }
        for (const hotel of EnquiryDetails.dataValues.hotelDetails) {
            hotel.checkIn = dayjs(hotel.checkIn).add(1, 'day').format('DD/MM/YYYY');
            hotel.checkOut = dayjs(hotel.checkOut).add(1, 'day').format('DD/MM/YYYY');
        }
        let rawScenes, parsedScenes;
        if (typeof EnquiryDetails.dataValues.siteScenes === 'string') {
            rawScenes = JSON.parse(EnquiryDetails.dataValues.siteScenes);
        } else {
            rawScenes = EnquiryDetails.dataValues.siteScenes || '[]';
        }
        if (typeof rawScenes === 'string') {
            try {
                parsedScenes = JSON.parse(rawScenes);
            } catch (e) {
                parsedScenes = [];
            }
        } else {
            parsedScenes = rawScenes;
        }


        let sceneMap = {};
        parsedScenes.forEach(val => {
            if (typeof val === 'string' && val.includes('__')) {
                const [siteSceneId, sceneName] = val.split('__');
                if (!sceneMap[siteSceneId]) sceneMap[siteSceneId] = [];
                sceneMap[siteSceneId].push(sceneName);
            }
        });

        let siteSceneArr = [];
        if (Object.keys(sceneMap).length) {
            const { SiteScene } = require('../models');
            const siteScenesFromDb = await SiteScene.findAll({ where: { id: Object.keys(sceneMap) } });
            siteSceneArr = siteScenesFromDb.map(ss => ({
                siteSceneName: ss.name,
                selectedScenes: sceneMap[ss.id] || []
            }));
        }
        EnquiryDetails.dataValues.sightScenes = siteSceneArr;
        let vendorIds;
        if (typeof EnquiryDetails.dataValues.vendors === 'string') {
            vendorIds = JSON.parse(EnquiryDetails.dataValues.vendors);
        } else if (Array.isArray(EnquiryDetails.dataValues.vendors)) {
            vendorIds = EnquiryDetails.dataValues.vendors;
        } else {
            return res.status(400).json({ message: 'Invalid vendor data format' });
        }
        const vendors = await Vendor.findAll({ where: { id: vendorIds } });
        if (!vendors.length) {
            return res.status(404).json({ message: 'No vendors found for this Enquiry' });
        }

        const templatePath = path.join(__dirname, '../email-templates/vendor-Enquiry.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);

        let sendResults = [];
        for (const vendor of vendors) {
            let contacts = [];
            try {
                contacts = typeof vendor.contacts === 'string' ? JSON.parse(vendor.contacts) : (vendor.contacts || []);
            } catch (e) {
                contacts = [];
            }

            // Convert Sequelize instance to plain object for Handlebars
            const vendorObj = vendor.get ? vendor.get({ plain: true }) : vendor;
            const html = template(EnquiryDetails.dataValues);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: contacts.find(c => c.emailType === 'primary')?.email || vendor.email,
                cc: contacts.filter(c => c.emailType === 'cc').map(c => c.email).filter(Boolean).join(', '),
                subject: `Package Summary Enquiry No. - ${EnquiryNo}`,
                html
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (err) {
                console.log(err)
            }
        }

        res.status(200).json({ message: 'Emails processed', results: [] });

    } catch (error) {

        res.status(500).json({ message: "Error sending email to vendor", error: error.message });
    }
}

module.exports.getPackageEnquiryMailPreviewToVendor = async (req, res) => {
    const EnquiryNo = req.params.EnquiryNo;
    let EnquiryDetails;
    try {
        EnquiryDetails = await TourEnquiry.findOne({
            where: { EnquiryNo }
        });
        EnquiryDetails.dataValues.revisionNotesShow = hasQuillText(EnquiryDetails.dataValues.revisionNotes);
        EnquiryDetails.dataValues.pickupDate = dayjs(EnquiryDetails.dataValues.pickupDate).format('DD/MM/YYYY');
        EnquiryDetails.dataValues.dropDate = dayjs(EnquiryDetails.dataValues.dropDate).format('DD/MM/YYYY');
        if (typeof EnquiryDetails.dataValues.hotelDetails === 'string') {
            EnquiryDetails.dataValues.hotelDetails = JSON.parse(EnquiryDetails.dataValues.hotelDetails);
        }
        for (const hotel of EnquiryDetails.dataValues.hotelDetails) {
            hotel.checkIn = dayjs(hotel.checkIn).add(1, 'day').format('DD/MM/YYYY');
            hotel.checkOut = dayjs(hotel.checkOut).add(1, 'day').format('DD/MM/YYYY');
        }
        let rawScenes, parsedScenes;
        if (typeof EnquiryDetails.dataValues.siteScenes === 'string') {
            rawScenes = JSON.parse(EnquiryDetails.dataValues.siteScenes);
        } else {
            rawScenes = EnquiryDetails.dataValues.siteScenes || '[]';
        }
        if (typeof rawScenes === 'string') {
            try {
                parsedScenes = JSON.parse(rawScenes);
            } catch (e) {
                parsedScenes = [];
            }
        } else {
            parsedScenes = rawScenes;
        }
        let sceneMap = {};
        parsedScenes.forEach(val => {
            if (typeof val === 'string' && val.includes('__')) {
                const [siteSceneId, sceneName] = val.split('__');
                if (!sceneMap[siteSceneId]) sceneMap[siteSceneId] = [];
                sceneMap[siteSceneId].push(sceneName);
            }
        });
        let siteSceneArr = [];
        if (Object.keys(sceneMap).length) {
            const { SiteScene } = require('../models');
            const siteScenesFromDb = await SiteScene.findAll({ where: { id: Object.keys(sceneMap) } });
            siteSceneArr = siteScenesFromDb.map(ss => ({
                siteSceneName: ss.name,
                selectedScenes: sceneMap[ss.id] || []
            }));
        }
        EnquiryDetails.dataValues.sightScenes = siteSceneArr;
        if (!EnquiryDetails) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        const templatePath = path.join(__dirname, '../email-templates/vendor-Enquiry.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const html = template(EnquiryDetails.dataValues);
        // just return the HTML content as response
        res.status(200).json({ html });
    } catch (error) {
        res.status(500).json({ message: "Error generating preview", error: error.message });
    }
}


module.exports.sendPackageEnquiryMailToCustomer = async (req, res) => {

    const EnquiryNo = req.params.EnquiryNo;
    let EnquiryDetails;
    try {
        EnquiryDetails = await TourEnquiry.findOne({
            where: { EnquiryNo }
        });
        EnquiryDetails.dataValues.revisionNotesShow = hasQuillText(EnquiryDetails.dataValues.revisionNotes);
        EnquiryDetails.dataValues.pickupDate = dayjs(EnquiryDetails.dataValues.pickupDate).format('DD/MM/YYYY');
        EnquiryDetails.dataValues.dropDate = dayjs(EnquiryDetails.dataValues.dropDate).format('DD/MM/YYYY');
        EnquiryDetails.dataValues.hotelDetails = EnquiryDetails.dataValues.hotelDetails || '[]';
        if (typeof EnquiryDetails.dataValues.hotelDetails === 'string') {
            EnquiryDetails.dataValues.hotelDetails = JSON.parse(EnquiryDetails.dataValues.hotelDetails);
        }
        for (const hotel of EnquiryDetails.dataValues.hotelDetails) {
            hotel.checkIn = dayjs(hotel.checkIn).add(1, 'day').format('DD/MM/YYYY')
            hotel.checkOut = dayjs(hotel.checkOut).add(1, 'day').format('DD/MM/YYYY')
        }
        let rawScenes = EnquiryDetails.dataValues.siteScenes || '[]';
        let parsedScenes = [];
        if (typeof rawScenes === 'string') {
            try {
                parsedScenes = JSON.parse(rawScenes);
            } catch (e) {
                parsedScenes = [];
            }
        } else {
            parsedScenes = rawScenes;
        }
        let sceneMap = {};
        parsedScenes.forEach(val => {
            if (typeof val === 'string' && val.includes('__')) {
                const [siteSceneId, sceneName] = val.split('__');
                if (!sceneMap[siteSceneId]) sceneMap[siteSceneId] = [];
                sceneMap[siteSceneId].push(sceneName);
            }
        });
        let siteSceneArr = [];
        if (Object.keys(sceneMap).length) {
            const { SiteScene } = require('../models');
            const siteScenesFromDb = await SiteScene.findAll({ where: { id: Object.keys(sceneMap) } });
            siteSceneArr = siteScenesFromDb.map(ss => ({
                siteSceneName: ss.name,
                selectedScenes: sceneMap[ss.id] || []
            }));
        }
        EnquiryDetails.dataValues.sightScenes = siteSceneArr;
        if (!EnquiryDetails) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }


        const templatePath = path.join(__dirname, '../email-templates/client-Enquiry.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);

        let contacts = [];

        const html = template(EnquiryDetails.dataValues);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: EnquiryDetails.dataValues.email,
            subject: `Thank you for Enquiry - ${EnquiryNo}`,
            html
        };

        try {
            await transporter.sendMail(mailOptions);

        } catch (err) {

            return res.status(500).json({ message: "Error sending email to customer", error: err.message });
        }

        res.status(200).json({ message: 'Emails processed', results: [] });

    } catch (error) {

        res.status(500).json({ message: "Error sending email to vendor", error: error.message });
    }
}

module.exports.sendPackageEnquiryMailWithQuotation = async (req, res) => {
    const quotationId = req.params.quotationId;
    let quotationDetails;
    try {
        quotationDetails = await Quotation.findOne({
            where: { id: quotationId },
            include: [{
                model: TourEnquiry,
            }]
        });

        if (!quotationDetails || !quotationDetails.TourEnquiry) {
            return res.status(404).json({ message: 'Quotation or related TourEnquiry not found' });
        }


        const pdfDownloadLink = `https://erp.hirinternational.com/api/pdf/${quotationId}?view=true`;

        const pdfUploadPath = path.join(__dirname, '../file/quotations', `${quotationDetails.TourEnquiry.EnquiryNo}/${quotationId}.pdf`);
        fs.mkdirSync(path.dirname(pdfUploadPath), { recursive: true });
        const response = await axios.get(pdfDownloadLink, { responseType: 'stream' });
        const writer = fs.createWriteStream(pdfUploadPath);
        response.data.pipe(writer);
        writer.on('finish', () => {

        });
        writer.on('error', (err) => {

        });

        const templatePath = path.join(__dirname, '../email-templates/quotation-summary.handlebars');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const data = {
            name: quotationDetails.TourEnquiry.name,
            quotationUrl: `https://erp.hirinternational.com/file/quotations/${quotationDetails.TourEnquiry.EnquiryNo}/${quotationId}.pdf`
        };
        const html = template(data);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: quotationDetails.TourEnquiry.email,
            subject: `Quotation - ${quotationDetails.TourEnquiry.EnquiryNo}`,
            html
        };

        try {
            await transporter.sendMail(mailOptions);

        } catch (err) {

            return res.status(500).json({ message: "Error sending email to customer", error: err.message });
        }

        res.status(200).json({ message: 'Emails processed', results: [] });

    } catch (error) {

        res.status(500).json({ message: "Error sending email to vendor", error: error.message });
    }
}

module.exports.sendWhatsAppUrl = async (req, res) => {
    const EnquiryNo = req.params.EnquiryNo;

    const Enquiry = await TourEnquiry.findOne({ where: { EnquiryNo } });
    if (!Enquiry) {
        return res.status(404).json({ message: 'Enquiry not found' });
    }
    const link = await generateWhatsAppLinkForPackage(Enquiry);
    res.json(link);
}

async function generateWhatsAppLinkForPackage(Enquiry) {
    if (!Enquiry || !Enquiry.contactNumber) return '';
    const phone = String(Enquiry.contactNumber).replace(/[^0-9]/g, '');
    let message = `*Package Enquiry Details*\n`;

    Enquiry.hotelDetails = Enquiry.hotelDetails || '[]';
    for (const hotel of Enquiry.hotelDetails) {
        hotel.checkIn = dayjs(hotel.checkIn).format('DD/MM/YYYY').locale('en-IN');
        hotel.checkOut = dayjs(hotel.checkOut).format('DD/MM/YYYY').locale('en-IN');

    }
    message += `Enquiry No: ${Enquiry.EnquiryNo || ''}\n`;
    message += `Tour Type: ${Enquiry.tourType || ''}\n`;
    message += `Name: ${Enquiry.name || ''}\n`;
    message += `Email: ${Enquiry.email || ''}\n`;
    message += `Contact: ${Enquiry.contactNumber || ''}\n\n`;
    message += `*Travel Details*\n`;
    message += `Destination: ${Enquiry.country || ''} ${Enquiry.state ? '(' + Enquiry.state + ')' : ''}\n`;
    message += `Pickup Location: ${Enquiry.pickupLocation || ''}\n`;
    message += `Pickup Date: ${Enquiry.pickupDate ? dayjs(Enquiry.pickupDate).format('DD/MM/YYYY') : ''}\n`;
    message += `Drop Location: ${Enquiry.dropLocation || ''}\n`;
    message += `Drop Date: ${Enquiry.dropDate ? dayjs(Enquiry.dropDate).format('DD/MM/YYYY') : ''}\n\n`;

    let rawScenes = Enquiry.siteScenes || '[]';
    let parsedScenes = [];
    if (typeof rawScenes === 'string') {
        try {
            parsedScenes = JSON.parse(rawScenes);
        } catch (e) {
            parsedScenes = [];
        }
    } else {
        parsedScenes = rawScenes;
    }
    let sceneMap = {};
    parsedScenes.forEach(val => {
        if (typeof val === 'string' && val.includes('__')) {
            const [siteSceneId, sceneName] = val.split('__');
            if (!sceneMap[siteSceneId]) sceneMap[siteSceneId] = [];
            sceneMap[siteSceneId].push(sceneName);
        }
    });
    let siteSceneArr = [];
    if (Object.keys(sceneMap).length) {
        const { SiteScene } = require('../models');
        const siteScenesFromDb = await SiteScene.findAll({ where: { id: Object.keys(sceneMap) } });
        siteSceneArr = siteScenesFromDb.map(ss => ({
            siteSceneName: ss.name,
            selectedScenes: sceneMap[ss.id] || []
        }));
    }

    message += `*Site Scenes*\n`;

    siteSceneArr.forEach(scene => {
        message += `${scene.siteSceneName}\n`;
        if (scene.selectedScenes && scene.selectedScenes.length) {
            scene.selectedScenes.forEach(s => {
                message += `  - ${s}\n`;
            });
        }
    });

    if (typeof Enquiry.hotelDetails === 'string') {
        Enquiry.hotelDetails = JSON.parse(Enquiry.hotelDetails);
    }
    message += `\n*Hotel Details*\n`;
    Enquiry.hotelDetails.forEach((hotel, idx) => {
        message += `\n`;
        message += `City: ${hotel.city || ''}\n`;
        message += `  - Category: ${hotel.hotelCategory || ''}\n`;
        message += `  - CheckIn: ${hotel.checkIn ? dayjs(hotel.checkIn).add(1, 'day').format('DD/MM/YYYY') : ''}\n`;
        message += `  - CheckOut: ${hotel.checkOut ? dayjs(hotel.checkOut).add(1, 'day').format('DD/MM/YYYY') : ''}\n`;
        message += `  - Nights: ${hotel.nights || ''}\n`;
    });

    const encodedMsg = encodeURIComponent(message);

    return `https://web.whatsapp.com/send/?phone=${phone}&text=${encodedMsg}&type=phone_number&app_absent=0`;
}

module.exports.sendQuotationWhatsAppMessage = async (req, res) => {
    let message = '';
    const quotationId = req.params.quotationId;
    try {
        const quotation = await Quotation.findByPk(quotationId);
        if (!quotation) {
            return res.status(404).send('Quotation not found');
        }

        const Enquiry = await TourEnquiry.findOne({
            where: { EnquiryNo: quotation.dataValues.EnquiryNo }
        });
        const pdfDownloadLink = `https://erp.hirinternational.com/api/pdf/${quotationId}?view=true`;

        const pdfUploadPath = path.join(__dirname, '../file/quotations', `${quotation.dataValues.EnquiryNo}/${quotationId}.pdf`);
        fs.mkdirSync(path.dirname(pdfUploadPath), { recursive: true });
        const response = await axios.get(pdfDownloadLink, { responseType: 'stream' });
        const writer = fs.createWriteStream(pdfUploadPath);
        response.data.pipe(writer);
        writer.on('finish', () => {

        });
        writer.on('error', (err) => {

        });
        message += `Thank you ${Enquiry.name} for making an Enquiry about ${Enquiry.tourType} Tour.\nHere we have sent you a quotation for your Enquiry.\nFor any help pls call on. +91 99788 11180 or replay with your query..\nThank you.\nPackage Team.\nHir International LLP.\n Click Below link to open Quotation https://erp.hirinternational.com/file/quotations/${quotation.dataValues.EnquiryNo}/${quotationId}.pdf`;
        const encodedMsg = encodeURIComponent(message);
        res.status(200).send(`https://web.whatsapp.com/send/?phone=${Enquiry.contactNumber}&text=${encodedMsg}&type=phone_number&app_absent=0`);
    } catch (error) {

    }
}

module.exports.generateWhatsAppLink = generateWhatsAppLinkForPackage;