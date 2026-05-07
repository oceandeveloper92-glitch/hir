const cron = require("node-cron");
const { Op } = require("sequelize");
const { Notification, Passport, User } = require("../models");
const moment = require("moment");

// Run every minute for testing; adjust cron expression as needed for production
cron.schedule("* * * * *", async () => {
  try {
    const now = moment();

    // Include user info if you want to fetch related data; adjust as needed
    const includeUser = {
      model: User,
    };

    // Fetch passports expiring in next 30 days (not yet expired)
    const passportsToExpireSoon = await Passport.findAll({
      where: {
        expiryDate: {
          [Op.lte]: now.clone().add(30, "days").toDate(),
          [Op.gt]: now.toDate(),
        },
      },
      include: [includeUser],
    });

    // Passports expiring between 30 days and 6 months
    const passportsToExpireIn6Months = await Passport.findAll({
      where: {
        expiryDate: {
          [Op.lte]: now.clone().add(6, "months").toDate(),
          [Op.gt]: now.clone().add(30, "days").toDate(),
        },
      },
      include: [includeUser],
    });

    // Passports already expired
    const expiredPassports = await Passport.findAll({
      where: {
        expiryDate: {
          [Op.lt]: now.toDate(),
        },
      },
      include: [includeUser],
    });

    // Helper function to create or update notification
    const createOrUpdateNotification = async (passport, type, message) => {
      const existing = await Notification.findOne({
        where: {
          passportId: passport.id,
        },
      });
      if (existing) {
        // Update the message or updatedAt timestamp if you want
        await existing.update({ message });
        console.log(
          ` Updated notification [${type}] for passport ${passport.passport_number}`
        );
      } else {
        await Notification.create({
          passportId: passport.id,
          type,
          message,
        });
        console.log(
          `✅ Created notification [${type}] for passport ${passport.passport_number}`
        );
      }
    };

    // Process passports expiring soon
    for (const passport of passportsToExpireSoon) {
      const userName = passport?.name || "Unknown";
      const message = `${userName}'s passport (No: ${
        passport.passport_number
      }) is expiring soon on ${moment(passport.expiryDate).format(
        "DD-MM-YYYY"
      )}. Please renew it in time.`;

      await createOrUpdateNotification(passport, "Expiry Reminder", message);
    }

    // Process passports expiring in 6 months
    for (const passport of passportsToExpireIn6Months) {
      const userName = passport?.name || "Unknown";
      const message = `${userName}'s passport (No: ${
        passport.passport_number
      }) will expire on ${moment(passport.expiryDate).format(
        "DD-MM-YYYY"
      )}. Plan ahead for renewal.`;

      await createOrUpdateNotification(passport, "Expiry Reminder", message);
    }

    // Process expired passports
    for (const passport of expiredPassports) {
      const userName = passport?.name || "Unknown";
      const message = `${userName}'s passport (No: ${
        passport.passport_number
      }) has expired on ${moment(passport.expiryDate).format(
        "DD-MM-YYYY"
      )}. Immediate renewal is recommended.`;

      await createOrUpdateNotification(passport, "Expired Reminder", message);
    }
  } catch (error) {
    
  }
});
