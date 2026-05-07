const { IncentiveModal, Visa, IncentiveSettingsModal, Employee, AirTicketModal, VisaTravellersModal } = require("../models");
const dayjs = require("dayjs");
const { Op } = require("sequelize");

exports.getAllIncentives = async (req, res) => {
    try {
        const isAdmin = req.user && req.user.userType === 'master';
        const whereClause = isAdmin ? {} : { employeeId: req.user.id };
        
        const incentives = await IncentiveModal.findAll({
            where: whereClause,
            include: [{ model: Employee, as: 'employee' }],
            order: [['monthYear', 'DESC']]
        });
        res.status(200).json({ data: incentives });
    } catch (error) {
        console.error("Error fetching incentives:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getCalculationOfVisaIncentive = async (req, res) => {

    let allTravellers = [];
    let approvedTravellers = [];

    try {
        const { monthYear, employee } = req.body;
        if (!monthYear) {
            return res.status(400).json({ message: "monthYear query parameter is required" });
        }
        const visas = await Visa.findAll({
            where: {
                userId: employee,
                clientPaymentStatus: 'Paid',
                clientPaymentDate: {
                    [Op.gte]: dayjs(monthYear).startOf('month').toDate(),
                    [Op.lte]: dayjs(monthYear).endOf('month').toDate(),
                },
            }
        });

        for (const visa of visas) {
            approvedTravellers = approvedTravellers.concat(visa);
        }

        // nearest inventive setting
        const incentiveSettings = await IncentiveSettingsModal.findAll();
        const nearestIncentiveSetting = incentiveSettings.reduce((nearest, setting) => {
            const settingDate = dayjs(setting.monthYear);
            if (settingDate.isAfter(dayjs(monthYear).endOf('month'))) return nearest;
            if (!nearest || settingDate.isAfter(dayjs(nearest.monthYear))) {
                return setting;
            }
            return nearest;
        }, null);


        res.status(200).json({ data: approvedTravellers, incentiveSettings: nearestIncentiveSetting });
    } catch (error) {
        console.error("Error calculating visa incentive:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getCalculationOfAirTicketIncentive = async (req, res) => {
    let totalSc = 0;
    let approvedTickets = [];

    try{
        const { monthYear, employee } = req.body;
        console.log("Request Body:", req.body); // Debugging line
        if(!monthYear){
            return res.status(400).json({ message: "monthYear query parameter is required" });
        }
        const tickets = await AirTicketModal.findAll({
            where: {
                userId: employee,
                dateOfTravel: {
                    [Op.gte]: dayjs(monthYear).startOf('month').toDate(),
                    [Op.lte]: dayjs(monthYear).endOf('month').toDate(),
                },
                paymentStatus: {
                    [Op.in]: ['refunded', 'received']
                },
            }
        });
        const incentiveSettings = await IncentiveSettingsModal.findAll();
        const nearestIncentiveSetting = incentiveSettings.reduce((nearest, setting) => {
            const settingDate = dayjs(setting.monthYear);
            if (settingDate.isAfter(dayjs(monthYear).endOf('month'))) return nearest;
            if (!nearest || settingDate.isAfter(dayjs(nearest.monthYear))) {
                return setting;
            }
            return nearest;
        }, null);
        for(const ticket of tickets){
            totalSc += parseFloat(ticket.totalSc) || 0;
        }
        res.status(200).json({ data: tickets, incentiveSettings: nearestIncentiveSetting, totalSc  });
    } catch (error) {
        console.error("Error calculating air ticket incentive:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.createIncentive = async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line
    try {
        
        const newIncentive = await IncentiveModal.create(req.body);
        res.status(201).json({ message: "Incentive created successfully", data: newIncentive });
    } catch (error) {
        console.error("Error creating incentive:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, monthYear, incentiveAmount, status, paidDate, paymentMode, remark } = req.body;

        const incentive = await IncentiveModal.findByPk(id);
        if (!incentive) {
            return res.status(404).json({ message: "Incentive not found" });
        }

  
    if (type !== undefined) incentive.type = type;
    if (monthYear !== undefined) incentive.monthYear = monthYear;
    if (incentiveAmount !== undefined) incentive.incentiveAmount = incentiveAmount;
    if (status !== undefined) incentive.status = status;
    // Optional paid fields
    if (paidDate !== undefined) incentive.paidDate = paidDate;
    if (paymentMode !== undefined) incentive.paymentMode = paymentMode;
    if (remark !== undefined) incentive.remark = remark;

        await incentive.save();
        res.status(200).json({ message: "Incentive updated successfully", data: incentive });
    } catch (error) {
        console.error("Error updating incentive:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const incentive = await IncentiveModal.findByPk(id);
        if (!incentive) {
            return res.status(404).json({ message: "Incentive not found" });
        }
        await incentive.destroy();
        res.status(200).json({ message: "Incentive deleted successfully" });
    } catch (error) {
        console.error("Error deleting incentive:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
