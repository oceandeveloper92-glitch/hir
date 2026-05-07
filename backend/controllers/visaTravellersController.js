const { VisaTravellersModal, Visa } = require("../models");

exports.getAllVisaTravellers = async (req, res) => {
    try {
        const visaTravellers = await VisaTravellersModal.findAll();
        res.status(200).json({ data: visaTravellers });
    } catch (error) {
        console.error("Error fetching visa travellers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllVisaByVisaId = async (req, res) => {
    const { visaId } = req.params;
    try {
        const visaTravellers = await VisaTravellersModal.findAll({ where: { visaId } });
        res.status(200).json({ data: visaTravellers });
    } catch (error) {
        console.error("Error fetching visa travellers by visaId:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createVisaTraveller = async (req, res) => {
    try {
        const body = { ...req.body };
        // Auto-populate employeeId from the linked visa's userId if not provided
        if (!body.employeeId && body.visaId) {
            const visa = await Visa.findByPk(body.visaId, { attributes: ['userId'] });
            if (visa && visa.userId) {
                body.employeeId = visa.userId;
            }
        }
        const newVisaTraveller = await VisaTravellersModal.create(body);
        res.status(201).json({ data: newVisaTraveller });
    } catch (error) {
        console.error("Error creating visa traveller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getVisaTravellerById = async (req, res) => {
    const { id } = req.params;
    try {
        const visaTraveller = await VisaTravellersModal.findOne({ where: { id } });
        if (!visaTraveller) {
            return res.status(404).json({ message: "Visa traveller not found" });
        }
        res.status(200).json({ data: visaTraveller });
    } catch (error) {
        console.error("Error fetching visa traveller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateVisaTraveller = async (req, res) => {
    const { id } = req.params;
    try {
        const visaTraveller = await VisaTravellersModal.findOne({ where: { id } });
        if (!visaTraveller) {
            return res.status(404).json({ message: "Visa traveller not found" });
        }
        const updatedVisaTraveller = await visaTraveller.update(req.body);
        res.status(200).json({ data: updatedVisaTraveller });
    } catch (error) {
        console.error("Error updating visa traveller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteVisaTraveller = async (req, res) => {
    const { id } = req.params;
    try {
        const visaTraveller = await VisaTravellersModal.findOne({ where: { id } });
        if (!visaTraveller) {
            return res.status(404).json({ message: "Visa traveller not found" });
        }
        await visaTraveller.destroy();
        res.status(200).json({ message: "Visa traveller deleted successfully" });
    } catch (error) {
        console.error("Error deleting visa traveller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

