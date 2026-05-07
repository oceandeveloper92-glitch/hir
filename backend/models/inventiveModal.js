const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Employee = require('./employeeModel');

const IncentiveModal = sequelize.define(
    'Incentive',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        employeeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Employee,
                key: 'id',
            },
        },
        monthYear: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        airTicketSales: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        visaFiles: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        airTicketIncentive: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        visaIncentive: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        totalIncentive: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending',
        },
        paidDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        paymentMode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'incentive',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// Association: employeeId refers to Employee
IncentiveModal.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

module.exports = IncentiveModal;