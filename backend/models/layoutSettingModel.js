const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LayoutSetting = sequelize.define(
  "LayoutSetting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    page: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    tableName: "layout_settings",
    uniqueKeys: {
      layout_unique: {
        fields: ["role", "userId", "page"],
      },
    },
  }
);

module.exports = LayoutSetting;
