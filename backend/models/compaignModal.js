const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CampaignModal = sequelize.define(
    "Campaign",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        dateFrom: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        dateTo: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING, // Store image path or URL
            allowNull: true,
        },
    },
    {
        tableName: "campaigns",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        tableName: "campaigns",
    }
);
module.exports = CampaignModal;