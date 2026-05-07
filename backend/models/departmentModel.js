const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Department = sequelize.define(
  "Department",
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
    tableName: "departments",
  }
);
module.exports = Department;
