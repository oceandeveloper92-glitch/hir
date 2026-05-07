const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const IncentiveSettingsModal = sequelize.define(
    'IncentiveSettings',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        monthYear: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        airTicketBaseAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        airTicketIncentivePercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        visaIncentivePerFileAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        minimumFileCount:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        }

    },
    {
        timestamps: true,
        tableName: 'incentive_settings',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = IncentiveSettingsModal ;