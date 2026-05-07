const { CampaignModal } = require("../models");
const dayjs = require("dayjs");

module.exports.createCampaign = async (req, res) => {
    try {
        const { title, description, startDate, endDate } = req.body;
    
        
        const newCampaign = await CampaignModal.create({
            title,
            description: description,
            dateFrom: dayjs(startDate).format("YYYY-MM-DD"),
            dateTo: dayjs(endDate).format("YYYY-MM-DD"),
            image: req.file ? req.file.path : null,
        });

        res.status(201).json({
            message: "Campaign created successfully",
            data: newCampaign,
        });
    } catch (error) {
        
        res.status(500).json({ message: "Error creating campaign", error });
    }
}


module.exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await CampaignModal.findAll();

        res.status(200).json({
            message: "Campaigns fetched successfully",
            data: campaigns,
        });
    } catch (error) {
        
        res.status(500).json({ message: "Error fetching campaigns", error });
    }
}


