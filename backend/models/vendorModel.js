const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Domestic", "International"]],
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
      allowNull: true,
      validate: {
        isIn: [["Active", "Inactive"]],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contacts: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isHotelVendor: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "vendors",
  }
);

module.exports = Vendor;
