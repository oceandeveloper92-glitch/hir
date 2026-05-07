const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AirTicketModal = sequelize.define(
  "AirTicket",
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    paxName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfTravel: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tourDetails: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    dateOfBooking: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    billTo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    purchase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    refundOfPurchase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
    },
    sales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    refundOfSales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
    },
    markup: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    person: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    totalSc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pnr: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supplier: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('paid', 'received', 'pending', 'refunded', 'refund_in_process'),
        allowNull: true,
        defaultValue: 'pending',
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    type:{
        type: DataTypes.STRING,
        allowNull: true,
        enum: ['Booking', 'Cancellation'],
        defaultValue: 'Booking',
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    paymentTimeLine: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    reason: {
        type: DataTypes.TEXT,
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "air_tickets",
  }
);

AirTicketModal.afterSave(async (ticket, options) => {
    try {
        if (ticket.userId && ticket.dateOfTravel) {
            const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
            await calculateAndUpdateIncentive(ticket.userId, ticket.dateOfTravel);
        }
    } catch(e) { console.error("Error triggering incentive calc", e) }
});

AirTicketModal.afterDestroy(async (ticket, options) => {
    try {
        if (ticket.userId && ticket.dateOfTravel) {
            const { calculateAndUpdateIncentive } = require('../utils/incentiveHelper');
            await calculateAndUpdateIncentive(ticket.userId, ticket.dateOfTravel);
        }
    } catch(e) { console.error("Error triggering incentive calc", e) }
});

module.exports = AirTicketModal;
