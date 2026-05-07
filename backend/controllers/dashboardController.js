const { Lead, Visa, Passport, AirTicketModal, TourEnquiry, Quotation } = require('../models');

module.exports.getDashboardData = async (req, res) => {
    try {
        const totalLeads = await Lead.count();
        const totalVisas = await Visa.count();
        const totalPassports = await Passport.count();
        const totalAirTickets = await AirTicketModal.count();
        const totalTourEnquiries = await TourEnquiry.count();
        const totalQuotations = await Quotation.count();

        // Get latest 5 passports
        const recentPassportsRaw = await Passport.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        const recentPassports = recentPassportsRaw.map(passport => ({
            id: passport.id,
            name: passport.name,
            passport_number: passport.passport_number,
            createdAt: passport.createdAt,
            status: passport.status,
            passportCategory: passport.passportCategory,
            type: passport.type,
            country: passport.country,
        }));

        // Fetch all passports to compute upcoming appointments, expiring and expired
        const allPassports = await Passport.findAll();
        const today = new Date();

        const upcomingPassportAppointments = [];
        const expiringPassports = [];
        const expiredPassports = [];

        allPassports.forEach(passport => {
            // Upcoming appointments
            if (Array.isArray(passport.renewProcess)) {
                passport.renewProcess.forEach(step => {
                    if (step.appointmentDate && new Date(step.appointmentDate) > today) {
                        const appointmentDateObj = new Date(step.appointmentDate);
                        const daysRemaining = Math.ceil((appointmentDateObj - today) / (1000 * 60 * 60 * 24));
                        upcomingPassportAppointments.push({
                            passportId: passport.id,
                            name: passport.name,
                            passport_number: passport.passport_number,
                            appointmentDate: step.appointmentDate,
                            daysRemaining,
                            description: step.description || '',
                            status: step.status || '',
                            createdAt: step.createdAt || null
                        });
                    }
                });
            }

            // Expiring or expired
            if (passport.expiryDate) {
                const expiryDate = new Date(passport.expiryDate);
                const daysToExpire = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                if (daysToExpire >= 0 && daysToExpire <= 30) {
                    expiringPassports.push({
                        passportId: passport.id,
                        name: passport.name,
                        passport_number: passport.passport_number,
                        expiryDate: passport.expiryDate,
                        daysRemaining: daysToExpire
                    });
                } else if (daysToExpire < 0) {
                    expiredPassports.push({
                        passportId: passport.id,
                        name: passport.name,
                        passport_number: passport.passport_number,
                        expiryDate: passport.expiryDate,
                        daysOverdue: Math.abs(daysToExpire)
                    });
                }
            }
        });

        // Sort the lists
        upcomingPassportAppointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        expiringPassports.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        expiredPassports.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        // Final response
        res.status(200).json({
            data: {
                counts: {
                    totalLeads,
                    totalVisas,
                    totalPassports,
                    totalAirTickets,
                    totalTourEnquiries,
                    totalQuotations,
                    expiringPassportCount: expiringPassports.length,
                    expiredPassportCount: expiredPassports.length
                },
                recentPassports,
                upcomingPassportAppointments,
                expiringPassports,
                expiredPassports
            },
            message: "Dashboard data fetched successfully"
        });

    } catch (error) {

        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};
