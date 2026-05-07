const dayjs = require("dayjs");
const { Op } = require("sequelize");

const calculateAndUpdateIncentive = async (employeeId, dateStr) => {
    if (!employeeId || !dateStr) return;
    try {
        const { IncentiveModal, AirTicketModal, IncentiveSettingsModal } = require("../models");
        
        const targetMonth = dayjs(dateStr).startOf('month');
        const monthYearStr = targetMonth.format('YYYY-MM-01');

        // 1. Fetch nearest applicable settings
        const settings = await IncentiveSettingsModal.findAll();
        const nearestSetting = settings.reduce((nearest, setting) => {
            const settingDate = dayjs(setting.monthYear).startOf('month');
            if (settingDate.isAfter(targetMonth)) return nearest; // Must be equal or before
            if (!nearest || settingDate.isAfter(dayjs(nearest.monthYear))) {
                return setting;
            }
            return nearest;
        }, null);

        if (!nearestSetting) return; // No config, no incentive

        // 2. Visa calculation - each visa = 1 file (the client is the traveller)
        const { Visa } = require("../models");
        const visaCount = await Visa.count({
            where: {
                userId: employeeId,
                clientPaymentStatus: 'Paid',
                clientPaymentDate: {
                    [Op.gte]: targetMonth.toDate(),
                    [Op.lte]: targetMonth.endOf('month').toDate(),
                },
            }
        });

        const visaFiles = visaCount;
        const minVisaFiles = nearestSetting.minimumFileCount || 0;
        const perFileAmount = parseFloat(nearestSetting.visaIncentivePerFileAmount) || 0;
        let visaIncentive = 0;
        if (visaFiles >= minVisaFiles) {
            visaIncentive = visaFiles * perFileAmount;
        }

        // 3. Air Ticket calculation
        const tickets = await AirTicketModal.findAll({
            where: {
                userId: employeeId,
                dateOfTravel: {
                    [Op.gte]: targetMonth.toDate(),
                    [Op.lte]: targetMonth.endOf('month').toDate(),
                },
                paymentStatus: {
                    [Op.in]: ['received', 'refunded']
                },
            }
        });

        let airTicketSales = 0;
        for (const ticket of tickets) {
            airTicketSales += parseFloat(ticket.totalSc) || 0;
        }

        const airBase = parseFloat(nearestSetting.airTicketBaseAmount) || 0;
        const airPercent = parseFloat(nearestSetting.airTicketIncentivePercentage) || 0;
        let airTicketIncentive = 0;
        if (airTicketSales > airBase) {
            airTicketIncentive = (airTicketSales - airBase) * (airPercent / 100);
        }
        
        const totalIncentive = visaIncentive + airTicketIncentive;

        const [existingIncentive, created] = await IncentiveModal.findOrCreate({
            where: {
                employeeId: employeeId,
                monthYear: monthYearStr
            },
            defaults: {
                airTicketSales,
                visaFiles,
                airTicketIncentive,
                visaIncentive,
                totalIncentive,
                status: 'Pending'
            }
        });

        if (!created && existingIncentive) {
            await existingIncentive.update({
                airTicketSales,
                visaFiles,
                airTicketIncentive,
                visaIncentive,
                totalIncentive
            });
        }
    } catch (error) {
        console.error("Error calculating auto incentive:", error);
    }
};

module.exports = { calculateAndUpdateIncentive };
