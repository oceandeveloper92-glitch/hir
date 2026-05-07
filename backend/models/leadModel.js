// models/Lead.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lead = sequelize.define(
  "Lead",
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
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "lead_sources",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "employees",
        key: "id",
      },
    },
    leadType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referenceBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "employees",
        key: "id",
      },
    },
  },
  {
    tableName: "leads",
  }
);

module.exports = Lead;
