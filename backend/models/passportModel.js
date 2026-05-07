// models/Lead.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Passport = sequelize.define("Passport", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  passport_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passportCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Active",
  },
  renewProcess: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  referenceBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  leadStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  processDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  processStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  processRemark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  portalId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  portalPassword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  portalLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}
  , {
    tableName: "passports",
  });

module.exports = Passport;
