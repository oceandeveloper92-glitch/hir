const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LeadSource = sequelize.define(
  "LeadSource",
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
    tableName: "lead_sources",
  }
);

module.exports = LeadSource;
