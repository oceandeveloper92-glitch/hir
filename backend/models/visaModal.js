const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Visa = sequelize.define(
  "Visa",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passportNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visaFeesCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visaType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    travelers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    timeLine: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    visaMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGst: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vendorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vfsPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    visaFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    serviceCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    courierCharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clientPaymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendorPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    visaApprovalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    tableName: "visas",
  }
);

Visa.afterSave(async (visa, options) => {
    try {
        if (visa.clientPaymentDate && visa.userId) {
           const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
           await calculateAndUpdateIncentive(visa.userId, visa.clientPaymentDate);
        }
    } catch (e) { console.error("Error triggering incentive calc from visa", e) }
});

Visa.afterDestroy(async (visa, options) => {
    try {
        if (visa.clientPaymentDate && visa.userId) {
           const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
           await calculateAndUpdateIncentive(visa.userId, visa.clientPaymentDate);
        }
    } catch (e) { console.error("Error triggering incentive calc from visa", e) }
});

module.exports = Visa;
