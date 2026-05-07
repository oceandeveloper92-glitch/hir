const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SiteScene = sequelize.define(
  "SiteScene",
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
    siteType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sceneName: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sceneName'
          
        );
        try {
          return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        } catch {
          return [];
        }
      },
    }
    ,
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "site_scenes",
  }
);
module.exports = SiteScene;
