const { DataTypes} = require('sequelize');
const { sequelize } = require('../config/db');
const Employee = require('./employeeModel');
const Visa = require('./visaModal');

const VisaTravellersModal = sequelize.define(
    'VisaTravellers',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        visaId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        employeeId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        passportNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },  
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'Pending',
        },
        dateOfApproval: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        flagged: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    },
    {
        tableName: 'visa_travellers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = VisaTravellersModal;
// Association: employeeId refers to Employee
VisaTravellersModal.belongsTo(Employee, { foreignKey: 'employeeId' });
VisaTravellersModal.belongsTo(Visa, { foreignKey: 'visaId' });

VisaTravellersModal.beforeUpdate(async (traveller, options) => {
  if (traveller.changed('status') && traveller.status === 'Approved') {
   
    if (!traveller.dateOfApproval) {
      traveller.dateOfApproval = new Date();
    }
  }
});

VisaTravellersModal.afterSave(async (traveller, options) => {
    try {
        if (traveller.employeeId && traveller.visaId) {
            const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
            const visa = await Visa.findByPk(traveller.visaId);
            if (visa && visa.clientPaymentDate) {
               await calculateAndUpdateIncentive(traveller.employeeId, visa.clientPaymentDate);
            }
        }
    } catch (e) { console.error("Error triggering calc in visatravellers", e); }
});

VisaTravellersModal.afterDestroy(async (traveller, options) => {
    try {
        if (traveller.employeeId && traveller.visaId) {
            const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
            const visa = await Visa.findByPk(traveller.visaId);
            if (visa && visa.clientPaymentDate) {
               await calculateAndUpdateIncentive(traveller.employeeId, visa.clientPaymentDate);
            }
        }
    } catch (e) { console.error("Error triggering calc in visatravellers", e); }
});